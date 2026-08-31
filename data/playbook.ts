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
  points: string[]
): MeasurementArea {
  return { id, title, description, points };
}

// ─────────────────────────────────────────────────────────
// MÄTOMRÅDEN — de fyra kapacitetsområdena i testbäddsförmåga
// (fysisk/digital infrastruktur, arbetssätt/metoder/processer,
// population/data, förvaltning/samverkan/kompetens)
// ─────────────────────────────────────────────────────────

const infrastrukturAreas: MeasurementArea[] = [
  ma(
    "beskriv-testmiljoerna",
    "Beskriv testmiljöerna",
    "Dokumentera vilka fysiska, virtuella och möjliggörande testmiljöer (el, nätverk, sensorer) som finns tillgängliga, inklusive begränsningar. Inkludera vilka produkter, tjänster och processer som kan testas och hur.",
    [
      "Vilken typ av infrastruktur består testmiljön av (fysisk/verklig, digital/virtuell, simulerad)?",
      "Finns det en beskrivning av testmiljön?",
      "Är funktioner, teknik, lokalisering och organisation dokumenterade?",
      "Är tjänsteutbud, kapacitet och begränsningar dokumenterade?",
    ]
  ),
  ma(
    "testbaddsspecifikation",
    "Formulera en testbäddsspecifikation",
    "Samla kartläggningen i ett samlat dokument som beskriver funktioner, egenskaper, gränssnitt, teknisk lösning, lokalisering, organisation, kompetensprofil och tjänsteutbud.",
    [
      "Finns en samlad testbäddsspecifikation?",
      "Är specifikationen godkänd och kommunicerad internt?",
      "Är gränssnitt och teknisk lösning beskrivna?",
    ]
  ),
  ma(
    "stod-for-datainsamling",
    "Säkerställ stöd för datainsamling",
    "Identifiera processer, mätvärden och verktyg för att dokumentera och följa upp testaktiviteterna.",
    [
      "Finns verktyg och stöd för dokumentation och datainsamling tillgängliga?",
      "Är mätvärden för uppföljning definierade?",
    ]
  ),
  ma(
    "sakerhetsrutiner",
    "Definiera säkerhetsrutiner",
    "Alla nödvändiga säkerhetsprocedurer, utrustningshantering och nödmekanismer ska vara definierade, godkända och kommunicerade.",
    [
      "Är säkerhetsprocedurer definierade och godkända?",
      "Är säkerhetsrutinerna kommunicerade till alla som använder testmiljön?",
      "Stödjer infrastrukturen olika användarnivåer, från nybörjare till expert?",
    ]
  ),
];

const metoderAreas: MeasurementArea[] = [
  ma(
    "beskriv-testprocessen",
    "Beskriv testprocessen",
    "Dokumentera hur ett test går till från idé till avslut, så att arbetssättet inte är beroende av en enskild person.",
    [
      "Finns en beskriven process för hur ett test genomförs, steg för steg?",
      "Är roller och ansvar i processen tydliga?",
    ]
  ),
  ma(
    "rutiner-checklistor-mallar",
    "Skapa rutiner, checklistor och mallar",
    "Praktiska verktyg som gör att arbetssättet kan upprepas konsekvent oavsett vem som genomför testet.",
    [
      "Finns checklistor eller mallar för att förbereda och genomföra tester?",
      "Är avtalsmallar för IP och juridik förberedda?",
    ]
  ),
  ma(
    "metoder-for-samskapande",
    "Definiera metoder för samskapande",
    "Metoder för tjänstedesign, UX och living labs är en grundpelare i ett institutionaliserat arbetssätt.",
    [
      "Används metoder för samskapande (tjänstedesign, UX, living labs) aktivt?",
      "Är metoderna kända av fler än en person i organisationen?",
    ]
  ),
  ma(
    "foljupp-arbetssattet",
    "Följ upp och förbättra arbetssättet",
    "Metoder som inte underhålls blir föråldrade och riskerar att sluta användas.",
    [
      "Finns en rutin för att regelbundet granska och justera arbetssätten?",
      "Mäts effekter av arbetssättet, inte bara aktiviteter?",
    ]
  ),
];

const populationDataAreas: MeasurementArea[] = [
  ma(
    "definiera-population",
    "Definiera deltagare och population",
    "Vilka som testar, hur de rekryteras och hur representativa de är för målgruppen.",
    [
      "Är målgruppen/populationen för tester definierad?",
      "Finns en rutin för att rekrytera testdeltagare?",
      "Är de första prioriterade testanvändarna identifierade?",
    ]
  ),
  ma(
    "hantera-personuppgifter",
    "Hantera personuppgifter enligt GDPR",
    "Vilka personuppgifter som samlas in, med vilket rättsligt stöd, och hur en konsekvensbedömning (DPIA) genomförs.",
    [
      "Är det klarlagt vilka personuppgifter som samlas in och varför?",
      "Är en DPIA genomförd eller planerad vid behov?",
      "Är DPO involverad i arbetet?",
    ]
  ),
  ma(
    "samtycke-sekretess",
    "Säkerställ samtycke och sekretess",
    "Deltagarna ska veta vad de går med på och kunna lita på att data och affärshemligheter skyddas.",
    [
      "Finns en tydlig process för informerat samtycke?",
      "Kan deltagarnas sekretess och eventuella affärshemligheter garanteras?",
    ]
  ),
  ma(
    "agarskap-data",
    "Klargör ägarskap av data och resultat",
    "Vem som äger data, resultat och immateriella rättigheter som uppstår i testbädden.",
    [
      "Är det klart vem som äger data och resultat från tester?",
      "Finns avtal för immateriella rättigheter (IP) på plats?",
    ]
  ),
];

