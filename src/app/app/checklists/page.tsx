"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { ChecklistItem } from "@/components/ChecklistItem";
import { ChecklistSection } from "@/components/ChecklistSection";
import AnxietyDiagnosticChecklistSection from "@/components/AnxietyDiagnosticChecklistSection";
import DeterministicScaffoldChapter from "@/components/DeterministicScaffoldChapter";
import NonBpdPersonalityDisorderModule from "@/components/NonBpdPersonalityDisorderModule";
import { PSYCHOSTATUS_SECTIONS } from "@/lib/psychostatusCatalog";

type LocalChecklistItem = {
  id: string;
  label: string;
  kind?: "normal" | "finding" | "unassessable";
};

type LocalChecklistSection = {
  id: string;
  title: string;
  items: LocalChecklistItem[];
};

type ChecklistModule = {
  id: string;
  title: string;
  description?: string[];
  instructions?: string;
  structure?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  sections: LocalChecklistSection[];
};

function SectionIcon({ name }: { name: string }) {
  const Icon =
    (Icons as unknown as Record<string, import("lucide-react").LucideIcon>)[name] ??
    Icons.Square;

  return <Icon className="h-5 w-5" />;
}

const psychostatusSections: LocalChecklistSection[] = PSYCHOSTATUS_SECTIONS.map((section) => ({
  id: `psych-${section.id}`,
  title: section.title,
  items: section.items.map((item) => ({
    ...item,
    id: `psych-${item.id}`,
  })),
}));
const psychostatusIconMap = new Map(
  PSYCHOSTATUS_SECTIONS.map((section) => [`psych-${section.id}`, section.icon])
);

