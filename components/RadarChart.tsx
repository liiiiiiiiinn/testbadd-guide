"use client";

import { useState } from "react";
import { assessmentAreas } from "@/data/assessment";
import type { AssessmentAreaId } from "@/lib/types";

const SIZE = 380;
const CENTER = SIZE / 2;
const MAX_R = 115;
const LABEL_R = MAX_R + 20;
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

function scrollToArea(areaId: string) {
  document.getElementById(`area-${areaId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function RadarChart({
  scores,
  ghosts = [],
  interactive = false,
}: {
  scores: Record<AssessmentAreaId, number | null>;
  ghosts?: Record<AssessmentAreaId, number | null>[];
  /** Gör hörnen klickbara (hoppar till områdessektionen) och visar värde vid hover. */
  interactive?: boolean;
}) {
  const n = assessmentAreas.length;
  const [hovered, setHovered] = useState<AssessmentAreaId | null>(null);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto block w-[320px] h-[320px] sm:w-[480px] sm:h-[480px]"
    >
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
        const isHovered = interactive && hovered === area.id;
        const valueLabel =
          value !== null && value !== undefined ? `${value.toFixed(1)}/4` : "Ej bedömt";

        return (
          <g
            key={area.id}
            style={interactive ? { cursor: "pointer" } : undefined}
            onMouseEnter={interactive ? () => setHovered(area.id) : undefined}
            onMouseLeave={interactive ? () => setHovered(null) : undefined}
            onClick={interactive ? () => scrollToArea(area.id) : undefined}
            tabIndex={interactive ? 0 : undefined}
            role={interactive ? "button" : undefined}
            aria-label={interactive ? `Gå till ${area.title}` : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      scrollToArea(area.id);
                    }
                  }
                : undefined
            }
          >
            <title>{`${area.title}: ${valueLabel}`}</title>
            {interactive && (
              <circle cx={px} cy={py} r={18} fill="transparent" style={{ pointerEvents: "all" }} />
            )}
            {isHovered && (
              <circle cx={px} cy={py} r={10} fill={area.color} opacity={0.18} />
            )}
            <circle
              cx={px}
              cy={py}
              r={isHovered ? 6 : 4}
              fill={area.color}
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={lx}
              y={ly}
              textAnchor={anchorFor(i, n)}
              dominantBaseline="middle"
              fontSize={isHovered ? 12.5 : 11}
              fontWeight={isHovered ? 700 : 500}
              fill={area.color}
            >
              {isHovered ? `${area.title} · ${valueLabel}` : area.title}
            </text>
          </g>
        );
      })}

      <style>{`
        @keyframes radar-draw {
          to { stroke-dashoffset: 0; }
        }
        circle {
          transition: r 0.15s ease-out;
        }
      `}</style>
    </svg>
  );
}
