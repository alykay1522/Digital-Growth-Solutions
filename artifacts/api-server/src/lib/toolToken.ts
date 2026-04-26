import crypto from "crypto";

const TOKEN_VALIDITY_MS = 24 * 60 * 60 * 1000;

function getSigningKey(): string {
  const base = process.env.PAYPAL_CLIENT_SECRET;
  if (!base) throw new Error("Signing key not available — PAYPAL_CLIENT_SECRET is not configured");
  return `tool-token-signing:${base}`;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSigningKey()).update(payload).digest("hex");
}

export function issueToolToken(toolKey: string, orderId: string): string {
  const expiresAt = Date.now() + TOKEN_VALIDITY_MS;
  const payload = JSON.stringify({ toolKey, orderId, expiresAt });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = sign(b64);
  return `${b64}.${sig}`;
}

export interface ToolTokenPayload {
  toolKey: string;
  orderId: string;
  expiresAt: number;
}

export function verifyToolToken(token: string, expectedToolKey: string): ToolTokenPayload | null {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex < 1) return null;
    const b64 = token.slice(0, dotIndex);
    const sig = token.slice(dotIndex + 1);
    const expectedSig = sign(b64);
    const sigBuf = Buffer.from(sig, "hex");
    const expectedSigBuf = Buffer.from(expectedSig, "hex");
    if (sigBuf.length !== expectedSigBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedSigBuf)) return null;
    const payload: ToolTokenPayload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));
    if (payload.toolKey !== expectedToolKey) return null;
    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}
