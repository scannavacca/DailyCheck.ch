"use client";

import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Impressum",
    body: "Platzhalter-Impressum (in manchen Ländern erforderlich).",
  },
  en: {
    title: "Imprint",
    body: "Placeholder imprint (required in some countries).",
  },
  it: {
    title: "Note legali",
    body: "Note legali provvisorie (obbligatorie in alcuni paesi).",
  },
  fr: {
    title: "Mentions legales",
    body: "Mentions legales provisoires (requises dans certains pays).",
  },
} as const;

export default function ImprintPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-3 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <p className="text-sm text-gray-700">{t.body}</p>
    </div>
  );
}
