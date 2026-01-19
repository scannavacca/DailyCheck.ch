"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useOpenAIReady } from "@/lib/useOpenAIReady";
import { looksLikePatientCare, patientCareRefusalMessage } from "@/lib/safetyGuards";

type ChatMsg = { role: "user" | "assistant"; content: string };

type Copy = {
  title: string;
  intro: string;
  boundaries: string[];
  confirm: string;
  placeholderEnabled: string;
  placeholderDisabled: string;
  send: string;
  temporaryNote: string;
};

const copyByLang: Record<string, Copy> = {
  de: {
    title: "Bot assistant",
    intro:
      "Ich bin ein Chatbot zur Beobachtung Ihres Gesundheitslevels. Ich unterstütze Ihr persönliches Wohlbefinden (nicht die Patientenversorgung).",
    boundaries: [
      "Nur für Ihre eigene Gesundheit.",
      "Keine Patientenversorgung oder patientenspezifische Fragen.",
      "Keine Medikations- oder Diagnostikvorschläge.",
    ],
    confirm:
      "Ich bestätige: Dieser Chat ist nur für mein eigenes Wohlbefinden (nicht für Patientenversorgung).",
    placeholderEnabled: "Fragen zu Stress, Schlaf, Erholung, Gewohnheiten...",
    placeholderDisabled: "Bitte zuerst bestätigen",
    send: "Senden",
    temporaryNote: "Temporäre Sitzung: keine Speicherung.",
  },
  en: {
    title: "Bot assistant",
    intro:
      "I am a chatbot that monitors your health level and supports your personal wellbeing (not patient care).",
    boundaries: [
      "For your own health only.",
      "No patient care or patient-specific questions.",
      "No medication or diagnostic suggestions.",
    ],
    confirm: "I confirm this chat is only for my own wellbeing (not for patient care).",
    placeholderEnabled: "Ask about stress, sleep, recovery, habits...",
    placeholderDisabled: "Please confirm first",
    send: "Send",
    temporaryNote: "Temporary session: no storage.",
  },
  it: {
    title: "Bot assistant",
    intro:
      "Sono un chatbot che monitora il tuo livello di salute e supporta il tuo benessere personale (non per i pazienti).",
    boundaries: [
      "Solo per la tua salute.",
      "Niente cura dei pazienti o domande specifiche sui pazienti.",
      "Nessun suggerimento su farmaci o diagnosi.",
    ],
    confirm: "Confermo: questa chat e solo per il mio benessere (non per i pazienti).",
    placeholderEnabled: "Chiedi di stress, sonno, recupero, abitudini...",
    placeholderDisabled: "Conferma prima",
    send: "Invia",
    temporaryNote: "Sessione temporanea: nessun salvataggio.",
  },
  fr: {
    title: "Bot assistant",
    intro:
      "Je suis un chatbot qui surveille votre niveau de sante et soutient votre bien-etre personnel (pas pour les patients).",
    boundaries: [
      "Pour votre sante uniquement.",
      "Pas de soins aux patients ou de questions patient.",
      "Pas de suggestions de medicaments ou de diagnostics.",
    ],
    confirm: "Je confirme: ce chat est pour mon bien-etre (pas pour les patients).",
    placeholderEnabled: "Questions sur stress, sommeil, recuperation, habitudes...",
    placeholderDisabled: "Veuillez confirmer",
    send: "Envoyer",
    temporaryNote: "Session temporaire: aucune sauvegarde.",
  },
};

export function WellbeingFloatingChat() {
  const { language } = useLanguage();
  const t = copyByLang[language] ?? copyByLang.en;
  const ready = useOpenAIReady();

  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: t.intro,
    },
  ]);

  const canSend = useMemo(
    () => accepted && input.trim().length > 0 && !busy && ready !== false,
    [accepted, input, busy, ready]
  );

  async function send() {
    setError(null);
    const text = input.trim();
    if (!text || ready === false) return;

    if (looksLikePatientCare(text)) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: text },
        { role: "assistant", content: patientCareRefusalMessage() },
      ]);
      setInput("");
      return;
    }

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

      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
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

            <div className="px-4 py-2 text-[11px] text-gray-600">
              <div>{t.temporaryNote}</div>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {t.boundaries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <label className="mt-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>{t.confirm}</span>
              </label>
            </div>

            <div className="flex-1 px-4">
              <div className="h-full overflow-y-auto rounded-xl border bg-gray-50 p-3">
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

              <div className="mt-3 flex gap-2 pb-4">
                <input
                  className="w-full rounded-xl border px-3 py-2 text-xs disabled:bg-gray-100"
                  placeholder={
                    ready === false
                      ? "OpenAI not configured"
                      : accepted
                      ? t.placeholderEnabled
                      : t.placeholderDisabled
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!accepted || busy || ready === false}
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

      <button
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open wellbeing chat"
        data-tour="chatbot-button"
      >
        <span className="text-2xl leading-none">+</span>
      </button>
    </div>
  );
}
