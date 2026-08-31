"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TrendingUp, Target, ChevronDown, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import Breadcrumb from "@/components/Breadcrumb";
import RadarChart from "@/components/RadarChart";
import AreaBadge from "@/components/AreaBadge";
import { assessmentAreas } from "@/data/assessment";
import { tracks } from "@/data/playbook";
import { useAssessmentAnswers, useAssessmentSnapshots, computeAllScores } from "@/lib/storage";
import type { AssessmentArea, AssessmentAreaId, AssessmentQuestion, TrackId } from "@/lib/types";

const RATING_LABELS_4 = ["", "Låg", "Delvis", "Till stor del", "Hög"];

const MATURITY_LEVELS = [
  { max: 20, label: "Initialt", color: "#C0392B" },
  { max: 40, label: "Etablerat", color: "#E8750A" },
  { max: 60, label: "Definierat", color: "#C9A227" },
  { max: 80, label: "Hanterat", color: "#6B9E5A" },
  { max: 101, label: "Optimerande", color: "#2D7A4F" },
];

function maturityLevel(pct: number | null): { label: string; color: string } | null {
  if (pct === null) return null;
  return MATURITY_LEVELS.find((l) => pct < l.max) ?? MATURITY_LEVELS[MATURITY_LEVELS.length - 1];
}

function pctOf(score: number | null): number | null {
  return score === null ? null : Math.round((score / 4) * 100);
}

/** Normaliserad 0–4-poäng för en enskild fråga, för att kunna rangordna över hela bedömningen. Null = obesvarad, "vet ej" eller "ej relevant". */
function questionScore(question: AssessmentQuestion, answer: { rating?: number; yesno?: string } | undefined): number | null {
  if (!answer) return null;
  if (question.type === "rating") return typeof answer.rating === "number" ? answer.rating : null;
  if (answer.yesno === "ja") return 4;
  if (answer.yesno === "delvis") return 2;
  if (answer.yesno === "nej") return 0;
  return null;
}

type Effort = { label: "Låg" | "Medel" | "Hög"; color: string };

function effortForQuestion(question: AssessmentQuestion): Effort {
  const text = question.text.toLowerCase();
  if (
    text.includes("gdpr") ||
    text.includes("juridi") ||
    text.includes("integritet") ||
    text.includes("samtycke") ||
    text.includes("etisk") ||
    text.includes("avtal") ||
    text.includes("rättighet") ||
    text.includes("sekretess")
  ) {
    return { label: "Hög", color: "#C0392B" };
  }
  if (
    text.includes("dokument") ||
    text.includes("rutin") ||
    text.includes("checklist") ||
    text.includes("kompetens") ||
    text.includes("mät")
  ) {
    return { label: "Medel", color: "#E8750A" };
  }
  return { label: "Låg", color: "#2D7A4F" };
}

function nextStepSuggestion(question: AssessmentQuestion, effort: Effort): string {
  if (question.type === "rating" && question.rating) {
    return `Arbeta mot: ${question.rating.high.toLowerCase()}.`;
  }
  if (effort.label === "Hög") {
    return "Ta upp med jurist/dataskyddsombud och få ett formellt beslut på plats.";
  }
  if (effort.label === "Medel") {
    return "Dokumentera nuläget och sätt en enkel rutin för uppföljning.";
  }
  return "Bestäm vem som äger frågan och skriv ner en enkel rutin.";
}

function recommendation(scores: Record<AssessmentAreaId, number | null>) {
  const infraMetoder = [scores.infrastruktur, scores.metoder].filter(
    (v): v is number => v !== null
  );
  const infraMetoderPct = infraMetoder.length
    ? (infraMetoder.reduce((a, b) => a + b, 0) / infraMetoder.length / 4) * 100
    : null;
  const all = assessmentAreas.map((a) => scores[a.id]).filter((v): v is number => v !== null);
  const overallPct = all.length ? (all.reduce((a, b) => a + b, 0) / all.length / 4) * 100 : null;

  if (infraMetoderPct !== null && infraMetoderPct < 40) {
    return {
      trackId: "etablera" as TrackId,
      text: "Era scores tyder på att ni är i en uppbyggnadsfas. Spår A hjälper er att lägga rätt grund.",
    };
  }
  if (overallPct !== null && overallPct > 70) {
    return {
      trackId: "driva" as TrackId,
      text: "Ni är på god väg. Fokusera på att institutionalisera era starka sidor och adressera kunskapsluckorna.",
    };
  }
  if (overallPct !== null) {
    return {
      trackId: "driva" as TrackId,
      text: "Ni har en grund — nu handlar det om att systematisera och stärka era förmågor.",
    };
  }
  return {
    trackId: "etablera" as TrackId,
    text: "Fyll i bedömningen för en skräddarsydd rekommendation. Spår A är en bra startpunkt under tiden.",
  };
}

