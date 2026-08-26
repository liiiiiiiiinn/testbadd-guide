export default function WhyBox({ text, color, light }: { text: string; color: string; light: string }) {
  return (
    <div
      className="rounded-md px-5 py-4 text-sm leading-relaxed text-ink"
      style={{ backgroundColor: light, borderLeft: `3px solid ${color}` }}
    >
      <p className="text-xs font-medium mb-1.5" style={{ color }}>
        Varför är detta viktigt?
      </p>
      <p>{text}</p>
    </div>
  );
}
