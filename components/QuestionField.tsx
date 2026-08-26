"use client";

import { useEffect, useRef, useState } from "react";
import type { Question } from "@/lib/types";

export default function QuestionField({
  question,
  value,
  onSave,
}: {
  question: Question;
  value: string;
  onSave: (value: string) => void;
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
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <label className="text-sm text-ink leading-relaxed">{question.text}</label>
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
        placeholder={question.placeholder}
        style={{ minHeight: 80 }}
        className="w-full rounded-md border border-line bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-brand resize-y"
      />
    </div>
  );
}
