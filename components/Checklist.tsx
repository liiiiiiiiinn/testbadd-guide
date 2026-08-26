"use client";

interface ChecklistProps {
  items: string[];
  checked: Record<number, number>;
  onToggle: (index: number) => void;
  color: string;
}

export default function Checklist({ items, checked, onToggle, color }: ChecklistProps) {
  const doneCount = items.filter((_, i) => checked[i]).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-ink">Markera när det är klart</h3>
        <span className="text-xs text-muted">
          {doneCount}/{items.length} klara
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => {
          const isChecked = !!checked[i];
          return (
            <label
              key={i}
              className="flex items-start gap-2.5 text-sm cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(i)}
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
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
