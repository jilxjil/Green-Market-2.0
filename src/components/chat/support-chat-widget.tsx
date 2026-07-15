"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"support" | "advisor">("support");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I can help with Green Market or general farm questions." },
  ]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;
    const history = [...messages, { role: "user" as const, content: message }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, mode, history: messages.slice(-8) }),
      });
      const data = (await response.json()) as { reply?: string; error?: string };
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply || data.error || "I couldn't answer that just now." },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "I couldn't connect. Please try again shortly." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {open && (
        <section className="mb-3 flex h-[min(560px,75vh)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
          <header className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2"><Bot className="h-5 w-5" /><span className="font-semibold">Green Market assistant</span></div>
            <button aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-md p-2 hover:bg-white/10"><X className="h-5 w-5" /></button>
          </header>
          <div className="flex gap-2 border-b p-3">
            {(["support", "advisor"] as const).map((value) => (
              <button key={value} onClick={() => setMode(value)} className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${mode === value ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{value}</button>
            ))}
          </div>
          <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <p key={index} className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-6 ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"}`}>{message.content}</p>
            ))}
            {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
          {mode === "advisor" && <p className="border-t px-4 py-2 text-xs text-muted-foreground">General guidance only. <Link href="/experts" className="font-medium text-primary underline">Book an expert</Link> for critical decisions.</p>}
          <form onSubmit={submit} className="flex gap-2 border-t p-3">
            <label htmlFor="assistant-message" className="sr-only">Ask the assistant</label>
            <input id="assistant-message" value={input} onChange={(event) => setInput(event.target.value)} maxLength={1000} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
            <button disabled={loading || !input.trim()} aria-label="Send message" className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </section>
      )}
      <button onClick={() => setOpen((value) => !value)} aria-label={open ? "Close Green Market assistant" : "Open Green Market assistant"} className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:scale-105">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