const forvaltningSamverkanAreas: MeasurementArea[] = [
  ma(
    "kartlagg-aktorer",
    "Kartlägg aktörer och roller",
    "Vilka organisationer (akademi, näringsliv, civilsamhälle, kommun) som behöver vara med och vilket ansvar var och en har.",
    [
      "Är nyckelaktörer identifierade och kontaktade?",
      "Är roller och ansvar per aktör definierade?",
      "Säkerställs konkurrensneutralitet gentemot deltagande företag?",
    ]
  ),
  ma(
    "sakra-kompetens",
    "Säkra kompetens och bemanning",
    "Testbäddskompetens (testdesign, facilitering, GDPR, förändringsledning) måste tränas och underhållas, inte bara finnas i en persons huvud.",
    [
      "Finns personella resurser med definierade roller och ansvar?",
      "Finns en plan för kompetensutveckling?",
      "Är framtida kompetensgap identifierade och adresserade?",
    ]
  ),
  ma(
    "styrning-mandat",
    "Bygg styrning och mandat",
    "Tydligt mandat på operativ, strategisk och politisk nivå gör att testbädden överlever personalbyten och budgetdiskussioner.",
    [
      "Är mandat och ansvar tydliga på operativ, strategisk och politisk nivå?",
      "Finns en rutin för rapportering till ledningen?",
    ]
  ),
  ma(
    "natverk-erfarenhetsutbyte",
    "Delta i nätverk och erfarenhetsutbyte",
    "Aktivt deltagande i nätverk (t.ex. ENoLL) ger tillgång till kunskap och legitimitet utåt.",
    [
      "Deltar ni aktivt i relevanta nätverk för erfarenhetsutbyte?",
      "Sprids lärdomar och resultat till andra som kan ha nytta av dem?",
    ]
  ),
];

// ─────────────────────────────────────────────────────────
// SPÅR A — ETABLERA EN TESTBÄDD
// ─────────────────────────────────────────────────────────

