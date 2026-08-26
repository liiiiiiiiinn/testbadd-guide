"use client";

import Link from "next/link";
import TopNavLinks from "./TopNavLinks";

export default function Navbar({ backHref }: { backHref?: string }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm h-14 flex items-center">
      <div className="max-w-5xl w-full mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {backHref && (
            <Link
              href={backHref}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              ← Tillbaka
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="inline-block h-[10px] w-[10px] rounded-[3px] bg-brand"
              aria-hidden
            />
            <span className="text-[15px] font-medium text-ink">
              Testbäddsguiden
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <TopNavLinks />
          <span className="hidden sm:inline text-xs text-muted">Innovation Helsingborg</span>
        </div>
      </div>
    </header>
  );
}
