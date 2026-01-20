"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

type SymptomItem = {
  id: string;
  label: string;
  domainId: string;
};

type SymptomState = {
  present: boolean;
  severity: string;
  duration: string;
  context: Record<string, boolean>;
};

type PsychosisState = {
  present: boolean;
  severity: string;
  duration: string;
  monthFlag: boolean;
  context: Record<string, boolean>;
};

type BipolarState = {
  present: boolean;
  severity: string;
  duration: string;
  context: Record<string, boolean>;
};

type OcdSymptomState = {
  present: boolean;
  severity: string;
  timeBurden: string;
  impairment: string;
  insight: string;
  context: Record<string, boolean>;
};

type PtsdChecklistState = {
  present: boolean;
  severity: string;
  timeframe: string;
  context: Record<string, boolean>;
  notes: string;
};

type BpdChecklistState = {
  present: boolean;
  severity: string;
  persistence: string;
  timeframe: string;
  context: Record<string, boolean>;
  notes: string;
};

type DomainGroup = {
  id: string;
  label: string;
  items: SymptomItem[];
};

const contextTagOptions = [
  { id: "substance", label: "Substance-related" },
  { id: "organic", label: "Organic/medical" },
  { id: "stressor", label: "Stressor-related" },
  { id: "affective_prodrome", label: "Affective prodrome" },
];

const severityOptions = [
  { value: "0", label: "0 - none" },
  { value: "1", label: "1 - mild" },
  { value: "2", label: "2 - moderate" },
  { value: "3", label: "3 - marked" },
];

const generalDurationOptions = [
  { value: "acute", label: "Acute" },
  { value: "subacute", label: "Subacute" },
  { value: "chronic", label: "Chronic" },
];

const depressionDurationOptions = [
  { value: "2_4w", label: "2-4 weeks (most days)" },
  { value: "4_8w", label: "4-8 weeks (most days)" },
  { value: "8w_plus", label: ">=8 weeks (most days)" },
  { value: "chronic_2y", label: "Chronic >=2 years" },
];

const psychosisContextTags = [
  { id: "substance_related", label: "Substance-related" },
  { id: "organic_delirium", label: "Organic/delirium indicators" },
  { id: "mood_linked", label: "Mood-episode linked" },
  { id: "unclear_timing", label: "Unclear timing" },
];

const bipolarContextTags = [
  { id: "substance_related", label: "Substance-related" },
  { id: "organic_medical", label: "Organic/medical" },
  { id: "antidepressant_associated", label: "Antidepressant-associated" },
  { id: "stress_related", label: "Stress-related" },
];

const bipolarDurationOptions = [
  { value: "days", label: "Days" },
  { value: "ge_4d", label: ">= 4 days" },
  { value: "ge_1w", label: ">= 1 week" },
  { value: "ge_2w", label: ">= 2 weeks" },
];

const ocdTimeBurdenOptions = [
  { value: "lt_1h", label: "<1h/day" },
  { value: "1_3h", label: "1-3h/day" },
  { value: "gt_3h", label: ">3h/day" },
];

const ocdImpairmentOptions = [
  { value: "none", label: "none" },
  { value: "mild", label: "mild" },
  { value: "moderate", label: "moderate" },
  { value: "severe", label: "severe" },
];

const ocdInsightOptions = [
  { value: "good", label: "good" },
  { value: "fair", label: "fair" },
  { value: "poor", label: "poor" },
  { value: "absent", label: "absent" },
];

const ocdContextTags = [
  { id: "substance_medical", label: "Substance/medical" },
  { id: "psychotic_concern", label: "Psychotic-spectrum concern" },
  { id: "mood_anxiety_context", label: "Mood/anxiety context" },
  { id: "tic_related", label: "Tic-related context" },
];

const ocdSeverityOptions = ["0", "1", "2", "3", "4"];

const ptsdTimeframeOptions = [
  { value: "lt_4w", label: "Under 4 weeks post-event" },
  { value: "ge_4w", label: "4 weeks or more post-event" },
  { value: "chronic", label: "Chronic or longstanding" },
];

const ptsdContextTags = [
  { id: "ongoing_threat", label: "Ongoing threat" },
  { id: "perpetrator_contact", label: "Perpetrator contact" },
  { id: "dependent_violent_relationship", label: "Dependent/violent relationship" },
  { id: "refugee_legal_status", label: "Refugee/legal status" },
  { id: "other_major_stressors", label: "Other major stressors" },
];

const bpdPersistenceOptions = [
  { value: "episodic", label: "Episodic" },
  { value: "recurrent", label: "Recurrent" },
  { value: "persistent", label: "Persistent" },
];

const bpdTimeframeOptions = [
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
  { value: "since_adolescence", label: "Since adolescence/early adulthood" },
];

const bpdContextTags = [
  { id: "interpersonal_stress", label: "Interpersonal stress" },
  { id: "abandonment_triggers", label: "Abandonment triggers" },
  { id: "substance_context", label: "Substance context" },
  { id: "trauma_context", label: "Trauma context" },
  { id: "mood_episode_context", label: "Mood-episode context" },
];

const symptomDomains: DomainGroup[] = [
  {
    id: "consciousness_awareness",
    label: "Consciousness & Awareness",
    items: [
      { id: "reduced_alertness", label: "Reduced alertness / drowsiness", domainId: "consciousness_awareness" },
      { id: "confusion", label: "Confusion / clouded awareness", domainId: "consciousness_awareness" },
      { id: "narrowed_awareness", label: "Narrowed field of awareness", domainId: "consciousness_awareness" },
      {
        id: "fluctuating_consciousness",
        label: "Fluctuating consciousness (intermittent lucidity)",
        domainId: "consciousness_awareness",
      },
    ],
  },
  {
    id: "orientation",
    label: "Orientation",
    items: [
      { id: "disorientation_time", label: "Disorientation in time", domainId: "orientation" },
      { id: "disorientation_space", label: "Disorientation in space", domainId: "orientation" },
      { id: "disorientation_situation", label: "Disorientation to situation", domainId: "orientation" },
      { id: "disorientation_self", label: "Disorientation to self", domainId: "orientation" },
    ],
  },
  {
    id: "attention_memory",
    label: "Attention & Memory",
    items: [
      { id: "poor_concentration", label: "Erratic or poor concentration", domainId: "attention_memory" },
      {
        id: "difficulty_learning",
        label: "Difficulty learning or remembering new information",
        domainId: "attention_memory",
      },
      { id: "memory_gaps", label: "Memory gaps for recent events", domainId: "attention_memory" },
      { id: "confabulation", label: "Confabulation or false recall", domainId: "attention_memory" },
    ],
  },
  {
    id: "thought_form_flow",
    label: "Thought Form & Flow",
    items: [
      { id: "slowed_thinking", label: "Slowed thinking", domainId: "thought_form_flow" },
      {
        id: "circumstantial_thinking",
        label: "Overly detailed or circumstantial thinking",
        domainId: "thought_form_flow",
      },
      { id: "narrowed_thought", label: "Narrowed thought content", domainId: "thought_form_flow" },
      { id: "repetitive_thinking", label: "Repetitive thinking", domainId: "thought_form_flow" },
      { id: "excessive_rumination", label: "Excessive rumination", domainId: "thought_form_flow" },
      { id: "racing_thoughts", label: "Racing thoughts", domainId: "thought_form_flow" },
      { id: "loose_associations", label: "Loose associations", domainId: "thought_form_flow" },
      { id: "tangential_responses", label: "Tangential responses", domainId: "thought_form_flow" },
      { id: "thought_blocking", label: "Thought blocking or sudden stop", domainId: "thought_form_flow" },
    ],
  },
  {
    id: "thought_content",
    label: "Thought Content Disturbances",
    items: [
      { id: "persistent_worry", label: "Persistent worrying or fears", domainId: "thought_content" },
      { id: "obsessive_thoughts", label: "Obsessive thoughts", domainId: "thought_content" },
      {
        id: "fixed_false_beliefs",
        label: "Fixed false beliefs (delusional thinking)",
        domainId: "thought_content",
      },
      { id: "ideas_of_reference", label: "Ideas of reference", domainId: "thought_content" },
      { id: "persecutory_ideas", label: "Persecutory ideas", domainId: "thought_content" },
      { id: "grandiose_beliefs", label: "Grandiose self-beliefs", domainId: "thought_content" },
    ],
  },
  {
    id: "perceptual",
    label: "Perceptual Alterations",
    items: [
      { id: "auditory", label: "Auditory perceptual experiences", domainId: "perceptual" },
      { id: "visual", label: "Visual perceptual experiences", domainId: "perceptual" },
      { id: "illusions", label: "Illusory distortions", domainId: "perceptual" },
      { id: "derealization", label: "Derealization", domainId: "perceptual" },
      { id: "depersonalization", label: "Depersonalization", domainId: "perceptual" },
    ],
  },
  {
    id: "self_experience",
    label: "Self-Experience Disturbances",
    items: [
      {
        id: "thought_insertion",
        label: "Thought insertion or withdrawal experiences",
        domainId: "self_experience",
      },
      { id: "unreal_self", label: "Feelings of unreal self-presence", domainId: "self_experience" },
      {
        id: "altered_boundary",
        label: "Altered boundary between self and environment",
        domainId: "self_experience",
      },
    ],
  },
  {
    id: "affect_mood",
    label: "Affect & Mood",
    items: [
      { id: "consistently_low_mood", label: "Consistently low mood", domainId: "affect_mood" },
      { id: "reduced_emotional_response", label: "Reduced emotional responsiveness", domainId: "affect_mood" },
      { id: "hopelessness", label: "Excessive sadness or hopelessness", domainId: "affect_mood" },
      { id: "irritable_affect", label: "Irritable or angry affect", domainId: "affect_mood" },
      { id: "elevated_mood", label: "Elevated mood", domainId: "affect_mood" },
      { id: "expansive_affect", label: "Overly expansive affect", domainId: "affect_mood" },
    ],
  },
  {
    id: "drive_activity",
    label: "Drive / Motivation / Activity",
    items: [
      { id: "low_energy", label: "Low motivation / energy", domainId: "drive_activity" },
      { id: "reduced_goal", label: "Reduced goal-directed activity", domainId: "drive_activity" },
      { id: "restlessness", label: "Restlessness or agitation", domainId: "drive_activity" },
      { id: "excessive_activity", label: "Excessive activity (hyperactive)", domainId: "drive_activity" },
    ],
  },
  {
    id: "anxiety_tension",
    label: "Anxiety & Internal Tension",
    items: [
      { id: "persistent_anxiety", label: "Persistent anxiety or worry", domainId: "anxiety_tension" },
      { id: "bodily_tension", label: "Bodily tension", domainId: "anxiety_tension" },
      { id: "panic_sensations", label: "Panic-like sensations", domainId: "anxiety_tension" },
      { id: "agitation_anxiety", label: "Agitation", domainId: "anxiety_tension" },
    ],
  },
  {
    id: "sleep_circadian",
    label: "Sleep & Circadian Patterns",
    items: [
      { id: "sleep_onset", label: "Difficulty initiating sleep", domainId: "sleep_circadian" },
      { id: "sleep_maintenance", label: "Difficulty maintaining sleep", domainId: "sleep_circadian" },
      { id: "early_awakening", label: "Early morning awakening", domainId: "sleep_circadian" },
      { id: "excessive_sleepiness", label: "Excessive sleepiness", domainId: "sleep_circadian" },
    ],
  },
  {
    id: "somatic",
    label: "Somatic / Vegetative",
    items: [
      { id: "appetite_changes", label: "Appetite changes", domainId: "somatic" },
      { id: "weight_changes", label: "Weight changes", domainId: "somatic" },
      { id: "palpitations", label: "Heart palpitations", domainId: "somatic" },
      { id: "gi_complaints", label: "Gastrointestinal complaints", domainId: "somatic" },
      { id: "sweating_chills", label: "Sweating or chills", domainId: "somatic" },
      { id: "tremor", label: "Tremor", domainId: "somatic" },
    ],
  },
  {
    id: "impulse_safety",
    label: "Impulse Control & Safety",
    items: [
      { id: "suicidal_thoughts", label: "Suicidal thoughts", domainId: "impulse_safety" },
      { id: "self_harm", label: "Self-harm urges", domainId: "impulse_safety" },
      { id: "risky_behavior", label: "Impulsive risky behavior", domainId: "impulse_safety" },
    ],
  },
  {
    id: "social_function",
    label: "Social Function / Interaction",
    items: [
      { id: "social_withdrawal", label: "Withdrawal from social interaction", domainId: "social_function" },
      { id: "diminished_interest", label: "Diminished interest in usual activities", domainId: "social_function" },
      {
        id: "interpersonal_difficulties",
        label: "Difficulties in interpersonal communication",
        domainId: "social_function",
      },
    ],
  },
];

const depressionCoreItems: SymptomItem[] = [
  { id: "dep_low_mood", label: "Persistently depressed/low mood", domainId: "depression_core" },
  { id: "dep_anhedonia", label: "Marked loss of interest or pleasure", domainId: "depression_core" },
  {
    id: "dep_low_energy",
    label: "Reduced energy/increased fatigue/loss of drive",
    domainId: "depression_core",
  },
];

const depressionAdditionalItems: SymptomItem[] = [
  { id: "dep_concentration", label: "Reduced concentration/indecisiveness", domainId: "depression_additional" },
  { id: "dep_self_esteem", label: "Reduced self-confidence/self-esteem", domainId: "depression_additional" },
  { id: "dep_guilt", label: "Excessive/inappropriate guilt", domainId: "depression_additional" },
  {
    id: "dep_sleep",
    label: "Sleep disturbance (initiation/maintenance/early waking/hypersomnia)",
    domainId: "depression_additional",
  },
  { id: "dep_appetite", label: "Appetite/weight change", domainId: "depression_additional" },
  { id: "dep_psychomotor", label: "Psychomotor agitation or retardation", domainId: "depression_additional" },
  { id: "dep_suicidal", label: "Suicidal thoughts/behaviors", domainId: "depression_additional" },
];

