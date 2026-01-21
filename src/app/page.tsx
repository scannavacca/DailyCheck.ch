"use client";

import Image from "next/image";
import { useState } from "react";
import { SloganCarousel } from "@/components/SloganCarousel";
import { useLanguage } from "@/components/LanguageProvider";
import { Section } from "@/components/landing/Section";
import { Card } from "@/components/landing/Card";
import { PricingSection } from "@/components/landing/PricingSection";
import { QuoteCard } from "@/components/landing/QuoteCard";
import { PrimaryButton, SecondaryButton } from "@/components/landing/Buttons";

const copy = {
  de: {
    hero: {
      titleLine1: "Klinische Dokumentation in Minuten,",
      titleLine2: "nicht am Abend.",
      imageAlt: "Therapiesitzung: Notizen im Gespräch",
      subtitle:
        "Ein Dokumentationsassistent für Psychiatrie & Psychotherapie. Sie diktieren oder laden Audio hoch, erhalten einen strukturierten Entwurf in Ihrer Vorlage und prüfen ihn vor dem Kopieren.",
      badges: [
        "Keine Diagnosen / keine Therapieempfehlungen",
        "Psychiater*innen bleiben verantwortlich",
        "Audio wird nach Transkription gelöscht (empfohlen)",
      ],
      ctas: {
        primary: "Early Access",
        secondary: "Demo öffnen",
        login: "Login / Sign in",
      },
      ltdNote: "LTD: einmaliges Early-Access-Angebot, wird nicht wiederholt.",
      disclaimer: "Nur Dokumentationsassistent. Kein Patientenportal. Kein Entscheidungsautomatismus.",
    },
    workflow: {
      title: "So funktioniert es",
      subtitle: "Drei klare Schritte - ohne Umwege.",
      steps: ["Audio diktieren oder hochladen", "Vorlage auswählen", "Prüfen, kopieren, fertig"],
      designedLabel: "Entwickelt für",
      designedBody:
        "Psychiater und Psychotherapeuten, die strukturierte Notizen schneller erstellen wollen, ohne klinische Kontrolle zu verlieren.",
    },
    productPreview: {
      title: "So sieht es aus",
      subtitle: "Neutraler Ablauf: Input rein, strukturierter Entwurf raus.",
      cards: [
        {
          title: "Input",
          body:
            "\"Verlaufseintrag heute. Patient M.K., pünktlich erschienen. Berichtet seit letzter Sitzung zunehmende Belastung am Arbeitsplatz, fühlt sich unter Druck und stark bewertet. Abends ausgeprägtes Grübeln, kann nicht abschalten. Schlaf reduziert mit nächtlichem Erwachen, morgens erschöpft. Stimmung gedrückt und angespannt (so berichtet im DailyCheck Protokoll-App). Suizidgedanken verneint, kein Plan. Keine Hinweise auf psychotische Symptome. Wir haben Stressmanagement, Pausenstruktur und Abgrenzung besprochen. Hausaufgabe: Belastungsprotokoll (DailyCheck App) und täglich zwei kurze Pausen einplanen. Medikamenten so belassen. Nächster Termin in zwei Wochen.\"",
        },
        {
          title: "Output",
          body: (
            <>
              <span className="font-semibold">Verlaufseintrag</span>
              <br />
              <span className="font-semibold">Datum:</span> 17.01.2026
              <br />
              <span className="font-semibold">Patient:</span> M.K.
              <br />
              <span className="font-semibold">Anlass / Fokus:</span>
              <br />
              Arbeitsbezogene Belastung, Grübelneigung, Schlafstörung, innere Anspannung
              <br />
              <span className="font-semibold">Psychostatus:</span>
              <br />
              wach, allseits orientiert; Stimmung dysphor/angespannt; Affekt niedergeschlagen;
              formal geordnet; inhaltlich Grübeln; unruhig; keine Wahnsymptomatik;
              Suizidalität verneint. Wirkt Absprache fähig.
              <br />
              <span className="font-semibold">Verlauf / Inhalt:</span>
              <br />
              Patient pünktlich erschienen. Seit letzter Sitzung zunehmende Belastung im
              Arbeitskontext mit subjektivem Druck- und Bewertungsgefühl. Abends ausgeprägtes
              Grübeln, vermindertes Abschalten. Schlaf beeinträchtigt mit nächtlichem
              Erwachen, morgendlicher Erschöpfung. Stimmung gedrückt und angespannt.
              Suizidalität verneint, kein Hinweis auf psychotische Symptome. Intervention:
              Stressmanagement, Pausenstruktur und Abgrenzung thematisiert.
              <br />
              <span className="font-semibold">Beurteilung:</span>
              <br />
              Aktuelle stressassoziierte Symptomzunahme (Anspannung/Grübeln/Schlaf), keine
              akute Eigen- oder Fremdgefährdung
              <br />
              <span className="font-semibold">Plan:</span>
              <br />
              Belastungsprotokoll (DailyCheck App)
              <br />
              Pausenstruktur (2 kurze Pausen/Tag)
              <br />
              Medikamenten weiterführen
              <br />
              Nächster Termin in 2 Wochen
            </>
          ),
        },
      ],
      template: {
        title: "Vorlage",
        body: (
          <>
            <span className="font-semibold">Verlaufseintrag</span>
            <br />
            <span className="font-semibold">Datum:</span> {"{{DATE}}"}
            <br />
            <span className="font-semibold">Patient:</span> {"{{PATIENT}}"}
            <br />
            <span className="font-semibold">Anlass / Fokus:</span>
            <br />
            - {"{{FOCUS}}"}
            <br />
            <span className="font-semibold">Psychostatus (kurz):</span>
            <br />
            - {"{{PSYCHOSTATUS}}"}
            <br />
            <span className="font-semibold">Verlauf / Inhalt:</span>
            <br />
            {"{{TRANSCRIPT}}"}
            <br />
            <span className="font-semibold">Beurteilung:</span>
            <br />
            - {"{{ASSESSMENT}}"}
            <br />
            <span className="font-semibold">Plan:</span>
            <br />
            - {"{{PLAN}}"}
          </>
        ),
      },
    },
    comparison: {
      title: "Vorher vs. Nachher",
      subtitle: "Kurz, klar, ohne Zusatzaufwand.",
      beforeTitle: "Vorher",
      beforeItems: ["Unstrukturierte Notizen", "Abends Berichte schreiben", "Copy/paste Chaos"],
      afterTitle: "Nachher",
      afterItems: ["Strukturierter Entwurf", "5-10 Min. Nacharbeit", "In Ihre Vorlage kopiert"],
    },
    whatItDoes: {
      title: "Was es tut",
      subtitle: "Absichtlich einfach: schneller Entwurfs-Workflow mit klaren Grenzen.",
      cards: [
        {
          title: "Diktieren oder Audio hochladen",
          body: "Nach der Sitzung aufnehmen oder Audio hochladen. (Upload kann später ergänzt werden.)",
        },
        {
          title: "Klinische Vorlage wählen",
          body: "Verwenden Sie Ihr bevorzugtes Format (z. B. Verlaufseintrag, Erstgespräch, Bericht / Arztbrief, Freie Notiz).",
        },
        {
          title: "Temporärer Textarbeitsbereich",
          body:
            "Text wird nicht gespeichert. Er verschwindet beim Schließen der Seite oder beim Start einer neuen Diktation. Sie kopieren ihn manuell in Ihr Dokumentationssystem.",
        },
      ],
    },
    preview: {
      title: "Was Sie bekommen",
      subtitle: "Ein strukturierter Entwurf, sofort nutzbar in Ihrer Vorlage.",
      leftTitle: "Input",
      leftBody:
        "„Verlaufseintrag heute. Patient M.K., pünktlich erschienen. Berichtet seit letzter Sitzung zunehmende Belastung am Arbeitsplatz, fühlt sich unter Druck und stark bewertet. Abends ausgeprägtes Grübeln, kann nicht abschalten. Schlaf reduziert mit nächtlichem Erwachen, morgens erschöpft. Stimmung gedrückt und angespannt (so berichtet im DailyCheck Protokoll-App). Suizidgedanken verneint, kein Plan. Keine Hinweise auf psychotische Symptome. Wir haben Stressmanagement, Pausenstruktur und Abgrenzung besprochen. Hausaufgabe: Belastungsprotokoll (DailyCheck App) und täglich zwei kurze Pausen einplanen. Medikamenten so belassen. Nächster Termin in zwei Wochen.“",
      rightTitle: "Output",
      rightBody: (
        <>
          <span className="font-semibold">Verlaufseintrag</span>
          <br />
          <br />
          <span className="font-semibold">Datum:</span> 17.01.2026
          <br />
          <span className="font-semibold">Patient:</span> M.K.
          <br />
          <br />
          <span className="font-semibold">Anlass / Fokus:</span>
          <br />
          Arbeitsbezogene Belastung, Grübelneigung, Schlafstörung, innere Anspannung
          <br />
          <br />
          <span className="font-semibold">Psychostatus:</span>
          <br />
          wach, allseits orientiert; Stimmung dysphor/angespannt; Affekt niedergeschlagen;
          formal geordnet; inhaltlich Grübeln; unruhig; keine Wahnsymptomatik; Suizidalität
          verneint. Wirkt Absprache fähig.
          <br />
          <br />
          <span className="font-semibold">Verlauf / Inhalt:</span>
          <br />
          Patient pünktlich erschienen. Seit letzter Sitzung zunehmende Belastung im
          Arbeitskontext mit subjektivem Druck- und Bewertungsgefühl. Abends ausgeprägtes
          Grübeln, vermindertes Abschalten. Schlaf beeinträchtigt mit nächtlichem Erwachen,
          morgendlicher Erschöpfung. Stimmung gedrückt und angespannt. Suizidalität verneint,
          kein Hinweis auf psychotische Symptome. Intervention: Stressmanagement,
          Pausenstruktur und Abgrenzung thematisiert.
          <br />
          <br />
          <span className="font-semibold">Beurteilung:</span>
          <br />
          Aktuelle stressassoziierte Symptomzunahme (Anspannung/Grübeln/Schlaf), keine akute
          Eigen- oder Fremdgefährdung
          <br />
          <br />
          <span className="font-semibold">Plan:</span>
          <br />
          Belastungsprotokoll (DailyCheck App)
          <br />
          Pausenstruktur (2 kurze Pausen/Tag)
          <br />
          Medikamenten weiterführen
          <br />
          Nächster Termin in 2 Wochen
        </>
      ),
      note: "Nur Beispiel. Psychiater*innen prüfen und bearbeiten vor Nutzung.",
    },
    why: {
      title: "Warum Psychiater*innen es nutzen",
      subtitle: "Weniger Abend-Admin, mehr therapeutische Präsenz.",
      items: [
        "Strukturierter Entwurf im klinischen Format",
        "Ihr Stil bleibt erhalten (Sie bearbeiten den Entwurf)",
        "Weniger Abend- und Wochenend-Admin",
      ],
    },
    framing: {
      title: "Praktische Einordnung",
      body:
        "Wenn Dokumentation 45-90 Minuten pro Tag kostet, sind das 15-30 Stunden pro Monat. Dieses Produkt ist dafür gedacht, einen spürbaren Teil dieser Zeit zurückzugeben.",
      note: "Die tatsächliche Zeitersparnis variiert je nach Workflow, Vorlagenkomplexität und Audioqualität.",
    },
    testimonials: {
      title: "Stimmen aus der Praxis",
      clinicianTitle: "Therapeuten- und Psychiaterstimmen",
      patientTitle: "Patientenstimmen",
      clinician: [
        {
          quote: "Es hat meine mentale Last deutlich reduziert.",
          detail:
            "Dokumentation war immer im Hinterkopf. Jetzt ist es viel weniger stressig, und ich bin präsenter mit Patienten.",
          meta: "Psychotherapeutin, Ambulanz",
        },
        {
          quote: "Die Struktur ist genau so, wie ich schreibe.",
          detail:
            "Ich war überrascht, wie gut sich das System an meinen Berichtsstil anpasst. Ich habe nicht das Gefühl, gegen den Text zu kämpfen.",
          meta: "Facharzt Psychiatrie, Praxis",
        },
        {
          quote: "Ich war skeptisch gegenüber KI - das fühlt sich anders an.",
          detail:
            "Es sagt mir nicht, was ich denken soll. Es hilft mir nur, schneller zu schreiben. Genau das wollte ich.",
          meta: "Assistenzarzt Psychiatrie, Akutstation",
        },
        {
          quote: "Es geht nicht nur um Zeit - sondern um Energie.",
          detail:
            "Am Ende des Tages habe ich noch mentale Energie. Das ist der echte Vorteil.",
          meta: "Klinik (NRW), 120 Betten",
        },
        {
          quote: "Ich schließe meine Berichte jetzt am selben Tag ab.",
          detail:
            "Was früher abends 30-40 Minuten dauerte, sind jetzt 5-10 Minuten. Ich diktiere, prüfe, fertig.",
          meta: "Oberarzt Psychiatrie, Tagesklinik",
        },
      ],
      patient: [
        {
          quote: "Meine Therapeutin wirkt präsenter.",
          detail:
            "Es gibt weniger Tippen und weniger Ablenkung. Die Sitzungen fühlen sich fokussierter an.",
          meta: "Patient, ambulant",
        },
        {
          quote: "Ich war anfangs wegen der Aufnahme unsicher.",
          detail:
            "Es wurde klar erklärt, und zu wissen, dass die Audio gelöscht wird, hat mich beruhigt.",
          meta: "Patientin, Therapie",
        },
        {
          quote: "Es wirkt professioneller.",
          detail: "Meine Berichte sind klarer und strukturierter als vorher.",
          meta: "Patient, Tagesklinik",
        },
        {
          quote: "Ich mag, dass die Therapeutin die Kontrolle behält.",
          detail: "Nichts läuft automatisch. Alles wird geprüft und erklärt.",
          meta: "Patientin, ambulant",
        },
        {
          quote: "Es fühlt sich nach verantwortungsvoller Technik an.",
          detail: "Nicht flashy - einfach hilfreich.",
          meta: "Patient, Psychotherapie",
        },
      ],
      closing: "Kurze Eindrücke aus Klinik und Praxis.",
      moreLabel: "Mehr lesen",
      lessLabel: "Weniger anzeigen",
    },
    fit: {
      forTitle: "Für wen es ist",
      forItems: [
        "Psychiater und Psychotherapeuten",
        "Ambulante Kliniken und Privatpraxen",
        "Psychiater*innen, die Struktur wollen, ohne Kontrolle zu verlieren",
      ],
      notTitle: "Für wen es nicht ist",
      notItems: [
        "Patienten (kein Patientenlogin)",
        "Risikowarnungen, Monitoring, kontinuierliche Patientendaten",
        "Diagnosen, Scores, Vorhersagen oder Behandlungsempfehlungen",
      ],
    },
    patients: {
      title: "Informationen für Patienten",
      body:
        "Ihr Behandler kann einen Dokumentationsassistenten nutzen, um administrative Arbeit zu reduzieren. Das unterstützt strukturierte medizinische Notizen und ersetzt keine Psychiater*innen.",
      items: [
        "Audio wird nur zur Erstellung eines Entwurfs verwendet und sollte nach der Transkription gelöscht werden.",
        "Psychiater*innen prüfen, bearbeiten und genehmigen alle Dokumente.",
        "Keine automatisierten Diagnosen oder Behandlungsempfehlungen.",
      ],
    },
    privacy: {
      title: "Datenschutz & Vertrauen",
      subtitle: "Kurze Antworten auf die wichtigsten Fragen.",
      cards: [
        {
          title: "Audio-Handling",
          body: "Audio wird nur für die Transkription genutzt und danach gelöscht (empfohlen).",
        },
        {
          title: "Entwurf statt Automatik",
          body: "Ausgabe ist ein Entwurf. Sie prüfen, bearbeiten und übernehmen.",
        },
        {
          title: "Nicht gespeichert",
          body: "Text wird nicht gespeichert und dient nur als Entwurf.",
        },
      ],
      linkLabel: "Datenschutz & FAQ lesen",
    },
    compliance: {
      title: "Compliance posture",
      subtitle: "Klarer Rahmen ohne medizinische Entscheidungsautomatisierung.",
      items: [
        "Dokumentationsassistent",
        "Psychiater*innen-kontrolliert",
        "Keine automatisierten klinischen Entscheidungen",
        "Für Vertraulichkeit und professionelle Verantwortung entwickelt",
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Ist das ein Patientenportal?",
          a: "Nein. Die Plattform ist nur für Psychiater*innen und fokussiert auf Dokumentationsentwürfe.",
        },
        {
          q: "Diagnostiziert oder empfiehlt es Behandlungen?",
          a: "Nein. Es ist nur ein Dokumentationsassistent. Psychiater*innen bleiben für klinische Entscheidungen verantwortlich.",
        },
        {
          q: "Muss ich Patientendaten hier speichern?",
          a: "Nein. Der beabsichtigte Workflow ist ein temporärer Entwurfsbereich: Sie kopieren in Ihr eigenes System.",
        },
      ],
    },
    finalCta: {
      title: "Pilotzugang für Psychiater*innen",
      body:
        "Fordern Sie Zugang an und testen Sie den Workflow mit Ihrer eigenen Vorlage.",
      primary: "Early Access",
      secondary: "Demo öffnen",
      note: "",
      asideTitle: "Pilot-Setup in 3 Punkten",
      asideItems: [
        "Eine primäre Vorlage (z. B. Verlaufseintrag)",
        "Gewünschter Ton (klinisch / neutral / narrativ)",
        "Klare Datenhandhabung (Audio nach der Transkription löschen)",
      ],
    },
  },
  en: {
    hero: {
      titleLine1: "Finish clinical documentation",
      titleLine2: "in minutes, not evenings.",
      imageAlt: "Therapy session with note taking",
      subtitle:
        "A documentation assistant for psychiatry and psychotherapy. Dictate or upload audio, get a structured draft in your template, review it, then copy.",
      badges: [
        "No diagnoses / no treatment recommendations",
        "Clinician remains responsible",
        "Audio deleted after transcription (recommended)",
      ],
      ctas: {
        primary: "Early Access",
        secondary: "Open demo",
        login: "Login / Sign in",
      },
      ltdNote: "LTD: one-time early access offer, not repeated.",
      disclaimer: "Documentation assistant only. Not a patient portal. No decision automation.",
    },
    workflow: {
      title: "How it works",
      subtitle: "Three clean steps, no detours.",
      steps: ["Dictate or upload audio", "Choose your template", "Review, copy, done"],
      designedLabel: "Designed for",
      designedBody:
        "Psychiatrists and psychotherapists who want faster, structured notes without losing clinical control.",
    },
    productPreview: {
      title: "What it looks like",
      subtitle: "Neutral flow: input in, structured draft out.",
      cards: [
        {
          title: "Input",
          body: "Dictate or upload audio.",
        },
        {
          title: "Output",
          body: "Structured draft in clinical format.",
        },
      ],
      template: {
        title: "Template",
        body: (
          <>
            <span className="font-semibold">Progress note</span>
            <br />
            <br />
            <span className="font-semibold">Date:</span> {"{{DATE}}"}
            <br />
            <span className="font-semibold">Patient:</span> {"{{PATIENT}}"}
            <br />
            <br />
            <span className="font-semibold">Reason / Focus:</span>
            <br />
            - {"{{FOCUS}}"}
            <br />
            <br />
            <span className="font-semibold">Mental status (brief):</span>
            <br />
            - {"{{PSYCHOSTATUS}}"}
            <br />
            <br />
            <span className="font-semibold">Course / Content:</span>
            <br />
            {"{{TRANSCRIPT}}"}
            <br />
            <br />
            <span className="font-semibold">Assessment:</span>
            <br />
            - {"{{ASSESSMENT}}"}
            <br />
            <br />
            <span className="font-semibold">Plan:</span>
            <br />
            - {"{{PLAN}}"}
          </>
        ),
      },
    },
    comparison: {
      title: "Before vs after",
      subtitle: "Short, clear, no extra admin.",
      beforeTitle: "Before",
      beforeItems: ["Unstructured notes", "Evening report writing", "Copy/paste chaos"],
      afterTitle: "After",
      afterItems: ["Structured draft", "5-10 min. polish", "Copied into your template"],
    },
    whatItDoes: {
      title: "What it does",
      subtitle: "Simple on purpose: a fast draft workflow, with clear boundaries.",
      cards: [
        {
          title: "Dictate or upload audio",
          body: "Record after a session, or upload audio when needed. (Upload can be added after dictation is stable.)",
        },
        {
          title: "Choose your clinical template",
          body: "Use your preferred format (e.g., progress note, intake, report, letter).",
        },
        {
          title: "Temporary text workspace",
          body:
            "Text is not saved. It disappears when you close the page or start a new dictation. You copy it manually into your preferred documentation system.",
        },
      ],
    },
    preview: {
      title: "What you get",
      subtitle: "A structured draft you can use immediately in your template.",
      leftTitle: "Your dictation (example)",
      leftBody:
        "Patient reports more anxiety since last week, especially evenings. Sleep onset worse. No suicidal intent. Coping strategies agreed.",
      rightTitle: "Structured draft (example)",
      rightBody:
        "Progress note\n\nDate: 2026-01-17\nPatient: (initials / pseudonym)\n\nReason / Focus:\n- Evening anxiety; sleep-onset issues\n\nMental status (brief):\n- Tense affect; no acute self-harm risk\n\nPlan:\n- Daily short grounding exercise; review next visit",
      note: "Example only. Clinician reviews and edits before using.",
    },
    why: {
      title: "Why clinicians use it",
      subtitle: "Less after-hours admin, more clinical presence.",
      items: [
        "Structured draft in clinical format",
        "Your style stays intact (you edit the draft)",
        "Less evening and weekend admin",
      ],
    },
    framing: {
      title: "A practical framing",
      body:
        "If documentation costs 45-90 minutes per day, that is 15-30 hours per month. This product is designed to give a meaningful part of that time back.",
      note: "Actual time savings vary by workflow, template complexity, and audio quality.",
    },
    testimonials: {
      title: "Testimonials",
      clinicianTitle: "Therapist / Psychiatrist testimonials",
      patientTitle: "Patient testimonials",
      clinician: [
        {
          quote: "I finish my reports on the same day now.",
          detail:
            "What used to take me 30-40 minutes in the evening now takes 5-10 minutes. I dictate, review, and I'm done.",
          meta: "Psychiatry resident, acute ward",
        },
        {
          quote: "It reduced my mental load significantly.",
          detail:
            "Documentation was always in the back of my mind. Now it's much less stressful, and I'm more present with patients.",
          meta: "Psychotherapist, outpatient",
        },
        {
          quote: "The structure is exactly how I write.",
          detail:
            "I was surprised how well the system adapts to my report style. I don't feel like I'm fighting the text.",
          meta: "Consultant psychiatrist, clinic",
        },
        {
          quote: "I was skeptical about AI - this feels different.",
          detail:
            "It doesn't tell me what to think. It just helps me write faster. That's all I wanted.",
          meta: "Psychiatrist, private practice",
        },
        {
          quote: "It's not about saving time - it's about energy.",
          detail:
            "At the end of the day, I still have mental energy left. That's the real benefit.",
          meta: "Clinic (NRW), 120 beds",
        },
      ],
      patient: [
        {
          quote: "My therapist seems more present.",
          detail:
            "There's less typing and less distraction. The sessions feel more focused.",
          meta: "Patient, outpatient",
        },
        {
          quote: "I was worried about recording at first.",
          detail:
            "It was explained clearly, and knowing the audio is deleted helped me feel comfortable.",
          meta: "Patient, therapy",
        },
        {
          quote: "It feels more professional.",
          detail: "My reports are clearer and more structured than before.",
          meta: "Patient, day clinic",
        },
        {
          quote: "I like that the therapist stays in control.",
          detail: "Nothing is automatic. Everything is reviewed and explained.",
          meta: "Patient, outpatient",
        },
        {
          quote: "It feels like technology used responsibly.",
          detail: "Not flashy - just helpful.",
          meta: "Patient, psychotherapy",
        },
      ],
      closing: "Short impressions from clinic and practice.",
      moreLabel: "Read more",
      lessLabel: "Show less",
    },
    fit: {
      forTitle: "Who it's for",
      forItems: [
        "Psychiatrists and psychotherapists",
        "Outpatient clinics and private practices",
        "Clinicians who want structure without losing control",
      ],
      notTitle: "Who it's not for",
      notItems: [
        "Patients (no patient login)",
        "Risk alerts, monitoring, continuous patient data feeds",
        "Diagnosis, scoring, predictions, or treatment recommendations",
      ],
    },
    patients: {
      title: "Information for patients",
      body:
        "Your clinician may use a documentation assistant to reduce time spent on administrative work. This supports structured medical notes and does not replace the clinician.",
      items: [
        "Audio is used only to create a draft note and should be deleted after transcription.",
        "The clinician reviews, edits, and approves all documentation.",
        "No automated diagnoses or treatment decisions are produced.",
      ],
    },
    privacy: {
      title: "Privacy & trust",
      subtitle: "Short answers to the most important questions.",
      cards: [
        {
          title: "Audio handling",
          body: "Audio is used only for transcription and deleted afterward (recommended).",
        },
        {
          title: "Draft, not automation",
          body: "Output is a draft. You review, edit, and use it.",
        },
        {
          title: "Not stored",
          body: "Draft text is not stored and is used only as a draft.",
        },
      ],
      linkLabel: "Read privacy & FAQ",
    },
    compliance: {
      title: "Compliance posture",
      subtitle: "Clear posture without medical-device claims.",
      items: [
        "Documentation assistant",
        "Clinician controlled",
        "No automated clinical decisions",
        "Designed for confidentiality and professional responsibility",
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Is this a patient portal?",
          a: "No. This platform is clinician-only and focuses on documentation drafts.",
        },
        {
          q: "Does it diagnose or recommend treatment?",
          a: "No. It is a documentation assistant only. Clinicians remain responsible for clinical decisions.",
        },
        {
          q: "Do I have to store patient data here?",
          a: "No. The intended workflow is a temporary draft workspace: you copy-paste into your own system.",
        },
      ],
    },
    finalCta: {
      title: "Pilot access for clinicians",
      body:
        "Request access and test the workflow with your own template.",
      primary: "Early Access",
      secondary: "Open demo",
      note: "",
      asideTitle: "Pilot setup in 3 points",
      asideItems: [
        "One primary template (e.g., progress note)",
        "Preferred tone (clinical / neutral / narrative)",
        "Clear data handling preferences (delete audio after transcription)",
      ],
    },
  },
  it: {
    hero: {
      titleLine1: "Completa la documentazione clinica",
      titleLine2: "in minuti, non di sera.",
      imageAlt: "Seduta di terapia con appunti",
      subtitle:
        "Un assistente di documentazione per psichiatria e psicoterapia. Detti o carichi audio, ottieni una bozza strutturata nel tuo modello, la rivedi e poi la copi.",
      badges: [
        "Nessuna diagnosi / nessun consiglio terapeutico",
        "Il clinico resta responsabile",
        "Audio eliminato dopo la trascrizione (consigliato)",
      ],
      ctas: {
        primary: "Early Access",
        secondary: "Apri demo",
        login: "Login / Sign in",
      },
      ltdNote: "LTD: offerta di early access una sola volta, non ripetuta.",
      disclaimer: "Solo assistente di documentazione. Non è un portale pazienti. Nessun automatismo decisionale.",
    },
    workflow: {
      title: "Come funziona",
      subtitle: "Tre step chiari, senza deviazioni.",
      steps: ["Detta o carica audio", "Scegli il modello", "Rivedi, copia, fatto"],
      designedLabel: "Progettato per",
      designedBody:
        "Psichiatri e psicoterapeuti che vogliono note strutturate più rapide senza perdere il controllo clinico.",
    },
    productPreview: {
      title: "Come appare",
      subtitle: "Flusso neutro: input dentro, bozza strutturata fuori.",
      cards: [
        {
          title: "Input",
          body: "Detta o carica audio.",
        },
        {
          title: "Output",
          body: "Bozza strutturata in formato clinico.",
        },
      ],
      template: {
        title: "Modello",
        body: (
          <>
            <span className="font-semibold">Nota di andamento</span>
            <br />
            <br />
            <span className="font-semibold">Data:</span> {"{{DATE}}"}
            <br />
            <span className="font-semibold">Paziente:</span> {"{{PATIENT}}"}
            <br />
            <br />
            <span className="font-semibold">Motivo / Focus:</span>
            <br />
            - {"{{FOCUS}}"}
            <br />
            <br />
            <span className="font-semibold">Psicostatus (breve):</span>
            <br />
            - {"{{PSYCHOSTATUS}}"}
            <br />
            <br />
            <span className="font-semibold">Decorso / Contenuto:</span>
            <br />
            {"{{TRANSCRIPT}}"}
            <br />
            <br />
            <span className="font-semibold">Valutazione:</span>
            <br />
            - {"{{ASSESSMENT}}"}
            <br />
            <br />
            <span className="font-semibold">Piano:</span>
            <br />
            - {"{{PLAN}}"}
          </>
        ),
      },
    },
    comparison: {
      title: "Prima vs dopo",
      subtitle: "Breve, chiaro, senza extra.",
      beforeTitle: "Prima",
      beforeItems: ["Note non strutturate", "Report serali", "Caos copia/incolla"],
      afterTitle: "Dopo",
      afterItems: ["Bozza strutturata", "5-10 min. di revisione", "Copiato nel tuo modello"],
    },
    whatItDoes: {
      title: "Cosa fa",
      subtitle: "Semplice di proposito: bozza veloce con confini chiari.",
      cards: [
        {
          title: "Detta o carica audio",
          body: "Registra dopo la seduta o carica l'audio quando serve. (L'upload può essere aggiunto dopo.)",
        },
        {
          title: "Scegli il tuo modello clinico",
          body: "Usa il formato che preferisci (es. nota di decorso, primo colloquio, rapporto, lettera).",
        },
        {
          title: "Spazio di lavoro temporaneo",
          body:
            "Il testo non viene salvato. Scompare quando chiudi la pagina o inizi una nuova dettatura. Lo copi nel tuo sistema.",
        },
      ],
    },
    preview: {
      title: "Cosa ottieni",
      subtitle: "Una bozza strutturata da usare subito nel tuo modello.",
      leftTitle: "Il tuo dettato (esempio)",
      leftBody:
        "Il paziente riferisce più ansia dalla scorsa settimana, soprattutto la sera. Peggiorato l'addormentamento. Nessuna intenzione suicidaria. Strategie di coping concordate.",
      rightTitle: "Bozza strutturata (esempio)",
      rightBody:
        "Nota di decorso\n\nData: 2026-01-17\nPaziente: (iniziali / pseudonimo)\n\nMotivo / Focus:\n- Ansia serale; difficoltà di addormentamento\n\nStato mentale (breve):\n- Affetto teso; nessun rischio acuto\n\nPiano:\n- Esercizio di grounding quotidiano; verifica al prossimo incontro",
      note: "Solo esempio. Il clinico rivede e modifica prima dell'uso.",
    },
    why: {
      title: "Perché i professionisti lo usano",
      subtitle: "Meno admin serale, più presenza clinica.",
      items: [
        "Bozza strutturata in formato clinico",
        "Il tuo stile resta intatto (modifichi la bozza)",
        "Meno admin serale e nel weekend",
      ],
    },
    framing: {
      title: "Inquadramento pratico",
      body:
        "Se la documentazione costa 45-90 minuti al giorno, sono 15-30 ore al mese. Questo prodotto è progettato per restituirne una parte significativa.",
      note: "Il risparmio reale varia per workflow, complessità del modello e qualità audio.",
    },
    testimonials: {
      title: "Testimonianze",
      clinicianTitle: "Testimonianze terapeuti / psichiatri",
      patientTitle: "Testimonianze pazienti",
      clinician: [
        {
          quote: "Finisco i miei report lo stesso giorno.",
          detail:
            "Quello che prima richiedeva 30-40 minuti la sera ora richiede 5-10 minuti. Detto, rivedo, fatto.",
          meta: "Specializzando psichiatria, reparto acuto",
        },
        {
          quote: "Ha ridotto molto il mio carico mentale.",
          detail:
            "La documentazione era sempre sullo sfondo. Ora è molto meno stressante e sono più presente con i pazienti.",
          meta: "Psicoterapeuta, ambulatorio",
        },
        {
          quote: "La struttura è esattamente come scrivo.",
          detail:
            "Mi ha sorpreso quanto bene il sistema si adatti al mio stile di report. Non ho la sensazione di lottare con il testo.",
          meta: "Psichiatra, clinica",
        },
        {
          quote: "Ero scettico sull'AI - questo è diverso.",
          detail:
            "Non mi dice cosa pensare. Mi aiuta solo a scrivere più in fretta. Era tutto quello che volevo.",
          meta: "Psichiatra, studio privato",
        },
        {
          quote: "Non è solo questione di tempo - è energia.",
          detail:
            "A fine giornata ho ancora energia mentale. Questo è il vero beneficio.",
          meta: "Clinica (NRW), 120 posti letto",
        },
      ],
      patient: [
        {
          quote: "Il mio terapeuta sembra più presente.",
          detail:
            "Meno digitazione e meno distrazioni. Le sedute sono più focalizzate.",
          meta: "Paziente, ambulatoriale",
        },
        {
          quote: "All'inizio ero preoccupato per la registrazione.",
          detail:
            "Mi è stato spiegato chiaramente e sapere che l'audio viene eliminato mi ha fatto sentire a mio agio.",
          meta: "Paziente, terapia",
        },
        {
          quote: "Sembra più professionale.",
          detail: "I miei report sono più chiari e più strutturati di prima.",
          meta: "Paziente, day clinic",
        },
        {
          quote: "Mi piace che il terapeuta resti al comando.",
          detail: "Niente è automatico. Tutto viene rivisto e spiegato.",
          meta: "Paziente, ambulatoriale",
        },
        {
          quote: "Sembra tecnologia usata con responsabilità.",
          detail: "Non appariscente - solo utile.",
          meta: "Paziente, psicoterapia",
        },
      ],
      closing: "Brevi impressioni da cliniche e ambulatori.",
      moreLabel: "Leggi di piu",
      lessLabel: "Mostra meno",
    },
    fit: {
      forTitle: "Per chi è",
      forItems: [
        "Psichiatri e psicoterapeuti",
        "Cliniche ambulatoriali e studi privati",
        "Professionisti che vogliono struttura senza perdere controllo",
      ],
      notTitle: "Per chi non è",
      notItems: [
        "Pazienti (nessun login paziente)",
        "Alert di rischio, monitoraggio continuo, feed di dati",
        "Diagnosi, punteggi, previsioni o raccomandazioni di trattamento",
      ],
    },
    patients: {
      title: "Informazioni per i pazienti",
      body:
        "Il tuo clinico può usare un assistente di documentazione per ridurre il tempo amministrativo. Questo supporta note strutturate e non sostituisce il clinico.",
      items: [
        "L'audio è usato solo per creare una bozza e dovrebbe essere eliminato dopo la trascrizione.",
        "Il clinico rivede, modifica e approva tutta la documentazione.",
        "Nessuna diagnosi o decisione terapeutica automatizzata.",
      ],
    },
    privacy: {
      title: "Privacy e fiducia",
      subtitle: "Risposte brevi alle domande chiave.",
      cards: [
        {
          title: "Gestione dell'audio",
          body: "Audio usato solo per la trascrizione e poi eliminato (consigliato).",
        },
        {
          title: "Bozza, non automazione",
          body: "L'output è una bozza. Rivedi, modifichi, usi.",
        },
        {
          title: "Non salvato",
          body: "Il testo non viene salvato e serve solo come bozza.",
        },
      ],
      linkLabel: "Leggi privacy & FAQ",
    },
    compliance: {
      title: "Posizionamento compliance",
      subtitle: "Postura chiara senza rivendicazioni da dispositivo medico.",
      items: [
        "Assistente di documentazione",
        "Controllato dal clinico",
        "Nessuna decisione clinica automatizzata",
        "Progettato per riservatezza e responsabilità professionale",
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "È un portale pazienti?",
          a: "No. La piattaforma è solo per professionisti e si concentra sulle bozze di documentazione.",
        },
        {
          q: "Diagnostica o raccomanda trattamenti?",
          a: "No. È solo un assistente di documentazione. I professionisti restano responsabili delle decisioni.",
        },
        {
          q: "Devo archiviare qui i dati dei pazienti?",
          a: "No. Il flusso previsto è temporaneo: copi e incolli nel tuo sistema.",
        },
      ],
    },
    finalCta: {
      title: "Accesso pilota per professionisti",
      body:
        "Richiedi accesso e prova il flusso con il tuo modello.",
      primary: "Early Access",
      secondary: "Apri demo",
      note: "",
      asideTitle: "Setup pilota in 3 punti",
      asideItems: [
        "Un modello principale (es. nota di decorso)",
        "Tono preferito (clinico / neutro / narrativo)",
        "Preferenze chiare sui dati (eliminare audio dopo trascrizione)",
      ],
    },
  },
  fr: {
    hero: {
      titleLine1: "Terminez la documentation clinique",
      titleLine2: "en minutes, pas le soir.",
      imageAlt: "Seance de therapie avec prise de notes",
      subtitle:
        "Un assistant de documentation pour psychiatrie et psychothérapie. Vous dictez ou importez l'audio, obtenez un brouillon structuré dans votre modèle, puis vous relisez et copiez.",
      badges: [
        "Pas de diagnostic / pas de recommandation thérapeutique",
        "Le clinicien reste responsable",
        "Audio supprimé après transcription (recommandé)",
      ],
      ctas: {
        primary: "Early Access",
        secondary: "Ouvrir la démo",
        login: "Login / Sign in",
      },
      ltdNote: "LTD : offre early access unique, non reconduite.",
      disclaimer: "Assistant de documentation uniquement. Pas de portail patient. Pas d'automatisation de décision.",
    },
    workflow: {
      title: "Comment ça marche",
      subtitle: "Trois étapes nettes, sans détour.",
      steps: ["Dicter ou importer l'audio", "Choisir votre modèle", "Relire, copier, terminé"],
      designedLabel: "Conçu pour",
      designedBody:
        "Psychiatres et psychothérapeutes qui veulent des notes structurées plus rapides sans perdre le contrôle clinique.",
    },
    productPreview: {
      title: "Aperçu",
      subtitle: "Flux neutre : entree, brouillon structure en sortie.",
      cards: [
        {
          title: "Input",
          body: "Dicter ou importer l'audio.",
        },
        {
          title: "Output",
          body: "Brouillon structuré au format clinique.",
        },
      ],
      template: {
        title: "Modèle",
        body: (
          <>
            <span className="font-semibold">Note d'evolution</span>
            <br />
            <br />
            <span className="font-semibold">Date :</span> {"{{DATE}}"}
            <br />
            <span className="font-semibold">Patient :</span> {"{{PATIENT}}"}
            <br />
            <br />
            <span className="font-semibold">Motif / Focus :</span>
            <br />
            - {"{{FOCUS}}"}
            <br />
            <br />
            <span className="font-semibold">Etat mental (bref) :</span>
            <br />
            - {"{{PSYCHOSTATUS}}"}
            <br />
            <br />
            <span className="font-semibold">Deroulement / Contenu :</span>
            <br />
            {"{{TRANSCRIPT}}"}
            <br />
            <br />
            <span className="font-semibold">Evaluation :</span>
            <br />
            - {"{{ASSESSMENT}}"}
            <br />
            <br />
            <span className="font-semibold">Plan :</span>
            <br />
            - {"{{PLAN}}"}
          </>
        ),
      },
    },
    comparison: {
      title: "Avant vs apres",
      subtitle: "Court, clair, sans surcharge.",
      beforeTitle: "Avant",
      beforeItems: ["Notes non structurées", "Rapports le soir", "Chaos copier/coller"],
      afterTitle: "Apres",
      afterItems: ["Brouillon structuré", "5-10 min. de finition", "Copié dans votre modèle"],
    },
    whatItDoes: {
      title: "Ce que ça fait",
      subtitle: "Simple volontairement : un brouillon rapide avec des limites claires.",
      cards: [
        {
          title: "Dicter ou importer l'audio",
          body: "Enregistrez après une séance ou importez l'audio si besoin. (L'import peut être ajouté ensuite.)",
        },
        {
          title: "Choisir votre modèle clinique",
          body: "Utilisez le format préféré (ex. note d'évolution, première consultation, rapport, lettre).",
        },
        {
          title: "Espace de travail temporaire",
          body:
            "Le texte n'est pas sauvegardé. Il disparaît quand vous fermez la page ou démarrez une nouvelle dictée. Vous le copiez dans votre système.",
        },
      ],
    },
    preview: {
      title: "Ce que vous obtenez",
      subtitle: "Un brouillon structuré utilisable immediatement dans votre modele.",
      leftTitle: "Votre dictée (exemple)",
      leftBody:
        "Le patient rapporte plus d'anxiete depuis la semaine derniere, surtout le soir. Endormissement difficile. Aucune intention suicidaire. Strategies d'adaptation convenues.",
      rightTitle: "Brouillon structuré (exemple)",
      rightBody:
        "Note d'evolution\n\nDate: 2026-01-17\nPatient: (initiales / pseudonyme)\n\nMotif / Focus:\n- Anxiete du soir; difficultes d'endormissement\n\nEtat mental (bref):\n- Affect tendu; aucun risque aigu\n\nPlan:\n- Exercice de grounding quotidien; revue au prochain rendez-vous",
      note: "Exemple uniquement. Le clinicien relit et modifie avant usage.",
    },
    why: {
      title: "Pourquoi les cliniciens l'utilisent",
      subtitle: "Moins d'admin le soir, plus de presence clinique.",
      items: [
        "Brouillon structure au format clinique",
        "Votre style reste intact (vous modifiez le brouillon)",
        "Moins d'admin le soir et le week-end",
      ],
    },
    framing: {
      title: "Cadre pratique",
      body:
        "Si la documentation coûte 45-90 minutes par jour, cela fait 15-30 heures par mois. Ce produit est conçu pour rendre une partie significative de ce temps.",
      note: "Le gain réel varie selon le workflow, la complexité du modèle et la qualité audio.",
    },
    testimonials: {
      title: "Temoignages",
      clinicianTitle: "Temoignages therapeutes / psychiatres",
      patientTitle: "Temoignages patients",
      clinician: [
        {
          quote: "Je termine mes comptes rendus le jour meme.",
          detail:
            "Ce qui prenait 30-40 minutes le soir prend maintenant 5-10 minutes. Je dicte, je relis, et c'est fini.",
          meta: "Interne psychiatrie, unite aigue",
        },
        {
          quote: "Cela a fortement reduit ma charge mentale.",
          detail:
            "La documentation etait toujours en arriere-plan. Maintenant c'est beaucoup moins stressant et je suis plus present avec les patients.",
          meta: "Psychotherapeute, ambulatoire",
        },
        {
          quote: "La structure correspond exactement a ma facon d'ecrire.",
          detail:
            "J'ai ete surpris de la qualite d'adaptation a mon style. Je n'ai pas l'impression de me battre avec le texte.",
          meta: "Psychiatre, clinique",
        },
        {
          quote: "J'etais sceptique sur l'IA - cela semble different.",
          detail:
            "Cela ne me dit pas quoi penser. Ca m'aide juste a ecrire plus vite. C'est tout ce que je voulais.",
          meta: "Psychiatre, cabinet",
        },
        {
          quote: "Ce n'est pas seulement une question de temps - c'est l'energie.",
          detail:
            "A la fin de la journee, j'ai encore de l'energie mentale. C'est le vrai benefice.",
          meta: "Clinique (NRW), 120 lits",
        },
      ],
      patient: [
        {
          quote: "Mon therapeute semble plus present.",
          detail:
            "Moins de saisie, moins de distraction. Les seances paraissent plus concentrees.",
          meta: "Patient, ambulatoire",
        },
        {
          quote: "J'etais inquiet au debut a propos de l'enregistrement.",
          detail:
            "On me l'a explique clairement, et savoir que l'audio est supprime m'a rassure.",
          meta: "Patient, therapie",
        },
        {
          quote: "Cela semble plus professionnel.",
          detail:
            "Mes comptes rendus sont plus clairs et plus structures qu'avant.",
          meta: "Patient, hopital de jour",
        },
        {
          quote: "J'aime que le therapeute garde le controle.",
          detail: "Rien n'est automatique. Tout est relu et explique.",
          meta: "Patient, ambulatoire",
        },
        {
          quote: "Cela ressemble a une technologie utilisee de facon responsable.",
          detail: "Pas tape-a-l'oeil - juste utile.",
          meta: "Patient, psychotherapie",
        },
      ],
      closing: "Courts retours de clinique et de cabinet.",
      moreLabel: "Lire plus",
      lessLabel: "Voir moins",
    },
    fit: {
      forTitle: "Pour qui c'est",
      forItems: [
        "Psychiatres et psychothérapeutes",
        "Cliniques ambulatoires et cabinets privés",
        "Cliniciens qui veulent de la structure sans perdre le contrôle",
      ],
      notTitle: "Pour qui ce n'est pas",
      notItems: [
        "Patients (pas de login patient)",
        "Alertes de risque, monitoring, flux de données continus",
        "Diagnostics, scores, prédictions ou recommandations de traitement",
      ],
    },
    patients: {
      title: "Information pour les patients",
      body:
        "Votre clinicien peut utiliser un assistant de documentation pour réduire le temps administratif. Cela soutient des notes structurées sans remplacer le clinicien.",
      items: [
        "L'audio sert uniquement à créer un brouillon et doit être supprimé après transcription.",
        "Le clinicien relit, modifie et approuve toute la documentation.",
        "Aucun diagnostic ou décision thérapeutique automatisée.",
      ],
    },
    privacy: {
      title: "Confidentialité & confiance",
      subtitle: "Reponses courtes aux questions essentielles.",
      cards: [
        {
          title: "Gestion de l'audio",
          body: "Audio utilise uniquement pour la transcription puis supprime (recommande).",
        },
        {
          title: "Brouillon, pas automatisation",
          body: "La sortie est un brouillon. Vous relisez, modifiez, utilisez.",
        },
        {
          title: "Non stocke",
          body: "Le texte n'est pas stocke et sert uniquement de brouillon.",
        },
      ],
      linkLabel: "Lire confidentialité & FAQ",
    },
    compliance: {
      title: "Positionnement conformité",
      subtitle: "Posture claire sans revendications de dispositif médical.",
      items: [
        "Assistant de documentation",
        "Contrôlé par le clinicien",
        "Aucune décision clinique automatisée",
        "Conçu pour la confidentialité et la responsabilité professionnelle",
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Est-ce un portail patient ?",
          a: "Non. La plateforme est réservée aux cliniciens et centrée sur les brouillons de documentation.",
        },
        {
          q: "Est-ce que cela diagnostique ou recommande un traitement ?",
          a: "Non. C'est un assistant de documentation uniquement. Les cliniciens restent responsables des décisions.",
        },
        {
          q: "Dois-je stocker des données patient ici ?",
          a: "Non. Le flux prévu est temporaire : vous copiez-collez dans votre système.",
        },
      ],
    },
    finalCta: {
      title: "Accès pilote pour cliniciens",
      body:
        "Demandez l'acces et testez le flux avec votre modele.",
      primary: "Early Access",
      secondary: "Ouvrir la démo",
      note: "",
      asideTitle: "Mise en place pilote (3 points)",
      asideItems: [
        "Un modèle principal (ex. note d'évolution)",
        "Ton préféré (clinique / neutre / narratif)",
        "Préférences de données claires (supprimer l'audio après transcription)",
      ],
    },
  },
} as const;

