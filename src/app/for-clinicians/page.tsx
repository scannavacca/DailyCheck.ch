"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { SecondaryButton } from "@/components/landing/Buttons";

const copy = {
  de: {
    title: "Für Therapeuten / Psychiater",
    intro:
      "Dies ist ein klinischer Dokumentationsassistent für psychiatrische und psychotherapeutische Praxis. Sie bleiben jederzeit vollständig in Kontrolle.",
    flowTitle: "So funktioniert es",
    flowSubtitle: "Drei klare Schritte - ohne Umwege.",
    flowSteps: ["Audio diktieren oder hochladen", "Vorlage auswählen", "Prüfen, kopieren, fertig"],
    comparisonTitle: "Vorher vs. Nachher",
    comparisonSubtitle: "Kurz, klar, ohne Zusatzaufwand.",
    comparisonBeforeTitle: "Vorher",
    comparisonBefore: ["Unstrukturierte Notizen", "Abends Berichte schreiben", "Copy/paste Chaos"],
    comparisonAfterTitle: "Nachher",
    comparisonAfter: ["Strukturierter Entwurf", "5-10 Min. Nacharbeit", "In Ihre Vorlage kopiert"],
    supportsTitle: "Was es unterstützt",
    supports: [
      "Diktat nach Sitzungen",
      "Optionale Transkription von Sitzungen",
      "Strukturierung in Ihre bevorzugten Vorlagen",
      "Schnelleres Abschließen von Notizen und Berichten",
    ],
    notTitle: "Was es nicht tut",
    not: [
      "Es stellt keine Diagnose",
      "Es empfiehlt keine Behandlungen",
      "Es ersetzt keine klinische Beurteilung",
      "Es erstellt keine finalen Dokumente ohne Ihre Prüfung",
    ],
    whyTitle: "Warum Kliniker es nutzen",
    whySubtitle: "Weniger Abend-Admin, mehr therapeutische Präsenz.",
    whyItems: [
      "Strukturierter Entwurf im klinischen Format",
      "Ihr Stil bleibt erhalten (Sie bearbeiten den Entwurf)",
      "Weniger Abend- und Wochenend-Admin",
    ],
    privacyTitle: "Datenschutz & Vertrauen",
    privacySubtitle: "Kurze Antworten auf die wichtigsten Fragen.",
    privacyCards: [
      {
        title: "Audio-Handling",
        body: "Audio wird nur fuer die Transkription genutzt und danach geloescht (empfohlen).",
      },
      {
        title: "Entwurf statt Automatik",
        body: "Ausgabe ist ein Entwurf. Sie pruefen, bearbeiten und uebernehmen.",
      },
      {
        title: "Nicht gespeichert",
        body: "Text wird nicht gespeichert und dient nur als Entwurf.",
      },
    ],
    privacyLink: "Datenschutz & FAQ lesen",
  },
  en: {
    title: "For Therapists / Psychiatrists",
    intro:
      "This is a clinical documentation assistant designed for psychiatric and psychotherapeutic practice. You remain fully in control at all times.",
    flowTitle: "How it works",
    flowSubtitle: "Three clear steps, no detours.",
    flowSteps: ["Dictate or upload audio", "Choose your template", "Review, copy, done"],
    comparisonTitle: "Before vs after",
    comparisonSubtitle: "Short, clear, no extra admin.",
    comparisonBeforeTitle: "Before",
    comparisonBefore: ["Unstructured notes", "Evening report writing", "Copy/paste chaos"],
    comparisonAfterTitle: "After",
    comparisonAfter: ["Structured draft", "5-10 min. polish", "Copied into your template"],
    supportsTitle: "What it supports",
    supports: [
      "Dictation after sessions",
      "Optional transcription of sessions",
      "Structuring into your preferred templates",
      "Faster completion of notes and reports",
    ],
    notTitle: "What it does not do",
    not: [
      "It does not diagnose",
      "It does not suggest treatments",
      "It does not replace clinical judgment",
      "It does not create final documents without your review",
    ],
    whyTitle: "Why clinicians use it",
    whySubtitle: "Less after-hours admin, more clinical presence.",
    whyItems: [
      "Structured draft in clinical format",
      "Your style stays intact (you edit the draft)",
      "Less evening and weekend admin",
    ],
    privacyTitle: "Privacy & trust",
    privacySubtitle: "Short answers to the essential questions.",
    privacyCards: [
      {
        title: "Audio handling",
        body: "Audio is used only for transcription and deleted afterward (recommended).",
      },
      {
        title: "Draft, not automation",
        body: "The output is a draft. You review, edit, and adopt it.",
      },
      {
        title: "Not stored",
        body: "Text is not stored and serves only as a draft.",
      },
    ],
    privacyLink: "Read privacy & FAQ",
  },
  it: {
    title: "Per Terapisti / Psichiatri",
    intro:
      "Questo e un assistente di documentazione clinica progettato per la pratica psichiatrica e psicoterapeutica. Rimani pienamente in controllo in ogni momento.",
    flowTitle: "Come funziona",
    flowSubtitle: "Tre step chiari, senza deviazioni.",
    flowSteps: ["Detta o carica audio", "Scegli il modello", "Rivedi, copia, fatto"],
    comparisonTitle: "Prima vs dopo",
    comparisonSubtitle: "Breve, chiaro, senza extra.",
    comparisonBeforeTitle: "Prima",
    comparisonBefore: ["Note non strutturate", "Report serali", "Caos copia/incolla"],
    comparisonAfterTitle: "Dopo",
    comparisonAfter: ["Bozza strutturata", "5-10 min. di revisione", "Copiato nel tuo modello"],
    supportsTitle: "Cosa supporta",
    supports: [
      "Dettatura dopo le sedute",
      "Trascrizione opzionale delle sedute",
      "Strutturazione nei tuoi modelli preferiti",
      "Completamento piu rapido di note e report",
    ],
    notTitle: "Cosa non fa",
    not: [
      "Non fa diagnosi",
      "Non suggerisce trattamenti",
      "Non sostituisce il giudizio clinico",
      "Non crea documenti finali senza la tua revisione",
    ],
    whyTitle: "Perché i clinici lo usano",
    whySubtitle: "Meno amministrazione serale, più presenza clinica.",
    whyItems: [
      "Bozza strutturata in formato clinico",
      "Il tuo stile resta intatto (modifichi la bozza)",
      "Meno lavoro serale e nei weekend",
    ],
    privacyTitle: "Privacy e fiducia",
    privacySubtitle: "Risposte brevi alle domande chiave.",
    privacyCards: [
      {
        title: "Gestione dell'audio",
        body: "L'audio è usato solo per la trascrizione e poi eliminato (consigliato).",
      },
      {
        title: "Bozza, non automazione",
        body: "L'output è una bozza. La rivedi, la modifichi e la usi.",
      },
      {
        title: "Non salvato",
        body: "Il testo non viene salvato e serve solo come bozza.",
      },
    ],
    privacyLink: "Leggi privacy & FAQ",
  },
  fr: {
    title: "Pour Therapeutes / Psychiatres",
    intro:
      "Ceci est un assistant de documentation clinique concu pour la pratique psychiatrique et psychotherapeutique. Vous restez pleinement aux commandes a tout moment.",
    flowTitle: "Comment ca marche",
    flowSubtitle: "Trois etapes nettes, sans detour.",
    flowSteps: ["Dicter ou importer l'audio", "Choisir votre modele", "Relire, copier, termine"],
    comparisonTitle: "Avant vs apres",
    comparisonSubtitle: "Court, clair, sans surcharge.",
    comparisonBeforeTitle: "Avant",
    comparisonBefore: ["Notes non structurees", "Rapports le soir", "Chaos copier/coller"],
    comparisonAfterTitle: "Apres",
    comparisonAfter: ["Brouillon structure", "5-10 min. de finition", "Copie dans votre modele"],
    supportsTitle: "Ce que cela supporte",
    supports: [
      "Dictee apres les seances",
      "Transcription optionnelle des seances",
      "Structuration dans vos modeles preferes",
      "Finalisation plus rapide des notes et rapports",
    ],
    notTitle: "Ce que cela ne fait pas",
    not: [
      "Cela ne diagnostique pas",
      "Cela ne suggere pas de traitements",
      "Cela ne remplace pas le jugement clinique",
      "Cela ne cree pas de documents finaux sans votre relecture",
    ],
    whyTitle: "Pourquoi les cliniciens l'utilisent",
    whySubtitle: "Moins d'administratif le soir, plus de presence clinique.",
    whyItems: [
      "Brouillon structure au format clinique",
      "Votre style reste intact (vous modifiez le brouillon)",
      "Moins d'administratif le soir et le week-end",
    ],
    privacyTitle: "Confidentialité et confiance",
    privacySubtitle: "Reponses courtes aux questions essentielles.",
    privacyCards: [
      {
        title: "Gestion de l'audio",
        body: "L'audio est utilise uniquement pour la transcription puis supprime (recommande).",
      },
      {
        title: "Brouillon, pas automatisation",
        body: "La sortie est un brouillon. Vous la relisez, la modifiez et l'adoptez.",
      },
      {
        title: "Pas sauvegarde",
        body: "Le texte n'est pas sauvegarde et sert uniquement de brouillon.",
      },
    ],
    privacyLink: "Lire confidentialité & FAQ",
  },
} as const;

