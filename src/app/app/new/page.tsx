"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useOpenAIReady } from "@/lib/useOpenAIReady";

function formatHMS(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}`.padStart(2, "0") + ":" + `${minutes}`.padStart(2, "0") + ":" + `${seconds}`.padStart(2, "0");
}

function formatMMSS(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}`.padStart(2, "0") + ":" + `${seconds}`.padStart(2, "0");
}

function getMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

type TemplateOption = { id: string; name: string; body: string };

const templateOptions: TemplateOption[] = [
  {
    id: "soap",
    name: "SOAP",
    body:
      "SOAP Note\n\nSubjective:\n{{TRANSCRIPT}}\n\nObjective:\n- \n\nAssessment:\n- \n\nPlan:\n- \n\nSummary:\n{{SUMMARY}}\n",
  },
  {
    id: "psych-progress",
    name: "Psych Progress Note",
    body:
      "Psych Progress Note\n\nDate: {{DATE}}\n\nSession Summary:\n{{TRANSCRIPT}}\n\nAssessment:\n- \n\nPlan:\n- \n\nSummary:\n{{SUMMARY}}\n",
  },
  {
    id: "kurzbericht",
    name: "Kurzbericht",
    body:
      "Kurzbericht\n\nDatum: {{DATE}}\n\nKernaussagen:\n{{TRANSCRIPT}}\n\nKurzfazit:\n{{SUMMARY}}\n",
  },
  {
    id: "custom",
    name: "Custom",
    body: "Custom Template\n\n{{TRANSCRIPT}}\n\nSummary:\n{{SUMMARY}}\n",
  },
];

