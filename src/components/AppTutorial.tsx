"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";

type Step = {
  id: string;
  path: string;
  title: string;
  body: string;
  selector?: string;
  selectors?: string[];
  requiresClick?: boolean;
  advanceOn?: string;
};

const storage = {
  seen: "dailycheck_tour_seen",
  step: "dailycheck_tour_step",
};

const copy = {
  de: {
    steps: {
      welcome: {
        title: "Willkommen bei DailyCheck.ch",
        body: "Grossartig, dass Sie da sind! In weniger als einer Minute zeigen wir Ihnen die wichtigsten Bereiche.",
      },
      chatbot: {
        title: "Self-care Chatbot",
        body: "Hier finden Sie den persönlichen Wohlfühl-Chatbot. Er ist nur für Sie (nicht für Patientenversorgung).",
      },
      menu: {
        title: "Dashboard-Menü",
        body: "Von hier aus steuern Sie alle Bereiche: Dokumentation, Vorlagen, Tools und Einstellungen.",
      },
      tools: {
        title: "ICD-10 & Dokumentations-Tools",
        body: "Diese beiden Bereiche unterstützen Sie klinisch - schnell finden, strukturieren, prüfen.",
      },
      templates: {
        title: "Vorlagen",
        body: "Hier pflegen Sie Ihre Vorlagen, damit Diktate sauber strukturiert werden.",
      },
      newDoc: {
        title: "Neue Dokumentation",
        body: "Bitte klicken Sie auf \"Neue Dokumentation\", um fortzufahren.",
      },
      steps: {
        title: "Schritt 1-3",
        body: "Wählen Sie Dokumenttyp, Modus und Vorlage - das ist die Basis für den Entwurf.",
      },
      supplemental: {
        title: "Textdatei oder Notizen",
        body: "Optional können Sie eine Textdatei hochladen oder Notizen einfügen (Stil, Kontext, Inhalt).",
      },
      rec: {
        title: "Rec",
        body: "Mit dem Aufnahme-Button starten Sie Ihr Diktat.",
      },
    },
    skip: "Skip",
    next: "Weiter",
  },
  en: {
    steps: {
      welcome: {
        title: "Welcome to DailyCheck.ch",
        body: "Great to have you here! Here is a quick walkthrough so you can start immediately.",
      },
      chatbot: {
        title: "Self-care chatbot",
        body: "This is your wellbeing assistant. It is for you only (not for patient care).",
      },
      menu: {
        title: "Dashboard menu",
        body: "Use this menu to navigate documentation, templates, tools, and settings.",
      },
      tools: {
        title: "ICD-10 & documentation tools",
        body: "These two sections support your clinical workflow with structure and clarity.",
      },
      templates: {
        title: "Templates",
        body: "Maintain your templates here so your dictations stay structured.",
      },
      newDoc: {
        title: "New documentation",
        body: "Please click \"New documentation\" to continue.",
      },
      steps: {
        title: "Step 1-3",
        body: "Choose document type, mode, and template - this defines the draft structure.",
      },
      supplemental: {
        title: "Text file or notes",
        body: "Optionally upload a text file or add notes (style, context, content).",
      },
      rec: {
        title: "Rec",
        body: "Use the record button to start dictation.",
      },
    },
    skip: "Skip",
    next: "Next",
  },
  it: {
    steps: {
      welcome: {
        title: "Benvenuto su DailyCheck.ch",
        body: "Felici di averti qui! Ecco una guida rapida per partire subito.",
      },
      chatbot: {
        title: "Chatbot self-care",
        body: "Questo e il tuo assistente di benessere. Solo per te (non per i pazienti).",
      },
      menu: {
        title: "Menu dashboard",
        body: "Da qui accedi a documentazione, modelli, strumenti e impostazioni.",
      },
      tools: {
        title: "ICD-10 e strumenti",
        body: "Queste sezioni supportano il lavoro clinico con struttura e chiarezza.",
      },
      templates: {
        title: "Modelli",
        body: "Gestisci i modelli per strutturare meglio le dettature.",
      },
      newDoc: {
        title: "Nuova documentazione",
        body: "Clicca su \"Nuova documentazione\" per continuare.",
      },
      steps: {
        title: "Fase 1-3",
        body: "Scegli tipo documento, modalita e modello: e la base della bozza.",
      },
      supplemental: {
        title: "File di testo o note",
        body: "Puoi caricare un file di testo o aggiungere note (stile, contesto, contenuto).",
      },
      rec: {
        title: "Rec",
        body: "Usa il pulsante di registrazione per iniziare il dettato.",
      },
    },
    skip: "Skip",
    next: "Avanti",
  },
  fr: {
    steps: {
      welcome: {
        title: "Bienvenue sur DailyCheck.ch",
        body: "Ravi de vous accueillir ! Voici un court guide pour demarrer vite.",
      },
      chatbot: {
        title: "Chatbot self-care",
        body: "Voici votre assistant bien-etre. Uniquement pour vous (pas pour les patients).",
      },
      menu: {
        title: "Menu du tableau de bord",
        body: "Accedez ici a la documentation, aux modeles, aux outils et aux parametres.",
      },
      tools: {
        title: "ICD-10 & outils de documentation",
        body: "Ces sections soutiennent votre flux clinique avec structure et clarté.",
      },
      templates: {
        title: "Modeles",
        body: "Gerez vos modeles pour structurer les dictées.",
      },
      newDoc: {
        title: "Nouvelle documentation",
        body: "Veuillez cliquer sur \"Nouvelle documentation\" pour continuer.",
      },
      steps: {
        title: "Etape 1-3",
        body: "Choisissez type, mode et modele : c'est la base du brouillon.",
      },
      supplemental: {
        title: "Fichier texte ou notes",
        body: "Vous pouvez televerser un fichier texte ou ajouter des notes (style, contexte, contenu).",
      },
      rec: {
        title: "Rec",
        body: "Utilisez le bouton d'enregistrement pour dicter.",
      },
    },
    skip: "Skip",
    next: "Suivant",
  },
} as const;

