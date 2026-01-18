import { getLikelihoodLabel, type Likelihood, type ScoredDiagnosis } from "@/lib/scoring";

const badgeStyles: Record<Likelihood, string> = {
  high: "bg-[color:#cbe9cf]",
  moderate: "bg-[color:#f5e4b9]",
  low: "bg-[color:#f3c7c7]",
};

export type DiagnosisPanelProps = {
  diagnoses: ScoredDiagnosis[];
  selectedCount: number;
  onExport: () => void;
};

export function DiagnosisPanel({ diagnoses, selectedCount, onExport }: DiagnosisPanelProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold">Diagnosis suggestions</div>
          <div className="text-xs text-gray-500">
            Rule-based weights normalized to a 0-100 likelihood score.
          </div>
        </div>
        <button
          type="button"
          className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          onClick={onExport}
        >
          Export summary
        </button>
      </div>

      {selectedCount === 0 ? (
        <div className="mt-4 text-sm text-gray-600">
          Select checklist items to see ranked ICD-10 groups.
        </div>
      ) : diagnoses.length === 0 ? (
        <div className="mt-4 text-sm text-gray-600">
          No matching scoring rules yet for the selected pattern.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {diagnoses.map((diagnosis) => (
            <div
              key={`${diagnosis.code}-${diagnosis.name}`}
              className="rounded-xl border bg-gray-50 px-3 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-600">{diagnosis.code}</div>
                  <div className="text-sm text-gray-800">{diagnosis.name}</div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${badgeStyles[diagnosis.likelihood]}`}
                >
                  {getLikelihoodLabel(diagnosis.likelihood)} · {diagnosis.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
