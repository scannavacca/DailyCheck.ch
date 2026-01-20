"use client";

import { useMemo, useState } from "react";

type TraitItem = {
  id: string;
  label: string;
  cluster: string;
  microcopy: string;
};

type TraitState = {
  present: boolean;
  severity: string;
  persistence: string;
  notes: string;
};

type FunctionRating = {
  id: string;
  label: string;
};

type DifferentialItem = {
  id: string;
  label: string;
  why: string;
};

const severityOptions = [
  { value: "0", label: "0 - keine" },
  { value: "1", label: "1 - leicht" },
  { value: "2", label: "2 - mittel" },
  { value: "3", label: "3 - ausgepraegt" },
];

const persistenceOptions = [
  { value: "episodic", label: "situativ" },
  { value: "recurrent", label: "rezidivierend" },
  { value: "persistent", label: "persistent" },
];

const impairmentOptions = [
  { value: "none", label: "none" },
  { value: "mild", label: "mild" },
  { value: "moderate", label: "moderate" },
  { value: "severe", label: "severe" },
];

const contextTags = [
  { id: "substance", label: "Substanz" },
  { id: "trauma", label: "Trauma" },
  { id: "neurodev", label: "Neuroentwicklung (ADHS/ASS)" },
  { id: "affective", label: "Affektive Episoden" },
  { id: "psychotic", label: "Psychotische Symptome" },
  { id: "somatic", label: "Somatisch/neurologisch" },
];

