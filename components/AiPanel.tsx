"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AiButtonType, Step, TrackId } from "@/lib/types";
import { aiButtonLabels, getAiResponse } from "@/data/aiMocks";

const buttonOrder: AiButtonType[] = ["formulera", "granska", "nastasteg"];

export default function AiPanel({
  track,
  step,
  color,
}: {
  track: TrackId;
  step: Step;
  color: string;
}) {
  const [activeButton, setActiveButton] = useState<AiButtonType | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [commentSent, setCommentSent] = useState(false);

  function handleClick(type: AiButtonType) {
    setActiveButton(type);
    setLoading(true);
    setResponse(null);
    setTimeout(() => {
      setResponse(getAiResponse(track, step, type));
      setLoading(false);
    }, 500);
  }

  function handleSend() {
    if (!comment.trim()) return;
    setCommentSent(true);
    setComment("");
    setTimeout(() => setCommentSent(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-medium text-ink">AI-stöd</h3>
        <p className="text-xs text-muted mt-0.5">I detta steg: {step.title}</p>
      </div>

      <div className="flex flex-col gap-2">
        {buttonOrder.map((type) => (
          <button
            key={type}
            onClick={() => handleClick(type)}
            className="text-left text-sm rounded-md border px-3.5 py-2.5 transition-colors hover:bg-black/[0.02]"
            style={{ borderColor: color, color }}
          >
            {aiButtonLabels[type]} ↗
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeButton && (
          <motion.div
            key={activeButton + (loading ? "-loading" : "-done")}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-md border border-line bg-page px-3.5 py-3 text-sm text-ink leading-relaxed"
          >
            {loading ? (
              <div className="flex items-center gap-2 text-muted">
                <span
                  className="h-3.5 w-3.5 rounded-full border-2 border-line animate-spin"
                  style={{ borderTopColor: color }}
                />
                Tänker...
              </div>
            ) : (
              <p>{response}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2 pt-1">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Skriv en kommentar eller fråga till AI-assistenten..."
          style={{ minHeight: 60 }}
          className="w-full rounded-md border border-line bg-card px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:outline-none focus:border-brand resize-y"
        />
        <button
          onClick={handleSend}
          className="self-start text-xs font-medium rounded-md px-3 py-1.5 text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: color }}
        >
          {commentSent ? "Skickat ✓" : "Skicka"}
        </button>
      </div>

      <div className="mt-2 rounded-md bg-black/[0.03] px-3.5 py-3 text-xs text-muted leading-relaxed">
        AI-stöd är under utveckling och kommer att aktiveras i nästa version.
        Svaren ovan är exempel på hur assistenten kommer att fungera.
      </div>
    </div>
  );
}
