"use client";

import { useMemo, useState } from "react";
import icd10Data from "@/data/icd10.json";
import { getLikelihood, normalizeIcdCode, type Likelihood } from "@/lib/scoring";

type IcdEntry = { code: string; name: string };

type CriteriaItem = {
  id: string;
  label: string;
  weights: Record<string, number>;
};

type CriteriaGroup = {
  id: string;
  title: string;
  description: string;
  items: CriteriaItem[];
};

type Chapter = {
  id: string;
  range: string;
  title: string;
  letter: "F" | "Z";
  start: number;
  end: number;
};

type Diagnosis = {
  code: string;
  name: string;
  normalized: string;
};

type DiagnosisSubgroup = {
  code: string;
  name: string;
  items: Diagnosis[];
};

type DiagnosisGroup = {
  code: string;
  title: string;
  subgroups: DiagnosisSubgroup[];
};

type ChapterWithDiagnoses = Chapter & { groups: DiagnosisGroup[] };

type ScoreEntry = {
  score: number;
  raw: number;
  likelihood: Likelihood;
};

type SubstanceKey =
  | "alcohol"
  | "opioids"
  | "cannabinoids"
  | "sedatives"
  | "cocaine"
  | "stimulants"
  | "hallucinogens"
  | "tobacco"
  | "volatile"
  | "multiple";

const substanceOptions: { value: SubstanceKey; label: string }[] = [
  { value: "alcohol", label: "Alkohol (F10)" },
  { value: "opioids", label: "Opiate (F11)" },
  { value: "cannabinoids", label: "Cannabis (F12)" },
  { value: "sedatives", label: "Sedativa/Hypnotika (F13)" },
  { value: "cocaine", label: "Kokain (F14)" },
  { value: "stimulants", label: "Stimulanzien (F15)" },
  { value: "hallucinogens", label: "Halluzinogene (F16)" },
  { value: "tobacco", label: "Tabak (F17)" },
  { value: "volatile", label: "Loesungsmittel (F18)" },
  { value: "multiple", label: "Mehrfachgebrauch (F19)" },
];

const substanceCodeMap: Record<SubstanceKey, Record<string, string>> = {
  alcohol: {
    intoxication: "F10.0",
    harmful: "F10.1",
    dependence: "F10.2",
    withdrawal: "F10.3",
  },
  opioids: {
    intoxication: "F11.0",
    harmful: "F11.1",
    dependence: "F11.2",
    withdrawal: "F11.3",
  },
  cannabinoids: {
    intoxication: "F12.0",
    harmful: "F12.1",
    dependence: "F12.2",
    withdrawal: "F12.3",
  },
  sedatives: {
    intoxication: "F13.0",
    harmful: "F13.1",
    dependence: "F13.2",
    withdrawal: "F13.3",
  },
  cocaine: {
    intoxication: "F14.0",
    harmful: "F14.1",
    dependence: "F14.2",
    withdrawal: "F14.3",
  },
  stimulants: {
    intoxication: "F15.0",
    harmful: "F15.1",
    dependence: "F15.2",
    withdrawal: "F15.3",
  },
  hallucinogens: {
    intoxication: "F16.0",
    harmful: "F16.1",
    dependence: "F16.2",
    withdrawal: "F16.3",
  },
  tobacco: {
    intoxication: "F17.0",
    harmful: "F17.1",
    dependence: "F17.2",
    withdrawal: "F17.3",
  },
  volatile: {
    intoxication: "F18.0",
    harmful: "F18.1",
    dependence: "F18.2",
    withdrawal: "F18.3",
  },
  multiple: {
    intoxication: "F19.0",
    harmful: "F19.1",
    dependence: "F19.2",
    withdrawal: "F19.3",
  },
};

const substanceTokens = {
  intoxication: "SUBSTANCE_INTOXICATION",
  harmful: "SUBSTANCE_HARMFUL",
  dependence: "SUBSTANCE_DEPENDENCE",
  withdrawal: "SUBSTANCE_WITHDRAWAL",
};

