"use client";

import { useEffect, useState } from "react";

export function useOpenAIReady() {
  const [ready, setReady] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/health/openai", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setReady(Boolean(data?.ok));
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