const traitClusters: TraitItem[] = [
  // Paranoid
  {
    id: "par_mistrust",
    label: "Anhaltendes Misstrauen/Argwohn",
    cluster: "Misstrauen / paranoide Muster",
    microcopy: "Kann die Beziehungsgestaltung und Realitaetsbewertung belasten.",
  },
  {
    id: "par_hostile_interpretation",
    label: "Neutrale Ereignisse als feindlich interpretieren",
    cluster: "Misstrauen / paranoide Muster",
    microcopy: "Fuehrt zu Konflikten und Fehlzuschreibungen.",
  },
  {
    id: "par_rejection_sensitivity",
    label: "Kraenkbarkeit/Ueberempfindlichkeit gegenueber Zurueckweisung",
    cluster: "Misstrauen / paranoide Muster",
    microcopy: "Erhoeht Spannungen bei Kritik oder Abgrenzung.",
  },
  {
    id: "par_grudge",
    label: "Groll nachtragen / geringe Vergebungsbereitschaft",
    cluster: "Misstrauen / paranoide Muster",
    microcopy: "Stabilisiert Konfliktmuster ueber Zeit.",
  },
  {
    id: "par_jealousy",
    label: "Eifersuchts-/Untreue-Verdacht",
    cluster: "Misstrauen / paranoide Muster",
    microcopy: "Kann Beziehungssicherheit dauerhaft beeintraechtigen.",
  },

  // Schizoid
  {
    id: "szd_low_need_relationships",
    label: "Wenig Beduerfnis nach engen Beziehungen",
    cluster: "Distanz / emotionaler Rueckzug",
    microcopy: "Soziale Distanz kann als stabiler Lebensstil erscheinen.",
  },
  {
    id: "szd_limited_emotion",
    label: "Eingeschraenkte emotionale Resonanz/Expressivitaet",
    cluster: "Distanz / emotionaler Rueckzug",
    microcopy: "Beeinflusst Affektspiegelung und Verbundenheit.",
  },
  {
    id: "szd_low_social_pleasure",
    label: "Geringe Freude an sozialen Aktivitaeten",
    cluster: "Distanz / emotionaler Rueckzug",
    microcopy: "Hinweis auf reduzierte soziale Verstaerkung.",
  },
  {
    id: "szd_prefers_solitary",
    label: "Bevorzugt Einzelaktivitaeten",
    cluster: "Distanz / emotionaler Rueckzug",
    microcopy: "Kann Alltagsstruktur und Beziehungen praegen.",
  },

  // Schizotyp
  {
    id: "szt_odd_beliefs",
    label: "Eigenartige Ueberzeugungen / magisches Denken (nicht kulturell normativ)",
    cluster: "Exzentrik / odd / soziale Kognition",
    microcopy: "Kann soziale Kognition und Vertrauen beeinflussen.",
  },
  {
    id: "szt_unusual_perception",
    label: "Ungewoehnliche Wahrnehmungserlebnisse (subpsychotisch)",
    cluster: "Exzentrik / odd / soziale Kognition",
    microcopy: "Wichtig zur Abgrenzung psychotischer DD.",
  },
  {
    id: "szt_odd_behavior",
    label: "Sonderbares Verhalten/Erscheinungsbild",
    cluster: "Exzentrik / odd / soziale Kognition",
    microcopy: "Hinweis auf anhaltende Exzentrik.",
  },
  {
    id: "szt_social_anxiety_mistrust",
    label: "Soziale Aengstlichkeit mit misstrauischer Faerbung",
    cluster: "Exzentrik / odd / soziale Kognition",
    microcopy: "Nicht nur Schuechternheit; Misstrauen steht im Vordergrund.",
  },

  // Dissozial
  {
    id: "dis_norm_violation",
    label: "Missachtung sozialer Normen/Rechte anderer",
    cluster: "Dissozial / antisozial",
    microcopy: "Rechts- und Regelverletzungen als Muster.",
  },
  {
    id: "dis_impulsivity",
    label: "Impulsivitaet/geringe Frustrationstoleranz",
    cluster: "Dissozial / antisozial",
    microcopy: "Erhoeht Risiko fuer Konflikte und Regelverstoss.",
  },
  {
    id: "dis_low_remorse",
    label: "Geringe Reue / Verantwortungsuebernahme",
    cluster: "Dissozial / antisozial",
    microcopy: "Beeinflusst Einsicht und Beziehungsstabilitaet.",
  },
  {
    id: "dis_repeated_rule_breaking",
    label: "Wiederholte Regelverletzungen (dokumentationsorientiert)",
    cluster: "Dissozial / antisozial",
    microcopy: "Faktische Dokumentation statt Wertung.",
  },

  // Histrionisch
  {
    id: "his_attention",
    label: "Starkes Beduerfnis nach Bestaetigung/Aufmerksamkeit",
    cluster: "Dramatisierung / Aufmerksamkeit",
    microcopy: "Praegt Kommunikationsstil und Beziehungsmuster.",
  },
  {
    id: "his_shifting_affect",
    label: "Rasch wechselnde, oberflaechlich wirkende Affekte",
    cluster: "Dramatisierung / Aufmerksamkeit",
    microcopy: "Affekt wirkt intensiv, aber wechselhaft.",
  },
  {
    id: "his_impressionistic",
    label: "Impressionistische, wenig detailreiche Kommunikation",
    cluster: "Dramatisierung / Aufmerksamkeit",
    microcopy: "Inhalte sind oft unscharf und situationsgetrieben.",
  },
  {
    id: "his_relation_influence",
    label: "Uebermaessige Einflussnahme durch Beziehungskontext",
    cluster: "Dramatisierung / Aufmerksamkeit",
    microcopy: "Starker Fokus auf soziale Rueckmeldung.",
  },

  // Narzisstisch
  {
    id: "nar_grandiosity",
    label: "Ueberhoehte Selbstbedeutung/Statusfokus",
    cluster: "Grandiositaet / Anspruch",
    microcopy: "Praegt Erwartungen an Leistung und Anerkennung.",
  },
  {
    id: "nar_admiration",
    label: "Beduerfnis nach Bewunderung",
    cluster: "Grandiositaet / Anspruch",
    microcopy: "Empfindlich bei fehlender Bestaetigung.",
  },
  {
    id: "nar_entitlement",
    label: "Anspruchsdenken/kraenkbare Selbstwertregulation",
    cluster: "Grandiositaet / Anspruch",
    microcopy: "Reagiert empfindlich auf Zuruecksetzung.",
  },
  {
    id: "nar_low_empathy",
    label: "Eingeschraenkte Perspektivuebernahme",
    cluster: "Grandiositaet / Anspruch",
    microcopy: "Nicht moralisch, sondern funktional dokumentieren.",
  },

  // Avoidant
  {
    id: "avo_rejection_sensitivity",
    label: "Starke Zurueckweisungssensitivitaet",
    cluster: "Vermeidung / soziale Gehemmtheit",
    microcopy: "Fuehrt zu Rueckzug trotz Beziehungswunsch.",
  },
  {
    id: "avo_social_inhibition",
    label: "Soziale Hemmung / Minderwertigkeitsgefuehl",
    cluster: "Vermeidung / soziale Gehemmtheit",
    microcopy: "Soziale Situationen werden als bedrohlich erlebt.",
  },
  {
    id: "avo_avoid_despite_want",
    label: "Vermeidung trotz Wunsch nach Beziehungen",
    cluster: "Vermeidung / soziale Gehemmtheit",
    microcopy: "Ambivalenz zwischen Naehe und Schutz.",
  },
  {
    id: "avo_risk_aversion",
    label: "Risikoaversion bei Bewertung durch andere",
    cluster: "Vermeidung / soziale Gehemmtheit",
    microcopy: "Fokussiert auf moegliche Kritik.",
  },

  // Dependent
  {
    id: "dep_decision_difficulty",
    label: "Schwierigkeiten eigenstaendige Entscheidungen zu treffen",
    cluster: "Abhaengigkeit / Unterordnung",
    microcopy: "Hoher Bedarf an Rueckversicherung.",
  },
  {
    id: "dep_reassurance",
    label: "Starkes Beduerfnis nach Rueckversicherung",
    cluster: "Abhaengigkeit / Unterordnung",
    microcopy: "Sucht haeufige Bestaetigung.",
  },
  {
    id: "dep_abandonment_fear",
    label: "Angst vor Verlassenwerden -> klammerndes Verhalten",
    cluster: "Abhaengigkeit / Unterordnung",
    microcopy: "Beziehungsdynamik wird stark beeinflusst.",
  },
  {
    id: "dep_delegate",
    label: "Delegieren von Verantwortung",
    cluster: "Abhaengigkeit / Unterordnung",
    microcopy: "Eigenverantwortung ist eingeschraenkt.",
  },

  // Anankastisch
  {
    id: "ana_perfectionism",
    label: "Perfektionismus mit Funktionsverlust",
    cluster: "Perfektionismus / Rigiditaet / Kontrollbedarf",
    microcopy: "Zielerreichung leidet unter Uebergenauigkeit.",
  },
  {
    id: "ana_detail_rules",
    label: "Uebermaessige Detail- und Regelorientierung",
    cluster: "Perfektionismus / Rigiditaet / Kontrollbedarf",
    microcopy: "Flexibilitaet und Priorisierung leiden.",
  },
  {
    id: "ana_rigidity",
    label: "Rigiditaet/Unflexibilitaet",
    cluster: "Perfektionismus / Rigiditaet / Kontrollbedarf",
    microcopy: "Anpassung an neue Anforderungen erschwert.",
  },
  {
    id: "ana_control_delegate",
    label: "Kontrollbedarf, Schwierigkeiten zu delegieren",
    cluster: "Perfektionismus / Rigiditaet / Kontrollbedarf",
    microcopy: "Kooperationsfaehigkeit eingeschraenkt.",
  },

  // Mixed / Unspecified
  {
    id: "mix_multiple_high",
    label: "Mischbild: mehrere Cluster hoch",
    cluster: "Mixed / Unspecified Pattern",
    microcopy: "Hinweis auf unspezifisches oder gemischtes Muster.",
  },
  {
    id: "mix_unclear_onset",
    label: "Unklare Stabilitaet/Onset -> weitere Abklaerung noetig",
    cluster: "Mixed / Unspecified Pattern",
    microcopy: "Laengsschnittliche Abklaerung erforderlich.",
  },
];