const dependenceCriteriaIds = [
  "substance-tolerance",
  "substance-craving",
  "substance-control-loss",
  "substance-withdrawal",
  "substance-salience",
  "substance-continued",
];

const criteriaGroups: CriteriaGroup[] = [
  {
    id: "substanz",
    title: "Substanzkonsum (F10-F19)",
    description: "Abhaengigkeitskriterien, Verlauf, Zeitkriterien, Substanzwahl.",
    items: [
      {
        id: "substance-intoxication",
        label: "Akute Intoxikation mit Verhaltensveraenderung",
        weights: { [substanceTokens.intoxication]: 16 },
      },
      {
        id: "substance-harmful",
        label: "Schaedlicher Gebrauch (nachweisbarer Schaden)",
        weights: { [substanceTokens.harmful]: 18 },
      },
      {
        id: "substance-withdrawal",
        label: "Entzugssymptome",
        weights: {
          [substanceTokens.withdrawal]: 16,
          [substanceTokens.dependence]: 10,
        },
      },
      {
        id: "substance-tolerance",
        label: "Toleranzentwicklung",
        weights: { [substanceTokens.dependence]: 12 },
      },
      {
        id: "substance-craving",
        label: "Craving / starkes Verlangen",
        weights: { [substanceTokens.dependence]: 12 },
      },
      {
        id: "substance-control-loss",
        label: "Kontrollverlust ueber Konsum",
        weights: { [substanceTokens.dependence]: 14 },
      },
      {
        id: "substance-salience",
        label: "Vernachlaessigung anderer Interessen zugunsten des Konsums",
        weights: { [substanceTokens.dependence]: 12 },
      },
      {
        id: "substance-continued",
        label: "Fortgesetzter Konsum trotz klarer Schaeden",
        weights: { [substanceTokens.dependence]: 12 },
      },
      {
        id: "substance-duration",
        label: "Dauer des problematischen Konsums >= 12 Monate",
        weights: { [substanceTokens.dependence]: 10 },
      },
    ],
  },
  {
    id: "psychose",
    title: "Psychose-Spektrum (F20-F29)",
    description: "Formale Denkstoerungen, Wahn, Verlauf und Zeitkriterien.",
    items: [
      { id: "f20-halluzinationen", label: "Akustische Halluzinationen", weights: { "F20.0": 20, "F25.0": 12 } },
      { id: "f20-wahn", label: "Anhaltender Wahn", weights: { "F22.0": 20, "F20.0": 15 } },
      { id: "f20-ichstoerung", label: "Ich-Stoerungen", weights: { "F20.0": 20, "F25.0": 10 } },
      {
        id: "f20-formal",
        label: "Formale Denkstoerung (Zerfahrenheit / Inkohaerenz)",
        weights: { "F20.0": 15 },
      },
      {
        id: "f20-dauer",
        label: "Psychotische Symptome > 1 Monat",
        weights: { "F20.0": 20, "F25.0": 10 },
      },
      {
        id: "f20-affektiv",
        label: "Psychose auch ausserhalb affektiver Episoden",
        weights: { "F20.0": 18, "F25.0": 12 },
      },
    ],
  },
  {
    id: "affektiv",
    title: "Affektive Stoerungen (F30-F39)",
    description: "Stimmung, Verlauf, Episodenlaenge, und psychotische Merkmale.",
    items: [
      {
        id: "f30-gehoben",
        label: "Gehobene Stimmung / gesteigerter Antrieb",
        weights: { "F30.2": 15, "F31.2": 15 },
      },
      {
        id: "f30-dauer",
        label: "Manische Episode >= 1 Woche",
        weights: { "F30.2": 20, "F31.2": 20 },
      },
      {
        id: "f30-psychotisch",
        label: "Psychotische Symptome waehrend manischer Episode",
        weights: { "F30.2": 15, "F31.2": 15 },
      },
      {
        id: "f32-depressiv",
        label: "Depressive Episode >= 2 Wochen",
        weights: { "F32.1": 20, "F33.1": 15 },
      },
      {
        id: "f32-antrieb",
        label: "Anhedonie + Antriebsmangel",
        weights: { "F32.1": 15, "F33.1": 15 },
      },
      {
        id: "f33-episoden",
        label: "Mehrere Episoden in der Vorgeschichte",
        weights: { "F33.1": 20 },
      },
    ],
  },
  {
    id: "angst",
    title: "Angst- und Stressstoerungen (F40-F48)",
    description: "Panik, generalisierte Angst, Trauma, Vermeidung.",
    items: [
      { id: "f41-panik", label: "Panikattacken", weights: { "F41.0": 25 } },
      {
        id: "f41-sorgen",
        label: "Generalisierte Sorgen >= 6 Monate",
        weights: { "F41.1": 25 },
      },
      {
        id: "f43-trauma",
        label: "Traumaexposition + Flashbacks",
        weights: { "F43.1": 25 },
      },
      {
        id: "f43-vermeidung",
        label: "Vermeidungsverhalten / Triggervermeidung",
        weights: { "F43.1": 15, "F40.1": 10 },
      },
      { id: "f42-zwang", label: "Zwangsgedanken oder -handlungen", weights: { "F42.2": 20 } },
      { id: "f44-disso", label: "Dissoziative Symptome", weights: { "F44.0": 15 } },
    ],
  },
  {
    id: "persoenlich",
    title: "Persoenlichkeitsstoerungen (F60-F69)",
    description: "Dauerhafte Muster, Impulsivitaet, Beziehungsschwierigkeiten.",
    items: [
      {
        id: "f60-instabil",
        label: "Affektive Instabilitaet / Impulsivitaet",
        weights: { "F60.3": 20 },
      },
      {
        id: "f60-selbstschaedigung",
        label: "Selbstschaedigung oder suizidale Handlungen",
        weights: { "F60.3": 20 },
      },
      {
        id: "f60-chronisch",
        label: "Chronisches Muster seit Jugend / fruehem Erwachsenenalter",
        weights: { "F60.3": 15, "F60.7": 10 },
      },
      {
        id: "f60-abhaengig",
        label: "Ausgepraegtes abhaengiges Verhalten",
        weights: { "F60.7": 20 },
      },
    ],
  },
  {
    id: "entwicklung",
    title: "Entwicklungsstoerungen (F80-F99)",
    description: "Beginn in Kindheit, Entwicklungsverlauf, Persistenz.",
    items: [
      {
        id: "f90-adhs",
        label: "ADHS-Kernsymptome seit Kindheit",
        weights: { "F90.0": 25 },
      },
      {
        id: "f84-autismus",
        label: "Beeintraechtigte soziale Interaktion + Restriktionen",
        weights: { "F84.0": 20 },
      },
    ],
  },
];

