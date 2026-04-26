import { Router, Request, Response } from "express";
import { sendOwnerNotification, sendClientAutoReply, paymentOwnerHtml, paymentClientHtml } from "../lib/email";
import { issueToolToken } from "../lib/toolToken";
import { getDb } from "../lib/db";

const router = Router();

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

const TOOL_CATALOG: Record<string, { name: string; price: string }> = {
  "site-cloner": { name: "Site Cloner", price: "9.99" },
  "product-sniffer": { name: "Product Sniffer", price: "9.99" },
};

const pendingOrders = new Map<string, { toolKey: string; amount: string; createdAt: number }>();
const PENDING_ORDER_TTL_MS = 30 * 60 * 1000;

function cleanupPendingOrders() {
  const cutoff = Date.now() - PENDING_ORDER_TTL_MS;
  for (const [id, entry] of pendingOrders) {
    if (entry.createdAt < cutoff) pendingOrders.delete(id);
  }
}

async function ensureEntitlementsTable() {
  const db = getDb();
  await db.query(`
    CREATE TABLE IF NOT EXISTS tool_entitlements (
      order_id TEXT PRIMARY KEY,
      tool_key TEXT NOT NULL,
      issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal auth failed: ${body}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// POST /paypal/create-order
router.post("/paypal/create-order", async (req: Request, res: Response) => {
  const { amount, description, toolKey } = req.body as {
    amount: string | number;
    description: string;
    toolKey?: string;
  };

  if (!amount || !description) {
    return res.status(400).json({ error: "amount and description are required" });
  }

  if (toolKey && !TOOL_CATALOG[toolKey]) {
    return res.status(400).json({ error: "Invalid toolKey" });
  }

  if (toolKey) {
    const expected = TOOL_CATALOG[toolKey];
    const requestedAmount = Number(amount).toFixed(2);
    if (requestedAmount !== expected.price) {
      return res.status(400).json({ error: "Amount does not match the tool price" });
    }
  }

  const currency = "USD";

  try {
    const token = await getAccessToken();

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: String(Number(amount).toFixed(2)),
            },
            description,
            custom_id: toolKey || "",
          },
        ],
      }),
    });

    if (!orderRes.ok) {
      const body = await orderRes.text();
      throw new Error(`PayPal order creation failed: ${body}`);
    }

    const order = (await orderRes.json()) as { id: string };

    if (toolKey) {
      cleanupPendingOrders();
      pendingOrders.set(order.id, {
        toolKey,
        amount: String(Number(amount).toFixed(2)),
        createdAt: Date.now(),
      });
    }

    return res.json({ id: order.id });
  } catch (err: any) {
    const isNotConfigured = err.message?.includes("not configured");
    return res.status(isNotConfigured ? 503 : 500).json({
      error: err.message || "Failed to create PayPal order",
    });
  }
});

// POST /paypal/capture-order/:orderId
router.post("/paypal/capture-order/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const token = await getAccessToken();

    const captureRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!captureRes.ok) {
      const body = await captureRes.text();
      throw new Error(`PayPal capture failed: ${body}`);
    }

    const captureData = await captureRes.json() as any;

    // Fire email notifications (non-blocking)
    try {
      const unit = captureData?.purchase_units?.[0];
      const amount = unit?.payments?.captures?.[0]?.amount?.value || "?";
      const description = unit?.description || "Digital Growth Solutions Agency Service";
      const payer = captureData?.payer;
      const payerName = payer ? `${payer.name?.given_name || ""} ${payer.name?.surname || ""}`.trim() : undefined;
      const payerEmail = payer?.email_address;

      Promise.all([
        sendOwnerNotification({
          subject: `💰 Payment received — $${amount}`,
          html: paymentOwnerHtml({ orderId, amount, description, payerName, payerEmail }),
        }),
        payerEmail ? sendClientAutoReply({
          to: payerEmail,
          name: payerName || "there",
          subject: "Payment confirmed — Digital Growth Solutions Agency",
          html: paymentClientHtml({ payerName: payerName || "there", amount, description, orderId }),
        }) : Promise.resolve(),
      ]).catch(() => {});
    } catch (_) {}

    return res.json(captureData);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "Failed to capture PayPal order",
    });
  }
});

// POST /paypal/issue-token — verify a completed PayPal order and issue a signed tool-access token
router.post("/paypal/issue-token", async (req: Request, res: Response) => {
  const { orderId, toolKey } = req.body as { orderId: string; toolKey: string };

  if (!orderId || !toolKey || !TOOL_CATALOG[toolKey]) {
    return res.status(400).json({ error: "orderId and a valid toolKey are required" });
  }

  const expectedTool = TOOL_CATALOG[toolKey];

  try {
    await ensureEntitlementsTable();
    const db = getDb();

    const existing = await db.query(
      "SELECT order_id FROM tool_entitlements WHERE order_id = $1",
      [orderId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "This order has already been used to unlock a tool" });
    }

    const ppToken = await getAccessToken();
    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${ppToken}` },
    });

    if (!orderRes.ok) {
      return res.status(402).json({ error: "Could not verify PayPal order" });
    }

    const order = (await orderRes.json()) as any;

    if (order.status !== "COMPLETED") {
      return res.status(402).json({ error: "Payment has not been completed" });
    }

    const unit = order.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    const capturedAmount = capture?.amount?.value;
    const capturedCurrency = capture?.amount?.currency_code;
    const customId = unit?.custom_id;

    if (capturedAmount !== expectedTool.price) {
      return res.status(402).json({ error: "Order amount does not match the tool price" });
    }

    if (capturedCurrency !== "USD") {
      return res.status(402).json({ error: "Order currency does not match the required currency" });
    }

    if (customId !== toolKey) {
      return res.status(403).json({ error: "This order was not created for the requested tool" });
    }

    const pending = pendingOrders.get(orderId);
    if (pending && pending.toolKey !== toolKey) {
      return res.status(403).json({ error: "This order was not created for the requested tool" });
    }

    await db.query(
      "INSERT INTO tool_entitlements (order_id, tool_key) VALUES ($1, $2)",
      [orderId, toolKey]
    );

    pendingOrders.delete(orderId);

    const accessToken = issueToolToken(toolKey, orderId);
    return res.json({ token: accessToken });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to issue token" });
  }
});

// GET /paypal/client-id — safely expose the public client ID to the frontend
router.get("/paypal/client-id", (_req: Request, res: Response) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({ error: "PayPal not configured" });
  }
  return res.json({ clientId });
});

export default router;
