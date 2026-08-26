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
  high: string
): AssessmentQuestion {
  return { id, text, type: "rating", rating: { low, high } };
}

function yesno(id: string, text: string): AssessmentQuestion {
  return { id, text, type: "yesno" };
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
      "Fullständigt spec."
    ),
    rating(
      "r2",
      "I vilken mån finns digital eller virtuell testmiljö och är den beskriven?",
      "Saknas",
      "Fullt beskriven"
    ),
    rating(
      "r3",
      "Hur väl är möjliggörande infrastruktur (el, nätverk, sensorer) dokumenterad?",
      "Odokumenterad",
      "Kartlagd och uppdaterad"
    ),
    rating(
      "r4",
      "I vilken grad är infrastrukturen anpassad för olika användarnivåer?",
      "Bara för experter",
      "Alla nivåer"
    ),
    rating(
      "r5",
      "Hur väl fungerar stödet för datainsamling och dokumentation under tester?",
      "Ad hoc",
      "Strukturerat och automatiserat"
    ),
    yesno("y6", "Finns definierade säkerhetsrutiner för testmiljön?"),
    yesno("y7", "Är infrastrukturen tillgänglighetsanpassad?"),
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
      "Implementerad och känd"
    ),
    rating(
      "r2",
      "I vilken grad följs arbetssätten upp och förbättras baserat på erfarenheter?",
      "Sällan",
      "Systematisk rutin"
    ),
    rating(
      "r3",
      "Hur aktivt används metoder för samskapande i testprocessen?",
      "Inte alls",
      "Integrerat i alla tester"
    ),
    rating(
      "r4",
      "Hur väl mäter ni effekter — inte bara antal genomförda aktiviteter?",
      "Bara aktiviteter",
      "Mätbara effekter"
    ),
    yesno("y5", "Finns tydliga checklistor och rutiner för testgenomförande?"),
    yesno("y6", "Är metoder och verktyg anpassade för olika instegsnivåer?"),
    yesno("y7", "Hanteras negativa testresultat lika systematiskt som positiva?"),
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
      "Planerad och strukturerad"
    ),
    rating(
      "r2",
      "I vilken grad är rutiner för datasäkerhet kända, accepterade och aktivt använda?",
      "Bara på papper",
      "Levande i org."
    ),
    rating(
      "r3",
      "Hur väl hanteras GDPR och samtycke i testprocessen?",
      "Osäkert",
      "Fullständigt säkrat"
    ),
    rating(
      "r4",
      "I vilken mån skyddas testdeltagarnas integritet och sekretess?",
      "Ej adresserat",
      "Formellt säkrat"
    ),
    yesno("y5", "Finns avtal för immateriella rättigheter?"),
    yesno("y6", "Genomförs etisk prövning vid tester med känsliga målgrupper?"),
    yesno("y7", "Finns en kommunikationsplan med utpekad ansvarig?"),
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
      "Fullt förankrat"
    ),
    rating(
      "r2",
      "I vilken grad rapporteras resultat och status regelbundet till ledningen?",
      "Sällan",
      "Regelbundet och strukturerat"
    ),
    rating(
      "r3",
      "Hur väl är kompetensen för att driva testbädden organisatorisk — inte personberoende?",
      "Sårbar",
      "Institutionaliserad"
    ),
    rating(
      "r4",
      "I vilken grad finns etablerade former för kompetensutveckling och lärande?",
      "Ad hoc",
      "Strukturerad process"
    ),
    yesno("y5", "Finns utpekat ansvar för återrapportering av testbäddens aktiviteter?"),
    yesno("y6", "Är testbädden kopplad till stadens nyttorealiseringsprocess?"),
    yesno("y7", "Deltar testbädden aktivt i nätverk för erfarenhetsutbyte?"),
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
