import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "./Navbar";
import PrintButton from "./PrintButton";
import { getChecklistItems, getPhases, getTrack, isValidTrack, tracks } from "@/data/playbook";
import type { TrackId } from "@/lib/types";

/** Samma fyra fasfärger som tidigare användes i stegöversikten, bevarade här för playbook-vyn. */
const PHASE_COLORS = ["#E8750A", "#185FA5", "#2D7A4F", "#7B68D9"];

const TRACK_LINKS: { id: TrackId }[] = [
  { id: "etablera" },
  { id: "driva" },
  { id: "skala" },
];

export default function PlaybookView({ trackId }: { trackId: string }) {
  if (!isValidTrack(trackId)) notFound();
  const track = getTrack(trackId);
  if (!track) notFound();

  const { meta, steps } = track;
  const phases = getPhases(meta.id as TrackId);

  return (
    <div className="min-h-screen bg-page">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-8 pb-24">
        <div className="no-print flex flex-wrap items-center gap-2 mb-8">
          {TRACK_LINKS.map(({ id }) => {
            const t = tracks[id];
            const isActive = id === meta.id;
            return (
              <Link
                key={id}
                href={`/guide/${id}`}
                className="inline-flex items-center gap-1.5 text-sm rounded-full px-3.5 py-1.5 transition-colors"
                style={{
                  border: `1.5px solid ${t.meta.color}`,
                  backgroundColor: isActive ? t.meta.color : "#fff",
                  color: isActive ? "#fff" : t.meta.color,
                }}
              >
                {t.meta.letter} · {t.meta.shortName}
              </Link>
            );
          })}
        </div>

        <div className="md:grid md:grid-cols-[220px_1fr] md:gap-12">
          <aside className="hidden md:block md:sticky md:top-20 md:self-start">
            <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted mb-3">
              Innehåll
            </p>
            <nav className="flex flex-col gap-2">
              {steps.map((step, i) => (
                <a
                  key={step.id}
                  href={`#${step.id}`}
                  className="text-sm text-muted hover:text-ink transition-colors leading-snug"
                >
                  {i + 1}. {step.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="max-w-[720px] flex flex-col gap-12">
            <div className="flex flex-col gap-3 border-l-4 pl-5" style={{ borderColor: meta.color }}>
              <span className="text-xs font-medium uppercase tracking-[0.06em]" style={{ color: meta.color }}>
                Spår {meta.letter} · Playbook
              </span>
              <h1 className="text-[32px] font-medium text-ink leading-tight">{meta.name}</h1>
              <p className="text-base text-muted leading-relaxed max-w-xl">{meta.description}</p>
              <div className="no-print mt-2">
                <PrintButton color={meta.color} />
              </div>
            </div>

            <div className="flex flex-col gap-14">
              {phases.map((phase, phaseIndex) => {
                const phaseColor = PHASE_COLORS[phaseIndex % PHASE_COLORS.length];
                const phaseSteps = phase.stepIds
                  .map((id) => steps.find((s) => s.id === id))
                  .filter((s): s is (typeof steps)[number] => !!s);

                return (
                  <div key={phase.name} className="flex flex-col gap-14">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: phaseColor }}
                        aria-hidden
                      />
                      <p
                        className="text-xs font-medium uppercase tracking-[0.08em]"
                        style={{ color: phaseColor }}
                      >
                        {phase.name} · {phase.estimate}
                      </p>
                    </div>

                    {phaseSteps.map((step) => {
                      const globalIndex = steps.findIndex((s) => s.id === step.id);
                      const checklistItems = getChecklistItems(step);

                      return (
                        <article
                          key={step.id}
                          id={step.id}
                          className={`flex flex-col gap-5 scroll-mt-24 ${
                            globalIndex > 0 ? "print-page-break" : ""
                          }`}
                        >
                          <h2 className="text-2xl font-medium text-ink leading-snug">
                            {globalIndex + 1}. {step.title}
                          </h2>

                          <p className="text-[17px] text-ink leading-[1.7]">{step.intro}</p>

                          <div
                            className="rounded-md px-5 py-4 text-[15px] leading-[1.7] text-ink"
                            style={{ backgroundColor: meta.light, borderLeft: `3px solid ${meta.color}` }}
                          >
                            <p className="text-xs font-medium mb-1.5" style={{ color: meta.color }}>
                              Varför är detta viktigt?
                            </p>
                            <p>{step.why}</p>
                          </div>

                          {step.questions.length > 0 && (
                            <div className="flex flex-col gap-2">
                              <h3 className="text-sm font-medium text-ink">
                                Frågor att reflektera över
                              </h3>
                              <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                                {step.questions.map((question) => (
                                  <li key={question.id} className="text-[15px] text-ink leading-[1.7]">
                                    {question.text}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {checklistItems.length > 0 && (
                            <div className="flex flex-col gap-2">
                              <h3 className="text-sm font-medium text-ink">Checklista</h3>
                              <ul className="flex flex-col gap-2">
                                {checklistItems.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2.5 text-[15px] text-ink leading-[1.7]">
                                    <span
                                      className="mt-1.5 h-[9px] w-[9px] rounded-full border shrink-0"
                                      style={{ borderColor: "rgba(0,0,0,0.3)" }}
                                      aria-hidden
                                    />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div
                            className="rounded-md px-5 py-4 text-[15px] leading-[1.7] text-ink"
                            style={{ backgroundColor: "#EAF4EE" }}
                          >
                            <p className="text-xs font-medium mb-1.5" style={{ color: "#2D7A4F" }}>
                              Du är klar när…
                            </p>
                            <p>{step.doneWhen}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
