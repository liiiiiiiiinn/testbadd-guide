import type { AssessmentAnswer, AssessmentArea, AssessmentQuestion } from "./types";

/**
 * Enda källan för poängsättning i förmågebedömningen — reglerna är
 * identiska med samordnarens Excelfil (se /docs/EXCEL_KOPPLING.md):
 *
 *   Ja = 3 · Delvis = 2 · Nej = 0 · Vet ej = 0 (räknas med i nämnaren,
 *   flaggas som kunskapslucka) · Ej relevant = utesluts helt ·
 *   Obesvarad = utesluts helt · Skalvärde 1/2/3/4 = 0/1/2/3 poäng.
 *
 * Områdespoäng (%) = summa poäng ÷ (3 × antal medräknade frågor) × 100.
 * Om alla frågor i ett område är uteslutna: null (visas som "–").
 */

export type MaturityLabel = "Initialt" | "Etablerat" | "Definierat" | "Hanterat" | "Optimerande";

const MATURITY_BANDS: { max: number; label: MaturityLabel }[] = [
  { max: 20, label: "Initialt" },
  { max: 40, label: "Etablerat" },
  { max: 60, label: "Definierat" },
  { max: 80, label: "Hanterat" },
  { max: 101, label: "Optimerande" },
];

/** Poäng för en enskild fråga (0–3), eller null om frågan ska uteslutas (ej relevant/obesvarad). */
export function questionPoints(
  question: AssessmentQuestion,
  answer: AssessmentAnswer | undefined
): number | null {
  if (!answer) return null;

  // Skalfrågor kan också ha fått "vet ej"/"ej relevant" istället för ett
  // skalvärde (se AssessmentQuestionCard) — samma regler som ja/nej-frågor.
  if (answer.yesno === "ejrelevant") return null;
  if (answer.yesno === "vetej") return 0;

  if (question.type === "rating") {
    if (typeof answer.rating !== "number") return null;
    return answer.rating - 1; // 1→0, 2→1, 3→2, 4→3
  }

  switch (answer.yesno) {
    case "ja":
      return 3;
    case "delvis":
      return 2;
    case "nej":
      return 0;
    default:
      return null; // obesvarad
  }
}

/** True om frågan ska räknas i nämnaren (dvs. inte "ej relevant" eller obesvarad). */
export function isQuestionCounted(
  question: AssessmentQuestion,
  answer: AssessmentAnswer | undefined
): boolean {
  return questionPoints(question, answer) !== null;
}

/** True om svaret är "vet ej" — en kunskapslucka, oavsett frågetyp. */
export function isKnowledgeGap(answer: AssessmentAnswer | undefined): boolean {
  return answer?.yesno === "vetej";
}

/** Områdespoäng i procent (0–100), eller null om samtliga frågor i området är uteslutna. */
export function areaScorePct(
  area: AssessmentArea,
  areaAnswers: Record<string, AssessmentAnswer> | undefined
): number | null {
  let sum = 0;
  let countedQuestions = 0;
  for (const question of area.questions) {
    const points = questionPoints(question, areaAnswers?.[question.id]);
    if (points === null) continue;
    sum += points;
    countedQuestions += 1;
  }
  if (countedQuestions === 0) return null;
  return (sum / (3 * countedQuestions)) * 100;
}

/** Totalpoäng i procent över samtliga frågor i alla områden, eller null. */
export function totalScorePct(
  areas: AssessmentArea[],
  answers: Record<string, Record<string, AssessmentAnswer> | undefined>
): number | null {
  let sum = 0;
  let countedQuestions = 0;
  for (const area of areas) {
    const areaAnswers = answers[area.id];
    for (const question of area.questions) {
      const points = questionPoints(question, areaAnswers?.[question.id]);
      if (points === null) continue;
      sum += points;
      countedQuestions += 1;
    }
  }
  if (countedQuestions === 0) return null;
  return (sum / (3 * countedQuestions)) * 100;
}

export function maturityLabel(pct: number | null): MaturityLabel | null {
  if (pct === null) return null;
  return (
    MATURITY_BANDS.find((band) => pct <= band.max)?.label ??
    MATURITY_BANDS[MATURITY_BANDS.length - 1].label
  );
}
