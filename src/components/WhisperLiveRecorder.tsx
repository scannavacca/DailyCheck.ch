"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { useOpenAIReady } from "@/lib/useOpenAIReady";

type Props = {
  language: string;
  model: string;
  useVAD: boolean;
  onPartial: (text: string) => void;
  onFinal: (text: string) => void;
  onStatus: (s: string) => void;
  onStop?: () => void;
  onStateChange?: (state: { recording: boolean; paused: boolean; elapsedSeconds: number }) => void;
  variant?: "full" | "compact";
  tourId?: string;
};

const copy = {
  de: {
    status: {
      mic: "Mikrofonberechtigung wird angefragt...",
      recording: "Aufnahme läuft...",
      uploading: "Audio wird hochgeladen...",
      transcribing: "Transkription läuft...",
      done: "Fertig.",
      error: "Transkription fehlgeschlagen.",
      paused: "Pausiert.",
    },
    title: "Diktat (OpenAI)",
    subtitle:
      "Audio wird zur Transkription gesendet. Ausgabe bitte prüfen, bevor sie als klinische Dokumentation genutzt wird.",
    start: "Aufnahme starten",
    pause: "Pause",
    resume: "Fortsetzen",
    stop: "Stopp",
  },
  en: {
    status: {
      mic: "Requesting microphone permission...",
      recording: "Recording...",
      uploading: "Uploading audio...",
      transcribing: "Transcribing...",
      done: "Done.",
      error: "Transcription failed.",
      paused: "Paused.",
    },
    title: "Dictation (OpenAI)",
    subtitle:
      "Audio is sent for transcription. Please review the output before using it as clinical documentation.",
    start: "Start recording",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
  },
  it: {
    status: {
      mic: "Richiesta autorizzazione microfono...",
      recording: "Registrazione in corso...",
      uploading: "Caricamento audio...",
      transcribing: "Trascrizione in corso...",
      done: "Fatto.",
      error: "Trascrizione non riuscita.",
      paused: "In pausa.",
    },
    title: "Dettatura (OpenAI)",
    subtitle:
      "L'audio viene inviato per la trascrizione. Rivedi l'output prima dell'uso clinico.",
    start: "Avvia registrazione",
    pause: "Pausa",
    resume: "Riprendi",
    stop: "Ferma",
  },
  fr: {
    status: {
      mic: "Demande d'autorisation micro...",
      recording: "Enregistrement...",
      uploading: "Televersement audio...",
      transcribing: "Transcription en cours...",
      done: "Termine.",
      error: "Echec de transcription.",
      paused: "En pause.",
    },
    title: "Dictee (OpenAI)",
    subtitle:
      "L'audio est envoye pour transcription. Merci de relire avant usage clinique.",
    start: "Demarrer l'enregistrement",
    pause: "Pause",
    resume: "Reprendre",
    stop: "Arreter",
  },
};

function PauseIcon() {
  return (
    <span className="flex h-4 w-4 items-center justify-between" aria-hidden="true">
      <span className="h-4 w-1 rounded-sm bg-gray-700" />
      <span className="h-4 w-1 rounded-sm bg-gray-700" />
    </span>
  );
}

function StopIcon() {
  return <span className="h-3 w-3 rounded-sm bg-gray-700" aria-hidden="true" />;
}

function getMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

