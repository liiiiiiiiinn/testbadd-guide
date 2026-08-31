export default function AreaBadge({
  title,
  color,
  lightColor,
}: {
  title: string;
  color: string;
  lightColor: string;
}) {
  return (
    <span
      className="text-[11px] font-medium rounded-full px-2.5 py-1 shrink-0"
      style={{ backgroundColor: lightColor, color }}
    >
      {title}
    </span>
  );
}
