"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Pricing",
    intro: "Interne Preisuebersicht. Diese Seite ist nicht fuer die Oeffentlichkeit.",
    tiersTitle: "Pakete",
    yearlyToggle: "Jährliches Abo aktivieren",
    yearlyDiscount: "-34.5% Rabatt bei Jährlichem Abo",
    yearlyActiveLabel: "Jährlich aktiv",
    yearlyActivateLabel: "Jährlich aktivieren",
    selectLabel: "Auswählen",
    tiers: [
      {
        id: "ltd",
        name: "LTD (erste 50 Käufer)",
        price: "CHF 360 (Lifetime access)",
        note: "Lebenslanger Zugang für die ersten 50 Kliniker",
        features: ["Basis-Diktat", "Vorlagen-Setup", "Monatlicher Review"],
      },
      {
        id: "monthly",
        name: "Monatliches Abo",
        price: "CHF 29 / Monat",
        note: "Flexible monatliche Zahlung",
        features: ["Alles aus LTD", "Mehrsprachige Vorlagen", "Priorisierter Support"],
      },
      {
        id: "yearly",
        name: "Jährliches Abo",
        price: "CHF 19 / Monat",
        note: "34.5% Rabatt bei jährlicher Zahlung (CHF 228 / Jahr statt CHF 348)",
        features: ["SLA + Sicherheitsreview", "Custom Workflows", "Admin Reporting"],
      },
    ],
    nextTitle: "",
    next: "",
  },
  en: {
    title: "Pricing",
    intro: "Internal pricing overview. This page is not for public viewing.",
    tiersTitle: "Plans",
    yearlyToggle: "Enable yearly plan",
    yearlyDiscount: "-25% yearly discount",
    yearlyActiveLabel: "Yearly active",
    yearlyActivateLabel: "Activate yearly",
    selectLabel: "Select",
    tiers: [
      {
        id: "ltd",
        name: "LTD (first 50 clinicians)",
        price: "CHF 360 (Lifetime access)",
        note: "Lifetime access tier for the first 50 clinicians",
        features: ["Core dictation", "Template setup", "Monthly review"],
      },
      {
        id: "monthly",
        name: "Monthly subscription",
        price: "CHF 29 / month",
        note: "Flexible monthly commitment",
        features: ["Everything in LTD", "Multilingual templates", "Priority support"],
      },
      {
        id: "yearly",
        name: "Yearly subscription",
        price: "CHF 19 / month",
        note: "34.5% discount with annual billing (CHF 228 / year instead of CHF 348)",
        features: ["SLA + security review", "Custom workflows", "Admin reporting"],
      },
    ],
    nextTitle: "",
    next: "",
  },
  it: {
    title: "Pricing",
    intro: "Panoramica prezzi interna. Questa pagina non e pubblica.",
    tiersTitle: "Pacchetti",
    yearlyToggle: "Attiva abbonamento annuale",
    yearlyDiscount: "-34.5% di sconto annuale",
    yearlyActiveLabel: "Annuale attivo",
    yearlyActivateLabel: "Attiva annuale",
    selectLabel: "Seleziona",
    tiers: [
      {
        id: "ltd",
        name: "LTD (primi 50 clinici)",
        price: "CHF 360 (a vita)",
        note: "Accesso permanente per i primi 50 clinici",
        features: ["Dettatura base", "Setup modelli", "Review mensile"],
      },
      {
        id: "monthly",
        name: "Abbonamento mensile",
        price: "CHF 29 / mese",
        note: "Impegno mensile flessibile",
        features: ["Tutto dell'LTD", "Modelli multilingua", "Supporto prioritario"],
      },
      {
        id: "yearly",
        name: "Abbonamento annuale",
        price: "CHF 19 / mese",
        note: "Sconto 34.5% con fatturazione annuale (CHF 228 / anno invece di CHF 348)",
        features: ["SLA + review sicurezza", "Workflow custom", "Reporting admin"],
      },
    ],
    nextTitle: "",
    next: "",
  },
  fr: {
    title: "Pricing",
    intro: "Vue interne des prix. Cette page ne doit pas etre publique.",
    tiersTitle: "Offres",
    yearlyToggle: "Activer l'abonnement annuel",
    yearlyDiscount: "-25% de remise annuelle",
    yearlyActiveLabel: "Annuel actif",
    yearlyActivateLabel: "Activer l'annuel",
    selectLabel: "Sélectionner",
    tiers: [
      {
        id: "ltd",
        name: "LTD (50 premiers cliniciens)",
        price: "CHF 360 (à vie)",
        note: "Accès à vie pour les 50 premiers cliniciens",
        features: ["Dictee de base", "Setup des modeles", "Revue mensuelle"],
      },
      {
        id: "monthly",
        name: "Abonnement mensuel",
        price: "CHF 29 / mois",
        note: "Engagement mensuel flexible",
        features: ["Tout de l'LTD", "Modeles multilingues", "Support prioritaire"],
      },
      {
        id: "yearly",
        name: "Abonnement annuel",
        price: "CHF 19 / mois",
        note: "Remise de 34.5% avec facturation annuelle (CHF 228 / an au lieu de CHF 348)",
        features: ["SLA + revue securite", "Workflows custom", "Reporting admin"],
      },
    ],
    nextTitle: "",
    next: "",
  },
} as const;

export default function PricingPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [yearlyActive, setYearlyActive] = useState(false);

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Private</div>
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-sm text-gray-700">{t.intro}</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-semibold">{t.tiersTitle}</h2>
        <div className="flex items-center gap-3 rounded-full border bg-white px-3 py-2 text-sm font-semibold text-gray-600">
          <span>{t.yearlyDiscount}</span>
          <button
            type="button"
            onClick={() => setYearlyActive((prev) => !prev)}
            className={`relative h-6 w-11 rounded-full border transition ${
              yearlyActive ? "border-teal-600 bg-teal-600" : "border-gray-300 bg-gray-200"
            }`}
            aria-label={t.yearlyToggle}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                yearlyActive ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {t.tiers.map((tier) => {
          const isMonthly = tier.id === "monthly";
          const isYearly = tier.id === "yearly";
          const isActive = !isYearly || yearlyActive;
          return (
          <div
            key={tier.name}
            className={`rounded-2xl border p-5 transition ${
              isMonthly
                ? "border-teal-600 bg-white shadow-md"
                : isYearly && !yearlyActive
                ? "border-gray-200 bg-gray-50 text-gray-400"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{tier.name}</div>
                <div className="text-sm text-gray-500">{tier.note}</div>
              </div>
              <div className="rounded-full bg-[color:#f2efe7] px-3 py-1 text-sm font-semibold text-gray-700">
                {tier.price}
              </div>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-gray-700">
              {tier.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="mt-4">
              <button
                type="button"
                disabled={!isActive}
                className={`w-full rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  isMonthly
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "border border-gray-300 text-gray-700 hover:border-gray-400"
                } ${
                  !isActive ? "cursor-not-allowed bg-gray-200 text-gray-400" : ""
                }`}
              >
                {isYearly
                  ? yearlyActive
                    ? t.yearlyActiveLabel
                    : t.yearlyActivateLabel
                  : t.selectLabel}
              </button>
            </div>
          </div>
        )})}
      </div>

    </div>
  );
}