export default function ForCliniciansPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      <p className="text-sm text-gray-700">{t.intro}</p>

      <h2 className="text-base font-semibold">{t.flowTitle}</h2>
      <p className="text-sm text-gray-700">{t.flowSubtitle}</p>
      <div className="grid gap-3 md:grid-cols-3">
        {t.flowSteps.map((step, index) => (
          <div key={step} className="rounded-xl border bg-white p-3">
            <div className="text-xs font-semibold text-gray-500">0{index + 1}</div>
            <div className="mt-1 text-sm font-semibold">{step}</div>
          </div>
        ))}
      </div>

      <h2 className="text-base font-semibold">{t.comparisonTitle}</h2>
      <p className="text-sm text-gray-700">{t.comparisonSubtitle}</p>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-3">
          <div className="text-xs font-semibold text-gray-500">{t.comparisonBeforeTitle}</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {t.comparisonBefore.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border bg-white p-3">
          <div className="text-xs font-semibold text-gray-500">{t.comparisonAfterTitle}</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            {t.comparisonAfter.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="text-base font-semibold">{t.supportsTitle}</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
        {t.supports.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="text-base font-semibold">{t.notTitle}</h2>
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
        {t.not.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="space-y-5">
        <h2 className="text-base font-semibold">{t.whyTitle}</h2>
        <p className="text-sm text-gray-700">{t.whySubtitle}</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
          {t.whyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-semibold">{t.privacyTitle}</h2>
          <p className="text-sm text-gray-700">{t.privacySubtitle}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {t.privacyCards.map((card) => (
            <div key={card.title} className="rounded-xl border bg-white p-3 shadow-sm">
              <div className="text-sm font-semibold">{card.title}</div>
              <p className="mt-1 text-sm text-gray-700">{card.body}</p>
            </div>
          ))}
        </div>
        <div>
          <SecondaryButton href="/privacy">{t.privacyLink}</SecondaryButton>
        </div>
      </div>
    </div>
  );
}
