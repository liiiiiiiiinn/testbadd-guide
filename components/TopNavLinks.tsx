"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Start", match: (p: string) => p === "/" },
  { href: "/assess", label: "Bedömning", match: (p: string) => p.startsWith("/assess") },
  {
    href: "/guide/etablera",
    label: "Guide",
    match: (p: string) =>
      p.startsWith("/guide") || p.startsWith("/dashboard") || p.startsWith("/export"),
  },
];

export default function TopNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-5">
      {NAV_LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm pb-1 transition-colors"
            style={{
              color: active ? "#1A1A1A" : "#5C5C5C",
              borderBottom: active ? "2px solid #E8750A" : "2px solid transparent",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
