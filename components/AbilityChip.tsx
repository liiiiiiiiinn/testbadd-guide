"use client";

import Link from "next/link";
import { assessmentAreaForCapacity } from "@/data/assessment";
import { computeAreaScore, useAssessmentAnswers } from "@/lib/storage";
import type { CapacityAreaId } from "@/lib/types";

export default function AbilityChip({ capacityArea }: { capacityArea: CapacityAreaId }) {
  const { answers } = useAssessmentAnswers();
  const area = assessmentAreaForCapacity(capacityArea);
  const score = computeAreaScore(answers[area.id]);

  if (score === null) return null;

  const isPriority = score < 2.5;

  return (
    <Link
      href={`/assess/result#area-${area.id}`}
      title="Från er förmågebedömning — klicka för att se detaljer"
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs w-fit hover:underline"
      style={{ backgroundColor: area.lightColor, color: "#1A1A1A" }}
    >
      📊 Från er bedömning — {area.title.toLowerCase()}: {score.toFixed(1)}/4
      {isPriority && <span style={{ color: "#E8750A" }}> · Prioriterat område</span>}
    </Link>
  );
}
