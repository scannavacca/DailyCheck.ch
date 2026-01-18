"use client";

import { useMemo, useState } from "react";
import { useOpenAIReady } from "@/lib/useOpenAIReady";

export default function OpenAIHealthBanner() {
  const ready = useOpenAIReady();
  const [dismissed, setDismissed] = useState(false);

  const show = useMemo(() => ready === false && !dismissed, [ready, dismissed]);
  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur">
        <div className="flex items-start gap-3 px-4 py-3">
          <div className="mt-0.5 h-2.5 w-2.5 flex-none rounded-full bg-amber-500" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-black/90">OpenAI not configured</div>
            <div className="mt-0.5 text-sm text-black/60">
              Add <span className="font-mono text-black/70">OPENAI_API_KEY</span> to{" "}
              <span className="font-mono text-black/70">.env.local</span> and restart the dev
              server. Dictation and chat are disabled until then.
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="ml-auto rounded-xl border border-black/10 bg-white/60 px-3 py-1.5 text-sm text-black/70 hover:bg-white/80 active:bg-white"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
