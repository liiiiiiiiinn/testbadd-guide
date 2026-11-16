import { assessmentAreas } from "./assessment";
import type { AssessmentAreaId } from "@/lib/types";

/**
 * Kopplar varje fråge-ID i Excel-radens format (INF1…FOR7) till den
 * befintliga frågan i data/assessment.ts, i visningsordning. Ändrar inga
 * befintliga fråge-ID:n i lagringen — det här är bara en exportmappning.
 */

const AREA_PREFIX: Record<AssessmentAreaId, string> = {
  infrastruktur: "INF",
  metoder: "MET",
  manniskor: "MAN",
  forvaltning: "FOR",
};

export interface ExportField {
  /** Excel-kolumnnamnet, t.ex. "INF1". */
  code: string;
  areaId: AssessmentAreaId;
  /** Frågans id inom området, enligt data/assessment.ts. */
  questionId: string;
}

export const EXPORT_FIELDS: ExportField[] = assessmentAreas.flatMap((area) =>
  area.questions.map((question, i) => ({
    code: `${AREA_PREFIX[area.id]}${i + 1}`,
    areaId: area.id,
    questionId: question.id,
  }))
);
