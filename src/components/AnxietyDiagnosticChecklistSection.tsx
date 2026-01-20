"use client";

import { useMemo, useState } from "react";

type ChecklistItem = {
  id: string;
  label: string;
  domain: string;
  note?: string;
};

type ItemState = {
  present: boolean;
  severity: string;
  duration: string;
  tags: Record<string, boolean>;
};

const severityOptions = [
  { value: "0", label: "0 - keine" },
  { value: "1", label: "1 - leicht" },
  { value: "2", label: "2 - mittel" },
  { value: "3", label: "3 - ausgepraegt" },
];

const durationOptions = [
  { value: "acute", label: "akut (Tage)" },
  { value: "subacute", label: "subakut (Wochen)" },
  { value: "persistent", label: "persistierend (Monate/Jahre)" },
  { value: "unclear", label: "unklar" },
];

const contextTags = [
  { id: "substance", label: "Substanzbezogen" },
  { id: "organic", label: "Organisch/medizinisch" },
  { id: "mood", label: "Affektive Episode" },
  { id: "stressor", label: "Situativer Stressor" },
];

const checklistItems: ChecklistItem[] = [
  {
    id: "dx_step_open_interview",
    domain: "Diagnostik-Stufenplan",
    label: "Offenes Interview mit spontanen Angaben der Patientin/des Patienten",
  },
  {
    id: "dx_step_screening",
    domain: "Diagnostik-Stufenplan",
    label: "Kurze Screeningfragen bei Verdacht auf Angststoerung",
  },
  {
    id: "dx_step_structured_assessment",
    domain: "Diagnostik-Stufenplan",
    label: "Strukturierte Befunderhebung der Symptomatik",
  },
  {
    id: "dx_step_anamnesis",
    domain: "Diagnostik-Stufenplan",
    label: "Anamnese (inkl. Verlauf und Ausloesefaktoren)",
  },
  {
    id: "dx_step_collateral",
    domain: "Diagnostik-Stufenplan",
    label: "Fremdanamnese/Einbezug Dritter bei Bedarf",
  },
  {
    id: "dx_step_dd",
    domain: "Diagnostik-Stufenplan",
    label: "Differenzialdiagnostik (somatisch und psychisch)",
  },
  {
    id: "dx_step_severity",
    domain: "Diagnostik-Stufenplan",
    label: "Dokumentation von Schweregrad und Verlauf (nicht-diagnostisch)",
  },

  {
    id: "anamnesis_developmental",
    domain: "Anamnese-Fokus",
    label: "Entwicklungsanamnese der Symptomatik (Beginn, Verlauf, Muster)",
  },
  {
    id: "anamnesis_current_context",
    domain: "Anamnese-Fokus",
    label: "Aktuelle Lebensumstaende und psychische Belastungsfaktoren",
  },
  {
    id: "anamnesis_triggers",
    domain: "Anamnese-Fokus",
    label: "Ausloesende Situationen fuer Angsterleben/Verstaerkung",
  },
  {
    id: "anamnesis_cofactors",
    domain: "Anamnese-Fokus",
    label: "Koaktoren und komorbide Stoerungen erfasst",
  },

  {
    id: "case_finding_somatic_presentation",
    domain: "Case-Finding/Screening",
    label: "Beschwerden vorwiegend koerperbezogen geschildert (Angst nicht im Vordergrund)",
  },
  {
    id: "case_finding_brief_questions",
    domain: "Case-Finding/Screening",
    label: "Kurze Screeningfragen genutzt (primaer versorgungsgeeignet)",
  },
  {
    id: "case_finding_tools_mini_phq_gad",
    domain: "Case-Finding/Screening",
    label: "Kurzfrageboegen erwaegt/angewendet (MINI, PHQ-4, GAD-2/7)",
    note: "Nutzen als Screening, keine Evidenz fuer Therapieverbesserung belegt.",
  },

  {
    id: "structured_scid_mini",
    domain: "Strukturierte Diagnostik",
    label: "Strukturiertes oder halbstrukturiertes Interview genutzt (SCID/MINI)",
  },
  {
    id: "classification_icd_primary",
    domain: "Klassifikation/Criteria Notes",
    label: "Klassifikation nach ICD-10-GM (klinische Grundlage)",
  },
  {
    id: "classification_icd_research",
    domain: "Klassifikation/Criteria Notes",
    label: "ICD-10 Forschungskriterien fuer Detailabgleich herangezogen",
  },
  {
    id: "classification_phobic_nonphobic",
    domain: "Klassifikation/Criteria Notes",
    label: "Phobische (F40.x) vs nicht-phobische Angststoerungen (F41) differenziert",
  },
  {
    id: "classification_agoraphobia",
    domain: "Klassifikation/Criteria Notes",
    label: "Agoraphobie als eigenstaendige Kategorie dokumentiert",
  },
  {
    id: "classification_dsm_context",
    domain: "Klassifikation/Criteria Notes",
    label: "DSM-Logik nur als Referenz/Research-Kontext dokumentiert",
  },

  {
    id: "som_dd_pulmonary",
    domain: "Somatische DD-Cluster",
    label: "Lungenerkrankungen als DD (z. B. Asthma, COPD)",
  },
  {
    id: "som_dd_cardiac",
    domain: "Somatische DD-Cluster",
    label: "Herz-Kreislauf-Erkrankungen als DD (z. B. Angina, Arrhythmien, Synkopen)",
  },
  {
    id: "som_dd_neuro",
    domain: "Somatische DD-Cluster",
    label: "Neurologische Ursachen als DD (z. B. fokale Anfaelle, Migrane, MS, Tumoren)",
  },
  {
    id: "som_dd_endocrine",
    domain: "Somatische DD-Cluster",
    label: "Endokrine/metabolische Ursachen als DD (z. B. Hypoglykaemie, Hyperthyreose, Elektrolyte)",
  },
  {
    id: "som_dd_other",
    domain: "Somatische DD-Cluster",
    label: "Weitere Ursachen (z. B. vestibulaere Stoerungen, Lagerungsschwindel)",
  },

  {
    id: "workup_history",
    domain: "Somatische Mindestabklaerung",
    label: "Ausfuehrliche somatische Anamnese",
  },
  {
    id: "workup_physical_exam",
    domain: "Somatische Mindestabklaerung",
    label: "Koerperliche Untersuchung",
  },
  {
    id: "workup_basic_labs",
    domain: "Somatische Mindestabklaerung",
    label: "Basislabor inkl. Blutbild, Glukose, Elektrolyte, TSH",
  },
  {
    id: "workup_ecg",
    domain: "Somatische Mindestabklaerung",
    label: "EKG mit Rhythmusstreifen",
  },
  {
    id: "workup_lung_function_if",
    domain: "Somatische Mindestabklaerung",
    label: "Lungenfunktion bei Indikation",
  },
  {
    id: "workup_imaging_if",
    domain: "Somatische Mindestabklaerung",
    label: "Kranielle Bildgebung bei Indikation (MRT/cCT)",
  },
  {
    id: "workup_eeg_if",
    domain: "Somatische Mindestabklaerung",
    label: "EEG bei Indikation",
  },

  {
    id: "spec_general_med",
    domain: "Erweiterte somatische Abklaerung",
    label: "Allgemeinmedizinische Vertiefung bei Hinweis auf kardio/pulmonal/metabolisch",
  },
  {
    id: "spec_internal",
    domain: "Erweiterte somatische Abklaerung",
    label: "Internistische Vertiefung (z. B. Echo, Thoraxdiagnostik, Langzeitmessungen)",
  },
  {
    id: "spec_neuro",
    domain: "Erweiterte somatische Abklaerung",
    label: "Neurologische Vertiefung (z. B. EEG/Bildgebung/Doppler bei Verdacht)",
  },
  {
    id: "spec_ent",
    domain: "Erweiterte somatische Abklaerung",
    label: "HNO-Vertiefung bei vestibulaeren Beschwerden",
  },

  {
    id: "psych_dd_ocd",
    domain: "Psychische DD-Screening",
    label: "Zwangsbezogene Merkmale: intrusive Gedanken oder Ritualdruck?",
  },
  {
    id: "psych_dd_somatoform",
    domain: "Psychische DD-Screening",
    label: "Somatisierung: viele wechselnde Beschwerden ohne ausreichende organische Erklaerung?",
  },
  {
    id: "psych_dd_depression",
    domain: "Psychische DD-Screening",
    label: "Depressive Kernsymptome zusaetzlich zur Angst?",
  },
  {
    id: "psych_dd_adjustment_ptsd",
    domain: "Psychische DD-Screening",
    label: "Bezug zu belastendem/traumatischem Ereignis mit anhaltenden Nachwirkungen?",
  },
  {
    id: "psych_dd_bpd",
    domain: "Psychische DD-Screening",
    label: "Borderline-typische Begleitmuster (Leere, Affektlabilitaet, Selbstverletzung)?",
  },
  {
    id: "psych_dd_alcohol",
    domain: "Psychische DD-Screening",
    label: "Alkoholbezogene Problematik in der Vorgeschichte (regelmaessig hohe Mengen)?",
  },
  {
    id: "psych_dd_withdrawal",
    domain: "Psychische DD-Screening",
    label: "Medikamenten- oder Drogenentzug / nicht-aerztliche Einnahme?",
  },
  {
    id: "psych_dd_psychosis",
    domain: "Psychische DD-Screening",
    label: "Psychotische Symptome (z. B. Verfolgungsideen) im Vordergrund?",
  },
  {
    id: "psych_dd_other_anxiety",
    domain: "Psychische DD-Screening",
    label: "Abgleich mit anderen Angststoerungen (Panik/Agoraphobie, soziale Angst, GAD, spezifische Phobie).",
  },
];

