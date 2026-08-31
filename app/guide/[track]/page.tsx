"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import Logo from "@/components/Logo";
import ProgressBar from "@/components/ProgressBar";
import TopNavLinks from "@/components/TopNavLinks";
import Breadcrumb from "@/components/Breadcrumb";
import { getPhases, getTrack, isValidTrack } from "@/data/playbook";
import { assessmentAreaForCapacity } from "@/data/assessment";
import { computeAreaScore, useAnswers, useAssessmentAnswers, useChecks, useDoneSteps } from "@/lib/storage";
import type { TrackId } from "@/lib/types";

function stepStatus(
  isDone: boolean,
  hasAnswers: boolean,
  hasChecks: boolean
) {
  if (isDone) return { label: "Klart", tone: "done" as const };
  if (hasAnswers || hasChecks) return { label: "Påbörjat", tone: "started" as const };
  return { label: "Ej påbörjat", tone: "none" as const };
}

export default function GuideOverviewPage({
  params,
}: {
  params: { track: string };
}) {
  if (!isValidTrack(params.track)) notFound();
  const track = getTrack(params.track);
  if (!track) notFound();

  const { meta, steps } = track;
  const { answers } = useAnswers(meta.id);
  const { checks } = useChecks(meta.id);
  const { done } = useDoneSteps(meta.id);
  const { answers: assessmentAnswers } = useAssessmentAnswers();

  const doneCount = steps.filter((s) => done[s.id]).length;
  const phases = getPhases(meta.id as TrackId);

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Logo showSubtitle={false} />
          <div className="flex items-center gap-6">
            <TopNavLinks />
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                Kapacitetsöversikt →
              </Link>
              <Link
                href={`/export/${meta.id}`}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                Exportvy →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-4 pb-24 md:pb-12 flex flex-col gap-8">
        <Breadcrumb
          items={[
            { label: "Start", href: "/" },
            { label: "Guide", href: "/guide/etablera" },
            { label: meta.shortName },
          ]}
        />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium" style={{ color: meta.color }}>
            Spår {meta.letter}
          </span>
          <h1 className="text-2xl font-medium text-ink">{meta.name}</h1>
          <p className="text-sm text-muted leading-relaxed max-w-xl">
            {meta.description}
          </p>
        </div>

        <ProgressBar done={doneCount} total={steps.length} color={meta.color} />

        <div className="flex flex-col gap-6">
          {phases.map((phase) => {
            const phaseSteps = phase.stepIds
              .map((id) => steps.find((s) => s.id === id))
              .filter((s): s is (typeof steps)[number] => !!s);
            const abilitySteps = phaseSteps.filter((s) => s.capacityArea);

            return (
              <div key={phase.name} className="flex flex-col gap-2">
                <div
                  className="flex items-center justify-between gap-3 pl-3"
                  style={{ borderLeft: `2px solid ${phase.color}` }}
                >
                  <span
                    className="text-[11px] font-medium uppercase tracking-[0.06em]"
                    style={{ color: phase.color }}
                  >
                    {phase.name}
                  </span>
                  <div className="flex items-center gap-3">
                    {abilitySteps.map((step) => {
                      const abilityArea = assessmentAreaForCapacity(step.capacityArea!);
                      const abilityScore = computeAreaScore(assessmentAnswers[abilityArea.id]);
                      if (abilityScore === null) return null;
                      return (
                        <span
                          key={step.id}
                          className="text-[11px] rounded-full px-2 py-0.5"
                          style={{ backgroundColor: abilityArea.lightColor, color: abilityArea.color }}
                        >
                          Er förmåga: {abilityScore.toFixed(1)}/4
                        </span>
                      );
                    })}
                    <span className="text-xs text-muted shrink-0">{phase.estimate}</span>
                  </div>
                </div>

                <ol className="flex flex-col gap-1.5">
                  {phaseSteps.map((step) => {
                    const i = steps.findIndex((s) => s.id === step.id);
                    const stepAnswers = answers[step.id] ?? {};
                    const hasAnswers = Object.values(stepAnswers).some((v) => v?.trim());
                    const stepChecks = checks[step.id] ?? {};
                    const hasChecks = Object.values(stepChecks).some(Boolean);
                    const status = stepStatus(!!done[step.id], hasAnswers, hasChecks);

                    return (
                      <li key={step.id}>
                        <Link
                          href={`/guide/${meta.id}/${step.id}`}
                          className="flex items-center gap-3 h-12 bg-card border border-line rounded-md px-4 hover:border-black/20 transition-colors"
                        >
                          <span
                            className="text-sm font-medium w-5 shrink-0"
                            style={{ color: phase.color }}
                          >
                            {i + 1}
                          </span>
                          <span className="flex-1 text-sm text-ink truncate">
                            {step.title}
                          </span>
                          {status.tone === "done" ? (
                            <Check size={15} color="#2D7A4F" strokeWidth={2.5} />
                          ) : status.tone === "started" ? (
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: meta.color }}
                            />
                          ) : (
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ border: "1.5px solid rgba(0,0,0,0.18)" }}
                            />
                          )}
                          <span
                            className="text-xs font-medium shrink-0 hidden sm:inline"
                            style={{ color: meta.color }}
                          >
                            Gå till →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
