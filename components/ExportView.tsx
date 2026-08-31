"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { ASSESSMENT_QUESTION_ID, RATING_LABELS, RATING_SCALE, type Track } from "@/lib/types";
import { getChecklistItems } from "@/data/playbook";
import { useAnswers, useChecks } from "@/lib/storage";
import Navbar from "./Navbar";
import Breadcrumb from "./Breadcrumb";

function buildMarkdown(track: Track, answers: ReturnType<typeof useAnswers>["answers"], checks: ReturnType<typeof useChecks>["checks"]) {
  const lines: string[] = [];
  lines.push(`# ${track.meta.name} — Sammanställning`);
  lines.push("");
  lines.push(`Genererat: ${new Date().toLocaleDateString("sv-SE")}`);
  lines.push("");

  for (const step of track.steps) {
    lines.push(`## ${step.title}`);
    const stepAnswers = answers[step.id] ?? {};
    const stepChecks = checks[step.id] ?? {};

    lines.push("");
    lines.push(`### Dialogfrågor (${step.questions.filter((qu) => stepAnswers[qu.id]?.trim()).length}/${step.questions.length} besvarade)`);
    for (const question of step.questions) {
      const answer = stepAnswers[question.id]?.trim();
      lines.push("");
      lines.push(`**${question.text}**`);
      lines.push(answer || "_Inte besvarad._");
    }
    lines.push("");

    if (step.measurementAreas) {
      const allPoints = getChecklistItems(step);
      const ratedCount = allPoints.filter((_, i) => !!stepChecks[i]).length;
      lines.push(`### Mätpunkter (${ratedCount}/${allPoints.length} bedömda)`);
      let cursor = 0;
      for (const area of step.measurementAreas) {
        lines.push("");
        lines.push(`**${area.title}**`);
        area.points.forEach((point, i) => {
          const rating = stepChecks[cursor + i];
          const ratingLabel = rating
            ? `${rating}/4 – ${RATING_LABELS[rating as 1 | 2 | 3 | 4]}`
            : "ej bedömd";
          lines.push(`- ${point}: ${ratingLabel}`);
        });
        cursor += area.points.length;
      }
    } else {
      const checklistItems = getChecklistItems(step);
      const doneCount = checklistItems.filter((_, i) => stepChecks[i]).length;
      lines.push(`### Checklista (${doneCount}/${checklistItems.length} klara)`);
      checklistItems.forEach((item, i) => {
        lines.push(`- [${stepChecks[i] ? "x" : " "}] ${item}`);
      });
    }

    const assessment = stepAnswers[ASSESSMENT_QUESTION_ID]?.trim();
    if (step.assessmentPrompt) {
      lines.push("");
      lines.push(`**Kvalitativ bedömning**`);
      lines.push(assessment || "_Inte ifylld._");
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("Genererat med Testbäddsguiden · Innovation Helsingborg");

  return lines.join("\n");
}

/** Läsvänlig rad för en mätpunkt: fyllda prickar 1–4 + textetikett. */
function RatingRow({
  point,
  rating,
  color,
}: {
  point: string;
  rating: number;
  color: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 break-inside-avoid">
      <p className="text-sm text-ink flex-1">{point}</p>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1" aria-hidden>
          {RATING_SCALE.map((value) => (
            <span
              key={value}
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: rating >= value ? color : "transparent",
                border: `1.5px solid ${rating >= value ? color : "rgba(0,0,0,0.22)"}`,
              }}
            />
          ))}
        </div>
        <span
          className="text-xs w-28 text-right shrink-0"
          style={{ color: rating ? "#1A1A1A" : "#9C9893", fontStyle: rating ? "normal" : "italic" }}
        >
          {rating ? `${rating}/4 – ${RATING_LABELS[rating as 1 | 2 | 3 | 4]}` : "Ej bedömd"}
        </span>
      </div>
    </div>
  );
}

/** Läsvänlig rad för en enkel checklistpunkt: bock eller tom cirkel. */
function ChecklistRow({ item, done, color }: { item: string; done: boolean; color: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 break-inside-avoid">
      {done ? (
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full shrink-0"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          <Check size={10} color="#fff" strokeWidth={3} />
        </span>
      ) : (
        <span
          className="h-4 w-4 rounded-full shrink-0"
          style={{ border: "1.5px solid rgba(0,0,0,0.22)" }}
          aria-hidden
        />
      )}
      <p className={`text-sm ${done ? "text-ink" : "text-muted"}`}>{item}</p>
    </div>
  );
}

