import type {
  AssessmentAnswer,
  AssessmentArea,
  AssessmentAreaId,
  AssessmentQuestion,
  CapacityAreaId,
} from "@/lib/types";

function rating(
  id: string,
  text: string,
  low: string,
  high: string,
  why: string
): AssessmentQuestion {
  return { id, text, type: "rating", rating: { low, high }, why };
}

function yesno(id: string, text: string, why: string): AssessmentQuestion {
  return { id, text, type: "yesno", why };
}

const infrastruktur: AssessmentArea = {
  id: "infrastruktur",
  title: "Infrastruktur",
  description:
    "Fysiska och digitala miljöer, utrustning och möjliggörande infrastruktur för att genomföra tester.",
  color: "#E8750A",
  lightColor: "#FDF0E6",
  icon: "Building2",
  questions: [
    rating(
      "r1",
      "Hur väl är testbäddens fysiska testmiljö beskriven och dokumenterad?",
      "Odokumenterad",
      "Fullständigt spec.",
      "En tydlig beskrivning gör det möjligt för potentiella kunder och partners att snabbt förstå vad testbädden erbjuder — och minskar risken för missförstånd under ett test."
    ),
    rating(
      "r2",
      "I vilken mån finns digital eller virtuell testmiljö och är den beskriven?",
      "Saknas",
      "Fullt beskriven",
      "Digitala och virtuella miljöer sänker tröskeln för att testa lösningar som inte kräver fysisk närvaro, och breddar vilka aktörer som kan använda testbädden."
    ),
    rating(
      "r3",
      "Hur väl är möjliggörande infrastruktur (el, nätverk, sensorer) dokumenterad?",
      "Odokumenterad",
      "Kartlagd och uppdaterad",
      "Utan dokumenterad grundinfrastruktur blir det svårt att bedöma vilka tester som faktiskt är genomförbara — och risken ökar för överraskningar mitt i ett test."
    ),
    rating(
      "r4",
      "I vilken grad är infrastrukturen anpassad för olika användarnivåer?",
      "Bara för experter",
      "Alla nivåer",
      "En testbädd som bara experter kan använda begränsar vilka som vågar testa hos er — bredare tillgänglighet ökar nyttan och antalet tester."
    ),
    rating(
      "r5",
      "Hur väl fungerar stödet för datainsamling och dokumentation under tester?",
      "Ad hoc",
      "Strukturerat och automatiserat",
      "Strukturerad datainsamling gör att resultaten går att lita på och att lärdomarna går att återanvända i nästa test."
    ),
    yesno(
      "y6",
      "Finns definierade säkerhetsrutiner för testmiljön?",
      "Tydliga säkerhetsrutiner skyddar både testdeltagare och er verksamhet, och är ofta en förutsättning för att få genomföra tester överhuvudtaget."
    ),
    yesno(
      "y7",
      "Är infrastrukturen tillgänglighetsanpassad?",
      "Tillgänglighetsanpassning breddar vilka som kan delta i och dra nytta av era tester, och är ofta ett krav vid offentlig finansiering."
    ),
  ],
};

const metoder: AssessmentArea = {
  id: "metoder",
  title: "Metoder",
  description:
    "Arbetssätt, processer och verktyg för att genomföra, dokumentera och lära av tester.",
  color: "#185FA5",
  lightColor: "#EBF3FC",
  icon: "Compass",
  questions: [
    rating(
      "r1",
      "Hur väl är testprocessen (från idé till avslut) beskriven och implementerad?",
      "Odokumenterad",
      "Implementerad och känd",
      "En känd process gör det tydligt för alla inblandade vad som händer när, vilket minskar friktion och missförstånd under testet."
    ),
    rating(
      "r2",
      "I vilken grad följs arbetssätten upp och förbättras baserat på erfarenheter?",
      "Sällan",
      "Systematisk rutin",
      "Utan systematisk uppföljning riskerar samma misstag att upprepas i varje nytt test, istället för att testbädden blir bättre över tid."
    ),
    rating(
      "r3",
      "Hur aktivt används metoder för samskapande i testprocessen?",
      "Inte alls",
      "Integrerat i alla tester",
      "Samskapande med användare och partners ökar chansen att det som testas faktiskt löser ett verkligt behov."
    ),
    rating(
      "r4",
      "Hur väl mäter ni effekter — inte bara antal genomförda aktiviteter?",
      "Bara aktiviteter",
      "Mätbara effekter",
      "Att bara räkna aktiviteter säger inget om nyttan de skapat — effektmått gör det möjligt att visa och kommunicera verkligt värde."
    ),
    yesno(
      "y5",
      "Finns tydliga checklistor och rutiner för testgenomförande?",
      "Checklistor säkerställer att viktiga steg inte glöms bort, oavsett vem i teamet som driver testet."
    ),
    yesno(
      "y6",
      "Är metoder och verktyg anpassade för olika instegsnivåer?",
      "Om metoderna kräver hög förkunskap riskerar ni att stänga ute mindre erfarna aktörer som annars hade kunnat dra nytta av testbädden."
    ),
    yesno(
      "y7",
      "Hanteras negativa testresultat lika systematiskt som positiva?",
      "Misslyckade tester innehåller ofta minst lika mycket lärdom som lyckade — att dokumentera dem säkerställer att den kunskapen inte går förlorad."
    ),
  ],
};

