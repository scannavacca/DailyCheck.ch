import icd10Data from "@/data/icd10.json";

export type IcdEntry = { code: string; name: string };

export type Likelihood = "high" | "moderate" | "low";

export type ScoredDiagnosis = {
  code: string;
  name: string;
  score: number;
  rawScore: number;
  likelihood: Likelihood;
};

export const symptomWeights: Record<string, Record<string, number>> = {
  "wahrnehmung-halluzinationen": {
    "F20.0": 30,
    "F25.0": 20,
    "F23.1": 20,
    "F41.0": -10,
  },
  "inhalt-wahn": {
    "F22.0": 25,
    "F20.0": 20,
    "F25.0": 10,
  },
  "inhalt-ichstoerungen": {
    "F20.0": 30,
    "F25.0": 15,
  },
  "inhalt-wahnstimmung": {
    "F23.1": 20,
    "F20.0": 10,
  },
  "denken-zerfahrenheit": {
    "F20.0": 20,
    "F25.0": 10,
  },
  "denken-verlangsamung-ideenflucht": {
    "F30.2": 15,
    "F31.2": 10,
    "F32.1": 5,
  },
  "psychomotorik-unruhe": {
    "F41.1": 10,
    "F30.2": 10,
  },
  "psychomotorik-hemmung": {
    "F32.1": 15,
    "F33.1": 10,
  },
  "psychomotorik-katatone": {
    "F20.0": 15,
  },
  "affekte-labil": {
    "F31.2": 15,
    "F60.31": 10,
  },
  "affekte-verflacht": {
    "F20.0": 15,
  },
  "affekte-dysphorie": {
    "F32.1": 15,
    "F41.1": 10,
  },
  "affekte-stimmung": {
    "F30.2": 15,
    "F31.2": 15,
    "F32.1": 15,
    "F33.1": 10,
  },
  "impulse-kontrolle": {
    "F60.31": 20,
    "F31.2": 10,
  },
  "impulse-aggression": {
    "F60.31": 20,
  },
  "impulse-risiko": {
    "F60.31": 15,
    "F31.2": 10,
  },
  "aengste-panik": {
    "F41.0": 35,
    "F20.0": -10,
  },
  "aengste-generalisiert": {
    "F41.1": 30,
  },
  "aengste-phobien": {
    "F40.1": 25,
  },
  "aengste-zwangshandlungen": {
    "F42.2": 30,
  },
  "aengste-zwangsgedanken": {
    "F42.2": 20,
  },
  "psychovegetativum-schlaf": {
    "F32.1": 10,
    "F41.1": 10,
    "F43.1": 10,
  },
  "psychovegetativum-appetit": {
    "F32.1": 10,
    "F50.0": 10,
  },
  "psychovegetativum-stresssymptome": {
    "F43.1": 15,
    "F41.1": 10,
  },
  "wahrnehmung-derealisation": {
    "F43.1": 10,
    "F44.0": 10,
  },
  "wahrnehmung-depersonalisation": {
    "F44.0": 15,
  },
  "gefaehrdung-suizidgedanken": {
    "F32.1": 25,
    "F33.1": 20,
  },
  "gefaehrdung-suizidplan": {
    "F32.1": 30,
  },
  "abhaengigkeit-alkohol": {
    "F10.21": 30,
  },
  "abhaengigkeit-substanzen": {
    "F11.20": 25,
    "F12.20": 25,
    "F13.20": 20,
  },
  "abhaengigkeit-craving": {
    "F10.21": 15,
    "F11.20": 10,
    "F12.20": 10,
  },
  "abhaengigkeit-kontrollverlust": {
    "F10.21": 20,
    "F11.20": 15,
  },
  "abhaengigkeit-entzug": {
    "F10.21": 25,
    "F11.20": 20,
    "F12.20": 15,
  },
};

const icdEntries = icd10Data as IcdEntry[];

export function normalizeIcdCode(code: string) {
  const trimmed = code.trim();
  const match = trimmed.match(/^([A-Z]\d{2})(?:\.(\d+))?$/);
  if (!match) return trimmed;

  const [, prefix, decimals] = match;
  if (!decimals) return prefix;
  return `${prefix}.${decimals[0]}`;
}

const icdNameMap = new Map<string, string>();

icdEntries.forEach((entry) => {
  const normalized = normalizeIcdCode(entry.code);
  if (!icdNameMap.has(normalized)) icdNameMap.set(normalized, entry.name);
});

export function getLikelihood(score: number): Likelihood {
  if (score >= 70) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

export function getLikelihoodLabel(likelihood: Likelihood) {
  if (likelihood === "high") return "Most likely";
  if (likelihood === "moderate") return "Moderate likelihood";
  return "Less likely";
}

export function scoreDiagnoses(selectedSymptoms: string[]): ScoredDiagnosis[] {
  if (!selectedSymptoms.length) return [];

  const totals: Record<string, number> = {};

  selectedSymptoms.forEach((symptom) => {
    const weights = symptomWeights[symptom];
    if (!weights) return;

    Object.entries(weights).forEach(([code, weight]) => {
      const normalized = normalizeIcdCode(code);
      totals[normalized] = (totals[normalized] ?? 0) + weight;
    });
  });

  const positiveTotals = Object.values(totals).map((value) => Math.max(0, value));
  const maxScore = Math.max(0, ...positiveTotals, 0);
  const divisor = maxScore > 0 ? maxScore : 1;

  return Object.entries(totals)
    .map(([code, rawScore]) => {
      const bounded = Math.max(0, rawScore);
      const score = Math.round((bounded / divisor) * 100);
      const name = icdNameMap.get(code) ?? "Unlisted ICD-10 group";
      return {
        code,
        name,
        score,
        rawScore,
        likelihood: getLikelihood(score),
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.rawScore - a.rawScore || a.code.localeCompare(b.code));
}
