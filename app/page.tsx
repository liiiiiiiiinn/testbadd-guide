"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScanLine, Map, Check, ArrowDown, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import { assessmentAreas, countAnswered } from "@/data/assessment";
import { useAssessmentAnswers } from "@/lib/storage";

const DOTS = ["#E8750A", "#185FA5", "#2D7A4F", "#7B68D9"];

const TRACK_PILLS = [
  { emoji: "🟠", label: "Etablera testbädd", color: "#E8750A", href: "/guide/etablera" },
  { emoji: "🔵", label: "Driva testbädd", color: "#185FA5", href: "/guide/driva" },
  { emoji: "🟢", label: "Skala testbädd", color: "#2D7A4F", href: "/guide/skala" },
];

export default function Home() {
  const { answers } = useAssessmentAnswers();
  const hasStartedAssessment = assessmentAreas.some(
    (area) => countAnswered(area, answers[area.id]) > 0
  );

  return (
    <PageTransition>
      <div className="min-h-screen bg-page">
        <Navbar />

        {hasStartedAssessment && (
          <div style={{ backgroundColor: "#EAF4EE" }}>
            <Link
              href="/assess"
              className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: "#2D7A4F" }}
            >
              <RotateCcw size={14} />
              Du har en påbörjad bedömning. Fortsätt där du slutade →
            </Link>
          </div>
        )}

        <main className="max-w-3xl mx-auto px-6 pb-24">
          <div className="flex flex-col items-center text-center gap-0 pt-20 max-w-[560px] mx-auto">
            <div className="flex items-center gap-1.5">
              {DOTS.map((color, i) => (
                <motion.span
                  key={color}
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1, ease: "easeOut" }}
                />
              ))}
            </div>

            <h1 className="text-[32px] font-medium text-ink mt-5">
              Stärk er testbäddsförmåga
            </h1>

            <p className="text-[17px] text-muted leading-[1.65] mt-3">
              Ett metodstöd för dig som äger eller utvecklar en testbädd.
              Börja med att bedöma var ni står — följ sedan guiden för att
              stärka era förmågor.
            </p>
          </div>

          <p
            className="text-center text-sm leading-relaxed max-w-[480px] mx-auto mt-8"
            style={{ color: "#5C5C5C" }}
          >
            Börja med att bedöma er förmåga — eller gå direkt till
            metodstödet om ni redan vet var ni vill utvecklas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="group rounded-2xl bg-white p-8 flex flex-col transition-colors duration-200 hover:bg-[#FFFAF6]"
              style={{
                border: "1.5px solid #E8750A",
                boxShadow: "0 0 0 rgba(232,117,10,0)",
              }}
            >
              <ScanLine size={28} color="#E8750A" strokeWidth={1.75} />
              <h2 className="text-xl font-medium text-ink mt-5">
                Bedöm er förmåga
              </h2>
              <p className="text-sm text-muted leading-[1.6] mt-2.5">
                Gör en strukturerad självskattning av era styrkor och
                utvecklingsområden. Resultatet visar var ni har störst
                potential att växa.
              </p>
              <div className="flex flex-col gap-1.5 mt-4 text-[13px] text-muted">
                <div className="flex items-center gap-2">
                  <Check size={12} color="#2D7A4F" strokeWidth={2.5} />
                  Förmågeprofil i spindeldiagram
                </div>
                <div className="flex items-center gap-2">
                  <Check size={12} color="#2D7A4F" strokeWidth={2.5} />
                  Identifierade utvecklingsområden
                </div>
                <div className="flex items-center gap-2">
                  <Check size={12} color="#2D7A4F" strokeWidth={2.5} />
                  Underlag för prioritering
                </div>
              </div>
              <Link
                href="/assess"
                className="mt-6 w-full text-center text-white text-[15px] font-medium rounded-[10px] py-3.5 transition-all duration-200 hover:-translate-y-px"
                style={{ backgroundColor: "#E8750A" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#CF6A09")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E8750A")}
              >
                Starta bedömningen →
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="group rounded-2xl bg-white p-8 flex flex-col transition-colors duration-200 hover:bg-[#FAFAF9]"
              style={{ border: "1.5px solid #E8E5E0" }}
            >
              <Map size={28} color="#5C5C5C" strokeWidth={1.75} />
              <h2 className="text-xl font-medium text-ink mt-5">
                Följ metodstödet
              </h2>
              <p className="text-sm text-muted leading-[1.6] mt-2.5">
                Välj det spår som passar er situation och arbeta igenom
                stegen i er egen takt. Guiden hjälper er att omsätta
                insikterna från bedömningen till konkret handling.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {TRACK_PILLS.map((pill) => (
                  <Link
                    key={pill.label}
                    href={pill.href}
                    className="inline-flex items-center gap-1.5 text-xs rounded-full bg-white px-3 py-1 hover:bg-black/[0.02] transition-colors"
                    style={{ border: `1px solid ${pill.color}`, color: pill.color }}
                  >
                    {pill.emoji} {pill.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/guide/etablera"
                className="mt-6 w-full text-center text-ink text-[15px] font-medium rounded-[10px] py-3.5 bg-white transition-colors duration-200"
                style={{ border: "1.5px solid #E8E5E0" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1A1A1A")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E8E5E0")}
              >
                Välj spår →
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-2 mt-8 max-w-[400px] mx-auto text-center">
            <ArrowDown size={16} color="#D4D0CB" />
            <p className="text-[13px] leading-relaxed" style={{ color: "#9C9893" }}>
              Bedömningen och metodstödet hänger ihop. Spindeldiagrammet från
              bedömningen följer med dig in i guiden.
            </p>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
