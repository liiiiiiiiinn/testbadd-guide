"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Target } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import Breadcrumb from "@/components/Breadcrumb";
import RadarChart from "@/components/RadarChart";
import { assessmentAreas } from "@/data/assessment";
import { tracks } from "@/data/playbook";
import { useAssessmentAnswers, useAssessmentSnapshots, computeAllScores } from "@/lib/storage";
import type { TrackId } from "@/lib/types";

function recommendTracks(
  overallAvg: number | null,
  infra: number | null,
  metoder: number | null
): TrackId[] {
  const infraLow = (infra ?? 0) < 2.5;
  const metoderLow = (metoder ?? 0) < 2.5;
  if (infraLow && metoderLow) return ["etablera"];
  if (overallAvg === null) return ["etablera"];
  if (overallAvg < 2.5) return ["etablera"];
  if (overallAvg <= 3.25) return ["driva"];
  return ["driva", "skala"];
}

export default function AssessResultPage() {
  const { answers } = useAssessmentAnswers();
  const { snapshots, addSnapshot } = useAssessmentSnapshots();
  const [showToast, setShowToast] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const scores = computeAllScores(answers);
  const scoredValues = assessmentAreas
    .map((a) => scores[a.id])
    .filter((v): v is number => v !== null);
  const overallAvg =
    scoredValues.length > 0
      ? scoredValues.reduce((a, b) => a + b, 0) / scoredValues.length
      : null;
  const allAnswered = scoredValues.length === assessmentAreas.length;

  const ranked = [...assessmentAreas]
    .filter((a) => scores[a.id] !== null)
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  const strengths = ranked.slice(0, 2);
  const gaps = ranked.slice(-2).reverse();

  const recommended = recommendTracks(overallAvg, scores.infrastruktur, scores.metoder);

  function handleSaveSnapshot() {
    setSaveState("saving");
    setTimeout(() => {
      addSnapshot(scores);
      setSaveState("saved");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setTimeout(() => setSaveState("idle"), 1000);
    }, 500);
  }

  const today = new Date().toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-page">
        <Navbar backHref="/assess" />

        <main className="max-w-[700px] mx-auto px-6 pb-24">
          <div className="pt-4">
            <Breadcrumb
              items={[
                { label: "Start", href: "/" },
                { label: "Bedömning", href: "/assess" },
                { label: "Resultat" },
              ]}
            />
          </div>
          <div className="text-center pt-6">
            <h1 className="text-[28px] font-medium text-ink">Er förmågeprofil</h1>
            <p className="text-[13px] text-muted mt-1">Bedömning genomförd {today}</p>
          </div>

          {!allAnswered && (
            <p className="text-center text-sm text-muted bg-white border border-line rounded-md px-5 py-3 mt-8 max-w-md mx-auto">
              Ni har inte besvarat alla fyra områden än — profilen visar det
              ni hittills fyllt i.
            </p>
          )}

          <div className="mt-10">
            <RadarChart
              scores={scores}
              ghosts={showCompare ? snapshots.map((s) => s.scores) : []}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#2D7A4F" }}>
                <TrendingUp size={16} />
                Era styrkor
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {strengths.map((area) => (
                  <li key={area.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{area.title}</span>
                    <span className="text-muted tabular-nums">
                      {scores[area.id]?.toFixed(1)} / 4
                    </span>
                  </li>
                ))}
                {strengths.length === 0 && (
                  <li className="text-sm text-muted">Inga bedömda områden än.</li>
                )}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: "#E8750A" }}>
                <Target size={16} />
                Utvecklingspotential
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {gaps.map((area) => (
                  <li key={area.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{area.title}</span>
                    <span className="text-muted tabular-nums">
                      {scores[area.id]?.toFixed(1)} / 4
                    </span>
                  </li>
                ))}
                {gaps.length === 0 && (
                  <li className="text-sm text-muted">Inga bedömda områden än.</li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl px-7 py-7 mt-10">
            <h2 className="text-base font-medium text-ink">Vart tar ni er härifrån?</h2>
            <p className="text-sm text-muted mt-1">
              Baserat på er profil rekommenderar vi:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {recommended.map((trackId) => {
                const track = tracks[trackId];
                return (
                  <Link
                    key={trackId}
                    href={`/guide/${trackId}`}
                    className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 bg-white"
                    style={{ border: `1.5px solid ${track.meta.color}` }}
                  >
                    <span
                      className="text-[10px] uppercase tracking-[0.08em] font-medium"
                      style={{ color: track.meta.color }}
                    >
                      Spår {track.meta.letter}
                    </span>
                    <p className="text-[15px] font-medium text-ink mt-1">
                      {track.meta.name}
                    </p>
                    <p className="text-xs text-muted mt-1.5 leading-relaxed">
                      {track.meta.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-10">
            <button
              onClick={handleSaveSnapshot}
              disabled={saveState !== "idle"}
              className="inline-flex items-center gap-2 text-sm font-medium rounded-[10px] px-6 py-3 border border-line bg-white text-ink hover:border-ink transition-colors disabled:opacity-70"
            >
              {saveState === "saving" && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-line border-t-ink animate-spin" />
              )}
              {saveState === "saving"
                ? "Sparar..."
                : saveState === "saved"
                ? "Sparat ✓"
                : "Spara denna mätning"}
            </button>
            {snapshots.length > 0 && (
              <button
                onClick={() => setShowCompare((v) => !v)}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                {showCompare ? "Dölj tidigare mätningar" : "Jämför med tidigare →"}
              </button>
            )}
          </div>
        </main>

        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white text-sm rounded-full px-5 py-2.5 transition-all duration-300 ${
            showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          Mätning sparad ✓
        </div>
      </div>
    </PageTransition>
  );
}
