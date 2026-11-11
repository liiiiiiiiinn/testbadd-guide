"use client";

export default function PrintButton({ color }: { color: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print text-sm font-medium rounded-md border px-4 py-2 transition-colors hover:bg-black/[0.02]"
      style={{ borderColor: color, color }}
    >
      Skriv ut / spara som PDF
    </button>
  );
}
