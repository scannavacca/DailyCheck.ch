"use client";

import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Kontakt",
    intro: "Erzählen Sie uns kurz von Ihrer Praxis und Ihrem Ziel. Wir antworten in 1-2 Werktagen.",
    labels: {
      name: "Vollständiger Name",
      role: "Rolle",
      clinic: "Klinik / Praxis",
      email: "E-Mail (dienstlich)",
      improve: "Was möchten Sie verbessern?",
      message: "Nachricht",
    },
    placeholders: {
      name: "Dr. Jane Doe",
      clinic: "Name der Praxis",
      email: "name@praxis.ch",
      message: "Beschreiben Sie Ihren aktuellen Dokumentations-Workflow und wie wir helfen können.",
    },
    roles: ["Psychiater", "Psychotherapeut", "Klinischer Psychologe", "Praxismanager", "Sonstiges"],
    improvements: [
      "Schnellere Dokumentation",
      "Konsistentere Vorlagen",
      "Weniger Verwaltungsaufwand",
      "Besserer Diktat-Workflow",
      "Etwas anderes",
    ],
    footer: "Lieber per E-Mail? Schreiben Sie an info@dailycheck.ch. Unsere Domain ist www.dailycheck.ch.",
    button: "Nachricht senden",
  },
  en: {
    title: "Contact",
    intro: "Tell us a bit about your practice and what you want to achieve. We respond within 1-2 business days.",
    labels: {
      name: "Full name",
      role: "Role",
      clinic: "Clinic / Practice",
      email: "Work email",
      improve: "What are you looking to improve?",
      message: "Message",
    },
    placeholders: {
      name: "Dr. Jane Doe",
      clinic: "Clinic name",
      email: "name@clinic.ch",
      message: "Tell us about your current documentation workflow and how we can help.",
    },
    roles: ["Psychiatrist", "Psychotherapist", "Clinical psychologist", "Practice manager", "Other"],
    improvements: [
      "Faster documentation",
      "More consistent templates",
      "Less admin workload",
      "Better dictation workflow",
      "Something else",
    ],
    footer: "Prefer email? Contact us at info@dailycheck.ch. Our domain is www.dailycheck.ch.",
    button: "Send message",
  },
  it: {
    title: "Contatto",
    intro: "Raccontaci qualcosa della tua pratica e di cio che vuoi ottenere. Rispondiamo entro 1-2 giorni lavorativi.",
    labels: {
      name: "Nome completo",
      role: "Ruolo",
      clinic: "Clinica / Studio",
      email: "Email di lavoro",
      improve: "Cosa vuoi migliorare?",
      message: "Messaggio",
    },
    placeholders: {
      name: "Dott.ssa Jane Doe",
      clinic: "Nome della clinica",
      email: "nome@clinica.ch",
      message: "Descrivi il tuo attuale flusso di documentazione e come possiamo aiutarti.",
    },
    roles: ["Psichiatra", "Psicoterapeuta", "Psicologo clinico", "Responsabile di studio", "Altro"],
    improvements: [
      "Documentazione piu veloce",
      "Modelli piu coerenti",
      "Meno lavoro amministrativo",
      "Workflow di dettatura migliore",
      "Qualcos'altro",
    ],
    footer: "Preferisci l'email? Scrivici a info@dailycheck.ch. Il nostro dominio e www.dailycheck.ch.",
    button: "Invia messaggio",
  },
  fr: {
    title: "Contact",
    intro: "Parlez-nous de votre pratique et de ce que vous souhaitez ameliorer. Nous repondons sous 1-2 jours ouvres.",
    labels: {
      name: "Nom complet",
      role: "Role",
      clinic: "Clinique / Cabinet",
      email: "Email professionnel",
      improve: "Que souhaitez-vous ameliorer ?",
      message: "Message",
    },
    placeholders: {
      name: "Dr Jane Doe",
      clinic: "Nom du cabinet",
      email: "nom@cabinet.ch",
      message: "Decrivez votre flux de documentation actuel et comment nous pouvons aider.",
    },
    roles: [
      "Psychiatre",
      "Psychotherapeute",
      "Psychologue clinicien",
      "Gestionnaire de cabinet",
      "Autre",
    ],
    improvements: [
      "Documentation plus rapide",
      "Modeles plus coherents",
      "Moins de charge administrative",
      "Meilleur flux de dictee",
      "Autre",
    ],
    footer: "Vous preferez l'email ? Ecrivez-nous a info@dailycheck.ch. Notre domaine est www.dailycheck.ch.",
    button: "Envoyer le message",
  },
} as const;

export default function ContactPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      <p className="text-sm text-gray-700">{t.intro}</p>

      <form className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">{t.labels.name}</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder={t.placeholders.name} />
          </div>
          <div>
            <label className="text-sm font-semibold">{t.labels.role}</label>
            <select className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">
              {t.roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">{t.labels.clinic}</label>
            <input className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" placeholder={t.placeholders.clinic} />
          </div>
          <div>
            <label className="text-sm font-semibold">{t.labels.email}</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              type="email"
              placeholder={t.placeholders.email}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">{t.labels.improve}</label>
          <select className="mt-1 w-full rounded-xl border px-3 py-2 text-sm">
            {t.improvements.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold">{t.labels.message}</label>
          <textarea
            className="mt-1 h-36 w-full rounded-xl border px-3 py-2 text-sm"
            placeholder={t.placeholders.message}
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-gray-500">{t.footer}</p>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {t.button}
          </button>
        </div>
      </form>
    </div>
  );
}