function initState(items: ChecklistItem[]) {
  const initial: Record<string, ItemState> = {};
  for (const item of items) {
    initial[item.id] = {
      present: false,
      severity: "0",
      duration: "unclear",
      tags: Object.fromEntries(contextTags.map((tag) => [tag.id, false])),
    };
  }
  return initial;
}

export default function AnxietyDiagnosticChecklistSection() {
  const [items, setItems] = useState<Record<string, ItemState>>(() => initState(checklistItems));
  const [summary, setSummary] = useState("");

  const domains = useMemo(() => {
    const grouped = new Map<string, ChecklistItem[]>();
    checklistItems.forEach((item) => {
      if (!grouped.has(item.domain)) grouped.set(item.domain, []);
      grouped.get(item.domain)?.push(item);
    });
    return Array.from(grouped.entries());
  }, []);

  const updateItem = (id: string, patch: Partial<ItemState>) => {
    setItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const generateSummary = () => {
    const selected = checklistItems.filter((item) => items[item.id]?.present);
    const byDomain = new Map<string, string[]>();
    selected.forEach((item) => {
      if (!byDomain.has(item.domain)) byDomain.set(item.domain, []);
      byDomain.get(item.domain)?.push(item.label);
    });

    const hasSomaticDD = selected.some((item) => item.domain.includes("Somatische"));
    const hasPsychDD = selected.some((item) => item.domain.includes("Psychische DD"));
    const hasStructuredInterview = selected.some((item) => item.id === "structured_scid_mini");

    const contextFlags = contextTags.filter((tag) =>
      checklistItems.some((item) => items[item.id].present && items[item.id].tags[tag.id])
    );

    const lines: string[] = [];
    lines.push(
      "Ergebnis (nicht-diagnostisch): Dokumentierte Angaben sind kompatibel mit einer strukturierten Abklaerung von Angststoerungen; klinische Bestaetigung erforderlich."
    );

    if (byDomain.size > 0) {
      for (const [domain, labels] of byDomain.entries()) {
        lines.push(`${domain}: ${labels.join("; ")}.`);
      }
    }

    if (hasSomaticDD) {
      lines.push("Somatische Differenzialdiagnosen sind markiert und sollten kontextbezogen beruecksichtigt werden.");
    }

    if (hasPsychDD) {
      lines.push("Psychische Differenzialdiagnosen sind markiert; Abgrenzung ist empfohlen.");
    }

    if (hasStructuredInterview) {
      lines.push("Strukturiertes Interview ist dokumentiert; dies unterstuetzt die kriteriale Abklaerung.");
    }

    if (contextFlags.length > 0) {
      lines.push(`Kontext-Tags: ${contextFlags.map((tag) => tag.label).join(", ")}.`);
    }

    setSummary(lines.join(" "));
  };

  return (
    <section className="module">
      <div className="banner">
        <h2>Angststoerungen – Diagnostik (deterministische Dokumentation)</h2>
        <p className="subtitle">
          Strukturierte Erhebung + Differenzialdiagnostik + Schweregrad (keine Diagnose)
        </p>
        <div className="disclaimer">
          <p>
            This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
            the licensed professional.
          </p>
          <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
        </div>
      </div>

      <div className="card">
        <h3>Checklist (seitenbezogen, rephrased)</h3>
        <p className="helper">
          Jeder Eintrag: Praesenz, Schwere, Dauer, Kontext-Tags. Inhalte sind deterministisch und nicht-diagnostisch.
        </p>

        <div className="domain-grid">
          {domains.map(([domain, domainItems]) => (
            <details key={domain} open className="domain">
              <summary>{domain}</summary>
              <div className="domain-body">
                {domainItems.map((item) => {
                  const state = items[item.id];
                  return (
                    <div key={item.id} className="item-row">
                      <label className="item-label">
                        <input
                          type="checkbox"
                          checked={state.present}
                          onChange={(e) => updateItem(item.id, { present: e.target.checked })}
                        />
                        <span>{item.label}</span>
                      </label>

                      <div className="field">
                        <label>Schwere (0-3)</label>
                        <select
                          value={state.severity}
                          onChange={(e) => updateItem(item.id, { severity: e.target.value })}
                        >
                          {severityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="field">
                        <label>Dauer</label>
                        <select
                          value={state.duration}
                          onChange={(e) => updateItem(item.id, { duration: e.target.value })}
                        >
                          {durationOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="tag-block">
                        <div className="tag-title">Kontext-Tags</div>
                        <div className="tags">
                          {contextTags.map((tag) => (
                            <label key={tag.id} className="tag">
                              <input
                                type="checkbox"
                                checked={state.tags[tag.id]}
                                onChange={(e) =>
                                  updateItem(item.id, {
                                    tags: { ...state.tags, [tag.id]: e.target.checked },
                                  })
                                }
                              />
                              <span>{tag.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {item.note ? <p className="note">{item.note}</p> : null}
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Reasoning Summary</h3>
        <div className="summary-actions">
          <button type="button" onClick={generateSummary}>
            Generate reasoning summary
          </button>
        </div>
        <div className="summary-box">{summary || "Summary erscheint nach Klick."}</div>

        <div className="transparency">
          <h4>Logic transparency</h4>
          <ul>
            <li>Wenn Eintraege markiert sind, werden sie als dokumentierte Hinweise gelistet (keine Diagnose).</li>
            <li>Wenn somatische DD markiert sind, erscheint ein Hinweis zur somatischen Abklaerung.</li>
            <li>Wenn psychische DD markiert sind, erscheint ein Hinweis zur Abgrenzung.</li>
            <li>Wenn strukturiertes Interview markiert ist, wird dies als kriteriale Abklaerung dokumentiert.</li>
            <li>Kontext-Tags werden gesammelt und im Summary ausgegeben.</li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        <p>
          This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with the
          licensed professional.
        </p>
      </footer>

      <style jsx>{`
        .module {
          display: grid;
          gap: 18px;
          padding: 24px;
          border-radius: 18px;
          background: #f4f5f7;
          border: 1px solid #e1e5ea;
        }

        .banner {
          background: #ffffff;
          border: 1px solid #e1e5ea;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }

        h2 {
          margin: 0 0 6px;
          font-size: 1.6rem;
        }

        .subtitle {
          margin: 0 0 12px;
          color: #4b5563;
        }

        .disclaimer {
          background: #fff6e5;
          border: 1px solid #f1d3a4;
          border-radius: 12px;
          padding: 12px;
          font-size: 0.9rem;
          display: grid;
          gap: 6px;
        }

        .card {
          background: #ffffff;
          border: 1px solid #e1e5ea;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
        }

        h3 {
          margin: 0 0 10px;
          font-size: 1.2rem;
        }

        h4 {
          margin: 12px 0 8px;
          font-size: 0.95rem;
        }

        .helper {
          margin: 0 0 12px;
          font-size: 0.9rem;
          color: #4b5563;
        }

        .domain-grid {
          display: grid;
          gap: 12px;
        }

        .domain {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          background: #fbfbfc;
        }

        .domain-body {
          margin-top: 12px;
          display: grid;
          gap: 10px;
        }

        .item-row {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          background: #ffffff;
          display: grid;
          grid-template-columns: minmax(220px, 2fr) repeat(2, minmax(140px, 1fr));
          gap: 12px;
          align-items: start;
        }

        .item-label {
          display: flex;
          gap: 8px;
          font-weight: 600;
        }

        .field label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .tag-block {
          grid-column: 1 / -1;
          border-top: 1px dashed #e5e7eb;
          padding-top: 10px;
        }

        .tag-title {
          font-weight: 600;
          font-size: 0.85rem;
          margin-bottom: 6px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 12px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f3f4f6;
          border-radius: 999px;
          padding: 4px 8px;
          border: 1px solid #e5e7eb;
          font-size: 0.8rem;
        }

        .note {
          grid-column: 1 / -1;
          margin: 0;
          font-size: 0.82rem;
          color: #6b7280;
        }

        select,
        input {
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 6px 8px;
          font-size: 0.85rem;
          background: #ffffff;
        }

        .summary-actions button {
          background: #0f5e63;
          color: #ffffff;
          border: none;
          padding: 8px 12px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .summary-box {
          margin-top: 12px;
          padding: 12px;
          border-radius: 12px;
          background: #eff4f6;
          border: 1px solid #cfe3e6;
          font-size: 0.9rem;
        }

        .transparency {
          margin-top: 12px;
          border-top: 1px dashed #e5e7eb;
          padding-top: 12px;
        }

        .footer {
          font-size: 0.85rem;
          color: #4b5563;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
        }

        ul {
          margin: 0;
          padding-left: 18px;
          color: #374151;
        }

        @media (max-width: 900px) {
          .item-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
