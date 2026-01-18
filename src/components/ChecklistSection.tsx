"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  icon: React.ReactNode;
  selectedCount: number;
  totalCount: number;
  children: React.ReactNode;
};

export function ChecklistSection({
  title,
  icon,
  selectedCount,
  totalCount,
  children,
}: Props) {
  const [open, setOpen] = useState(true);

  const badge = useMemo(() => {
    if (totalCount === 0) return null;
    return `${selectedCount}/${totalCount}`;
  }, [selectedCount, totalCount]);

  return (
    <section className="rounded-2xl border bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-700">{icon}</span>
          <div className="text-left">
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-gray-500">Auswahlen: {badge}</div>
          </div>
        </div>

        <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? <div className="px-2 pb-3">{children}</div> : null}
    </section>
  );
}