export function AppTutorial() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.en;
  const pathname = usePathname();
  const [stepIndex, setStepIndex] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "welcome",
        path: "/app/dashboard",
        ...t.steps.welcome,
      },
      {
        id: "chatbot",
        path: "/app/dashboard",
        selector: '[data-tour="chatbot-button"]',
        ...t.steps.chatbot,
      },
      {
        id: "menu",
        path: "/app/dashboard",
        selector: '[data-tour="dashboard-menu"]',
        ...t.steps.menu,
      },
      {
        id: "tools",
        path: "/app/dashboard",
        selectors: ['[data-tour="nav-icd10"]', '[data-tour="nav-checklists"]'],
        ...t.steps.tools,
      },
      {
        id: "templates",
        path: "/app/dashboard",
        selector: '[data-tour="nav-templates"]',
        ...t.steps.templates,
      },
      {
        id: "new-doc",
        path: "/app/dashboard",
        selector: '[data-tour="nav-new-doc"]',
        requiresClick: true,
        advanceOn: "new-doc",
        ...t.steps.newDoc,
      },
      {
        id: "steps",
        path: "/app/new",
        selector: '[data-tour="doc-steps"]',
        ...t.steps.steps,
      },
      {
        id: "supplemental",
        path: "/app/new",
        selector: '[data-tour="supplemental"]',
        ...t.steps.supplemental,
      },
      {
        id: "rec",
        path: "/app/new",
        selector: '[data-tour="rec-button"]',
        ...t.steps.rec,
      },
    ],
    [t]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(storage.seen) === "yes";
    if (seen) {
      setStepIndex(null);
      return;
    }
    const stored = Number(window.localStorage.getItem(storage.step) ?? "0");
    const nextIndex = Number.isNaN(stored) ? 0 : stored;
    setStepIndex(nextIndex >= steps.length ? 0 : nextIndex);
  }, [steps.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (stepIndex === null) return;
    window.localStorage.setItem(storage.step, String(stepIndex));
  }, [stepIndex]);

  useEffect(() => {
    function handleAdvance(event: Event) {
      if (stepIndex === null) return;
      const detail = (event as CustomEvent<string>).detail;
      const step = steps[stepIndex];
      if (!step || !step.advanceOn || step.advanceOn !== detail) return;
      setStepIndex((prev) => (prev === null ? prev : prev + 1));
    }

    window.addEventListener("tour-advance", handleAdvance as EventListener);
    return () => window.removeEventListener("tour-advance", handleAdvance as EventListener);
  }, [stepIndex, steps]);

  useEffect(() => {
    function handleRestart() {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storage.seen);
        window.localStorage.setItem(storage.step, "0");
      }
      setStepIndex(0);
    }

    window.addEventListener("tour-restart", handleRestart);
    return () => window.removeEventListener("tour-restart", handleRestart);
  }, []);

  useEffect(() => {
    if (stepIndex === null) return;
    const step = steps[stepIndex];
    if (!step || step.path !== pathname) {
      setRect(null);
      return;
    }

    function computeRect() {
      if (!step.selector && !step.selectors) {
        setRect(null);
        return;
      }
      const selectors = step.selectors ?? (step.selector ? [step.selector] : []);
      const nodes = selectors
        .map((sel) => document.querySelector(sel))
        .filter(Boolean) as Element[];
      if (nodes.length === 0) {
        setRect(null);
        return;
      }
      const rects = nodes.map((node) => node.getBoundingClientRect());
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      const width = right - left;
      const height = bottom - top;
      const combined = new DOMRect(left, top, width, height);
      setRect(combined);
    }

    computeRect();
    window.addEventListener("resize", computeRect);
    window.addEventListener("scroll", computeRect, true);
    return () => {
      window.removeEventListener("resize", computeRect);
      window.removeEventListener("scroll", computeRect, true);
    };
  }, [stepIndex, steps, pathname]);

  if (stepIndex === null) return null;
  const step = steps[stepIndex];
  if (!step || step.path !== pathname) return null;

  const popoverWidth = 360;
  const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
  const left = rect
    ? Math.min(Math.max(rect.left, 16), viewportWidth - popoverWidth - 16)
    : (viewportWidth - popoverWidth) / 2;
  const top = rect ? Math.min(rect.bottom + 16, viewportHeight - 220) : 120;
  const blockInteraction = !step.requiresClick;

  return (
    <div className="fixed inset-0 z-[60]">
      {blockInteraction ? (
        <div className="absolute inset-0 bg-slate-900/50" />
      ) : (
        <div className="absolute inset-0 bg-slate-900/50 pointer-events-none" />
      )}

      {rect ? (
        <div
          className="pointer-events-none absolute rounded-2xl border-2 border-white/80"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.5)",
          }}
        />
      ) : null}

      <div
        className="absolute max-w-sm rounded-2xl border bg-white p-4 shadow-xl"
        style={{ top, left, width: popoverWidth }}
      >
        <div className="text-sm font-semibold text-gray-900">{step.title}</div>
        <p className="mt-2 text-sm text-gray-700">{step.body}</p>
      </div>

      <div className="absolute inset-x-6 bottom-6 flex items-center justify-between">
        <button
          className="pointer-events-auto text-sm font-semibold underline"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.setItem(storage.seen, "yes");
              window.localStorage.removeItem(storage.step);
            }
            setStepIndex(null);
          }}
        >
          {t.skip}
        </button>
        <button
          className="pointer-events-auto text-sm font-semibold underline disabled:opacity-40"
          disabled={step.requiresClick}
          onClick={() => {
            if (stepIndex + 1 >= steps.length) {
              if (typeof window !== "undefined") {
                window.localStorage.setItem(storage.seen, "yes");
                window.localStorage.removeItem(storage.step);
              }
              setStepIndex(null);
              return;
            }
            setStepIndex((prev) => (prev === null ? prev : prev + 1));
          }}
        >
          {t.next}
        </button>
      </div>
    </div>
  );
}
