"use client";

import { CheckSquare, Square } from "lucide-react";

type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
  hint?: string;
};

export function ChecklistItem({ label, checked, onToggle, hint }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left hover:bg-gray-50 active:bg-gray-100"
      aria-pressed={checked}
    >
      <span className="mt-0.5">
        {checked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
      </span>

      <span className="flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {hint ? <span className="block text-xs text-gray-500">{hint}</span> : null}
      </span>
    </button>
  );
}
