"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useOpenAIReady } from "@/lib/useOpenAIReady";

type ChatMsg = { role: "user" | "assistant"; content: string };

type Copy = {
  title: string;
  intro: string;
  placeholder: string;
  send: string;
  temporaryNote: string;
};

const copyByLang: Record<string, Copy> = {
  de: {
    title: "Bot assistant",
    intro: "Ich bin dein Chat-Assistent. Frag mich alles, wobei ich helfen kann.",
    placeholder: "Frage eingeben...",
    send: "Senden",
    temporaryNote: "Temporäre Sitzung: keine Speicherung.",
  },
  en: {
    title: "Bot assistant",
    intro: "I am your assistant. Ask me anything you need help with.",
    placeholder: "Type a question...",
    send: "Send",
    temporaryNote: "Temporary session: no storage.",
  },
  it: {
    title: "Bot assistant",
    intro: "Sono il tuo assistente. Chiedimi pure qualsiasi cosa.",
    placeholder: "Scrivi una domanda...",
    send: "Invia",
    temporaryNote: "Sessione temporanea: nessun salvataggio.",
  },
  fr: {
    title: "Bot assistant",
    intro: "Je suis votre assistant. Posez-moi vos questions.",
    placeholder: "Saisissez une question...",
    send: "Envoyer",
    temporaryNote: "Session temporaire: aucune sauvegarde.",
  },
};

export function WellbeingFloatingChat() {
  const { language } = useLanguage();
  const t = copyByLang[language] ?? copyByLang.en;
  const ready = useOpenAIReady();

  const [open, setOpen] = useState(false);
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
    const nextMessages = [...messages, { role: "user", content: text }];
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

      const data = (await res.json()) as { reply?: string; text?: string };
      const reply = data.reply ?? data.text ?? "";
      setMessages((prev) => [...prev, { role: "assistant", content: reply || "No response." }]);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open ? (
        <div className="mb-3 h-[clamp(300px,28vh,380px)] w-[clamp(280px,25vw,360px)] overflow-hidden rounded-2xl border bg-white shadow-xl">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-sm font-semibold">{t.title}</div>
              <button
                className="rounded-full px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                Close
              </button>
            </div>

            <div className="px-4 py-2 text-[11px] text-gray-500">{t.temporaryNote}</div>

            <div className="flex-1 px-4 pb-4">
              <div className="h-[calc(100%-92px)] overflow-y-auto rounded-xl border bg-gray-50 p-3">
                <div className="space-y-2">
                  {messages.map((m, i) => (
                    <div key={`${m.role}-${i}`} className={m.role === "user" ? "text-right" : "text-left"}>
                      <div
                        className={
                          "inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-xs " +
                          (m.role === "user" ? "bg-blue-600 text-white" : "bg-white border text-gray-900")
                        }
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {error ? <div className="mt-2 text-xs text-red-600">{error}</div> : null}

              <div className="mt-3 flex items-center gap-2">
                <input
                  className="w-full rounded-xl border px-3 py-2 text-xs disabled:bg-gray-100"
                  placeholder={ready === false ? "OpenAI not configured" : t.placeholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={busy || ready === false}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") send();
                  }}
                />
                <button
                  className="rounded-xl bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-50"
                  disabled={!canSend}
                  onClick={send}
                >
                  {busy ? "..." : t.send}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-2">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open assistant chat"
          data-tour="chatbot-button"
        >
          <span className="text-2xl leading-none">+</span>
        </button>
      </div>
    </div>
  );
}
