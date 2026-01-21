"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    privacy: "Datenschutz & FAQ",
    webmaster: "Webmaster",
    terms: "AGB",
    contact: "Kontakt",
    imprint: "Impressum",
    demo: "Demo öffnen",
  },
  en: {
    privacy: "Privacy & FAQ",
    webmaster: "Webmaster",
    terms: "Terms",
    contact: "Contact",
    imprint: "Imprint",
    demo: "Open demo",
  },
  it: {
    privacy: "Privacy e FAQ",
    webmaster: "Webmaster",
    terms: "Termini",
    contact: "Contatto",
    imprint: "Note legali",
    demo: "Apri demo",
  },
  fr: {
    privacy: "Confidentialité & FAQ",
    webmaster: "Webmaster",
    terms: "Conditions",
    contact: "Contact",
    imprint: "Mentions légales",
    demo: "Ouvrir la démo",
  },
};

export function Footer() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} DailyCheck</div>
        <div className="flex gap-4">
          <Link className="hover:underline" href="/privacy">
            {t.privacy}
          </Link>
          <Link className="hover:underline" href="/webmaster-access">
            {t.webmaster}
          </Link>
          <Link className="hover:underline" href="/terms">
            {t.terms}
          </Link>
          <Link className="hover:underline" href="/contact">
            {t.contact}
          </Link>
          <Link className="hover:underline" href="/imprint">
            {t.imprint}
          </Link>
          <Link className="hover:underline" href="/demo-login">
            {t.demo}
          </Link>
        </div>
      </div>
    </footer>
  );
}
