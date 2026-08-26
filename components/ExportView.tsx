"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ASSESSMENT_QUESTION_ID, RATING_LABELS, type Track } from "@/lib/types";
import { getChecklistItems } from "@/data/playbook";
import { useAnswers, useChecks } from "@/lib/storage";
import Logo from "./Logo";
import TopNavLinks from "./TopNavLinks";
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
    const answeredQuestions = step.questions.filter((qu) => stepAnswers[qu.id]?.trim());
    if (answeredQuestions.length > 0) {
      for (const question of answeredQuestions) {
        lines.push("");
        lines.push(`**${question.text}**`);
        lines.push(stepAnswers[question.id]);
      }
    } else {
      lines.push("");
      lines.push("_Inga svar ifyllda._");
    }
    lines.push("");
    const checklistItems = getChecklistItems(step);
    const stepChecks = checks[step.id] ?? {};
    const doneCount = checklistItems.filter((_, i) => stepChecks[i]).length;
    if (step.measurementAreas) {
      lines.push(`Mätpunkter: ${doneCount}/${checklistItems.length} bedömda`);
      checklistItems.forEach((item, i) => {
        const rating = stepChecks[i];
        const ratingLabel = rating
          ? `${rating}/4 – ${RATING_LABELS[rating as 1 | 2 | 3 | 4]}`
          : "obedömd";
        lines.push(`- ${item}: ${ratingLabel}`);
      });
    } else {
      lines.push(`Checklista: ${doneCount}/${checklistItems.length} klara`);
      checklistItems.forEach((item, i) => {
        lines.push(`- [${stepChecks[i] ? "x" : " "}] ${item}`);
      });
    }
    const assessment = stepAnswers[ASSESSMENT_QUESTION_ID]?.trim();
    if (assessment) {
      lines.push("");
      lines.push(`**Kvalitativ bedömning**`);
      lines.push(assessment);
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("Genererat med Testbäddsguiden · Innovation Helsingborg");

  return lines.join("\n");
}

export default function ExportView({ track }: { track: Track }) {
  const { answers } = useAnswers(track.meta.id);
  const { checks } = useChecks(track.meta.id);
  const [copied, setCopied] = useState(false);
  const today = useMemo(
    () => new Date().toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" }),
    []
  );

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
      <div className="no-print border-b border-line bg-card">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Logo showSubtitle={false} />
          <div className="flex items-center gap-6">
            <TopNavLinks />
            <div className="flex items-center gap-3">
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
              <Link
                href={`/guide/${track.meta.id}`}
                className="text-sm rounded-md px-3.5 py-2 text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: track.meta.color }}
              >
                ← Tillbaka till guiden
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 pb-4">
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
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-medium text-ink">
            {track.meta.name} — Sammanställning
          </h1>
          <p className="text-sm text-muted">Genererat {today}</p>
        </div>

        {track.steps.map((step, index) => {
          const stepAnswers = answers[step.id] ?? {};
          const stepChecks = checks[step.id] ?? {};
          const answeredQuestions = step.questions.filter((qu) =>
            stepAnswers[qu.id]?.trim()
          );
          const checklistItems = getChecklistItems(step);
          const doneCount = checklistItems.filter((_, i) => stepChecks[i]).length;
          const assessment = stepAnswers[ASSESSMENT_QUESTION_ID]?.trim();

          return (
            <div key={step.id} className="flex flex-col gap-3 break-inside-avoid">
              <h2
                className="text-lg font-medium text-ink border-l-4 pl-3"
                style={{ borderColor: track.meta.color }}
              >
                Steg {track.meta.letter}
                {index + 1} — {step.title}
              </h2>

              {answeredQuestions.length > 0 ? (
                <div className="flex flex-col gap-3 pl-4">
                  {answeredQuestions.map((question) => (
                    <div key={question.id} className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium text-ink">{question.text}</p>
                      <p className="text-sm text-muted whitespace-pre-wrap">
                        {stepAnswers[question.id]}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted pl-4">Inga svar ifyllda.</p>
              )}

              <p className="text-sm text-ink pl-4">
                {step.measurementAreas
                  ? `Mätpunkter: ${doneCount}/${checklistItems.length} bedömda`
                  : `Checklista: ${doneCount}/${checklistItems.length} klara`}
              </p>

              {assessment && (
                <div className="flex flex-col gap-0.5 pl-4">
                  <p className="text-sm font-medium text-ink">
                    Kvalitativ bedömning
                  </p>
                  <p className="text-sm text-muted whitespace-pre-wrap">
                    {assessment}
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
