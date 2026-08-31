"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import Breadcrumb from "@/components/Breadcrumb";
import AssessmentQuestionCard from "@/components/AssessmentQuestionCard";
import { assessmentAreas, countAnswered, getAssessmentArea, getAssessmentAreaIndex } from "@/data/assessment";
import { useAssessmentAnswers } from "@/lib/storage";

export default function AssessAreaClient({ areaId }: { areaId: string }) {
  const area = getAssessmentArea(areaId)!;
  const areaIndex = getAssessmentAreaIndex(areaId);
  const { answers, setAnswer } = useAssessmentAnswers();
  const areaAnswers = answers[area.id];
  const answered = countAnswered(area, areaAnswers);
  const total = area.questions.length;
  const isComplete = answered === total;
  const remainingMin = Math.ceil((total - answered) * 0.5);

  const nextArea = assessmentAreas[areaIndex + 1];
  const nextLabel = nextArea ? `Nästa område: ${nextArea.title} →` : "Se ert resultat →";
  const nextHref = nextArea ? `/assess/${nextArea.id}` : "/assess/result";

  return (
    <PageTransition>
      <div className="min-h-screen bg-page">
        <Navbar backHref="/assess" />

        <main className="max-w-[640px] mx-auto px-6 pb-24">
          <div className="pt-4">
            <Breadcrumb
              items={[
                { label: "Start", href: "/" },
                { label: "Bedömning", href: "/assess" },
                { label: area.title },
              ]}
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-6">
            {assessmentAreas.map((a, i) => {
              const aAnswered = countAnswered(a, answers[a.id]);
              const aDone = aAnswered === a.questions.length;
              const isCurrent = a.id === area.id;
              return (
                <div
                  key={a.id}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                  style={{
                    backgroundColor: aDone ? a.color : "#fff",
                    border: isCurrent
                      ? `2px solid ${a.color}`
                      : aDone
                      ? "none"
                      : "2px solid #E8E5E0",
                    color: aDone ? "#fff" : isCurrent ? a.color : "#9C9893",
                  }}
                >
                  {aDone ? <Check size={14} strokeWidth={2.5} /> : i + 1}
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-muted mt-3">
            Förmågeområde {areaIndex + 1} av {assessmentAreas.length} ·{" "}
            <span style={{ color: area.color }}>{area.title}</span>
          </p>
          <p className="text-center text-xs text-muted mt-1">
            Fråga {answered} av {total} besvarade
            {remainingMin > 0 && ` · ca ${remainingMin} min kvar`}
          </p>

          <div className="mt-10">
            {area.questions.map((question, i) => (
              <AssessmentQuestionCard
                key={question.id}
                area={area}
                question={question}
                index={i}
                answer={areaAnswers?.[question.id]}
                onChange={(patch) => setAnswer(area.id, question.id, patch)}
              />
            ))}
          </div>

          {isComplete && (
            <div
              className="rounded-[14px] px-6 py-6 mt-2 text-center"
              style={{ backgroundColor: area.lightColor }}
            >
              <h3 className="text-base font-medium text-ink">Bra jobbat!</h3>
              <p className="text-sm text-muted mt-1">
                Ni har besvarat alla frågor i detta område.
              </p>
            </div>
          )}

          <div className="flex justify-center mt-8">
            <Link
              href={nextHref}
              className="inline-block text-white text-sm font-medium rounded-[10px] px-6 py-3 transition-opacity hover:opacity-90"
              style={{ backgroundColor: area.color }}
            >
              {nextLabel}
            </Link>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
