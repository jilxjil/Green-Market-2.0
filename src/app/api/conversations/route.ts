import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/get-current-user";
import {
  findOrCreateConsultationConversation,
  findOrCreateOrderConversation,
  getUserConversations,
} from "@/lib/conversations";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await getUserConversations(user.id);
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const orderId = body?.orderId ? String(body.orderId) : null;
  const consultationRequestId = body?.consultationRequestId
    ? String(body.consultationRequestId)
    : null;

  if (!orderId && !consultationRequestId) {
    return NextResponse.json(
      { error: "orderId or consultationRequestId is required" },
      { status: 400 }
    );
  }

  const conversation = orderId
    ? await findOrCreateOrderConversation(orderId, user.id)
    : await findOrCreateConsultationConversation(consultationRequestId!, user.id);

  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, conversation });
}
