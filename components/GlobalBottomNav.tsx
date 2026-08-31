"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardCheck, Map, PieChart } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

const ICONS: Record<string, typeof ClipboardCheck> = {
  "/assess": ClipboardCheck,
  "/guide/etablera": Map,
  "/assess/result": PieChart,
};

export default function GlobalBottomNav() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[0.5px] border-line flex items-stretch justify-around"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        const Icon = ICONS[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2.5 flex-1"
          >
            <Icon size={20} color={active ? "#E8750A" : "#9C9893"} strokeWidth={1.75} />
            <span className="text-[11px]" style={{ color: active ? "#E8750A" : "#9C9893" }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
