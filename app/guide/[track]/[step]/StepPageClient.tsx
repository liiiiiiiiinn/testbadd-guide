"use client";

import Navbar from "@/components/Navbar";
import StepNav from "@/components/StepNav";
import StepContent from "@/components/StepContent";
import AiPanel from "@/components/AiPanel";
import Breadcrumb from "@/components/Breadcrumb";
import { getTrack } from "@/data/playbook";
import { useDoneSteps } from "@/lib/storage";
import type { TrackId } from "@/lib/types";

export default function StepPageClient({
  trackId,
  stepIndex,
}: {
  trackId: string;
  stepIndex: number;
}) {
  const track = getTrack(trackId)!;
  const { meta } = track;
  const step = track.steps[stepIndex];
  const { done } = useDoneSteps(meta.id);

  return (
    <div className="min-h-screen bg-page">
      <Navbar backHref={`/guide/${meta.id}`} />

      <main className="max-w-6xl mx-auto px-6 pt-4 pb-24 md:pb-10 flex flex-col gap-6 md:gap-10">
        <Breadcrumb
          items={[
            { label: "Start", href: "/" },
            { label: "Guide", href: "/guide/etablera" },
            { label: meta.shortName, href: `/guide/${meta.id}` },
            { label: step.title },
          ]}
        />
        <div className="flex flex-col gap-10 md:grid md:grid-cols-[220px_1fr_280px] md:items-start md:gap-10">
          <aside className="md:sticky md:top-20">
            <StepNav track={track} currentStepId={step.id} done={done} />
          </aside>

          <section>
            <StepContent track={track} stepIndex={stepIndex} />
          </section>

          <aside className="md:sticky md:top-20 border-t md:border-t-0 md:border-l border-line pt-8 md:pt-0 md:pl-8">
            <AiPanel track={meta.id as TrackId} step={step} color={meta.color} />
          </aside>
        </div>
      </main>
    </div>
  );
}