function buildAssessmentMarkdown(
  scores: Record<AssessmentAreaId, number | null>,
  answers: ReturnType<typeof useAssessmentAnswers>["answers"]
) {
  const lines: string[] = [];
  lines.push("# Testbäddsguiden — Förmågeprofil");
  lines.push("");
  lines.push(`Genererat: ${new Date().toLocaleDateString("sv-SE")}`);
  lines.push("");
  for (const area of assessmentAreas) {
    const pct = pctOf(scores[area.id]);
    lines.push(`## ${area.title} (${pct !== null ? `${pct}%` : "ej bedömt"})`);
    const areaAnswers = answers[area.id] ?? {};
    for (const question of area.questions) {
      const answer = areaAnswers[question.id];
      lines.push("");
      lines.push(`**${question.text}**`);
      if (question.type === "rating") {
        lines.push(
          typeof answer?.rating === "number"
            ? `${answer.rating}/4 – ${RATING_LABELS_4[answer.rating]}`
            : "Inte besvarad."
        );
      } else {
        const labels: Record<string, string> = {
          ja: "Ja",
          delvis: "Delvis",
          nej: "Nej",
          vetej: "Vet ej",
          ejrelevant: "Ej relevant",
        };
        lines.push(answer?.yesno ? labels[answer.yesno] : "Inte besvarad.");
      }
      if (answer?.comment?.trim()) {
        lines.push(`» ${answer.comment.trim()}`);
      }
    }
    lines.push("");
  }
  lines.push("---");
  lines.push("Genererat med Testbäddsguiden · Innovation Helsingborg");
  return lines.join("\n");
}

function AnswerRow({ question, answer }: { question: AssessmentQuestion; answer: { rating?: number; yesno?: string; comment?: string } | undefined }) {
  let icon: React.ReactNode;
  let label: string;
  let labelColor = "#5C5C5C";
  let italic = false;

  if (question.type === "rating") {
    const value = answer?.rating;
    const color =
      value === undefined
        ? "#C4C0BB"
        : value === 1
        ? "#C0392B"
        : value === 2
        ? "#E8750A"
        : value === 3
        ? "#6B9E5A"
        : "#2D7A4F";
    icon = (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium text-white"
        style={{ backgroundColor: value ? color : "#E8E5E0", color: value ? "#fff" : "#9C9893" }}
      >
        {value ?? "–"}
      </span>
    );
    label = value ? `${value}/4 – ${RATING_LABELS_4[value]}` : "Inte besvarad";
    labelColor = value ? "#1A1A1A" : "#9C9893";
    italic = !value;
  } else {
    const yesno = answer?.yesno;
    const map: Record<string, { symbol: string; color: string; label: string }> = {
      ja: { symbol: "✓", color: "#2D7A4F", label: "Ja" },
      delvis: { symbol: "~", color: "#E8750A", label: "Delvis" },
      nej: { symbol: "✗", color: "#C0392B", label: "Nej" },
      vetej: { symbol: "?", color: "#9C9893", label: "Vet ej" },
      ejrelevant: { symbol: "–", color: "#C4C0BB", label: "Ej relevant" },
    };
    const entry = yesno ? map[yesno] : null;
    icon = (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-base font-bold leading-none"
        style={{ color: entry?.color ?? "#C4C0BB" }}
      >
        {entry?.symbol ?? "–"}
      </span>
    );
    label = entry?.label ?? "Inte besvarad";
    labelColor = entry?.color ?? "#9C9893";
    italic = !entry || yesno === "ejrelevant";
  }

  return (
    <div className="flex flex-col gap-1 py-2.5 border-b border-line last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          {icon}
          <p className="text-sm text-ink leading-snug">{question.text}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: labelColor, fontStyle: italic ? "italic" : "normal" }}
          >
            {label}
          </span>
          {question.type === "yesno" && answer?.yesno === "vetej" && (
            <span className="text-[10px] rounded-full bg-black/[0.05] text-muted px-2 py-0.5">
              Kunskapslucka
            </span>
          )}
        </div>
      </div>
      {answer?.comment?.trim() && (
        <p className="text-[13px] text-muted italic pl-[30px]">» {answer.comment.trim()}</p>
      )}
    </div>
  );
}

