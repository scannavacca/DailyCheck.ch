"use client";

import { useMemo, useState } from "react";

const monthlyPrice = 29;
const yearlyTotal = 348;
const yearlyDiscountedTotal = 228;
const yearlyDiscount = 1 - yearlyDiscountedTotal / yearlyTotal;
const yearlyMonthlyPrice = Number((yearlyDiscountedTotal / 12).toFixed(2));

const plans = [
  {
    id: "ltd",
    name: "LTD (erste 50 Käufer)",
    badge: null,
    monthly: 360,
    yearly: 360,
    unit: "Lifetime access",
    billingLabel: "Lifetime access",
    note: "Lebenslanger Zugang für die ersten 50 Kliniker",
    cta: "Auswählen",
    features: ["Basis-Diktat", "Vorlagen-Setup", "Monatlicher Review"],
  },
  {
    id: "monthly",
    name: "Monatliches Abo",
    badge: null,
    monthly: monthlyPrice,
    yearly: monthlyPrice,
    unit: "pro Nutzer / Monat",
    billingLabel: "Monatlich",
    note: "Flexible monatliche Zahlung",
    cta: "Auswählen",
    features: ["Alles aus LTD", "Mehrsprachige Vorlagen", "Priorisierter Support"],
  },
  {
    id: "yearly",
    name: "Jährliches Abo",
    badge: null,
    monthly: monthlyPrice,
    yearly: yearlyMonthlyPrice,
    unit: "pro Nutzer / Monat",
    billingLabel: "Jährlich",
    note: `34.5% Rabatt bei jährlicher Zahlung (CHF ${yearlyDiscountedTotal} / Jahr statt CHF ${yearlyTotal})`,
    cta: "Auswählen",
    features: ["SLA + Sicherheitsreview", "Custom Workflows", "Admin Reporting"],
  },
] as const;

type Cycle = "monthly" | "yearly";

export function PricingSection() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const discountLabel = cycle === "yearly" ? "Spare bis zu 34.5%" : "";
  const prices = useMemo(
    () =>
      plans.map((plan) => ({
        ...plan,
        price: cycle === "monthly" ? plan.monthly : plan.yearly,
      })),
    [cycle]
  );
  const formatPrice = (value: number) => (Number.isInteger(value) ? value.toString() : value.toFixed(2));

  return (
    <div className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-6 shadow-lg backdrop-blur">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">Pricing</div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">Pläne & Preise</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-700">
            Wählen Sie den passenden Plan für Ihren klinischen Workflow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-gray-500">Monatlich</span>
          <div
            className="relative flex h-10 w-32 items-center rounded-full border border-black/10 bg-white p-1 shadow-sm transition"
            role="group"
            aria-label="Abrechnungszyklus wählen"
          >
            <button
              type="button"
              onClick={() => setCycle("monthly")}
              className={`relative flex-1 rounded-full py-2 text-sm font-semibold transition ${
                cycle === "monthly"
                  ? "bg-black text-white shadow-inner"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Monatlich
            </button>
            <button
              type="button"
              onClick={() => setCycle("yearly")}
              className={`relative flex-1 rounded-full py-2 text-sm font-semibold transition ${
                cycle === "yearly"
                  ? "bg-black text-white shadow-inner"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Jährlich
            </button>
          </div>
          {discountLabel ? (
            <span className="text-xs font-semibold text-teal-700">{discountLabel}</span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {prices.map((plan) => {
          const isMonthly = plan.id === "monthly";
          const isYearly = plan.id === "yearly";
          const isPrimaryCta = isYearly;
          return (
          <article
            key={plan.name}
            className={`flex flex-col rounded-[28px] border p-6 shadow-sm transition hover:shadow-lg ${
              plan.badge ? "border-black/20 bg-[color:#f8f5ef]" : "border-black/10 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black">{plan.name}</h3>
              {plan.badge ? (
                <span className="rounded-full border border-black/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.3em] text-gray-600">
                  {plan.badge}
                </span>
              ) : isYearly ? (
                <span className="flex items-center gap-1 rounded-full border border-black/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-700">
                  <span aria-hidden="true">&#x1F451;</span>
                  Most wanted option
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-gray-600">{plan.note}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold leading-none text-black transition-all">
                CHF {formatPrice(plan.price)}
              </span>
              <span className="text-sm font-medium text-gray-600">{plan.unit}</span>
            </div>

            <div className="mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              {plan.billingLabel}
            </div>

            <div className="mt-6 flex-1">
              <ul className="space-y-3 text-sm text-gray-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-0.5 text-teal-700" aria-hidden="true">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isPrimaryCta
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "border border-black/10 bg-white text-black hover:bg-black hover:text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </article>
        )})}
      </div>
    </div>
  );
}
