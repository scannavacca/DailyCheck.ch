"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useOpenAIReady } from "@/lib/useOpenAIReady";

type ChatMsg = { role: "user" | "assistant"; content: string };

const copy = {
  de: {
    title: "Assistant Chat",
    intro: "Ich bin dein Chat-Assistent. Frag mich alles, wobei ich helfen kann.",
    sessionNote: "Temporare Sitzung: Nachrichten bleiben nur in diesem Browser-Tab.",
    inputPlaceholderEnabled: "Gib eine Frage ein...",
    send: "Senden",
  },
  en: {
    title: "Assistant Chat",
    intro: "I am your assistant. Ask me anything you need help with.",
    sessionNote: "Temporary session: messages stay only in this browser tab.",
    inputPlaceholderEnabled: "Type a question...",
    send: "Send",
  },
  it: {
    title: "Chat assistente",
    intro: "Sono il tuo assistente. Chiedimi pure qualsiasi cosa.",
    sessionNote: "Sessione temporanea: i messaggi restano solo in questa scheda del browser.",
    inputPlaceholderEnabled: "Scrivi una domanda...",
    send: "Invia",
  },
  fr: {
    title: "Assistant chat",
    intro: "Je suis votre assistant. Posez-moi vos questions.",
    sessionNote: "Session temporaire : les messages restent dans cet onglet.",
    inputPlaceholderEnabled: "Saisissez une question...",
    send: "Envoyer",
  },
} as const;

export default function WellbeingPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const ready = useOpenAIReady();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: t.intro,
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !busy && ready !== false, [input, busy, ready]);

  async function send() {
    setError(null);
    const text = input.trim();
    if (!text || ready === false) return;

    setBusy(true);
    const nextMessages: ChatMsg[] = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch("/api/wellbeing-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="text-xs text-gray-500">{t.sessionNote}</div>

        <div className="mt-3 h-[420px] overflow-y-auto rounded-xl border bg-gray-50 p-3">
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={
                    "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm " +
                    (m.role === "user" ? "bg-blue-600 text-white" : "bg-white border text-gray-900")
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {error ? <div className="mt-2 text-sm text-red-600">{error}</div> : null}

        <div className="mt-3 flex gap-2">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm disabled:bg-gray-100"
              placeholder={ready === false ? "Ollama not running" : t.inputPlaceholderEnabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy || ready === false}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          <button
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
            disabled={!canSend}
            onClick={send}
          >
            {busy ? "..." : t.send}
          </button>
        </div>
      </div>
    </div>
  );
}
