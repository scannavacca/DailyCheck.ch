"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logoutDemo } from "@/lib/demoAuth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { WellbeingFloatingChat } from "@/components/WellbeingFloatingChat";
import { AppTutorial } from "@/components/AppTutorial";

const copy = {
  de: {
    title: "Dashboard",
    newDoc: "Neue Dokumentation",
    templates: "Vorlagen",
    icd10: "ICD-10 Kategorien",
    checklists: "Dokumentations-Tools",
    patientWindow: "Patient Window",
    settings: "Einstellungen",
    logout: "Abmelden",
  },
  en: {
    title: "Dashboard",
    newDoc: "New documentation",
    templates: "Templates",
    icd10: "ICD-10 categories",
    checklists: "Documentation Tools",
    patientWindow: "Patient Window",
    settings: "Settings",
    logout: "Logout",
  },
  it: {
    title: "Dashboard",
    newDoc: "Nuova documentazione",
    templates: "Modelli",
    icd10: "Categorie ICD-10",
    checklists: "Strumenti di documentazione",
    patientWindow: "Patient Window",
    settings: "Impostazioni",
    logout: "Esci",
  },
  fr: {
    title: "Dashboard",
    newDoc: "Nouvelle documentation",
    templates: "Modeles",
    icd10: "Categories ICD-10",
    checklists: "Outils de documentation",
    patientWindow: "Patient Window",
    settings: "Parametres",
    logout: "Deconnexion",
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const { language } = useLanguage();
  const t = copy[language];

  useEffect(() => {
    const logged = isLoggedIn();
    setOk(logged);
    if (!logged) router.push("/login");
  }, [router]);

  if (!ok) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-amber-50 via-white to-sky-50 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            {t.title}
          </div>
          <nav
            className="flex flex-wrap gap-4 text-base font-medium text-gray-800"
            data-tour="dashboard-menu"
          >
            <Link
              className="hover:underline"
              href="/app/new"
              data-tour="nav-new-doc"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("tour-advance", { detail: "new-doc" }));
              }}
            >
              {t.newDoc}
            </Link>
            <Link className="hover:underline" href="/app/templates" data-tour="nav-templates">
              {t.templates}
            </Link>
            <Link className="hover:underline" href="/app/icd10" data-tour="nav-icd10">
              {t.icd10}
            </Link>
            <Link className="hover:underline" href="/app/checklists" data-tour="nav-checklists">
              {t.checklists}
            </Link>
            <Link className="hover:underline" href="/app/patient-window" data-tour="nav-patient-window">
              {t.patientWindow}
            </Link>
            <Link className="hover:underline" href="/app/settings">
              {t.settings}
            </Link>
            <button
              className="text-red-600 hover:underline"
              onClick={() => {
                logoutDemo();
                router.push("/");
              }}
            >
              {t.logout}
            </button>
          </nav>
        </div>
      </div>

      {children}
      <WellbeingFloatingChat />
      <AppTutorial />
    </div>
  );
}
