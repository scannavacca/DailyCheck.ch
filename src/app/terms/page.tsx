"use client";

import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "AGB",
    body: "Platzhalter für Bedingungen.",
  },
  en: {
    title: "Terms",
    body: "Placeholder terms.",
  },
  it: {
    title: "Termini",
    body: "Termini provvisori.",
  },
  fr: {
    title: "Conditions",
    body: "Conditions provisoires.",
  },
} as const;

export default function TermsPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-3 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <p className="text-sm text-gray-700">{t.body}</p>
    </div>
  );
}
