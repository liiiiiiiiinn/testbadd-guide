"use client";

import { useEffect, useRef, useState } from "react";
import type { AssessmentAnswer, AssessmentArea, AssessmentQuestion, YesNoValue } from "@/lib/types";
import ConfettiBurst from "./ConfettiBurst";

const YES_NO_OPTIONS: { value: YesNoValue; label: string }[] = [
  { value: "ja", label: "Ja" },
  { value: "delvis", label: "Delvis" },
  { value: "nej", label: "Nej" },
  { value: "vetej", label: "Vet ej" },
];

export default function AssessmentQuestionCard({
  area,
  question,
  index,
  answer,
  onChange,
}: {
  area: AssessmentArea;
  question: AssessmentQuestion;
  index: number;
  answer: AssessmentAnswer | undefined;
  onChange: (patch: Partial<AssessmentAnswer>) => void;
}) {
  const [comment, setComment] = useState(answer?.comment ?? "");
  const [savedState, setSavedState] = useState<"idle" | "saving" | "saved">("idle");
  const savingTimer = useRef<ReturnType<typeof setTimeout>>();
  const savedTimer = useRef<ReturnType<typeof setTimeout>>();
  const commentDebounce = useRef<ReturnType<typeof setTimeout>>();
  const [burstValue, setBurstValue] = useState<number | null>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setComment(answer?.comment ?? "");
  }, [answer?.comment]);

  useEffect(() => {
    return () => {
      clearTimeout(savingTimer.current);
      clearTimeout(savedTimer.current);
      clearTimeout(commentDebounce.current);
      clearTimeout(burstTimer.current);
    };
  }, []);

  function flashSaved() {
    clearTimeout(savingTimer.current);
    clearTimeout(savedTimer.current);
    setSavedState("saving");
    savingTimer.current = setTimeout(() => {
      setSavedState("saved");
      savedTimer.current = setTimeout(() => setSavedState("idle"), 1500);
    }, 300);
  }

  function handleRating(value: number) {
    const wasSelected = answer?.rating === value;
    onChange({ rating: wasSelected ? undefined : value });
    flashSaved();
    if (!wasSelected) {
      clearTimeout(burstTimer.current);
      setBurstValue(value);
      burstTimer.current = setTimeout(() => setBurstValue(null), 500);
    }
  }

  function handleYesNo(value: YesNoValue) {
    onChange({ yesno: answer?.yesno === value ? undefined : value });
    flashSaved();
  }

  function handleCommentChange(next: string) {
    setComment(next);
    onChange({ comment: next });
    if (commentDebounce.current) clearTimeout(commentDebounce.current);
    commentDebounce.current = setTimeout(flashSaved, 500);
  }

  return (
    <div className="rounded-[14px] bg-white px-6 py-6 mb-4 border-[0.5px] border-[#E8E5E0] relative">
      <span className="text-[11px] uppercase tracking-[0.06em] text-muted">
        Fråga {index + 1}
      </span>
      <span
        className={`absolute top-6 right-6 text-xs text-success transition-opacity duration-300 ${
          savedState === "idle" ? "opacity-0" : "opacity-100"
        }`}
      >
        {savedState === "saving" ? "Sparar..." : "Sparat ✓"}
      </span>

      <p className="text-[17px] font-medium text-ink mt-1.5 leading-[1.45]">
        {question.text}
      </p>

      {question.type === "rating" && question.rating && (
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((value) => {
              const isSelected = answer?.rating === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRating(value)}
                  className={`relative rounded-[10px] py-4 px-3 text-center transition-transform duration-150 hover:scale-[1.02] ${
                    isSelected ? "rating-pop" : ""
                  }`}
                  style={{
                    backgroundColor: isSelected ? area.lightColor : "#F7F6F3",
                    border: `1.5px solid ${isSelected ? area.color : "transparent"}`,
                    color: isSelected ? area.color : "#1A1A1A",
                  }}
                >
                  <span className="text-xl font-medium">{value}</span>
                  {burstValue === value && <ConfettiBurst color={area.color} />}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-muted">{question.rating.low}</span>
            <span className="text-[11px] text-muted">{question.rating.high}</span>
          </div>
        </div>
      )}

      {question.type === "yesno" && (
        <div className="flex flex-wrap gap-2 mt-4">
          {YES_NO_OPTIONS.map((opt) => {
            const isSelected = answer?.yesno === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleYesNo(opt.value)}
                className="text-sm rounded-full px-5 py-2.5 transition-colors duration-150"
                style={{
                  backgroundColor: isSelected ? area.lightColor : "#fff",
                  border: `1.5px solid ${isSelected ? area.color : "#E8E5E0"}`,
                  color: isSelected ? area.color : "#1A1A1A",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <textarea
        value={comment}
        onChange={(e) => handleCommentChange(e.target.value)}
        placeholder="Valfri kommentar..."
        rows={2}
        className="w-full mt-4 rounded-lg bg-page border-none px-3 py-3 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:ring-1 resize-none"
        style={{ boxShadow: "none" }}
      />
    </div>
  );
}
