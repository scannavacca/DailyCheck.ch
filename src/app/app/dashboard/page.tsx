"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Dashboard",
    welcomeLabel: "Willkommen",
    welcomeName: "Dr. [Name]",
    welcomeBody:
      "Hier finden Sie Diktat, Vorlagen, ICD-10 Kategorien und Checklisten fuer eine strukturierte Dokumentation.",
    startTitle: "Start",
    startBody: "Neue Diktation erstellen oder Audio hochladen.",
    newDictation: "Neue Diktation",
    templates: "Vorlagen",
    recentTitle: "Letzte Dokumente (Demo)",
    recentBody:
      "Später speichern wir Entwürfe sicher mit echter Authentifizierung. Derzeit bleiben Entwürfe temporär.",
    reminder:
      "Hinweis: Dies ist ein Dokumentationsassistent. Er stellt keine Diagnose, empfiehlt keine Behandlung und ersetzt nicht die klinische Beurteilung.",
  },
  en: {
    title: "Dashboard",
    welcomeLabel: "Welcome",
    welcomeName: "Dr. [Name]",
    welcomeBody:
      "This workspace includes dictation, templates, ICD-10 categories, and checklists for structured documentation.",
    startTitle: "Start",
    startBody: "Create a new dictation or upload audio.",
    newDictation: "New dictation",
    templates: "Templates",
    recentTitle: "Recent documents (demo)",
    recentBody:
      "Later we will store drafts safely with real authentication. For now, this app keeps drafts temporary.",
    reminder:
      "Reminder: this is a documentation assistant. It does not diagnose, recommend treatment, or replace clinical judgment.",
  },
  it: {
    title: "Dashboard",
    welcomeLabel: "Welcome",
    welcomeName: "Dr. [Nome]",
    welcomeBody:
      "Qui trovi dettatura, modelli, categorie ICD-10 e checklist per una documentazione strutturata.",
    startTitle: "Inizia",
    startBody: "Crea una nuova dettatura o carica audio.",
    newDictation: "Nuova dettatura",
    templates: "Modelli",
    recentTitle: "Documenti recenti (demo)",
    recentBody:
      "In seguito salveremo le bozze in modo sicuro con autenticazione reale. Per ora, le bozze restano temporanee.",
    reminder:
      "Promemoria: questo e un assistente di documentazione. Non diagnostica, non raccomanda trattamenti e non sostituisce il giudizio clinico.",
  },
  fr: {
    title: "Tableau de bord",
    welcomeLabel: "Welcome",
    welcomeName: "Dr. [Nom]",
    welcomeBody:
      "Cet espace propose la dictee, les modeles, les categories ICD-10 et des checklists pour documenter.",
    startTitle: "Demarrer",
    startBody: "Creez une nouvelle dictee ou importez un audio.",
    newDictation: "Nouvelle dictee",
    templates: "Modeles",
    recentTitle: "Documents recents (demo)",
    recentBody:
      "Plus tard, nous stockerons les brouillons en securite avec une authentification reelle. Pour l'instant, les brouillons sont temporaires.",
    reminder:
      "Rappel : ceci est un assistant de documentation. Il ne diagnostique pas, ne recommande pas de traitement et ne remplace pas le jugement clinique.",
  },
} as const;

export default function DashboardPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase text-gray-500">{t.welcomeLabel}</div>
        <div className="mt-1 text-lg font-semibold">{t.welcomeName}</div>
        <p className="mt-2 text-sm text-gray-700">{t.welcomeBody}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">{t.startTitle}</h2>
          <p className="mt-2 text-sm text-gray-700">{t.startBody}</p>
          <div className="mt-4 flex gap-3">
            <Link
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              href="/app/new"
            >
              {t.newDictation}
            </Link>
            <Link
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              href="/app/templates"
            >
              {t.templates}
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold">{t.recentTitle}</h2>
          <p className="mt-2 text-sm text-gray-700">{t.recentBody}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500">{t.reminder}</p>
    </div>
  );
}
