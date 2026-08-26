export default function DoneWhenBox({ text }: { text: string }) {
  return (
    <div
      className="rounded-md px-5 py-4 text-sm leading-relaxed text-ink bg-success-light"
      style={{ borderLeft: "3px solid #2D7A4F" }}
    >
      <p className="text-xs font-medium mb-1.5 text-success">
        Du är klar när...
      </p>
      <p>{text}</p>
    </div>
  );
}
