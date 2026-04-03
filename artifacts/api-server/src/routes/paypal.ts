import { Router, Request, Response } from "express";
import { sendOwnerNotification, sendClientAutoReply, paymentOwnerHtml, paymentClientHtml } from "../lib/email";

const router = Router();

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

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
  const { amount, description, currency = "USD" } = req.body as {
    amount: string | number;
    description: string;
    currency?: string;
  };

  if (!amount || !description) {
    return res.status(400).json({ error: "amount and description are required" });
  }

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
          },
        ],
      }),
    });

    if (!orderRes.ok) {
      const body = await orderRes.text();
      throw new Error(`PayPal order creation failed: ${body}`);
    }

    const order = (await orderRes.json()) as { id: string };
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
      const description = unit?.description || "NexaAgency Service";
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
          subject: "Payment confirmed — NexaAgency",
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

// GET /paypal/client-id — safely expose the public client ID to the frontend
router.get("/paypal/client-id", (_req: Request, res: Response) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({ error: "PayPal not configured" });
  }
  return res.json({ clientId });
});

export default router;
