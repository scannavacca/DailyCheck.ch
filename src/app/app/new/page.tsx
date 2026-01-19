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

function getMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4;codecs=mp4a.40.2", "audio/mp4"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function getFileName(mimeType: string) {
  if (mimeType.includes("mp4")) return "recording.m4a";
  return "recording.webm";
}

const AVOIDED_WEEK_KEY = "weekly_avoided_week";
const AVOIDED_SECONDS_KEY = "weekly_avoided_seconds";
const BASELINE_SECONDS = 15 * 60;
const EDIT_BUFFER_SECONDS = 5 * 60;

function getWeekStartISO(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function formatHHMM(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}`.padStart(2, "0") + ":" + `${minutes}`.padStart(2, "0");
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
      outputPlaceholder: "Your structured draft will appear here...",
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
      outputPlaceholder: "Your structured draft will appear here...",
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
      outputPlaceholder: "Your structured draft will appear here...",
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

  const waveBars = useMemo(() => Array.from({ length: 18 }, (_, i) => i), []);
  const waveActive = recState === "recording";
  const toneStyles: Record<string, string> = {
    Professional: "bg-blue-600 text-white",
    Neutral: "bg-slate-200 text-slate-700",
    Urgent: "bg-orange-500 text-white",
  };
  useEffect(() => {
    setTone(copy[language].recorder.tones[0]);
  }, [language]);

  useEffect(() => {
    const weekStart = getWeekStartISO(new Date());
    const storedWeek = localStorage.getItem(AVOIDED_WEEK_KEY);
    const storedSeconds = Number(localStorage.getItem(AVOIDED_SECONDS_KEY) ?? "0");

    if (storedWeek !== weekStart) {
      localStorage.setItem(AVOIDED_WEEK_KEY, weekStart);
      localStorage.setItem(AVOIDED_SECONDS_KEY, "0");
      setWritingAvoidedSeconds(0);
      return;
    }

    setWritingAvoidedSeconds(Number.isFinite(storedSeconds) ? storedSeconds : 0);
  }, []);

  useEffect(() => {
    const weekStart = getWeekStartISO(new Date());
    localStorage.setItem(AVOIDED_WEEK_KEY, weekStart);
    localStorage.setItem(AVOIDED_SECONDS_KEY, String(writingAvoidedSeconds));
  }, [writingAvoidedSeconds]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      mediaRecorderRef.current = null;
      chunksRef.current = [];
    };
  }, []);

  async function transcribeAudio(mimeType: string, seconds: number) {
    try {
      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      if (blob.size < 1024) {
        setRecError("No audio captured. Try again.");
        setRecState("done");
        return;
      }
      const file = new File([blob], getFileName(blob.type), { type: blob.type });
      const form = new FormData();
      form.append("file", file);
      form.append("language", language);

      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message = body?.detail
          ? `${body?.error || "Transcription failed"}: ${body.detail}`
          : body?.error;
        throw new Error(message || `Transcription failed (${res.status})`);
      }

      const data = (await res.json()) as { text?: string };
      const transcript = data.text?.trim() ?? "";
      const draft = await sendToLLM({
        transcript,
        notes: supplementText.trim(),
        uploads: uploadedText.trim(),
      });

      const actual = seconds + EDIT_BUFFER_SECONDS;
      const avoided = Math.max(0, BASELINE_SECONDS - actual);
      setWritingAvoidedSeconds((prev) => prev + avoided);
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

  async function sendToLLM(payload: { transcript: string; notes: string; uploads: string }) {
    const templateBody = selectedTemplate?.body ?? "";
    if (!templateBody) {
      return buildDraft(payload);
    }

    const supplemental = [payload.notes, payload.uploads].filter(Boolean).join("\n\n");

    const res = await fetch("/api/generate-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template: templateBody,
        transcript: payload.transcript,
        supplemental,
        language,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body?.detail ? `${body?.error || "Draft failed"}: ${body.detail}` : body?.error;
      throw new Error(message || `Draft failed (${res.status})`);
    }

    const data = (await res.json()) as { draft?: string };
    return data.draft?.trim() || buildDraft(payload);
  }

  useEffect(() => {
    if (recState === "processing") return;
    const transcript = "";
    const notes = supplementText.trim();
    const uploads = uploadedText.trim();
    if (!notes && !uploads) return;
    setOutputText(buildDraft({ transcript, notes, uploads }));
  }, [supplementText, uploadedText, recState, templateId, language]);

  async function startRecording() {
    if (recState === "processing") return;
    if (openAiReady === false) {
      setRecError("OpenAI API key missing.");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setRecError("Recording is not supported in this browser.");
      return;
    }
    setRecError(null);
    setRecordingSeconds(0);
    recordingSecondsRef.current = 0;
    setRecState("recording");
    setOutputText(
      buildDraft({ transcript: "", notes: supplementText.trim(), uploads: uploadedText.trim() })
    );

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

      recorder.start(500);
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
    if (recorder.state === "recording") {
      recorder.requestData();
    }
    if (recorder.state !== "inactive") recorder.stop();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">{t.title}</h1>

      <div className="rounded-[32px] border border-black/5 bg-gradient-to-br from-[#fdfcf8] via-[#f7f1e7] to-[#f3ece2] p-6 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.5)]">
        <div className="grid gap-6 lg:grid-cols-[1fr_2.35fr]">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.35)]">
              <label className="relative flex cursor-pointer flex-col items-center gap-3 text-center">
                <input
                  className="sr-only"
                  type="file"
                  accept=".txt,.pdf,.docx,.doc"
                  multiple
                  aria-label={t.recorder.uploadLabel}
                  onChange={(e) => {
                    void handleFileUpload(e.target.files);
                    e.currentTarget.value = "";
                  }}
                  disabled={uploading}
                />
                <svg viewBox="0 0 64 64" className="h-12 w-12 text-blue-500">
                  <path
                    d="M18 8h20l8 8v32H18z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M38 8v12h12" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M32 42V24" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M24 32l8-8 8 8" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">{t.recorder.uploadLabel}</span>
              </label>
              {uploading ? (
                <div className="mt-3 text-center text-[11px] text-blue-600">
                  {t.recorder.processingLabel}
                </div>
              ) : null}
              {uploadError ? (
                <div className="mt-3 text-center text-[11px] text-red-600">{uploadError}</div>
              ) : null}
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white/90 p-4 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.35)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                {t.recorder.attachmentsTitle}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
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

          <div className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.35)] flex flex-col gap-6">
            <div data-tour="doc-steps">
              <div className="flex flex-wrap gap-2">
                {t.recorder.tones.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={
                      "rounded-full px-4 py-1 text-xs font-semibold transition shadow-sm " +
                      (tone === option
                        ? toneStyles[option] ?? "bg-blue-600 text-white"
                        : (toneStyles[option] ?? "bg-gray-100 text-gray-600") +
                          " opacity-60 hover:opacity-100")
                    }
                    onClick={() => setTone(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <textarea
                className="mt-4 h-40 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-gray-700"
                value={supplementText}
                onChange={(e) => setSupplementText(e.target.value)}
                placeholder={t.supplemental.placeholder}
                aria-label={t.recorder.notesLabel}
                data-tour="supplemental"
              />

              <div className="mt-4">
                <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  {t.recorder.templateLabel}
                </label>
                <select
                  className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-3 py-2 text-xs text-gray-700"
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

            <div className="h-px w-full bg-black/5" />

            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2" data-tour="rec-button">
                  {(recState === "idle" || recState === "done") && (
                    <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-lg shadow-sm hover:border-gray-400 disabled:opacity-40"
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
                      className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-lg shadow-sm hover:border-gray-400 disabled:opacity-40"
                      onClick={pauseRecording}
                      aria-label="Pause recording"
                      disabled={recState === "processing" || openAiReady === false}
                    >
                      ⏸️
                    </button>
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-lg shadow-sm hover:border-gray-400 disabled:opacity-40"
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
                      className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-lg shadow-sm hover:border-gray-400 disabled:opacity-40"
                      onClick={resumeRecording}
                      aria-label="Resume recording"
                      disabled={recState === "processing" || openAiReady === false}
                    >
                      🔴
                    </button>
                    <button
                      type="button"
                      className="flex h-11 w-11 items-center justify-center rounded-full border bg-white text-lg shadow-sm hover:border-gray-400 disabled:opacity-40"
                      onClick={stopRecording}
                      aria-label="Stop recording"
                      disabled={recState === "processing" || openAiReady === false}
                    >
                      ⏹️
                    </button>
                  </>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-400">
                {recState === "processing" ? t.recorder.processingLabel : ""}
              </span>
            </div>

            <div className="relative mt-4 rounded-2xl border border-black/10 bg-white/90 px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 flex-1 items-end gap-1">
                  {waveBars.map((bar) => (
                    <span
                      key={bar}
                      className={`wave-bar ${waveActive ? "wave-active" : ""}`}
                      style={{ animationDelay: `${bar * 0.08}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

              <div className="mt-4 text-3xl font-semibold tabular-nums text-gray-900">
                {formatHMS(recordingSeconds)}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {t.recorder.avoidedLabel}: {formatHHMM(writingAvoidedSeconds)}
              </div>

              {recError ? <div className="mt-2 text-[11px] text-red-600">{recError}</div> : null}
              {openAiReady === false ? (
                <div className="mt-2 text-[11px] text-gray-500">
                  OpenAI API key missing. Add <span className="font-mono">OPENAI_API_KEY</span> to{" "}
                  <span className="font-mono">.env.local</span>.
                </div>
              ) : null}

              <div className="mt-5 flex-1 flex flex-col">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                  {t.recorder.outputTitle}
                </div>
                <div className="mt-2 flex-1 rounded-2xl border border-black/5 bg-white/80 p-3 text-xs text-gray-700 whitespace-pre-wrap">
                  {outputText ? (
                    outputText
                  ) : (
                    <span className="text-gray-400">{t.recorder.outputPlaceholder}</span>
                  )}
                </div>
                <div className="mt-3 flex justify-end">
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
        </div>
      </div>

      <style jsx>{`
        .wave-bar {
          width: 6px;
          height: 16px;
          border-radius: 999px;
          background: #7fcfe5;
          opacity: 0.7;
          transform-origin: bottom;
        }
        .wave-active {
          animation: wave 1.15s ease-in-out infinite;
        }
        @keyframes wave {
          0% {
            height: 10px;
            opacity: 0.5;
          }
          50% {
            height: 44px;
            opacity: 0.95;
          }
          100% {
            height: 16px;
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