const functionRatings: FunctionRating[] = [
  { id: "func_work", label: "Arbeit/Ausbildung" },
  { id: "func_relationships", label: "Beziehungen/Familie" },
  { id: "func_daily", label: "Alltagsorganisation" },
  { id: "func_affect", label: "Affektregulation im Alltag" },
  { id: "func_conflict", label: "Konflikt-/Impulskontrolle" },
  { id: "func_qol", label: "Lebensqualitaet" },
];

const ddItems: DifferentialItem[] = [
  {
    id: "dd_bipolar",
    label: "Bipolare Stoerung / Episodenhaftigkeit",
    why: "Episodische, anhaltende Stimmungsepisoden sprechen eher fuer affektive Stoerungen als Traits.",
  },
  {
    id: "dd_neurodev",
    label: "ADHS/ASS (neurodevelopmental; fruehe Anamnese)",
    why: "Fruehbeginnendes Muster kann neurodevelopmental begruendet sein.",
  },
  {
    id: "dd_substance",
    label: "Substanz-/Medikamenteneffekt",
    why: "Substanzeffekte koennen Impulsivitaet und Affekt modulieren.",
  },
  {
    id: "dd_trauma",
    label: "Traumafolgestoerungen / C-PTBS-Muster",
    why: "Traumabedingte Dysregulation kann traits aehnlich wirken.",
  },
  {
    id: "dd_psychotic",
    label: "Psychotisches Spektrum (persistente Positivsymptome)",
    why: "Persistente Positivsymptome sprechen fuer psychotische DD.",
  },
  {
    id: "dd_ocd_vs_anankastic",
    label: "Zwangsstoerung vs anankastische Traits",
    why: "Zwangssymptome sind meist ego-dyston und ritualisiert.",
  },
  {
    id: "dd_social_anxiety_vs_avoidant",
    label: "Soziale Angst vs vermeidende Traits",
    why: "Soziale Angst kann situativ sein; Traits sind stabiler.",
  },
];

