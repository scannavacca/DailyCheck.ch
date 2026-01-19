"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadTemplates } from "@/lib/templateStore";
import { WhisperLiveRecorder } from "@/components/WhisperLiveRecorder";
import { useLanguage } from "@/components/LanguageProvider";

const SAVED_MINUTES_PER_DICTATION = 43;
const SAVED_MINUTES_KEY = "weekly_saved_minutes";
const SAVED_WEEK_KEY = "weekly_saved_week";

function getWeekStartISO(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function formatMinutes(totalMinutes: number) {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function fillTemplate(tpl: string, vars: Record<string, string>) {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

const copy = {
  de: {
    title: "Neue Dokumentation",
    steps: {
      type: "Schritt 1: Dokumenttyp",
      mode: "Schritt 2: Modus",
      template: "Schritt 3: Vorlage",
    },
    docTypes: ["Verlaufseintrag", "Erstgespräch", "Bericht / Arztbrief", "Freie Notiz"],
    modeOptions: {
      dictation: "Diktat (aufnehmen)",
      upload: "Audio hochladen (später)",
    },
    modeNote: "Upload-Modus wird implementiert, sobald die Diktat-Pipeline stabil ist.",
    banner:
      "Audio wird nach der Transkription gelöscht (empfohlen). Diese Seite ist ein temporärer Arbeitsbereich: Schließen oder Neuladen löscht den Text.",
    workspace: {
      title: "Entwurfs-Arbeitsbereich (editierbar)",
      generate: "Entwurf aus Transkript erzeugen",
      note: "Dieser Text wird nicht gespeichert. Kopieren Sie ihn, bevor Sie die Seite schließen.",
      placeholder: "Klicken Sie auf \"Entwurf aus Transkript erzeugen\", sobald Sie Transkripttext haben.",
      auto: "Entwurf wird automatisch aktualisiert.",
      generating: "Entwurf wird erstellt...",
      copy: "In Zwischenablage kopieren",
      copied: "In die Zwischenablage kopiert.",
      clear: "Neu starten (Text löschen)",
      notice: "Hinweis: Dies ist ein Entwurf. Die finale Verantwortung bleibt bei Psychiater*innen.",
    },
    supplemental: {
      title: "Zusatztext & Dokumente",
      pasteLabel: "Text einfügen (optional)",
      uploadLabel: "Dokument hinzufügen (.txt, .pdf, .docx, .doc)",
      uploadNote: "Dateien werden nur für diese Sitzung verarbeitet und nicht gespeichert.",
      placeholder: "Notizen, Vorbefunde oder Kontext hier einfügen...",
    },
    transcript: {
      title: "Transkript (später einklappbar)",
      status: "Status",
      final: "Finales Transkript",
      live: "Live-Teil (während des Sprechens)",
      noneYet: "(noch nichts)",
      none: "(nichts)",
    },
    status: {
      idle: "Bereit.",
      cleared: "Gelöscht.",
    },
    timeSaved: {
      label: "Time saved",
      week: "Mo-So",
    },
  },
  en: {
    title: "New Documentation",
    steps: {
      type: "Step 1: Document type",
      mode: "Step 2: Mode",
      template: "Step 3: Template",
    },
    docTypes: ["Progress note", "Initial intake", "Report / Medical letter", "Free note"],
    modeOptions: {
      dictation: "Dictation (record)",
      upload: "Upload audio (later)",
    },
    modeNote: "Upload mode will be implemented after the dictation pipeline is stable.",
    banner:
      "Audio will be deleted after transcription (recommended). This page is a temporary workspace: closing or reloading clears text.",
    workspace: {
      title: "Draft workspace (editable)",
      generate: "Generate draft from transcript",
      note: "This text is not saved. Copy it out before closing the page.",
      placeholder: "Click \"Generate draft from transcript\" after you have transcript text.",
      auto: "Draft updates automatically.",
      generating: "Generating draft...",
      copy: "Copy to clipboard",
      copied: "Copied to clipboard.",
      clear: "Start new (clears text)",
      notice: "Notice: this is a draft. Final responsibility remains with the clinician.",
    },
    supplemental: {
      title: "Supplemental text & files",
      pasteLabel: "Paste text (optional)",
      uploadLabel: "Add document (.txt, .pdf, .docx, .doc)",
      uploadNote: "Files are processed for this session only and are not stored.",
      placeholder: "Paste notes, prior findings, or context here...",
    },
    transcript: {
      title: "Transcript (collapsible later)",
      status: "Status",
      final: "Final transcript",
      live: "Live partial (while speaking)",
      noneYet: "(none yet)",
      none: "(none)",
    },
    status: {
      idle: "Idle.",
      cleared: "Cleared.",
    },
    timeSaved: {
      label: "Time saved",
      week: "Mon-Sun",
    },
  },
  it: {
    title: "Nuova documentazione",
    steps: {
      type: "Fase 1: Tipo di documento",
      mode: "Fase 2: Modalità",
      template: "Fase 3: Modello",
    },
    docTypes: ["Nota di decorso", "Primo colloquio", "Rapporto / Lettera medica", "Nota libera"],
    modeOptions: {
      dictation: "Dettatura (registra)",
      upload: "Carica audio (in seguito)",
    },
    modeNote: "La modalità upload verrà implementata dopo la stabilizzazione della dettatura.",
    banner:
      "L'audio verrà eliminato dopo la trascrizione (consigliato). Questa pagina è un'area temporanea: chiudere o ricaricare cancella il testo.",
    workspace: {
      title: "Spazio bozza (modificabile)",
      generate: "Genera bozza dal trascritto",
      note: "Questo testo non viene salvato. Copialo prima di chiudere la pagina.",
      placeholder: "Clicca su \"Genera bozza dal trascritto\" quando hai testo trascritto.",
      auto: "La bozza si aggiorna automaticamente.",
      generating: "Creazione bozza...",
      copy: "Copia negli appunti",
      copied: "Copiato negli appunti.",
      clear: "Nuova bozza (cancella testo)",
      notice: "Nota: questa è una bozza. La responsabilità finale resta al clinico.",
    },
    supplemental: {
      title: "Testo aggiuntivo e documenti",
      pasteLabel: "Incolla testo (opzionale)",
      uploadLabel: "Aggiungi documento (.txt, .pdf, .docx, .doc)",
      uploadNote: "I file vengono elaborati solo per questa sessione e non vengono salvati.",
      placeholder: "Incolla note, referti o contesto qui...",
    },
    transcript: {
      title: "Trascritto (collassabile in seguito)",
      status: "Stato",
      final: "Trascritto finale",
      live: "Parziale live (mentre parli)",
      noneYet: "(non ancora)",
      none: "(nessuno)",
    },
    status: {
      idle: "Inattivo.",
      cleared: "Cancellato.",
    },
    timeSaved: {
      label: "Time saved",
      week: "Lun-Dom",
    },
  },
  fr: {
    title: "Nouvelle documentation",
    steps: {
      type: "Étape 1 : Type de document",
      mode: "Étape 2 : Mode",
      template: "Étape 3 : Modèle",
    },
    docTypes: ["Note d'évolution", "Première consultation", "Rapport / Lettre médicale", "Note libre"],
    modeOptions: {
      dictation: "Dictée (enregistrer)",
      upload: "Importer un audio (plus tard)",
    },
    modeNote: "Le mode import sera implémenté après stabilisation du flux de dictée.",
    banner:
      "L'audio sera supprimé après transcription (recommandé). Cette page est un espace temporaire : fermer ou recharger efface le texte.",
    workspace: {
      title: "Espace brouillon (modifiable)",
      generate: "Générer un brouillon depuis la transcription",
      note: "Ce texte n'est pas enregistré. Copiez-le avant de fermer la page.",
      placeholder: "Cliquez sur \"Générer un brouillon depuis la transcription\" après avoir du texte transcrit.",
      auto: "Le brouillon se met à jour automatiquement.",
      generating: "Creation du brouillon...",
      copy: "Copier dans le presse-papiers",
      copied: "Copié dans le presse-papiers.",
      clear: "Nouveau brouillon (effacer le texte)",
      notice: "Note : ceci est un brouillon. La responsabilité finale reste au clinicien.",
    },
    supplemental: {
      title: "Texte complémentaire & documents",
      pasteLabel: "Coller du texte (optionnel)",
      uploadLabel: "Ajouter un document (.txt, .pdf, .docx, .doc)",
      uploadNote: "Les fichiers sont traités uniquement pour cette session et ne sont pas stockés.",
      placeholder: "Collez des notes, antécédents ou contexte ici...",
    },
    transcript: {
      title: "Transcription (repliable plus tard)",
      status: "Statut",
      final: "Transcription finale",
      live: "Partiel en direct (pendant la parole)",
      noneYet: "(pas encore)",
      none: "(aucun)",
    },
    status: {
      idle: "Inactif.",
      cleared: "Effacé.",
    },
    timeSaved: {
      label: "Time saved",
      week: "Lun-Dim",
    },
  },
} as const;

export default function NewDocumentationPage() {
  const { language } = useLanguage();
  const t = copy[language];
  const templates = useMemo(() => loadTemplates(), []);
  const [docType, setDocType] = useState(t.docTypes[0]);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [mode, setMode] = useState<"dictation" | "upload">("dictation");

  const [status, setStatus] = useState(t.status.idle);
  const [partial, setPartial] = useState("");
  const [finalText, setFinalText] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [supplementText, setSupplementText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draftBusy, setDraftBusy] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [savedMinutes, setSavedMinutes] = useState(0);
  const [hasDictation, setHasDictation] = useState(false);
  const [recording, setRecording] = useState(false);

  const draftTimeoutRef = useRef<number | null>(null);
  const draftAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setDocType(copy[language].docTypes[0]);
    setStatus(copy[language].status.idle);
  }, [language]);

  useEffect(() => {
    const weekStart = getWeekStartISO(new Date());
    const storedWeek = localStorage.getItem(SAVED_WEEK_KEY);
    const storedMinutes = Number(localStorage.getItem(SAVED_MINUTES_KEY) ?? "0");

    if (storedWeek !== weekStart) {
      localStorage.setItem(SAVED_WEEK_KEY, weekStart);
      localStorage.setItem(SAVED_MINUTES_KEY, "0");
      setSavedMinutes(0);
      return;
    }

    setSavedMinutes(Number.isFinite(storedMinutes) ? storedMinutes : 0);
  }, []);

  const selectedTemplate = templates.find((tpl) => tpl.id === templateId);

  function addWeeklySavings() {
    const weekStart = getWeekStartISO(new Date());
    const storedWeek = localStorage.getItem(SAVED_WEEK_KEY);
    const storedMinutes = Number(localStorage.getItem(SAVED_MINUTES_KEY) ?? "0");
    const base = storedWeek === weekStart && Number.isFinite(storedMinutes) ? storedMinutes : 0;
    const next = base + SAVED_MINUTES_PER_DICTATION;
    localStorage.setItem(SAVED_WEEK_KEY, weekStart);
    localStorage.setItem(SAVED_MINUTES_KEY, String(next));
    setSavedMinutes(next);
  }

  function regenerateWorkspace(fromTranscript: string) {
    const base = selectedTemplate?.body ?? "{{TRANSCRIPT}}";
    const now = new Date().toISOString().slice(0, 10);

    const draft = fillTemplate(base, {
      DATE: now,
      PATIENT: "(initials / pseudonym)",
      FOCUS: "",
      PSYCHOSTATUS: "",
      ASSESSMENT: "",
      PLAN: "",
      COMPLAINT: "",
      SUMMARY: "",
      TRANSCRIPT: fromTranscript,
    });

    setWorkspace(draft);
  }

  async function generateDraft() {
    if (!selectedTemplate) return;
    const transcript = finalText.trim();
    const supplemental = supplementText.trim();
    if (!transcript && !supplemental) return;

    if (draftAbortRef.current) draftAbortRef.current.abort();
    const controller = new AbortController();
    draftAbortRef.current = controller;

    setDraftBusy(true);
    setDraftError(null);

    try {
      const res = await fetch("/api/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate.body,
          transcript,
          supplemental,
          language,
          docType,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as { draft?: string };
      if (data.draft) setWorkspace(data.draft);
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setDraftError(err?.message ?? "Draft generation failed.");
      }
    } finally {
      setDraftBusy(false);
    }
  }

  useEffect(() => {
    const liveSource = [finalText, partial, supplementText].filter(Boolean).join("\n\n");
    if (recording && liveSource) {
      regenerateWorkspace(liveSource);
    }
  }, [recording, finalText, partial, supplementText, templateId]);

  useEffect(() => {
    if (recording) return;
    const source = [finalText, supplementText].filter(Boolean).join("\n\n");
    if (source) regenerateWorkspace(source);
  }, [recording, finalText, supplementText, templateId]);

  useEffect(() => {
    if (recording) return;
    if (!selectedTemplate) return;
    if (!finalText.trim() && !supplementText.trim()) return;

    if (draftTimeoutRef.current) {
      window.clearTimeout(draftTimeoutRef.current);
    }

    draftTimeoutRef.current = window.setTimeout(() => {
      void generateDraft();
    }, 800);

    return () => {
      if (draftTimeoutRef.current) window.clearTimeout(draftTimeoutRef.current);
    };
  }, [recording, finalText, supplementText, templateId, docType, language]);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);

    try {
      const parts: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/extract-text", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || `Upload failed (${res.status})`);
        }

        const data = (await res.json()) as { text?: string };
        const text = data.text?.trim() ?? "";
        if (text) {
          parts.push(`[${file.name}]\n${text}`);
        }
      }

      if (parts.length > 0) {
        setSupplementText((prev) => (prev ? `${prev}\n\n${parts.join("\n\n")}` : parts.join("\n\n")));
      }
    } catch (err: any) {
      setUploadError(err?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3" data-tour="doc-steps">
          <div>
            <label className="text-sm font-semibold">{t.steps.type}</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={docType}
              onChange={(e) => setDocType(e.target.value as typeof docType)}
            >
              {t.docTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">{t.steps.mode}</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as "dictation" | "upload")}
            >
              <option value="dictation">{t.modeOptions.dictation}</option>
              <option value="upload">{t.modeOptions.upload}</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">{t.modeNote}</p>
          </div>

          <div>
            <label className="text-sm font-semibold">{t.steps.template}</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              {templates.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 rounded-xl border bg-gray-50 p-3 text-xs text-gray-600">{t.banner}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-sm font-semibold">{t.workspace.title}</h2>
            <div className="flex flex-wrap items-center gap-3">
              {mode === "dictation" ? (
                <WhisperLiveRecorder
                  language={language}
                  model="small"
                  useVAD={true}
                  variant="compact"
                  tourId="rec-button"
                  onStatus={(s) => setStatus(s as "Bereit." | "Idle." | "Inattivo." | "Inactif.")}
                  onStateChange={(state) => setRecording(state.recording)}
                  onPartial={(text) => {
                    setPartial(text);
                    setHasDictation(true);
                  }}
                  onFinal={(text) => {
                    setFinalText((prev) => (prev ? prev + " " + text : text));
                    setPartial("");
                    setHasDictation(true);
                  }}
                  onStop={() => {
                    if (hasDictation) {
                      addWeeklySavings();
                      setHasDictation(false);
                    }
                  }}
                />
              ) : null}
              <div className="rounded-xl border bg-white px-3 py-2 text-right">
                <div className="text-xs font-semibold text-blue-500">{t.timeSaved.label}</div>
                <div className="text-lg font-semibold">{formatMinutes(savedMinutes)}</div>
                <div className="text-[11px] text-gray-500">{t.timeSaved.week}</div>
              </div>
            </div>
          </div>

          <div
            className="mt-3 rounded-xl border bg-gray-50 p-3 text-xs text-gray-700"
            data-tour="supplemental"
          >
            <div className="text-xs font-semibold text-gray-600">{t.supplemental.title}</div>
            <div className="mt-3">
              <label className="text-[11px] font-semibold text-gray-600">{t.supplemental.uploadLabel}</label>
              <input
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-xs"
                type="file"
                accept=".txt,.pdf,.docx,.doc,.md,.rtf"
                multiple
                onChange={(e) => {
                  void handleFileUpload(e.target.files);
                  e.currentTarget.value = "";
                }}
                disabled={uploading}
              />
              <div className="mt-1 text-[11px] text-gray-500">{t.supplemental.uploadNote}</div>
              {uploading ? <div className="mt-1 text-[11px] text-blue-600">Processing...</div> : null}
              {uploadError ? <div className="mt-1 text-[11px] text-red-600">{uploadError}</div> : null}
            </div>
            <div className="mt-4">
              <label className="text-[11px] font-semibold text-gray-600">{t.supplemental.pasteLabel}</label>
              <textarea
                className="mt-1 h-28 w-full rounded-xl border bg-white px-3 py-2 text-xs"
                value={supplementText}
                onChange={(e) => setSupplementText(e.target.value)}
                placeholder={t.supplemental.placeholder}
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {t.workspace.note} {t.workspace.auto}
            </p>
            <button
              className="text-sm underline"
              onClick={() => generateDraft()}
              disabled={!selectedTemplate}
            >
              {t.workspace.generate}
            </button>
          </div>

          <textarea
            className="mt-3 h-96 w-full rounded-xl border px-3 py-2 text-xs font-mono"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            placeholder={t.workspace.placeholder}
          />

          {draftBusy ? <div className="mt-2 text-xs text-blue-600">{t.workspace.generating}</div> : null}
          {draftError ? <div className="mt-2 text-xs text-red-600">{draftError}</div> : null}

          <div className="mt-3 flex gap-3">
            <button
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              onClick={async () => {
                await navigator.clipboard.writeText(workspace);
                alert(t.workspace.copied);
              }}
              disabled={!workspace}
            >
              {t.workspace.copy}
            </button>

            <button
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              onClick={() => {
                setWorkspace("");
                setFinalText("");
                setPartial("");
                setSupplementText("");
                setHasDictation(false);
                setStatus("Bereit.");
              }}
            >
              {t.workspace.clear}
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500">{t.workspace.notice}</p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold">{t.transcript.title}</h2>

          <div className="mt-2 rounded-xl border bg-gray-50 p-3 text-xs text-gray-700">
            <div className="font-semibold">{t.transcript.status}</div>
            <div className="mt-1">{status}</div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-xl border p-3">
              <div className="text-xs font-semibold text-gray-600">{t.transcript.final}</div>
              <div className="mt-2 whitespace-pre-wrap text-sm">{finalText || t.transcript.noneYet}</div>
            </div>

            <div className="rounded-xl border p-3">
              <div className="text-xs font-semibold text-gray-600">{t.transcript.live}</div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{partial || t.transcript.none}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
