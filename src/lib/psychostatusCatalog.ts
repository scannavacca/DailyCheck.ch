export type ChecklistItem = {
  id: string;
  label: string;
  kind: "normal" | "finding" | "unassessable";
};

export type ChecklistSection = {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
};

export const PSYCHOSTATUS_SECTIONS: ChecklistSection[] = [
  {
    id: "bewusstsein",
    title: "Bewusstsein",
    icon: "Brain",
    items: [
      { id: "bewusstsein_normal", label: "unauffaellig (wach, klar)", kind: "normal" },
      {
        id: "bewusstsein_nicht_beurteilbar_kooperation",
        label: "nicht beurteilbar (mangelnde Kooperation)",
        kind: "unassessable",
      },
      {
        id: "bewusstsein_nicht_beurteilbar_intox",
        label: "nicht beurteilbar (Intoxikation/Verdacht)",
        kind: "unassessable",
      },
      { id: "bewusstsein_somnolent", label: "somnolent", kind: "finding" },
      { id: "bewusstsein_sopor", label: "soporoes", kind: "finding" },
      {
        id: "bewusstsein_verwirrt",
        label: "verwirrt (qualitative Bewusstseinsstoerung)",
        kind: "finding",
      },
      { id: "bewusstsein_fluktuierend", label: "fluktuierend", kind: "finding" },
    ],
  },
  {
    id: "orientierung",
    title: "Orientierung",
    icon: "Compass",
    items: [
      {
        id: "orientierung_normal",
        label: "voll orientiert (Zeit/Ort/Person/Situation)",
        kind: "normal",
      },
      { id: "orientierung_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "orientierung_zeit", label: "zeitlich desorientiert", kind: "finding" },
      { id: "orientierung_ort", label: "oertlich desorientiert", kind: "finding" },
      { id: "orientierung_person", label: "zur Person desorientiert", kind: "finding" },
      { id: "orientierung_situation", label: "situativ desorientiert", kind: "finding" },
    ],
  },
  {
    id: "erscheinungsbild",
    title: "Erscheinungsbild",
    icon: "User",
    items: [
      { id: "erscheinungsbild_normal", label: "unauffaellig (gepflegt, adaequat)", kind: "normal" },
      {
        id: "erscheinungsbild_nicht_beurteilbar",
        label: "nicht beurteilbar",
        kind: "unassessable",
      },
      { id: "erscheinungsbild_ungepflegt", label: "ungepflegt/vernachlaessigt", kind: "finding" },
      {
        id: "erscheinungsbild_auffaellig_kleidung",
        label: "auffaellige Kleidung/Make-up",
        kind: "finding",
      },
      {
        id: "erscheinungsbild_ernahrung_reduziert",
        label: "reduzierter Ernaehrungszustand",
        kind: "finding",
      },
      {
        id: "erscheinungsbild_ernahrung_erhoeht",
        label: "erhoehter Ernaehrungszustand",
        kind: "finding",
      },
      { id: "erscheinungsbild_mimik_arm", label: "Mimik reduziert", kind: "finding" },
    ],
  },
  {
    id: "kommunikation",
    title: "Kommunikationsverhalten",
    icon: "MessageSquare",
    items: [
      { id: "kommunikation_normal", label: "unauffaellig (kontaktfaehig, kooperativ)", kind: "normal" },
      { id: "kommunikation_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "kommunikation_kontakt_erschwert", label: "Kontaktaufnahme erschwert", kind: "finding" },
      {
        id: "kommunikation_blickkontakt_reduziert",
        label: "Blickkontakt vermindert",
        kind: "finding",
      },
      { id: "kommunikation_sprache_verlangsamt", label: "Sprache verlangsamt", kind: "finding" },
      { id: "kommunikation_sprache_beschleunigt", label: "Sprache beschleunigt", kind: "finding" },
      {
        id: "kommunikation_ausweichend",
        label: "ausweichend/gering auskunftsfaehig",
        kind: "finding",
      },
    ],
  },
  {
    id: "kognition",
    title: "Konzentration & Gedaechtnis",
    icon: "Layers",
    items: [
      { id: "kognition_normal", label: "unauffaellig", kind: "normal" },
      { id: "kognition_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      {
        id: "kognition_konzentration_reduziert",
        label: "Konzentration/Aufmerksamkeit reduziert",
        kind: "finding",
      },
      { id: "kognition_kurzzeit_reduziert", label: "Kurzzeitgedaechtnis reduziert", kind: "finding" },
      { id: "kognition_merkfaehigkeit_reduziert", label: "Merkfaehigkeit reduziert", kind: "finding" },
      { id: "kognition_ermuedbarkeit", label: "gedankliche Ermuedbarkeit", kind: "finding" },
    ],
  },
  {
    id: "formales_denken",
    title: "Formales Denken",
    icon: "Workflow",
    items: [
      { id: "formales_denken_normal", label: "unauffaellig", kind: "normal" },
      { id: "formales_denken_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "formales_denken_verlangsamt", label: "Denkverlangsamung", kind: "finding" },
      { id: "formales_denken_ideenflucht", label: "Ideenflucht", kind: "finding" },
      { id: "formales_denken_umstaendlich", label: "Umstaendlichkeit/Weitschweifigkeit", kind: "finding" },
      { id: "formales_denken_zerfahren", label: "Zerfahrenheit/Inkohaerenz", kind: "finding" },
      {
        id: "formales_denken_gedankenabreissen",
        label: "Gedankenabreissen/Gedankenblockaden",
        kind: "finding",
      },
    ],
  },
  {
    id: "psychomotorik",
    title: "Psychomotorik",
    icon: "Activity",
    items: [
      { id: "psychomotorik_normal", label: "unauffaellig", kind: "normal" },
      { id: "psychomotorik_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "psychomotorik_unruhe", label: "psychomotorische Unruhe/agitiert", kind: "finding" },
      { id: "psychomotorik_gehemmt", label: "psychomotorisch gehemmt", kind: "finding" },
      { id: "psychomotorik_tics", label: "Tics/auffaellige Bewegungen", kind: "finding" },
      {
        id: "psychomotorik_katatone_zeichen",
        label: "katatone Zeichen (optional)",
        kind: "finding",
      },
    ],
  },
  {
    id: "wahrnehmung",
    title: "Wahrnehmung",
    icon: "Eye",
    items: [
      { id: "wahrnehmung_normal", label: "unauffaellig", kind: "normal" },
      { id: "wahrnehmung_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "wahrnehmung_illusionen", label: "Illusionen", kind: "finding" },
      { id: "wahrnehmung_hall_akust", label: "Halluzinationen (akustisch)", kind: "finding" },
      { id: "wahrnehmung_hall_vis", label: "Halluzinationen (visuell)", kind: "finding" },
      { id: "wahrnehmung_depersonalisation", label: "Depersonalisation", kind: "finding" },
      { id: "wahrnehmung_derealisation", label: "Derealisation", kind: "finding" },
    ],
  },
  {
    id: "inhalt_ich",
    title: "Inhaltliches Denken & Ich-Stoerungen",
    icon: "Lightbulb",
    items: [
      { id: "inhalt_ich_normal", label: "unauffaellig", kind: "normal" },
      { id: "inhalt_ich_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "inhalt_wahn_verfolgung", label: "Wahn: Verfolgungswahn", kind: "finding" },
      { id: "inhalt_wahn_groesse", label: "Wahn: Groessenwahn", kind: "finding" },
      { id: "inhalt_wahn_schuld", label: "Wahn: Schuld-/Verarmungswahn", kind: "finding" },
      { id: "inhalt_beziehungswahn", label: "Beziehungswahn/Beziehungsideen", kind: "finding" },
      {
        id: "ich_gedankenausbreitung",
        label: "Ich-Stoerung: Gedankenlautwerden/-ausbreitung",
        kind: "finding",
      },
      { id: "ich_gedankeneingebung", label: "Ich-Stoerung: Gedankeneingebung", kind: "finding" },
      { id: "ich_gedankenentzug", label: "Ich-Stoerung: Gedankenentzug", kind: "finding" },
      { id: "inhalt_zwangsgedanken", label: "Zwangsgedanken", kind: "finding" },
      { id: "inhalt_ueberwertige_ideen", label: "ueberwertige Ideen", kind: "finding" },
    ],
  },
  {
    id: "affekte",
    title: "Affekte",
    icon: "Smile",
    items: [
      { id: "affekte_normal", label: "unauffaellig", kind: "normal" },
      { id: "affekte_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "affekte_depressiv", label: "Stimmung gedrueckt", kind: "finding" },
      { id: "affekte_gehoben", label: "Stimmung gehoben", kind: "finding" },
      { id: "affekte_reizbar", label: "reizbar/dysphorisch", kind: "finding" },
      { id: "affekte_labil", label: "Affekt labil", kind: "finding" },
      { id: "affekte_verflacht", label: "Affekt verflacht", kind: "finding" },
      { id: "affekte_unangemessen", label: "Affekt unangemessen", kind: "finding" },
    ],
  },
  {
    id: "impulse",
    title: "Impulse",
    icon: "Zap",
    items: [
      { id: "impulse_normal", label: "unauffaellig", kind: "normal" },
      { id: "impulse_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "impulse_kontrolle_reduziert", label: "Impulskontrolle vermindert", kind: "finding" },
      { id: "impulse_aggressiv", label: "Aggressionsdurchbrueche", kind: "finding" },
      { id: "impulse_risiko", label: "Risikoverhalten/Enthemmung", kind: "finding" },
    ],
  },
  {
    id: "aengste_zwaenge",
    title: "Aengste & Zwaenge",
    icon: "AlertTriangle",
    items: [
      { id: "aengste_zwaenge_normal", label: "unauffaellig", kind: "normal" },
      { id: "aengste_zwaenge_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "angst_panik", label: "Panikattacken", kind: "finding" },
      { id: "angst_gad", label: "generalisierte Angst", kind: "finding" },
      { id: "angst_phobie", label: "phobische Angst", kind: "finding" },
      { id: "zwang_handlungen", label: "Zwangshandlungen", kind: "finding" },
      { id: "zwang_gedanken", label: "Zwangsgedanken (klinisch relevant)", kind: "finding" },
    ],
  },
  {
    id: "psychovegetativum",
    title: "Psychovegetativum",
    icon: "HeartPulse",
    items: [
      { id: "psychoveg_normal", label: "unauffaellig", kind: "normal" },
      { id: "psychoveg_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "psychoveg_schlaf_einschlaf", label: "Einschlafstoerung", kind: "finding" },
      { id: "psychoveg_schlaf_durchschlaf", label: "Durchschlafstoerung", kind: "finding" },
      { id: "psychoveg_appetit_reduziert", label: "Appetit reduziert", kind: "finding" },
      { id: "psychoveg_appetit_erhoeht", label: "Appetit erhoeht", kind: "finding" },
      {
        id: "psychoveg_somatisch_stress",
        label: "somatische Stresssymptome (z.B. Herzrasen, Schwitzen)",
        kind: "finding",
      },
    ],
  },
  {
    id: "abhaengigkeit",
    title: "Abhaengigkeitserzeugendes Verhalten",
    icon: "Link",
    items: [
      { id: "abhaengigkeit_normal", label: "kein aktueller Hinweis", kind: "normal" },
      { id: "abhaengigkeit_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "substanz_alkohol_riskant", label: "Alkohol: riskanter Konsum", kind: "finding" },
      { id: "substanz_alkohol_schaedlich", label: "Alkohol: schaedlicher Gebrauch", kind: "finding" },
      { id: "substanz_alkohol_abhaengig", label: "Alkohol: Abhaengigkeitssymptome", kind: "finding" },
      { id: "substanz_cannabis", label: "Cannabis: problematischer Konsum", kind: "finding" },
      { id: "substanz_stimulanzien", label: "Stimulanzien: problematischer Konsum", kind: "finding" },
      { id: "substanz_craving", label: "Craving / starker Suchtdruck", kind: "finding" },
      { id: "substanz_kontrollverlust", label: "Kontrollverlust", kind: "finding" },
      { id: "substanz_entzug", label: "Entzugssymptome", kind: "finding" },
    ],
  },
  {
    id: "selbstwert_einstellung",
    title: "Selbstwert & Krankheitseinstellung",
    icon: "Shield",
    items: [
      { id: "selbstwert_normal", label: "unauffaellig", kind: "normal" },
      { id: "selbstwert_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "selbstwert_reduziert", label: "Selbstwert vermindert", kind: "finding" },
      { id: "selbstwert_erhoeht", label: "Selbstwert erhoeht", kind: "finding" },
      { id: "einsicht_fehlend", label: "Krankheitseinsicht fehlend", kind: "finding" },
      { id: "einsicht_reduziert", label: "Krankheitseinsicht reduziert", kind: "finding" },
      { id: "motivation_gering", label: "Behandlungsmotivation gering", kind: "finding" },
    ],
  },
  {
    id: "gefaehrdung",
    title: "Eigen- und Fremdgefaehrdung",
    icon: "Siren",
    items: [
      {
        id: "gefaehrdung_normal",
        label: "kein Hinweis auf akute Eigen-/Fremdgefaehrdung",
        kind: "normal",
      },
      { id: "gefaehrdung_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "suizid_passiv", label: "Suizidgedanken (passiv)", kind: "finding" },
      { id: "suizid_aktiv", label: "Suizidgedanken (aktiv)", kind: "finding" },
      { id: "suizid_plan", label: "Suizidplan/Vorbereitung", kind: "finding" },
      { id: "fremd_impulse", label: "fremdaggressive Impulse", kind: "finding" },
      { id: "akut_gefaehrdung", label: "akute Gefaehrdung (ja)", kind: "finding" },
      { id: "schutzfaktoren", label: "Schutzfaktoren vorhanden", kind: "finding" },
    ],
  },
  {
    id: "global_varia",
    title: "Globalparameter & Varia",
    icon: "ClipboardList",
    items: [
      { id: "global_unauffaellig", label: "unauffaellig / stabil", kind: "normal" },
      { id: "global_nicht_beurteilbar", label: "nicht beurteilbar", kind: "unassessable" },
      { id: "global_funktionsniveau_reduziert", label: "Funktionsniveau reduziert", kind: "finding" },
      { id: "global_alltag_eingeschraenkt", label: "Alltagsfunktion eingeschraenkt", kind: "finding" },
      { id: "global_belastungsfaktoren", label: "aktuelle Belastungsfaktoren", kind: "finding" },
      { id: "global_ressourcen", label: "Ressourcen vorhanden", kind: "finding" },
      { id: "varia_freitext_marker", label: "Varia / Freitext (siehe Notizen)", kind: "finding" },
    ],
  },
];
