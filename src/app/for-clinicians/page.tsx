"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { SecondaryButton } from "@/components/landing/Buttons";
import VoiceToTextDiagram from "@/components/VoiceToTextDiagram";
import Image from "next/image";

const copy = {
  de: {
    title: "Für Therapeut:innen & Psychiater:innen",
    introParagraphs: [
      "DailyCheck ist ein klinischer Dokumentationsassistent für psychiatrische und psychotherapeutische Praxis.",
      "Er hilft Ihnen, aus Diktat oder Transkript einen strukturierten Entwurf zu erzeugen - ohne Ihre klinische Kontrolle zu ersetzen.",
    ],
    controlTitle: "Sie behalten jederzeit die volle Kontrolle",
    controlItems: [
      "Ausgabe ist immer ein Entwurf, kein finales Dokument",
      "Kein Diagnosetool",
      "Keine Behandlungsempfehlungen",
      "Human-in-the-loop: Sie prüfen, bearbeiten, übernehmen",
    ],
    problemTitle: "Das Problem: Dokumentation frisst therapeutische Energie",
    problemIntro: "Viele Kliniker:innen kennen:",
    problemItems: [
      "Unstrukturierte Notizen nach Sitzungen",
      "Berichte am Abend oder Wochenende",
      "Copy/Paste-Chaos zwischen Systemen und Vorlagen",
      "Hoher administrativer Druck - weniger Präsenz im Kontakt",
    ],
    problemOutro:
      "DailyCheck reduziert diesen Aufwand, ohne klinische Qualität oder Verantwortung zu kompromittieren.",
    flowTitle: "So funktioniert es",
    flowSubtitle: "Drei klare Schritte - ohne Umwege.",
    flowSteps: [
      {
        title: "01 - Audio diktieren oder hochladen",
        body: "Nach der Sitzung ein kurzes Diktat, optional auch ein Sitzungs-Transkript.",
      },
      {
        title: "02 - Vorlage auswählen",
        body: "Wählen Sie Ihre bevorzugte Struktur oder Ihr Template.",
      },
      {
        title: "03 - Prüfen, bearbeiten, kopieren",
        body: "Sie erhalten einen strukturierten Entwurf, den Sie finalisieren und in Ihre Vorlage übernehmen.",
      },
    ],
    comparisonTitle: "Vorher vs. Nachher",
    comparisonSubtitle: "Kurz, klar, ohne Zusatzaufwand.",
    comparisonBeforeTitle: "Vorher",
    comparisonBefore: [
      "Unstrukturierte Notizen",
      "Berichte am Abend schreiben",
      "Copy/Paste-Chaos",
      "Uneinheitliche Formatierung",
    ],
    comparisonAfterTitle: "Nachher",
    comparisonAfter: [
      "Strukturierter Entwurf im klinischen Format",
      "5-10 Minuten Nacharbeit statt langer Schreibphasen",
      "Schnell in Ihre Vorlage kopierbar",
      "Konsistentere Dokumentation",
    ],
    supportsTitle: "Was DailyCheck unterstützt",
    supportsIntro: "DailyCheck ist darauf optimiert, klinische Dokumentation effizienter zu machen:",
    supports: [
      "Diktat nach Sitzungen (kurz und praxistauglich)",
      "Optionale Transkription (z. B. aus aufgenommenen Gesprächen)",
      "Strukturierung in Ihre bevorzugten Vorlagen",
      "Schnellere Fertigstellung von Notizen, Verlaufsdokumentation, Berichten",
      "Entwürfe, die Ihren Stil respektieren (Sie editieren final)",
    ],
    notTitle: "Was DailyCheck bewusst nicht tut",
    notIntro: "DailyCheck ist kein klinisches Entscheidungswerkzeug:",
    not: [
      "Stellt keine Diagnosen",
      "Gibt keine Behandlungsempfehlungen",
      "Ersetzt keine klinische Beurteilung",
      "Erstellt keine finalen Dokumente ohne Ihre Prüfung",
    ],
    whyTitle: "Warum Kliniker:innen es nutzen",
    whySubtitle: "Weniger Abend-Admin, mehr therapeutische Präsenz.",
    whyItems: [
      "Strukturierte Entwürfe im klinischen Format",
      "Klare Darstellung, bessere Nachvollziehbarkeit",
      "Weniger Arbeit außerhalb der Arbeitszeit",
      "Mehr Fokus auf Patient:innenkontakt und Therapieprozess",
    ],
    humanismTitle: "Digitale Humanität: AI als Partner, nicht als Ersatz",
    humanismIntro:
      "DailyCheck folgt einem Digital Humanism Ansatz: AI unterstützt Ärzt:innen und Therapeut:innen, ersetzt aber nie klinische Verantwortung.",
    humanismPrinciplesTitle: "Kernprinzipien:",
    humanismPrinciples: [
      "AI unterstützt nur Dokumentation und Struktur",
      "Klinische Entscheidung bleibt immer beim Menschen",
      "Human-in-the-loop ist kein Feature - es ist das Fundament",
    ],
    humanismFitTitle: "Diese Positionierung ist anschlussfähig an:",
    humanismFitItems: [
      "Konservative Kliniker:innen",
      "EU-Regulatorik und zukünftige Standards",
      "Beschaffungsanforderungen im Gesundheitswesen",
    ],
    privacyTitle: "Datenschutz & Vertrauen",
    privacySubtitle: "Kurze Antworten auf die wichtigsten Fragen.",
    privacyCards: [
      {
        title: "Audio-Handling",
        body: "Audio wird nur zur Transkription und Verarbeitung genutzt, danach gelöscht (empfohlener Standard).",
      },
      {
        title: "Entwurf statt Automatik",
        body: "Ausgabe ist ein Entwurf. Sie prüfen, bearbeiten und übernehmen aktiv.",
      },
      {
        title: "Keine dauerhafte Speicherung",
        body: "Texte werden nicht als Patientenakten gespeichert. Verarbeitung endet nach der Entwurferstellung.",
      },
    ],
    privacyLink: "Datenschutz & FAQ lesen",
    complianceTitle: "Sicherheit & Compliance (für Praxen, Kliniken, Beschaffung)",
    complianceIntro:
      "Wir denken Dokumentation nicht nur klinisch, sondern auch organisatorisch - mit Prozessen, die in regulierten Umfeldern erwartet werden:",
    complianceItems: [
      "Dokumentierte Prozesse und Verantwortlichkeiten",
      "Definierter Umgang mit Änderungen (Change Logs)",
      "Versionskontrolle für Vorlagen und Output-Strukturen",
      "Incident Handling (Erkennung, Eskalation, Nachbearbeitung)",
      "Kontinuierliche Verbesserung und Lessons Learned",
    ],
    isoTitle: "ISO-Ausrichtung",
    isoBody:
      "Unsere Sicherheits- und Datenschutzarchitektur ist ISO 27001-orientiert (Informationssicherheit) und berücksichtigt Prinzipien aus ISO 27701 (Privacy Information Management).",
    isoQuote:
      "Wir sind ISO 27001-aligned und sind - falls für Wachstum oder Procurement nötig - auf eine Zertifizierung vorbereitet.",
    isoBenefitsTitle: "Das stärkt:",
    isoBenefits: [
      "Glaubwürdigkeit gegenüber klinischen Stakeholdern",
      "Anschlussfähigkeit an Beschaffungsprozesse",
      "Zukunftssicherheit in einem sich verschärfenden Regulierungsumfeld",
    ],
    sustainabilityTitle: "Nachhaltigkeit & Energieeffizienz (bewusst, nicht performativ)",
    sustainabilityIntro:
      "DailyCheck verfolgt einen pragmatischen, verantwortungsvollen Ansatz:",
    sustainabilityItems: [
      "Keine energieintensiven Always-On-Pipelines",
      "Keine eigenen Large-Model-Trainings",
      "Effiziente Verarbeitung (z. B. batch-basierte Zusammenfassungen)",
    ],
    sustainabilityBenefitsTitle: "Das ist gut für:",
    sustainabilityBenefits: ["Kostenkontrolle", "Ethische Positionierung", "Nachhaltigen Betrieb"],
    ctaTitle: "Call-to-Action (Beispiel)",
    ctaBody:
      "Möchten Sie sehen, wie ein Entwurf in Ihrer Vorlage aussieht? Demo anfordern, Template testen oder einen Pilot in Ihrer Praxis starten.",
    whisperDisclaimerTitle: "OpenAI Whisper Haftungsausschluss",
    whisperDisclaimerBody: [
      "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.",
      "IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
    ],
  },
  en: {
    title: "For Therapists & Psychiatrists",
    introParagraphs: [
      "DailyCheck is a clinical documentation assistant for psychiatric and psychotherapeutic practice.",
      "It helps turn dictation or transcripts into structured drafts without replacing your clinical control.",
    ],
    controlTitle: "You stay fully in control",
    controlItems: [
      "Output is always a draft, never a final document",
      "Not a diagnostic tool",
      "No treatment recommendations",
      "Human-in-the-loop: you review, edit, and adopt",
    ],
    problemTitle: "The problem: documentation drains therapeutic energy",
    problemIntro: "Many clinicians know this:",
    problemItems: [
      "Unstructured notes after sessions",
      "Reports written in the evening or on weekends",
      "Copy/paste chaos across systems and templates",
      "High administrative pressure - less presence in session",
    ],
    problemOutro:
      "DailyCheck reduces this workload without compromising clinical quality or responsibility.",
    flowTitle: "How it works",
    flowSubtitle: "Three clear steps, no detours.",
    flowSteps: [
      {
        title: "01 - Dictate or upload audio",
        body: "A short dictation after the session, optionally also a session transcript.",
      },
      {
        title: "02 - Choose a template",
        body: "Select your preferred structure or template.",
      },
      {
        title: "03 - Review, edit, copy",
        body: "You receive a structured draft that you finalize and move into your template.",
      },
    ],
    comparisonTitle: "Before vs after",
    comparisonSubtitle: "Short, clear, no extra admin.",
    comparisonBeforeTitle: "Before",
    comparisonBefore: [
      "Unstructured notes",
      "Evening report writing",
      "Copy/paste chaos",
      "Inconsistent formatting",
    ],
    comparisonAfterTitle: "After",
    comparisonAfter: [
      "Structured draft in clinical format",
      "5-10 minutes of polishing instead of long write-ups",
      "Quickly copyable into your template",
      "More consistent documentation",
    ],
    supportsTitle: "What DailyCheck supports",
    supportsIntro: "DailyCheck is optimized to make clinical documentation more efficient:",
    supports: [
      "Dictation after sessions (short and practical)",
      "Optional transcription (e.g., from recorded conversations)",
      "Structuring into your preferred templates",
      "Faster completion of notes, progress documentation, reports",
      "Drafts that respect your style (you edit the final)",
    ],
    notTitle: "What DailyCheck deliberately does not do",
    notIntro: "DailyCheck is not a clinical decision tool:",
    not: [
      "Does not diagnose",
      "Does not recommend treatments",
      "Does not replace clinical judgment",
      "Does not create final documents without your review",
    ],
    whyTitle: "Why clinicians use it",
    whySubtitle: "Less after-hours admin, more clinical presence.",
    whyItems: [
      "Structured drafts in clinical format",
      "Clearer presentation, better traceability",
      "Less work outside working hours",
      "More focus on patient contact and therapy process",
    ],
    humanismTitle: "Digital humanism: AI as a partner, not a replacement",
    humanismIntro:
      "DailyCheck follows a Digital Humanism approach: AI supports clinicians, but never replaces clinical responsibility.",
    humanismPrinciplesTitle: "Core principles:",
    humanismPrinciples: [
      "AI supports documentation and structure only",
      "Clinical decisions always stay with humans",
      "Human-in-the-loop is not a feature - it is the foundation",
    ],
    humanismFitTitle: "This positioning aligns with:",
    humanismFitItems: [
      "Conservative clinicians",
      "EU regulation and future standards",
      "Healthcare procurement requirements",
    ],
    privacyTitle: "Privacy & trust",
    privacySubtitle: "Short answers to the essential questions.",
    privacyCards: [
      {
        title: "Audio handling",
        body: "Audio is used only for transcription and processing, then deleted (recommended standard).",
      },
      {
        title: "Draft, not automation",
        body: "Output is a draft. You review, edit, and actively adopt it.",
      },
      {
        title: "No persistent storage",
        body: "Texts are not stored as patient records. Processing ends after the draft is created.",
      },
    ],
    privacyLink: "Read privacy & FAQ",
    complianceTitle: "Security & compliance (for practices, clinics, procurement)",
    complianceIntro:
      "We approach documentation not only clinically but also operationally - with processes expected in regulated environments:",
    complianceItems: [
      "Documented processes and responsibilities",
      "Defined change handling (change logs)",
      "Version control for templates and output structures",
      "Incident handling (detection, escalation, follow-up)",
      "Continuous improvement and lessons learned",
    ],
    isoTitle: "ISO orientation",
    isoBody:
      "Our security and privacy architecture is aligned with ISO 27001 (information security) and incorporates principles from ISO 27701 (privacy information management).",
    isoQuote:
      "We are ISO 27001-aligned and prepared for certification if required for growth or procurement.",
    isoBenefitsTitle: "This strengthens:",
    isoBenefits: [
      "Credibility with clinical stakeholders",
      "Alignment with procurement processes",
      "Future readiness in a tightening regulatory environment",
    ],
    sustainabilityTitle: "Sustainability & energy efficiency (pragmatic, not performative)",
    sustainabilityIntro: "DailyCheck follows a pragmatic, responsible approach:",
    sustainabilityItems: [
      "No energy-intensive always-on pipelines",
      "No proprietary large-model training",
      "Efficient processing (e.g., batch-based summaries)",
    ],
    sustainabilityBenefitsTitle: "This is good for:",
    sustainabilityBenefits: ["Cost control", "Ethical positioning", "Sustainable operations"],
    ctaTitle: "Call to action (example)",
    ctaBody:
      "Want to see what a draft looks like in your template? Request a demo, test a template, or start a pilot in your practice.",
    whisperDisclaimerTitle: "OpenAI Whisper disclaimer",
    whisperDisclaimerBody: [
      "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.",
      "IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
    ],
  },
  it: {
    title: "Per Terapisti & Psichiatri",
    introParagraphs: [
      "DailyCheck e un assistente di documentazione clinica per la pratica psichiatrica e psicoterapeutica.",
      "Aiuta a trasformare dettati o trascrizioni in bozze strutturate senza sostituire il controllo clinico.",
    ],
    controlTitle: "Rimani sempre pienamente in controllo",
    controlItems: [
      "L'output e sempre una bozza, mai un documento finale",
      "Non e uno strumento diagnostico",
      "Nessuna raccomandazione terapeutica",
      "Human-in-the-loop: rivedi, modifichi, adotti",
    ],
    problemTitle: "Il problema: la documentazione consuma energia terapeutica",
    problemIntro: "Molti clinici lo conoscono:",
    problemItems: [
      "Note non strutturate dopo le sedute",
      "Report serali o nel weekend",
      "Caos copia/incolla tra sistemi e modelli",
      "Pressione amministrativa elevata - meno presenza in seduta",
    ],
    problemOutro:
      "DailyCheck riduce questo carico senza compromettere qualita clinica o responsabilita.",
    flowTitle: "Come funziona",
    flowSubtitle: "Tre step chiari, senza deviazioni.",
    flowSteps: [
      {
        title: "01 - Detta o carica audio",
        body: "Un breve dettato dopo la seduta, opzionalmente anche una trascrizione.",
      },
      {
        title: "02 - Scegli un modello",
        body: "Seleziona la struttura o il template che preferisci.",
      },
      {
        title: "03 - Rivedi, modifica, copia",
        body: "Ricevi una bozza strutturata da finalizzare e trasferire nel tuo modello.",
      },
    ],
    comparisonTitle: "Prima vs dopo",
    comparisonSubtitle: "Breve, chiaro, senza extra.",
    comparisonBeforeTitle: "Prima",
    comparisonBefore: [
      "Note non strutturate",
      "Report serali",
      "Caos copia/incolla",
      "Formattazione incoerente",
    ],
    comparisonAfterTitle: "Dopo",
    comparisonAfter: [
      "Bozza strutturata in formato clinico",
      "5-10 minuti di revisione invece di lunghe stesure",
      "Copiabile rapidamente nel tuo modello",
      "Documentazione piu coerente",
    ],
    supportsTitle: "Cosa supporta DailyCheck",
    supportsIntro: "DailyCheck e ottimizzato per rendere la documentazione clinica piu efficiente:",
    supports: [
      "Dettatura dopo le sedute (breve e pratica)",
      "Trascrizione opzionale (ad es. da conversazioni registrate)",
      "Strutturazione nei tuoi modelli preferiti",
      "Completamento piu rapido di note, progressi, report",
      "Bozze che rispettano il tuo stile (modifichi il finale)",
    ],
    notTitle: "Cosa DailyCheck non fa volutamente",
    notIntro: "DailyCheck non e uno strumento di decisione clinica:",
    not: [
      "Non fa diagnosi",
      "Non suggerisce trattamenti",
      "Non sostituisce il giudizio clinico",
      "Non crea documenti finali senza la tua revisione",
    ],
    whyTitle: "Perché i professionisti lo usano",
    whySubtitle: "Meno amministrazione serale, più presenza clinica.",
    whyItems: [
      "Bozze strutturate in formato clinico",
      "Maggiore chiarezza, migliore tracciabilita",
      "Meno lavoro fuori orario",
      "Piu focus sul contatto con i pazienti e sul processo terapeutico",
    ],
    humanismTitle: "Umanesimo digitale: AI come partner, non sostituto",
    humanismIntro:
      "DailyCheck segue un approccio di Digital Humanism: l'AI supporta i clinici, ma non sostituisce la responsabilita clinica.",
    humanismPrinciplesTitle: "Principi chiave:",
    humanismPrinciples: [
      "L'AI supporta solo documentazione e struttura",
      "La decisione clinica resta sempre umana",
      "Human-in-the-loop non e una funzione - e il fondamento",
    ],
    humanismFitTitle: "Questa posizione e compatibile con:",
    humanismFitItems: [
      "Clinici conservatori",
      "Regolamentazione UE e standard futuri",
      "Requisiti di procurement in sanita",
    ],
    privacyTitle: "Privacy e fiducia",
    privacySubtitle: "Risposte brevi alle domande chiave.",
    privacyCards: [
      {
        title: "Gestione dell'audio",
        body: "L'audio e usato solo per trascrizione ed elaborazione, poi eliminato (standard consigliato).",
      },
      {
        title: "Bozza, non automazione",
        body: "L'output e una bozza. La rivedi, la modifichi e la adotti attivamente.",
      },
      {
        title: "Nessuna memorizzazione permanente",
        body: "I testi non sono salvati come cartelle paziente. L'elaborazione termina dopo la bozza.",
      },
    ],
    privacyLink: "Leggi privacy & FAQ",
    complianceTitle: "Sicurezza e compliance (per studi, cliniche, procurement)",
    complianceIntro:
      "Pensiamo alla documentazione non solo in chiave clinica ma anche organizzativa - con processi attesi in contesti regolati:",
    complianceItems: [
      "Processi e responsabilita documentati",
      "Gestione definita delle modifiche (change log)",
      "Controllo versioni per modelli e output",
      "Incident handling (rilevazione, escalation, follow-up)",
      "Miglioramento continuo e lessons learned",
    ],
    isoTitle: "Orientamento ISO",
    isoBody:
      "La nostra architettura di sicurezza e privacy e allineata a ISO 27001 e incorpora principi di ISO 27701.",
    isoQuote:
      "Siamo allineati a ISO 27001 e pronti alla certificazione se necessaria per crescita o procurement.",
    isoBenefitsTitle: "Questo rafforza:",
    isoBenefits: [
      "Credibilita con gli stakeholder clinici",
      "Allineamento ai processi di procurement",
      "Preparazione a un contesto regolatorio piu stringente",
    ],
    sustainabilityTitle: "Sostenibilita ed efficienza energetica (pragmatica, non performativa)",
    sustainabilityIntro: "DailyCheck segue un approccio responsabile e pragmatico:",
    sustainabilityItems: [
      "Nessuna pipeline always-on ad alto consumo",
      "Nessun training proprietario di large model",
      "Elaborazione efficiente (es. riassunti batch)",
    ],
    sustainabilityBenefitsTitle: "Questo e positivo per:",
    sustainabilityBenefits: ["Controllo dei costi", "Posizionamento etico", "Operativita sostenibile"],
    ctaTitle: "Call-to-action (esempio)",
    ctaBody:
      "Vuoi vedere come appare una bozza nel tuo modello? Richiedi una demo, testa un template o avvia un pilot nel tuo studio.",
    whisperDisclaimerTitle: "Disclaimer OpenAI Whisper",
    whisperDisclaimerBody: [
      "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.",
      "IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
    ],
  },
  fr: {
    title: "Pour Therapeutes & Psychiatres",
    introParagraphs: [
      "DailyCheck est un assistant de documentation clinique pour la pratique psychiatrique et psychotherapeutique.",
      "Il transforme dictees ou transcriptions en brouillons structures sans remplacer votre controle clinique.",
    ],
    controlTitle: "Vous gardez le controle en permanence",
    controlItems: [
      "La sortie est toujours un brouillon, jamais un document final",
      "Ce n'est pas un outil de diagnostic",
      "Pas de recommandations therapeutiques",
      "Human-in-the-loop: vous relisez, modifiez, adoptez",
    ],
    problemTitle: "Le probleme: la documentation consomme l'energie therapeutique",
    problemIntro: "Beaucoup de cliniciens connaissent:",
    problemItems: [
      "Notes non structurees apres les seances",
      "Rapports le soir ou le week-end",
      "Chaos copier/coller entre systemes et modeles",
      "Pression administrative elevee - moins de presence en seance",
    ],
    problemOutro:
      "DailyCheck reduit cette charge sans compromettre la qualite clinique ni la responsabilite.",
    flowTitle: "Comment ca marche",
    flowSubtitle: "Trois etapes nettes, sans detour.",
    flowSteps: [
      {
        title: "01 - Dicter ou importer l'audio",
        body: "Une courte dictee apres la seance, et optionnellement une transcription.",
      },
      {
        title: "02 - Choisir un modele",
        body: "Selectionnez votre structure ou votre template prefere.",
      },
      {
        title: "03 - Relire, modifier, copier",
        body: "Vous recevez un brouillon structure a finaliser et integrer a votre modele.",
      },
    ],
    comparisonTitle: "Avant vs apres",
    comparisonSubtitle: "Court, clair, sans surcharge.",
    comparisonBeforeTitle: "Avant",
    comparisonBefore: [
      "Notes non structurees",
      "Rapports le soir",
      "Chaos copier/coller",
      "Mise en forme incoherente",
    ],
    comparisonAfterTitle: "Apres",
    comparisonAfter: [
      "Brouillon structure au format clinique",
      "5-10 minutes de finition au lieu de longues redactions",
      "Copiable rapidement dans votre modele",
      "Documentation plus coherente",
    ],
    supportsTitle: "Ce que DailyCheck supporte",
    supportsIntro:
      "DailyCheck est optimise pour rendre la documentation clinique plus efficace:",
    supports: [
      "Dictee apres les seances (courte et pratique)",
      "Transcription optionnelle (ex. a partir de conversations enregistrees)",
      "Structuration dans vos modeles preferes",
      "Finalisation plus rapide des notes, suivis, rapports",
      "Brouillons respectant votre style (vous finalisez)",
    ],
    notTitle: "Ce que DailyCheck ne fait pas volontairement",
    notIntro: "DailyCheck n'est pas un outil de decision clinique:",
    not: [
      "Cela ne diagnostique pas",
      "Cela ne suggere pas de traitements",
      "Cela ne remplace pas le jugement clinique",
      "Cela ne cree pas de documents finaux sans votre relecture",
    ],
    whyTitle: "Pourquoi les cliniciens l'utilisent",
    whySubtitle: "Moins d'administratif le soir, plus de presence clinique.",
    whyItems: [
      "Brouillons structures au format clinique",
      "Presentation plus claire, meilleure tracabilite",
      "Moins de travail hors horaires",
      "Plus de focus sur le contact patient et le processus therapeutique",
    ],
    humanismTitle: "Humanisme digital: l'IA comme partenaire, pas remplacant",
    humanismIntro:
      "DailyCheck suit une approche de Digital Humanism: l'IA soutient les cliniciens sans jamais remplacer la responsabilite clinique.",
    humanismPrinciplesTitle: "Principes clés:",
    humanismPrinciples: [
      "L'IA soutient uniquement documentation et structure",
      "La decision clinique reste humaine",
      "Human-in-the-loop n'est pas une fonction - c'est la base",
    ],
    humanismFitTitle: "Cette position convient a:",
    humanismFitItems: [
      "Cliniciens conservateurs",
      "Reglementation UE et futurs standards",
      "Exigences d'achat en sante",
    ],
    privacyTitle: "Confidentialité et confiance",
    privacySubtitle: "Reponses courtes aux questions essentielles.",
    privacyCards: [
      {
        title: "Gestion de l'audio",
        body:
          "L'audio est utilise pour transcription et traitement, puis supprime (standard recommande).",
      },
      {
        title: "Brouillon, pas automatisation",
        body: "La sortie est un brouillon. Vous relisez, modifiez et adoptez activement.",
      },
      {
        title: "Pas de stockage durable",
        body:
          "Les textes ne sont pas conserves comme dossiers patients. Le traitement s'arrete apres le brouillon.",
      },
    ],
    privacyLink: "Lire confidentialité & FAQ",
    complianceTitle: "Securite & compliance (pour cabinets, cliniques, achats)",
    complianceIntro:
      "Nous pensons la documentation aussi sur le plan organisationnel - avec des processus attendus en environnement reglemente:",
    complianceItems: [
      "Processus et responsabilites documentes",
      "Gestion des changements definie (change logs)",
      "Controle de version pour modeles et structures de sortie",
      "Gestion des incidents (detection, escalation, suivi)",
      "Amelioration continue et lessons learned",
    ],
    isoTitle: "Orientation ISO",
    isoBody:
      "Notre architecture securite et vie privee est alignee sur ISO 27001 et integre des principes ISO 27701.",
    isoQuote:
      "Nous sommes alignes ISO 27001 et prepares a une certification si necessaire pour croissance ou achats.",
    isoBenefitsTitle: "Cela renforce:",
    isoBenefits: [
      "Credibilite aupres des acteurs cliniques",
      "Compatibilite avec les processus d'achat",
      "Preparation a un contexte reglementaire plus strict",
    ],
    sustainabilityTitle: "Durabilite et efficience energetique (pragmatique, non performative)",
    sustainabilityIntro: "DailyCheck suit une approche pragmatique et responsable:",
    sustainabilityItems: [
      "Pas de pipelines always-on energivores",
      "Pas d'entrainement proprietaire de grands modeles",
      "Traitement efficace (ex. resumes batch)",
    ],
    sustainabilityBenefitsTitle: "C'est positif pour:",
    sustainabilityBenefits: [
      "Controle des couts",
      "Positionnement ethique",
      "Operations durables",
    ],
    ctaTitle: "Appel a l'action (exemple)",
    ctaBody:
      "Souhaitez-vous voir a quoi ressemble un brouillon dans votre modele? Demandez une demo, testez un template ou lancez un pilote.",
    whisperDisclaimerTitle: "Avertissement OpenAI Whisper",
    whisperDisclaimerBody: [
      "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.",
      "IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.",
    ],
  },
} as const;