const psychosisGroups: DomainGroup[] = [
  {
    id: "psychosis_positive",
    label: "A. Positive (Psychotic) Symptoms",
    items: [
      { id: "psy_halluc_auditory", label: "Auditory hallucinatory experiences", domainId: "psychosis_positive" },
      { id: "psy_halluc_visual", label: "Visual or other sensory hallucinatory experiences", domainId: "psychosis_positive" },
      { id: "psy_delusion_persecutory", label: "Persecutory delusional beliefs", domainId: "psychosis_positive" },
      { id: "psy_delusion_grandiose", label: "Grandiose delusional beliefs", domainId: "psychosis_positive" },
      { id: "psy_delusion_control", label: "Thought control or influence experiences", domainId: "psychosis_positive" },
      { id: "psy_delusion_reference", label: "Ideas of reference", domainId: "psychosis_positive" },
    ],
  },
  {
    id: "psychosis_disorganized",
    label: "B. Disorganized Thought Process",
    items: [
      { id: "psy_loose_assoc", label: "Loose associations or derailment", domainId: "psychosis_disorganized" },
      { id: "psy_tangential", label: "Tangential or ill-directed responses", domainId: "psychosis_disorganized" },
      { id: "psy_incoherent", label: "Marked incoherence", domainId: "psychosis_disorganized" },
    ],
  },
  {
    id: "psychosis_negative",
    label: "C. Negative Symptom Patterns",
    items: [
      { id: "psy_flat_affect", label: "Reduced emotional expression", domainId: "psychosis_negative" },
      { id: "psy_alogia", label: "Speech poverty or reduced output", domainId: "psychosis_negative" },
      { id: "psy_avolition", label: "Avolition or marked apathy", domainId: "psychosis_negative" },
      { id: "psy_social_withdrawal", label: "Social withdrawal or reduced engagement", domainId: "psychosis_negative" },
    ],
  },
  {
    id: "psychosis_formal_thought",
    label: "D. Formal Thought Disorders & Self-Disturbances",
    items: [
      { id: "psy_thought_blocking", label: "Thought blocking", domainId: "psychosis_formal_thought" },
      { id: "psy_thought_insertion", label: "Thought insertion or withdrawal experiences", domainId: "psychosis_formal_thought" },
      { id: "psy_self_boundary", label: "Disordered sense of agency or self-boundaries", domainId: "psychosis_formal_thought" },
    ],
  },
  {
    id: "psychosis_duration",
    label: "E. Duration & Temporal Pattern",
    items: [
      { id: "psy_duration_month", label: "Prominent psychotic symptoms >= 1 month", domainId: "psychosis_duration" },
      { id: "psy_continuous", label: "Continuous course", domainId: "psychosis_duration" },
      { id: "psy_episodic", label: "Episodic course with incomplete remission", domainId: "psychosis_duration" },
    ],
  },
  {
    id: "psychosis_dd_flags",
    label: "F. Differential Exclusion Flags",
    items: [
      { id: "psy_delirium", label: "Fluctuating consciousness or orientation disturbance", domainId: "psychosis_dd_flags" },
      { id: "psy_substance", label: "Close temporal relationship to intoxication or withdrawal", domainId: "psychosis_dd_flags" },
      { id: "psy_mood_only", label: "Psychosis occurs only during mood episodes", domainId: "psychosis_dd_flags" },
      { id: "psy_mood_present", label: "Prominent mood episode currently present", domainId: "psychosis_dd_flags" },
      { id: "psy_psychosis_independent", label: "Psychotic symptoms occur outside mood episodes", domainId: "psychosis_dd_flags" },
    ],
  },
  {
    id: "psychosis_function",
    label: "G. General Observation / Functional Impact",
    items: [
      { id: "psy_function_impairment", label: "Marked functional impairment attributable to symptoms", domainId: "psychosis_function" },
      { id: "psy_bizarre_behavior", label: "Bizarre or disorganized behavior", domainId: "psychosis_function" },
    ],
  },
];

const bipolarGroups: DomainGroup[] = [
  {
    id: "bipolar_mania_core",
    label: "A. Manic Episode - Core Features",
    items: [
      { id: "bipolar_mood_elevated", label: "Abnormally elevated or expansive mood", domainId: "bipolar_mania_core" },
      { id: "bipolar_mood_irritable", label: "Persistently irritable mood", domainId: "bipolar_mania_core" },
      { id: "bipolar_energy_increased", label: "Increased energy or activity level", domainId: "bipolar_mania_core" },
      { id: "bipolar_sleep_reduced", label: "Reduced need for sleep without fatigue", domainId: "bipolar_mania_core" },
      { id: "bipolar_grandiosity", label: "Inflated self-esteem or grandiosity", domainId: "bipolar_mania_core" },
      { id: "bipolar_talkative", label: "Increased talkativeness or pressured speech", domainId: "bipolar_mania_core" },
      { id: "bipolar_racing", label: "Racing thoughts or accelerated thinking", domainId: "bipolar_mania_core" },
      { id: "bipolar_distractible", label: "Distractibility", domainId: "bipolar_mania_core" },
      { id: "bipolar_goal_activity", label: "Increased goal-directed activity or agitation", domainId: "bipolar_mania_core" },
      { id: "bipolar_risk", label: "Risk-taking or impulsive behaviors", domainId: "bipolar_mania_core" },
    ],
  },
  {
    id: "bipolar_hypomania_features",
    label: "B. Hypomanic Episode - Distinguishing Features",
    items: [
      { id: "bipolar_hypo_change", label: "Observable change from baseline", domainId: "bipolar_hypomania_features" },
      {
        id: "bipolar_hypo_no_impairment",
        label: "No marked social or occupational impairment",
        domainId: "bipolar_hypomania_features",
      },
      { id: "bipolar_hypo_no_psychosis", label: "No psychotic features", domainId: "bipolar_hypomania_features" },
      { id: "bipolar_hypo_duration", label: "Duration flag: >= 4 consecutive days", domainId: "bipolar_hypomania_features" },
    ],
  },
  {
    id: "bipolar_depression",
    label: "C. Depressive Episode (Bipolar Context)",
    items: [
      { id: "bipolar_dep_low", label: "Persistently low or depressed mood", domainId: "bipolar_depression" },
      { id: "bipolar_dep_anhedonia", label: "Marked loss of interest or pleasure", domainId: "bipolar_depression" },
      { id: "bipolar_dep_fatigue", label: "Reduced energy or fatigue", domainId: "bipolar_depression" },
      { id: "bipolar_dep_concentration", label: "Impaired concentration or indecision", domainId: "bipolar_depression" },
      { id: "bipolar_dep_self_worth", label: "Reduced self-confidence or self-worth", domainId: "bipolar_depression" },
      { id: "bipolar_dep_guilt", label: "Excessive guilt or self-blame", domainId: "bipolar_depression" },
      { id: "bipolar_dep_sleep", label: "Sleep disturbance", domainId: "bipolar_depression" },
      { id: "bipolar_dep_appetite", label: "Appetite or weight change", domainId: "bipolar_depression" },
      { id: "bipolar_dep_psychomotor", label: "Psychomotor retardation or agitation", domainId: "bipolar_depression" },
      { id: "bipolar_dep_suicidal", label: "Suicidal thoughts or behaviors", domainId: "bipolar_depression" },
    ],
  },
  {
    id: "bipolar_mixed_features",
    label: "D. Mixed Features Specifiers",
    items: [
      { id: "bipolar_mixed_energy", label: "Depressive mood with increased energy or agitation", domainId: "bipolar_mixed_features" },
      { id: "bipolar_mixed_racing", label: "Depressive mood with racing thoughts", domainId: "bipolar_mixed_features" },
      { id: "bipolar_mixed_speech", label: "Depressive mood with pressured speech", domainId: "bipolar_mixed_features" },
      { id: "bipolar_mixed_irritable", label: "Irritable mood with depressive cognitions", domainId: "bipolar_mixed_features" },
      { id: "bipolar_mixed_risky", label: "High-risk impulsivity during depressive affect", domainId: "bipolar_mixed_features" },
    ],
  },
  {
    id: "bipolar_psychotic_features",
    label: "E. Psychotic Features (Cross-Episode Modifier)",
    items: [
      { id: "bipolar_psychosis_hallucinations", label: "Hallucinatory experiences (any modality)", domainId: "bipolar_psychotic_features" },
      { id: "bipolar_psychosis_delusions", label: "Delusional beliefs (mood-congruent or incongruent)", domainId: "bipolar_psychotic_features" },
      { id: "bipolar_psychosis_disorganized", label: "Disorganized thought processes", domainId: "bipolar_psychotic_features" },
    ],
  },
  {
    id: "bipolar_temporal_course",
    label: "F. Temporal & Course Indicators",
    items: [
      { id: "bipolar_time_thresholds", label: "Episode duration thresholds met", domainId: "bipolar_temporal_course" },
      { id: "bipolar_course_recurrent", label: "Episodic or recurrent pattern", domainId: "bipolar_temporal_course" },
      { id: "bipolar_remission_full", label: "Full remission between episodes", domainId: "bipolar_temporal_course" },
      { id: "bipolar_remission_partial", label: "Partial remission between episodes", domainId: "bipolar_temporal_course" },
      { id: "bipolar_rapid_shift", label: "Rapid symptom shifts", domainId: "bipolar_temporal_course" },
    ],
  },
  {
    id: "bipolar_dd_flags",
    label: "G. Differential & Exclusion Flags",
    items: [
      { id: "bipolar_dd_substance", label: "Substance-related temporal association", domainId: "bipolar_dd_flags" },
      { id: "bipolar_dd_antidepressant", label: "Antidepressant-associated symptom emergence", domainId: "bipolar_dd_flags" },
      { id: "bipolar_dd_organic", label: "Organic or medical condition indicators", domainId: "bipolar_dd_flags" },
      { id: "bipolar_dd_sleep_deprivation", label: "Sleep deprivation as primary driver", domainId: "bipolar_dd_flags" },
      { id: "bipolar_dd_psychosis_outside", label: "Psychotic symptoms occurring outside mood episodes", domainId: "bipolar_dd_flags" },
      { id: "bipolar_dd_psychosis_only_mood", label: "Psychotic symptoms only during mood episodes", domainId: "bipolar_dd_flags" },
    ],
  },
];

const ocdSymptomGroups: DomainGroup[] = [
  {
    id: "ocd_obsessions",
    label: "A. Obsession-like phenomena",
    items: [
      {
        id: "ocd_obs_intrusive",
        label: "Recurrent intrusive thoughts/images/impulses experienced as unwanted or aversive",
        domainId: "ocd_obsessions",
      },
      {
        id: "ocd_obs_suppression",
        label: "Attempts to suppress or neutralize the intrusive content",
        domainId: "ocd_obsessions",
      },
      {
        id: "ocd_obs_ego_attribution",
        label: "Recognized as products of one's own mind (ego-attribution)",
        domainId: "ocd_obsessions",
      },
      {
        id: "ocd_obs_not_worry",
        label: "Not merely realistic everyday worries or normal ruminations",
        domainId: "ocd_obsessions",
      },
    ],
  },
  {
    id: "ocd_compulsions",
    label: "B. Compulsion-like phenomena",
    items: [
      {
        id: "ocd_comp_repetitive",
        label: "Repetitive behaviors or mental acts performed in response to obsessions or rigid rules",
        domainId: "ocd_compulsions",
      },
      {
        id: "ocd_comp_relief",
        label: "Aimed at reducing distress or preventing feared events",
        domainId: "ocd_compulsions",
      },
      {
        id: "ocd_comp_excessive",
        label: "Clearly excessive or not realistically connected to what they aim to prevent",
        domainId: "ocd_compulsions",
      },
    ],
  },
  {
    id: "ocd_thresholds",
    label: "C. Core threshold flags (rule gating)",
    items: [
      {
        id: "ocd_threshold_distress",
        label: "Marked distress or significant functional impairment",
        domainId: "ocd_thresholds",
      },
      {
        id: "ocd_threshold_time",
        label: "Time-consuming nature (about 1 hour/day or more)",
        domainId: "ocd_thresholds",
      },
      {
        id: "ocd_threshold_persistence",
        label: "Persistence pattern: daily or most days",
        domainId: "ocd_thresholds",
      },
    ],
  },
];

const ocdScreeningQuestions = [
  { id: "ocd_screen_wash", label: "Excessive washing/cleaning?" },
  { id: "ocd_screen_check", label: "Excessive checking?" },
  { id: "ocd_screen_intrusive", label: "Distressing thoughts you cannot get rid of?" },
  { id: "ocd_screen_time", label: "Taking very long for everyday tasks?" },
  { id: "ocd_screen_symmetry", label: "Preoccupation with order/symmetry?" },
];

const ocdDdItems = [
  {
    id: "ocd_dd_gad",
    label: "GAD-like worry pattern (persistent worries without intrusive ego-dystonic quality; no neutralizing rituals)",
  },
  {
    id: "ocd_dd_phobia",
    label: "Phobia-like avoidance pattern (trigger-bound fear; avoidance primary; no active neutralization)",
  },
  {
    id: "ocd_dd_psychosis",
    label: "Psychotic-spectrum concern (externally inserted thoughts/voices; diminished ego-attribution)",
  },
  {
    id: "ocd_dd_eating",
    label: "Eating-disorder-related rigidity confined to weight/body/food",
  },
  {
    id: "ocd_dd_asd",
    label: "Autism-related stereotypies vs true OCD (context/communication considerations)",
  },
];

