"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PrimaryButton, SecondaryButton } from "@/components/landing/Buttons";

const copy = {
  de: {
    agenticSeo: "Agentic SEO",
    pricing: "Pricing",
    clinicians: "Für Psychiater*innen",
    login: "Login",
    privacy: "Datenschutz & FAQ",
    contact: "Kontakt",
    cta: "Early Access",
    demo: "Demo öffnen",
    menu: "Menü",
  },
  en: {
    agenticSeo: "Agentic SEO",
    pricing: "Pricing",
    clinicians: "For Clinicians",
    login: "Login",
    privacy: "Privacy & FAQ",
    contact: "Contact",
    cta: "Request access",
    demo: "Open demo",
    menu: "Menu",
  },
  it: {
    agenticSeo: "Agentic SEO",
    pricing: "Pricing",
    clinicians: "Per Professionisti",
    login: "Accesso",
    privacy: "Privacy e FAQ",
    contact: "Contatto",
    cta: "Richiedi accesso",
    demo: "Apri demo",
    menu: "Menu",
  },
  fr: {
    agenticSeo: "Agentic SEO",
    pricing: "Pricing",
    clinicians: "Pour Cliniciens",
    login: "Connexion",
    privacy: "Confidentialité & FAQ",
    contact: "Contact",
    cta: "Demander l'acces",
    demo: "Ouvrir la démo",
    menu: "Menu",
  },
};

function GeminiPrismIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="gemini-prism" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7c26b" />
          <stop offset="50%" stopColor="#8ad1f6" />
          <stop offset="100%" stopColor="#b88bf1" />
        </linearGradient>
      </defs>
      <polygon points="12,3 21,9 12,21 3,9" fill="url(#gemini-prism)" />
      <polygon points="12,3 21,9 12,21 3,9" fill="none" stroke="#2a1a0f" strokeWidth="0.8" />
    </svg>
  );
}

function PricingTagIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h9l7 7-6 6-7-7V7Z"
        fill="none"
        stroke="#1b2f4a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="1.5" fill="#1b2f4a" />
    </svg>
  );
}

export function TopNav() {
  const { language } = useLanguage();
  const t = copy[language];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith("/app");
  const isLoginRoute = pathname === "/login";
  const isMuted = isAppRoute || isLoginRoute;

  return (
    <header className={`border-b ${isMuted ? "bg-white/70" : "bg-white shadow-sm"}`}>
      <div className={`mx-auto max-w-6xl px-6 ${isMuted ? "py-2" : "py-5"}`}>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`font-semibold tracking-tight ${isMuted ? "text-sm text-gray-600" : "text-base"}`}
          >
            DailyCheck
          </Link>

          <div className="flex items-center gap-3">
            <SecondaryButton href="/login" className="hidden md:inline-flex">
              {t.demo}
            </SecondaryButton>
            <PrimaryButton href="/contact" className="hidden md:inline-flex">
              {t.cta}
            </PrimaryButton>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-semibold md:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label={t.menu}
            >
              <span className="flex flex-col gap-1">
                <span className="h-0.5 w-5 bg-black" />
                <span className="h-0.5 w-5 bg-black" />
                <span className="h-0.5 w-5 bg-black" />
              </span>
            </button>
          </div>
        </div>

        <nav
          className={`mt-5 flex flex-col gap-4 md:mt-4 md:flex md:flex-row md:items-center md:justify-end ${
            open ? "flex" : "hidden"
          } ${isMuted ? "text-xs text-gray-600" : "text-sm"}`}
        >
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[color:#f7e2bf] px-3 py-1 text-xs font-semibold text-[color:#2a1a0f] shadow-sm hover:bg-[color:#f3d6a6]"
            href="/agentic-seo"
          >
            <GeminiPrismIcon />
            {t.agenticSeo}
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[color:#d9e7f7] px-3 py-1 text-xs font-semibold text-[color:#1b2f4a] shadow-sm hover:bg-[color:#c9ddf4]"
            href="/pricing"
          >
            <PricingTagIcon />
            {t.pricing}
          </Link>
          <Link className="hover:underline" href="/for-clinicians">
            {t.clinicians}
          </Link>
          <Link className="hover:underline" href="/privacy">
            {t.privacy}
          </Link>
          <Link className="hover:underline" href="/contact">
            {t.contact}
          </Link>
          <Link className="hover:underline" href="/login">
            {t.login}
          </Link>
          <PrimaryButton href="/contact" className="md:hidden">
            {t.cta}
          </PrimaryButton>
          <SecondaryButton href="/login" className="md:hidden">
            {t.demo}
          </SecondaryButton>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
