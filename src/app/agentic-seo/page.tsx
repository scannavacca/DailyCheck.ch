"use client";

import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Agentic SEO",
    intro:
      "Interne Seite fuer die Planung von Agentic SEO. Fokus: automatisierte Recherche, strukturierte Landingpages und messbare Updates.",
    flowTitle: "Arbeitsfluss",
    flowSubtitle: "Ein kurzer, steuerbarer Ablauf mit klaren Outputs.",
    steps: ["Themen-Cluster + Intent", "Briefing + Outline", "Entwurf + Review", "Publish + Monitoring"],
    outputsTitle: "Outputs",
    outputs: [
      "Content-Plan fuer 30-90 Tage",
      "Drafts fuer Landingpages und FAQ-Module",
      "On-page Checks mit Fix-Vorschlaegen",
      "Reporting-Snapshots fuer jede Iteration",
    ],
    guardrailsTitle: "Guardrails",
    guardrails: [
      "Keine medizinischen Heilversprechen",
      "Kein Patientenkontext",
      "Klare Quellenhinweise",
      "Konsistente Tonalitaet pro Region",
    ],
  },
  en: {
    title: "Agentic SEO",
    intro:
      "Internal page for planning Agentic SEO. Focus: automated research, structured landing pages, and measurable updates.",
    flowTitle: "Workflow",
    flowSubtitle: "A short, controllable flow with clear outputs.",
    steps: ["Topic clusters + intent", "Brief + outline", "Draft + review", "Publish + monitoring"],
    outputsTitle: "Outputs",
    outputs: [
      "30-90 day content plan",
      "Landing page and FAQ drafts",
      "On-page checks with fix suggestions",
      "Reporting snapshots per iteration",
    ],
    guardrailsTitle: "Guardrails",
    guardrails: [
      "No medical promises",
      "No patient context",
      "Clear source notes",
      "Consistent regional tone",
    ],
  },
  it: {
    title: "Agentic SEO",
    intro:
      "Pagina interna per pianificare Agentic SEO. Focus: ricerca automatizzata, landing page strutturate e aggiornamenti misurabili.",
    flowTitle: "Flusso",
    flowSubtitle: "Un flusso breve e controllabile con output chiari.",
    steps: ["Cluster temi + intento", "Brief + outline", "Bozza + review", "Pubblica + monitoraggio"],
    outputsTitle: "Output",
    outputs: [
      "Piano contenuti 30-90 giorni",
      "Bozze per landing page e FAQ",
      "Check on-page con suggerimenti",
      "Snapshot di report per iterazione",
    ],
    guardrailsTitle: "Guardrail",
    guardrails: [
      "Nessuna promessa medica",
      "Nessun contesto pazienti",
      "Note chiare sulle fonti",
      "Tono coerente per regione",
    ],
  },
  fr: {
    title: "Agentic SEO",
    intro:
      "Page interne pour planifier Agentic SEO. Focus: recherche automatisee, landing pages structurees et mises a jour mesurables.",
    flowTitle: "Flux",
    flowSubtitle: "Un flux court et controlable avec des outputs clairs.",
    steps: ["Clusters + intention", "Brief + plan", "Brouillon + revue", "Publication + suivi"],
    outputsTitle: "Outputs",
    outputs: [
      "Plan de contenu 30-90 jours",
      "Brouillons landing page et FAQ",
      "Checks on-page avec suggestions",
      "Snapshots de reporting par iteration",
    ],
    guardrailsTitle: "Guardrails",
    guardrails: [
      "Pas de promesses medicales",
      "Pas de contexte patient",
      "Sources clairement notees",
      "Tonalite coherente par region",
    ],
  },
} as const;

export default function AgenticSeoPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Private</div>
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-sm text-gray-700">{t.intro}</p>
      </div>

      <h2 className="text-base font-semibold">{t.flowTitle}</h2>
      <p className="text-sm text-gray-700">{t.flowSubtitle}</p>
      <div className="grid gap-3 md:grid-cols-4">
        {t.steps.map((step, index) => (
          <div key={step} className="rounded-xl border bg-white p-3">
            <div className="text-xs font-semibold text-gray-500">0{index + 1}</div>
            <div className="mt-1 text-sm font-semibold">{step}</div>
          </div>
        ))}
      </div>

      <h2 className="text-base font-semibold">{t.outputsTitle}</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
        {t.outputs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="text-base font-semibold">{t.guardrailsTitle}</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
        {t.guardrails.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
