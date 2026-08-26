import type { AiButtonType, Step, TrackId } from "@/lib/types";

type StepMocks = Partial<Record<AiButtonType, string>>;
type TrackMocks = Record<string, StepMocks>;

export const aiMocks: Record<TrackId, TrackMocks> = {
  etablera: {
    a1: {
      formulera:
        "Baserat på dina anteckningar kan syftet formuleras såhär: \"Testbädden ska möjliggöra tidiga och strukturerade tester av digitala lösningar för att snabbare identifiera vad som skapar verklig nytta för [målgrupp]. Nyttan mäts som [mått].\" Justera det kursiverade efter er kontext.",
      granska:
        "Jag ser tre saker att stärka: (1) Nyttan är beskriven men inte kvantifierad — kan ni sätta ett mätbart mål? (2) Beslutet för att gå vidare är inte definierat — vad behöver vara klart? (3) Det saknas ett svar på varför en testbädd är bättre än ett vanligt pilotprojekt i er kontext.",
      nastasteg:
        "Rekommenderade nästa steg: (1) Ta med syftesformuleringen till ett kort workshop med 3–4 nyckelpersoner för förankring. (2) Identifiera en person med mandat att fatta beslut om att gå vidare. (3) Gå till steg A2 och kartlägg om liknande initiativ redan finns.",
    },
    a3: {
      formulera:
        "Ett förslag på hur infrastrukturen kan beskrivas: \"Testbädden erbjuder en fysisk testmiljö för [typ av test] med möjlighet att mäta [parametrar]. Digital testmiljö finns för [ändamål]. Begränsningar: [vad som inte kan testas]. All data dokumenteras via [metod] och hanteras enligt [säkerhetskrav].\"",
      granska:
        "Din beskrivning täcker den fysiska miljön väl, men två saker saknas: begränsningarna är inte tydligt formulerade — vad kan faktiskt INTE testas hos er? Och säkerhetskraven nämns inte alls. Utan dem blir testbäddsspecifikationen svår att lita på för externa aktörer.",
      nastasteg:
        "Föreslagna nästa steg: (1) Gör en snabb workshop med driftpersonal för att lista begränsningar ni annars glömmer. (2) Definiera minimikrav för datasäkerhet innan första externa testet. (3) Gå vidare till steg A4 och koppla infrastrukturen till en konkret testprocess.",
    },
    a8: {
      formulera:
        "Ett utkast till sammanfattning: \"Etableringsplanen visar att testbädden fyller [syfte] för [målgrupp]. Specifikation, aktörskonstellation och juridik är på plats. Största kvarstående risk är [risk]. Beslut som krävs: [beslut]. Tidslinje: [period].\" Fyll i det som är specifikt för er.",
      granska:
        "Planen är stark på struktur, men riskavsnittet känns tunt — jag ser bara en risk nämnd. Testbäddar brukar möta minst tre typer av risk: finansiering, bemanning och efterfrågan. Har ni tagit ställning till samtliga?",
      nastasteg:
        "Nästa steg: (1) Boka in ett beslutsmöte med ledningen och skicka planen i förväg. (2) Komplettera riskanalysen med finansierings- och bemanningsrisker. (3) Sätt datum för en uppföljning 3 månader efter start.",
    },
  },
  driva: {
    b1: {
      formulera:
        "Ett förslag på hur du kan sammanfatta hälsokontrollen: \"Testbäddens syfte är fortsatt relevant men behöver skärpas kring [aspekt]. Mandatet är tydligt på operativ nivå men otydligt på strategisk/politisk nivå. Rapportering till ledning sker [frekvens], men saknar [innehåll].\"",
      granska:
        "Jag ser att ni bekräftar att syftet gäller, men svaret på om det är kommunicerat är otydligt — det är en viktig skillnad. Ett syfte som bara finns i ditt huvud skyddar inte testbädden vid nästa budgetdiskussion. Är rapporteringen till ledningen dokumenterad eller muntlig?",
      nastasteg:
        "Rekommenderade nästa steg: (1) Skriv ner och dela den uppdaterade syftesformuleringen med ledningsgruppen. (2) Boka ett kort möte för att tydliggöra mandatet på strategisk nivå. (3) Gå vidare till B2 och granska om infrastrukturen fortfarande matchar syftet.",
    },
    b6: {
      formulera:
        "Ett förslag på prioritering: \"Baserat på hälsokontrollen är de tre viktigaste förbättringsområdena: (1) [område med störst gap], (2) [område med snabbast effekt], (3) [område som kräver externt beslut]. Ansvarig för respektive område: [namn/roll]. Klart senast: [datum].\"",
      granska:
        "Du har identifierat flera förbättringsområden, men det är oklart vilka som faktiskt ger mest effekt kontra insats. Överväg att rangordna efter både \"hur enkelt\" och \"hur stor skillnad det gör\" — annars riskerar ni att fastna i det som känns akut snarare än det som är viktigast.",
      nastasteg:
        "Nästa steg: (1) Vikta de identifierade områdena mot insats och effekt. (2) Utse en ansvarig per prioriterat område denna vecka. (3) Gå vidare till B7 och undersök om något av förbättringsarbetet också öppnar för skalning.",
    },
  },
  skala: {
    s1: {
      formulera:
        "Ett förslag på hur ni kan motivera skalningsambitionen: \"Testbädden har varit i stabil drift sedan [period] och vi ser [signal på efterfrågan/effekt]. Vi vill skala [upp/ut/djupt] för att [anledning]. Största risken med att vänta är [risk].\"",
      granska:
        "Jag ser att ni pekar på en anledning till skalning, men det är otydligt om grundkapaciteten faktiskt är stabil ännu — har ni belägg för att den håller, eller är det en förhoppning? Fundera också på om rätt beslutsfattare verkligen är identifierade, inte bara informerade.",
      nastasteg:
        "Rekommenderade nästa steg: (1) Samla konkreta belägg för att grundkapaciteten är stabil (t.ex. antal genomförda tester utan större incidenter). (2) Boka ett kort avstämningsmöte med beslutsfattarna. (3) Gå vidare till S2 och granska om infrastrukturen håller för skalning.",
    },
    s2: {
      formulera:
        "Ett förslag på hur ni kan beskriva infrastrukturens skalbarhet: \"Nuvarande infrastruktur klarar [antal] samtidiga tester/användare. Vid skalning till [ny volym/plats] är [specifik del] den största flaskhalsen. Investeringsbehovet uppskattas till [omfattning].\"",
      granska:
        "Ni har identifierat att infrastrukturen fungerar idag, men det är oklart var taket går — vid vilken volym börjar den brista? Utan en uppskattad gräns blir det svårt att veta om ni skalar in i ett problem.",
      nastasteg:
        "Föreslagna nästa steg: (1) Uppskatta ett konkret kapacitetstak för nuvarande infrastruktur. (2) Prioritera vilken flaskhals som måste lösas först. (3) Gå vidare till S3 och granska om arbetssättet håller för samma skalning.",
    },
  },
};