const chapters: Chapter[] = [
  { id: "F00-F09", range: "F00-F09", title: "Dementia cluster", letter: "F", start: 0, end: 9 },
  { id: "F10-F19", range: "F10-F19", title: "Substanzgebrauch", letter: "F", start: 10, end: 19 },
  {
    id: "F20-F29",
    range: "F20-F29",
    title: "Schizophrenie und wahnhafte Stoerungen",
    letter: "F",
    start: 20,
    end: 29,
  },
  { id: "F30-F39", range: "F30-F39", title: "Affektive Stoerungen", letter: "F", start: 30, end: 39 },
  { id: "F40-F48", range: "F40-F48", title: "Neurotische / Stressstoerungen", letter: "F", start: 40, end: 48 },
  {
    id: "F50-F59",
    range: "F50-F59",
    title: "Verhaltenssyndrome",
    letter: "F",
    start: 50,
    end: 59,
  },
  {
    id: "F60-F69",
    range: "F60-F69",
    title: "Persoenlichkeitsstoerungen",
    letter: "F",
    start: 60,
    end: 69,
  },
  { id: "F70-F79", range: "F70-F79", title: "Intelligenzminderung", letter: "F", start: 70, end: 79 },
  { id: "F80-F89", range: "F80-F89", title: "Entwicklungsstoerungen", letter: "F", start: 80, end: 89 },
  {
    id: "F90-F99",
    range: "F90-F99",
    title: "Stoerungen mit Beginn in Kindheit/Jugend",
    letter: "F",
    start: 90,
    end: 99,
  },
  { id: "Z50-Z59", range: "Z50-Z59", title: "Versorgung und Rehabilitation", letter: "Z", start: 50, end: 59 },
  { id: "Z60-Z69", range: "Z60-Z69", title: "Soziale Umstaende", letter: "Z", start: 60, end: 69 },
];