const stepsA: Step[] = [
  {
    id: "a1",
    title: "Definiera syfte och värde",
    intro:
      "Grunden för allt. En testbädd utan tydligt och förankrat syfte riskerar att bli en lösning som söker sitt problem.",
    why: "En väldefinierad målsättning är förutsättningen för att kunna kommunicera erbjudandet, attrahera rätt aktörer och mäta om testbädden faktiskt gör nytta. Utan syfte — ingen riktning.",
    questions: [
      q("q1", "Vilket samhällsproblem eller vilken utmaning ska testbädden bidra till att lösa?"),
      q("q2", "För vem skapar testbädden värde — och hur vet vi det?"),
      q("q3", "Varför behövs en testbädd snarare än ett vanligt projekt, pilot eller labb?"),
      q("q4", "Vilken nytta vill ni skapa — miljömässig, samhällelig, ekonomisk?"),
      q("q5", "Hur kan nyttan följas upp och mätas?"),
      q("q6", "Vilket beslut behöver fattas för att gå vidare?"),
    ],
    checklist: [
      "Syftet är formulerat och förankrat",
      "Målgruppen är identifierad",
      "Nyttan är beskriven och mätbar",
      "Beslutsunderlaget för nästa steg är klart",
    ],
    doneWhen:
      "Du kan i en mening beskriva varför testbädden behövs, för vem den skapar värde och vad som behöver hända för att gå vidare.",
  },
  {
    id: "a2",
    title: "Kartlägg omvärld och positionering",
    intro:
      "Förstå var er testbädd passar in — i den egna organisationen och i det bredare innovationsekosystemet.",
    why: "Omvärldsanalys minskar risken att ni bygger något som redan finns, och ökar chansen att hitta rätt partners och finansiering. Den visar också var ni kan bidra med något unikt.",
    questions: [
      q("q1", "Vilka liknande testbäddar eller initiativ finns lokalt, nationellt och internationellt?"),
      q("q2", "Vad gör er testbädd unik jämfört med dessa?"),
      q("q3", "Var i innovationsekosystemets värdekedja passar ni in?"),
      q("q4", "Vilka organisationer borde ni samarbeta med — och varför?"),
      q("q5", "Finns det risker med att positionera er på detta sätt?"),
    ],
    checklist: [
      "Omvärldsanalys är genomförd",
      "Liknande initiativ är identifierade",
      "Er unika position är formulerad",
      "Relevanta samarbetspartners är listade",
    ],
    doneWhen:
      "Ni kan förklara vad som gör er testbädd unik och var den passar in i innovationslandskapet.",
  },
  {
    id: "a3",
    title: "Beskriv infrastruktur och testmiljö",
    intro:
      "Kartlägg vad ni faktiskt kan erbjuda — fysiskt, digitalt och organisatoriskt. Det är grunden för testbäddsspecifikationen.",
    why: "En testbädd består av både hårdvara (fysisk infrastruktur, utrustning, mätmetoder) och mjukvara (kompetens, organisation, tjänsteutbud, arbetssätt). Att kartlägga och integrera båda dimensionerna är avgörande för att kunna erbjuda något med verkligt värde.",
    questions: [
      q("q1", "Vilken fysisk testmiljö finns tillgänglig — och vad kan testas där?"),
      q("q2", "Finns digital eller virtuell testmiljö? Vad kan den användas till?"),
      q("q3", "Vilken möjliggörande infrastruktur finns (el, nätverk, sensorer)?"),
      q("q4", "Vilka begränsningar har testmiljön — vad kan INTE testas?"),
      q("q5", "Hur samlas data in och dokumenteras under ett test?"),
      q("q6", "Vilka säkerhetskrav och säkerhetsprocedurer gäller?"),
    ],
    checklist: [
      "Fysisk testmiljö är beskriven inklusive begränsningar",
      "Digital/virtuell miljö är beskriven (eller markerad ej relevant)",
      "Möjliggörande infrastruktur är dokumenterad",
      "Datainsamling och dokumentationsprocess är definierad",
      "Säkerhetskrav är identifierade",
    ],
    measurementAreas: infrastrukturAreas,
    capacityArea: "infrastruktur",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet fysisk och digital infrastruktur just nu? Motivera kort i egna ord.",
    doneWhen:
      "Ni kan visa en testbäddsspecifikation som beskriver funktioner, begränsningar, infrastruktur och säkerhetskrav.",
  },
  {
    id: "a4",
    title: "Definiera metoder och arbetssätt",
    intro:
      "Hur ska tester faktiskt genomföras? Utan ett beskrivet arbetssätt är varje test beroende av att rätt person råkar vara på plats.",
    why: "Ett institutionaliserat arbetssätt — ett som överlever personalbyten — är skillnaden mellan en testbädd och ett personberoende projekt. Metoder för samskapande är inte ett tillval utan en grundpelare enligt ENoLL-standard.",
    questions: [
      q("q1", "Hur ser processen ut för ett test — från idé till avslut?"),
      q("q2", "Vilka rutiner, checklistor och mallar behövs?"),
      q("q3", "Hur hanteras avtal, immateriella rättigheter och juridiska frågor?"),
      q("q4", "Vilka metoder för samskapande (UX, tjänstedesign, living labs) ska användas?"),
      q("q5", "Hur följs arbetssätten upp och förbättras löpande?"),
    ],
    checklist: [
      "Testprocess (steg för steg) är beskriven",
      "Rutiner och checklistor är skapade",
      "Avtalsprocedurer är definierade",
      "Metoder för samskapande är identifierade",
    ],
    measurementAreas: metoderAreas,
    capacityArea: "metoder",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet arbetssätt, metoder och processer just nu? Motivera kort i egna ord.",
    doneWhen:
      "En person som aldrig arbetat i testbädden ska kunna genomföra ett test med hjälp av era rutiner och checklistor.",
  },
  {
    id: "a5",
    title: "Bygg aktörskonstellation",
    intro:
      "Vilka organisationer och kompetenser behöver vara med? En stark aktörskonstellation ökar kvaliteten och legitimiteten.",
    why: "Testbäddar med bred representation — triple helix, SME, internationella aktörer, slutanvändare — genererar resultat som är mer generaliserbara och lättare att implementera. Konkurrensneutralitet är avgörande för förtroendet.",
    questions: [
      q("q1", "Vilka aktörer (akademi, näringsliv, civilsamhälle, kommunen) behöver vara med?"),
      q("q2", "Vilka roller och ansvar ska varje aktör ha?"),
      q("q3", "Hur säkerställs konkurrensneutralitet?"),
      q("q4", "Vilka slutanvändare ska involveras — och hur tidigt?"),
      q("q5", "Hur rekryteras de första 10+ prioriterade testanvändarna?"),
    ],
    checklist: [
      "Nyckelaktörer är identifierade och kontaktade",
      "Roller och ansvar är definierade",
      "Slutanvändare är identifierade",
      "Listan med prioriterade testanvändare är påbörjad",
    ],
    measurementAreas: forvaltningSamverkanAreas,
    capacityArea: "forvaltning",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet förvaltning, samverkan och kompetens just nu? Motivera kort i egna ord.",
    doneWhen:
      "Ni har en tydlig bild av vilka aktörer som behövs, vad de bidrar med och hur ni ska nå de första testanvändarna.",
  },
  {
    id: "a6",
    title: "Planera data, säkerhet och juridik",
    intro:
      "GDPR, etik och datasäkerhet är inte efterhandstankar — de måste byggas in från start.",
    why: "Att involvera DPO och göra en DPIA (konsekvensbedömning) tidigt sparar tid och bygger förtroende. Rutiner för informationshantering som bara finns på papper skyddar ingen. Juridiska oklarheter kring IP skapar konflikter i efterhand.",
    questions: [
      q("q1", "Vilka personuppgifter samlas in och med vilket stöd i GDPR?"),
      q("q2", "Har en DPIA (konsekvensbedömning) genomförts eller planeras?"),
      q("q3", "Hur informeras och samtycker deltagare?"),
      q("q4", "Vem äger data och resultat som uppstår i testbädden?"),
      q("q5", "Vilka säkerhetsrutiner gäller för informationshantering?"),
      q("q6", "Finns tillgång till juridisk kompetens och DPO?"),
    ],
    checklist: [
      "GDPR-analys är genomförd",
      "Samtyckesprocess är definierad",
      "IP-avtal är förberedda",
      "DPO är involverad",
      "Säkerhetsrutiner är dokumenterade",
    ],
    measurementAreas: populationDataAreas,
    capacityArea: "population",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet population och data just nu? Motivera kort i egna ord.",
    doneWhen:
      "Ni kan genomföra ett test med externa deltagare utan juridisk och etisk exponering.",
  },
  {
    id: "a7",
    title: "Kommunikation och spridning",
    intro:
      "Vem ska veta om testbädden, när och via vilka kanaler? En testbädd ingen känner till är en testbädd ingen använder.",
    why: "Kommunikationsplanen ska täcka tre nivåer: intern kommunikation (medarbetare förstår vad som testas), extern kommunikation till testdeltagare (deras rättigheter och roll), och spridning av resultat (till de som kan agera på dem).",
    questions: [
      q("q1", "Vem behöver informeras om testbädden — internt och externt?"),
      q("q2", "Vilka kanaler ska användas för att nå testanvändare?"),
      q("q3", "Vem är ansvarig för kommunikationen?"),
      q("q4", "Hur sprids resultat till dem som kan implementera?"),
      q("q5", "Hur bidrar kommunikationen till organisatoriskt lärande?"),
    ],
    checklist: [
      "Kommunikationsplan är skapad",
      "Intern kommunikation är planerad",
      "Externa kanaler är identifierade",
      "Ansvarig för kommunikation är utsedd",
    ],
    doneWhen:
      "Ni har en kommunikationsplan med utpekad ansvarig, kända kanaler och tydlig plan för resultatspridning.",
  },
  {
    id: "a8",
    title: "Sammanställ etableringsplan",
    intro:
      "Samla allt arbete i ett samlat dokument — er etableringsplan. Det är underlaget för beslut och uppföljning.",
    why: "En etableringsplan gör arbetet kommunicerbart till ledning, partners och finansiärer. Den sätter också en baslinje att mäta framtida utveckling mot.",
    questions: [
      q("q1", "Vad är de tre viktigaste besluten som behöver fattas nu?"),
      q("q2", "Vilka risker ser ni — och vad är åtgärdsplanen?"),
      q("q3", "Vad behövs i budget och resurser för att komma igång?"),
      q("q4", "Vilka tillstånd eller certifieringar krävs?"),
      q("q5", "Vad är er tidslinje för de första 6 månaderna?"),
    ],
    checklist: [
      "Syfte och positionering är dokumenterade",
      "Testbäddsspecifikation är klar",
      "Aktörskonstellation är definierad",
      "Data- och juridikplan är på plats",
      "Kommunikationsplan är klar",
      "Budget och resurser är identifierade",
      "Riskanalys är genomförd",
    ],
    doneWhen:
      "Ni har ett dokument som kan presenteras för ledning och används som underlag för att fatta beslut om att gå vidare.",
  },
];