function fillTemplate(tpl: string, vars: Record<string, string>) {
  let out = tpl;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

const copy = {
  de: {
    title: "Aufnahmebereich",
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
      title: "Aufnahmebereich",
      generate: "Entwurf aus Transkript erzeugen",
      note: "Alle Inputs werden anhand der gewählten Vorlage strukturiert. Dieser Text wird nicht gespeichert. Kopieren Sie ihn, bevor Sie die Seite schließen.",
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
      pasteLabel: "Notizen (Ton, Kontext, Wichtig)",
      uploadLabel: "Dokument hinzufügen (.txt, .pdf, .docx, .doc)",
      uploadNote: "Dateien werden nur für diese Sitzung verarbeitet und nicht gespeichert.",
      placeholder: "Describe tone, quality, importance, etc.",
    },
    recorder: {
      uploadTitle: "Upload",
      uploadLabel: "Upload text file",
      attachmentsTitle: "Anhänge",
      attachmentsEmpty: "Keine Uploads",
      toneLabel: "Tone",
      tones: ["Professional", "Neutral", "Urgent"],
      notesLabel: "Notes",
      templateLabel: "Template",
      outputTitle: "Draft output",
      outputPlaceholder: "Ihr strukturierter Entwurf erscheint hier...",
      statusLabel: "Status",
      status: {
        idle: "Ready",
        recording: "Recording",
        paused: "Paused",
        processing: "Verarbeitung...",
      },
      timerLabel: "Recording time",
      avoidedLabel: "Time writing avoided",
      processingLabel: "Verarbeitung...",
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
    title: "Recording workspace",
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
      title: "Recording area",
      generate: "Generate draft from transcript",
      note: "All inputs are structured by the selected template. This text is not saved. Copy it out before closing the page.",
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
      pasteLabel: "Notes",
      uploadLabel: "Upload text file",
      uploadNote: "Files are processed for this session only and are not stored.",
      placeholder: "Describe tone, quality, importance, etc.",
    },
    recorder: {
      uploadTitle: "Upload",
      uploadLabel: "Upload text file",
      attachmentsTitle: "Attachments",
      attachmentsEmpty: "No uploads yet",
      toneLabel: "Tone",
      tones: ["Professional", "Neutral", "Urgent"],
      notesLabel: "Notes",
      templateLabel: "Template",
      outputTitle: "Draft output",
      outputPlaceholder: "Your structured draft will appear here...",
      statusLabel: "Status",
      status: {
        idle: "Ready",
        recording: "Recording",
        paused: "Paused",
        processing: "Processing...",
      },
      timerLabel: "Recording time",
      avoidedLabel: "Time writing avoided",
      processingLabel: "Processing...",
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
    title: "Area di registrazione",
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
      title: "Area di registrazione",
      generate: "Genera bozza dal trascritto",
      note: "Tutti gli input vengono strutturati dal modello selezionato. Questo testo non viene salvato. Copialo prima di chiudere la pagina.",
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
      pasteLabel: "Note",
      uploadLabel: "Carica file di testo",
      uploadNote: "I file vengono elaborati solo per questa sessione e non vengono salvati.",
      placeholder: "Describe tone, quality, importance, etc.",
    },
    recorder: {
      uploadTitle: "Upload",
      uploadLabel: "Carica file di testo",
      attachmentsTitle: "Allegati",
      attachmentsEmpty: "Nessun upload",
      toneLabel: "Tone",
      tones: ["Professional", "Neutral", "Urgent"],
      notesLabel: "Notes",
      templateLabel: "Template",
      outputTitle: "Draft output",
      outputPlaceholder: "La bozza strutturata apparira qui...",
      statusLabel: "Stato",
      status: {
        idle: "Pronto",
        recording: "Registrazione",
        paused: "In pausa",
        processing: "Elaborazione...",
      },
      timerLabel: "Tempo di registrazione",
      avoidedLabel: "Time writing avoided",
      processingLabel: "Elaborazione...",
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
    title: "Zone d'enregistrement",
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
      title: "Zone d'enregistrement",
      generate: "Générer un brouillon depuis la transcription",
      note: "Tous les apports sont structurés selon le modèle choisi. Ce texte n'est pas enregistré. Copiez-le avant de fermer la page.",
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
      pasteLabel: "Notes",
      uploadLabel: "Televerser un fichier texte",
      uploadNote: "Les fichiers sont traités uniquement pour cette session et ne sont pas stockés.",
      placeholder: "Describe tone, quality, importance, etc.",
    },
    recorder: {
      uploadTitle: "Upload",
      uploadLabel: "Televerser un fichier texte",
      attachmentsTitle: "Pieces jointes",
      attachmentsEmpty: "Aucun upload",
      toneLabel: "Tone",
      tones: ["Professional", "Neutral", "Urgent"],
      notesLabel: "Notes",
      templateLabel: "Template",
      outputTitle: "Draft output",
      outputPlaceholder: "Votre brouillon structure apparaitra ici...",
      statusLabel: "Statut",
      status: {
        idle: "Pret",
        recording: "Enregistrement",
        paused: "En pause",
        processing: "Traitement...",
      },
      timerLabel: "Temps d'enregistrement",
      avoidedLabel: "Time writing avoided",
      processingLabel: "Traitement...",
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
  const openAiReady = useOpenAIReady();
  const templates = templateOptions;
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");

  const [status, setStatus] = useState(t.status.idle);
  const [partial, setPartial] = useState("");
  const [finalText, setFinalText] = useState("");
  const [supplementText, setSupplementText] = useState("");
  const [tone, setTone] = useState(t.recorder.tones[0]);
  const [recState, setRecState] = useState<"idle" | "recording" | "paused" | "processing" | "done">(
    "idle"
  );
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [writingAvoidedSeconds, setWritingAvoidedSeconds] = useState(0);
  const [outputText, setOutputText] = useState("");
  const [uploadedItems, setUploadedItems] = useState<{ name: string; type: string }[]>([]);
  const [uploadedText, setUploadedText] = useState("");
  const [recError, setRecError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingSecondsRef = useRef(0);
  useEffect(() => {
    setDocType(copy[language].docTypes[0]);
    setStatus(copy[language].status.idle);
    setTone(copy[language].recorder.tones[0]);
  }, [language]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
      chunksRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (recState === "recording") {
      setStatus(t.recorder.status.recording);
      return;
    }
    if (recState === "paused") {
      setStatus(t.recorder.status.paused);
      return;
    }
    if (recState === "processing") {
      setStatus(t.recorder.status.processing);
      return;
    }
    setStatus(t.status.idle);
  }, [recState, t]);

  async function transcribeAudio(mimeType: string, seconds: number) {
    try {
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      const file = new File([blob], "recording.webm", { type: blob.type });
      const form = new FormData();
      form.append("file", file);
      form.append("language", language);

      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Transcription failed (${res.status})`);
      }

      const data = (await res.json()) as { text?: string };
      const transcript = data.text?.trim() ?? "";
      setFinalText(transcript);
      setPartial("");

      const draft = await sendToLLM({
        transcript,
        notes: supplementText.trim(),
        uploads: uploadedText.trim(),
      });

      const addedAvoided = Math.round((seconds * 0.6) / 15) * 15;
      setWritingAvoidedSeconds((prev) => prev + addedAvoided);
      setOutputText(draft);
      setRecState("done");
    } catch (err: any) {
      setRecError(err?.message ?? "Transcription failed.");
      setRecState("done");
    } finally {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
      chunksRef.current = [];
    }
  }

  const selectedTemplate = templates.find((tpl) => tpl.id === templateId);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setUploading(true);

    try {
      const incoming = Array.from(files).map((file) => ({
        name: file.name,
        type: file.type,
      }));
      setUploadedItems((prev) => [...incoming, ...prev].slice(0, 8));

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
        setUploadedText((prev) => (prev ? `${prev}\n\n${parts.join("\n\n")}` : parts.join("\n\n")));
      }
    } catch (err: any) {
      setUploadError(err?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (recState !== "recording") return;
    const timer = window.setInterval(() => {
      setRecordingSeconds((prev) => {
        const next = prev + 1;
        recordingSecondsRef.current = next;
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [recState]);

  function buildDraft({
    transcript,
    notes,
    uploads,
  }: {
    transcript: string;
    notes: string;
    uploads: string;
  }) {
    const base = selectedTemplate?.body ?? "Structured draft\n\n{{TRANSCRIPT}}\n";
    const now = new Date().toISOString().slice(0, 10);
    const summary =
      language === "de"
        ? "Kurzfazit: Strukturierter Entwurf basierend auf Diktat, Notizen und Uploads."
        : language === "it"
          ? "Sintesi: bozza strutturata basata su dettato, note e allegati."
          : language === "fr"
            ? "Resume: brouillon structure base sur dictee, notes et pieces jointes."
            : "Summary: structured draft based on dictation, notes, and uploads.";

    const transcriptLabel =
      language === "de"
        ? "Transkript"
        : language === "it"
          ? "Trascritto"
          : language === "fr"
            ? "Transcription"
            : "Transcript";

    const parts = [
      tone ? `${t.recorder.toneLabel}: ${tone}` : "",
      uploads ? `${t.recorder.attachmentsTitle}:\n${uploads}` : "",
      notes ? `${t.recorder.notesLabel}:\n${notes}` : "",
      transcript ? `${transcriptLabel}:\n${transcript}` : "",
    ].filter(Boolean);

    const combined = parts.join("\n\n");
    const draft = fillTemplate(base, {
      DATE: now,
      PATIENT: "(initials / pseudonym)",
      FOCUS: "",
      PSYCHOSTATUS: "",
      ASSESSMENT: "",
      PLAN: "",
      COMPLAINT: "",
      SUMMARY: summary,
      TRANSCRIPT: combined,
    });

    return base.includes("{{SUMMARY}}") ? draft : `${draft}\n\n${summary}`;
  }

  function sendToLLM(payload: { transcript: string; notes: string; uploads: string }) {
    return new Promise<string>((resolve) => {
      const delay = 1000 + Math.random() * 700;
      window.setTimeout(() => {
        resolve(buildDraft(payload));
      }, delay);
    });
  }

  async function startRecording() {
    if (recState === "processing") return;
    if (openAiReady === false) {
      setRecError("OpenAI API key missing.");
      return;
    }
    setRecError(null);
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;
    setRecState("recording");
    setOutputText("");
    setPartial("");
    setFinalText("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        setRecState("processing");
        void transcribeAudio(mimeType, recordingSecondsRef.current);
      };

      recorder.start();
    } catch (err: any) {
      setRecError(err?.message ?? "Microphone permission required.");
      setRecState("idle");
    }
  }

  function pauseRecording() {
    const recorder = mediaRecorderRef.current;
    if (recState !== "recording" || !recorder) return;
    if (recorder.state !== "recording") return;
    recorder.pause();
    setRecState("paused");
  }

  function resumeRecording() {
    const recorder = mediaRecorderRef.current;
    if (recState !== "paused" || !recorder) return;
    if (recorder.state !== "paused") return;
    recorder.resume();
    setRecState("recording");
  }

  async function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (recState !== "recording" && recState !== "paused") return;
    if (!recorder) return;
    setRecState("processing");
    if (recorder.state !== "inactive") recorder.stop();
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
        <div className="rounded-[28px] border border-black/5 bg-gradient-to-br from-[#fdfbf7] via-[#fbf5eb] to-[#f6efe4] p-6 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">{t.workspace.title}</h2>
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
              {docType}
            </span>
          </div>

          <p className="mt-2 text-xs text-gray-500">{t.workspace.note}</p>

          <div className="mt-4 grid gap-4 md:grid-cols-3 items-stretch" data-tour="supplemental">
            <div className="flex flex-col gap-4">
              <div className="h-full rounded-2xl border border-black/5 bg-white/95 p-4 shadow-sm">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                    📄
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {t.recorder.uploadLabel}
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    className="w-full rounded-xl border bg-white px-3 py-2 text-xs"
                    type="file"
                    accept=".txt,.pdf,.docx,.doc,.md,.rtf"
                    aria-label={t.recorder.uploadLabel}
                    multiple
                    onChange={(e) => {
                      void handleFileUpload(e.target.files);
                      e.currentTarget.value = "";
                    }}
                    disabled={uploading}
                  />
                </div>
                {uploading ? (
                  <div className="mt-2 text-center text-[11px] text-blue-600">
                    {t.recorder.processingLabel}
                  </div>
                ) : null}
                {uploadError ? (
                  <div className="mt-2 text-center text-[11px] text-red-600">{uploadError}</div>
                ) : null}
              </div>

              <div className="h-full rounded-2xl border border-black/5 bg-white/95 p-4 shadow-sm">
                <div className="text-xs font-semibold text-gray-700">{t.recorder.attachmentsTitle}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {uploadedItems.length === 0 ? (
                    <span className="text-[11px] text-gray-400">{t.recorder.attachmentsEmpty}</span>
                  ) : (
                    uploadedItems.map((file, index) => (
                      <span
                        key={`${file.name}-${file.type}-${index}`}
                        className="rounded-full border bg-white px-2 py-1 text-[11px] text-gray-600"
                      >
                        📄 {file.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="h-full rounded-2xl border border-black/5 bg-white/90 p-4 shadow-sm flex flex-col">
              <div className="text-xs font-semibold text-gray-700">{t.recorder.toneLabel}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {t.recorder.tones.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      "rounded-full border px-3 py-1 text-[11px] font-semibold transition " +
                      (tone === option
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                    }
                    onClick={() => setTone(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-[11px] font-semibold text-gray-600">
                  {t.recorder.notesLabel}
                </label>
                <textarea
                  className="mt-2 h-32 w-full rounded-xl border bg-white px-3 py-2 text-xs"
                  value={supplementText}
                  onChange={(e) => setSupplementText(e.target.value)}
                  placeholder={t.supplemental.placeholder}
                  aria-label={t.recorder.notesLabel}
                />
              </div>

              <div className="mt-4">
                <label className="text-[11px] font-semibold text-gray-600">
                  {t.recorder.templateLabel}
                </label>
                <select
                  className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-xs"
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

            <div className="h-full rounded-2xl border border-black/5 bg-white/90 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {t.recorder.statusLabel}
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {recState === "done" ? t.recorder.status.idle : t.recorder.status[recState]}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-gray-400">
                    {t.recorder.timerLabel}
                  </div>
                  <div className="text-base font-semibold tabular-nums text-gray-900">
                    {formatHMS(recordingSeconds)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] items-center rounded-2xl border border-black/5 bg-white px-3 py-3">
                <div className="rounded-xl border border-dashed border-blue-100 bg-blue-50/40 px-3 py-4">
                  <svg viewBox="0 0 520 80" className="h-12 w-full">
                    <path
                      d="M0 40 L20 40 L30 20 L40 60 L50 30 L60 50 L70 10 L80 55 L90 35 L100 40 L120 40 L130 20 L140 60 L150 30 L160 50 L170 10 L180 55 L190 35 L200 40 L220 40 L230 20 L240 60 L250 30 L260 50 L270 10 L280 55 L290 35 L300 40 L320 40 L330 20 L340 60 L350 30 L360 50 L370 10 L380 55 L390 35 L400 40 L420 40 L430 20 L440 60 L450 30 L460 50 L470 10 L480 55 L490 35 L520 40"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="relative h-24 w-24 rounded-[28px] bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 shadow-lg">
                  <div className="absolute inset-x-0 top-4 mx-auto h-10 w-10 rounded-full bg-blue-300/60" />
                  <div className="absolute inset-x-0 top-8 mx-auto h-8 w-8 rounded-full bg-red-400 shadow-[0_6px_14px_rgba(248,113,113,0.45)]" />
                  <div className="absolute inset-x-0 bottom-2 mx-auto h-3 w-10 rounded-full bg-blue-900/60" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2" data-tour="rec-button">
                {(recState === "idle" || recState === "done") && (
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-lg hover:border-gray-400 disabled:opacity-40"
                    onClick={startRecording}
                    aria-label="Start recording"
                    disabled={recState === "processing" || openAiReady === false}
                  >
                    🔴
                  </button>
                )}
                {recState === "recording" && (
                  <>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-lg hover:border-gray-400 disabled:opacity-40"
                      onClick={pauseRecording}
                      aria-label="Pause recording"
                      disabled={recState === "processing" || openAiReady === false}
                    >
                      ⏸️
                    </button>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-lg hover:border-gray-400 disabled:opacity-40"
                      onClick={stopRecording}
                      aria-label="Stop recording"
                      disabled={recState === "processing" || openAiReady === false}
                    >
                      ⏹️
                    </button>
                  </>
                )}
                {recState === "paused" && (
                  <>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-lg hover:border-gray-400 disabled:opacity-40"
                      onClick={resumeRecording}
                      aria-label="Resume recording"
                      disabled={recState === "processing" || openAiReady === false}
                    >
                      🔴
                    </button>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-lg hover:border-gray-400 disabled:opacity-40"
                      onClick={stopRecording}
                      aria-label="Stop recording"
                      disabled={recState === "processing" || openAiReady === false}
                    >
                      ⏹️
                    </button>
                  </>
                )}
              </div>

              <div className="mt-3 rounded-xl border bg-white px-3 py-2 text-right">
                <div className="text-[11px] font-semibold text-blue-500">
                  {t.recorder.avoidedLabel}
                </div>
                <div className="text-base font-semibold tabular-nums text-gray-900">
                  {formatMMSS(writingAvoidedSeconds)}
                </div>
              </div>

              {recError ? (
                <div className="mt-2 text-[11px] text-red-600">{recError}</div>
              ) : null}
              {openAiReady === false ? (
                <div className="mt-2 text-[11px] text-gray-500">
                  OpenAI API key missing. Add <span className="font-mono">OPENAI_API_KEY</span> to{" "}
                  <span className="font-mono">.env.local</span>.
                </div>
              ) : null}

              <div className="mt-4 flex-1 flex flex-col">
                <div className="text-[11px] font-semibold text-gray-600">
                  {t.recorder.outputTitle}
                </div>
                <textarea
                  className="mt-2 min-h-[160px] w-full flex-1 rounded-xl border bg-white px-3 py-2 text-xs"
                  readOnly
                  value={outputText}
                  placeholder={t.recorder.outputPlaceholder}
                  aria-label={t.recorder.outputTitle}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                <span>{recState === "processing" ? t.recorder.processingLabel : ""}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 disabled:opacity-40"
                  onClick={async () => {
                    await navigator.clipboard.writeText(outputText);
                    alert(t.workspace.copied);
                  }}
                  disabled={!outputText}
                >
                  {t.workspace.copy}
                </button>
              </div>
            </div>
          </div>
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