const levelStyles: Record<number, string> = {
  0: "bg-white hover:bg-gray-50",
  1: "bg-[color:#f6caca] border-[color:#e8a6a6]",
  2: "bg-[color:#f5e4b9] border-[color:#e6d09a]",
  3: "bg-[color:#cbe9cf] border-[color:#a8d4b0]",
};

const levelLabels: Record<number, string> = {
  0: "Aus",
  1: "Moeglich",
  2: "Milde Chance",
  3: "Moderate bis sicher",
};

const likelihoodStyles: Record<Likelihood, string> = {
  low: "bg-[color:#f6caca] border-[color:#e8a6a6]",
  moderate: "bg-[color:#f5e4b9] border-[color:#e6d09a]",
  high: "bg-[color:#cbe9cf] border-[color:#a8d4b0]",
};

const diagnosisGroupLabels: Record<string, string> = {
  F10: "Alkohol",
  F11: "Opiate",
  F12: "Cannabis",
  F13: "Sedativa/Hypnotika",
  F14: "Kokain",
  F15: "Stimulanzien",
  F16: "Halluzinogene",
  F17: "Tabak",
  F18: "Loesungsmittel",
  F19: "Mehrfachgebrauch",
  F20: "Schizophrenien",
  F60: "Spezifische Persoenlichkeitsstoerungen",
};

const diagnosisCatalog: Diagnosis[] = (() => {
  const map = new Map<string, Diagnosis>();
  (icd10Data as IcdEntry[]).forEach((entry) => {
    const code = entry.code.trim();
    if (!code) return;
    if (!map.has(code)) {
      map.set(code, { code, name: entry.name, normalized: normalizeIcdCode(code) });
    }
  });
  return Array.from(map.values()).sort((a, b) => a.code.localeCompare(b.code));
})();

function parseChapterNumber(code: string) {
  const number = Number(code.slice(1, 3));
  return Number.isNaN(number) ? null : number;
}

function matchChapter(code: string, chapter: Chapter) {
  if (!code.startsWith(chapter.letter)) return false;
  const number = parseChapterNumber(code);
  if (number === null) return false;
  return number >= chapter.start && number <= chapter.end;
}

const chaptersWithDiagnoses: ChapterWithDiagnoses[] = chapters.map((chapter) => {
  const diagnoses = diagnosisCatalog
    .filter((diagnosis) => matchChapter(diagnosis.code, chapter))
    .sort((a, b) => a.code.localeCompare(b.code));
  const groupMap = new Map<string, Diagnosis[]>();
  diagnoses.forEach((diagnosis) => {
    const groupKey = diagnosis.code.slice(0, 3);
    const existing = groupMap.get(groupKey) ?? [];
    existing.push(diagnosis);
    groupMap.set(groupKey, existing);
  });

  const groups = Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupKey, groupDiagnoses]) => {
      const subgroupMap = new Map<string, Diagnosis[]>();
      groupDiagnoses.forEach((diagnosis) => {
        const subgroupKey = diagnosis.normalized;
        const existing = subgroupMap.get(subgroupKey) ?? [];
        existing.push(diagnosis);
        subgroupMap.set(subgroupKey, existing);
      });

      const subgroups = Array.from(subgroupMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([subgroupKey, items]) => {
          const sortedItems = items.sort((a, b) => a.code.localeCompare(b.code));
          const header = sortedItems.find((item) => item.code === subgroupKey) ?? sortedItems[0];
          return { code: subgroupKey, name: header.name, items: sortedItems };
        });

      const label = diagnosisGroupLabels[groupKey];
      const title = label ? `${groupKey} ${label}` : groupKey;
      return { code: groupKey, title, subgroups };
    });

  return { ...chapter, groups };
});