// ─────────────────────────────────────────────────────────
// SPÅR B — DRIVA EN BEFINTLIG TESTBÄDD
// ─────────────────────────────────────────────────────────

const stepsB: Step[] = [
  {
    id: "b1",
    title: "Hälsokontroll: syfte och styrning",
    intro:
      "Börja med det viktigaste: gäller fortfarande syftet ni startade med? Sustainability-fasen handlar om att ompröva, uppdatera och förankra på nytt.",
    why: "Syften som förskjuts utan att omformuleras skapar otydlighet och konflikter. Mandat som en gång var tydliga kan ha urholkats. Att börja med en ärlig genomgång är grunden för allt annat.",
    questions: [
      q("q1", "Är testbäddens syfte fortfarande relevant och förankrat?"),
      q("q2", "Har syftet förändrats — och är det i så fall kommunicerat?"),
      q("q3", "Är ansvarsförhållanden och mandat tydliga (operativt, strategiskt, politiskt)?"),
      q("q4", "Rapporteras resultat och status regelbundet till ledningen?"),
      q("q5", "Finns öppenhet och transparens i kommunikationen uppåt?"),
    ],
    checklist: [
      "Syfte är bekräftat eller uppdaterat",
      "Mandat är klart på alla tre nivåer",
      "Rapporteringsrutin till ledning finns",
    ],
    doneWhen:
      "Ni vet om nuvarande syfte och mandat fortfarande håller — eller vad som behöver omformuleras.",
  },
  {
    id: "b2",
    title: "Granska infrastruktur",
    intro:
      "Uppfyller testmiljön fortfarande sina funktionskrav? Teknik utvecklas, användargrupper förändras och behov förskjuts.",
    why: "Investering i utrustning utan motsvarande kompetens- och arbetssättsutveckling skapar kapacitet ingen kan använda fullt ut. Balansen mellan hårdvara och mjukvara är en kontinuerlig uppgift.",
    questions: [
      q("q1", "Uppfyller den fysiska miljön fortfarande utrymmes- och funktionskraven?"),
      q("q2", "Är infrastrukturen anpassad till olika användarnivåer?"),
      q("q3", "Är mätvärden och övervakningsprocesser relevanta och aktiva?"),
      q("q4", "Är personalen tränad och uppdaterad på säkerhetsprocedurer?"),
      q("q5", "Är utvecklingen balanserad mellan hårdvara och mjukvara?"),
    ],
    checklist: [
      "Fysisk miljö är granskad mot funktionskrav",
      "Användarnivåanpassning är bekräftad",
      "Säkerhetsrutiner är kända och praktiserade",
      "Balans hårdvara/mjukvara är bedömd",
    ],
    measurementAreas: infrastrukturAreas,
    capacityArea: "infrastruktur",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet fysisk och digital infrastruktur just nu? Motivera kort i egna ord.",
    doneWhen:
      "Ni vet vad som fungerar, vad som behöver uppdateras och om infrastrukturen fortfarande passar ändamålet.",
  },
  {
    id: "b3",
    title: "Granska metoder och arbetssätt",
    intro:
      "Lever metoderna i organisationen — eller är de bara beskriven på papper? Den avgörande frågan: om nyckelpersonen slutade imorgon, skulle arbetssättet överleva?",
    why: "Metoder som inte underhålls blir föråldrade. En plattform som är implementerad men inte används underminerar hela arbetssättet. Att bygga in systematisk uppföljning är skillnaden mellan en levande testbädd och ett personberoende projekt.",
    questions: [
      q("q1", "Är arbetssätten institutionaliserade (kända, använda, med tydlig ägare)?"),
      q("q2", "Följs de upp och justeras baserat på konkreta lärdomar?"),
      q("q3", "Fungerar den tekniska plattformen och stödjer den — inte hindrar — processerna?"),
      q("q4", "Finns en rutin för regelbunden metodgranskning?"),
      q("q5", "Mäter ni effekter och inte bara aktiviteter?"),
    ],
    checklist: [
      "Metoder är institutionaliserade",
      "Uppföljningsrutin finns och används",
      "Teknisk plattform fungerar",
      "Effektmätning är på plats",
    ],
    measurementAreas: metoderAreas,
    capacityArea: "metoder",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet arbetssätt, metoder och processer just nu? Motivera kort i egna ord.",
    doneWhen:
      "Era metoder kan beskrivas av fler än en person och justeras löpande baserat på vad ni lär er.",
  },
  {
    id: "b4",
    title: "Granska människor, data och etik",
    intro:
      "Rutiner för GDPR och etik som bara finns på papper skyddar ingen. Här granskar ni om de lever i organisationen.",
    why: "Etik är inte ett dokument som skrivs en gång — det ska praktiseras. Företag och medborgare som testar behöver vara trygga med att deras data och affärshemligheter skyddas. GDPR-paralys (att inte samla in data alls av juridisk osäkerhet) är lika problematiskt som bristande skydd.",
    questions: [
      q("q1", "Är rutiner för datasäkerhet kända, accepterade och använda?"),
      q("q2", "Kan testanvändarnas sekretess säkerställas?"),
      q("q3", "Finns rutiner för användardata (före, under, efter test) inklusive samtycke?"),
      q("q4", "Används mallar för risk- och säkerhetsbedömning aktivt?"),
      q("q5", "Finns avtal för immateriella rättigheter?"),
      q("q6", "Finns pågående efterfrågan och potentiella nya marknader?"),
    ],
    checklist: [
      "Datasäkerhetsrutiner är levande",
      "Samtyckesprocess fungerar i praktiken",
      "IP-avtal är på plats",
      "Aktiv efterfrågan är bekräftad",
    ],
    measurementAreas: populationDataAreas,
    capacityArea: "population",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet population och data just nu? Motivera kort i egna ord.",
    doneWhen:
      "Ni kan genomföra ett test med externa deltagare med full datajuridisk och etisk säkerhet.",
  },
  {
    id: "b5",
    title: "Granska kompetens och organisation",
    intro:
      "Är rätt kompetens på plats — och vad händer om den försvinner? Adressera kompetensgap proaktivt, inte reaktivt.",
    why: "Testbäddskompetens — testdesign, facilitering, datainsamling, GDPR, förändringsledning — är inte medfödd. Den måste tränas och underhållas. Personberoende är den vanligaste orsaken till att testbäddar kollapsar.",
    questions: [
      q("q1", "Finns personella resurser med definierade roller och ansvar?"),
      q("q2", "Finns utpekat ansvar för sammanställning och återrapportering?"),
      q("q3", "Finns arbetssätt för kompetensutveckling och lärande?"),
      q("q4", "Adresseras framtida kompetensgap proaktivt?"),
      q("q5", "Deltar ni aktivt i nätverk för erfarenhetsutbyte?"),
    ],
    checklist: [
      "Rollstrukturen är tydlig och bemannad",
      "Återrapporteringsansvar är utpekat",
      "Kompetensutvecklingsplan finns",
      "Nätverksdeltagande är aktivt",
    ],
    measurementAreas: forvaltningSamverkanAreas,
    capacityArea: "forvaltning",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet förvaltning, samverkan och kompetens just nu? Motivera kort i egna ord.",
    doneWhen:
      "Testbäddskompetensen sitter i organisationen, inte bara i en persons huvud.",
  },
  {
    id: "b6",
    title: "Prioritera förbättringar",
    intro:
      "Baserat på hälsokontrollen: vad är viktigast att förbättra? Välj 3–5 prioriteringar och gör en konkret plan.",
    why: "Utan prioritering blir förbättringsarbete överväldigande eller stannar på idéstadiet. En konkret förbättringsplan med ansvar och tidslinje gör skillnaden.",
    questions: [
      q("q1", "Vilka tre områden har störst förbättringspotential?"),
      q("q2", "Vad är enklast att åtgärda och ger snabbast effekt?"),
      q("q3", "Vad kräver resurser eller beslut utifrån?"),
      q("q4", "Vem ansvarar för vad och när ska det vara klart?"),
      q("q5", "Hur vet ni att förbättringen har gjort skillnad?"),
    ],
    checklist: [
      "Top 3 förbättringsområden är identifierade",
      "Ansvariga är utsedda",
      "Tidslinje är satt",
      "Framgångsmått är definierade",
    ],
    doneWhen: "Ni har en förbättringsplan med tydligt ansvar och mätbara mål.",
  },
  {
    id: "b7",
    title: "Planera skalning",
    intro:
      "Skalning handlar inte bara om att göra mer av samma sak. Det finns tre dimensioner: upp (nå fler), ut (sprida principer) och djupt (förändra system).",
    why: "ENoLL:s self-assessment ger ramverket för att utvärdera skalningsförmåga. En diversifierad finansieringsmodell och aktiva nätverk är förutsättningarna för långsiktig hållbarhet.",
    questions: [
      q("q1", "Kan era metoder/infrastrukturer replikeras av andra?"),
      q("q2", "Vilka principer och verktyg kan spridas till andra organisationer?"),
      q("q3", "Hur kan ni fördjupa impact inom er befintliga kontext?"),
      q("q4", "Hur ser finansieringsmodellen ut — är den diversifierad?"),
      q("q5", "Finns en roadmap för framtida modulär utveckling?"),
    ],
    checklist: [
      "Skalningsdimensioner (upp/ut/djupt) är diskuterade",
      "Roadmap är påbörjad",
      "Finansieringsmodell är granskad",
      "Nätverkssamarbeten är identifierade",
    ],
    doneWhen: "Ni vet i vilken riktning ni vill växa och vad som krävs för att komma dit.",
  },
  {
    id: "b8",
    title: "Sammanställ förbättrings- och uppföljningsplan",
    intro:
      "Samla hälsokontroll, förbättringar och skalningsplan i ett dokument. Det är er plan för nästa period.",
    why: "En testbädds årsrapport — med genomförda tester, realiserade nyttor, kostnader och lärdomar — bygger förtroende hos ledning, finansiärer och partners.",
    questions: [
      q("q1", "Vad är testbäddens status just nu — vad fungerar, vad saknas?"),
      q("q2", "Vilka nyttor har realiserats under senaste perioden?"),
      q("q3", "Vad är de 3 viktigaste prioriteringarna framåt?"),
      q("q4", "Vilka resurser krävs och vad är tidslinjen?"),
      q("q5", "Hur ska planen kommuniceras till ledning och partners?"),
    ],
    checklist: [
      "Hälsokontroll är sammanfattad",
      "Realiserade nyttor är dokumenterade",
      "Förbättringsplan med ansvar är klar",
      "Skalningsplan är bifogad",
      "Uppföljningsplan för nästa period är satt",
    ],
    doneWhen:
      "Ni har ett dokument som kan presenteras för ledning och används som underlag för nästa periods arbete.",
  },
];

