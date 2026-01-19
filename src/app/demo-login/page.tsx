"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { addDemoLoginRecord, loginDemo, setDemoFirstName } from "@/lib/demoAuth";

const copy = {
  de: {
    title: "Demo-Zugang",
    subtitle: "Kurz anmelden, sofort ins Dashboard.",
    firstNameLabel: "Vorname",
    placeholder: "Ihr Vorname",
    button: "Zum Dashboard",
    note: "Nur Vorname nötig. Keine Speicherung außerhalb dieses Browsers.",
    error: "Bitte geben Sie Ihren Vornamen ein.",
  },
  en: {
    title: "Demo access",
    subtitle: "Quick sign-in, straight to the dashboard.",
    firstNameLabel: "First name",
    placeholder: "Your first name",
    button: "Go to dashboard",
    note: "First name only. Stored locally in this browser.",
    error: "Please enter your first name.",
  },
  it: {
    title: "Accesso demo",
    subtitle: "Accesso rapido, subito alla dashboard.",
    firstNameLabel: "Nome",
    placeholder: "Il tuo nome",
    button: "Vai alla dashboard",
    note: "Solo nome. Salvato localmente in questo browser.",
    error: "Inserisci il tuo nome.",
  },
  fr: {
    title: "Acces demo",
    subtitle: "Connexion rapide, direction le tableau de bord.",
    firstNameLabel: "Prénom",
    placeholder: "Votre prénom",
    button: "Aller au tableau de bord",
    note: "Prénom uniquement. Stocké localement dans ce navigateur.",
    error: "Veuillez saisir votre prénom.",
  },
} as const;

export default function DemoLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = copy[language];
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border bg-white/90 p-8 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-sm text-gray-700">{t.subtitle}</p>
      </div>

      {error ? <div className="text-xs font-semibold text-red-600">{error}</div> : null}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-700">{t.firstNameLabel}</label>
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t.placeholder}
        />
      </div>

      <button
        className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        onClick={() => {
          const trimmed = firstName.trim();
          if (!trimmed) {
            setError(t.error);
            return;
          }
          setError(null);
          setDemoFirstName(trimmed);
          addDemoLoginRecord(trimmed);
          loginDemo();
          router.push("/app/dashboard");
        }}
      >
        {t.button}
      </button>

      <p className="text-xs text-gray-500">{t.note}</p>
    </div>
  );
}
