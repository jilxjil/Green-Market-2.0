import { createHmac, randomUUID } from "crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }
  return key;
}

function getWebhookSecret() {
  return process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY ?? "";
}

export interface PaystackInitializeResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface PaystackVerifyData {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel: string | null;
  paidAt: string | null;
  metadata: Record<string, unknown> | null;
}

async function paystackRequest<T>(
  path: string,
  init?: RequestInit
): Promise<{ status: boolean; message: string; data: T }> {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json().catch(() => null)) as {
    status?: boolean;
    message?: string;
    data?: T;
  } | null;

  if (!response.ok || !payload?.status || !payload.data) {
    throw new Error(payload?.message || "Paystack request failed");
  }

  return {
    status: true,
    message: payload.message ?? "Success",
    data: payload.data,
  };
}

export function generatePaystackReference() {
  return `GM-${randomUUID()}`;
}

export async function initializeTransaction(
  email: string,
  amountInPesewas: number,
  reference: string,
  callbackUrl: string,
  metadata?: Record<string, unknown>
): Promise<PaystackInitializeResponse> {
  const { data } = await paystackRequest<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email,
      amount: amountInPesewas,
      reference,
      callback_url: callbackUrl,
      currency: "GHS",
      metadata,
    }),
  });

  return {
    authorizationUrl: data.authorization_url,
    accessCode: data.access_code,
    reference: data.reference,
  };
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyData> {
  const { data } = await paystackRequest<{
    status: string;
    reference: string;
    amount: number;
    currency: string;
    channel: string | null;
    paid_at: string | null;
    metadata: Record<string, unknown> | null;
  }>(`/transaction/verify/${encodeURIComponent(reference)}`);

  return {
    status: data.status,
    reference: data.reference,
    amount: data.amount,
    currency: data.currency,
    channel: data.channel,
    paidAt: data.paid_at,
    metadata: data.metadata,
  };
}

export function verifyWebhookSignature(body: string, signature: string | null) {
  if (!signature) {
    return false;
  }

  const secret = getWebhookSecret();
  if (!secret) {
    return false;
  }

  const hash = createHmac("sha512", secret).update(body).digest("hex");
  return hash === signature;
}

export function cedisToPesewas(amountInCedis: number) {
  return Math.round(amountInCedis * 100);
}
