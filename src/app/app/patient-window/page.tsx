"use client";

import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    label: "Patient Window",
    title: "Patient Window",
    subtitle:
      "Placeholder fuer patientenfreigegebene Daten aus der DailyCheck.ch-app. Daten werden nur geteilt, wenn Patientinnen oder Patienten aktiv zustimmen.",
    status: "Under construction",
    consentTitle: "Consent-first Datenzugriff",
    consentBody:
      "Die Uebermittlung ist optional. Es gibt keinen automatischen Datentransfer ohne ausdrueckliche Zustimmung.",
    protocolsTitle: "Protokolle (TBA)",
    protocols: [
      "Mood",
      "Sleep",
      "Drinking",
      "Calendar",
      "ABC analysis",
      "Sport",
      "Nutrition",
      "Weitere Module (TBA)",
    ],
    emptyState: "Noch keine verbundenen Patientinnen oder Patienten.",
  },
  en: {
    label: "Patient Window",
    title: "Patient Window",
    subtitle:
      "Placeholder for consented patient data from the DailyCheck.ch-app. Data is only shared when a patient explicitly opts in.",
    status: "Under construction",
    consentTitle: "Consent-first data access",
    consentBody: "Sharing is optional. No data is transferred without explicit consent.",
    protocolsTitle: "Protocols (TBA)",
    protocols: [
      "Mood",
      "Sleep",
      "Drinking",
      "Calendar",
      "ABC analysis",
      "Sport",
      "Nutrition",
      "Additional modules (TBA)",
    ],
    emptyState: "No connected patients yet.",
  },
  it: {
    label: "Patient Window",
    title: "Patient Window",
    subtitle:
      "Placeholder per dati dei pazienti con consenso dalla DailyCheck.ch-app. I dati vengono condivisi solo con consenso esplicito.",
    status: "Under construction",
    consentTitle: "Accesso dati con consenso",
    consentBody: "Condivisione opzionale. Nessun trasferimento senza consenso esplicito.",
    protocolsTitle: "Protocolli (TBA)",
    protocols: [
      "Mood",
      "Sleep",
      "Drinking",
      "Calendar",
      "ABC analysis",
      "Sport",
      "Nutrition",
      "Moduli aggiuntivi (TBA)",
    ],
    emptyState: "Nessun paziente collegato.",
  },
  fr: {
    label: "Patient Window",
    title: "Patient Window",
    subtitle:
      "Placeholder pour les donnees patients consenties depuis DailyCheck.ch-app. Les donnees ne sont partagees qu'avec consentement explicite.",
    status: "Under construction",
    consentTitle: "Acces aux donnees avec consentement",
    consentBody: "Partage optionnel. Aucun transfert sans consentement explicite.",
    protocolsTitle: "Protocoles (TBA)",
    protocols: [
      "Mood",
      "Sleep",
      "Drinking",
      "Calendar",
      "ABC analysis",
      "Sport",
      "Nutrition",
      "Modules additionnels (TBA)",
    ],
    emptyState: "Aucun patient connecte.",
  },
} as const;

function ConstructionIllustration() {
  return (
    <svg viewBox="0 0 240 140" role="img" aria-label="Under construction illustration">
      <rect x="10" y="20" width="140" height="90" rx="8" fill="#f8fafc" stroke="#cbd5f5" />
      <rect x="25" y="35" width="40" height="25" fill="#fde68a" stroke="#d4a117" />
      <rect x="75" y="35" width="40" height="25" fill="#bfdbfe" stroke="#2563eb" />
      <rect x="25" y="70" width="40" height="25" fill="#bfdbfe" stroke="#2563eb" />
      <rect x="75" y="70" width="40" height="25" fill="#fde68a" stroke="#d4a117" />
      <rect x="165" y="30" width="60" height="80" rx="6" fill="#f1f5f9" stroke="#94a3b8" />
      <rect x="175" y="40" width="40" height="10" fill="#e2e8f0" />
      <rect x="175" y="60" width="40" height="10" fill="#e2e8f0" />
      <rect x="175" y="80" width="40" height="10" fill="#e2e8f0" />
      <line x1="20" y1="120" x2="220" y2="120" stroke="#475569" strokeWidth="3" />
      <line x1="150" y1="120" x2="190" y2="20" stroke="#f97316" strokeWidth="4" />
      <circle cx="190" cy="20" r="6" fill="#f97316" />
    </svg>
  );
}

export default function PatientWindowPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              {t.label}
            </div>
            <h1 className="mt-2 text-2xl font-semibold">{t.title}</h1>
            <p className="mt-3 text-sm text-gray-700">{t.subtitle}</p>
          </div>
          <div className="w-full max-w-[240px]">
            <div className="rounded-2xl border bg-gray-50 p-4">
              <ConstructionIllustration />
            </div>
            <div className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              {t.status}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.consentTitle}</h2>
        <p className="mt-2 text-sm text-gray-700">{t.consentBody}</p>
        <div className="mt-4 rounded-xl border border-dashed px-4 py-6 text-center text-sm text-gray-500">
          {t.emptyState}
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{t.protocolsTitle}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          {t.protocols.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
