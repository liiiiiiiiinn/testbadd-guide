import Link from "next/link";

export default function Logo({ showSubtitle = true }: { showSubtitle?: boolean }) {
  return (
    <Link href="/" className="inline-flex flex-col gap-0.5 group">
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-[3px] bg-brand"
          aria-hidden
        />
        <span className="text-[17px] font-semibold text-brand">
          Testbäddsguiden
        </span>
      </span>
      {showSubtitle && (
        <span className="text-[11px] text-muted pl-5">
          Innovation Helsingborg
        </span>
      )}
    </Link>
  );
}
