import type { CSSProperties } from "react";

const OFFSETS = [
  [18, -14],
  [-20, -10],
  [10, 20],
  [-14, 18],
  [22, 8],
  [-8, -22],
];

export default function ConfettiBurst({ color }: { color: string }) {
  return (
    <span className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden>
      {OFFSETS.map(([dx, dy], i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full confetti-dot"
          style={
            {
              backgroundColor: i % 2 === 0 ? color : "#fff",
              border: i % 2 === 0 ? "none" : `1px solid ${color}`,
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
