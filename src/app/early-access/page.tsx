"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Early Access",
    subtitle: "Lassen Sie sich informieren, sobald wir starten.",
    aboutTitle: "Worum es geht",
    aboutBody:
      "DailyCheck hilft Psychiaterinnen und Psychotherapeuten, Dokumentation schneller und strukturierter zu erstellen - mit klaren Grenzen und klinischer Kontrolle.",
    dealTitle: "Early-Access-Vorteil",
    dealBody:
      "Fruehe Nutzer erhalten bessere Konditionen zum Start. Dieses Angebot ist zeitlich begrenzt.",
    formTitle: "Interesse hinterlassen",
    emailLabel: "E-Mail",
    nameLabel: "Name (optional)",
    note: "Wir melden uns, wenn der Start bereit ist.",
    submit: "Interesse senden",
    success: "Danke. Wir informieren Sie zum Start.",
    error: "Bitte eine gueltige E-Mail eingeben.",
  },
  en: {
    title: "Early Access",
    subtitle: "Get notified when we launch.",
    aboutTitle: "About the project",
    aboutBody:
      "DailyCheck helps psychiatrists and psychotherapists create documentation faster and more structured - with clear boundaries and clinician control.",
    dealTitle: "Early-access advantage",
    dealBody:
      "Early users receive better launch pricing. This offer is limited.",
    formTitle: "Leave your contact",
    emailLabel: "Email",
    nameLabel: "Name (optional)",
    note: "We will reach out when we are ready to launch.",
    submit: "Submit interest",
    success: "Thanks. We will notify you at launch.",
    error: "Please enter a valid email.",
  },
  it: {
    title: "Early Access",
    subtitle: "Ricevi un avviso al lancio.",
    aboutTitle: "Di cosa si tratta",
    aboutBody:
      "DailyCheck aiuta psichiatri e psicoterapeuti a creare documentazione piu veloce e strutturata - con confini chiari e controllo clinico.",
    dealTitle: "Vantaggio early access",
    dealBody: "I primi utenti ricevono condizioni migliori al lancio. Offerta limitata.",
    formTitle: "Lascia il contatto",
    emailLabel: "Email",
    nameLabel: "Nome (opzionale)",
    note: "Ti contatteremo quando saremo pronti al lancio.",
    submit: "Invia interesse",
    success: "Grazie. Ti informeremo al lancio.",
    error: "Inserisci un'email valida.",
  },
  fr: {
    title: "Early Access",
    subtitle: "Soyez informe au lancement.",
    aboutTitle: "A propos du projet",
    aboutBody:
      "DailyCheck aide les psychiatres et psychotherapeutes a creer une documentation plus rapide et structuree - avec des limites claires et un controle clinique.",
    dealTitle: "Avantage early access",
    dealBody: "Les premiers utilisateurs beneficient de meilleures conditions au lancement. Offre limitee.",
    formTitle: "Laisser vos coordonnees",
    emailLabel: "Email",
    nameLabel: "Nom (optionnel)",
    note: "Nous vous contacterons au lancement.",
    submit: "Envoyer",
    success: "Merci. Nous vous informerons au lancement.",
    error: "Veuillez saisir un email valide.",
  },
} as const;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function EarlyAccessPage() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.de;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError(t.error);
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border bg-white/80 p-8 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-sm text-gray-700">{t.subtitle}</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold">{t.aboutTitle}</div>
          <p className="mt-2 text-sm text-gray-700">{t.aboutBody}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold">{t.dealTitle}</div>
          <p className="mt-2 text-sm text-gray-700">{t.dealBody}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold">{t.formTitle}</div>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold text-gray-600">{t.emailLabel}</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600">{t.nameLabel}</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {error ? <div className="text-xs font-semibold text-red-600">{error}</div> : null}
          {submitted ? <div className="text-xs text-gray-600">{t.success}</div> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {t.submit}
          </button>
          <p className="text-xs text-gray-500">{t.note}</p>
        </form>
      </div>
    </div>
  );
}
