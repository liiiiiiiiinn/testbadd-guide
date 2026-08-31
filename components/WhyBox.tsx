"use client";

import { useState } from "react";

export default function WhyBox({ text, color, light }: { text: string; color: string; light: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[13px] font-medium transition-opacity hover:opacity-80"
        style={{ color }}
      >
        {open ? "▾" : "▸"} Varför spelar detta roll?
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="rounded-md px-5 py-4 text-sm leading-relaxed text-ink mt-2"
            style={{ backgroundColor: light, borderLeft: `3px solid ${color}` }}
          >
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
