export type Template = { id: string; name: string; body: string };

const KEY = "dailycheck_templates_v1";

const defaultTemplates: Template[] = [
  {
    id: "verlauf",
    name: "Verlaufseintrag",
    body:
      "Verlaufseintrag\n\nDatum: {{DATE}}\nPatient: {{PATIENT}}\n\nAnlass / Fokus:\n- {{FOCUS}}\n\nPsychostatus (kurz):\n- {{PSYCHOSTATUS}}\n\nVerlauf / Inhalt:\n{{TRANSCRIPT}}\n\nBeurteilung:\n- {{ASSESSMENT}}\n\nPlan:\n- {{PLAN}}\n",
  },
  {
    id: "erstgespraech",
    name: "Erstgespräch",
    body:
      "Erstgespräch\n\nDatum: {{DATE}}\nPatient: {{PATIENT}}\n\nAnliegen:\n- {{COMPLAINT}}\n\nBiografie / Kontext:\n{{TRANSCRIPT}}\n\nPsychostatus:\n- {{PSYCHOSTATUS}}\n\nZusammenfassung:\n- {{SUMMARY}}\n\nPlan:\n- {{PLAN}}\n",
  },
  {
    id: "kurzbericht",
    name: "Kurzbericht",
    body:
      "Kurzbericht\n\nDatum: {{DATE}}\nPatient: {{PATIENT}}\n\nKurzfazit:\n- {{SUMMARY}}\n\nKernaussagen:\n{{TRANSCRIPT}}\n\nPlan:\n- {{PLAN}}\n",
  },
  {
    id: "icd10",
    name: "ICD-10 orientiert",
    body:
      "ICD-10 orientiert\n\nDatum: {{DATE}}\nPatient: {{PATIENT}}\n\nSymptome / Cluster:\n- {{FOCUS}}\n\nPsychostatus:\n- {{PSYCHOSTATUS}}\n\nVerlauf:\n{{TRANSCRIPT}}\n\nBeurteilung:\n- {{ASSESSMENT}}\n\nPlan:\n- {{PLAN}}\n",
  },
  {
    id: "custom",
    name: "Custom Template",
    body: "Custom Template\n\nDatum: {{DATE}}\nPatient: {{PATIENT}}\n\nInhalt:\n{{TRANSCRIPT}}\n",
  },
];

export function loadTemplates(): Template[] {
  if (typeof window === "undefined") return defaultTemplates;
  const raw = localStorage.getItem(KEY);
  if (!raw) return defaultTemplates;
  try {
    const parsed = JSON.parse(raw) as Template[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultTemplates;
  } catch {
    return defaultTemplates;
  }
}

export function saveTemplates(templates: Template[]) {
  localStorage.setItem(KEY, JSON.stringify(templates.slice(0, 10)));
}