function AreaSection({
  area,
  answers,
  score,
  isOpen,
  onToggle,
}: {
  area: AssessmentArea;
  answers: Record<string, { rating?: number; yesno?: string; comment?: string }> | undefined;
  score: number | null;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const pct = pctOf(score);
  const maturity = maturityLevel(pct);

  return (
    <div id={`area-${area.id}`} className="flex flex-col scroll-mt-24">
      <button
        type="button"
        onClick={onToggle}
        className="flex flex-col gap-2.5 text-left rounded-xl bg-white px-5 py-4 transition-colors hover:bg-black/[0.01]"
        style={{ borderLeft: `4px solid ${area.color}` }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] font-medium text-ink">{area.title}</span>
            {maturity && (
              <span
                className="text-[10px] font-medium rounded-full px-2 py-0.5"
                style={{ backgroundColor: `${maturity.color}1A`, color: maturity.color }}
              >
                {maturity.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-sm font-medium tabular-nums text-ink">
              {pct !== null ? `${pct}%` : "–"}
            </span>
            <ChevronDown
              size={16}
              color="#9C9893"
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-black/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct ?? 0}%`, backgroundColor: area.color }}
          />
        </div>
      </button>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pt-3 pb-1">
            {area.questions.map((question) => (
              <AnswerRow key={question.id} question={question} answer={answers?.[question.id]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessResultPage() {
  const { answers } = useAssessmentAnswers();
  const { snapshots, addSnapshot } = useAssessmentSnapshots();
  const [showToast, setShowToast] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [copied, setCopied] = useState(false);
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({});
  const didInitOpen = useRef(false);

  const scores = computeAllScores(answers);
  const scoredValues = assessmentAreas
    .map((a) => scores[a.id])
    .filter((v): v is number => v !== null);
  const overallAvg =
    scoredValues.length > 0
      ? scoredValues.reduce((a, b) => a + b, 0) / scoredValues.length
      : null;
  const overallPct = pctOf(overallAvg);
  const overallMaturity = maturityLevel(overallPct);
  const isEmpty = scoredValues.length === 0;

  const ranked = [...assessmentAreas]
    .filter((a) => scores[a.id] !== null)
    .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0));
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];

  useEffect(() => {
    if (didInitOpen.current || isEmpty) return;
    didInitOpen.current = true;
    if (weakest) setOpenAreas({ [weakest.id]: true });
  }, [isEmpty, weakest]);

  const today = new Date().toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Kunskapsluckor — alla "vet ej"-svar över samtliga områden.
  const knowledgeGaps: { area: AssessmentArea; question: AssessmentQuestion }[] = [];
  for (const area of assessmentAreas) {
    const areaAnswers = answers[area.id] ?? {};
    for (const question of area.questions) {
      if (question.type === "yesno" && areaAnswers[question.id]?.yesno === "vetej") {
        knowledgeGaps.push({ area, question });
      }
    }
  }

  // Tre prioriterade frågor — lägst normaliserad poäng, exkl. obesvarat/vet ej/ej relevant.
  const scoredQuestions: { area: AssessmentArea; question: AssessmentQuestion; score: number }[] = [];
  for (const area of assessmentAreas) {
    const areaAnswers = answers[area.id] ?? {};
    for (const question of area.questions) {
      const s = questionScore(question, areaAnswers[question.id]);
      if (s !== null) scoredQuestions.push({ area, question, score: s });
    }
  }
  const priorityQuestions = [...scoredQuestions].sort((a, b) => a.score - b.score).slice(0, 3);

  const rec = recommendation(scores);
  const recTrack = tracks[rec.trackId];

  function handleSaveSnapshot() {
    setSaveState("saving");
    setTimeout(() => {
      addSnapshot(scores);
      setSaveState("saved");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setTimeout(() => setSaveState("idle"), 1000);
    }, 500);
  }

  async function handleCopySummary() {
    const markdown = buildAssessmentMarkdown(scores, answers);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard otillgänglig i denna miljö
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-page">
        <div className="no-print">
          <Navbar backHref="/assess" />
        </div>

        <main className="max-w-[720px] mx-auto px-5 pt-10 pb-24">
          <div className="no-print">
            <Breadcrumb
              items={[
                { label: "Start", href: "/" },
                { label: "Bedömning", href: "/assess" },
                { label: "Resultat" },
              ]}
            />
          </div>

          <p
            className="text-center text-[13px] uppercase text-muted mt-6"
            style={{ letterSpacing: "0.08em" }}
          >
            Er förmågeprofil · {today}
          </p>

          {isEmpty ? (
            <div className="flex flex-col items-center gap-6 mt-10">
              <RadarChart scores={scores} />
              <p className="text-sm text-muted text-center max-w-sm">
                Fyll i bedömningen för att se er förmågeprofil →
              </p>
              <Link
                href="/assess"
                className="text-white text-sm font-medium rounded-[10px] px-6 py-3"
                style={{ backgroundColor: "#1A1A1A" }}
              >
                Till bedömningen
              </Link>
            </div>
          ) : (
            <>
              {/* SEKTION 1 — HERO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div
                  className="rounded-[14px] bg-white px-6 py-6 flex flex-col items-center text-center"
                  style={{ border: "0.5px solid #E8E5E0" }}
                >
                  <span className="text-[48px] font-medium leading-none text-ink tabular-nums">
                    {overallPct !== null ? `${overallPct}%` : "–"}
                  </span>
                  {overallMaturity && (
                    <span
                      className="mt-3 text-xs font-medium rounded-full px-3 py-1"
                      style={{ backgroundColor: `${overallMaturity.color}1A`, color: overallMaturity.color }}
                    >
                      {overallMaturity.label}
                    </span>
                  )}
                </div>
                <div
                  className="rounded-[14px] bg-white px-6 py-6 flex flex-col items-center text-center gap-1.5"
                  style={{ border: "0.5px solid #E8E5E0" }}
                >
                  <TrendingUp size={20} color="#2D7A4F" />
                  <span className="text-xs text-muted">Starkaste område</span>
                  {strongest ? (
                    <span className="text-sm font-medium" style={{ color: "#2D7A4F" }}>
                      {strongest.title} · {pctOf(scores[strongest.id])}%
                    </span>
                  ) : (
                    <span className="text-sm text-muted">–</span>
                  )}
                </div>
                <div
                  className="rounded-[14px] bg-white px-6 py-6 flex flex-col items-center text-center gap-1.5"
                  style={{ border: "0.5px solid #E8E5E0" }}
                >
                  <Target size={20} color="#E8750A" />
                  <span className="text-xs text-muted">Störst potential</span>
                  {weakest ? (
                    <span className="text-sm font-medium" style={{ color: "#E8750A" }}>
                      {weakest.title} · {pctOf(scores[weakest.id])}%
                    </span>
                  ) : (
                    <span className="text-sm text-muted">–</span>
                  )}
                </div>
              </div>

              {/* SEKTION 2 — SPINDELDIAGRAM */}
              <div className="mt-12">
                <RadarChart scores={scores} ghosts={showCompare ? snapshots.map((s) => s.scores) : []} />
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  {assessmentAreas.map((area) => {
                    const pct = pctOf(scores[area.id]);
                    return (
                      <a
                        key={area.id}
                        href={`#area-${area.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(`area-${area.id}`)
                            ?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="inline-flex items-center gap-1.5 text-[13px] rounded-full bg-white px-3.5 py-1.5 hover:bg-black/[0.02] transition-colors"
                        style={{ border: `1px solid ${area.color}`, color: area.color }}
                      >
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: area.color }}
                        />
                        {area.title} · {pct !== null ? `${pct}%` : "–"}
                      </a>
                    );
                  })}
                </div>
                {snapshots.length > 0 && (
                  <div className="no-print text-center mt-3">
                    <button
                      onClick={() => setShowCompare((v) => !v)}
                      className="text-sm text-muted hover:text-ink transition-colors"
                    >
                      {showCompare ? "Dölj tidigare mätningar" : "Jämför med tidigare →"}
                    </button>
                  </div>
                )}
              </div>

              {/* SEKTION 3 — OMRÅDE FÖR OMRÅDE */}
              <div className="mt-14">
                <h2 className="text-base font-medium text-ink mb-4">Detaljerad genomgång</h2>
                <div className="flex flex-col gap-3">
                  {assessmentAreas.map((area) => (
                    <AreaSection
                      key={area.id}
                      area={area}
                      answers={answers[area.id]}
                      score={scores[area.id]}
                      isOpen={!!openAreas[area.id]}
                      onToggle={() =>
                        setOpenAreas((prev) => ({ ...prev, [area.id]: !prev[area.id] }))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* SEKTION 4 — KUNSKAPSLUCKOR */}
              {knowledgeGaps.length > 0 && (
                <div
                  className="mt-10 px-5 py-4 rounded-r-xl"
                  style={{ backgroundColor: "#FFFBEB", borderLeft: "4px solid #F59E0B" }}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} color="#F59E0B" />
                    <h3 className="text-sm font-medium text-ink">Kunskapsluckor att utforska</h3>
                  </div>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    Ni har markerat {knowledgeGaps.length}{" "}
                    {knowledgeGaps.length === 1 ? "fråga" : "frågor"} som &quot;Vet ej&quot;. Det
                    signalerar kunskapsluckor snarare än faktiska brister. Vi rekommenderar en
                    intern workshop för att kartlägga dessa.
                  </p>
                  <ul className="flex flex-col gap-2 mt-3">
                    {knowledgeGaps.map(({ area, question }) => (
                      <li key={`${area.id}-${question.id}`} className="flex items-center gap-2.5">
                        <AreaBadge title={area.title} color={area.color} lightColor={area.lightColor} />
                        <span className="text-sm text-ink">{question.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SEKTION 5 — PRIORITERADE NÄSTA STEG */}
              {priorityQuestions.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-base font-medium text-ink mb-4">Tre saker att ta tag i</h2>
                  <div className="flex flex-col gap-3">
                    {priorityQuestions.map(({ area, question }, i) => {
                      const effort = effortForQuestion(question);
                      return (
                        <div
                          key={`${area.id}-${question.id}`}
                          className="rounded-xl bg-white px-5 py-5 flex flex-col gap-2.5"
                          style={{ border: "0.5px solid #E8E5E0" }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-medium text-muted">{i + 1}</span>
                            <AreaBadge title={area.title} color={area.color} lightColor={area.lightColor} />
                          </div>
                          <p className="text-[15px] font-medium text-ink">{question.text}</p>
                          <p className="text-sm text-muted">
                            → Konkret nästa steg: {nextStepSuggestion(question, effort)}
                          </p>
                          <div className="flex justify-end">
                            <span
                              className="text-[11px] font-medium rounded-full px-2.5 py-1"
                              style={{ backgroundColor: `${effort.color}1A`, color: effort.color }}
                            >
                              {effort.label} insats
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SEKTION 6 — KOPPLINGSKORT TILL METODSTÖDET */}
              <div className="mt-12">
                <p className="text-xs font-medium uppercase tracking-[0.06em] text-muted mb-3">
                  Vad gör ni nu?
                </p>
                <div
                  className="rounded-2xl bg-white px-6 py-6 flex flex-col gap-3"
                  style={{ border: "1.5px solid #E8750A" }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.08em] font-medium w-fit"
                    style={{ color: recTrack.meta.color }}
                  >
                    Spår {recTrack.meta.letter} · {recTrack.meta.name}
                  </span>
                  <p className="text-sm text-ink leading-relaxed">{rec.text}</p>
                  <Link
                    href={`/guide/${recTrack.meta.id}`}
                    className="self-start mt-1 text-white text-sm font-medium rounded-[10px] px-5 py-2.5 transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#E8750A" }}
                  >
                    Gå till metodstödet →
                  </Link>
                </div>
              </div>

              {/* SEKTION 7 — EXPORT */}
              <div className="no-print flex flex-wrap items-center justify-center gap-3 mt-12">
                <button
                  onClick={handleSaveSnapshot}
                  disabled={saveState !== "idle"}
                  className="text-sm font-medium rounded-[10px] px-5 py-2.5 border border-line bg-white text-ink hover:border-ink transition-colors disabled:opacity-70"
                >
                  {saveState === "saving" ? "Sparar..." : saveState === "saved" ? "Sparat ✓" : "💾 Spara mätning"}
                </button>
                <button
                  onClick={handleCopySummary}
                  className="text-sm font-medium rounded-[10px] px-5 py-2.5 border border-line bg-white text-ink hover:border-ink transition-colors"
                >
                  {copied ? "Kopierat ✓" : "📋 Kopiera sammanfattning"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-sm font-medium rounded-[10px] px-5 py-2.5 border border-line bg-white text-ink hover:border-ink transition-colors"
                >
                  🖨 Skriv ut
                </button>
              </div>
            </>
          )}
        </main>

        <div
          className={`no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white text-sm rounded-full px-5 py-2.5 transition-all duration-300 ${
            showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          Mätning sparad ✓
        </div>
      </div>
    </PageTransition>
  );
}
