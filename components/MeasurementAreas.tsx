"use client";

import type { MeasurementArea } from "@/lib/types";

interface MeasurementAreasProps {
  areas: MeasurementArea[];
  checked: Record<number, number>;
  onToggle: (index: number) => void;
  color: string;
}

export default function MeasurementAreas({
  areas,
  checked,
  onToggle,
  color,
}: MeasurementAreasProps) {
  const totalPoints = areas.reduce((sum, a) => sum + a.points.length, 0);
  const doneCount = Array.from({ length: totalPoints }, (_, i) => i).filter(
    (i) => !!checked[i]
  ).length;

  let cursor = 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink">Att klargöra i detta steg</h3>
        <span className="text-xs text-muted">
          {doneCount}/{totalPoints} klara
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {areas.map((area) => {
          const startIndex = cursor;
          cursor += area.points.length;
          const areaDone = area.points.filter(
            (_, i) => !!checked[startIndex + i]
          ).length;

          return (
            <div key={area.id} className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-ink">{area.title}</p>
                <span className="text-xs text-muted shrink-0">
                  {areaDone}/{area.points.length}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {area.description}
              </p>
              <div className="flex flex-col gap-2">
                {area.points.map((point, i) => {
                  const globalIndex = startIndex + i;
                  const isChecked = !!checked[globalIndex];
                  return (
                    <label
                      key={globalIndex}
                      className="flex items-start gap-2.5 text-sm cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggle(globalIndex)}
                        className="sr-only peer"
                      />
                      <span
                        className={`mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border flex items-center justify-center transition-colors ${
                          isChecked ? "checkbox-pop" : ""
                        }`}
                        style={{
                          borderColor: isChecked ? color : "rgba(0,0,0,0.25)",
                          backgroundColor: isChecked ? color : "transparent",
                        }}
                        aria-hidden
                      >
                        {isChecked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{
                                strokeDasharray: 12,
                                strokeDashoffset: 12,
                                animation: "draw-check 0.3s ease-out forwards",
                              }}
                            />
                          </svg>
                        )}
                      </span>
                      <span className={isChecked ? "text-muted line-through" : "text-ink"}>
                        {point}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
