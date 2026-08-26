"use client";

import { assessmentAreas } from "@/data/assessment";
import type { AssessmentAreaId } from "@/lib/types";

const SIZE = 380;
const CENTER = SIZE / 2;
const MAX_R = 100;
const LABEL_R = MAX_R + 32;
const RINGS = [0.25, 0.5, 0.75, 1];

/** Textankare per axel så etiketten växer bort från centrum istället för att klippas. */
function anchorFor(index: number, n: number): "start" | "middle" | "end" {
  const angle = ((2 * Math.PI * index) / n - Math.PI / 2 + 2 * Math.PI) % (2 * Math.PI);
  const cos = Math.cos(angle);
  if (Math.abs(cos) < 0.3) return "middle";
  return cos > 0 ? "start" : "end";
}

function pointFor(index: number, n: number, fraction: number) {
  const angle = (2 * Math.PI * index) / n - Math.PI / 2;
  const r = fraction * MAX_R;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)] as const;
}

function polygonPoints(scores: Record<AssessmentAreaId, number | null>) {
  return assessmentAreas
    .map((area, i) => {
      const value = scores[area.id] ?? 0;
      const [x, y] = pointFor(i, assessmentAreas.length, value / 4);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function RadarChart({
  scores,
  ghosts = [],
}: {
  scores: Record<AssessmentAreaId, number | null>;
  ghosts?: Record<AssessmentAreaId, number | null>[];
}) {
  const n = assessmentAreas.length;

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto">
      <defs>
        <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          {assessmentAreas.map((area, i) => (
            <stop
              key={area.id}
              offset={`${(i / (n - 1)) * 100}%`}
              stopColor={area.color}
            />
          ))}
        </linearGradient>
      </defs>

      {RINGS.map((fraction) => (
        <polygon
          key={fraction}
          points={assessmentAreas
            .map((_, i) => pointFor(i, n, fraction).join(","))
            .join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1}
        />
      ))}

      {assessmentAreas.map((area, i) => {
        const [x, y] = pointFor(i, n, 1);
        return (
          <line
            key={area.id}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={1}
          />
        );
      })}

      {ghosts.map((ghostScores, gi) => (
        <polygon
          key={gi}
          points={polygonPoints(ghostScores)}
          fill="none"
          stroke="#9C9893"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.6}
        />
      ))}

      <polygon
        points={polygonPoints(scores)}
        fill="url(#radar-fill)"
        fillOpacity={0.25}
        stroke="none"
      />
      <polygon
        points={polygonPoints(scores)}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
          animation: "radar-draw 0.8s ease-out forwards",
        }}
      />

      {assessmentAreas.map((area, i) => {
        const value = scores[area.id];
        const [px, py] = pointFor(i, n, (value ?? 0) / 4);
        const [lx, ly] = pointFor(i, n, LABEL_R / MAX_R);
        return (
          <g key={area.id}>
            <title>{`${area.title}: ${
              value !== null && value !== undefined ? value.toFixed(1) : "Ej bedömt"
            }`}</title>
            <circle cx={px} cy={py} r={4} fill={area.color} stroke="#fff" strokeWidth={2} />
            <text
              x={lx}
              y={ly}
              textAnchor={anchorFor(i, n)}
              dominantBaseline="middle"
              fontSize={11}
              fontWeight={500}
              fill={area.color}
            >
              {area.title}
            </text>
          </g>
        );
      })}

      <style>{`
        @keyframes radar-draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}
