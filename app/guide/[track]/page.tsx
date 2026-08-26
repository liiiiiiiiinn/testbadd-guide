"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import ProgressBar from "@/components/ProgressBar";
import TopNavLinks from "@/components/TopNavLinks";
import Breadcrumb from "@/components/Breadcrumb";
import { getTrack, isValidTrack } from "@/data/playbook";
import { useAnswers, useChecks, useDoneSteps } from "@/lib/storage";

function stepStatus(
  stepId: string,
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

  const doneCount = steps.filter((s) => done[s.id]).length;

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

        <ol className="flex flex-col gap-2">
          {steps.map((step, i) => {
            const stepAnswers = answers[step.id] ?? {};
            const hasAnswers = Object.values(stepAnswers).some((v) => v?.trim());
            const stepChecks = checks[step.id] ?? {};
            const hasChecks = Object.values(stepChecks).some(Boolean);
            const status = stepStatus(step.id, !!done[step.id], hasAnswers, hasChecks);

            return (
              <li key={step.id}>
                <Link
                  href={`/guide/${meta.id}/${step.id}`}
                  className="flex items-center gap-4 bg-card border border-line rounded-md px-5 py-4 hover:border-black/20 transition-colors"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: status.tone === "done" ? meta.color : meta.light,
                      color: status.tone === "done" ? "#fff" : meta.color,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-ink font-medium">
                    {step.title}
                  </span>
                  <span
                    className="text-xs shrink-0"
                    style={{
                      color:
                        status.tone === "done"
                          ? "#2D7A4F"
                          : status.tone === "started"
                          ? meta.color
                          : "#5C5C5C",
                    }}
                  >
                    {status.label}
                  </span>
                  <span className="text-sm shrink-0" style={{ color: meta.color }}>
                    Gå till →
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