const modules: ChecklistModule[] = [
  {
    id: "psychostatus",
    title: "Psychopathologischer Befund - strukturierte Erhebung (Checkliste)",
    description: [
      "Diese Checkliste unterstuetzt die strukturierte Erfassung des psychopathologischen Befunds. Waehlen Sie pro Kategorie passende Merkmale (Normalbefund oder Auffaelligkeiten). Aus den gewaehlten Items kann eine saubere, klinische Formulierung fuer die Dokumentation generiert werden.",
      "Hinweis: Unterstuetzung der Dokumentation - keine automatische Diagnoseentscheidung.",
    ],
    instructions:
      "Kategorie oeffnen, Items anklicken. Optional: Normalbefund waehlen, falls unauffaellig. Zusammenfassung kopieren und in den Befund einfuegen.",
    structure: PSYCHOSTATUS_SECTIONS.map((section) => section.title),
    sections: psychostatusSections,
  },
  {
    id: "icd10",
    title: "ICD-10 Kategorien",
    description: [
      "Schneller Zugriff auf ICD-10 Kategorien fuer die Dokumentation.",
      "Nutzen Sie die Liste, um passende Kategorien zu finden und zu uebernehmen.",
    ],
    instructions: "Oeffnen Sie die ICD-10 Kategorien und suchen Sie nach passenden Codes.",
    ctaLabel: "ICD-10 Kategorien oeffnen",
    ctaHref: "/app/icd10",
    sections: [],
  },
  {
    id: "unipolar",
    title: "Unipolare Depression",
    sections: [
      {
        id: "unipolar-zeit",
        title: "Zeitkriterien",
        items: [
          { id: "unipolar-zeit-2wochen", label: "Depressive Symptome >= 2 Wochen", kind: "finding" },
          { id: "unipolar-zeit-taeglich", label: "Fast taeglich vorhanden", kind: "finding" },
          { id: "unipolar-zeit-leidensdruck", label: "Klinischer Leidensdruck oder Beeintraechtigung", kind: "finding" },
        ],
      },
      {
        id: "unipolar-verlauf",
        title: "Verlauf",
        items: [
          { id: "unipolar-verlauf-erstepisode", label: "Erstmalige Episode", kind: "finding" },
          { id: "unipolar-verlauf-rezidiv", label: "Rezidivierender Verlauf", kind: "finding" },
          { id: "unipolar-verlauf-keine-manie", label: "Keine manische Episode bekannt", kind: "finding" },
        ],
      },
      {
        id: "unipolar-symptome",
        title: "Symptomen",
        items: [
          { id: "unipolar-symptome-stimmung", label: "Gedrueckte Stimmung", kind: "finding" },
          { id: "unipolar-symptome-anhedonie", label: "Interessenverlust / Anhedonie", kind: "finding" },
          { id: "unipolar-symptome-antrieb", label: "Antriebsminderung", kind: "finding" },
          { id: "unipolar-symptome-schlaf", label: "Schlafstoerung", kind: "finding" },
          { id: "unipolar-symptome-appetit", label: "Appetit- oder Gewichtsveraenderung", kind: "finding" },
          { id: "unipolar-symptome-konzentration", label: "Konzentrationsstoerung", kind: "finding" },
          { id: "unipolar-symptome-selbstwert", label: "Selbstwert vermindert / Schuldgefuehle", kind: "finding" },
          { id: "unipolar-symptome-suizid", label: "Suizidgedanken", kind: "finding" },
        ],
      },
    ],
  },
  {
    id: "bipolar",
    title: "Bipolare Depression",
    sections: [
      {
        id: "bipolar-zeit",
        title: "Zeitkriterien",
        items: [
          { id: "bipolar-zeit-2wochen", label: "Depressive Symptome >= 2 Wochen", kind: "finding" },
          { id: "bipolar-zeit-taeglich", label: "Fast taeglich vorhanden", kind: "finding" },
        ],
      },
      {
        id: "bipolar-verlauf",
        title: "Verlauf",
        items: [
          { id: "bipolar-verlauf-manie", label: "Vorgeschichte manischer Episode", kind: "finding" },
          { id: "bipolar-verlauf-hypomanie", label: "Vorgeschichte hypomanischer Episode", kind: "finding" },
          { id: "bipolar-verlauf-wechsel", label: "Wechselnde Episoden (manisch/depressiv)", kind: "finding" },
        ],
      },
      {
        id: "bipolar-symptome",
        title: "Symptomen",
        items: [
          { id: "bipolar-symptome-stimmung", label: "Gedrueckte Stimmung", kind: "finding" },
          { id: "bipolar-symptome-anhedonie", label: "Interessenverlust / Anhedonie", kind: "finding" },
          { id: "bipolar-symptome-antrieb", label: "Antriebsminderung", kind: "finding" },
          { id: "bipolar-symptome-schlaf", label: "Schlafstoerung", kind: "finding" },
          { id: "bipolar-symptome-suizid", label: "Suizidgedanken", kind: "finding" },
        ],
      },
    ],
  },
  {
    id: "schizophrenie",
    title: "Schizophrenie",
    sections: [
      {
        id: "schizophrenie-zeit",
        title: "Zeitkriterien",
        items: [
          { id: "schizophrenie-zeit-1monat", label: "Kernsymptome >= 1 Monat", kind: "finding" },
          { id: "schizophrenie-zeit-6monate", label: "Gesamtdauer >= 6 Monate (inkl. prodromal/residual)", kind: "finding" },
        ],
      },
      {
        id: "schizophrenie-verlauf",
        title: "Verlauf",
        items: [
          { id: "schizophrenie-verlauf-chronisch", label: "Chronischer oder rezidivierender Verlauf", kind: "finding" },
          { id: "schizophrenie-verlauf-funktion", label: "Soziale/berufliche Funktionsbeeintraechtigung", kind: "finding" },
        ],
      },
      {
        id: "schizophrenie-symptome",
        title: "Symptomen",
        items: [
          { id: "schizophrenie-symptome-wahn", label: "Wahn", kind: "finding" },
          { id: "schizophrenie-symptome-hall", label: "Halluzinationen", kind: "finding" },
          { id: "schizophrenie-symptome-ich", label: "Ich-Stoerungen", kind: "finding" },
          { id: "schizophrenie-symptome-formal", label: "Formale Denkstoerungen", kind: "finding" },
          { id: "schizophrenie-symptome-negativ", label: "Negativsymptome", kind: "finding" },
          { id: "schizophrenie-symptome-desorg", label: "Desorganisiertes Verhalten", kind: "finding" },
        ],
      },
    ],
  },
  {
    id: "anorexia",
    title: "Anorexia Nervosa",
    sections: [
      {
        id: "anorexia-zeit",
        title: "Zeitkriterien",
        items: [
          { id: "anorexia-zeit-3monate", label: "Restriktives Essverhalten >= 3 Monate", kind: "finding" },
          { id: "anorexia-zeit-persistenz", label: "Anhaltende Untergewichtsphase", kind: "finding" },
        ],
      },
      {
        id: "anorexia-verlauf",
        title: "Verlauf",
        items: [
          { id: "anorexia-verlauf-gewicht", label: "Aktiver Gewichtsverlust oder Gewichtserhalt durch Restriktion", kind: "finding" },
          { id: "anorexia-verlauf-kompensation", label: "Kompensatorisches Verhalten (z.B. Erbrechen/Laxantien)", kind: "finding" },
          { id: "anorexia-verlauf-koerperbild", label: "Koerperbildstoerung persistiert", kind: "finding" },
        ],
      },
      {
        id: "anorexia-symptome",
        title: "Symptomen",
        items: [
          { id: "anorexia-symptome-untergewicht", label: "Deutliches Untergewicht", kind: "finding" },
          { id: "anorexia-symptome-angst", label: "Ausgepraegte Angst vor Gewichtszunahme", kind: "finding" },
          { id: "anorexia-symptome-gestoert", label: "Gestorte Koerperwahrnehmung", kind: "finding" },
          { id: "anorexia-symptome-restriktion", label: "Restriktives Essverhalten", kind: "finding" },
        ],
      },
    ],
  },
];

