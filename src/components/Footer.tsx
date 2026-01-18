"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    privacy: "Datenschutz & FAQ",
    terms: "AGB",
    contact: "Kontakt",
    imprint: "Impressum",
  },
  en: {
    privacy: "Privacy & FAQ",
    terms: "Terms",
    contact: "Contact",
    imprint: "Imprint",
  },
  it: {
    privacy: "Privacy e FAQ",
    terms: "Termini",
    contact: "Contatto",
    imprint: "Note legali",
  },
  fr: {
    privacy: "Confidentialité & FAQ",
    terms: "Conditions",
    contact: "Contact",
    imprint: "Mentions légales",
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
          <Link className="hover:underline" href="/terms">
            {t.terms}
          </Link>
          <Link className="hover:underline" href="/contact">
            {t.contact}
          </Link>
          <Link className="hover:underline" href="/imprint">
            {t.imprint}
          </Link>
        </div>
      </div>
    </footer>
  );
}