function resolveSubstanceCode(token: string, substance: SubstanceKey) {
  const map = substanceCodeMap[substance];
  switch (token) {
    case substanceTokens.intoxication:
      return map.intoxication;
    case substanceTokens.harmful:
      return map.harmful;
    case substanceTokens.dependence:
      return map.dependence;
    case substanceTokens.withdrawal:
      return map.withdrawal;
    default:
      return token;
  }
}

export default function Icd10CategoriesPage() {
  const [criteriaLevels, setCriteriaLevels] = useState<Record<string, number>>({});
  const [selectedSubstance, setSelectedSubstance] = useState<SubstanceKey>("alcohol");

  const selectedCount = useMemo(
    () => Object.values(criteriaLevels).filter((value) => value > 0).length,
    [criteriaLevels]
  );

  const { scoresByCode, topByChapter } = useMemo(() => {
    const totals: Record<string, number> = {};

    criteriaGroups.forEach((group) => {
      group.items.forEach((item) => {
        const level = criteriaLevels[item.id] ?? 0;
        if (level > 0) {
          Object.entries(item.weights).forEach(([code, weight]) => {
            const resolved = resolveSubstanceCode(code, selectedSubstance);
            const normalized = normalizeIcdCode(resolved);
            totals[normalized] = (totals[normalized] ?? 0) + weight * level;
          });
        }
      });
    });

    const dependenceCount = dependenceCriteriaIds.filter(
      (id) => (criteriaLevels[id] ?? 0) > 0
    ).length;

    const substanceCodes = substanceCodeMap[selectedSubstance];
    if (dependenceCount >= 3) {
      const normalizedDependence = normalizeIcdCode(substanceCodes.dependence);
      totals[normalizedDependence] = Math.max(totals[normalizedDependence] ?? 0, 200);
    }

    const positiveTotals = Object.values(totals).map((value) => Math.max(0, value));
    const maxScore = Math.max(0, ...positiveTotals);
    const divisor = maxScore > 0 ? maxScore : 1;

    const scoresByCode: Record<string, ScoreEntry> = {};

    Object.entries(totals).forEach(([code, raw]) => {
      const bounded = Math.max(0, raw);
      const score = Math.round((bounded / divisor) * 100);
      if (score > 0) {
        scoresByCode[code] = { score, raw, likelihood: getLikelihood(score) };
      }
    });

    const topByChapter: Record<string, (ScoreEntry & { code: string }) | null> = {};

    chaptersWithDiagnoses.forEach((chapter) => {
      let top: (ScoreEntry & { code: string }) | null = null;

      chapter.groups.forEach((group) => {
        group.subgroups.forEach((subgroup) => {
          const entry = scoresByCode[subgroup.code];
          if (entry && (!top || entry.score > top.score)) {
            top = { ...entry, code: subgroup.code };
          }
        });
      });
      topByChapter[chapter.id] = top;
    });

    return { scoresByCode, topByChapter };
  }, [criteriaLevels, selectedSubstance]);

  const handleCycle = (id: string) => {
    setCriteriaLevels((prev) => {
      const current = prev[id] ?? 0;
      const next = (current + 1) % 4;
      return { ...prev, [id]: next };
    });
  };

  const handleClear = () => {
    setCriteriaLevels({});
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">ICD-10 Kategorien</h1>
        <p className="text-sm text-gray-700">
          Kriterien anklicken, Wahrscheinlichkeit markieren, Kapitel rechts aufklappen. Codes werden
          bis zur ersten Dezimalstelle gruppiert, Untergruppen sind sichtbar.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-4 text-xs text-gray-500 shadow-sm">
        Dieses Tool unterstuetzt die Dokumentation. Es stellt keine Diagnose und ersetzt keine
        klinische Beurteilung.
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr,0.9fr]">
        <section className="space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">Kriterien (links/zentral)</div>
                <p className="text-xs text-gray-500">
                  Klick auf ein Item wechselt: rot (moeglich) - gelb (mild) - gruen (moderat/sicher) - aus.
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-gray-50"
                onClick={handleClear}
              >
                Auswahl loeschen
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className={`rounded-full border px-2 py-1 ${levelStyles[1]}`}>Rot: moeglich</span>
              <span className={`rounded-full border px-2 py-1 ${levelStyles[2]}`}>Gelb: milde Chance</span>
              <span className={`rounded-full border px-2 py-1 ${levelStyles[3]}`}>Gruen: moderat/sicher</span>
              <span className="rounded-full border px-2 py-1">Auswahl: {selectedCount}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {criteriaGroups.map((group) => (
              <div key={group.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold">{group.title}</div>
                <p className="mt-1 text-xs text-gray-500">{group.description}</p>
                {group.id === "substanz" ? (
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-gray-600">Substanz</label>
                    <select
                      className="mt-1 w-full rounded-xl border px-3 py-2 text-xs"
                      value={selectedSubstance}
                      onChange={(event) => setSelectedSubstance(event.target.value as SubstanceKey)}
                    >
                      {substanceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <div className="mt-3 space-y-2">
                  {group.items.map((item) => {
                    const level = criteriaLevels[item.id] ?? 0;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleCycle(item.id)}
                        className={`flex w-full items-start justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm ${levelStyles[level]}`}
                        aria-pressed={level > 0}
                      >
                        <span>{item.label}</span>
                        <span className="rounded-full border px-2 py-0.5 text-xs font-semibold">
                          {levelLabels[level]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-base font-semibold">ICD-10 Kapitel (rechts)</div>
            <p className="mt-1 text-xs text-gray-500">
              Alle Kapitel starten eingeklappt. Ein Kapitel highlightet zuerst, ein geoeffnetes Kapitel
              markiert die wahrscheinlichste Diagnose.
            </p>
          </div>

          <div className="space-y-3">
            {chaptersWithDiagnoses.map((chapter) => {
              const top = topByChapter[chapter.id];
              const summaryHighlight = top ? likelihoodStyles[top.likelihood] : "";

              return (
                <details key={chapter.id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
                  <summary className={`cursor-pointer px-3 py-2 text-sm font-semibold ${summaryHighlight}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs text-gray-500">{chapter.range}</div>
                        <div>{chapter.title}</div>
                      </div>
                      {top ? (
                        <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${likelihoodStyles[top.likelihood]}`}>
                          {top.code} {top.score}%
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Keine Treffer</span>
                      )}
                    </div>
                  </summary>
                  <div className="px-3 pb-3">
                    <div className="mt-2 space-y-3">
                      {chapter.groups.map((group) => (
                        <div key={`${chapter.id}-${group.code}`} className="space-y-2">
                          <div className="text-xs font-semibold text-gray-500">{group.title}</div>
                          <div className="space-y-2">
                            {group.subgroups.map((subgroup) => {
                              const entry = scoresByCode[subgroup.code];
                              const isTop = top?.code === subgroup.code;
                              const highlight = top && isTop ? likelihoodStyles[top.likelihood] : "";
                              const childHighlight = isTop ? likelihoodStyles[top.likelihood] : "";
                              const extraItems = subgroup.items.filter((item) => item.code !== subgroup.code);
                              return (
                                <div
                                  key={`${chapter.id}-${group.code}-${subgroup.code}`}
                                  className={`rounded-lg border px-2 py-2 ${highlight}`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="text-xs font-semibold text-gray-600">{subgroup.code}</div>
                                      <div className="text-xs text-gray-700">{subgroup.name}</div>
                                    </div>
                                    {entry ? (
                                      <span
                                        className={`rounded-full border px-2 py-1 text-xs font-semibold ${likelihoodStyles[entry.likelihood]}`}
                                      >
                                        {entry.score}%
                                      </span>
                                    ) : null}
                                  </div>
                                  {extraItems.length > 0 ? (
                                    <div className="mt-2 space-y-2 pl-3">
                                      {extraItems.map((item) => (
                                        <div
                                          key={`${chapter.id}-${group.code}-${subgroup.code}-${item.code}`}
                                          className={`rounded-md border px-2 py-1 ${childHighlight}`}
                                        >
                                          <div className="text-[11px] font-semibold text-gray-600">{item.code}</div>
                                          <div className="text-[11px] text-gray-700">{item.name}</div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
