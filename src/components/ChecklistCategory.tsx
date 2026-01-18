import type { ReactNode } from "react";

export type ChecklistItem = {
  id: string;
  label: string;
};

type ChecklistCategoryProps = {
  title: string;
  items: ChecklistItem[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
  helper?: ReactNode;
};

export function ChecklistCategory({
  title,
  items,
  selectedIds,
  onToggle,
  defaultOpen = false,
  helper,
}: ChecklistCategoryProps) {
  return (
    <details className="rounded-xl border bg-white px-4 py-3" defaultOpen={defaultOpen}>
      <summary className="cursor-pointer text-sm font-semibold">{title}</summary>
      {helper ? <div className="mt-1 text-xs text-gray-500">{helper}</div> : null}
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-start gap-3 text-sm text-gray-700"
          >
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4"
              checked={selectedIds.has(item.id)}
              onChange={() => onToggle(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </details>
  );
}
