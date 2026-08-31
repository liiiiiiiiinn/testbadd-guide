"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { assessmentAreas } from "@/data/assessment";

export default function TopNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-5">
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        const hasDropdown = item.href === "/assess";

        const link = (
          <Link
            href={item.href}
            className="inline-flex items-center gap-1 text-sm pb-1 transition-colors"
            style={{
              color: active ? "#1A1A1A" : "#5C5C5C",
              borderBottom: active ? "2px solid #E8750A" : "2px solid transparent",
            }}
          >
            {item.label}
            {hasDropdown && <ChevronDown size={12} />}
          </Link>
        );

        if (!hasDropdown) {
          return <div key={item.href}>{link}</div>;
        }

        return (
          <div key={item.href} className="relative group">
            {link}
            <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
              <div className="bg-white rounded-lg py-1.5 min-w-[200px] border border-line shadow-lg">
                {assessmentAreas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/assess/${area.id}`}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-ink hover:bg-black/[0.03] transition-colors"
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: area.color }}
                    />
                    {area.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