const genericFallback: Record<AiButtonType, (step: Step) => string> = {
  formulera: (step) =>
    `Utifrån dina anteckningar i "${step.title}" kan de kokas ner till en tydligare formulering: fokusera på att koppla ditt svar direkt till "${step.doneWhen.toLowerCase()}". Försök skriva det i 2–3 konkreta meningar snarare än en lista av tankar.`,
  granska: (step) =>
    `Jag har läst igenom dina svar för "${step.title}". Kontrollera särskilt att de täcker det som beskrivs under "Varför är detta viktigt?" — det är lätt att svara på frågorna var för sig utan att koppla ihop dem till en sammanhängande bild.`,
  nastasteg: (step) =>
    `Baserat på var du är i "${step.title}": stäm först av att checklistan är ikryssad, komplettera sedan svar som känns tunna. När "${step.doneWhen.toLowerCase()}" stämmer är ni redo att gå vidare till nästa steg.`,
};

export function getAiResponse(
  track: TrackId,
  step: Step,
  buttonType: AiButtonType
): string {
  const specific = aiMocks[track]?.[step.id]?.[buttonType];
  if (specific) return specific;
  return genericFallback[buttonType](step);
}

export const aiButtonLabels: Record<AiButtonType, string> = {
  formulera: "Hjälp mig formulera",
  granska: "Granska mina svar",
  nastasteg: "Föreslå nästa steg",
};
