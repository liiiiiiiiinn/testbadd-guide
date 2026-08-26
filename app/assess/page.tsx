"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import Breadcrumb from "@/components/Breadcrumb";
import AreaIcon from "@/components/AreaIcon";
import { assessmentAreas, countAnswered } from "@/data/assessment";
import { useAssessmentAnswers } from "@/lib/storage";

export default function AssessOverviewPage() {
  const { answers } = useAssessmentAnswers();

  const progress = assessmentAreas.map((area) => {
    const answered = countAnswered(area, answers[area.id]);
    const total = area.questions.length;
    const status: "done" | "started" | "none" =
      answered === total ? "done" : answered > 0 ? "started" : "none";
    return { area, answered, total, status };
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-page">
        <Navbar backHref="/" />

        <main className="max-w-3xl mx-auto px-6 pb-24">
          <div className="pt-4">
            <Breadcrumb items={[{ label: "Start", href: "/" }, { label: "Bedömning" }]} />
          </div>
          <div className="text-center pt-8">
            <h1 className="text-[28px] font-medium text-ink">
              Bedöm er förmåga
            </h1>
            <p className="text-[15px] text-muted mt-2 max-w-md mx-auto leading-relaxed">
              Fyra förmågeområden, cirka 5–10 minuter totalt. Ni kan pausa och
              återuppta när som helst.
            </p>
          </div>

          <div className="flex items-start justify-center gap-0 mt-12">
            {progress.map(({ area, status }, i) => (
              <div key={area.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{
                      backgroundColor: status === "done" ? area.color : "#fff",
                      border:
                        status === "none"
                          ? "2px solid #E8E5E0"
                          : `2px solid ${area.color}`,
                      color:
                        status === "done"
                          ? "#fff"
                          : status === "started"
                          ? area.color
                          : "#9C9893",
                    }}
                  >
                    {status === "done" ? <Check size={18} strokeWidth={2.5} /> : i + 1}
                  </div>
                  <span className="text-[11px] text-muted text-center w-16">
                    {area.title}
                  </span>
                </div>
                {i < progress.length - 1 && (
                  <div className="h-0.5 flex-1 mx-1 mb-6 rounded-full overflow-hidden bg-[#E8E5E0]">
                    <div
                      className="h-full transition-all duration-500"
                      style={{
                        width: status === "done" ? "100%" : "0%",
                        backgroundColor: area.color,
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-14">
            {progress.map(({ area, answered, total, status }) => {
              const statusLabel =
                status === "done"
                  ? "Klar ✓"
                  : status === "started"
                  ? `${answered} av ${total} besvarade`
                  : "Ej påbörjad";
              const buttonLabel =
                status === "done" ? "Se svar" : status === "started" ? "Fortsätt" : "Börja";

              return (
                <div
                  key={area.id}
                  className="rounded-2xl bg-white p-8 flex flex-col transition-all duration-200 hover:-translate-y-0.5"
                  style={{ border: `1.5px solid ${area.color}` }}
                >
                  <AreaIcon name={area.icon} size={26} color={area.color} strokeWidth={1.75} />
                  <div className="flex items-center gap-2 mt-5">
                    <h2 className="text-lg font-medium text-ink">{area.title}</h2>
                    <span
                      className="text-[11px] rounded-full px-2 py-0.5"
                      style={{ backgroundColor: area.lightColor, color: area.color }}
                    >
                      {total} frågor
                    </span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mt-2">
                    {area.description}
                  </p>
                  <div className="flex items-center justify-between mt-6">
                    <span
                      className="text-xs font-medium"
                      style={{ color: status === "done" ? "#2D7A4F" : "#5C5C5C" }}
                    >
                      {statusLabel}
                    </span>
                    <Link
                      href={`/assess/${area.id}`}
                      className="text-sm font-medium hover:opacity-80 transition-opacity"
                      style={{ color: area.color }}
                    >
                      {buttonLabel} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {progress.every((p) => p.status === "done") && (
            <div className="text-center mt-10">
              <Link
                href="/assess/result"
                className="inline-block text-white text-[15px] font-medium rounded-[10px] px-8 py-3.5"
                style={{ backgroundColor: "#1A1A1A" }}
              >
                Se ert resultat →
              </Link>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
