"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const slogansByLanguage = {
  de: [
    "Dokumentation abschließen, solange die Sitzung noch frisch ist.",
    "Weniger Abend-Adminarbeit. Mehr klinische Energie.",
    "Strukturierte Entwürfe für Verlaufseinträge, Berichte und Arztbriefe.",
    "Sie bleiben in Kontrolle - Sie genehmigen jedes Wort.",
  ],
  en: [
    "Finish documentation while the session is still fresh.",
    "Less after-hours admin work. More clinical energy.",
    "Structured drafts for Verlaufseinträge, reports, and letters.",
    "You stay in control - you approve every word.",
  ],
  it: [
    "Completa la documentazione mentre la seduta è ancora fresca.",
    "Meno lavoro amministrativo serale. Più energia clinica.",
    "Bozze strutturate per note di decorso, report e lettere mediche.",
    "Resti in controllo - approvi ogni parola.",
  ],
  fr: [
    "Terminez la documentation tant que la séance est encore fraîche.",
    "Moins d'administratif le soir. Plus d'énergie clinique.",
    "Brouillons structurés pour notes d'évolution, rapports et lettres médicales.",
    "Vous gardez le contrôle - vous approuvez chaque mot.",
  ],
} as const;

export function SloganCarousel() {
  const { language } = useLanguage();
  const slogans = slogansByLanguage[language];
  const [index, setIndex] = useState(0);
  const intervalMs = 10000;

  useEffect(() => {
    setIndex(0);
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slogans.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [slogans, intervalMs]);

  return (
    <div className="relative overflow-hidden px-1 text-center">
      <div className="relative min-h-[3rem] overflow-hidden">
        {slogans.map((slogan, i) => (
          <div
            key={`${language}-${i}`}
            className={
              "absolute inset-0 text-base font-medium text-gray-700 transition-opacity duration-700 ease-in-out md:text-lg " +
              (i === index ? "opacity-100" : "opacity-0")
            }
          >
            &quot;{slogan}&quot;
          </div>
        ))}
      </div>
    </div>
  );
}
