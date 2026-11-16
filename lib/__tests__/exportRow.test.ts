import { describe, expect, it } from "vitest";
import { buildExcelRow } from "../exportRow";
import { EXPORT_FIELDS } from "@/data/exportMap";
import type { AssessmentAnswersState } from "../types";

function emptyMeasurement(answers: AssessmentAnswersState = {}) {
  return {
    testbedName: "Testbädd X",
    functionRole: "Verksamhetsansvarig",
    date: "2026-11-16",
    questionnaireVersion: "2026-11-v1",
    answers,
  };
}

describe("buildExcelRow", () => {
  it("has exactly 33 tab-separated fields", () => {
    const row = buildExcelRow(emptyMeasurement(), { includeComments: true });
    expect(row.split("\t")).toHaveLength(33);
  });

  it("has the 28 question codes in INF→MET→MAN→FOR order with 7 each", () => {
    expect(EXPORT_FIELDS).toHaveLength(28);
    const codes = EXPORT_FIELDS.map((f) => f.code);
    expect(codes.slice(0, 7)).toEqual(["INF1", "INF2", "INF3", "INF4", "INF5", "INF6", "INF7"]);
    expect(codes.slice(7, 14)).toEqual(["MET1", "MET2", "MET3", "MET4", "MET5", "MET6", "MET7"]);
    expect(codes.slice(14, 21)).toEqual(["MAN1", "MAN2", "MAN3", "MAN4", "MAN5", "MAN6", "MAN7"]);
    expect(codes.slice(21, 28)).toEqual(["FOR1", "FOR2", "FOR3", "FOR4", "FOR5", "FOR6", "FOR7"]);
  });

  it("writes scale answers as digits and yes/no answers as exact labels", () => {
    const answers: AssessmentAnswersState = {
      infrastruktur: { r1: { rating: 3 } },
      metoder: {},
      manniskor: {},
      forvaltning: { y5: { yesno: "delvis" } },
    };
    const fields = buildExcelRow(emptyMeasurement(answers), { includeComments: true }).split("\t");
    const inf1Index = 4 + EXPORT_FIELDS.findIndex((f) => f.code === "INF1");
    const for5Index = 4 + EXPORT_FIELDS.findIndex((f) => f.code === "FOR5");
    expect(fields[inf1Index]).toBe("3");
    expect(fields[for5Index]).toBe("Delvis");
  });

  it("leaves unanswered questions as an empty cell but keeps the column position", () => {
    const row = buildExcelRow(emptyMeasurement({}), { includeComments: true });
    const fields = row.split("\t");
    for (let i = 4; i < 4 + 28; i++) {
      expect(fields[i]).toBe("");
    }
  });

  it("exports a scale question answered with 'vet ej' or 'ej relevant' as that text, not a digit", () => {
    const answers: AssessmentAnswersState = {
      infrastruktur: { r1: { yesno: "vetej" }, r2: { yesno: "ejrelevant" } },
      metoder: {},
      manniskor: {},
      forvaltning: {},
    };
    const fields = buildExcelRow(emptyMeasurement(answers), { includeComments: true }).split("\t");
    const inf1Index = 4 + EXPORT_FIELDS.findIndex((f) => f.code === "INF1");
    const inf2Index = 4 + EXPORT_FIELDS.findIndex((f) => f.code === "INF2");
    expect(fields[inf1Index]).toBe("Vet ej");
    expect(fields[inf2Index]).toBe("Ej relevant");
  });

  it("collects comments per question code, separated by ' | ', and strips tabs/newlines", () => {
    const answers: AssessmentAnswersState = {
      infrastruktur: { r1: { rating: 2, comment: "En rad\tmed\ntab och radbrytning" } },
      metoder: { r1: { rating: 1, comment: "En annan kommentar" } },
      manniskor: {},
      forvaltning: {},
    };
    const row = buildExcelRow(emptyMeasurement(answers), { includeComments: true });
    const commentsField = row.split("\t").at(-1);
    expect(commentsField).toBe(
      "[INF1] En rad med tab och radbrytning | [MET1] En annan kommentar"
    );
  });

  it("omits comments entirely when includeComments is false", () => {
    const answers: AssessmentAnswersState = {
      infrastruktur: { r1: { rating: 2, comment: "Hemlig kommentar" } },
      metoder: {},
      manniskor: {},
      forvaltning: {},
    };
    const row = buildExcelRow(emptyMeasurement(answers), { includeComments: false });
    expect(row.split("\t").at(-1)).toBe("");
    expect(row).not.toContain("Hemlig kommentar");
  });

  it("puts testbed name, function, date and questionnaire version first, in order", () => {
    const fields = buildExcelRow(emptyMeasurement(), { includeComments: true }).split("\t");
    expect(fields[0]).toBe("Testbädd X");
    expect(fields[1]).toBe("Verksamhetsansvarig");
    expect(fields[2]).toBe("2026-11-16");
    expect(fields[3]).toBe("2026-11-v1");
  });
});
