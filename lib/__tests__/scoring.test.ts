import { describe, expect, it } from "vitest";
import { areaScorePct, maturityLabel, questionPoints, totalScorePct } from "../scoring";
import { assessmentAreas } from "@/data/assessment";
import type { AssessmentAnswer, AssessmentQuestion } from "../types";

const ratingQ: AssessmentQuestion = { id: "r1", text: "x", type: "rating", rating: { low: "a", high: "b" } };
const yesnoQ: AssessmentQuestion = { id: "y1", text: "x", type: "yesno" };

describe("questionPoints", () => {
  it("maps rating 1-4 to 0-3 points", () => {
    expect(questionPoints(ratingQ, { rating: 1 })).toBe(0);
    expect(questionPoints(ratingQ, { rating: 2 })).toBe(1);
    expect(questionPoints(ratingQ, { rating: 3 })).toBe(2);
    expect(questionPoints(ratingQ, { rating: 4 })).toBe(3);
  });

  it("maps yesno answers to the Excel point values", () => {
    expect(questionPoints(yesnoQ, { yesno: "ja" })).toBe(3);
    expect(questionPoints(yesnoQ, { yesno: "delvis" })).toBe(2);
    expect(questionPoints(yesnoQ, { yesno: "nej" })).toBe(0);
    expect(questionPoints(yesnoQ, { yesno: "vetej" })).toBe(0);
  });

  it("excludes 'ej relevant' entirely", () => {
    expect(questionPoints(yesnoQ, { yesno: "ejrelevant" })).toBeNull();
    expect(questionPoints(ratingQ, { yesno: "ejrelevant" })).toBeNull();
  });

  it("excludes unanswered questions entirely", () => {
    expect(questionPoints(yesnoQ, undefined)).toBeNull();
    expect(questionPoints(ratingQ, {})).toBeNull();
  });

  it("allows 'vet ej' on a rating question (treated like the yesno case)", () => {
    expect(questionPoints(ratingQ, { yesno: "vetej" })).toBe(0);
  });
});

describe("areaScorePct", () => {
  const area = assessmentAreas[0]; // infrastruktur: 5 rating + 2 yesno = 7 frågor

  it("gives 100% when every question is answered with the best answer", () => {
    const answers: Record<string, AssessmentAnswer> = {};
    for (const q of area.questions) {
      answers[q.id] = q.type === "rating" ? { rating: 4 } : { yesno: "ja" };
    }
    expect(areaScorePct(area, answers)).toBe(100);
  });

  it("gives 0% when every question is answered with the worst answer", () => {
    const answers: Record<string, AssessmentAnswer> = {};
    for (const q of area.questions) {
      answers[q.id] = q.type === "rating" ? { rating: 1 } : { yesno: "nej" };
    }
    expect(areaScorePct(area, answers)).toBe(0);
  });

  it("excludes 'ej relevant' from both the sum and the denominator", () => {
    const answers: Record<string, AssessmentAnswer> = {};
    for (const q of area.questions) {
      answers[q.id] = q.type === "rating" ? { rating: 4 } : { yesno: "ja" };
    }
    // Exkludera en fråga helt — resten är fortfarande 100%, inte lägre.
    answers[area.questions[0].id] = { yesno: "ejrelevant" };
    expect(areaScorePct(area, answers)).toBe(100);
  });

  it("counts 'vet ej' in the denominator (lowers the score, unlike 'ej relevant')", () => {
    const answers: Record<string, AssessmentAnswer> = {};
    for (const q of area.questions) {
      answers[q.id] = q.type === "rating" ? { rating: 4 } : { yesno: "ja" };
    }
    answers[area.questions[0].id] = { yesno: "vetej" };
    expect(areaScorePct(area, answers)).toBeLessThan(100);
  });

  it("returns null ('–' in the UI) when every question is excluded", () => {
    const answers: Record<string, AssessmentAnswer> = {};
    for (const q of area.questions) {
      answers[q.id] = { yesno: "ejrelevant" };
    }
    expect(areaScorePct(area, answers)).toBeNull();
  });

  it("returns null for a completely empty area", () => {
    expect(areaScorePct(area, undefined)).toBeNull();
    expect(areaScorePct(area, {})).toBeNull();
  });
});

describe("totalScorePct", () => {
  it("averages across all areas the same way as a single area", () => {
    const answers: Record<string, Record<string, AssessmentAnswer>> = {};
    for (const area of assessmentAreas) {
      answers[area.id] = {};
      for (const q of area.questions) {
        answers[area.id][q.id] = q.type === "rating" ? { rating: 4 } : { yesno: "ja" };
      }
    }
    expect(totalScorePct(assessmentAreas, answers)).toBe(100);
  });
});

describe("maturityLabel", () => {
  it("maps percentages to the five maturity bands", () => {
    expect(maturityLabel(0)).toBe("Initialt");
    expect(maturityLabel(20)).toBe("Initialt");
    expect(maturityLabel(21)).toBe("Etablerat");
    expect(maturityLabel(40)).toBe("Etablerat");
    expect(maturityLabel(41)).toBe("Definierat");
    expect(maturityLabel(60)).toBe("Definierat");
    expect(maturityLabel(61)).toBe("Hanterat");
    expect(maturityLabel(80)).toBe("Hanterat");
    expect(maturityLabel(81)).toBe("Optimerande");
    expect(maturityLabel(100)).toBe("Optimerande");
    expect(maturityLabel(null)).toBeNull();
  });
});
