import { EXPORT_FIELDS } from "@/data/exportMap";
import type { AssessmentAnswer, AssessmentAnswersState } from "./types";

export interface MeasurementForExport {
  testbedName: string;
  functionRole: string;
  /** yyyy-mm-dd */
  date: string;
  questionnaireVersion: string;
  answers: AssessmentAnswersState;
  /** Valfria taggar (se /config/tags.ts) — tom sträng om inget valt. */
  tag1?: string;
  tag2?: string;
}

const YESNO_LABEL: Record<string, string> = {
  ja: "Ja",
  delvis: "Delvis",
  nej: "Nej",
  vetej: "Vet ej",
  ejrelevant: "Ej relevant",
};

/** Enda stället som tar fram cellvärdet för en fråga i Excel-raden. */
function cellValue(answer: AssessmentAnswer | undefined): string {
  if (!answer) return "";
  // Skalfrågor kan ha fått "vet ej"/"ej relevant" istället för ett skalvärde
  // (se AssessmentQuestionCard) — exporteras som den texten, inte siffran.
  if (answer.yesno === "vetej" || answer.yesno === "ejrelevant") {
    return YESNO_LABEL[answer.yesno];
  }
  if (typeof answer.rating === "number") return String(answer.rating);
  if (answer.yesno) return YESNO_LABEL[answer.yesno] ?? "";
  return "";
}

/** Tar bort tabbar och radbrytningar ur fritext så att kolumnerna i Excel-raden inte förskjuts. */
function sanitize(text: string): string {
  return text.replace(/[\t\r\n]+/g, " ").trim();
}

function buildComments(answers: AssessmentAnswersState): string {
  const parts: string[] = [];
  for (const field of EXPORT_FIELDS) {
    const comment = answers[field.areaId]?.[field.questionId]?.comment;
    if (comment && comment.trim()) {
      parts.push(`[${field.code}] ${sanitize(comment)}`);
    }
  }
  return parts.join(" | ");
}

/**
 * Bygger den tabbseparerade Excel-raden samordnaren klistrar in, i exakt
 * 35 fält: Testbädd, Funktion, Datum, Frågeversion, INF1–7, MET1–7,
 * MAN1–7, FOR1–7, Kommentarer, Tagg 1, Tagg 2. De första 33 fälten (t.o.m.
 * Kommentarer) har en fast ordning som aldrig ändras — taggarna läggs
 * alltid sist. Se /docs/EXCEL_KOPPLING.md.
 */
export function buildExcelRow(
  measurement: MeasurementForExport,
  { includeComments }: { includeComments: boolean }
): string {
  const fields: string[] = [
    sanitize(measurement.testbedName),
    sanitize(measurement.functionRole),
    measurement.date,
    measurement.questionnaireVersion,
  ];

  for (const field of EXPORT_FIELDS) {
    const answer = measurement.answers[field.areaId]?.[field.questionId];
    fields.push(cellValue(answer));
  }

  fields.push(includeComments ? buildComments(measurement.answers) : "");
  fields.push(sanitize(measurement.tag1 ?? ""));
  fields.push(sanitize(measurement.tag2 ?? ""));

  return fields.join("\t");
}

export function excelHeaderRow(): string {
  const header = ["Testbädd", "Funktion", "Datum", "Frågeversion"];
  for (const field of EXPORT_FIELDS) header.push(field.code);
  header.push("Kommentarer", "Tagg 1", "Tagg 2");
  return header.join("\t");
}
