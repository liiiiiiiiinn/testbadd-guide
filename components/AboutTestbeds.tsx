const TERMS = [
  {
    term: "Testbädd",
    def: "En fysisk eller virtuell miljö hos en eller flera aktörer där man kan testa en lösning i den offentliga aktörens verksamhet eller infrastruktur. I en testbädd ingår även processer, kompetenser, nätverk och övriga resurser som behövs för att genomföra testet.",
  },
  {
    term: "Test",
    def: "Aktiviteter som prövar, utvärderar och verifierar en lösning.",
  },
  {
    term: "Försöksverksamhet",
    def: "Ett verktyg för att hantera osäkerhet, driva utveckling och stödja lärande i komplexa miljöer. Syftar inte till generaliserbar kunskap som i forskning, utan till praktisk nytta, lärande och beslutsunderlag.",
  },
  {
    term: "Experiment",
    def: "Används ofta inom forskning, när det är en hypotes som ska prövas.",
  },
];

const ENVIRONMENT_TYPES = [
  "Laboratorium",
  "Simulerad/konstruerad miljö",
  "Sandlåda",
  "Living lab",
  "Verklighetsnära testbädd",
  "Demonstrator",
  "Proving-ground",
];

const JOURNEY = [
  "Idé",
  "Kontakt",
  "Bedömning",
  "Matchningsdialog",
  "Överenskommelse",
  "Test",
  "Resultat",
  "Sprid lärdomar",
];

export default function AboutTestbeds() {
  return (
    <section className="rounded-2xl bg-blush px-6 py-10 sm:px-10 sm:py-12 flex flex-col gap-10">
      <div className="flex flex-col items-center text-center gap-1">
        <h2
          className="text-2xl font-semibold text-ink -rotate-2 inline-block"
        >
          Testbädd i ett nötskal
        </h2>
        <p className="text-sm text-muted max-w-md">
          Några begrepp och verktyg från Helsingborgs testbäddsplaybook,
          för dig som är ny på området.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {TERMS.map((t) => (
          <div key={t.term} className="flex flex-col gap-1.5">
            <h3 className="text-base font-medium text-brand">{t.term}</h3>
            <p className="text-sm text-ink/80 leading-relaxed">{t.def}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-blush-border pt-8 flex flex-col gap-3">
        <h3 className="text-base font-medium text-ink">
          Vilken typ av testmiljö erbjuder ni?
        </h3>
        <p className="text-sm text-muted max-w-2xl leading-relaxed">
          Testmiljöer sträcker sig från helt kontrollerade till
          verklighetsnära, och lösningar som testas kan vara allt från en
          tidig idé till redo för nyttiggörande. Vanliga typer:
        </p>
        <div className="flex flex-wrap gap-2">
          {ENVIRONMENT_TYPES.map((type) => (
            <span
              key={type}
              className="text-xs rounded-full bg-white px-3 py-1.5 text-ink"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-blush-border pt-8 flex flex-col gap-3">
        <h3 className="text-base font-medium text-ink">
          Vägen in — från idé till resultat
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {JOURNEY.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className="text-sm text-ink font-medium">{step}</span>
              {i < JOURNEY.length - 1 && (
                <span className="text-brand" aria-hidden>
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