const moduleJumpOptions = [
  {
    id: "personality-diagnostic-module",
    label: "Persoenlichkeitsstoerungen - Diagnostikmodul (Deterministisch)",
  },
  {
    id: "anxiety-diagnostic-module",
    label: "Angststoerungen - Diagnostik (deterministische Dokumentation)",
  },
  {
    id: "bpd-module",
    label: "Borderline Personality Disorder Module (Deterministic)",
  },
  {
    id: "ptsd-module",
    label: "PTSD Module (Deterministic)",
  },
  {
    id: "ocd-zwangsstoerung-module",
    label: "OCD / Zwangsstoerung Module (Deterministic)",
  },
  {
    id: "bipolar-spectrum-module",
    label: "Bipolar Spectrum Module (Deterministic)",
  },
  {
    id: "psychosis-schizophrenia-module",
    label: "Psychosis / Schizophrenia Module (Deterministic)",
  },
  {
    id: "amdp-symptom-checklist",
    label: "Clickable Symptom Checklist (AMDP-inspired, reworded)",
  },
];

const sectionIndex = new Map<string, LocalChecklistSection>();
modules.forEach((module) => {
  module.sections.forEach((section) => {
    sectionIndex.set(section.id, section);
  });
});

function buildModuleSummary(module: ChecklistModule, selected: Set<string>) {
  const lines: string[] = [];

  module.sections.forEach((section) => {
    const selectedItems = section.items.filter((item) => selected.has(item.id));
    if (!selectedItems.length) return;

    if (module.id === "psychostatus") {
      const normals = selectedItems.filter((item) => item.kind === "normal");
      const unassessable = selectedItems.filter((item) => item.kind === "unassessable");
      const findings = selectedItems.filter((item) => item.kind === "finding" || !item.kind);

      if (normals.length > 0 && findings.length === 0 && unassessable.length === 0) {
        lines.push(`${section.title}: ${normals.map((item) => item.label).join(", ")}.`);
        return;
      }

      const parts: string[] = [];
      if (unassessable.length > 0) parts.push(unassessable.map((item) => item.label).join(", "));
      if (findings.length > 0) parts.push(findings.map((item) => item.label).join(", "));
      if (normals.length > 0) parts.push("sonst unauffaellig");

      lines.push(`${section.title}: ${parts.join("; ")}.`);
      return;
    }

    lines.push(`${section.title}: ${selectedItems.map((item) => item.label).join(", ")}.`);
  });

  if (!lines.length) return null;

  return [module.title, ...lines.map((line) => `- ${line}`)].join("\n");
}

function buildSummary(selected: Set<string>) {
  if (selected.size === 0) return "";

  const blocks: string[] = [];

  modules.forEach((module) => {
    const block = buildModuleSummary(module, selected);
    if (block) blocks.push(block);
  });

  if (!blocks.length) return "";

  return [
    "Generierte Zusammenfassung",
    "",
    ...blocks.join("\n\n").split("\n"),
    "",
    "Hinweis: Dieses Tool dient der Befundstrukturierung und Dokumentation. Diagnosen und Entscheidungen bleiben in der Verantwortung der behandelnden Person.",
  ].join("\n");
}