export function WhisperLiveRecorder(props: Props) {
  const {
    language,
    onPartial,
    onFinal,
    onStatus,
    onStop,
    onStateChange,
    variant = "full",
    tourId,
  } = props;
  const { language: uiLanguage } = useLanguage();
  const t = copy[uiLanguage] ?? copy.en;
  const ready = useOpenAIReady();
  const disabled = ready === false;

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const onStopRef = useRef<Props["onStop"]>(onStop);

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!recording || paused) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [recording, paused]);

  useEffect(() => {
    onStateChange?.({ recording, paused, elapsedSeconds });
  }, [recording, paused, elapsedSeconds, onStateChange]);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, []);

  useEffect(() => {
    onStopRef.current = onStop;
  }, [onStop]);

  function cleanupStream() {
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    } catch {}
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
  }

  async function start() {
    if (recording || disabled) return;

    onStatus(t.status.mic);

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
        void transcribeAudio(mimeType);
      };

      recorder.start();
      setRecording(true);
      setPaused(false);
      setElapsedSeconds(0);
      onStatus(t.status.recording);
    } catch (err) {
      onStatus(t.status.error);
      cleanupStream();
    }
  }

  async function transcribeAudio(mimeType: string) {
    try {
      onStatus(t.status.uploading);

      const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
      const file = new File([blob], "recording.webm", { type: blob.type });

      const form = new FormData();
      form.append("file", file);
      form.append("language", language);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
      });

      onStatus(t.status.transcribing);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || "Transcription request failed.");
      }

      const data = (await res.json()) as { text?: string };
      const text = data.text ?? "";
      if (text) onFinal(text);
      onPartial("");
      onStatus(t.status.done);
    } catch (err) {
      onStatus(t.status.error);
    } finally {
      cleanupStream();
      setRecording(false);
      setPaused(false);
      setElapsedSeconds(0);
      if (onStopRef.current) {
        setTimeout(() => {
          onStopRef.current?.();
        }, 0);
      }
    }
  }

  function stop() {
    if (!recording) return;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    } else {
      cleanupStream();
      setRecording(false);
      setPaused(false);
      setElapsedSeconds(0);
      onStop?.();
    }
  }

  function togglePause() {
    const recorder = mediaRecorderRef.current;
    if (!recorder || !recording) return;
    if (paused) {
      recorder.resume();
      setPaused(false);
      onStatus(t.status.recording);
      return;
    }
    recorder.pause();
    setPaused(true);
    onStatus(t.status.paused);
  }

  if (variant === "compact") {
    return (
      <div
        className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border bg-white p-2 shadow-sm"
        data-tour={tourId}
      >
        <div className="text-[10px] font-semibold uppercase text-gray-500">Rec</div>
        <div className="mt-1 text-[11px] font-semibold text-gray-700">
          {`${Math.floor(elapsedSeconds / 60)}`.padStart(2, "0")}:
          {`${elapsedSeconds % 60}`.padStart(2, "0")}
        </div>
        <div className="mt-2 flex items-center gap-2">
          {!recording || paused ? (
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100"
              onClick={paused ? togglePause : start}
              aria-label={paused ? t.resume : t.start}
              disabled={disabled}
            >
              <span className={`h-3 w-3 rounded-full ${disabled ? "bg-gray-400" : "bg-red-600"}`} />
            </button>
          ) : (
            <>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
                onClick={togglePause}
                aria-label={t.pause}
              >
                <PauseIcon />
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-white hover:bg-gray-50"
                onClick={stop}
                aria-label={t.stop}
              >
                <StopIcon />
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-semibold">{t.title}</div>
          <div className="text-xs text-gray-500">{t.subtitle}</div>
          <div className="mt-2 text-xs font-semibold text-gray-700">
            {`${Math.floor(elapsedSeconds / 60)}`.padStart(2, "0")}:
            {`${elapsedSeconds % 60}`.padStart(2, "0")}
          </div>
        </div>

        {!recording ? (
          <button
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={start}
            disabled={disabled}
          >
            {t.start}
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              onClick={togglePause}
            >
              {paused ? t.resume : t.pause}
            </button>
            <button
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              onClick={stop}
            >
              {t.stop}
            </button>
          </div>
        )}
      </div>
      {disabled ? (
        <div className="text-xs text-gray-500">
          OpenAI API key missing. Add <span className="font-mono">OPENAI_API_KEY</span> to{" "}
          <span className="font-mono">.env.local</span>.
        </div>
      ) : null}
    </div>
  );
}