// ─────────────────────────────────────────────────────────
// SPÅR C — SKALA EN TESTBÄDD
// ─────────────────────────────────────────────────────────

const stepsC: Step[] = [
  {
    id: "s1",
    title: "Bekräfta mognad och skalningsambition",
    intro:
      "Innan ni skalar: är testbädden redo? Skalning bygger vidare på en testbädd som redan fungerar i drift — annars skalar ni bara problemen.",
    why: "Att skala för tidigt är en vanlig fälla. ENoLL:s modell bygger på att grundkapaciteten redan är stabil (etablera, driva) innan man tar nästa steg mot att skala.",
    questions: [
      q("q1", "Har testbädden varit i drift tillräckligt länge för att ni vet vad som fungerar?"),
      q("q2", "Vad är den huvudsakliga anledningen till att ni vill skala — efterfrågan, effekt eller finansiering?"),
      q("q3", "Vilken av skalningsdimensionerna (upp, ut, djupt) känns mest relevant just nu?"),
      q("q4", "Vilka risker finns med att skala för tidigt?"),
      q("q5", "Vem behöver vara med och besluta om skalning?"),
    ],
    checklist: [
      "Grundkapaciteten är bekräftad som stabil",
      "Anledningen till skalning är tydlig",
      "Rätt beslutsfattare är identifierade",
    ],
    doneWhen:
      "Ni kan motivera varför testbädden är redo att skala, och i vilken riktning.",
  },
  {
    id: "s2",
    title: "Skala: Infrastruktur",
    intro:
      "Kan infrastrukturen bära fler användare, fler samtidiga tester eller nya platser? Skalning ställer nya krav på kapacitet.",
    why: "Infrastruktur som fungerar för ett fåtal pilotanvändare kan brista vid skalning — i kapacitet, säkerhet eller support. Att stämma av infrastrukturen mot skalningsplanen förhindrar överraskningar.",
    questions: [
      q("q1", "Klarar infrastrukturen fler samtidiga tester eller användare?"),
      q("q2", "Kan testmiljön repliceras till en ny plats eller organisation?"),
      q("q3", "Vilka delar av infrastrukturen är flaskhalsar vid skalning?"),
      q("q4", "Behöver ni investera i ny utrustning eller kapacitet för att skala?"),
    ],
    checklist: [
      "Kapacitetstak för nuvarande infrastruktur är kartlagt",
      "Flaskhalsar vid skalning är identifierade",
      "Investeringsbehov är bedömt",
    ],
    measurementAreas: infrastrukturAreas,
    capacityArea: "infrastruktur",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet fysisk och digital infrastruktur, med skalning i åtanke? Motivera kort i egna ord.",
    doneWhen:
      "Ni vet vilka delar av infrastrukturen som håller för skalning och vilka som behöver stärkas först.",
  },
  {
    id: "s3",
    title: "Skala: Arbetssätt, metoder och processer",
    intro:
      "Fungerar arbetssättet även när fler personer, platser eller organisationer använder det? Metoder som bara fungerar för ett litet team håller inte vid skalning.",
    why: "Skalning kräver att metoderna är institutionaliserade nog att läras ut och överföras, inte bara utföras av de som var med och byggde dem.",
    questions: [
      q("q1", "Kan era metoder läras ut till nya team eller organisationer?"),
      q("q2", "Är processerna dokumenterade så att de går att replikera?"),
      q("q3", "Vad skulle behöva förenklas eller standardiseras för att skala arbetssättet?"),
      q("q4", "Har ni testat att någon utanför kärnteamet följer processen självständigt?"),
    ],
    checklist: [
      "Processer är dokumenterade för replikering",
      "Ett standardiseringsbehov är identifierat",
      "Processen är testad av någon utanför kärnteamet",
    ],
    measurementAreas: metoderAreas,
    capacityArea: "metoder",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet arbetssätt, metoder och processer, med skalning i åtanke? Motivera kort i egna ord.",
    doneWhen:
      "Ni vet om arbetssättet går att lära ut och replikera, eller om det fortfarande är personberoende.",
  },
  {
    id: "s4",
    title: "Skala: Population och data",
    intro:
      "Håller er hantering av deltagare och data när volymen ökar? Fler användare betyder fler samtycken, mer data och större ansvar.",
    why: "GDPR-rutiner som fungerar för tio deltagare kan bli en flaskhals vid hundra. Att förbereda datahanteringen för skala förhindrar att den blir en broms senare.",
    questions: [
      q("q1", "Klarar er samtyckesprocess och datahantering en betydligt större population?"),
      q("q2", "Behöver ni automatisera något i hanteringen av deltagare eller data?"),
      q("q3", "Finns det nya målgrupper eller geografier ni vill nå genom skalning?"),
      q("q4", "Hur säkerställer ni datakvalitet när fler samlar in data?"),
    ],
    checklist: [
      "Datahanteringen är stämd av mot en större population",
      "Automatiseringsbehov är identifierat",
      "Nya målgrupper/geografier är kartlagda",
    ],
    measurementAreas: populationDataAreas,
    capacityArea: "population",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet population och data, med skalning i åtanke? Motivera kort i egna ord.",
    doneWhen:
      "Ni vet om er hantering av deltagare och data håller för en betydligt större skala.",
  },
  {
    id: "s5",
    title: "Skala: Förvaltning, samverkan och kompetens",
    intro:
      "Räcker styrningen, kompetensen och partnerskapen för att bära en större testbädd? Skalning är lika mycket en organisationsfråga som en teknisk fråga.",
    why: "De flesta skalningsförsök misslyckas inte på tekniken utan på förvaltningen — otydligt mandat, för få händer, eller partners som inte är redo att växa med er.",
    questions: [
      q("q1", "Räcker nuvarande bemanning och kompetens för en större testbädd?"),
      q("q2", "Vilka nya partners eller aktörer behöver ni för att skala?"),
      q("q3", "Är mandatet och finansieringen säkrad för en längre tidshorisont?"),
      q("q4", "Hur säkerställer ni att kvaliteten hålls när fler är inblandade?"),
    ],
    checklist: [
      "Bemannings- och kompetensbehov är bedömt",
      "Nya partners/aktörer är identifierade",
      "Kvalitetssäkring vid tillväxt är definierad",
    ],
    measurementAreas: forvaltningSamverkanAreas,
    capacityArea: "forvaltning",
    assessmentPrompt:
      "Hur väl uppfyller er testbädd kapacitetsområdet förvaltning, samverkan och kompetens, med skalning i åtanke? Motivera kort i egna ord.",
    doneWhen:
      "Ni vet vilken förvaltningsstruktur och vilka partnerskap som krävs för att bära skalningen.",
  },
  {
    id: "s6",
    title: "Välj skalningsdimension",
    intro:
      "Skalning handlar inte bara om att göra mer av samma sak. Det finns tre dimensioner: upp (nå fler), ut (sprida principer) och djupt (förändra system).",
    why: "ENoLL:s self-assessment ger ramverket för att utvärdera skalningsförmåga. Att medvetet välja dimension gör att insatserna går åt samma håll istället för åt tre olika.",
    questions: [
      q("q1", "Vill ni skala upp — nå fler användare inom samma kontext?"),
      q("q2", "Vill ni skala ut — sprida principer och verktyg till andra organisationer?"),
      q("q3", "Vill ni skala djupt — fördjupa effekten och förändra system inom er befintliga kontext?"),
      q("q4", "Vilken kombination av dimensioner är mest realistisk de kommande 12 månaderna?"),
    ],
    checklist: [
      "Skalningsdimension(er) är vald(a) och motiverad(e)",
      "Målsättning per dimension är formulerad",
    ],
    doneWhen:
      "Ni har valt vilken eller vilka skalningsdimensioner ni satsar på, och varför.",
  },
  {
    id: "s7",
    title: "Säkra finansiering och partnerskap",
    intro:
      "Skalning kostar — i tid, kompetens och kapital. En diversifierad finansieringsmodell och rätt partners avgör om skalningen håller över tid.",
    why: "Testbäddar som är beroende av en enda finansieringskälla är sårbara. Nya partnerskap behövs ofta för att nå nya målgrupper eller geografier.",
    questions: [
      q("q1", "Hur ser finansieringen ut för skalningen — är den diversifierad?"),
      q("q2", "Vilka nya partners behövs, och har ni kontaktat dem?"),
      q("q3", "Vilka avtal eller överenskommelser behöver uppdateras vid skalning?"),
      q("q4", "Vad är den största finansiella risken med skalningen?"),
    ],
    checklist: [
      "Finansieringsmodell för skalning är kartlagd",
      "Nya partners är identifierade eller kontaktade",
      "Avtal som behöver uppdateras är listade",
    ],
    doneWhen:
      "Ni vet hur skalningen finansieras och vilka partnerskap som krävs för att genomföra den.",
  },
  {
    id: "s8",
    title: "Sammanställ skalningsplan",
    intro:
      "Samla mognadsbedömning, kapacitetsgranskning, vald skalningsdimension och finansiering i en samlad skalningsplan.",
    why: "En skalningsplan gör det möjligt att kommunicera ambitionen till ledning, partners och finansiärer — och ger en baslinje att följa upp mot.",
    questions: [
      q("q1", "Vad är de tre viktigaste stegen för att komma igång med skalningen?"),
      q("q2", "Vilka risker är viktigast att bevaka, och vad är åtgärdsplanen?"),
      q("q3", "Vad är tidslinjen för de första 12 månaderna av skalning?"),
      q("q4", "Hur och när ska skalningen följas upp?"),
    ],
    checklist: [
      "Mognad och ambition är dokumenterad",
      "Kapacitetsgranskning (alla fyra områden) är sammanfattad",
      "Vald skalningsdimension är motiverad",
      "Finansiering och partnerskap är på plats",
      "Tidslinje och uppföljningspunkt är satt",
    ],
    doneWhen:
      "Ni har ett dokument som kan presenteras för ledning och användas som underlag för att besluta om skalning.",
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
    "För dig som vill bygga upp ett testbäddserbjudande från grunden.",
  outputs: [
    "Syfte och positionering",
    "Testbäddsspecifikation",
    "Aktörskonstellation",
    "Etableringsplan",
  ],
  stepCount: stepsA.length,
  estimate: "ca 3–5 timmar",
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
    "För dig som ansvarar för en testbädd och vill följa upp, förbättra eller skala förmågan.",
  outputs: [
    "Hälsokontroll",
    "Förbättringsplan",
    "Skalningsplan",
    "Uppföljningsunderlag",
  ],
  stepCount: stepsB.length,
  estimate: "ca 2–4 timmar",
};

const metaC: TrackMeta = {
  id: "skala",
  letter: "C",
  name: "Skala en testbädd",
  shortName: "Skala",
  color: "#2D7A4F",
  light: "#EAF4EE",
  border: "#A9D2B9",
  description:
    "För dig som har en etablerad testbädd och vill sprida, replikera eller fördjupa dess effekt.",
  outputs: [
    "Mognads- och kapacitetsbedömning",
    "Vald skalningsdimension",
    "Finansierings- och partnerskapsplan",
    "Skalningsplan",
  ],
  stepCount: stepsC.length,
  estimate: "ca 2–4 timmar",
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
 * De avbockningsbara punkterna för ett steg. Om steget har strukturerade
 * mätområden slås deras punkter ihop till en platt, indexerad lista
 * (samma ordning som de renderas i) — annars används den enkla checklistan.
 */
export function getChecklistItems(step: Step): string[] {
  if (step.measurementAreas) {
    return step.measurementAreas.flatMap((area) => area.points);
  }
  return step.checklist;
}

// ─────────────────────────────────────────────────────────
// FASINDELNING — varje spårs 8 steg grupperade i 4 tematiska
// faser om 2 steg vardera, för stegöversiktens fasindelade vy.
// Faserna delar spårets egen accentfärg (inte en egen färgskala) —
// färg i appen betyder alltid antingen "vilket spår" eller "vilket
// förmågeområde", aldrig något annat, för att undvika att flera
// färgsystem krockar visuellt.
// ─────────────────────────────────────────────────────────

const PHASES: Record<TrackId, TrackPhase[]> = {
  etablera: [
    { name: "Strategi", estimate: "ca 45 min", stepIds: ["a1", "a2"] },
    { name: "Infrastruktur och metoder", estimate: "ca 45 min", stepIds: ["a3", "a4"] },
    { name: "Aktörer och juridik", estimate: "ca 45 min", stepIds: ["a5", "a6"] },
    { name: "Kommunikation och plan", estimate: "ca 45 min", stepIds: ["a7", "a8"] },
  ],
  driva: [
    { name: "Hälsokontroll", estimate: "ca 45 min", stepIds: ["b1", "b2"] },
    { name: "Metoder och data", estimate: "ca 45 min", stepIds: ["b3", "b4"] },
    { name: "Kompetens och prioritering", estimate: "ca 45 min", stepIds: ["b5", "b6"] },
    { name: "Skalning och plan", estimate: "ca 45 min", stepIds: ["b7", "b8"] },
  ],
  skala: [
    { name: "Mognad och infrastruktur", estimate: "ca 45 min", stepIds: ["s1", "s2"] },
    { name: "Metoder och data", estimate: "ca 45 min", stepIds: ["s3", "s4"] },
    { name: "Förvaltning och dimension", estimate: "ca 45 min", stepIds: ["s5", "s6"] },
    { name: "Finansiering och plan", estimate: "ca 45 min", stepIds: ["s7", "s8"] },
  ],
};

export function getPhases(trackId: TrackId): TrackPhase[] {
  return PHASES[trackId];
}
