"use client";

import { useEffect, useMemo, useState } from "react";
import { loadTemplates, saveTemplates, Template } from "@/lib/templateStore";
import { useLanguage } from "@/components/LanguageProvider";

const copy = {
  de: {
    title: "Vorlagen & Schreibstil",
    intro:
      "Vorlagen werden vorerst nur im Browser gespeichert (localStorage). Später speichern wir sie sicher pro Nutzer.",
    listTitle: "Ihre Vorlagen",
    add: "Hinzufügen",
    remove: "Ausgewählte entfernen",
    select: "Vorlage auswählen.",
    nameLabel: "Vorlagenname",
    bodyLabel: "Vorlagentext",
    note: "Platzhalter wie {{TRANSCRIPT}}, {{DATE}}, {{PATIENT}} verwenden. Später füllen wir sie smarter.",
    save: "Speichern",
    alerts: {
      saved: "Gespeichert (nur lokal im Browser).",
      max: "Maximal 10 Vorlagen.",
      min: "Mindestens eine Vorlage behalten.",
    },
    newTemplate: "Neue Vorlage",
    newBody: "Titel\n\n{{TRANSCRIPT}}\n",
  },
  en: {
    title: "Templates & writing style",
    intro:
      "For now, templates are saved only in your browser (localStorage). Later we can store them securely per user.",
    listTitle: "Your templates",
    add: "Add",
    remove: "Remove selected",
    select: "Select a template.",
    nameLabel: "Template name",
    bodyLabel: "Template body",
    note: "Use placeholders like {{TRANSCRIPT}}, {{DATE}}, {{PATIENT}}. We will add smarter filling later.",
    save: "Save",
    alerts: {
      saved: "Saved (stored locally on this browser).",
      max: "Max 10 templates.",
      min: "Keep at least one template.",
    },
    newTemplate: "New template",
    newBody: "Title\n\n{{TRANSCRIPT}}\n",
  },
  it: {
    title: "Modelli e stile di scrittura",
    intro:
      "Per ora, i modelli sono salvati solo nel tuo browser (localStorage). In seguito li salveremo in modo sicuro per utente.",
    listTitle: "I tuoi modelli",
    add: "Aggiungi",
    remove: "Rimuovi selezionato",
    select: "Seleziona un modello.",
    nameLabel: "Nome del modello",
    bodyLabel: "Corpo del modello",
    note: "Usa segnaposto come {{TRANSCRIPT}}, {{DATE}}, {{PATIENT}}. Aggiungeremo un riempimento piu intelligente in seguito.",
    save: "Salva",
    alerts: {
      saved: "Salvato (memorizzato localmente in questo browser).",
      max: "Massimo 10 modelli.",
      min: "Mantieni almeno un modello.",
    },
    newTemplate: "Nuovo modello",
    newBody: "Titolo\n\n{{TRANSCRIPT}}\n",
  },
  fr: {
    title: "Modeles et style d'ecriture",
    intro:
      "Pour l'instant, les modeles sont enregistres uniquement dans votre navigateur (localStorage). Plus tard, nous pourrons les stocker par utilisateur.",
    listTitle: "Vos modeles",
    add: "Ajouter",
    remove: "Supprimer la selection",
    select: "Selectionnez un modele.",
    nameLabel: "Nom du modele",
    bodyLabel: "Corps du modele",
    note: "Utilisez des champs comme {{TRANSCRIPT}}, {{DATE}}, {{PATIENT}}. Nous ajouterons un remplissage plus intelligent plus tard.",
    save: "Enregistrer",
    alerts: {
      saved: "Enregistre (stocke localement dans ce navigateur).",
      max: "Maximum 10 modeles.",
      min: "Conservez au moins un modele.",
    },
    newTemplate: "Nouveau modele",
    newBody: "Titre\n\n{{TRANSCRIPT}}\n",
  },
} as const;

export default function TemplatesPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const loaded = loadTemplates();
    setTemplates(loaded);
    setSelectedId(loaded[0]?.id ?? "");
  }, []);

  const selected = useMemo(
    () => templates.find((template) => template.id === selectedId),
    [templates, selectedId]
  );

  function updateSelected(patch: Partial<Template>) {
    setTemplates((prev) => prev.map((tpl) => (tpl.id === selectedId ? { ...tpl, ...patch } : tpl)));
  }

  function persist() {
    saveTemplates(templates);
    alert(t.alerts.saved);
  }

  function addTemplate() {
    if (templates.length >= 10) {
      alert(t.alerts.max);
      return;
    }
    const id = `t_${Date.now()}`;
    const nt: Template = { id, name: t.newTemplate, body: t.newBody };
    const next = [...templates, nt];
    setTemplates(next);
    setSelectedId(id);
  }

  function removeTemplate() {
    if (templates.length <= 1) {
      alert(t.alerts.min);
      return;
    }
    const next = templates.filter((tpl) => tpl.id !== selectedId);
    setTemplates(next);
    setSelectedId(next[0].id);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t.title}</h1>
      <p className="text-sm text-gray-700">{t.intro}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{t.listTitle}</div>
            <button className="text-sm underline" onClick={addTemplate}>
              {t.add}
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                  tpl.id === selectedId ? "bg-gray-50" : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedId(tpl.id)}
              >
                {tpl.name}
              </button>
            ))}
          </div>

          <button className="mt-3 text-sm text-red-600 underline" onClick={removeTemplate}>
            {t.remove}
          </button>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm md:col-span-2">
          {!selected ? (
            <p className="text-sm text-gray-700">{t.select}</p>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold">{t.nameLabel}</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  value={selected.name}
                  onChange={(e) => updateSelected({ name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold">{t.bodyLabel}</label>
                <textarea
                  className="mt-1 h-72 w-full rounded-xl border px-3 py-2 font-mono text-xs"
                  value={selected.body}
                  onChange={(e) => updateSelected({ body: e.target.value })}
                />
                <p className="mt-2 text-xs text-gray-500">{t.note}</p>
              </div>

              <button
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={persist}
              >
                {t.save}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
