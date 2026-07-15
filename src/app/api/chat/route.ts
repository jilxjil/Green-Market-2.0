import { NextResponse } from "next/server";
import { z } from "zod";

import { GREEN_MARKET_FAQ, getFaqFallback } from "@/lib/chat/faq";

const requestSchema = z.object({
  message: z.string().trim().min(2).max(1_000),
  mode: z.enum(["support", "advisor"]).default("support"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2_000),
      })
    )
    .max(8)
    .default([]),
});

const requestBuckets = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 12;

function isRateLimited(req: Request) {
  const key =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  const recent = (requestBuckets.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_WINDOW_MS
  );
  recent.push(now);
  requestBuckets.set(key, recent);
  return recent.length > RATE_LIMIT;
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object" || !("output" in payload)) return null;
  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return null;

  for (const item of output) {
    if (!item || typeof item !== "object" || !("content" in item)) continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        return (part as { text: string }).text;
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: "Too many questions. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid question." }, { status: 400 });
  }

  const { message, mode, history } = parsed.data;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ reply: getFaqFallback(message, mode), fallback: true });
  }

  const advisorRules =
    mode === "advisor"
      ? "Give cautious, practical Ghana-focused agricultural guidance. Never prescribe pesticide, veterinary, or medical dosages. State uncertainty, ask for region/crop context when useful, and recommend booking a certified expert for consequential decisions."
      : "Answer only Green Market support questions using the FAQ. If the answer is not in the FAQ, say so and direct the user to a human through Messages or the relevant dashboard.";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL || "gpt-5.6-luna",
      instructions: `You are Green Market's concise assistant. ${advisorRules}\n\nPlatform FAQ:\n${GREEN_MARKET_FAQ}`,
      input: [
        ...history.map((item) => ({ role: item.role, content: item.content })),
        { role: "user", content: message },
      ],
      max_output_tokens: 350,
    }),
  });

  const payload = await response.json().catch(() => null);
  const reply = extractOutputText(payload);
  if (!response.ok || !reply) {
    return NextResponse.json({ reply: getFaqFallback(message, mode), fallback: true });
  }

  return NextResponse.json({ reply });
}