export default function ForCliniciansPage() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <div className="space-y-8 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      {"introParagraphs" in t ? (
        <>
          <div className="space-y-3 text-sm text-gray-700">
            {t.introParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-3">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1 space-y-3">
                <h2 className="text-base font-semibold">{t.controlTitle}</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {t.controlItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 relative h-full min-h-[220px] md:min-h-[260px]">
                <Image
                  src="/for%20clinicians/Pro%3AContra.png"
                  alt={t.controlTitle}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-2xl border object-cover shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold">{t.problemTitle}</h2>
            <p className="text-sm text-gray-700">{t.problemIntro}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              {t.problemItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-700">{t.problemOutro}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{t.flowTitle}</h2>
              <p className="text-sm text-gray-700">{t.flowSubtitle}</p>
            </div>
            <VoiceToTextDiagram className="rounded-3xl border border-black/5 shadow-sm" />
            <div className="grid gap-3 md:grid-cols-3">
              {t.flowSteps.map((step) => (
                <div key={step.title} className="rounded-xl border bg-white p-3">
                  <div className="text-xs font-semibold text-gray-500">{step.title}</div>
                  <p className="mt-2 text-sm text-gray-700">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">{t.comparisonTitle}</h2>
            <p className="text-sm text-gray-700">{t.comparisonSubtitle}</p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border bg-white p-3">
                <div className="text-xs font-semibold text-gray-500">
                  {t.comparisonBeforeTitle}
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {t.comparisonBefore.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border bg-white p-3">
                <div className="text-xs font-semibold text-gray-500">
                  {t.comparisonAfterTitle}
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {t.comparisonAfter.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">{t.supportsTitle}</h2>
            <p className="text-sm text-gray-700">{t.supportsIntro}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              {t.supports.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">{t.notTitle}</h2>
            <p className="text-sm text-gray-700">{t.notIntro}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              {t.not.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{t.whyTitle}</h2>
              <p className="text-sm text-gray-700">{t.whySubtitle}</p>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              {t.whyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold">{t.humanismTitle}</h2>
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className="order-1 md:order-2 space-y-3">
                <p className="text-sm text-gray-700">{t.humanismIntro}</p>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {t.humanismPrinciplesTitle}
                  </div>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                    {t.humanismPrinciples.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {t.humanismFitTitle}
                  </div>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                    {t.humanismFitItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="order-2 md:order-1 relative h-full min-h-[220px] md:min-h-[260px]">
                <Image
                  src="/for%20clinicians/Humanistic%20AI.png"
                  alt={t.humanismTitle}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-2xl border object-cover shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{t.privacyTitle}</h2>
              <p className="text-sm text-gray-700">{t.privacySubtitle}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1 grid gap-4 md:grid-cols-1">
                {t.privacyCards.map((card) => (
                  <div key={card.title} className="rounded-xl border bg-white p-3 shadow-sm">
                    <div className="text-sm font-semibold">{card.title}</div>
                    <p className="mt-1 text-sm text-gray-700">{card.body}</p>
                  </div>
                ))}
              </div>
              <div className="order-1 md:order-2 relative h-full min-h-[220px] md:min-h-[260px]">
                <Image
                  src="/for%20clinicians/security2.png"
                  alt={t.privacyTitle}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-2xl border object-cover shadow-sm"
                />
              </div>
            </div>
            <div>
              <SecondaryButton href="/privacy">{t.privacyLink}</SecondaryButton>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold">{t.complianceTitle}</h2>
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className="order-1 md:order-2 space-y-2">
                <p className="text-sm text-gray-700">{t.complianceIntro}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {t.complianceItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="order-2 md:order-1 relative h-full min-h-[220px] md:min-h-[260px]">
                <Image
                  src="/for%20clinicians/Security.png"
                  alt={t.complianceTitle}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-2xl border object-cover shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold">{t.isoTitle}</h2>
            <p className="text-sm text-gray-700">{t.isoBody}</p>
            <p className="text-sm font-semibold text-gray-900">{t.isoQuote}</p>
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">{t.isoBenefitsTitle}</div>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                {t.isoBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold">{t.sustainabilityTitle}</h2>
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className="order-2 md:order-1 space-y-3">
                <p className="text-sm text-gray-700">{t.sustainabilityIntro}</p>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {t.sustainabilityItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-900">
                    {t.sustainabilityBenefitsTitle}
                  </div>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                    {t.sustainabilityBenefits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="order-1 md:order-2 relative h-full min-h-[220px] md:min-h-[260px]">
                <Image
                  src="/for%20clinicians/Nachhaltigkeit.png"
                  alt={t.sustainabilityTitle}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="rounded-2xl border object-cover shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">{t.ctaTitle}</h2>
            <p className="text-sm text-gray-700">{t.ctaBody}</p>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-700">{t.intro}</p>

          <h2 className="text-base font-semibold">{t.flowTitle}</h2>
          <p className="text-sm text-gray-700">{t.flowSubtitle}</p>
          <div className="grid gap-3 md:grid-cols-3">
            {t.flowSteps.map((step, index) => (
              <div key={step} className="rounded-xl border bg-white p-3">
                <div className="text-xs font-semibold text-gray-500">0{index + 1}</div>
                <div className="mt-1 text-sm font-semibold">{step}</div>
              </div>
            ))}
          </div>

          <h2 className="text-base font-semibold">{t.comparisonTitle}</h2>
          <p className="text-sm text-gray-700">{t.comparisonSubtitle}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-3">
              <div className="text-xs font-semibold text-gray-500">
                {t.comparisonBeforeTitle}
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {t.comparisonBefore.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-white p-3">
              <div className="text-xs font-semibold text-gray-500">
                {t.comparisonAfterTitle}
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                {t.comparisonAfter.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="text-base font-semibold">{t.supportsTitle}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            {t.supports.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="text-base font-semibold">{t.notTitle}</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
            {t.not.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="space-y-5">
            <h2 className="text-base font-semibold">{t.whyTitle}</h2>
            <p className="text-sm text-gray-700">{t.whySubtitle}</p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
              {t.whyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-semibold">{t.privacyTitle}</h2>
              <p className="text-sm text-gray-700">{t.privacySubtitle}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {t.privacyCards.map((card) => (
                <div key={card.title} className="rounded-xl border bg-white p-3 shadow-sm">
                  <div className="text-sm font-semibold">{card.title}</div>
                  <p className="mt-1 text-sm text-gray-700">{card.body}</p>
                </div>
              ))}
            </div>
            <div>
              <SecondaryButton href="/privacy">{t.privacyLink}</SecondaryButton>
            </div>
          </div>
        </>
      )}

      <div className="rounded-xl border bg-gray-50 p-4 text-xs text-gray-600">
        <div className="text-sm font-semibold text-gray-800">{t.whisperDisclaimerTitle}</div>
        <div className="mt-2 space-y-2">
          {t.whisperDisclaimerBody.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