function makeInitialTraitState(items: TraitItem[]) {
  const state: Record<string, TraitState> = {};
  for (const item of items) {
    state[item.id] = {
      present: false,
      severity: "0",
      persistence: persistenceOptions[0].value,
      notes: "",
    };
  }
  return state;
}

export default function NonBpdPersonalityDisorderModule() {
  const [onset, setOnset] = useState("unclear");
  const [pervasive, setPervasive] = useState("unclear");
  const [stability, setStability] = useState("persistent");
  const [impairment, setImpairment] = useState("none");
  const [context, setContext] = useState<Record<string, boolean>>(
    Object.fromEntries(contextTags.map((tag) => [tag.id, false]))
  );

  const [traits, setTraits] = useState(() => makeInitialTraitState(traitClusters));
  const [functioning, setFunctioning] = useState<Record<string, string>>(
    Object.fromEntries(functionRatings.map((item) => [item.id, "none"]))
  );
  const [functionNote, setFunctionNote] = useState("");
  const [ddFlags, setDdFlags] = useState<Record<string, boolean>>(
    Object.fromEntries(ddItems.map((item) => [item.id, false]))
  );

  const [risk, setRisk] = useState({
    selfHarm: "none",
    planIntent: "unclear",
    otherHarm: "unclear",
    acuteImpulsivity: "no",
  });

  const [summary, setSummary] = useState("");

  const clusters = useMemo(() => {
    const grouped = new Map<string, TraitItem[]>();
    for (const item of traitClusters) {
      if (!grouped.has(item.cluster)) grouped.set(item.cluster, []);
      grouped.get(item.cluster)?.push(item);
    }
    return Array.from(grouped.entries());
  }, []);

  const updateTrait = (id: string, patch: Partial<TraitState>) => {
    setTraits((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const generateSummary = () => {
    const selectedClusters = clusters
      .filter(([, items]) => items.some((item) => traits[item.id]?.present))
      .map(([cluster]) => cluster);

    const highSeverityClusters = clusters.filter(([, items]) =>
      items.some((item) => traits[item.id]?.present && Number(traits[item.id].severity) >= 2)
    );

    const impairmentFlag = impairment === "moderate" || impairment === "severe";
    const onsetFlag = onset === "yes";
    const pervasiveFlag = pervasive === "yes";

    const ddNotes = ddItems.filter((item) => ddFlags[item.id]).map((item) => item.label);
    const contextNotes = contextTags.filter((tag) => context[tag.id]).map((tag) => tag.label);

    let primaryLine =
      "Es liegen derzeit nicht genuegend strukturierte Angaben fuer ein klares Persoenlichkeitsmuster vor.";
    if (onsetFlag && pervasiveFlag && highSeverityClusters.length >= 1 && impairmentFlag) {
      primaryLine =
        "Dokumentierte Muster sind kompatibel mit einem Persoenlichkeitsmuster; eine PD-Abklaerung ist indiziert (klinische Bestaetigung erforderlich).";
    }

    if (ddFlags.dd_bipolar) {
      primaryLine += " Episodenhafte affektive Muster sind markiert; differenzialdiagnostische Abgrenzung ist zentral.";
    }

    const summaryLines = [
      primaryLine,
      selectedClusters.length
        ? `Dokumentierte Muster sind kompatibel mit: ${selectedClusters.slice(0, 3).join("; ")}.`
        : "Dokumentierte Muster: keine Cluster gewaehlt.",
      `Auspraegung/Impairment: ${impairment}; Onset/Pervasivitaet: ${onset}/${pervasive}; Stabilitaet: ${stability}.`,
      ddNotes.length ? `Differenzialdiagnostische Erwaegungen: ${ddNotes.join(", ")}.` : "",
      contextNotes.length ? `Kontext-Tags: ${contextNotes.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    setSummary(summaryLines);
  };

  return (
    <section className="pd-module">
      <div className="banner">
        <h2>Persoenlichkeitsstoerungen – Diagnostikmodul (Deterministisch)</h2>
        <p className="subtitle">Langzeitmuster + Funktionsbeeintraechtigung + Differenziale (keine Diagnose)</p>
        <div className="disclaimer">
          <p>
            Diese Software stellt keine Diagnosen und trifft keine Therapieentscheidungen. Die klinische Verantwortung
            verbleibt vollstaendig bei der approbierten Fachperson.
          </p>
          <p>Ausgaben sind strukturierte Denk- und Dokumentationshilfen und muessen im Kontext klinisch verifiziert werden.</p>
        </div>
      </div>

      <div className="card">
        <h3>Was dieses Modul ist</h3>
        <ul>
          <li>Dokumentiert langfristige Muster (ueber Jahre), nicht Momentaufnahmen.</li>
          <li>Trennt: Trait-Muster, Funktionsbeeintraechtigung, Differenzialdiagnostik/Komorbiditaet.</li>
          <li>Output ist immer kompatibel mit ... und beinhaltet Unsicherheiten.</li>
        </ul>
      </div>

      <div className="card">
        <h3>Basis-Flags</h3>
        <div className="grid">
          <label>
            Beginn/Onset seit Adoleszenz/fruehem Erwachsenenalter?
            <select value={onset} onChange={(e) => setOnset(e.target.value)}>
              <option value="yes">ja</option>
              <option value="no">nein</option>
              <option value="unclear">unklar</option>
            </select>
          </label>
          <label>
            Pervasivitaet in mehreren Lebensbereichen/Beziehungen?
            <select value={pervasive} onChange={(e) => setPervasive(e.target.value)}>
              <option value="yes">ja</option>
              <option value="no">nein</option>
              <option value="unclear">unklar</option>
            </select>
          </label>
          <label>
            Stabilitaet
            <select value={stability} onChange={(e) => setStability(e.target.value)}>
              <option value="persistent">persistent</option>
              <option value="recurrent">rezidivierend</option>
              <option value="situational">situativ</option>
            </select>
          </label>
          <label>
            Distress/Impairment
            <select value={impairment} onChange={(e) => setImpairment(e.target.value)}>
              {impairmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="tag-block">
          <div className="tag-title">Kontext-Tags</div>
          <div className="tags">
            {contextTags.map((tag) => (
              <label key={tag.id}>
                <input
                  type="checkbox"
                  checked={context[tag.id]}
                  onChange={(e) => setContext((prev) => ({ ...prev, [tag.id]: e.target.checked }))}
                />
                <span>{tag.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Trait-Cluster (reworded)</h3>
        <div className="clusters">
          {clusters.map(([cluster, items]) => (
            <details key={cluster} open>
              <summary>{cluster}</summary>
              <div className="cluster-body">
                {items.map((item) => {
                  const state = traits[item.id];
                  return (
                    <div key={item.id} className="trait-row">
                      <label className="trait-label">
                        <input
                          type="checkbox"
                          checked={state.present}
                          onChange={(e) => updateTrait(item.id, { present: e.target.checked })}
                        />
                        <span>{item.label}</span>
                      </label>
                      <div className="field">
                        <label>Schwere (0–3)</label>
                        <select value={state.severity} onChange={(e) => updateTrait(item.id, { severity: e.target.value })}>
                          {severityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label>Persistenz</label>
                        <select
                          value={state.persistence}
                          onChange={(e) => updateTrait(item.id, { persistence: e.target.value })}
                        >
                          {persistenceOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label>Notiz</label>
                        <input
                          value={state.notes}
                          onChange={(e) => updateTrait(item.id, { notes: e.target.value })}
                          placeholder="Optional"
                        />
                      </div>
                      <p className="microcopy">{item.microcopy}</p>
                    </div>
                  );
                })}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Funktions- und Kontext-Modul (ICF-orientiert)</h3>
        <div className="grid">
          {functionRatings.map((item) => (
            <label key={item.id}>
              {item.label}
              <select
                value={functioning[item.id]}
                onChange={(e) => setFunctioning((prev) => ({ ...prev, [item.id]: e.target.value }))}
              >
                {impairmentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <label className="note-field">
          Belege/Beispiele (klinische Notiz)
          <input value={functionNote} onChange={(e) => setFunctionNote(e.target.value)} placeholder="Optional" />
        </label>
      </div>

      <div className="card">
        <h3>Differenzialdiagnostische Prompt-Liste</h3>
        <div className="dd-grid">
          {ddItems.map((item) => (
            <label key={item.id} className="dd-item">
              <input
                type="checkbox"
                checked={ddFlags[item.id]}
                onChange={(e) => setDdFlags((prev) => ({ ...prev, [item.id]: e.target.checked }))}
              />
              <div>
                <div className="dd-title">{item.label}</div>
                <div className="dd-why">{item.why}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card risk">
        <h3>Sicherheits-/Risikoblock</h3>
        <div className="grid">
          <label>
            Selbstgefaehrdung
            <select value={risk.selfHarm} onChange={(e) => setRisk((prev) => ({ ...prev, selfHarm: e.target.value }))}>
              <option value="none">none</option>
              <option value="passive">passiv</option>
              <option value="active">aktiv</option>
            </select>
          </label>
          <label>
            Plan/Intent
            <select value={risk.planIntent} onChange={(e) => setRisk((prev) => ({ ...prev, planIntent: e.target.value }))}>
              <option value="yes">ja</option>
              <option value="no">nein</option>
              <option value="unclear">unklar</option>
            </select>
          </label>
          <label>
            Fremdgefaehrdung
            <select value={risk.otherHarm} onChange={(e) => setRisk((prev) => ({ ...prev, otherHarm: e.target.value }))}>
              <option value="yes">ja</option>
              <option value="no">nein</option>
              <option value="unclear">unklar</option>
            </select>
          </label>
          <label>
            Impulsivitaet akut
            <select
              value={risk.acuteImpulsivity}
              onChange={(e) => setRisk((prev) => ({ ...prev, acuteImpulsivity: e.target.value }))}
            >
              <option value="yes">ja</option>
              <option value="no">nein</option>
            </select>
          </label>
        </div>
        <p className="risk-note">
          Bei akuter Gefaehrdung sind lokale Notfallprozesse zu befolgen; dokumentiere die getroffenen Schritte.
        </p>
      </div>

      <div className="card">
        <h3>Reasoning Summary</h3>
        <div className="summary-actions">
          <button type="button" onClick={generateSummary}>
            Reasoning Summary generieren
          </button>
        </div>
        <div className="summary-box">{summary || "Summary erscheint nach Klick."}</div>

        <div className="transparency">
          <h4>Transparenzregeln (If/Then)</h4>
          <ul>
            <li>
              Wenn Onset=ja UND Pervasiv=ja UND &gt;=1 Cluster Schwere&gt;=2 UND Impairment&gt;=moderate -&gt;
              "Persoenlichkeitsmuster wahrscheinlich; PD-Abklaerung indiziert".
            </li>
            <li>Wenn Episoden-Flag hoch -&gt; bipolar/affektiv DD hervorheben.</li>
            <li>Wenn Substanz-Flag hoch -&gt; substanzassoziierte DD hervorheben.</li>
            <li>Wenn psychotisch-Flag hoch -&gt; psychotisches Spektrum DD hervorheben.</li>
            <li>Wenn viele Cluster hoch -&gt; "Mixed/unspecified pattern".</li>
          </ul>
        </div>
      </div>

      <div className="footer">
        <p>
          Diese Software stellt keine Diagnosen und trifft keine Therapieentscheidungen. Die klinische Verantwortung
          verbleibt vollstaendig bei der approbierten Fachperson.
        </p>
      </div>

      <style jsx>{`
        .pd-module {
          display: grid;
          gap: 18px;
          padding: 24px;
          border-radius: 20px;
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

        ul {
          margin: 0;
          padding-left: 18px;
          color: #374151;
        }

        .grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        label {
          display: grid;
          gap: 6px;
          font-size: 0.9rem;
          color: #374151;
        }

        select,
        input {
          border: 1px solid #d1d5db;
          border-radius: 10px;
          padding: 6px 8px;
          font-size: 0.85rem;
          background: #ffffff;
        }

        .tag-block {
          margin-top: 12px;
          border-top: 1px dashed #e5e7eb;
          padding-top: 12px;
        }

        .tag-title {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 12px;
        }

        .tags label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f3f4f6;
          border-radius: 999px;
          padding: 4px 8px;
          border: 1px solid #e5e7eb;
        }

        .clusters details {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          background: #fbfbfc;
        }

        .cluster-body {
          margin-top: 12px;
          display: grid;
          gap: 10px;
        }

        .trait-row {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          background: #ffffff;
          display: grid;
          grid-template-columns: minmax(220px, 2fr) repeat(3, minmax(140px, 1fr));
          gap: 12px;
          align-items: start;
        }

        .trait-label {
          display: flex;
          gap: 8px;
          font-weight: 600;
        }

        .field label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .microcopy {
          grid-column: 1 / -1;
          margin: 0;
          font-size: 0.82rem;
          color: #6b7280;
        }

        .note-field {
          margin-top: 12px;
        }

        .dd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 10px;
        }

        .dd-item {
          display: flex;
          gap: 10px;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
        }

        .dd-title {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .dd-why {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 4px;
        }

        .risk {
          border-color: #f1c6a6;
          background: #fff8ed;
        }

        .risk-note {
          margin-top: 12px;
          font-size: 0.9rem;
          color: #7c4a00;
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

        @media (max-width: 900px) {
          .trait-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
