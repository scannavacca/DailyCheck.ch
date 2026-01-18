"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useOpenAIReady } from "@/lib/useOpenAIReady";
import { looksLikePatientCare, patientCareRefusalMessage } from "@/lib/safetyGuards";

type ChatMsg = { role: "user" | "assistant"; content: string };

const copy = {
  de: {
    title: "Wellbeing-Assistent für Kliniker",
    intro:
      "Dieser Chat ist für Ihr persönliches Wohlbefinden als Kliniker. Er ist nicht für Patientenversorgung. " +
      "Ich kann bei allgemeiner Gesundheitsbildung, Stressmanagement, Schlafhygiene und Hinweisen helfen, wann professionelle Hilfe sinnvoll ist. " +
      "Verstehen Sie ihn als Gesprächsbegleiter, ähnlich einer Balint-Gruppe.",
    boundariesTitle: "Wichtige Grenzen",
    boundaries: [
      "Nur für Ihre eigene Gesundheit und Ihr Wohlbefinden.",
      "Keine Patientenversorgung: keine Diagnose, Risikoeinschätzung oder Behandlungsempfehlungen für Patienten.",
      "Keine Medikationsvorschläge oder Verordnungshinweise.",
      "Keine patientenbezogenen oder identifizierenden Informationen.",
      "Ersetzt keine medizinische Beratung für Sie; bei Bedarf professionelle Hilfe suchen.",
    ],
    confirm:
      "Ich bestätige, dass ich diesen Chat nur für mein eigenes Wohlbefinden nutze (nicht für Patientenversorgung).",
    sessionNote: "Temporäre Sitzung: Nachrichten bleiben nur in diesem Browser-Tab (keine Speicherung).",
    inputPlaceholderEnabled: "Fragen Sie zu Ihrem Schlaf, Stress, Bewegung, Routinen...",
    inputPlaceholderDisabled: "Bitte Checkbox aktivieren, um den Chat zu nutzen",
    send: "Senden",
    patientCareBlock: patientCareRefusalMessage(),
  },
  en: {
    title: "Clinician Wellbeing Assistant",
    intro:
      "This chat is for your personal wellbeing as a clinician. It is not for patient care. " +
      "I can help with general health education, stress management, sleep hygiene, and guidance on when to seek professional care. " +
      "Use it as a supportive chat companion, similar to a Balint group.",
    boundariesTitle: "Important boundaries",
    boundaries: [
      "For your own health and wellbeing only.",
      "No patient care: no diagnosis, risk assessment, or treatment recommendations for patients.",
      "No medication suggestions or prescribing guidance.",
      "Do not include patient-identifying information.",
      "This does not replace professional medical advice for you; seek care when appropriate.",
    ],
    confirm: "I confirm I will use this chat for my own wellbeing only (not for patient care).",
    sessionNote: "Temporary session: messages are kept only in this browser tab (no saving yet).",
    inputPlaceholderEnabled: "Ask about your own sleep, stress, exercise, habits...",
    inputPlaceholderDisabled: "Tick the checkbox to enable chat",
    send: "Send",
    patientCareBlock: patientCareRefusalMessage(),
  },
  it: {
    title: "Assistente di benessere per clinici",
    intro:
      "Questa chat e per il tuo benessere personale come clinico. Non e per la cura dei pazienti. " +
      "Posso aiutare con educazione generale alla salute, gestione dello stress, igiene del sonno e indicazioni su quando cercare aiuto professionale. " +
      "Usala come compagno di dialogo di supporto, simile a un gruppo Balint.",
    boundariesTitle: "Limiti importanti",
    boundaries: [
      "Solo per la tua salute e il tuo benessere.",
      "Nessuna cura dei pazienti: niente diagnosi, valutazioni di rischio o raccomandazioni di trattamento per pazienti.",
      "Nessun suggerimento su farmaci o prescrizioni.",
      "Non inserire informazioni identificative dei pazienti.",
      "Non sostituisce il parere medico professionale per te; cerca assistenza quando necessario.",
    ],
    confirm: "Confermo che usero questa chat solo per il mio benessere (non per la cura dei pazienti).",
    sessionNote: "Sessione temporanea: i messaggi restano solo in questa scheda del browser (nessun salvataggio).",
    inputPlaceholderEnabled: "Chiedi di sonno, stress, esercizio, abitudini...",
    inputPlaceholderDisabled: "Seleziona la casella per abilitare la chat",
    send: "Invia",
    patientCareBlock: patientCareRefusalMessage(),
  },
  fr: {
    title: "Assistant bien-etre pour cliniciens",
    intro:
      "Ce chat est pour votre bien-etre personnel en tant que clinicien. Il n'est pas pour les soins aux patients. " +
      "Je peux aider avec l'education generale a la sante, la gestion du stress, l'hygiene du sommeil et des indications sur quand consulter. " +
      "Utilisez-le comme compagnon de discussion de soutien, similaire a un groupe Balint.",
    boundariesTitle: "Limites importantes",
    boundaries: [
      "Pour votre sante et bien-etre uniquement.",
      "Pas de soins aux patients : pas de diagnostic, d'evaluation du risque ou de recommandations de traitement pour des patients.",
      "Pas de suggestions de medicaments ou de prescriptions.",
      "Ne pas inclure d'informations identifiantes sur des patients.",
      "Cela ne remplace pas un avis medical professionnel pour vous ; consultez si necessaire.",
    ],
    confirm: "Je confirme utiliser ce chat pour mon propre bien-etre uniquement (pas pour les soins aux patients).",
    sessionNote: "Session temporaire : les messages restent dans cet onglet (pas de sauvegarde).",
    inputPlaceholderEnabled: "Posez des questions sur votre sommeil, stress, activite, habitudes...",
    inputPlaceholderDisabled: "Cochez la case pour activer le chat",
    send: "Envoyer",
    patientCareBlock: patientCareRefusalMessage(),
  },
} as const;

export default function WellbeingPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const ready = useOpenAIReady();
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
        {
          role: "assistant",
          content: t.patientCareBlock,
        },
      ]);
      setInput("");
      return;
    }

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
        <div className="text-sm font-semibold">{t.boundariesTitle}</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          {t.boundaries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <label className="mt-3 flex items-start gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            className="mt-1"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          {t.confirm}
        </label>
      </div>

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
            placeholder={
              ready === false
                ? "OpenAI not configured"
                : accepted
                ? t.inputPlaceholderEnabled
                : t.inputPlaceholderDisabled
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!accepted || busy || ready === false}
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