export default function ChecklistsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [jumpTarget, setJumpTarget] = useState("");

  const summaryText = useMemo(() => buildSummary(selected), [selected]);

  function toggleItem(sectionId: string, itemId: string) {
    const section = sectionIndex.get(sectionId);
    const item = section?.items.find((entry) => entry.id === itemId);

    setSelected((prev) => {
      const next = new Set(prev);
      const isSelected = next.has(itemId);

      if (isSelected) {
        next.delete(itemId);
        return next;
      }

      next.add(itemId);

      if (section && item?.kind === "normal") {
        for (const it of section.items) {
          if (it.id !== itemId) next.delete(it.id);
        }
      } else if (section) {
        for (const it of section.items) {
          if (it.kind === "normal") next.delete(it.id);
        }
      }

      return next;
    });

    setCopied(false);
  }

  async function copySummary() {
    if (!summaryText.trim()) return;
    if (!navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function clearSelections() {
    setSelected(new Set());
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Checklisten</h1>
        <p className="text-sm text-gray-700">
          Strukturierte Checklisten fuer Befund, Verlauf und Symptomatik. Auswahl wird direkt in die
          Zusammenfassung uebernommen.
        </p>
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Zum Modul springen
          </label>
          <select
            className="mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            value={jumpTarget}
            onChange={(event) => {
              const value = event.target.value;
              setJumpTarget(value);
              if (!value) return;
              const target = document.getElementById(value);
              if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <option value="">Modul auswaehlen...</option>
            {moduleJumpOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="space-y-4">
          {modules.map((module) => {
            const moduleSelectedCount =
              module.sections.length > 0
                ? module.sections.reduce(
                    (count, section) =>
                      count + section.items.filter((item) => selected.has(item.id)).length,
                    0
                  )
                : null;

            return (
              <details key={module.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold">
                  <span>{module.title}</span>
                  {moduleSelectedCount !== null ? (
                    <span className="rounded-full border px-2 py-1 text-xs text-gray-500">
                      {moduleSelectedCount} ausgewaehlt
                    </span>
                  ) : (
                    <span className="rounded-full border px-2 py-1 text-xs text-gray-500">Tool</span>
                  )}
                </summary>

                <div className="mt-4 space-y-4">
                  {module.description?.map((paragraph) => (
                    <p key={paragraph} className="text-sm text-gray-700">
                      {paragraph}
                    </p>
                  ))}

                  {module.instructions ? (
                    <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
                      <div className="text-xs font-semibold text-gray-600">Anleitung</div>
                      <p className="mt-2">{module.instructions}</p>
                    </div>
                  ) : null}
                  {module.ctaHref ? (
                    <div>
                      <Link
                        className="inline-flex items-center rounded-xl border bg-white px-4 py-2 text-xs font-semibold hover:bg-gray-50"
                        href={module.ctaHref}
                      >
                        {module.ctaLabel ?? "Oeffnen"}
                      </Link>
                    </div>
                  ) : null}

                  {module.structure ? (
                    <div className="rounded-xl border bg-white p-3">
                      <div className="text-xs font-semibold text-gray-600">Struktur (Cluster-Uebersicht)</div>
                      <ul className="mt-2 grid gap-1 text-xs text-gray-600 md:grid-cols-2">
                        {module.structure.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    {module.sections.map((section) => {
                      const selectedCount = section.items.filter((item) => selected.has(item.id)).length;

                      if (module.id === "psychostatus") {
                        return (
                          <ChecklistSection
                            key={section.id}
                            title={section.title}
                            icon={<SectionIcon name={psychostatusIconMap.get(section.id) ?? "Square"} />}
                            selectedCount={selectedCount}
                            totalCount={section.items.length}
                          >
                            <div className="flex flex-col gap-1">
                              {section.items.map((item) => (
                                <ChecklistItem
                                  key={item.id}
                                  label={item.label}
                                  checked={selected.has(item.id)}
                                  onToggle={() => toggleItem(section.id, item.id)}
                                />
                              ))}
                            </div>
                          </ChecklistSection>
                        );
                      }

                      return (
                        <div key={section.id} className="rounded-xl border bg-white p-3">
                          <div className="text-sm font-semibold">{section.title}</div>
                          <div className="mt-2 flex flex-col gap-1">
                            {section.items.map((item) => (
                              <ChecklistItem
                                key={item.id}
                                label={item.label}
                                checked={selected.has(item.id)}
                                onToggle={() => toggleItem(section.id, item.id)}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </details>
            );
          })}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold">Generierte Zusammenfassung</div>
                <div className="text-xs text-gray-500">Nicht gespeichert. Direkt kopierbar.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                  onClick={clearSelections}
                >
                  Auswahl loeschen
                </button>
                <button
                  type="button"
                  className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  onClick={copySummary}
                  disabled={!summaryText.trim()}
                >
                  {copied ? "Kopiert" : "Zusammenfassung kopieren"}
                </button>
              </div>
            </div>

            <textarea
              className="mt-3 h-[520px] w-full resize-none rounded-xl border bg-white p-3 text-xs"
              value={summaryText}
              readOnly
              placeholder="Waehlen Sie Items aus, um die Zusammenfassung zu erzeugen."
            />
          </div>

          <div className="rounded-2xl border bg-white p-4 text-xs text-gray-500 shadow-sm">
            Dieses Tool dient der Befundstrukturierung und Dokumentation. Diagnosen und Entscheidungen
            bleiben in der Verantwortung der behandelnden Person.
          </div>
        </section>
      </div>

      <DeterministicScaffoldChapter />

      <details className="rounded-2xl border bg-white shadow-sm" id="personality-diagnostic-module">
        <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-gray-900">
          Persoenlichkeitsstoerungen - Diagnostikmodul (Deterministisch)
        </summary>
        <div className="px-6 pb-6">
          <NonBpdPersonalityDisorderModule />
        </div>
      </details>

      <details className="rounded-2xl border bg-white shadow-sm" id="anxiety-diagnostic-module">
        <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-gray-900">
          Angststoerungen - Diagnostik (deterministische Dokumentation)
        </summary>
        <div className="px-6 pb-6">
          <AnxietyDiagnosticChecklistSection />
        </div>
      </details>
    </div>
  );
}
