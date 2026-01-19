"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logoutDemo } from "@/lib/demoAuth";
import { usePathname, useRouter } from "next/navigation";
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
    settings: "Einstellungen",
    logout: "Abmelden",
  },
  en: {
    title: "Dashboard",
    newDoc: "New documentation",
    templates: "Templates",
    icd10: "ICD-10 categories",
    checklists: "Documentation Tools",
    settings: "Settings",
    logout: "Logout",
  },
  it: {
    title: "Dashboard",
    newDoc: "Nuova documentazione",
    templates: "Modelli",
    icd10: "Categorie ICD-10",
    checklists: "Strumenti di documentazione",
    settings: "Impostazioni",
    logout: "Esci",
  },
  fr: {
    title: "Dashboard",
    newDoc: "Nouvelle documentation",
    templates: "Modeles",
    icd10: "Categories ICD-10",
    checklists: "Outils de documentation",
    settings: "Parametres",
    logout: "Deconnexion",
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const { language } = useLanguage();
  const t = copy[language];
  const pathname = usePathname();
  const showRestart = pathname?.startsWith("/app");

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
      {showRestart ? (
        <button
          type="button"
          className="fixed right-4 top-1/2 z-[55] -translate-y-1/2 rounded-full border bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-lg transition hover:border-gray-400 hover:text-gray-900 animate-pulse"
          onClick={() => {
            if (typeof window === "undefined") return;
            window.localStorage.removeItem("dailycheck_tour_seen");
            window.localStorage.setItem("dailycheck_tour_step", "0");
            window.dispatchEvent(new CustomEvent("tour-restart"));
          }}
        >
          Restart Tutorial
        </button>
      ) : null}
    </div>
  );
}
