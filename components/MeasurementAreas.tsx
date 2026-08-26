"use client";

import { RATING_LABELS, RATING_SCALE, type MeasurementArea } from "@/lib/types";

interface MeasurementAreasProps {
  areas: MeasurementArea[];
  checked: Record<number, number>;
  onRate: (index: number, rating: number) => void;
  color: string;
}

export default function MeasurementAreas({
  areas,
  checked,
  onRate,
  color,
}: MeasurementAreasProps) {
  const totalPoints = areas.reduce((sum, a) => sum + a.points.length, 0);
  const ratedCount = Array.from({ length: totalPoints }, (_, i) => i).filter(
    (i) => !!checked[i]
  ).length;

  let cursor = 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink">Mätområden</h3>
        <span className="text-xs text-muted">
          {ratedCount}/{totalPoints} mätpunkter bedömda
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {areas.map((area) => {
          const startIndex = cursor;
          cursor += area.points.length;
          const areaRated = area.points.filter(
            (_, i) => !!checked[startIndex + i]
          ).length;

          return (
            <div key={area.id} className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-ink">{area.title}</p>
                <span className="text-xs text-muted shrink-0">
                  {areaRated}/{area.points.length}
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {area.description}
              </p>
              <div className="flex flex-col gap-3">
                {area.points.map((point, i) => {
                  const globalIndex = startIndex + i;
                  const rating = checked[globalIndex] ?? 0;
                  return (
                    <div key={globalIndex} className="flex flex-col gap-1.5">
                      <p className="text-sm text-ink">{point}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted w-10 shrink-0">
                          Låg
                        </span>
                        <div className="flex items-center gap-1.5">
                          {RATING_SCALE.map((value) => {
                            const isSelected = rating === value;
                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => onRate(globalIndex, value)}
                                title={RATING_LABELS[value]}
                                aria-pressed={isSelected}
                                className={`h-6 w-6 rounded-full border text-[11px] font-medium transition-all duration-150 flex items-center justify-center hover:scale-110 ${
                                  isSelected ? "rating-pop" : ""
                                }`}
                                style={{
                                  borderColor: isSelected
                                    ? color
                                    : "rgba(0,0,0,0.2)",
                                  backgroundColor: isSelected
                                    ? color
                                    : "transparent",
                                  color: isSelected ? "#fff" : "#5C5C5C",
                                }}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-[10px] text-muted w-10 shrink-0">
                          Hög
                        </span>
                        {rating > 0 && (
                          <span className="text-xs text-muted">
                            {RATING_LABELS[rating as 1 | 2 | 3 | 4]}
                          </span>
                        )}
                      </div>
                    </div>
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
