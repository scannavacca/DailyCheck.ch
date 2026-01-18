"use client";

import type { CSSProperties } from "react";

type Props = {
  accentColor?: string;
  className?: string;
};

export default function VoiceToTextDiagram({
  accentColor = "#ef4444",
  className = "",
}: Props) {
  const fontStyle: CSSProperties = {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  };

  return (
    <div className={`w-full bg-white ${className}`} style={fontStyle}>
      <div className="mx-auto flex max-w-[900px] items-center justify-center gap-6 overflow-x-auto px-4 py-10">
        <Step
          title="Microphone"
          subtitle="Input"
          icon={
            <MicIcon accentColor={accentColor} />
          }
        />
        <Arrow />
        <Step
          title="LLM Template"
          subtitle="Processing"
          icon={
            <BrainIcon accentColor={accentColor} />
          }
        />
        <Arrow />
        <Step
          title="Text"
          subtitle="Output"
          icon={
            <DocIcon accentColor={accentColor} />
          }
        />
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-w-[200px] flex-col items-center text-center">
      <div className="mb-3 h-16 w-16 md:h-20 md:w-20">{icon}</div>
      <div className="text-lg font-medium text-gray-900 md:text-xl">{title}</div>
      <div className="mt-1 text-xs text-gray-500 md:text-sm">{subtitle}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 80 16"
        className="h-4 w-10 text-gray-700 md:w-14"
      >
        <line x1="0" y1="8" x2="68" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <polyline
          points="62,3 68,8 62,13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function MicIcon({ accentColor }: { accentColor: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-full w-full">
      <rect
        x="24"
        y="8"
        width="16"
        height="28"
        rx="8"
        fill="none"
        stroke="#111827"
        strokeWidth="2"
      />
      <line x1="32" y1="36" x2="32" y2="46" stroke={accentColor} strokeWidth="2" />
      <path d="M18 28v6a14 14 0 0 0 28 0v-6" fill="none" stroke="#111827" strokeWidth="2" />
      <line x1="24" y1="52" x2="40" y2="52" stroke="#111827" strokeWidth="2" />
    </svg>
  );
}

function BrainIcon({ accentColor }: { accentColor: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-full w-full">
      <path
        d="M22 20c0-6 5-10 10-10 3 0 6 1 8 3 2-2 5-3 8-3 6 0 10 4 10 10 0 3-1 6-3 8 2 2 3 5 3 8 0 6-4 10-10 10-3 0-6-1-8-3-2 2-5 3-8 3-5 0-10-4-10-10 0-3 1-6 3-8-2-2-3-5-3-8z"
        fill="none"
        stroke="#111827"
        strokeWidth="2"
      />
      <rect
        x="28"
        y="28"
        width="8"
        height="8"
        rx="1"
        fill="none"
        stroke={accentColor}
        strokeWidth="2"
      />
      <line x1="32" y1="24" x2="32" y2="28" stroke={accentColor} strokeWidth="2" />
      <line x1="32" y1="36" x2="32" y2="40" stroke={accentColor} strokeWidth="2" />
      <line x1="24" y1="32" x2="28" y2="32" stroke={accentColor} strokeWidth="2" />
      <line x1="36" y1="32" x2="40" y2="32" stroke={accentColor} strokeWidth="2" />
    </svg>
  );
}

function DocIcon({ accentColor }: { accentColor: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="h-full w-full">
      <path
        d="M20 10h20l8 8v36H20z"
        fill="none"
        stroke="#111827"
        strokeWidth="2"
      />
      <path d="M40 10v10h10" fill="none" stroke="#111827" strokeWidth="2" />
      <line x1="26" y1="30" x2="46" y2="30" stroke={accentColor} strokeWidth="2" />
      <line x1="26" y1="36" x2="46" y2="36" stroke={accentColor} strokeWidth="2" />
      <line x1="26" y1="42" x2="40" y2="42" stroke={accentColor} strokeWidth="2" />
    </svg>
  );
}