function ArrowDown() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 48" className="h-10 w-6">
      <line x1="12" y1="4" x2="12" y2="38" stroke="currentColor" strokeWidth="2.25" />
      <polyline
        points="6,32 12,38 18,32"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 24" className="h-6 w-10">
      <line x1="4" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="2.25" />
      <polyline
        points="32,6 38,12 32,18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.de;
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const allTestimonials = [...t.testimonials.clinician, ...t.testimonials.patient];
  const socialProofItems = showAllTestimonials ? allTestimonials : allTestimonials.slice(0, 3);

  return (
    <div className="bg-[color:var(--background)]">
      <Section className="pt-12 md:pt-16">
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="tracking-tight text-center">
              <span className="block text-4xl font-semibold leading-[1.05] md:text-6xl">
                {t.hero.titleLine1}
              </span>
              <span className="block text-6xl font-bold leading-[1.03] md:text-7xl">
                {t.hero.titleLine2}
              </span>
            </h1>
            <SloganCarousel />
            <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-[32px] border border-gray-200">
              <Image
                src="/image.jpg"
                alt={t.hero.imageAlt}
                width={1200}
                height={700}
                className="w-full object-cover"
                priority
              />
            </div>
          </div>

          <p className="mx-auto max-w-5xl text-center text-base text-gray-700 md:text-lg md:leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-center text-sm text-gray-600">
            {t.hero.badges.map((badge) => (
              <span key={badge} className="rounded-full border bg-white px-4 py-1.5">
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <PrimaryButton href="/early-access" className="h-14 px-6 text-base">
              {t.hero.ctas.primary}
            </PrimaryButton>
            <SecondaryButton href="/demo-login" className="h-14 px-6 text-base">
              {t.hero.ctas.secondary}
            </SecondaryButton>
            <SecondaryButton href="/login" className="h-14 px-6 text-base">
              {t.hero.ctas.login}
            </SecondaryButton>
          </div>
        </div>
      </Section>

      <Section id="product-preview" className="pt-0">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-center">{t.productPreview.title}</h2>
            <p className="mx-auto max-w-2xl text-center text-sm text-gray-700 leading-relaxed">
              {t.productPreview.subtitle}
            </p>
          </div>

          <VoiceToTextDiagram className="rounded-3xl border border-black/5 shadow-sm" />

          <div className="grid gap-8 md:grid-cols-2 md:gap-12 md:items-stretch">
            <div className="grid h-full gap-4 md:grid-rows-[1fr_auto_1fr]">
              <Card className="flex h-full flex-col">
                <div className="text-xs font-semibold text-teal-700">
                  {t.productPreview.cards[0].title}
                </div>
                <div className="mt-3 flex-1 rounded-xl border bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {t.productPreview.cards[0].body}
                </div>
              </Card>

              <div className="flex justify-center text-teal-600">
                <ArrowDown />
              </div>

              <div className="relative">
                <Card className="flex h-full flex-col">
                  <div className="text-xs font-semibold text-teal-700">
                    {t.productPreview.template.title}
                  </div>
                  <div className="mt-3 flex-1 rounded-xl border bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {t.productPreview.template.body}
                  </div>
                </Card>

                <div className="pointer-events-none absolute right-[-52px] top-1/2 hidden -translate-y-1/2 text-teal-600 md:flex">
                  <ArrowRight />
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col gap-4">
              <div className="flex justify-center text-teal-600 md:hidden">
                <ArrowDown />
              </div>
              <Card className="flex h-full flex-col">
                <div className="text-xs font-semibold text-teal-700">
                  {t.productPreview.cards[1].title}
                </div>
                <div className="mt-3 flex-1 rounded-xl border bg-gray-50 p-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {t.productPreview.cards[1].body}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Section id="pricing" className="pt-0">
        <PricingSection />
      </Section>

      <Section id="social-proof" className="pt-0">
        <div className="rounded-[32px] border bg-white px-6 py-10 md:px-10">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-center">{t.testimonials.title}</h2>
              <p className="mx-auto max-w-2xl text-center text-sm text-gray-700 leading-relaxed">
                {t.testimonials.closing}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {socialProofItems.map((item) => (
                <QuoteCard
                  key={item.quote}
                  quote={item.quote}
                  detail={item.detail}
                  meta={item.meta}
                />
              ))}
            </div>

            {allTestimonials.length > 3 ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllTestimonials((prev) => !prev)}
                  className="text-sm font-semibold text-teal-700 hover:text-teal-800"
                >
                  {showAllTestimonials ? t.testimonials.lessLabel : t.testimonials.moreLabel}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Section>

      <Section id="final-cta">
        <Card className="rounded-3xl p-8">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-center">{t.finalCta.title}</h2>
              <p className="mx-auto max-w-2xl text-center text-sm text-gray-700 leading-relaxed">
                {t.finalCta.body}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryButton href="/early-access">{t.finalCta.primary}</PrimaryButton>
                <SecondaryButton href="/demo-login">{t.finalCta.secondary}</SecondaryButton>
              </div>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-6">
              <div className="text-sm font-semibold">{t.finalCta.asideTitle}</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
                {t.finalCta.asideItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </Section>

      <Section id="privacy">
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-center">{t.privacy.title}</h2>
            <p className="mx-auto max-w-2xl text-center text-sm text-gray-700 leading-relaxed">
              {t.privacy.subtitle}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {t.privacy.cards.map((card) => (
              <Card key={card.title}>
                <div className="text-base font-semibold">{card.title}</div>
                <p className="mt-2 text-sm text-gray-700">{card.body}</p>
              </Card>
            ))}
          </div>

          <div>
            <SecondaryButton href="/privacy">{t.privacy.linkLabel}</SecondaryButton>
          </div>
        </div>
      </Section>

      <Section className="pt-0 pb-16">
        <div className="text-center text-xs text-gray-500">{t.hero.disclaimer}</div>
      </Section>
    </div>
  );
}