const manniskor: AssessmentArea = {
  id: "manniskor",
  title: "Människor och data",
  description:
    "Kommunikation, GDPR, etik och hantering av testdeltagare och dataflöden.",
  color: "#2D7A4F",
  lightColor: "#EAF4EE",
  icon: "Users",
  questions: [
    rating(
      "r1",
      "Hur väl fungerar kommunikationen kring testbädden — internt och externt?",
      "Ad hoc",
      "Planerad och strukturerad",
      "God kommunikation gör att rätt personer känner till testbädden, förstår dess syfte och vet hur de kan bidra eller delta."
    ),
    rating(
      "r2",
      "I vilken grad är rutiner för datasäkerhet kända, accepterade och aktivt använda?",
      "Bara på papper",
      "Levande i org.",
      "Rutiner som bara finns på papper skyddar varken deltagare eller organisation — de måste vara kända och faktiskt följas i praktiken."
    ),
    rating(
      "r3",
      "Hur väl hanteras GDPR och samtycke i testprocessen?",
      "Osäkert",
      "Fullständigt säkrat",
      "Bristande hantering av GDPR och samtycke kan stoppa ett test i sista stund eller leda till allvarliga juridiska konsekvenser."
    ),
    rating(
      "r4",
      "I vilken mån skyddas testdeltagarnas integritet och sekretess?",
      "Ej adresserat",
      "Formellt säkrat",
      "Att skydda deltagarnas integritet är en grundförutsättning för förtroende — utan det blir det svårare att rekrytera deltagare till framtida tester."
    ),
    yesno(
      "y5",
      "Finns avtal för immateriella rättigheter?",
      "Tydliga avtal om vem som äger resultat och idéer förebygger tvister och gör det tryggare för externa parter att testa hos er."
    ),
    yesno(
      "y6",
      "Genomförs etisk prövning vid tester med känsliga målgrupper?",
      "Etisk prövning skyddar utsatta deltagare och stärker testbäddens trovärdighet gentemot omvärlden."
    ),
    yesno(
      "y7",
      "Finns en kommunikationsplan med utpekad ansvarig?",
      "Utan en tydlig ansvarig för kommunikationen riskerar viktig information om testbädden att helt enkelt inte nå fram."
    ),
  ],
};

const forvaltning: AssessmentArea = {
  id: "forvaltning",
  title: "Förvaltning",
  description:
    "Styrning, mandat, kompetens och organisatoriskt lärande för långsiktig hållbarhet.",
  color: "#7B68D9",
  lightColor: "#F0EFFE",
  icon: "Landmark",
  questions: [
    rating(
      "r1",
      "Hur tydligt och förankrat är testbäddens syfte och mandat?",
      "Otydligt",
      "Fullt förankrat",
      "Ett förankrat mandat gör det lättare att få resurser, prioritet och stöd från ledningen när det behövs som mest."
    ),
    rating(
      "r2",
      "I vilken grad rapporteras resultat och status regelbundet till ledningen?",
      "Sällan",
      "Regelbundet och strukturerat",
      "Regelbunden rapportering håller testbädden synlig i organisationen och underlättar fortsatt finansiering och stöd."
    ),
    rating(
      "r3",
      "Hur väl är kompetensen för att driva testbädden organisatorisk — inte personberoende?",
      "Sårbar",
      "Institutionaliserad",
      "Om kunskapen sitter hos en enda person blir testbädden sårbar för personalomsättning — organisatorisk kompetens gör verksamheten uthållig."
    ),
    rating(
      "r4",
      "I vilken grad finns etablerade former för kompetensutveckling och lärande?",
      "Ad hoc",
      "Strukturerad process",
      "Strukturerad kompetensutveckling gör att testbädden kan möta nya typer av tester och behov över tid."
    ),
    yesno(
      "y5",
      "Finns utpekat ansvar för återrapportering av testbäddens aktiviteter?",
      "Utan en tydligt utpekad ansvarig riskerar återrapportering att falla mellan stolarna."
    ),
    yesno(
      "y6",
      "Är testbädden kopplad till stadens nyttorealiseringsprocess?",
      "Kopplingen till nyttorealisering gör det möjligt att visa vilket faktiskt värde testbädden skapar för staden."
    ),
    yesno(
      "y7",
      "Deltar testbädden aktivt i nätverk för erfarenhetsutbyte?",
      "Erfarenhetsutbyte med andra testbäddar sparar tid genom att ni slipper uppfinna hjulet på egen hand."
    ),
  ],
};

export const assessmentAreas: AssessmentArea[] = [
  infrastruktur,
  metoder,
  manniskor,
  forvaltning,
];

export function getAssessmentArea(id: string): AssessmentArea | undefined {
  return assessmentAreas.find((a) => a.id === id);
}

export function getAssessmentAreaIndex(id: string): number {
  return assessmentAreas.findIndex((a) => a.id === id);
}

export function isValidAssessmentArea(id: string): id is AssessmentAreaId {
  return assessmentAreas.some((a) => a.id === id);
}

export function isQuestionAnswered(
  question: AssessmentQuestion,
  answer: AssessmentAnswer | undefined
): boolean {
  if (!answer) return false;
  if (question.type === "rating") return typeof answer.rating === "number";
  return !!answer.yesno;
}

/**
 * Metodstödets kapacitetsområden (från playbook.ts) mappade mot
 * förmågebedömningens områden — samma fyra förmågor, olika id/namn
 * ("population" i metodstödet är "manniskor" i bedömningen).
 */
const CAPACITY_TO_ASSESSMENT: Record<CapacityAreaId, AssessmentAreaId> = {
  infrastruktur: "infrastruktur",
  metoder: "metoder",
  population: "manniskor",
  forvaltning: "forvaltning",
};

export function assessmentAreaForCapacity(capacityArea: CapacityAreaId): AssessmentArea {
  return getAssessmentArea(CAPACITY_TO_ASSESSMENT[capacityArea])!;
}

export function countAnswered(
  area: AssessmentArea,
  areaAnswers: Record<string, AssessmentAnswer> | undefined
): number {
  return area.questions.filter((q) => isQuestionAnswered(q, areaAnswers?.[q.id]))
    .length;
}
