import type {
  MeasurementArea,
  Question,
  Step,
  Track,
  TrackId,
  TrackMeta,
  TrackPhase,
} from "@/lib/types";

function q(id: string, text: string, placeholder = "Skriv ditt svar här..."): Question {
  return { id, text, placeholder };
}

function ma(
  id: string,
  title: string,
  description: string,
  points: string[] = []
): MeasurementArea {
  return { id, title, description, points };
}

// ─────────────────────────────────────────────────────────
// SPÅR A — ETABLERA EN TESTBÄDD
// Innehåll och struktur hämtat rakt av ur "Playbook Testbed
// Helsingborg" (playbook_komplett_v2_redigerad_1.pptx), slide 7–18.
// ─────────────────────────────────────────────────────────

const stepsA: Step[] = [
  {
    id: "a-infra",
    title: "Fysisk och digital infrastruktur",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "Vilken typ av infrastruktur består testmiljön av — fysisk/verklig, digital/virtuell eller simulerad?",
      "Finns det en beskrivning av testmiljön?",
      "Hur väl är funktioner, teknik, lokalisering, organisation och tjänsteutbud dokumenterade?",
      "Hur väl är kapacitet, begränsningar och säkerhetsprocedurer dokumenterade?",
      "I vilken mån är beskrivningarna godkända och kommunicerade?",
      "I vilken mån är stöd och verktyg för dokumentation och datainsamling tillgängliga?",
      "Hur väl stödjer infrastrukturen olika användarnivåer — från nybörjare till expert?",
    ],
    measurementAreas: [
      ma(
        "beskriv-testmiljoerna",
        "Beskriv testmiljöerna",
        "Dokumentera vilka fysiska, virtuella och möjliggörande testmiljöer (el, nätverk) som finns tillgängliga, inklusive begränsningar. Inkludera vilka produkter, tjänster och processer som kan testas och hur."
      ),
      ma(
        "testbaddsspecifikation",
        "Formulera en testbäddsspecifikation",
        "Samla kartläggningen i ett samlat dokument som beskriver funktioner, egenskaper, gränssnitt, teknisk lösning, lokalisering, organisation, kompetensprofil och tjänsteutbud."
      ),
      ma(
        "stod-for-datainsamling",
        "Säkerställ stöd för datainsamling",
        "Identifiera processer, mätvärden och verktyg för att dokumentera och följa upp testaktiviteterna."
      ),
      ma(
        "sakerhetsrutiner",
        "Definiera säkerhetsrutiner",
        "Alla nödvändiga säkerhetsprocedurer, utrustningshantering och nödmekanismer ska vara definierade, godkända och kommunicerade."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "a-metoder",
    title: "Arbetssätt, metoder och processer",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "Är arbetssätt/processer för hur tester och försök ska genomföras beskrivna?",
      "Hur väl är användningsrutiner och checklistor för ansvariga implementerade?",
      "Hur väl är metodik för genomförande implementerad?",
      "Finns tillgång till och stöd för avtal, immateriella rättigheter och andra juridiska frågor?",
      "Mäts och följs faktiska effekter och utfall upp — inte bara antal tester och deltagare?",
      "Hur aktivt och genomgående tillämpas metoder för samskapande i er testprocess — inte bara vid enstaka tillfällen?",
      "Hur väl är metoder och verktyg anpassade för olika instegsnivåer?",
      "I vilken mån följs arbetssätten upp löpande och justeras utifrån konkreta lärdomar?",
    ],
    measurementAreas: [
      ma(
        "kartlagg-metoder-verktyg",
        "Kartlägg metoder och verktyg",
        "Inventera vilka metoder som redan finns för att genomföra tester, för samskapande och för dokumentation. Finns beskrivna och implementerade arbetssätt?"
      ),
      ma(
        "rutiner-checklistor",
        "Skapa rutiner och checklistor",
        "Tydliga användningsrutiner, checklistor och vid behov avtal för tillgång och användning gör det möjligt att arbeta konsekvent och spårbart."
      ),
      ma(
        "metoder-samskapande",
        "Använd metoder för samskapande",
        "Samskapande är en grundpelare i innovationsarbete. Metoder kan ta sig uttryck inom UX, tjänstedesign, forskningsmetodik och living labs. Gör en bedömning utifrån den egna verksamheten."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "a-forvaltning",
    title: "Förvaltning, samverkan och kompetens",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "I vilken mån finns en tydlig beskrivning av syfte, värdeskapande, begränsningar, erbjudande och kostnader för användning?",
      "Finns omvärldsanalys som klargör kopplingar, synergier och positionering — i egen organisation och i innovationsekosystemet?",
      "I vilken mån finns personella resurser med definierade roller och ansvar?",
      "Är testbädden konkurrensneutral?",
      "Hur väl definierat och förankrat är testbäddens mandat — operativt, strategiskt, politiskt?",
      "I vilken mån är nyckelrisker med åtgärdsplan diskuterade och dokumenterade?",
      "Har kostnader och leverantörer identifierats?",
      "Är tillstånd och certifieringar identifierade och uppnåeliga?",
    ],
    measurementAreas: [
      ma(
        "definiera-syfte-nytta",
        "Definiera syftet och kvantifiera nyttan",
        "Formulera en väldefinierad målsättning. Kvantifiera den förväntade nyttan — miljömässig, samhällelig, ekonomisk — ur lokalt, nationellt och internationellt perspektiv."
      ),
      ma(
        "kartlagg-omvarld",
        "Kartlägg omvärlden och positionera",
        "Genomför omvärldsanalys som fastställer state-of-the-art, identifierar liknande initiativ och klargör testbäddens roll i innovationssystemets värdekedja."
      ),
      ma(
        "aktorskonstellation",
        "Bygg en stark och neutral aktörskonstellation",
        "Skapa bred representation (triple helix, SME, internationella aktörer, slutanvändare). Säkerställ konkurrensneutralitet avseende aktörer, lokalisering, tillträde och personal."
      ),
      ma(
        "sakra-kompetens-budget",
        "Säkra kompetens, risker och budget",
        "Bekräfta startteam, identifiera risker med åtgärdsplan, budgetera realistiskt, identifiera tillstånd och certifieringar."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "a-population",
    title: "Population och data",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "I vilken mån är primäranvändarnas behov identifierade och analyserade?",
      "Finns kvantifierad uppskattning av testbäddens marknad?",
      "Har testbädden en kommunikationsplan?",
      "Är planen känd, accepterad, använd och med tydlig ansvarig?",
      "Finns överenskommen lista med 10+ prioriterade målanvändare?",
      "Är kanaler för att sprida resultat identifierade och aktiva?",
      "Finns bekräftad efterfrågan på kort och lång sikt?",
    ],
    measurementAreas: [
      ma(
        "analysera-behoven",
        "Analysera behoven",
        "Genomför strukturerad behovsanalys med primäranvändare: vilka objekt, egenskaper, tester, stödbehov och betalningsvilja? Denna analys ger input till specifikation, affärsmodell och aktörskonstellation."
      ),
      ma(
        "kommunikationsplan",
        "Ta fram en kommunikationsplan",
        "Beskriv vem som ska informeras och involveras, kanaler, ansvar och hur planen hålls levande. Identifiera minst tio prioriterade målanvändare."
      ),
      ma(
        "kanaler-resultatspridning",
        "Bygg kanaler för resultatspridning",
        "Kanaler ska inte bara informera — de ska bidra till organisatoriskt lärande och stärka testbäddens roll i innovationsekosystemet."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "a-dialog",
    title: "Dialogfrågor",
    intro: "Använd dessa frågor i workshops och strategiska samtal.",
    why: "",
    questions: [
      q(
        "infrastruktur",
        "Infrastruktur: Har vi en sammanhållen testbäddsspecifikation med definierade funktioner, begränsningar och säkerhetskrav?"
      ),
      q(
        "metoder",
        "Metoder: Har vi ett komplett metodramverk — rutiner, checklistor, avtal och verktyg för samskapande?"
      ),
      q(
        "forvaltning",
        "Förvaltning: Är testbädden förankrad med kvantifierat syfte, omvärldsanalys, bred aktörskonstellation, rätt kompetens och realistisk budget?"
      ),
      q(
        "manniskor-data",
        "Människor & data: Har vi en förankrad kommunikationsplan med identifierade målanvändare och aktiva kanaler?"
      ),
    ],
    checklist: [],
    doneWhen: "",
  },
  {
    id: "a-canvas",
    title: "Canvas",
    intro: "Fyll i dessa canvas som underlag för testbäddsetableringen.",
    why: "",
    questions: [],
    checklist: [],
    measurementAreas: [
      ma(
        "syfte-positionering",
        "Syfte och positionering",
        "Syfte, kvantifierad nytta, omvärldsanalys och position i innovationsekosystemet."
      ),
      ma(
        "testbaddsspecifikation-canvas",
        "Testbäddsspecifikation",
        "Funktioner, teknik, lokalisering, organisation och tjänsteutbud."
      ),
      ma(
        "aktorskonstellation-canvas",
        "Aktörskonstellation",
        "Aktörer, roller, värdekedja, kommunikationsplan och målanvändare."
      ),
    ],
    doneWhen: "",
  },
];

// ─────────────────────────────────────────────────────────
// SPÅR B — DRIVA EN BEFINTLIG TESTBÄDD
// Innehåll och struktur hämtat rakt av ur pptx:en, slide 19–29.
// ─────────────────────────────────────────────────────────

const stepsB: Step[] = [
  {
    id: "b-infra",
    title: "Fysisk och digital infrastruktur",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "Uppfyller platsen fortfarande utrymmes- och funktionskrav?",
      "Är infrastrukturen anpassad till olika användarnivåer?",
      "Är mätvärden och övervakningsprocesser relevanta och aktiva?",
      "Finns samordning och dokumentation av operativa resurser?",
      "Är personal uppdaterad och tränad på säkerhetsprocedurer?",
      "Är utvecklingen balanserad mellan hårdvara och mjukvara?",
    ],
    measurementAreas: [
      ma(
        "ompröva-platsens-lamplighet",
        "Ompröva platsens lämplighet",
        "Uppfyller platsen fortfarande funktionskraven? Nya användargrupper tillkommer, teknik utvecklas, behov förskjuts. Kontrollera att infrastrukturen är anpassad till olika användarnivåer."
      ),
      ma(
        "hall-overvakning-levande",
        "Håll övervakningsprocesser levande",
        "Granska om mätvärden fortfarande är relevanta, om data samlas in rätt, och om samordningen av operativa resurser är dokumenterad."
      ),
      ma(
        "utbilda-uppdatera",
        "Utbilda och uppdatera",
        "Säkerställ att personal är tränad på säkerhetsprocedurer och utrustningshantering. Rutiner som inte är kända och praktiserade är verkningslösa."
      ),
      ma(
        "balansera-hardvara-mjukvara",
        "Balansera hårdvara och mjukvara",
        "Investering i utrustning utan motsvarande kompetens- och arbetssättsutveckling skapar kapacitet ingen kan använda fullt ut."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "b-metoder",
    title: "Arbetssätt, metoder och processer",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "Följs arbetssätten upp och justeras baserat på lärdomar?",
      "Är metoder institutionaliserade (kända, använda, med tydlig ägare)?",
      "Är den tekniska plattformen fullt implementerad och fungerande?",
      "Finns rutin för regelbunden granskning av arbetssätt?",
    ],
    measurementAreas: [
      ma(
        "institutionalisera-metoderna",
        "Institutionalisera metoderna",
        "Att en metod är beskriven innebär inte att den är institutionaliserad. Fråga dig: om personen som skapade metoden slutade imorgon, skulle arbetssättet överleva?"
      ),
      ma(
        "folj-upp-justera",
        "Följ upp och justera",
        "Bygg in systematisk uppföljning. Vilka lärdomar har kommit fram? Vad behöver justeras? Gör det till en rutin, inte en krismekanism."
      ),
      ma(
        "sakerstall-teknisk-plattform",
        "Säkerställ teknisk plattform",
        "En plattform som är implementerad men inte används underminerar hela arbetssättet. Kontrollera att tekniken stödjer — inte hindrar — processerna."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "b-population",
    title: "Population och data",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "Finns pågående efterfrågan plus potentiella nya marknader?",
      "Finns rutiner för användardata (före, under, efter) inklusive samtycke?",
      "Finns marknadsföringsplan som aktivt når ut till användare?",
      "Finns rutiner för datasäkerhet (kända, accepterade, använda)?",
      "Kan användarnas sekretess säkerställas?",
      "Finns mallar för risk- och säkerhetsbedömning som används aktivt?",
      "Finns avtal för immateriella rättigheter?",
    ],
    measurementAreas: [
      ma(
        "kontrollera-efterfragan",
        "Kontrollera pågående efterfrågan",
        "Finns fortfarande aktivt behov? Nya marknader? Genomför regelbundna temperaturmätningar mot nyckelanvändare."
      ),
      ma(
        "marknadsfor-erbjudandet",
        "Marknadsför erbjudandet",
        "En testbädd behöver kontinuerlig synlighet. Underhålls marknadsföringsplanen, eller fanns den bara vid lanseringen?"
      ),
      ma(
        "diskret-datainsamling",
        "Säkerställ diskret datainsamling",
        "Rutiner för datasäkerhet ska vara kända, accepterade och praktiserade — inte bara finnas på papper."
      ),
      ma(
        "skydda-sekretess-etik",
        "Skydda sekretess och håll etiken levande",
        "Företag som testar behöver vara trygga med att affärshemligheter skyddas. Etik är inte ett dokument som skrivs en gång — det ska praktiseras."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "b-forvaltning",
    title: "Förvaltning, samverkan och kompetens",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "Arbetar testbädden mot ett tydligt mål som alla är överens om?",
      "Är ansvarsförhållandena klargjorda med tydligt mandat?",
      "Finns öppenhet och transparens mot ledningen?",
      "Granskar styrelse/ledning risker regelbundet?",
      "Finns förmåga att anpassa tester utifrån aktuellt syfte?",
      "Finns arbetssätt för kompetensutveckling?",
      "Adresseras framtida kompetensgap proaktivt?",
      "Finns arbetssätt för att dokumentera och följa upp tester?",
      "Finns utpekat ansvar för återrapportering?",
      "Är kostnader, avtal och inköpshandlingar korrekta?",
      "Hur aktivt deltar ni i nätverk och forum för erfarenhetsutbyte med andra testbäddar?",
      "Hur regelbundet och öppet rapporteras testbäddens resultat, status och kostnader till ledningen?",
      "Hur etablerade är arbetssätten för löpande kompetensutveckling och organisatoriskt lärande?",
      "Hur väl är testbädden kopplad till stadens nyttorealiseringsprocess med mätbara effektmål per test?",
      "Hur snabbt kan ni anpassa scope eller avbryta ett test som inte levererar?",
    ],
    measurementAreas: [
      ma(
        "bekrafta-syftet",
        "Bekräfta att syftet gäller",
        "Om syftet har förändrats — formulera om det öppet snarare än att låta verksamheten glida iväg från sin ursprungliga intention."
      ),
      ma(
        "var-transparent",
        "Var transparent",
        "Rapportera proaktivt. Säkerställ forum och rutiner för regelbunden dialog om utveckling, resultat och utmaningar."
      ),
      ma(
        "granska-risker-kompetens",
        "Granska risker och investera i kompetens",
        "Anpassningsförmåga är en organisatorisk muskel som behöver tränas. Adressera kompetensgap proaktivt, inte reaktivt."
      ),
      ma(
        "folj-upp-kostnader",
        "Följ upp kostnader och resultat",
        "Uppföljning handlar om mer än ekonomi. Finns arbetssätt för att dokumentera tester, med utpekat ansvar för återrapportering?"
      ),
    ],
    doneWhen: "",
  },
  {
    id: "b-dialog",
    title: "Dialogfrågor",
    intro: "Använd dessa frågor i workshops och strategiska samtal.",
    why: "",
    questions: [
      q(
        "infrastruktur",
        "Infrastruktur: Är testmiljön ändamålsenlig med balanserad utveckling av fysiska resurser och organisatorisk förmåga?"
      ),
      q(
        "metoder",
        "Metoder: Lever metoderna i organisationen — följs de upp, justeras de, och fungerar den tekniska plattformen?"
      ),
      q(
        "manniskor-data",
        "Människor & data: Hanteras människor och data med levande rutiner och når vi ut med erbjudandet?"
      ),
      q(
        "forvaltning",
        "Förvaltning: Är syftet giltigt, mandatet tydligt, kompetensen tillräcklig och kostnaderna under kontroll?"
      ),
    ],
    checklist: [],
    doneWhen: "",
  },
  {
    id: "b-canvas",
    title: "Canvas",
    intro: "Använd dessa canvas för löpande uppföljning av testbäddens hälsa.",
    why: "",
    questions: [],
    checklist: [],
    measurementAreas: [
      ma(
        "infra-metoder-canvas",
        "Infrastruktur & metoder",
        "Vad fungerar? Vad behöver uppdateras? Balans hårdvara/mjukvara?"
      ),
      ma(
        "manniskor-data-canvas",
        "Människor & data",
        "Efterfrågan, etik, sekretess, kommunikation. Vad lever?"
      ),
      ma(
        "forvaltning-kompetens-canvas",
        "Förvaltning & kompetens",
        "Styrning, mandat, uppföljning, kompetensutveckling."
      ),
    ],
    doneWhen: "",
  },
];

// ─────────────────────────────────────────────────────────
// SPÅR C — SKALA OCH UTVECKLA
// Innehåll och struktur hämtat rakt av ur pptx:en, slide 30–34.
// ─────────────────────────────────────────────────────────

const stepsC: Step[] = [
  {
    id: "s-dimensioner",
    title: "Skalning kan ta flera former",
    intro: "",
    why: "",
    questions: [],
    checklist: [
      "Har testbäddens infrastruktur/metoder replikerats av andra testbäddar?",
      "Har vi deltagit i projekt med harmoniserade metoder eller infrastruktur?",
      "Finns en roadmap för framtida utveckling (modulär, inkrementell)?",
      "Har vi en diversifierad finansieringsmodell med säkrade intäktsströmmar?",
      "Finns forum för erfarenhetsutbyte med andra testbäddar?",
      "Samarbetar vi med andra nätverk lokalt, regionalt, nationellt, internationellt?",
      "Producerar vi lärandematerial för andra?",
      "Genomförs regelbunden impactbedömning?",
    ],
    measurementAreas: [
      ma(
        "skala-upp",
        "Skala upp (scale up)",
        "Nå fler användare, nya marknader, bredda erbjudandet. Replikera metoder och infrastruktur till fler testbäddar och labb."
      ),
      ma(
        "skala-ut",
        "Skala ut (scale out)",
        "Sprid arbetssätt, principer och verktyg till andra organisationer och kontexter genom harmonisering och standardisering."
      ),
      ma(
        "skala-djupt",
        "Skala djupt (scale deep)",
        "Fördjupa impact inom befintlig kontext — förändra beteenden, normer och system snarare än att bara nå fler. Handlar om kvalitativ fördjupning."
      ),
    ],
    doneWhen: "",
  },
  {
    id: "s-dialog",
    title: "Dialogfrågor",
    intro: "Använd dessa frågor i workshops och strategiska samtal.",
    why: "",
    questions: [
      q(
        "infrastruktur",
        "Infrastruktur: Är vår infrastruktur standardiserad och delbar — med en roadmap som möjliggör modulär vidareutveckling?"
      ),
      q("metoder", "Metoder: Utvecklar och delar vi metoder så att andra kan replikera dem?"),
      q(
        "forvaltning",
        "Förvaltning: Har vi diversifierad finansiering, växande nätverk och systematisk monitorering?"
      ),
      q(
        "manniskor-data",
        "Människor & data: Engagerar vi olika användargrupper, mäter vi impact och delar vi kunskapen?"
      ),
    ],
    checklist: [],
    doneWhen: "",
  },
  {
    id: "s-canvas",
    title: "Canvas",
    intro: "Planera testbäddens skalningsresa.",
    why: "",
    questions: [],
    checklist: [],
    measurementAreas: [
      ma("skala-upp-canvas", "Skala upp", "Vilka metoder/infrastrukturer kan replikeras? Vilka partners?"),
      ma("skala-ut-canvas", "Skala ut", "Vilka principer kan spridas? Vilka lärandematerial behövs?"),
      ma("skala-djupt-canvas", "Skala djupt", "Hur fördjupar vi impact? Vilka system vill vi påverka?"),
    ],
    doneWhen: "",
  },
];

// ─────────────────────────────────────────────────────────
// TRACK META
// ─────────────────────────────────────────────────────────

const metaA: TrackMeta = {
  id: "etablera",
  letter: "A",
  name: "Etablera en testbädd",
  shortName: "Etablera",
  color: "#E8750A",
  light: "#FDF0E6",
  border: "#F5C48A",
  description:
    "Den här delen vägleder genom aktiviteterna för att planera och starta en testbädd — från behovsanalys och omvärldspositionering till att formulera erbjudandet och nå ut.\n\nEn testbädd som saknar ett tydligt och förankrat syfte riskerar att bli en lösning som söker sitt problem. Testbädden består av både hårdvara (fysisk infrastruktur, utrustning, mätmetoder) och mjukvara (kompetens, organisation, tjänsteutbud, arbetssätt). Att kartlägga och integrera båda dimensionerna är avgörande.\n\nUnderlaget bygger på Helsingborgs testbäddsmodell, Scorecard for Planning, Harmonization Cube, ENoLL Self-Assessment och Vinnovas guide för testbäddsutveckling.",
  outputs: [
    "Syfte och positionering",
    "Testbäddsspecifikation",
    "Aktörskonstellation",
  ],
  stepCount: stepsA.length,
  estimate: "ca 1–2 timmar",
};

const metaB: TrackMeta = {
  id: "driva",
  letter: "B",
  name: "Driva en befintlig testbädd",
  shortName: "Driva",
  color: "#185FA5",
  light: "#E8F0F9",
  border: "#B8D2EA",
  description:
    "Den här delen riktar sig till dig som äger eller ansvarar för en testbädds erbjudande. Testbädden är etablerad och i drift — nu handlar det om att säkerställa att den fortsätter att leverera värde.\n\nSustainability-fasen skiljer sig från setup genom att frågorna skiftar från \"har vi det vi behöver?\" till \"fungerar det fortfarande?\". Det som en gång definierades behöver regelbundet omprövas, uppdateras och förankras på nytt.\n\nMetoder som inte underhålls blir föråldrade. Syften som förskjuts utan att omformuleras skapar otydlighet. Kompetens som inte utvecklas eroderar.\n\nUnderlaget bygger på Scorecard for Testbed Health, Harmonization Cube, Helsingborgs frågebatteri och Vinnovas guide för testbäddsutveckling.",
  outputs: [
    "Hälsokontroll",
    "Dialogsvar",
    "Canvas-underlag",
  ],
  stepCount: stepsB.length,
  estimate: "ca 1–2 timmar",
};

const metaC: TrackMeta = {
  id: "skala",
  letter: "C",
  name: "Skala och utveckla",
  shortName: "Skala",
  color: "#2D7A4F",
  light: "#EAF4EE",
  border: "#A9D2B9",
  description:
    "Den här delen handlar om att sprida, fördjupa och vidareutveckla testbäddsförmågan — inom och utanför organisationen.\n\nSkalning handlar inte bara om att göra mer av samma sak. Det finns flera dimensioner: att skala upp (nå fler), skala ut (sprida principer och arbetssätt) och skala djupt (fördjupa impact och förändra system).\n\nENoLL:s self-assessment och Harmonization Cube ger ramverket för att utvärdera skalningsförmåga — från replikering av metoder till finansiell diversifiering och impactmätning.\n\nDenna del är under utveckling och kommer att kompletteras med fler verktyg och erfarenheter.",
  outputs: [
    "Vald skalningsdimension (upp/ut/djupt)",
    "Dialogsvar",
    "Canvas-underlag",
  ],
  stepCount: stepsC.length,
  estimate: "ca 30–60 min",
};

export const tracks: Record<TrackId, Track> = {
  etablera: { meta: metaA, steps: stepsA },
  driva: { meta: metaB, steps: stepsB },
  skala: { meta: metaC, steps: stepsC },
};

export const trackList: Track[] = [tracks.etablera, tracks.driva, tracks.skala];

export function getTrack(trackId: string): Track | undefined {
  return tracks[trackId as TrackId];
}

export function getStep(trackId: string, stepId: string): Step | undefined {
  const track = getTrack(trackId);
  return track?.steps.find((s) => s.id === stepId);
}

export function getStepIndex(trackId: string, stepId: string): number {
  const track = getTrack(trackId);
  if (!track) return -1;
  return track.steps.findIndex((s) => s.id === stepId);
}

export function isValidTrack(trackId: string): trackId is TrackId {
  return trackId === "etablera" || trackId === "driva" || trackId === "skala";
}

/**
 * De avbockningsbara punkterna för ett steg. Steg med strukturerade
 * mätområden (`measurementAreas`) har en egen, separat checklista
 * (`checklist`) hämtad ur pptx:ens egna checklista-slides — de ersätter
 * inte varandra. Faller tillbaka på `measurementAreas`-punkterna bara om
 * `checklist` är tom.
 */
export function getChecklistItems(step: Step): string[] {
  if (step.checklist.length > 0) return step.checklist;
  if (step.measurementAreas) {
    return step.measurementAreas.flatMap((area) => area.points);
  }
  return [];
}

// ─────────────────────────────────────────────────────────
// FASINDELNING — behålls för den interaktiva stegöversikten
// (döljs för närvarande av FEATURES.guideMode). Varje spår är här
// en enda fas som innehåller samtliga steg, i pptx:ens egen ordning.
// ─────────────────────────────────────────────────────────

const PHASES: Record<TrackId, TrackPhase[]> = {
  etablera: [
    {
      name: metaA.shortName,
      estimate: metaA.estimate,
      stepIds: stepsA.map((s) => s.id),
    },
  ],
  driva: [
    {
      name: metaB.shortName,
      estimate: metaB.estimate,
      stepIds: stepsB.map((s) => s.id),
    },
  ],
  skala: [
    {
      name: metaC.shortName,
      estimate: metaC.estimate,
      stepIds: stepsC.map((s) => s.id),
    },
  ],
};

export function getPhases(trackId: TrackId): TrackPhase[] {
  return PHASES[trackId];
}
