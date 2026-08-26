"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Map } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Start", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/assess",
    label: "Bedömning",
    icon: BarChart2,
    match: (p: string) => p.startsWith("/assess"),
  },
  {
    href: "/guide/etablera",
    label: "Guide",
    icon: Map,
    match: (p: string) =>
      p.startsWith("/guide") || p.startsWith("/dashboard") || p.startsWith("/export"),
  },
];

export default function GlobalBottomNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[0.5px] border-line flex items-stretch justify-around"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {ITEMS.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 py-2.5 flex-1"
          >
            <Icon size={20} color={active ? "#E8750A" : "#9C9893"} strokeWidth={1.75} />
            <span className="text-[11px]" style={{ color: active ? "#E8750A" : "#9C9893" }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