export default function ExportView({ track }: { track: Track }) {
  const { answers } = useAnswers(track.meta.id);
  const { checks } = useChecks(track.meta.id);
  const [copied, setCopied] = useState(false);
  const today = useMemo(
    () => new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" }),
    []
  );

  const totals = useMemo(() => {
    let questionsAnswered = 0;
    let questionsTotal = 0;
    let pointsDone = 0;
    let pointsTotal = 0;
    for (const step of track.steps) {
      const stepAnswers = answers[step.id] ?? {};
      const stepChecks = checks[step.id] ?? {};
      questionsTotal += step.questions.length;
      questionsAnswered += step.questions.filter((qu) => stepAnswers[qu.id]?.trim()).length;
      const checklistItems = getChecklistItems(step);
      pointsTotal += checklistItems.length;
      pointsDone += checklistItems.filter((_, i) => stepChecks[i]).length;
    }
    return { questionsAnswered, questionsTotal, pointsDone, pointsTotal };
  }, [track, answers, checks]);

  async function handleCopy() {
    const markdown = buildMarkdown(track, answers, checks);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard otillgängligt i denna miljö
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="no-print">
        <Navbar backHref={`/guide/${track.meta.id}`} />
        <div className="max-w-3xl mx-auto px-6 pt-4">
          <Breadcrumb
            items={[
              { label: "Start", href: "/" },
              { label: "Guide", href: "/guide/etablera" },
              { label: track.meta.shortName, href: `/guide/${track.meta.id}` },
              { label: "Export" },
            ]}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 pb-24 md:pb-10 flex flex-col gap-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-medium text-ink">
              {track.meta.name} — Sammanställning
            </h1>
            <p className="text-sm text-muted">Genererat {today}</p>
          </div>
          <div className="no-print flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="text-sm rounded-md border border-line px-3.5 py-2 text-ink hover:bg-black/[0.02] transition-colors"
            >
              {copied ? "Kopierat ✓" : "Kopiera som text"}
            </button>
            <button
              onClick={() => window.print()}
              className="text-sm rounded-md border border-line px-3.5 py-2 text-ink hover:bg-black/[0.02] transition-colors"
            >
              Skriv ut
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 rounded-md border border-line bg-card px-5 py-4 text-sm text-ink break-inside-avoid">
          <span>
            <strong className="font-medium">{totals.questionsAnswered}/{totals.questionsTotal}</strong>{" "}
            dialogfrågor besvarade
          </span>
          <span>
            <strong className="font-medium">{totals.pointsDone}/{totals.pointsTotal}</strong>{" "}
            mätpunkter/checklistpunkter ifyllda
          </span>
        </div>

        {track.steps.map((step, index) => {
          const stepAnswers = answers[step.id] ?? {};
          const stepChecks = checks[step.id] ?? {};
          const checklistItems = getChecklistItems(step);
          const doneCount = checklistItems.filter((_, i) => stepChecks[i]).length;
          const answeredCount = step.questions.filter((qu) => stepAnswers[qu.id]?.trim()).length;
          const assessment = stepAnswers[ASSESSMENT_QUESTION_ID]?.trim();

          let cursor = 0;

          return (
            <div key={step.id} className="flex flex-col gap-4">
              <h2
                className="text-lg font-medium text-ink border-l-4 pl-3"
                style={{ borderColor: track.meta.color }}
              >
                Steg {track.meta.letter}
                {index + 1} — {step.title}
              </h2>

              <div className="flex flex-col gap-3 pl-4">
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted">
                  Dialogfrågor ({answeredCount}/{step.questions.length} besvarade)
                </p>
                {step.questions.map((question) => {
                  const answer = stepAnswers[question.id]?.trim();
                  return (
                    <div key={question.id} className="flex flex-col gap-0.5 break-inside-avoid">
                      <p className="text-sm font-medium text-ink">{question.text}</p>
                      <p
                        className="text-sm whitespace-pre-wrap"
                        style={{ color: answer ? "#5C5C5C" : "#9C9893", fontStyle: answer ? "normal" : "italic" }}
                      >
                        {answer || "Inte besvarad."}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 pl-4">
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted">
                  {step.measurementAreas
                    ? `Mätpunkter (${doneCount}/${checklistItems.length} bedömda)`
                    : `Checklista (${doneCount}/${checklistItems.length} klara)`}
                </p>

                {step.measurementAreas
                  ? step.measurementAreas.map((area) => {
                      const startIndex = cursor;
                      cursor += area.points.length;
                      return (
                        <div key={area.id} className="flex flex-col gap-1 break-inside-avoid">
                          <p className="text-sm font-medium text-ink">{area.title}</p>
                          <div className="flex flex-col divide-y divide-line/60">
                            {area.points.map((point, i) => (
                              <RatingRow
                                key={i}
                                point={point}
                                rating={stepChecks[startIndex + i] ?? 0}
                                color={track.meta.color}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })
                  : (
                      <div className="flex flex-col divide-y divide-line/60">
                        {checklistItems.map((item, i) => (
                          <ChecklistRow
                            key={i}
                            item={item}
                            done={!!stepChecks[i]}
                            color={track.meta.color}
                          />
                        ))}
                      </div>
                    )}
              </div>

              {step.assessmentPrompt && (
                <div className="flex flex-col gap-0.5 pl-4 break-inside-avoid">
                  <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted">
                    Kvalitativ bedömning
                  </p>
                  <p
                    className="text-sm whitespace-pre-wrap"
                    style={{ color: assessment ? "#1A1A1A" : "#9C9893", fontStyle: assessment ? "normal" : "italic" }}
                  >
                    {assessment || "Inte ifylld."}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        <div className="text-center text-xs text-muted pt-6 border-t border-line">
          Genererat med Testbäddsguiden · Innovation Helsingborg
        </div>
      </div>
    </div>
  );
}
