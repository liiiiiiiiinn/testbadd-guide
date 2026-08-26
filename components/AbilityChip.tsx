"use client";

import { Activity } from "lucide-react";
import { assessmentAreaForCapacity } from "@/data/assessment";
import { computeAreaScore, useAssessmentAnswers } from "@/lib/storage";
import type { CapacityAreaId } from "@/lib/types";

export default function AbilityChip({ capacityArea }: { capacityArea: CapacityAreaId }) {
  const { answers } = useAssessmentAnswers();
  const area = assessmentAreaForCapacity(capacityArea);
  const score = computeAreaScore(answers[area.id]);

  if (score === null) return null;

  const isPriority = score < 2;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs w-fit"
      style={{ backgroundColor: area.lightColor, color: "#1A1A1A" }}
    >
      <Activity size={12} color={area.color} strokeWidth={2} />
      Er {area.title.toLowerCase()}-förmåga: {score.toFixed(1)}/4
      {isPriority && <span style={{ color: "#E8750A" }}> · Prioriterat utvecklingsområde</span>}
    </span>
  );
}
