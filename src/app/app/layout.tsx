"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLoggedIn, logoutDemo } from "@/lib/demoAuth";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { WellbeingFloatingChat } from "@/components/WellbeingFloatingChat";

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

  useEffect(() => {
    const logged = isLoggedIn();
    setOk(logged);
    if (!logged) router.push("/login");
  }, [router]);

  if (!ok) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="font-semibold">{t.title}</div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link className="hover:underline" href="/app/new">
              {t.newDoc}
            </Link>
            <Link className="hover:underline" href="/app/templates">
              {t.templates}
            </Link>
            <Link className="hover:underline" href="/app/icd10">
              {t.icd10}
            </Link>
            <Link className="hover:underline" href="/app/checklists">
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
    </div>
  );
}
