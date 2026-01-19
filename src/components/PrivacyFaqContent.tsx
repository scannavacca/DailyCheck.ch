"use client";

import { useLanguage } from "@/components/LanguageProvider";

type Qa = {
  q: string;
  paragraphs?: string[];
  list?: string[];
  after?: string;
};

type Section = {
  title: string;
  items: Qa[];
};

const copy = {
  de: {
    title: "Häufige Fragen (FAQ)",
    sections: [
      {
        title: "Allgemein",
        items: [
          {
            q: "Was ist dieses System?",
            paragraphs: [
              "Es ist ein digitaler Diktier- und Dokumentationsassistent für Psychiater und Therapeuten.",
              "Es hilft, gesprochene Informationen mithilfe professioneller Vorlagen in strukturierte medizinische Berichte zu überführen.",
              "Das System unterstützt die Dokumentation - es ersetzt nicht die klinische Beurteilung.",
            ],
          },
          {
            q: "Wodurch wird die Diktat-Aufnahme betrieben?",
            paragraphs: [
              "Die Live-Diktatfunktion wird durch OpenAI Speech-to-Text betrieben.",
              "Das Mikrofon-Audio wird fuer die Transkription an die OpenAI API gesendet.",
              "Audio wird nur fuer die Transkription verwendet und danach geloescht.",
            ],
          },
          {
            q: "Für wen ist es?",
            list: [
              "Psychiater",
              "Psychotherapeuten",
              "Fachpersonen der psychischen Gesundheit mit hohem Dokumentationsaufwand",
            ],
            after: "Patienten profitieren indirekt durch fokussiertere Sitzungen und weniger administrativen Aufwand.",
          },
          {
            q: "Trifft das System Diagnosen oder Therapieentscheidungen?",
            paragraphs: ["Nein.", "Das System:"],
            list: ["stellt keine Diagnosen", "empfiehlt keine Behandlungen", "trifft keine klinischen Entscheidungen"],
            after: "Die medizinische Verantwortung bleibt beim behandelnden Fachpersonal.",
          },
        ],
      },
      {
        title: "Für Patienten",
        items: [
          {
            q: "Warum nutzt mein Psychiater dieses System?",
            paragraphs: [
              "Um Zeit für Administration und Dokumentation zu reduzieren. Das erlaubt Ihrem Psychiater:",
            ],
            list: [
              "während der Sitzung fokussierter zu sein",
              "Berichte effizienter abzuschließen",
              "mehr Zeit und Energie für die Patientenversorgung zu haben",
            ],
          },
          {
            q: "Wird mein Gespräch aufgezeichnet?",
            paragraphs: ["Abhängig von der Nutzung:"],
            list: [
              "Manchmal wird nur das Diktat des Psychiaters verarbeitet",
              "In manchen Fällen können Teile des Gesprächs mit Einwilligung transkribiert werden",
              "Aufzeichnungen dienen nur der Erstellung korrekter medizinischer Dokumentation",
            ],
          },
          {
            q: "Was passiert mit den Audioaufnahmen?",
            list: [
              "Audio wird nur für die Transkription verwendet",
              "Audio wird nach der Transkription gelöscht",
              "Der finale Bericht wird vom Psychiater geprüft und freigegeben",
              "Kein Audio wird dauerhaft gespeichert",
            ],
          },
          {
            q: "Sind meine Daten sicher und vertraulich?",
            paragraphs: ["Ja."],
            list: [
              "Ärztliche Schweigepflicht gilt jederzeit",
              "Daten werden sicher verarbeitet",
              "Informationen werden nur für medizinische Dokumentation verwendet",
              "Daten werden nicht verkauft, wiederverwendet oder für andere Zwecke geteilt",
              "Das System folgt denselben Vertraulichkeitsprinzipien wie schriftliche Notizen oder klassische Diktate",
            ],
          },
          {
            q: "Kann ich die Einwilligung verweigern?",
            paragraphs: [
              "Ja. Wenn Sie keine Gesprächstranskription wünschen, können Sie das sagen.",
              "Ihr Psychiater kann die Sitzung weiterhin mit traditionellen Methoden dokumentieren.",
            ],
          },
        ],
      },
      {
        title: "Für Therapeuten & Psychiater",
        items: [
          {
            q: "Wie unterscheidet sich das von standardisierter Diktier-Software?",
            paragraphs: ["Standard-Diktier-Tools liefern Rohtext. Dieses System:"],
            list: [
              "nutzt psychiatrische Dokumentationsvorlagen",
              "erzeugt strukturierte klinische Sprache",
              "reduziert Zeit für Editieren und Umstrukturieren",
              "ist für mentale Gesundheits-Workflows gebaut",
            ],
          },
          {
            q: "Bleibe ich in Kontrolle über das finale Dokument?",
            paragraphs: ["Immer. Sie:"],
            list: [
              "prüfen jedes Dokument",
              "bearbeiten nach Bedarf",
              "geben die finale Version frei",
              "nichts wird ohne Ihre Aufsicht gespeichert oder geteilt",
            ],
          },
          {
            q: "Verbessert es die Dokumentationsqualität?",
            paragraphs: ["Viele Psychiater*innen berichten:"],
            list: [
              "vollständigere Notizen",
              "klarere Struktur",
              "weniger fehlende Details",
              "bessere Konsistenz über Berichte hinweg",
            ],
            after: "Die Qualität steigt, weil Sprechen schneller und natürlicher ist als Tippen.",
          },
          {
            q: "Braucht es spezielle technische Kenntnisse?",
            paragraphs: ["Nein. Das System ist:"],
            list: ["einfach", "intuitiv", "ohne technisches Training schnell nutzbar"],
            after: "Wenn Sie diktieren können, können Sie es nutzen.",
          },
          {
            q: "Ist das rechtlich erlaubt?",
            paragraphs: ["Ja. KI-gestützte Dokumentation ist erlaubt, wenn:"],
            list: [
              "dass Psychiater*innen verantwortlich bleiben",
              "Patienteneinwilligung eingeholt wird, wo erforderlich",
              "Datenschutzprinzipien eingehalten werden",
            ],
            after: "Dieses System ist nach diesen Prinzipien aufgebaut.",
          },
          {
            q: "Praktische Einordnung",
            paragraphs: [
              "Wenn Dokumentation 45-90 Minuten pro Tag kostet, sind das 15-30 Stunden pro Monat. Dieses Produkt ist dafür gedacht, einen spürbaren Teil dieser Zeit zurückzugeben.",
              "Die tatsächliche Zeitersparnis variiert je nach Workflow, Vorlagenkomplexität und Audioqualität.",
            ],
          },
          {
            q: "Compliance-Haltung",
            list: [
              "Dokumentationsassistent",
              "Psychiater*innen-kontrolliert",
              "Keine automatisierten klinischen Entscheidungen",
              "Für Vertraulichkeit und professionelle Verantwortung entwickelt",
            ],
          },
        ],
      },
    ],
  },
  en: {
    title: "Frequently Asked Questions (FAQ)",
    sections: [
      {
        title: "General",
        items: [
          {
            q: "What is this system?",
            paragraphs: [
              "It is a digital dictation and documentation assistant for psychiatrists and therapists.",
              "It helps transform spoken information into structured medical reports, using professional templates.",
              "The system supports documentation - it does not replace clinical judgment.",
            ],
          },
          {
            q: "What powers the dictation recording?",
            paragraphs: [
              "The live dictation feature is powered by OpenAI Speech-to-Text.",
              "Microphone audio is sent to the OpenAI API for transcription.",
              "Audio is used only for transcription and then deleted.",
            ],
          },
          {
            q: "Who is it for?",
            list: [
              "Psychiatrists",
              "Psychotherapists",
              "Mental health professionals who spend significant time on documentation",
            ],
            after: "Patients are indirect beneficiaries through more focused sessions and reduced administrative burden.",
          },
          {
            q: "Does the system make diagnoses or treatment decisions?",
            paragraphs: ["No.", "The system:"],
            list: ["Does not diagnose", "Does not recommend treatments", "Does not make clinical decisions"],
            after: "All medical responsibility remains with the treating professional.",
          },
        ],
      },
      {
        title: "For Patients",
        items: [
          {
            q: "Why is my psychiatrist using this system?",
            paragraphs: [
              "To reduce time spent on administrative tasks and documentation. This allows your psychiatrist to:",
            ],
            list: [
              "Focus more fully during sessions",
              "Finish reports more efficiently",
              "Have more time and energy for patient care",
            ],
          },
          {
            q: "Is my conversation recorded?",
            paragraphs: ["Depending on how the system is used:"],
            list: [
              "Sometimes only the psychiatrist's dictation is processed",
              "In some cases, parts of the conversation may be transcribed with consent",
              "Recording is used only to create accurate medical documentation",
            ],
          },
          {
            q: "What happens to the audio recordings?",
            list: [
              "Audio is used only for transcription",
              "Audio is deleted after transcription",
              "The final document is reviewed and approved by the psychiatrist",
              "No audio is stored permanently",
            ],
          },
          {
            q: "Is my data safe and confidential?",
            paragraphs: ["Yes."],
            list: [
              "Medical confidentiality applies at all times",
              "Data is processed securely",
              "Information is used only for medical documentation",
              "Data is not sold, reused, or shared for other purposes",
              "The system follows the same confidentiality principles as written notes or traditional dictation",
            ],
          },
          {
            q: "Can I refuse consent?",
            paragraphs: [
              "Yes. If you do not wish for conversation transcription, you can say so.",
              "Your psychiatrist can still document the session using traditional methods.",
            ],
          },
        ],
      },
      {
        title: "For Therapists & Psychiatrists",
        items: [
          {
            q: "How is this different from standard dictation software?",
            paragraphs: ["Standard dictation tools produce raw text. This system:"],
            list: [
              "Uses psychiatric documentation templates",
              "Produces structured clinical language",
              "Reduces time spent editing and reorganizing notes",
              "Is designed specifically for mental health workflows",
            ],
          },
          {
            q: "Do I stay in control of the final document?",
            paragraphs: ["Always. You:"],
            list: [
              "Review every document",
              "Edit as needed",
              "Approve the final version",
              "Nothing is stored or shared without your oversight",
            ],
          },
          {
            q: "Does this increase documentation quality?",
            paragraphs: ["Many clinicians report:"],
            list: [
              "More complete notes",
              "Clearer structure",
              "Fewer missing details",
              "Better consistency across reports",
            ],
            after: "Quality improves because speaking is faster and more natural than typing.",
          },
          {
            q: "Is special technical knowledge required?",
            paragraphs: ["No. The system is designed to be:"],
            list: ["Simple", "Intuitive", "Quickly usable without technical training"],
            after: "If you can dictate, you can use the system.",
          },
          {
            q: "Is this legally allowed?",
            paragraphs: ["Yes. AI-assisted documentation is legally permitted when:"],
            list: [
              "The clinician remains responsible",
              "Patient consent is obtained where required",
              "Data protection principles are respected",
            ],
            after: "This system is designed around those principles.",
          },
          {
            q: "Practical framing",
            paragraphs: [
              "If documentation takes 45-90 minutes per day, that adds up to 15-30 hours per month. This product is designed to give back a meaningful portion of that time.",
              "Actual time savings vary by workflow, template complexity, and audio quality.",
            ],
          },
          {
            q: "Compliance posture",
            list: [
              "Documentation assistant",
              "Clinician-controlled",
              "No automated clinical decisions",
              "Designed for confidentiality and professional responsibility",
            ],
          },
        ],
      },
    ],
  },
  it: {
    title: "Domande frequenti (FAQ)",
    sections: [
      {
        title: "Generale",
        items: [
          {
            q: "Che cos'e questo sistema?",
            paragraphs: [
              "E un assistente digitale di dettatura e documentazione per psichiatri e terapeuti.",
              "Aiuta a trasformare le informazioni parlate in report medici strutturati, usando modelli professionali.",
              "Il sistema supporta la documentazione - non sostituisce il giudizio clinico.",
            ],
          },
          {
            q: "Cosa alimenta la registrazione della dettatura?",
            paragraphs: [
              "La dettatura live e alimentata da OpenAI Speech-to-Text.",
              "L'audio del microfono viene inviato all'API OpenAI per la trascrizione.",
              "L'audio e usato solo per la trascrizione e poi eliminato.",
            ],
          },
          {
            q: "A chi e rivolto?",
            list: [
              "Psichiatri",
              "Psicoterapeuti",
              "Professionisti della salute mentale con molto tempo dedicato alla documentazione",
            ],
            after: "I pazienti ne beneficiano indirettamente grazie a sessioni piu focalizzate e minore carico amministrativo.",
          },
          {
            q: "Il sistema fa diagnosi o decisioni terapeutiche?",
            paragraphs: ["No.", "Il sistema:"],
            list: ["Non fa diagnosi", "Non raccomanda trattamenti", "Non prende decisioni cliniche"],
            after: "Tutta la responsabilita medica resta al professionista curante.",
          },
        ],
      },
      {
        title: "Per i pazienti",
        items: [
          {
            q: "Perche il mio psichiatra usa questo sistema?",
            paragraphs: [
              "Per ridurre il tempo dedicato a compiti amministrativi e documentazione. Questo permette al tuo psichiatra di:",
            ],
            list: [
              "Essere piu presente durante le sedute",
              "Completare i report piu rapidamente",
              "Avere piu tempo ed energia per la cura dei pazienti",
            ],
          },
          {
            q: "La mia conversazione viene registrata?",
            paragraphs: ["Dipende da come viene usato il sistema:"],
            list: [
              "A volte viene elaborata solo la dettatura dello psichiatra",
              "In alcuni casi, parti della conversazione possono essere trascritte con consenso",
              "La registrazione serve solo a creare documentazione medica accurata",
            ],
          },
          {
            q: "Cosa succede alle registrazioni audio?",
            list: [
              "L'audio e usato solo per la trascrizione",
              "L'audio viene eliminato dopo la trascrizione",
              "Il documento finale viene revisionato e approvato dallo psichiatra",
              "Nessun audio viene conservato in modo permanente",
            ],
          },
          {
            q: "I miei dati sono sicuri e riservati?",
            paragraphs: ["Si."],
            list: [
              "La riservatezza medica si applica sempre",
              "I dati sono trattati in modo sicuro",
              "Le informazioni sono usate solo per documentazione medica",
              "I dati non vengono venduti, riutilizzati o condivisi per altri scopi",
              "Il sistema segue gli stessi principi di riservatezza delle note scritte o della dettatura tradizionale",
            ],
          },
          {
            q: "Posso rifiutare il consenso?",
            paragraphs: [
              "Si. Se non desideri la trascrizione della conversazione, puoi dirlo.",
              "Il tuo psichiatra puo comunque documentare la seduta con metodi tradizionali.",
            ],
          },
        ],
      },
      {
        title: "Per terapeuti e psichiatri",
        items: [
          {
            q: "In cosa e diverso dai software di dettatura standard?",
            paragraphs: ["I tool di dettatura standard producono testo grezzo. Questo sistema:"],
            list: [
              "Usa modelli di documentazione psichiatrica",
              "Produce linguaggio clinico strutturato",
              "Riduce il tempo speso a modificare e riorganizzare le note",
              "E progettato per i flussi di lavoro della salute mentale",
            ],
          },
          {
            q: "Resto in controllo del documento finale?",
            paragraphs: ["Sempre. Tu:"],
            list: [
              "Rivedi ogni documento",
              "Modifichi quando necessario",
              "Approvi la versione finale",
              "Nulla viene salvato o condiviso senza la tua supervisione",
            ],
          },
          {
            q: "Aumenta la qualita della documentazione?",
            paragraphs: ["Molti professionisti riportano:"],
            list: [
              "Note piu complete",
              "Struttura piu chiara",
              "Meno dettagli mancanti",
              "Migliore consistenza tra i report",
            ],
            after: "La qualita migliora perche parlare e piu veloce e naturale che digitare.",
          },
          {
            q: "Sono richieste competenze tecniche speciali?",
            paragraphs: ["No. Il sistema e progettato per essere:"],
            list: ["Semplice", "Intuitivo", "Utilizzabile rapidamente senza formazione tecnica"],
            after: "Se sai dettare, puoi usarlo.",
          },
          {
            q: "E legalmente consentito?",
            paragraphs: ["Si. La documentazione assistita da AI e consentita quando:"],
            list: [
              "Il clinico resta responsabile",
              "Il consenso del paziente viene ottenuto quando necessario",
              "I principi di protezione dei dati sono rispettati",
            ],
            after: "Questo sistema e progettato secondo questi principi.",
          },
          {
            q: "Inquadramento pratico",
            paragraphs: [
              "Se la documentazione richiede 45-90 minuti al giorno, sono 15-30 ore al mese. Questo prodotto e progettato per restituire una parte significativa di quel tempo.",
              "Il risparmio reale varia in base al workflow, alla complessita del modello e alla qualita audio.",
            ],
          },
          {
            q: "Impostazione compliance",
            list: [
              "Assistente di documentazione",
              "Controllato dal clinico",
              "Nessuna decisione clinica automatizzata",
              "Progettato per riservatezza e responsabilita professionale",
            ],
          },
        ],
      },
    ],
  },
  fr: {
    title: "Foire aux questions (FAQ)",
    sections: [
      {
        title: "General",
        items: [
          {
            q: "Qu'est-ce que ce systeme ?",
            paragraphs: [
              "C'est un assistant numerique de dictee et de documentation pour les psychiatres et les therapeutes.",
              "Il aide a transformer des informations orales en rapports medicaux structures, a l'aide de modeles professionnels.",
              "Le systeme soutient la documentation - il ne remplace pas le jugement clinique.",
            ],
          },
          {
            q: "Qu'est-ce qui alimente l'enregistrement de dictee ?",
            paragraphs: [
              "La dictee en direct est alimentee par OpenAI Speech-to-Text.",
              "L'audio du micro est envoye a l'API OpenAI pour la transcription.",
              "L'audio est utilise uniquement pour la transcription puis supprime.",
            ],
          },
          {
            q: "A qui est-il destine ?",
            list: [
              "Psychiatres",
              "Psychotherapeutes",
              "Professionnels de la sante mentale passant beaucoup de temps en documentation",
            ],
            after: "Les patients en beneficient indirectement via des seances plus concentrees et moins d'administratif.",
          },
          {
            q: "Le systeme pose-t-il des diagnostics ou prend-il des decisions therapeutiques ?",
            paragraphs: ["Non.", "Le systeme :"],
            list: ["Ne diagnostique pas", "Ne recommande pas de traitements", "Ne prend pas de decisions cliniques"],
            after: "Toute la responsabilite medicale reste au professionnel traitant.",
          },
        ],
      },
      {
        title: "Pour les patients",
        items: [
          {
            q: "Pourquoi mon psychiatre utilise-t-il ce systeme ?",
            paragraphs: [
              "Pour reduire le temps passe sur l'administratif et la documentation. Cela permet a votre psychiatre de :",
            ],
            list: [
              "Se concentrer davantage pendant les seances",
              "Terminer les rapports plus efficacement",
              "Avoir plus de temps et d'energie pour les patients",
            ],
          },
          {
            q: "Ma conversation est-elle enregistree ?",
            paragraphs: ["Cela depend de l'utilisation :"],
            list: [
              "Parfois seule la dictee du psychiatre est traitee",
              "Dans certains cas, des parties de la conversation peuvent etre transcrites avec consentement",
              "L'enregistrement sert uniquement a creer une documentation medicale precise",
            ],
          },
          {
            q: "Que se passe-t-il avec les enregistrements audio ?",
            list: [
              "L'audio est utilise uniquement pour la transcription",
              "L'audio est supprime apres transcription",
              "Le document final est relu et approuve par le psychiatre",
              "Aucun audio n'est conserve de facon permanente",
            ],
          },
          {
            q: "Mes donnees sont-elles sures et confidentielles ?",
            paragraphs: ["Oui."],
            list: [
              "Le secret medical s'applique en permanence",
              "Les donnees sont traitees de maniere securisee",
              "Les informations sont utilisees uniquement pour la documentation medicale",
              "Les donnees ne sont ni vendues, ni reutilisees, ni partagees",
              "Le systeme suit les memes principes de confidentialite que les notes ecrites ou la dictee traditionnelle",
            ],
          },
          {
            q: "Puis-je refuser le consentement ?",
            paragraphs: [
              "Oui. Si vous ne souhaitez pas de transcription de la conversation, vous pouvez le dire.",
              "Votre psychiatre peut toujours documenter la seance avec des methodes traditionnelles.",
            ],
          },
        ],
      },
      {
        title: "Pour les therapeutes et psychiatres",
        items: [
          {
            q: "En quoi est-ce different d'un logiciel de dictee standard ?",
            paragraphs: ["Les outils de dictee standard produisent du texte brut. Ce systeme :"],
            list: [
              "Utilise des modeles de documentation psychiatrique",
              "Produit un langage clinique structure",
              "Reduit le temps passe a editer et reorganiser les notes",
              "Est concu pour les flux de travail en sante mentale",
            ],
          },
          {
            q: "Est-ce que je garde le controle du document final ?",
            paragraphs: ["Toujours. Vous :"],
            list: [
              "Relisez chaque document",
              "Editez si necessaire",
              "Approuvez la version finale",
              "Rien n'est stocke ou partage sans votre supervision",
            ],
          },
          {
            q: "Est-ce que cela ameliore la qualite de la documentation ?",
            paragraphs: ["De nombreux cliniciens rapportent :"],
            list: [
              "Des notes plus completes",
              "Une structure plus claire",
              "Moins de details manquants",
              "Une meilleure coherence entre les rapports",
            ],
            after: "La qualite s'ameliore car parler est plus rapide et naturel que taper.",
          },
          {
            q: "Faut-il des connaissances techniques particulières ?",
            paragraphs: ["Non. Le systeme est concu pour etre :"],
            list: ["Simple", "Intuitif", "Rapidement utilisable sans formation technique"],
            after: "Si vous pouvez dicter, vous pouvez l'utiliser.",
          },
          {
            q: "Est-ce legalement autorise ?",
            paragraphs: ["Oui. La documentation assistee par IA est autorisee lorsque :"],
            list: [
              "Le clinicien reste responsable",
              "Le consentement du patient est obtenu lorsque requis",
              "Les principes de protection des donnees sont respectes",
            ],
            after: "Ce systeme est concu selon ces principes.",
          },
          {
            q: "Cadre pratique",
            paragraphs: [
              "Si la documentation prend 45-90 minutes par jour, cela represente 15-30 heures par mois. Ce produit vise a rendre une partie significative de ce temps.",
              "Le gain reel varie selon le workflow, la complexite du modele et la qualite audio.",
            ],
          },
          {
            q: "Positionnement compliance",
            list: [
              "Assistant de documentation",
              "Controle par le clinicien",
              "Aucune decision clinique automatisee",
              "Concu pour la confidentialite et la responsabilite professionnelle",
            ],
          },
        ],
      },
    ],
  },
} as const;

export function PrivacyFaqContent() {
  const { language } = useLanguage();
  const t = copy[language] ?? copy.en;

  return (
    <div className="space-y-8 rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold">{t.title}</h1>

      {t.sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-lg font-semibold">{section.title}</h2>

          {section.items.map((item) => (
            <div key={item.q} className="space-y-2">
              <div className="text-base font-semibold">{item.q}</div>
              {item.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-sm text-gray-700">
                  {paragraph}
                </p>
              ))}
              {item.list && (
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                  {item.list.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              )}
              {item.after && <p className="text-sm text-gray-700">{item.after}</p>}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
