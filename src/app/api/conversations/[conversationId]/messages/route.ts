import { NextResponse } from "next/server";

import { createMessage, getConversationMessages } from "@/lib/conversations";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;
  const detail = await getConversationMessages(conversationId, user.id);

  if (!detail) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await params;
  const body = await req.json().catch(() => null);
  const messageBody = String(body?.body ?? "").trim();

  if (messageBody.length < 1 || messageBody.length > 2000) {
    return NextResponse.json(
      { error: "Message must be between 1 and 2000 characters" },
      { status: 400 }
    );
  }

  const message = await createMessage(conversationId, user.id, messageBody);

  if (!message) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, message });
}