const ocdSomaticItems = [
  {
    id: "ocd_somatic_exam",
    label: "Baseline somatic and neurologic exam completed (yes/no)",
  },
  {
    id: "ocd_somatic_red_flags",
    label: "Red flags for secondary or organic causes",
  },
  {
    id: "ocd_somatic_late_onset",
    label: "Late onset (>50) flagged; consider neuropsych screening and structural imaging (CT/MRI) if indicated",
  },
];

const ocdImpactItems = [
  { id: "ocd_impact_activity", label: "Activities/handlungsfaehigkeit" },
  { id: "ocd_impact_participation", label: "Participation/Teilhabe" },
  { id: "ocd_impact_qol", label: "Quality of life" },
  { id: "ocd_impact_interpersonal", label: "Interpersonal impact" },
];

const ocdStepperSteps = [
  "Screening questions",
  "Criteria check + comorbidity screen",
  "Somatic/neurologic workup when indicated",
  "Baseline status + repeatable follow-up severity monitoring",
  "Capture functional impact domains",
  "Optional collateral input with consent",
];

const ptsdSymptomGroups: DomainGroup[] = [
  {
    id: "ptsd_symptoms",
    label: "B. PTSD-relevant symptom patterns",
    items: [
      { id: "ptsd_intrusion", label: "Intrusion-like phenomena (unwanted re-experiencing)", domainId: "ptsd_symptoms" },
      { id: "ptsd_avoidance", label: "Avoidance-like behaviors or thought avoidance", domainId: "ptsd_symptoms" },
      {
        id: "ptsd_arousal",
        label: "Threat/arousal activation (sleep, hypervigilance, startle, irritability)",
        domainId: "ptsd_symptoms",
      },
      {
        id: "ptsd_negative_mood",
        label: "Negative mood/cognition shifts (guilt, shame, detachment)",
        domainId: "ptsd_symptoms",
      },
    ],
  },
];

const ptsdComorbidityItems: SymptomItem[] = [
  { id: "ptsd_dd_depression", label: "Depressive symptoms", domainId: "ptsd_comorbidity" },
  { id: "ptsd_dd_anxiety", label: "Anxiety/panic symptoms", domainId: "ptsd_comorbidity" },
  { id: "ptsd_dd_dissociation", label: "Dissociative symptoms", domainId: "ptsd_comorbidity" },
  { id: "ptsd_dd_substance", label: "Substance-related symptoms", domainId: "ptsd_comorbidity" },
  { id: "ptsd_dd_psychotic", label: "Psychotic symptoms", domainId: "ptsd_comorbidity" },
  { id: "ptsd_dd_somatic", label: "Somatic symptom burden", domainId: "ptsd_comorbidity" },
];

const ptsdFunctionItems = [
  { id: "ptsd_function_activity", label: "Activity limitations (daily functioning)" },
  { id: "ptsd_function_participation", label: "Participation restrictions (work/education/social roles)" },
  { id: "ptsd_function_environment", label: "Environmental/context factors (family, housing, access to care)" },
  { id: "ptsd_function_specific", label: "PTSD-specific context factors (perpetrator contact, dependent relationship, legal status)" },
];

const ptsdStepperSteps = [
  "Trauma exposure capture (brief, non-detailed)",
  "Spontaneous symptom report (initial)",
  "Symptom intensity screening questionnaire (self-report)",
  "Indication-based structured clinical interview",
  "Comorbidity screen + differential diagnostic prompts",
  "Functional health capture (Activity/Participation + Context factors)",
];

const bpdTraitGroups: DomainGroup[] = [
  {
    id: "bpd_affective_instability",
    label: "A. Affective instability & emotional regulation",
    items: [
      { id: "bpd_mood_shifts", label: "Rapid mood shifts or intense affect reactivity", domainId: "bpd_affective_instability" },
      { id: "bpd_slow_recovery", label: "Marked difficulty returning to baseline after stress", domainId: "bpd_affective_instability" },
      { id: "bpd_emptiness", label: "Chronic feelings of emptiness", domainId: "bpd_affective_instability" },
      { id: "bpd_anger", label: "Intense anger or anger dysregulation", domainId: "bpd_affective_instability" },
    ],
  },
  {
    id: "bpd_interpersonal",
    label: "B. Interpersonal instability",
    items: [
      { id: "bpd_abandonment", label: "Fear of abandonment or strong sensitivity to separation", domainId: "bpd_interpersonal" },
      { id: "bpd_relationships", label: "Unstable intense relationships (idealization/devaluation patterns)", domainId: "bpd_interpersonal" },
      { id: "bpd_conflict", label: "Recurrent interpersonal conflict patterns", domainId: "bpd_interpersonal" },
    ],
  },
  {
    id: "bpd_identity",
    label: "C. Self-image / identity disturbances",
    items: [
      { id: "bpd_identity_instability", label: "Unstable sense of self, goals, or values", domainId: "bpd_identity" },
      { id: "bpd_self_doubt", label: "Pronounced self-doubt or rapidly shifting self-concept", domainId: "bpd_identity" },
    ],
  },
  {
    id: "bpd_impulsivity",
    label: "D. Impulsivity / behavioral dyscontrol",
    items: [
      { id: "bpd_impulsive_risk", label: "Impulsive risk behaviors (financial, sexual, substance, driving, bingeing)", domainId: "bpd_impulsivity" },
      { id: "bpd_self_damaging", label: "Self-damaging decision-making under distress", domainId: "bpd_impulsivity" },
    ],
  },
  {
    id: "bpd_self_harm",
    label: "E. Self-harm & suicidality (documentation-focused)",
    items: [
      { id: "bpd_nssi", label: "Non-suicidal self-injury urges or acts", domainId: "bpd_self_harm" },
      { id: "bpd_suicidal_ideation", label: "Suicidal ideation", domainId: "bpd_self_harm" },
      { id: "bpd_suicidal_plan", label: "Suicidal planning or attempts", domainId: "bpd_self_harm" },
      { id: "bpd_threats_gestures", label: "Threats or gestures in interpersonal context", domainId: "bpd_self_harm" },
    ],
  },
  {
    id: "bpd_dissociation",
    label: "F. Stress-related dissociation / perceptual-cognitive shifts",
    items: [
      { id: "bpd_dissociation", label: "Dissociative experiences under stress (depersonalization/derealization)", domainId: "bpd_dissociation" },
      { id: "bpd_paranoia", label: "Transient stress-related paranoid ideation or mistrust spikes", domainId: "bpd_dissociation" },
    ],
  },
];

const bpdDifferentialItems = [
  {
    id: "bpd_dd_bipolar",
    label: "Bipolar spectrum indicators (distinct episode boundaries, reduced need for sleep, elevated mood)",
    why: "Sustained episodic mood elevation can suggest bipolar-spectrum conditions rather than trait reactivity.",
  },
  {
    id: "bpd_dd_complex_ptsd",
    label: "Complex PTSD or trauma-related patterns",
    why: "Trauma-driven dysregulation may overlap; context and timing guide differential framing.",
  },
  {
    id: "bpd_dd_adhd",
    label: "ADHD-related impulsivity/inattention (lifelong neurodevelopmental pattern)",
    why: "Lifelong impulsivity may be neurodevelopmental rather than stress-reactive.",
  },
  {
    id: "bpd_dd_substance",
    label: "Substance-related drivers of affect or impulsivity",
    why: "Substance effects can mimic dysregulation and risk behavior patterns.",
  },
  {
    id: "bpd_dd_psychosis",
    label: "Psychotic-spectrum features (persistent symptoms outside stress-linked transience)",
    why: "Persistent psychotic symptoms require primary psychotic differential consideration.",
  },
  {
    id: "bpd_dd_eating",
    label: "Eating disorder patterns",
    why: "Restrictive or bingeing patterns may represent distinct psychopathology.",
  },
  {
    id: "bpd_dd_autism",
    label: "Autism-spectrum / social communication considerations",
    why: "Social communication differences can resemble interpersonal instability.",
  },
];

const bpdFunctionItems = [
  { id: "bpd_function_work", label: "Work/education functioning" },
  { id: "bpd_function_social", label: "Social/relationship functioning" },
  { id: "bpd_function_daily", label: "Daily living/self-care" },
  { id: "bpd_function_legal", label: "Legal/financial consequences" },
  { id: "bpd_function_qol", label: "Quality of life" },
];

const depressionItems = [...depressionCoreItems, ...depressionAdditionalItems];
const generalItems = symptomDomains.flatMap((domain) => domain.items);
const depressionCoreIds = new Set(depressionCoreItems.map((item) => item.id));
const psychosisItems = psychosisGroups.flatMap((group) => group.items);
const bipolarItems = bipolarGroups.flatMap((group) => group.items);
const ocdSymptomItems = ocdSymptomGroups.flatMap((group) => group.items);
const ptsdSymptomItems = ptsdSymptomGroups.flatMap((group) => group.items);
const ptsdChecklistItems = [...ptsdSymptomItems, ...ptsdComorbidityItems];
const bpdTraitItems = bpdTraitGroups.flatMap((group) => group.items);

const awarenessIds = new Set(
  symptomDomains.find((domain) => domain.id === "consciousness_awareness")?.items.map((item) => item.id) ?? []
);
const perceptualIds = new Set(
  symptomDomains.find((domain) => domain.id === "perceptual")?.items.map((item) => item.id) ?? []
);
const delusionIds = new Set(["fixed_false_beliefs", "ideas_of_reference", "persecutory_ideas", "grandiose_beliefs"]);
const maniaIds = new Set(["elevated_mood", "expansive_affect", "excessive_activity", "racing_thoughts"]);

function makeInitialState(items: SymptomItem[], defaultDuration: string) {
  const state: Record<string, SymptomState> = {};
  const contextDefaults = Object.fromEntries(contextTagOptions.map((tag) => [tag.id, false]));
  for (const item of items) {
    state[item.id] = {
      present: false,
      severity: "0",
      duration: defaultDuration,
      context: { ...contextDefaults },
    };
  }
  return state;
}

function makeInitialPsychosisState(items: SymptomItem[], defaultDuration: string) {
  const state: Record<string, PsychosisState> = {};
  const contextDefaults = Object.fromEntries(psychosisContextTags.map((tag) => [tag.id, false]));
  for (const item of items) {
    state[item.id] = {
      present: false,
      severity: "0",
      duration: defaultDuration,
      monthFlag: false,
      context: { ...contextDefaults },
    };
  }
  return state;
}

function makeInitialBipolarState(items: SymptomItem[], defaultDuration: string) {
  const state: Record<string, BipolarState> = {};
  const contextDefaults = Object.fromEntries(bipolarContextTags.map((tag) => [tag.id, false]));
  for (const item of items) {
    state[item.id] = {
      present: false,
      severity: "0",
      duration: defaultDuration,
      context: { ...contextDefaults },
    };
  }
  return state;
}

function makeInitialOcdState(items: SymptomItem[]) {
  const state: Record<string, OcdSymptomState> = {};
  const contextDefaults = Object.fromEntries(ocdContextTags.map((tag) => [tag.id, false]));
  for (const item of items) {
    state[item.id] = {
      present: false,
      severity: "0",
      timeBurden: ocdTimeBurdenOptions[0].value,
      impairment: ocdImpairmentOptions[0].value,
      insight: ocdInsightOptions[0].value,
      context: { ...contextDefaults },
    };
  }
  return state;
}

function makeInitialPtsdState(items: SymptomItem[]) {
  const state: Record<string, PtsdChecklistState> = {};
  const contextDefaults = Object.fromEntries(ptsdContextTags.map((tag) => [tag.id, false]));
  for (const item of items) {
    state[item.id] = {
      present: false,
      severity: "0",
      timeframe: ptsdTimeframeOptions[0].value,
      context: { ...contextDefaults },
      notes: "",
    };
  }
  return state;
}

function makeInitialBpdState(items: SymptomItem[]) {
  const state: Record<string, BpdChecklistState> = {};
  const contextDefaults = Object.fromEntries(bpdContextTags.map((tag) => [tag.id, false]));
  for (const item of items) {
    state[item.id] = {
      present: false,
      severity: "0",
      persistence: bpdPersistenceOptions[0].value,
      timeframe: bpdTimeframeOptions[0].value,
      context: { ...contextDefaults },
      notes: "",
    };
  }
  return state;
}

function extractContextFlags(state: Record<string, SymptomState>) {
  const flags = new Set<string>();
  for (const entry of Object.values(state)) {
    for (const [key, value] of Object.entries(entry.context)) {
      if (value) flags.add(key);
    }
  }
  return flags;
}

