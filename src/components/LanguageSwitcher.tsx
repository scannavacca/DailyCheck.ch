"use client";

import { useState } from "react";
import { languageLabels, languageNames, languages } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-2 rounded-xl border bg-white px-2.5 py-1 text-xs font-semibold hover:bg-gray-50"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a16 16 0 0 1 0 18" />
          <path d="M12 3a16 16 0 0 0 0 18" />
        </svg>
        <span>{languageLabels[language]}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl border bg-white p-1 shadow-sm">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold hover:bg-gray-50 ${
                lang === language ? "bg-gray-50" : ""
              }`}
              type="button"
              onClick={() => {
                setLanguage(lang);
                setOpen(false);
              }}
            >
              <span>{languageLabels[lang]}</span>
              <span className="text-[11px] text-gray-700">{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
