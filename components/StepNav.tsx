"use client";

import Link from "next/link";
import type { Track } from "@/lib/types";
import { assessmentAreaForCapacity } from "@/data/assessment";
import { computeAreaScore, useAssessmentAnswers } from "@/lib/storage";
import ScoreDot from "./ScoreDot";

export default function StepNav({
  track,
  currentStepId,
  done,
}: {
  track: Track;
  currentStepId: string;
  done: Record<string, boolean>;
}) {
  const { meta, steps } = track;
  const { answers } = useAssessmentAnswers();

  return (
    <nav className="flex flex-col gap-4">
      <Link
        href={`/guide/${meta.id}`}
        className="text-xs text-muted hover:text-ink transition-colors"
      >
        ← Tillbaka till översikt
      </Link>

      <ul className="flex flex-col gap-0.5">
        {steps.map((step, i) => {
          const isActive = step.id === currentStepId;
          const isDone = !!done[step.id];
          const abilityArea = step.capacityArea
            ? assessmentAreaForCapacity(step.capacityArea)
            : null;
          const abilityScore = abilityArea ? computeAreaScore(answers[abilityArea.id]) : null;

          return (
            <li key={step.id}>
              <Link
                href={`/guide/${meta.id}/${step.id}`}
                className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors"
                style={{
                  backgroundColor: isActive ? meta.light : "transparent",
                  color: isActive ? meta.color : "#1A1A1A",
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    isDone ? "checkbox-pop" : ""
                  }`}
                  style={{
                    backgroundColor: isDone ? meta.color : "transparent",
                    border: isDone ? "none" : "1px solid rgba(0,0,0,0.18)",
                    color: isDone ? "#fff" : "#5C5C5C",
                  }}
                >
                  {isDone ? (
                    <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          strokeDasharray: 12,
                          strokeDashoffset: 12,
                          animation: "draw-check 0.4s ease-out forwards",
                        }}
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="truncate flex-1">{step.title}</span>
                {abilityScore !== null && abilityArea && (
                  <ScoreDot score={abilityScore} color={abilityArea.color} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