export default function DeterministicScaffoldChapter() {
  const [generalState, setGeneralState] = useState(() => makeInitialState(generalItems, generalDurationOptions[0].value));
  const [depressionState, setDepressionState] = useState(() =>
    makeInitialState(depressionItems, depressionDurationOptions[0].value)
  );
  const [psychosisState, setPsychosisState] = useState(() =>
    makeInitialPsychosisState(psychosisItems, generalDurationOptions[0].value)
  );
  const [bipolarState, setBipolarState] = useState(() =>
    makeInitialBipolarState(bipolarItems, bipolarDurationOptions[0].value)
  );
  const [ocdState, setOcdState] = useState(() => makeInitialOcdState(ocdSymptomItems));
  const [ocdScreening, setOcdScreening] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ocdScreeningQuestions.map((item) => [item.id, false]))
  );
  const [ocdDd, setOcdDd] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ocdDdItems.map((item) => [item.id, false]))
  );
  const [ocdSomatic, setOcdSomatic] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ocdSomaticItems.map((item) => [item.id, false]))
  );
  const [ocdImpact, setOcdImpact] = useState<Record<string, string>>(() =>
    Object.fromEntries(ocdImpactItems.map((item) => [item.id, ocdImpairmentOptions[0].value]))
  );
  const [ocdSeverityObs, setOcdSeverityObs] = useState<Record<string, string>>({
    time: "0",
    impairment: "0",
    distress: "0",
    resistance: "0",
    control: "0",
  });
  const [ocdSeverityComp, setOcdSeverityComp] = useState<Record<string, string>>({
    time: "0",
    impairment: "0",
    distress: "0",
    resistance: "0",
    control: "0",
  });
  const [ocdSeverityWindow, setOcdSeverityWindow] = useState("last_7_days");
  const [ptsdChecklist, setPtsdChecklist] = useState(() => makeInitialPtsdState(ptsdChecklistItems));
  const [ptsdEvent, setPtsdEvent] = useState({
    exposure: "unclear",
    eventType: "unspecified",
    eventTiming: "",
    timeframe: ptsdTimeframeOptions[0].value,
    ongoingThreat: false,
    highRisk: false,
  });
  const [ptsdScreening, setPtsdScreening] = useState({
    spontaneousReport: false,
    screeningCompleted: false,
    screeningScore: "",
  });
  const [ptsdSteps, setPtsdSteps] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(ptsdStepperSteps.map((step) => [step, false]))
  );
  const [ptsdFunction, setPtsdFunction] = useState<Record<string, string>>(() =>
    Object.fromEntries(ptsdFunctionItems.map((item) => [item.id, ocdImpairmentOptions[0].value]))
  );
  const [bpdChecklist, setBpdChecklist] = useState(() => makeInitialBpdState(bpdTraitItems));
  const [bpdDifferentials, setBpdDifferentials] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(bpdDifferentialItems.map((item) => [item.id, false]))
  );
  const [bpdFunction, setBpdFunction] = useState<Record<string, string>>(() =>
    Object.fromEntries(bpdFunctionItems.map((item) => [item.id, ocdImpairmentOptions[0].value]))
  );
  const [bpdPattern, setBpdPattern] = useState({
    onset: "unclear",
    pervasiveness: "unclear",
    stability: "unclear",
  });
  const [bpdSafety, setBpdSafety] = useState({
    ideation: "none",
    planIntent: "unclear",
    access: "unclear",
    recentSelfHarm: "no",
    protectiveFactors: "",
  });
  const [moduleDuration, setModuleDuration] = useState(depressionDurationOptions[0].value);
  const [summary, setSummary] = useState("");
  const [psychosisSummary, setPsychosisSummary] = useState("");
  const [bipolarSummary, setBipolarSummary] = useState("");
  const [ocdSummary, setOcdSummary] = useState("");
  const [ptsdSummary, setPtsdSummary] = useState("");
  const [bpdSummary, setBpdSummary] = useState("");

  const updateState = (
    setState: Dispatch<SetStateAction<Record<string, SymptomState>>>,
    id: string,
    patch: Partial<SymptomState>
  ) => {
    setState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  };

  const updateContext = (
    setState: Dispatch<SetStateAction<Record<string, SymptomState>>>,
    id: string,
    tagId: string,
    value: boolean
  ) => {
    setState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        context: {
          ...prev[id].context,
          [tagId]: value,
        },
      },
    }));
  };

  const updatePsychosisState = (
    id: string,
    patch: Partial<PsychosisState>
  ) => {
    setPsychosisState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  };

  const updatePsychosisContext = (id: string, tagId: string, value: boolean) => {
    setPsychosisState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        context: {
          ...prev[id].context,
          [tagId]: value,
        },
      },
    }));
  };

  const updateBipolarState = (id: string, patch: Partial<BipolarState>) => {
    setBipolarState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  };

  const updateBipolarContext = (id: string, tagId: string, value: boolean) => {
    setBipolarState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        context: {
          ...prev[id].context,
          [tagId]: value,
        },
      },
    }));
  };

  const updateOcdState = (id: string, patch: Partial<OcdSymptomState>) => {
    setOcdState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  };

  const updateOcdContext = (id: string, tagId: string, value: boolean) => {
    setOcdState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        context: {
          ...prev[id].context,
          [tagId]: value,
        },
      },
    }));
  };

  const updatePtsdChecklist = (id: string, patch: Partial<PtsdChecklistState>) => {
    setPtsdChecklist((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  };

  const updatePtsdContext = (id: string, tagId: string, value: boolean) => {
    setPtsdChecklist((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        context: {
          ...prev[id].context,
          [tagId]: value,
        },
      },
    }));
  };

  const updateBpdChecklist = (id: string, patch: Partial<BpdChecklistState>) => {
    setBpdChecklist((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...patch,
      },
    }));
  };

  const updateBpdContext = (id: string, tagId: string, value: boolean) => {
    setBpdChecklist((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        context: {
          ...prev[id].context,
          [tagId]: value,
        },
      },
    }));
  };

  const generateSummary = () => {
    const selected = depressionItems.filter((item) => depressionState[item.id]?.present);
    const coreSelected = selected.filter((item) => depressionCoreIds.has(item.id));
    const totalCount = selected.length;
    const coreCount = coreSelected.length;

    let severityLabel = "subthreshold";
    if (totalCount >= 8 && coreCount >= 2) severityLabel = "severe";
    else if (totalCount >= 6 && coreCount >= 2) severityLabel = "moderate";
    else if (totalCount >= 4 && coreCount >= 2) severityLabel = "mild";

    const durationLabel = depressionDurationOptions.find((option) => option.value === moduleDuration)?.label ?? "";

    const generalFlags = extractContextFlags(generalState);
    const depressionFlags = extractContextFlags(depressionState);
    const combinedFlags = new Set<string>([...generalFlags, ...depressionFlags]);

    const ddNotes: string[] = [];
    const awarenessPresent = generalItems.some(
      (item) => awarenessIds.has(item.id) && generalState[item.id]?.present
    );
    const perceptualPresent = generalItems.some(
      (item) => perceptualIds.has(item.id) && generalState[item.id]?.present
    );
    const delusionPresent = generalItems.some((item) => delusionIds.has(item.id) && generalState[item.id]?.present);
    const maniaPresent = generalItems.some((item) => maniaIds.has(item.id) && generalState[item.id]?.present);

    if (awarenessPresent) {
      ddNotes.push("Awareness impairment noted; consider delirium or substance/organic contributors.");
    }
    if (perceptualPresent || delusionPresent) {
      ddNotes.push(
        "Psychotic phenomena noted; consider primary psychotic spectrum vs affective with psychotic features depending on temporal pattern."
      );
    }
    if (maniaPresent) {
      ddNotes.push("Elevated or expansive mood/activity noted; consider bipolar spectrum or mixed features.");
    }
    if (combinedFlags.has("substance") || combinedFlags.has("organic")) {
      ddNotes.push("Context flags indicate possible substance or organic contributors.");
    }

    const ddLine =
      ddNotes.length > 0
        ? `Differentials to consider: ${ddNotes.join(" ")}`
        : "Differentials to consider: none triggered by current selections.";

    const summaryText =
      `Symptom constellation is compatible with: ${severityLabel} depressive symptom pattern ` +
      `(core ${coreCount}, total ${totalCount}, duration ${durationLabel}). ` +
      `${ddLine} ` +
      "This summary is a deterministic reasoning aid and requires professional verification.";

    setSummary(summaryText);
  };

  const generatePsychosisSummary = () => {
    const positiveIds = new Set(
      psychosisGroups.find((group) => group.id === "psychosis_positive")?.items.map((item) => item.id) ?? []
    );
    const negativeIds = new Set(
      psychosisGroups.find((group) => group.id === "psychosis_negative")?.items.map((item) => item.id) ?? []
    );

    const positiveCount = psychosisItems.filter(
      (item) => positiveIds.has(item.id) && psychosisState[item.id]?.present
    ).length;
    const negativeCount = psychosisItems.filter(
      (item) => negativeIds.has(item.id) && psychosisState[item.id]?.present
    ).length;

    const monthFlagSelected = psychosisItems.some((item) => psychosisState[item.id]?.monthFlag);
    const deliriumFlag = psychosisState.psy_delirium?.present || false;
    const substanceFlag = psychosisState.psy_substance?.present || false;
    const moodOnlyFlag = psychosisState.psy_mood_only?.present || false;
    const moodPresentFlag = psychosisState.psy_mood_present?.present || false;
    const psychosisIndependentFlag = psychosisState.psy_psychosis_independent?.present || false;
    const continuousFlag = psychosisState.psy_continuous?.present || false;
    const episodicFlag = psychosisState.psy_episodic?.present || false;

    const pathwayNotes: string[] = [];
    const ddNotes: string[] = [];

    if (positiveCount >= 1 && monthFlagSelected) {
      pathwayNotes.push(
        "Constellation is compatible with a psychotic-spectrum presentation (requires clinical confirmation)."
      );
    } else if (positiveCount >= 1) {
      pathwayNotes.push(
        "Psychotic symptoms are present; duration criteria should be clarified for psychotic-spectrum pathways."
      );
    } else {
      pathwayNotes.push("No clear positive psychotic symptoms selected; psychotic-spectrum pathway not supported.");
    }

    if (deliriumFlag) {
      ddNotes.push("Differential considerations include delirium or organic conditions.");
    }
    if (substanceFlag) {
      ddNotes.push("Differential considerations include substance-related states.");
    }
    if (moodOnlyFlag) {
      ddNotes.push("Differential considerations include affective disorder with psychotic features.");
    }
    if (moodPresentFlag && psychosisIndependentFlag) {
      ddNotes.push("Differential considerations include a schizoaffective pattern.");
    }
    if (negativeCount >= 2 && (continuousFlag || episodicFlag)) {
      ddNotes.push("Prominent negative symptoms with persistent pattern support schizophrenia-spectrum DD phrasing.");
    }

    const contextFlags = extractContextFlags(
      Object.fromEntries(
        Object.entries(psychosisState).map(([key, value]) => [
          key,
          { present: value.present, severity: value.severity, duration: value.duration, context: value.context },
        ])
      )
    );
    if (contextFlags.has("unclear_timing")) {
      ddNotes.push("Timing remains unclear; document temporal relationship in narrative notes.");
    }

    const summaryText = `${pathwayNotes.join(" ")} ${ddNotes.join(" ")}`.trim();
    setPsychosisSummary(summaryText || "No structured data selected for a deterministic summary.");
  };

  const generateBipolarSummary = () => {
    const maniaIds = new Set(
      bipolarGroups.find((group) => group.id === "bipolar_mania_core")?.items.map((item) => item.id) ?? []
    );
    const depressionIds = new Set(
      bipolarGroups.find((group) => group.id === "bipolar_depression")?.items.map((item) => item.id) ?? []
    );
    const mixedIds = new Set(
      bipolarGroups.find((group) => group.id === "bipolar_mixed_features")?.items.map((item) => item.id) ?? []
    );
    const psychosisIds = new Set(
      bipolarGroups.find((group) => group.id === "bipolar_psychotic_features")?.items.map((item) => item.id) ?? []
    );

    const maniaSelected = bipolarItems.filter((item) => maniaIds.has(item.id) && bipolarState[item.id]?.present);
    const depressionSelected = bipolarItems.filter(
      (item) => depressionIds.has(item.id) && bipolarState[item.id]?.present
    );
    const mixedSelected = bipolarItems.filter((item) => mixedIds.has(item.id) && bipolarState[item.id]?.present);
    const psychosisSelected = bipolarItems.filter(
      (item) => psychosisIds.has(item.id) && bipolarState[item.id]?.present
    );

    const coreMoodSelected = maniaSelected.filter(
      (item) => item.id === "bipolar_mood_elevated" || item.id === "bipolar_mood_irritable"
    );
    const maniaAdditionalCount = Math.max(maniaSelected.length - coreMoodSelected.length, 0);
    const maniaDurationWeek = maniaSelected.some((item) => {
      const duration = bipolarState[item.id]?.duration;
      return duration === "ge_1w" || duration === "ge_2w";
    });
    const hypomaniaDuration = maniaSelected.some((item) => {
      const duration = bipolarState[item.id]?.duration;
      return duration === "ge_4d" || duration === "ge_1w" || duration === "ge_2w";
    });

    const hypomaniaQualifiers =
      bipolarState.bipolar_hypo_change?.present &&
      bipolarState.bipolar_hypo_no_impairment?.present &&
      bipolarState.bipolar_hypo_no_psychosis?.present &&
      bipolarState.bipolar_hypo_duration?.present;

    const mixedFlag = mixedSelected.length > 0 && maniaSelected.length > 0 && depressionSelected.length > 0;

    const ddNotes: string[] = [];
    const pathwayNotes: string[] = [];

    if (coreMoodSelected.length > 0 && maniaDurationWeek && maniaAdditionalCount >= 2) {
      pathwayNotes.push(
        "Current symptom constellation is compatible with a manic-spectrum episode (severity and duration criteria met)."
      );
    }

    if (coreMoodSelected.length > 0 && hypomaniaDuration && hypomaniaQualifiers && maniaAdditionalCount >= 2) {
      pathwayNotes.push(
        "Current symptom constellation is compatible with a hypomanic-spectrum episode (requires clinician confirmation)."
      );
    }

    if (depressionSelected.length >= 2 && depressionSelected.some((item) => bipolarState[item.id]?.duration === "ge_2w")) {
      pathwayNotes.push(
        "Depressive symptom pattern is present within a bipolar context; consider episode framing and longitudinal pattern."
      );
    }

    if (mixedFlag) {
      pathwayNotes.push("Mixed features are selected, indicating concurrent manic and depressive symptom patterns.");
    }

    if (psychosisSelected.length > 0) {
      ddNotes.push(
        "Presence of psychotic features suggests a mood episode with psychotic characteristics; confirm temporal linkage."
      );
    }

    if (bipolarState.bipolar_dd_psychosis_only_mood?.present) {
      ddNotes.push("Psychotic features limited to mood episodes raise affective psychosis consideration.");
    }
    if (bipolarState.bipolar_dd_psychosis_outside?.present) {
      ddNotes.push("Psychotic symptoms outside mood episodes raise primary psychotic differential considerations.");
    }
    if (bipolarState.bipolar_dd_substance?.present) {
      ddNotes.push("Differential considerations include substance-induced mood symptoms.");
    }
    if (bipolarState.bipolar_dd_antidepressant?.present) {
      ddNotes.push("Differential considerations include antidepressant-associated activation.");
    }
    if (bipolarState.bipolar_dd_organic?.present) {
      ddNotes.push("Differential considerations include organic or medical contributors.");
    }
    if (bipolarState.bipolar_dd_sleep_deprivation?.present) {
      ddNotes.push("Sleep deprivation as a primary driver should be clarified before attribution.");
    }

    const summaryText = `${pathwayNotes.join(" ")} ${ddNotes.join(" ")}`.trim();
    setBipolarSummary(summaryText || "No structured data selected for a deterministic summary.");
  };

  const generateOcdSummary = () => {
    const obsessionIds = new Set(
      ocdSymptomGroups.find((group) => group.id === "ocd_obsessions")?.items.map((item) => item.id) ?? []
    );
    const compulsionIds = new Set(
      ocdSymptomGroups.find((group) => group.id === "ocd_compulsions")?.items.map((item) => item.id) ?? []
    );
    const thresholdIds = new Set(
      ocdSymptomGroups.find((group) => group.id === "ocd_thresholds")?.items.map((item) => item.id) ?? []
    );

    const obsessionsPresent = ocdSymptomItems.some(
      (item) => obsessionIds.has(item.id) && ocdState[item.id]?.present
    );
    const compulsionsPresent = ocdSymptomItems.some(
      (item) => compulsionIds.has(item.id) && ocdState[item.id]?.present
    );
    const thresholdSelected = ocdSymptomItems.some(
      (item) => thresholdIds.has(item.id) && ocdState[item.id]?.present
    );

    const timeBurdenFlag = ocdSymptomItems.some((item) => {
      const entry = ocdState[item.id];
      return entry.present && entry.timeBurden !== "lt_1h";
    });
    const impairmentFlag = ocdSymptomItems.some((item) => {
      const entry = ocdState[item.id];
      return entry.present && (entry.impairment === "moderate" || entry.impairment === "severe");
    });

    const impactFlag = Object.values(ocdImpact).some((value) => value === "moderate" || value === "severe");

    const pathwayNotes: string[] = [];
    const keyFeatures: string[] = [];
    const ddNotes: string[] = [];

    if (obsessionsPresent && compulsionsPresent && (timeBurdenFlag || impairmentFlag || thresholdSelected || impactFlag)) {
      pathwayNotes.push(
        "Current symptom constellation is compatible with an obsessive-compulsive presentation requiring clinical confirmation."
      );
    } else if (obsessionsPresent || compulsionsPresent) {
      pathwayNotes.push(
        "Obsessive-compulsive features are present; threshold flags (time burden or impairment) require clarification."
      );
    } else {
      pathwayNotes.push("Structured OCD features are not yet established by the selected checklist items.");
    }

    if (obsessionsPresent) keyFeatures.push("intrusive ego-dystonic thoughts");
    if (compulsionsPresent) keyFeatures.push("neutralization or ritual behaviors");
    if (timeBurdenFlag) keyFeatures.push("meaningful time burden");
    if (impairmentFlag || impactFlag) keyFeatures.push("functional impairment or distress");

    if (ocdDd.ocd_dd_gad) ddNotes.push("GAD-like worry pattern");
    if (ocdDd.ocd_dd_phobia) ddNotes.push("phobia-like avoidance pattern");
    if (ocdDd.ocd_dd_psychosis) ddNotes.push("psychotic-spectrum concern");
    if (ocdDd.ocd_dd_eating) ddNotes.push("eating-disorder-related rigidity");
    if (ocdDd.ocd_dd_asd) ddNotes.push("autism-related stereotypies");

    if (ocdSomatic.ocd_somatic_late_onset) {
      ddNotes.push("late-onset flag; consider organic contributors");
    }

    const summaryParts = [
      pathwayNotes.join(" "),
      keyFeatures.length ? `Key features present: ${keyFeatures.join("; ")}.` : "",
      ddNotes.length ? `Differential considerations flagged: ${ddNotes.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    setOcdSummary(summaryParts || "No structured data selected for a deterministic summary.");
  };

  const generatePtsdSummary = () => {
    const symptomDomains = ptsdSymptomGroups[0].items.filter((item) => ptsdChecklist[item.id]?.present);
    const comorbidityDomains = ptsdComorbidityItems.filter((item) => ptsdChecklist[item.id]?.present);

    const contextFlags = ptsdContextTags
      .filter((tag) => ptsdChecklistItems.some((item) => ptsdChecklist[item.id]?.context[tag.id]))
      .map((tag) => tag.label);

    const functionFlags = ptsdFunctionItems
      .filter((item) => ptsdFunction[item.id] !== "none")
      .map((item) => `${item.label}: ${ptsdFunction[item.id]}`);

    const exposureLabel = ptsdEvent.exposure === "yes" ? "yes" : ptsdEvent.exposure === "no" ? "no" : "unclear";
    const timeframeLabel =
      ptsdTimeframeOptions.find((option) => option.value === ptsdEvent.timeframe)?.label ?? "unspecified";

    const nextSteps: string[] = [];
    if (ptsdScreening.screeningCompleted) {
      nextSteps.push("Structured clinical interview is indicated if screening results are clinically meaningful.");
    } else if (ptsdEvent.timeframe === "lt_4w" && ptsdEvent.highRisk) {
      nextSteps.push("Screening may be premature; consider scheduling follow-up screening after 4 weeks if appropriate.");
    } else if (ptsdEvent.exposure === "yes" && symptomDomains.length > 0) {
      nextSteps.push("Proceed with symptom intensity screening questionnaire as part of the workflow.");
    } else {
      nextSteps.push("Continue with structured trauma exposure and symptom documentation before screening.");
    }

    const summaryParts = [
      `Documented trauma exposure: ${exposureLabel}, timing: ${ptsdEvent.eventTiming || timeframeLabel}.`,
      symptomDomains.length
        ? `PTSD-relevant symptom patterns documented: ${symptomDomains.map((item) => item.label).join("; ")}.`
        : "PTSD-relevant symptom patterns documented: none selected.",
      functionFlags.length
        ? `Functional impact/context factors: ${functionFlags.join("; ")}.`
        : "Functional impact/context factors: none selected.",
      nextSteps.length ? `Next diagnostic steps suggested by workflow: ${nextSteps.join(" ")}` : "",
      comorbidityDomains.length
        ? `Differential considerations flagged: ${comorbidityDomains.map((item) => item.label).join("; ")}.`
        : "",
      contextFlags.length ? `Context flags: ${contextFlags.join(", ")}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    setPtsdSummary(summaryParts || "No structured data selected for a deterministic summary.");
  };

  const generateBpdSummary = () => {
    const selectedDomains = bpdTraitGroups.filter((group) =>
      group.items.some((item) => bpdChecklist[item.id]?.present)
    );
    const selectedDomainLabels = selectedDomains.map((group) => group.label);

    const impairmentFlag = Object.values(bpdFunction).some((value) => value === "moderate" || value === "severe");
    const persistenceFlag = bpdPattern.stability === "persistent" || bpdPattern.stability === "recurrent";
    const onsetFlag = bpdPattern.onset === "yes";
    const pervasivenessFlag = bpdPattern.pervasiveness === "yes";

    const bipolarFlag = bpdDifferentials.bpd_dd_bipolar;
    const psychosisFlag = bpdDifferentials.bpd_dd_psychosis;
    const substanceFlag = bpdDifferentials.bpd_dd_substance;

    const keyNotes: string[] = [];
    const ddNotes: string[] = [];

    if (selectedDomains.length >= 3 && impairmentFlag && persistenceFlag && (onsetFlag || pervasivenessFlag)) {
      keyNotes.push(
        "Documented trait pattern is compatible with a borderline-pattern presentation requiring clinical confirmation."
      );
    } else if (selectedDomains.length > 0) {
      keyNotes.push(
        "Trait patterns are documented, but longitudinal persistence or impairment flags should be clarified."
      );
    } else {
      keyNotes.push("No trait pattern domains selected for a borderline-pattern summary.");
    }

    if (bipolarFlag) {
      keyNotes.push(
        "Bipolar-spectrum indicators are present, so borderline-pattern phrasing should be interpreted cautiously."
      );
    }

    if (selectedDomainLabels.length) {
      keyNotes.push(`Prominent domains: ${selectedDomainLabels.join("; ")}.`);
    }
    if (impairmentFlag) {
      keyNotes.push("Impairment is documented across functioning domains.");
    }

    if (bipolarFlag) ddNotes.push("Bipolar-spectrum differential considerations elevated.");
    if (psychosisFlag) ddNotes.push("Primary psychotic differential considerations elevated.");
    if (substanceFlag) ddNotes.push("Substance-related differential considerations elevated.");
    if (bpdDifferentials.bpd_dd_adhd) ddNotes.push("ADHD-related differential considerations flagged.");
    if (bpdDifferentials.bpd_dd_complex_ptsd) ddNotes.push("Complex PTSD differential considerations flagged.");
    if (bpdDifferentials.bpd_dd_eating) ddNotes.push("Eating disorder differential considerations flagged.");
    if (bpdDifferentials.bpd_dd_autism) ddNotes.push("Autism-spectrum differential considerations flagged.");

    const summaryParts = [
      keyNotes.join(" "),
      ddNotes.length ? `Differential considerations flagged: ${ddNotes.join(" ")}` : "",
      bpdSafety.ideation !== "none" ? `Safety notes: suicidal ideation documented (${bpdSafety.ideation}).` : "",
    ]
      .filter(Boolean)
      .join(" ");

    setBpdSummary(summaryParts || "No structured data selected for a deterministic summary.");
  };

  return (
    <section className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm" id="clinical-reasoning-scaffold">
      <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
        <p className="font-semibold">
          This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with the
          licensed professional.
        </p>
        <p>Outputs are reasoning aids and must be verified in context.</p>
      </div>

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-600">DailyCheck</p>
        <h2 className="text-2xl font-semibold">Clinical Reasoning Scaffold (Deterministic)</h2>
        <p className="text-sm text-gray-700">
          Structured symptom entry - transparent rule logic - hypothesis + differentials (no diagnosis)
        </p>
        <ul className="grid gap-1 text-sm text-gray-700 md:grid-cols-2">
          <li>No AI required for core logic</li>
          <li>No AMDP copyright infringement</li>
          <li>Clinically realistic</li>
          <li>Legally defensible</li>
          <li>Expandable later (AI only as optional text-to-structure helper)</li>
        </ul>
        <p className="text-sm text-gray-700">
          I will proceed in five layers, from conceptual architecture - symptom model - diagnostic logic - DD handling -
          medication/leitlinie logic, and conclude with exact disclaimer placement.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">Core Design Principle: Algorithm of Thought, not Diagnosis</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold">What it does</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Translates documented symptom constellations into guideline-consistent diagnostic hypotheses.</li>
              <li>Surfaces explicit uncertainty and differential diagnoses.</li>
              <li>Keeps logic deterministic and transparent to the clinician.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">What it never does</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Declare a diagnosis.</li>
              <li>Decide treatment.</li>
              <li>Replace clinician judgment.</li>
            </ul>
          </div>
        </div>
        <p className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
          This distinction must be visible in UI wording, output labels, technical documentation, and marketing language.
        </p>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">Symptom System: AMDP-inspired structure, legally independent wording</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold">Structural compatibility (allowed)</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>The division of psychopathological domains.</li>
              <li>The clinical concepts.</li>
              <li>The hierarchical grouping.</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">What to avoid</h4>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
              <li>Exact AMDP phrasing.</li>
              <li>Official AMDP numbering.</li>
              <li>Any claim of AMDP compliance.</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="border-b p-2">Domain</th>
                <th className="border-b p-2">Purpose summary</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="border-b p-2">Affect Regulation</td>
                <td className="border-b p-2">Emotional tone, reactivity, and stability.</td>
              </tr>
              <tr>
                <td className="border-b p-2">Drive & Psychomotor Activity</td>
                <td className="border-b p-2">Energy, initiation, and psychomotor pace.</td>
              </tr>
              <tr>
                <td className="border-b p-2">Cognitive Flow</td>
                <td className="border-b p-2">Form, coherence, and pacing of thought.</td>
              </tr>
              <tr>
                <td className="border-b p-2">Perceptual Experience</td>
                <td className="border-b p-2">Altered perception and perceptual anomalies.</td>
              </tr>
              <tr>
                <td className="border-b p-2">Self-Experience</td>
                <td className="border-b p-2">Sense of self and self-boundary integrity.</td>
              </tr>
              <tr>
                <td className="border-b p-2">Awareness & Orientation</td>
                <td className="border-b p-2">Alertness, clarity of awareness, and orientation.</td>
              </tr>
              <tr>
                <td className="border-b p-2">Circadian & Somatic Rhythm</td>
                <td className="border-b p-2">Sleep, appetite, and vegetative patterns.</td>
              </tr>
              <tr>
                <td className="p-2">Behavioral Regulation</td>
                <td className="p-2">Impulse control, risk, and social function.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="border-b p-2">Clinical concept</th>
                <th className="border-b p-2">Reworded label used in UI</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="border-b p-2">Persistently lowered mood</td>
                <td className="border-b p-2">Consistently low mood</td>
              </tr>
              <tr>
                <td className="border-b p-2">Marked loss of pleasure</td>
                <td className="border-b p-2">Marked loss of interest or pleasure</td>
              </tr>
              <tr>
                <td className="border-b p-2">Reduced psychomotor activity</td>
                <td className="border-b p-2">Slowed or reduced activity</td>
              </tr>
              <tr>
                <td className="p-2">Reduced clarity of awareness</td>
                <td className="p-2">Clouded awareness</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">Deterministic Diagnostic Logic Engine (Click-Based)</h3>
        <p className="mt-2 text-sm text-gray-700">Data model (pseudo-JSON):</p>
        <pre className="mt-2 rounded-xl border bg-gray-50 p-3 text-xs text-gray-700">
          <code>{`Symptom {\n  id,\n  domain,\n  severity: 0-3,\n  duration,\n  context_flags[]\n}`}</code>
        </pre>

        <h4 className="mt-4 text-sm font-semibold">Rule-template example: Depressive episode (ICD-like label F32.x)</h4>
        <pre className="mt-2 rounded-xl border bg-gray-50 p-3 text-xs text-gray-700">
          <code>{`Core symptom groups\n- Core A (mood): >=1\n- Core B (drive/pleasure): >=1\n\nSeverity thresholds\n- Mild: >=4 total symptoms (>=2 core)\n- Moderate: >=5 total symptoms (>=2 core)\n- Severe: >=6 total symptoms (>=2-3 core)\n\nPsychotic modifier\n- If hallucination/delusion present AND affective symptoms precede psychosis -> "with psychotic features"\n\nOutput format\n- "Symptom constellation is compatible with ..."`}</code>
        </pre>
        <p className="mt-2 text-sm text-gray-700">
          This is a deterministic template. The module below publishes its own explicit thresholds.
        </p>

        <h4 className="mt-4 text-sm font-semibold">Psychosis vs affective vs delirium branching (summary)</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Consciousness check is a critical gate: reduced awareness elevates delirium/substance DD.</li>
          <li>Temporal logic: affective symptoms precede psychosis &rarr; affective with psychotic features.</li>
          <li>Psychosis first &rarr; primary psychotic spectrum DD.</li>
          <li>Fluctuating course plus awareness impairment &rarr; delirium or intoxication DD.</li>
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">Differential Diagnosis Handling</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Use inclusion criteria, exclusion flags, and DD triggers from the checklist.</li>
          <li>Surface alternative explanations without assigning a diagnosis.</li>
          <li>Keep wording conservative and traceable to selected symptoms.</li>
        </ul>
        <p className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
          Example output wording: "Relevant differential diagnostic considerations include ..."
        </p>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">AI-Free but Future-Proof Architecture</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Phase 1: click-based entry, deterministic rules, transparent outputs.</li>
          <li>
            Phase 2 (optional): AI only for dictation to symptom draft, free text to structured suggestions, mandatory
            confirmation. AI never touches diagnostic logic.
          </li>
        </ul>
        <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">AI disclaimer</div>
          <p className="mt-2">
            AI-assisted features are used exclusively to structure and summarize clinician-provided information in the
            field of dictation. Outputs require professional verification.
          </p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">Medication & Guideline Consistency Check (Deterministic)</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Compare entered medication, dose, duration, and adherence to stored parameters.</li>
          <li>Flag subtherapeutic dose, insufficient duration, or adherence issues.</li>
          <li>
            Output wording: consistent / partially consistent / not consistent with guideline-based interventions for
            the documented condition.
          </li>
          <li>Explicitly avoids recommendations or treatment decisions.</li>
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">Legal and Professional Robustness</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
          <li>Explainable, deterministic logic with transparent rule display.</li>
          <li>Clinician agency preserved; outputs are advisory only.</li>
          <li>Uses "compatible with" language instead of diagnostic labels.</li>
          <li>Guideline comparison is descriptive, not a recommendation.</li>
          <li>AMDP-inspired structure without derivative text or numbering.</li>
        </ul>
      </section>

      <details className="rounded-xl border bg-white shadow-sm" id="amdp-symptom-checklist">
        <summary className="cursor-pointer px-4 py-3 text-lg font-semibold text-gray-900">
          Clickable Symptom Checklist (AMDP-inspired, reworded)
        </summary>
        <div className="px-4 pb-4">
          <p className="mt-2 text-sm text-gray-700">
            Select symptoms, severity, duration, and context flags. All logic is deterministic.
          </p>
          <div className="mt-4 space-y-3">
            {symptomDomains.map((domain, index) => (
              <details key={domain.id} open={index < 2} className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">{domain.label}</summary>
                <div className="mt-3 space-y-3">
                  {domain.items.map((item) => {
                    const state = generalState[item.id];
                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(200px,2fr)_repeat(3,minmax(140px,1fr))]"
                      >
                        <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={state.present}
                            onChange={(event) => updateState(setGeneralState, item.id, { present: event.target.checked })}
                          />
                          <span>{item.label}</span>
                        </label>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-severity`} className="font-semibold">
                            Severity
                          </label>
                          <select
                            id={`${item.id}-severity`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.severity}
                            onChange={(event) => updateState(setGeneralState, item.id, { severity: event.target.value })}
                          >
                            {severityOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-duration`} className="font-semibold">
                            Duration
                          </label>
                          <select
                            id={`${item.id}-duration`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.duration}
                            onChange={(event) => updateState(setGeneralState, item.id, { duration: event.target.value })}
                          >
                            {generalDurationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <div className="font-semibold">Context tags</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {contextTagOptions.map((tag) => (
                              <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={state.context[tag.id]}
                                  onChange={(event) => updateContext(setGeneralState, item.id, tag.id, event.target.checked)}
                                />
                                <span>{tag.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>
      </details>

      <section className="rounded-xl border bg-white p-4">
        <h3 className="text-lg font-semibold">Depressive Symptom Module (NVL-inspired, reworded)</h3>
        <p className="mt-2 text-sm text-gray-700">
          Duration qualifier (&gt;=2 weeks, most days). Select the closest duration band below and document exceptions
          in narrative notes.
        </p>
        <div className="mt-4 flex flex-col gap-2 text-xs text-gray-600 sm:flex-row sm:items-center">
          <label htmlFor="module-duration" className="font-semibold">
            Episode duration
          </label>
          <select
            id="module-duration"
            className="rounded-xl border bg-white px-2 py-1"
            value={moduleDuration}
            onChange={(event) => setModuleDuration(event.target.value)}
          >
            {depressionDurationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Core symptoms</h4>
            {depressionCoreItems.map((item) => {
              const state = depressionState[item.id];
              return (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(200px,2fr)_repeat(3,minmax(140px,1fr))]"
                >
                  <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={state.present}
                      onChange={(event) => updateState(setDepressionState, item.id, { present: event.target.checked })}
                    />
                    <span>{item.label}</span>
                  </label>

                  <div className="text-xs text-gray-600">
                    <label htmlFor={`${item.id}-severity`} className="font-semibold">
                      Severity
                    </label>
                    <select
                      id={`${item.id}-severity`}
                      className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                      value={state.severity}
                      onChange={(event) => updateState(setDepressionState, item.id, { severity: event.target.value })}
                    >
                      {severityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-gray-600">
                    <label htmlFor={`${item.id}-duration`} className="font-semibold">
                      Duration
                    </label>
                    <select
                      id={`${item.id}-duration`}
                      className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                      value={state.duration}
                      onChange={(event) => updateState(setDepressionState, item.id, { duration: event.target.value })}
                    >
                      {depressionDurationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-gray-600">
                    <div className="font-semibold">Context tags</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {contextTagOptions.map((tag) => (
                        <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                          <input
                            type="checkbox"
                            checked={state.context[tag.id]}
                            onChange={(event) => updateContext(setDepressionState, item.id, tag.id, event.target.checked)}
                          />
                          <span>{tag.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Additional symptoms</h4>
            {depressionAdditionalItems.map((item) => {
              const state = depressionState[item.id];
              return (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(200px,2fr)_repeat(3,minmax(140px,1fr))]"
                >
                  <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={state.present}
                      onChange={(event) => updateState(setDepressionState, item.id, { present: event.target.checked })}
                    />
                    <span>{item.label}</span>
                  </label>

                  <div className="text-xs text-gray-600">
                    <label htmlFor={`${item.id}-severity`} className="font-semibold">
                      Severity
                    </label>
                    <select
                      id={`${item.id}-severity`}
                      className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                      value={state.severity}
                      onChange={(event) => updateState(setDepressionState, item.id, { severity: event.target.value })}
                    >
                      {severityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-gray-600">
                    <label htmlFor={`${item.id}-duration`} className="font-semibold">
                      Duration
                    </label>
                    <select
                      id={`${item.id}-duration`}
                      className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                      value={state.duration}
                      onChange={(event) => updateState(setDepressionState, item.id, { duration: event.target.value })}
                    >
                      {depressionDurationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-gray-600">
                    <div className="font-semibold">Context tags</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {contextTagOptions.map((tag) => (
                        <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                          <input
                            type="checkbox"
                            checked={state.context[tag.id]}
                            onChange={(event) => updateContext(setDepressionState, item.id, tag.id, event.target.checked)}
                          />
                          <span>{tag.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-xl border bg-gray-50 p-4">
          <h4 className="text-sm font-semibold">Rule thresholds used by this scaffold</h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="border-b p-2">Severity</th>
                  <th className="border-b p-2">Minimum total symptoms</th>
                  <th className="border-b p-2">Minimum core symptoms</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr>
                  <td className="border-b p-2">Mild</td>
                  <td className="border-b p-2">&gt;=4</td>
                  <td className="border-b p-2">&gt;=2</td>
                </tr>
                <tr>
                  <td className="border-b p-2">Moderate</td>
                  <td className="border-b p-2">&gt;=6</td>
                  <td className="border-b p-2">&gt;=2</td>
                </tr>
                <tr>
                  <td className="p-2">Severe</td>
                  <td className="p-2">&gt;=8</td>
                  <td className="p-2">&gt;=2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-blue-700"
            onClick={generateSummary}
          >
            Generate reasoning summary
          </button>
          <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700" aria-live="polite">
            {summary ? summary : "Summary preview will appear here after generation."}
          </div>
        </div>
      </section>

      <details className="rounded-2xl border bg-white shadow-sm" id="psychosis-schizophrenia-module">
        <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-gray-900">
          Psychosis / Schizophrenia Module (Deterministic)
        </summary>
        <div className="px-6 pb-6">
          <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold">
              This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
              the licensed professional.
            </p>
            <p>Outputs are reasoning aids that require contextual clinical verification.</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              Structured symptom entry - transparent rules - hypothesis phrasing + differentials (no diagnosis)
            </p>
          </div>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Checklist (Deterministic)</h3>
          <p className="mt-2 text-sm text-gray-700">
            Each item supports presence, severity, duration, a &quot;&gt;= 1 month&quot; flag, and context tags. All logic
            is deterministic and transparent.
          </p>

          <div className="mt-4 space-y-3">
            {psychosisGroups.map((group, index) => (
              <details key={group.id} open={index < 2} className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">{group.label}</summary>
                <div className="mt-3 space-y-3">
                  {group.items.map((item) => {
                    const state = psychosisState[item.id];
                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(220px,2fr)_repeat(4,minmax(140px,1fr))]"
                      >
                        <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={state.present}
                            onChange={(event) => updatePsychosisState(item.id, { present: event.target.checked })}
                          />
                          <span>{item.label}</span>
                        </label>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-severity`} className="font-semibold">
                            Severity
                          </label>
                          <select
                            id={`${item.id}-severity`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.severity}
                            onChange={(event) => updatePsychosisState(item.id, { severity: event.target.value })}
                          >
                            {severityOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-duration`} className="font-semibold">
                            Duration
                          </label>
                          <select
                            id={`${item.id}-duration`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.duration}
                            onChange={(event) => updatePsychosisState(item.id, { duration: event.target.value })}
                          >
                            {generalDurationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <div className="font-semibold">Duration flag</div>
                          <label className="mt-2 inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                            <input
                              type="checkbox"
                              checked={state.monthFlag}
                              onChange={(event) => updatePsychosisState(item.id, { monthFlag: event.target.checked })}
                            />
                            <span>&gt;= 1 month</span>
                          </label>
                        </div>

                        <div className="text-xs text-gray-600 md:col-span-4">
                          <div className="font-semibold">Context tags</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {psychosisContextTags.map((tag) => (
                              <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={state.context[tag.id]}
                                  onChange={(event) =>
                                    updatePsychosisContext(item.id, tag.id, event.target.checked)
                                  }
                                />
                                <span>{tag.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Deterministic Rule Preview</h3>
          <p className="mt-2 text-sm text-gray-700">
            Outputs use conservative language and are meant for clinician verification only.
          </p>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-blue-700"
              onClick={generatePsychosisSummary}
            >
              Generate reasoning summary
            </button>
            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700" aria-live="polite">
              {psychosisSummary ? psychosisSummary : "Summary preview will appear here after generation."}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Data Model Snippet</h3>
          <pre className="mt-2 rounded-xl border bg-gray-50 p-3 text-xs text-gray-700">
            <code>{`Symptom {\\n  id,\\n  group,\\n  label,\\n  present,\\n  severity,\\n  duration,\\n  context_flags[]\\n}`}</code>
          </pre>
        </section>

        <footer className="mt-4 border-t pt-4 text-sm text-gray-600">
          <p>
            This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
            the licensed professional.
          </p>
          <p>Outputs are reasoning aids that require contextual clinical verification.</p>
        </footer>
        </div>
      </details>

      <details className="rounded-2xl border bg-white shadow-sm" id="bipolar-spectrum-module">
        <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-gray-900">
          Bipolar Spectrum Module (Deterministic)
        </summary>
        <div className="px-6 pb-6">
          <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold">
              This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
              the licensed professional.
            </p>
            <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              Structured episode-based symptom entry - transparent rule logic - hypothesis phrasing + differentials (no
              diagnosis)
            </p>
          </div>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Episode-Based Logic (Conceptual Framing)</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Bipolar presentations are modeled as episode constellations over time, not as static labels.</li>
            <li>Separate manic, hypomanic, depressive, and mixed features for transparent rule paths.</li>
            <li>Longitudinal pattern recognition remains clinician-driven and requires contextual verification.</li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Checklist (Deterministic)</h3>
          <p className="mt-2 text-sm text-gray-700">
            Each item supports presence, severity, duration qualifiers, and context tags. All logic is deterministic and
            transparent.
          </p>

          <div className="mt-4 space-y-3">
            {bipolarGroups.map((group, index) => (
              <details key={group.id} open={index < 2} className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">{group.label}</summary>
                <div className="mt-3 space-y-3">
                  {group.items.map((item) => {
                    const state = bipolarState[item.id];
                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(220px,2fr)_repeat(3,minmax(140px,1fr))]"
                      >
                        <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={state.present}
                            onChange={(event) => updateBipolarState(item.id, { present: event.target.checked })}
                          />
                          <span>{item.label}</span>
                        </label>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-severity`} className="font-semibold">
                            Severity
                          </label>
                          <select
                            id={`${item.id}-severity`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.severity}
                            onChange={(event) => updateBipolarState(item.id, { severity: event.target.value })}
                          >
                            {severityOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-duration`} className="font-semibold">
                            Duration qualifier
                          </label>
                          <select
                            id={`${item.id}-duration`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.duration}
                            onChange={(event) => updateBipolarState(item.id, { duration: event.target.value })}
                          >
                            {bipolarDurationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600 md:col-span-3">
                          <div className="font-semibold">Context tags</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {bipolarContextTags.map((tag) => (
                              <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={state.context[tag.id]}
                                  onChange={(event) =>
                                    updateBipolarContext(item.id, tag.id, event.target.checked)
                                  }
                                />
                                <span>{tag.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Deterministic Rule Preview</h3>
          <p className="mt-2 text-sm text-gray-700">
            Outputs use conservative language and require clinician verification.
          </p>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-blue-700"
              onClick={generateBipolarSummary}
            >
              Generate reasoning summary
            </button>
            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700" aria-live="polite">
              {bipolarSummary ? bipolarSummary : "Summary preview will appear here after generation."}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Data Model Snippet</h3>
          <pre className="mt-2 rounded-xl border bg-gray-50 p-3 text-xs text-gray-700">
            <code>{`EpisodeSymptom {\\n  id,\\n  episode_type (manic | hypomanic | depressive | mixed),\\n  severity,\\n  duration,\\n  context_flags[]\\n}`}</code>
          </pre>
        </section>

        <footer className="mt-4 border-t pt-4 text-sm text-gray-600">
          <p>
            This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
            the licensed professional.
          </p>
          <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
        </footer>
        </div>
      </details>

      <details className="rounded-2xl border bg-white shadow-sm" id="ocd-zwangsstoerung-module">
        <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-gray-900">
          OCD / Zwangsst&#246;rung Module (Deterministic)
        </summary>
        <div className="px-6 pb-6">
          <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold">
              This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
              the licensed professional.
            </p>
            <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              Structured symptom entry - transparent rules - hypothesis phrasing + differentials (no diagnosis)
            </p>
          </div>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Episode Concept and Classification Mapping</h3>
          <p className="mt-2 text-sm text-gray-700">
            Classification systems differ in how they subdivide obsession versus compulsion presentations and time
            criteria. This scaffold stores symptom constellations and threshold flags rather than fixed labels, and
            leaves classification decisions to clinicians.
          </p>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Screening Questions (clinician-administered)</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {ocdScreeningQuestions.map((item) => (
              <label key={item.id} className="flex items-start gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={ocdScreening[item.id]}
                  onChange={(event) =>
                    setOcdScreening((prev) => ({ ...prev, [item.id]: event.target.checked }))
                  }
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-700">
            Positive screen - proceed to structured criteria check and comorbidity/differential assessment.
          </p>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Symptom Concept Checklist</h3>
          <p className="mt-2 text-sm text-gray-700">
            Each item supports presence, severity, time burden, distress or impairment, insight, and context tags.
          </p>

          <div className="mt-4 space-y-3">
            {ocdSymptomGroups.map((group, index) => (
              <details key={group.id} open={index < 2} className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">{group.label}</summary>
                <div className="mt-3 space-y-3">
                  {group.items.map((item) => {
                    const state = ocdState[item.id];
                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(220px,2fr)_repeat(5,minmax(140px,1fr))]"
                      >
                        <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={state.present}
                            onChange={(event) => updateOcdState(item.id, { present: event.target.checked })}
                          />
                          <span>{item.label}</span>
                        </label>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-severity`} className="font-semibold">
                            Severity
                          </label>
                          <select
                            id={`${item.id}-severity`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.severity}
                            onChange={(event) => updateOcdState(item.id, { severity: event.target.value })}
                          >
                            {severityOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-time`} className="font-semibold">
                            Time burden
                          </label>
                          <select
                            id={`${item.id}-time`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.timeBurden}
                            onChange={(event) => updateOcdState(item.id, { timeBurden: event.target.value })}
                          >
                            {ocdTimeBurdenOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-impairment`} className="font-semibold">
                            Distress/impairment
                          </label>
                          <select
                            id={`${item.id}-impairment`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.impairment}
                            onChange={(event) => updateOcdState(item.id, { impairment: event.target.value })}
                          >
                            {ocdImpairmentOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-insight`} className="font-semibold">
                            Insight
                          </label>
                          <select
                            id={`${item.id}-insight`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.insight}
                            onChange={(event) => updateOcdState(item.id, { insight: event.target.value })}
                          >
                            {ocdInsightOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600 md:col-span-5">
                          <div className="font-semibold">Context tags</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {ocdContextTags.map((tag) => (
                              <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={state.context[tag.id]}
                                  onChange={(event) => updateOcdContext(item.id, tag.id, event.target.checked)}
                                />
                                <span>{tag.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Severity & Monitoring (tracking scaffold)</h3>
          <p className="mt-2 text-sm text-gray-700">
            Structured severity tracking inspired by established dimensions (time/frequency, impairment, distress,
            resistance, perceived control). This is a tracking scaffold, not a licensed instrument.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-gray-50 p-3">
              <div className="text-sm font-semibold text-gray-700">Obsessions (last 7 days)</div>
              <div className="mt-2 grid gap-2 text-xs text-gray-600">
                {Object.entries(ocdSeverityObs).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between gap-2">
                    <span className="capitalize">{key.replace("_", " ")}</span>
                    <select
                      className="rounded-xl border bg-white px-2 py-1"
                      value={value}
                      onChange={(event) =>
                        setOcdSeverityObs((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                    >
                      {ocdSeverityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-gray-50 p-3">
              <div className="text-sm font-semibold text-gray-700">Compulsions (last 7 days)</div>
              <div className="mt-2 grid gap-2 text-xs text-gray-600">
                {Object.entries(ocdSeverityComp).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between gap-2">
                    <span className="capitalize">{key.replace("_", " ")}</span>
                    <select
                      className="rounded-xl border bg-white px-2 py-1"
                      value={value}
                      onChange={(event) =>
                        setOcdSeverityComp((prev) => ({ ...prev, [key]: event.target.value }))
                      }
                    >
                      {ocdSeverityOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span className="font-semibold">Evaluation window</span>
            <select
              className="rounded-xl border bg-white px-2 py-1"
              value={ocdSeverityWindow}
              onChange={(event) => setOcdSeverityWindow(event.target.value)}
            >
              <option value="last_7_days">last 7 days</option>
              <option value="last_30_days">last 30 days</option>
            </select>
            <span>
              Combined score (obsessions + compulsions): {Object.values(ocdSeverityObs).reduce((acc, val) => acc + Number(val), 0) +
                Object.values(ocdSeverityComp).reduce((acc, val) => acc + Number(val), 0)}
            </span>
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Impact on Functioning</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {ocdImpactItems.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
                <span>{item.label}</span>
                <select
                  className="rounded-xl border bg-white px-2 py-1 text-xs"
                  value={ocdImpact[item.id]}
                  onChange={(event) => setOcdImpact((prev) => ({ ...prev, [item.id]: event.target.value }))}
                >
                  {ocdImpairmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <label className="mt-3 flex items-center gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
            <input type="checkbox" />
            <span>Collateral information from relatives/partners recorded with consent.</span>
          </label>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Differential Diagnosis & Comorbidity Prompts</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {ocdDdItems.map((item) => (
              <label key={item.id} className="flex items-start gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={ocdDd[item.id]}
                  onChange={(event) => setOcdDd((prev) => ({ ...prev, [item.id]: event.target.checked }))}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Somatic / Neurologic Check</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {ocdSomaticItems.map((item) => (
              <label key={item.id} className="flex items-start gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
                <input
                  type="checkbox"
                  checked={ocdSomatic[item.id]}
                  onChange={(event) => setOcdSomatic((prev) => ({ ...prev, [item.id]: event.target.checked }))}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-700">
            Late onset or fluctuating cognition should prompt consideration of neuropsychological screening and
            structural imaging when clinically indicated.
          </p>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Staged Diagnostic Pathway (3.6)</h3>
          <ol className="mt-3 grid gap-2 text-sm text-gray-700">
            {ocdStepperSteps.map((step, index) => (
              <li key={step} className="rounded-xl border bg-gray-50 p-3">
                <span className="font-semibold">Step {index + 1}:</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Logic Transparency</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>If obsessions and compulsions are present plus time burden or impairment, then OCD pathway is supported.</li>
            <li>If worry-only without rituals, flag anxiety-related differentials.</li>
            <li>If thoughts are experienced as externally inserted, elevate psychotic-spectrum DD.</li>
            <li>If late onset or cognitive fluctuation, elevate organic DD considerations.</li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Deterministic Reasoning Summary</h3>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-blue-700"
              onClick={generateOcdSummary}
            >
              Generate reasoning summary
            </button>
            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700" aria-live="polite">
              {ocdSummary ? ocdSummary : "Summary preview will appear here after generation."}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Data Model Snippet</h3>
          <pre className="mt-2 rounded-xl border bg-gray-50 p-3 text-xs text-gray-700">
            <code>{`EpisodeSymptom {\\n  id,\\n  episode_type (obsessive | compulsive | mixed),\\n  severity,\\n  duration,\\n  context_flags[]\\n}`}</code>
          </pre>
        </section>

        <footer className="mt-4 border-t pt-4 text-sm text-gray-600">
          <p>
            This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
            the licensed professional.
          </p>
          <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
        </footer>
        </div>
      </details>

      <details className="rounded-2xl border bg-white shadow-sm" id="ptsd-module">
        <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-gray-900">
          PTSD Module (Deterministic)
        </summary>
        <div className="px-6 pb-6">
          <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold">
              This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
              the licensed professional.
            </p>
            <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              Trauma exposure + symptom/functional impact capture - structured screening - interview indication (no
              diagnosis)
            </p>
          </div>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Diagnostic Workflow</h3>
          <p className="mt-2 text-sm text-gray-700">
            Initial assessment should capture the event category and timing without insisting on detailed recounting in
            the first interaction phase.
          </p>
          <ol className="mt-3 grid gap-2 text-sm text-gray-700">
            {ptsdStepperSteps.map((step, index) => (
              <li key={step} className="flex items-center justify-between gap-3 rounded-xl border bg-gray-50 p-3">
                <span>
                  <span className="font-semibold">Step {index + 1}:</span> {step}
                </span>
                <label className="inline-flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={ptsdSteps[step]}
                    onChange={(event) =>
                      setPtsdSteps((prev) => ({ ...prev, [step]: event.target.checked }))
                    }
                  />
                  Done
                </label>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Trauma Exposure Capture</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Index event occurred
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={ptsdEvent.exposure}
                onChange={(event) => setPtsdEvent((prev) => ({ ...prev, exposure: event.target.value }))}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unclear">Unclear</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Event type category
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={ptsdEvent.eventType}
                onChange={(event) => setPtsdEvent((prev) => ({ ...prev, eventType: event.target.value }))}
              >
                <option value="unspecified">Clinician-defined</option>
                <option value="interpersonal">Interpersonal violence</option>
                <option value="accident">Accident or injury</option>
                <option value="disaster">Disaster or mass event</option>
                <option value="conflict">Conflict or displacement</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Time since event (date or range)
              <input
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={ptsdEvent.eventTiming}
                onChange={(event) => setPtsdEvent((prev) => ({ ...prev, eventTiming: event.target.value }))}
                placeholder="e.g., Mar 2024 or 6-8 weeks"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Timeframe category
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={ptsdEvent.timeframe}
                onChange={(event) => setPtsdEvent((prev) => ({ ...prev, timeframe: event.target.value }))}
              >
                {ptsdTimeframeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
            <input
              type="checkbox"
              checked={ptsdEvent.ongoingThreat}
              onChange={(event) => setPtsdEvent((prev) => ({ ...prev, ongoingThreat: event.target.checked }))}
            />
            <span>Ongoing threat or unsafe environment flagged</span>
          </label>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">PTSD Symptom & Comorbidity Checklist</h3>
          <p className="mt-2 text-sm text-gray-700">
            Use these neutral symptom domain labels to structure documentation without implying diagnostic thresholds.
          </p>

          <div className="mt-4 space-y-3">
            {[...ptsdSymptomGroups].map((group, index) => (
              <details key={group.id} open={index < 1} className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">{group.label}</summary>
                <div className="mt-3 space-y-3">
                  {group.items.map((item) => {
                    const state = ptsdChecklist[item.id];
                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(220px,2fr)_repeat(4,minmax(140px,1fr))]"
                      >
                        <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={state.present}
                            onChange={(event) => updatePtsdChecklist(item.id, { present: event.target.checked })}
                          />
                          <span>{item.label}</span>
                        </label>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-severity`} className="font-semibold">
                            Severity
                          </label>
                          <select
                            id={`${item.id}-severity`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.severity}
                            onChange={(event) => updatePtsdChecklist(item.id, { severity: event.target.value })}
                          >
                            {severityOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-timeframe`} className="font-semibold">
                            Timeframe
                          </label>
                          <select
                            id={`${item.id}-timeframe`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.timeframe}
                            onChange={(event) => updatePtsdChecklist(item.id, { timeframe: event.target.value })}
                          >
                            {ptsdTimeframeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-notes`} className="font-semibold">
                            Notes
                          </label>
                          <input
                            id={`${item.id}-notes`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.notes}
                            onChange={(event) => updatePtsdChecklist(item.id, { notes: event.target.value })}
                            placeholder="Optional clinical note"
                          />
                        </div>

                        <div className="text-xs text-gray-600 md:col-span-4">
                          <div className="font-semibold">Context tags</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {ptsdContextTags.map((tag) => (
                              <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={state.context[tag.id]}
                                  onChange={(event) => updatePtsdContext(item.id, tag.id, event.target.checked)}
                                />
                                <span>{tag.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-4 rounded-xl border bg-white p-4">
            <h4 className="text-sm font-semibold text-gray-700">Comorbidity prompts</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {ptsdComorbidityItems.map((item) => {
                const state = ptsdChecklist[item.id];
                return (
                  <label key={item.id} className="flex items-start gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
                    <input
                      type="checkbox"
                      checked={state.present}
                      onChange={(event) => updatePtsdChecklist(item.id, { present: event.target.checked })}
                    />
                    <span>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Function & Context (ICF-oriented)</h3>
          <p className="mt-2 text-sm text-gray-700">
            Functional impact and context factors can maintain symptoms and influence care planning.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {ptsdFunctionItems.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
                <span>{item.label}</span>
                <select
                  className="rounded-xl border bg-white px-2 py-1 text-xs"
                  value={ptsdFunction[item.id]}
                  onChange={(event) => setPtsdFunction((prev) => ({ ...prev, [item.id]: event.target.value }))}
                >
                  {ocdImpairmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Screening Timing Logic</h3>
          <label className="mt-2 flex items-center gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
            <input
              type="checkbox"
              checked={ptsdEvent.highRisk}
              onChange={(event) => setPtsdEvent((prev) => ({ ...prev, highRisk: event.target.checked }))}
            />
            <span>High-risk context</span>
          </label>
          {ptsdEvent.highRisk && ptsdEvent.timeframe === "lt_4w" ? (
            <p className="mt-3 text-sm text-gray-700">
              Screening may be premature; consider scheduling follow-up screening after 4 weeks if clinically
              appropriate.
            </p>
          ) : null}
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Structured Interview Rationale</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>Structured interviews yield higher interrater agreement and more reliable assessment.</li>
            <li>Use by clinicians familiar with trauma-related disorders; training and experience are required.</li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Screening Questionnaire Record</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
              <input
                type="checkbox"
                checked={ptsdScreening.spontaneousReport}
                onChange={(event) =>
                  setPtsdScreening((prev) => ({ ...prev, spontaneousReport: event.target.checked }))
                }
              />
              <span>Spontaneous symptom report captured</span>
            </label>
            <label className="flex items-center gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
              <input
                type="checkbox"
                checked={ptsdScreening.screeningCompleted}
                onChange={(event) =>
                  setPtsdScreening((prev) => ({ ...prev, screeningCompleted: event.target.checked }))
                }
              />
              <span>Quantitative screening completed</span>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Screening score (optional)
              <input
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={ptsdScreening.screeningScore}
                onChange={(event) =>
                  setPtsdScreening((prev) => ({ ...prev, screeningScore: event.target.value }))
                }
                placeholder="Optional value"
              />
            </label>
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Logic Transparency</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>If trauma exposure is documented and symptom domains are present, proceed to screening workflow.</li>
            <li>If screening is completed and symptoms persist, consider indication-based structured interview.</li>
            <li>If timeframe is under 4 weeks in high-risk contexts, schedule follow-up screening after 4 weeks.</li>
            <li>Comorbidity flags remain differential considerations, not diagnostic conclusions.</li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Deterministic Reasoning Summary</h3>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-blue-700"
              onClick={generatePtsdSummary}
            >
              Generate reasoning summary
            </button>
            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700" aria-live="polite">
              {ptsdSummary ? ptsdSummary : "Summary preview will appear here after generation."}
            </div>
          </div>
        </section>

        <footer className="mt-4 border-t pt-4 text-sm text-gray-600">
          <p>
            This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
            the licensed professional.
          </p>
          <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
        </footer>
        </div>
      </details>

      <details className="rounded-2xl border bg-white shadow-sm" id="bpd-module">
        <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-gray-900">
          Borderline Personality Disorder Module (Deterministic)
        </summary>
        <div className="px-6 pb-6">
          <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <p className="font-semibold">
              This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
              the licensed professional.
            </p>
            <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-700">
              Structured symptom/trait capture + impairment + differentials (no diagnosis)
            </p>
          </div>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Assessment framing</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>This module documents patterns of traits and behaviors over time, not single-visit states.</li>
            <li>It supports structured capture of clinically relevant patterns and impairment.</li>
            <li>Outputs are phrased as compatible with and never declare a diagnosis.</li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Trait and Symptom Checklist</h3>
          <p className="mt-2 text-sm text-gray-700">
            Capture trait domains with persistence and context tags. Use optional notes for clinical nuance.
          </p>
          <div className="mt-4 space-y-3">
            {bpdTraitGroups.map((group, index) => (
              <details key={group.id} open={index < 2} className="rounded-xl border bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700">{group.label}</summary>
                <div className="mt-3 space-y-3">
                  {group.items.map((item) => {
                    const state = bpdChecklist[item.id];
                    return (
                      <div
                        key={item.id}
                        className="grid gap-3 rounded-xl border bg-gray-50 p-3 md:grid-cols-[minmax(220px,2fr)_repeat(5,minmax(140px,1fr))]"
                      >
                        <label className="flex items-start gap-2 text-sm font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={state.present}
                            onChange={(event) => updateBpdChecklist(item.id, { present: event.target.checked })}
                          />
                          <span>{item.label}</span>
                        </label>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-severity`} className="font-semibold">
                            Severity/impact
                          </label>
                          <select
                            id={`${item.id}-severity`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.severity}
                            onChange={(event) => updateBpdChecklist(item.id, { severity: event.target.value })}
                          >
                            {severityOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-persistence`} className="font-semibold">
                            Persistence
                          </label>
                          <select
                            id={`${item.id}-persistence`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.persistence}
                            onChange={(event) => updateBpdChecklist(item.id, { persistence: event.target.value })}
                          >
                            {bpdPersistenceOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-timeframe`} className="font-semibold">
                            Timeframe
                          </label>
                          <select
                            id={`${item.id}-timeframe`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.timeframe}
                            onChange={(event) => updateBpdChecklist(item.id, { timeframe: event.target.value })}
                          >
                            {bpdTimeframeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-xs text-gray-600">
                          <label htmlFor={`${item.id}-notes`} className="font-semibold">
                            Notes
                          </label>
                          <input
                            id={`${item.id}-notes`}
                            className="mt-1 w-full rounded-xl border bg-white px-2 py-1"
                            value={state.notes}
                            onChange={(event) => updateBpdChecklist(item.id, { notes: event.target.value })}
                            placeholder="Optional clinical note"
                          />
                        </div>

                        <div className="text-xs text-gray-600 md:col-span-5">
                          <div className="font-semibold">Context tags</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {bpdContextTags.map((tag) => (
                              <label key={tag.id} className="inline-flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                                <input
                                  type="checkbox"
                                  checked={state.context[tag.id]}
                                  onChange={(event) => updateBpdContext(item.id, tag.id, event.target.checked)}
                                />
                                <span>{tag.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Function & Participation</h3>
          <p className="mt-2 text-sm text-gray-700">
            Trait patterns are clinically relevant when associated with sustained impairment and risk.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {bpdFunctionItems.map((item) => (
              <label key={item.id} className="flex items-center justify-between gap-2 rounded-xl border bg-gray-50 p-3 text-sm">
                <span>{item.label}</span>
                <select
                  className="rounded-xl border bg-white px-2 py-1 text-xs"
                  value={bpdFunction[item.id]}
                  onChange={(event) => setBpdFunction((prev) => ({ ...prev, [item.id]: event.target.value }))}
                >
                  {ocdImpairmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Differential Diagnosis & Comorbidity Prompts</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {bpdDifferentialItems.map((item) => (
              <label key={item.id} className="rounded-xl border bg-gray-50 p-3 text-sm">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={bpdDifferentials[item.id]}
                    onChange={(event) =>
                      setBpdDifferentials((prev) => ({ ...prev, [item.id]: event.target.checked }))
                    }
                  />
                  <span>{item.label}</span>
                </div>
                <p className="mt-2 text-xs text-gray-600">{item.why}</p>
              </label>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Longitudinal Pattern Summary</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Onset timing
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdPattern.onset}
                onChange={(event) => setBpdPattern((prev) => ({ ...prev, onset: event.target.value }))}
              >
                <option value="yes">Since adolescence/early adulthood</option>
                <option value="no">Later onset</option>
                <option value="unclear">Unclear</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Pervasiveness
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdPattern.pervasiveness}
                onChange={(event) => setBpdPattern((prev) => ({ ...prev, pervasiveness: event.target.value }))}
              >
                <option value="yes">Multiple life domains</option>
                <option value="no">Limited to single domain</option>
                <option value="unclear">Unclear</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Stability over time
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdPattern.stability}
                onChange={(event) => setBpdPattern((prev) => ({ ...prev, stability: event.target.value }))}
              >
                <option value="persistent">Persistent pattern</option>
                <option value="recurrent">Recurrent pattern</option>
                <option value="episodic">Episodic</option>
                <option value="unclear">Unclear</option>
              </select>
            </label>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-lg font-semibold">Safety & Risk Documentation</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Current suicidal ideation
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdSafety.ideation}
                onChange={(event) => setBpdSafety((prev) => ({ ...prev, ideation: event.target.value }))}
              >
                <option value="none">None</option>
                <option value="passive">Passive</option>
                <option value="active">Active</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Plan/intent
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdSafety.planIntent}
                onChange={(event) => setBpdSafety((prev) => ({ ...prev, planIntent: event.target.value }))}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="unclear">Unclear</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Access to means
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdSafety.access}
                onChange={(event) => setBpdSafety((prev) => ({ ...prev, access: event.target.value }))}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="unclear">Unclear</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-700">
              Recent self-harm
              <select
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdSafety.recentSelfHarm}
                onChange={(event) => setBpdSafety((prev) => ({ ...prev, recentSelfHarm: event.target.value }))}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </label>
            <label className="md:col-span-2 flex flex-col gap-1 text-sm text-gray-700">
              Protective factors (free text)
              <input
                className="rounded-xl border bg-white px-2 py-1 text-xs"
                value={bpdSafety.protectiveFactors}
                onChange={(event) => setBpdSafety((prev) => ({ ...prev, protectiveFactors: event.target.value }))}
                placeholder="Document protective factors if available"
              />
            </label>
          </div>
          <p className="mt-3 text-sm text-gray-700">
            If acute risk is suspected, follow your local clinical emergency procedures and document actions taken.
          </p>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Logic Transparency</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
            <li>If 3 or more domains are selected, longitudinal persistence is flagged, and impairment is present, then compatible-with wording is used.</li>
            <li>If strong bipolar indicators are selected, bipolar DD wording is elevated and borderline phrasing softened.</li>
            <li>If substance context is selected, substance-related DD is elevated.</li>
            <li>If persistent psychotic symptoms are selected, primary psychotic DD is elevated.</li>
          </ul>
        </section>

        <section className="mt-4 rounded-xl border bg-white p-4">
          <h3 className="text-lg font-semibold">Deterministic Reasoning Summary</h3>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-gray-900 hover:bg-blue-700"
              onClick={generateBpdSummary}
            >
              Generate reasoning summary
            </button>
            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700" aria-live="polite">
              {bpdSummary ? bpdSummary : "Summary preview will appear here after generation."}
            </div>
          </div>
        </section>

        <footer className="mt-4 border-t pt-4 text-sm text-gray-600">
          <p>
            This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with
            the licensed professional.
          </p>
          <p>Outputs are structured reasoning aids and require contextual clinical verification.</p>
        </footer>
        </div>
      </details>

      <aside className="rounded-xl border border-dashed bg-gray-50 p-4 text-sm text-gray-700">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-600">Only if patients have access</div>
        <p className="mt-2">
          This application does not replace medical consultation. No diagnostic or therapeutic conclusions are provided
          to patients.
        </p>
      </aside>

      <footer className="border-t pt-4 text-sm text-gray-600">
        <p>
          This software does not provide diagnoses or treatment decisions. All clinical responsibility remains with the
          licensed professional.
        </p>
        <p>Outputs are reasoning aids and must be verified in context.</p>
      </footer>
    </section>
  );
}
