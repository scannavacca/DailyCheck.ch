"use client";

import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Einstellungen",
    items: [
      "Sprache (später)",
      "Auto-Löschung (später)",
      "Passwort ändern (später, wenn echtes Login existiert)",
      "Überall abmelden (später)",
    ],
  },
  en: {
    title: "Settings",
    items: [
      "Language (later)",
      "Auto-delete timing (later)",
      "Change password (later, when real login exists)",
      "Logout everywhere (later)",
    ],
  },
  it: {
    title: "Impostazioni",
    items: [
      "Lingua (in seguito)",
      "Tempo di auto-eliminazione (in seguito)",
      "Cambia password (in seguito, quando esiste un login reale)",
      "Logout ovunque (in seguito)",
    ],
  },
  fr: {
    title: "Parametres",
    items: [
      "Langue (plus tard)",
      "Suppression automatique (plus tard)",
      "Changer le mot de passe (plus tard, quand un vrai login existe)",
      "Deconnexion partout (plus tard)",
    ],
  },
} as const;

export default function SettingsPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-3 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
        {t.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
