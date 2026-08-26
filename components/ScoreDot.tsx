export default function ScoreDot({ score, color }: { score: number; color: string }) {
  const pct = Math.round((score / 4) * 100);
  return (
    <span
      className="inline-block h-2 w-2 rounded-full shrink-0"
      style={{ background: `conic-gradient(${color} ${pct}%, rgba(0,0,0,0.12) ${pct}% 100%)` }}
      title={`Förmågescore: ${score.toFixed(1)}/4`}
    />
  );
}
