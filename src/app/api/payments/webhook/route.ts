import { NextResponse } from "next/server";

import { completePaymentSuccess, markPaymentFailed } from "@/lib/payments";
import { verifyWebhookSignature } from "@/lib/paystack";

interface PaystackWebhookEvent {
  event: string;
  data?: {
    reference?: string;
    status?: string;
    channel?: string | null;
    paid_at?: string | null;
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: PaystackWebhookEvent;

  try {
    payload = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (payload.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = payload.data?.reference?.trim();

  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
  }

  if (payload.data?.status && payload.data.status !== "success") {
    await markPaymentFailed(reference);
    return NextResponse.json({ received: true });
  }

  const result = await completePaymentSuccess(reference, {
    channel: payload.data?.channel ?? null,
    paidAt: payload.data?.paid_at ? new Date(payload.data.paid_at) : new Date(),
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    received: true,
    alreadyProcessed: result.alreadyProcessed,
  });
}
