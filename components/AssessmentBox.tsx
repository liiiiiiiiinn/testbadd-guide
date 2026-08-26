"use client";

import { useEffect, useRef, useState } from "react";

export default function AssessmentBox({
  prompt,
  value,
  onSave,
  color,
  light,
}: {
  prompt: string;
  value: string;
  onSave: (value: string) => void;
  color: string;
  light: string;
}) {
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const savedFlashRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setText(value);
  }, [value]);

  function handleChange(next: string) {
    setText(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSave(next);
      setSaved(true);
      if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
      savedFlashRef.current = setTimeout(() => setSaved(false), 1800);
    }, 500);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (savedFlashRef.current) clearTimeout(savedFlashRef.current);
    };
  }, []);

  return (
    <div
      className="rounded-md px-5 py-4 flex flex-col gap-2.5"
      style={{ backgroundColor: light, borderLeft: `3px solid ${color}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium mb-1" style={{ color }}>
            Din kvalitativa bedömning
          </p>
          <p className="text-sm text-ink leading-relaxed">{prompt}</p>
        </div>
        <span
          className={`text-xs text-success shrink-0 transition-opacity duration-300 ${
            saved ? "opacity-100" : "opacity-0"
          }`}
        >
          Sparad
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Skriv fritt hur väl du tycker att området är uppfyllt just nu, och varför..."
        style={{ minHeight: 90 }}
        className="w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none resize-y"
      />
    </div>
  );
}
