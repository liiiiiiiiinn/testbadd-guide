export type TrackId = "etablera" | "driva" | "skala";

/** De fyra kapacitetsområdena i testbäddsförmåga, i fast ordning. */
export type CapacityAreaId = "infrastruktur" | "metoder" | "population" | "forvaltning";

export interface CapacityAreaMeta {
  id: CapacityAreaId;
  name: string;
}

export const CAPACITY_AREAS: CapacityAreaMeta[] = [
  { id: "infrastruktur", name: "Fysisk och digital infrastruktur" },
  { id: "metoder", name: "Arbetssätt, metoder och processer" },
  { id: "population", name: "Population och data" },
  { id: "forvaltning", name: "Förvaltning, samverkan och kompetens" },
];

export interface Question {
  id: string;
  text: string;
  placeholder: string;
}

export interface MeasurementArea {
  id: string;
  title: string;
  description: string;
  points: string[];
}

export const ASSESSMENT_QUESTION_ID = "__assessment";

export interface Step {
  id: string;
  title: string;
  intro: string;
  why: string;
  questions: Question[];
  checklist: string[];
  /**
   * Strukturerade mätområden (rubrik + beskrivning + konkreta mätpunkter).
   * När satt ersätter dessa `checklist` i UI:t — mätpunkterna slås ihop
   * till en platt, indexerad lista för avbockning/lagring.
   */
  measurementAreas?: MeasurementArea[];
  /**
   * Vilket av de fyra kapacitetsområdena detta steg bedömer — satt på de
   * steg som har `measurementAreas`, används av dashboarden för att
   * jämföra samma område över Etablera/Driva/Skala.
   */
  capacityArea?: CapacityAreaId;
  /**
   * Fråga för en egen kvalitativ bedömning som visas när hela
   * frågebatteriet (dialogfrågor + mätpunkter) är besvarat.
   */
  assessmentPrompt?: string;
  doneWhen: string;
  tips?: string[];
}

export interface TrackMeta {
  id: TrackId;
  letter: "A" | "B" | "C";
  name: string;
  shortName: string;
  color: string;
  light: string;
  border: string;
  description: string;
  outputs: string[];
  stepCount: number;
  estimate: string;
}

export interface Track {
  meta: TrackMeta;
  steps: Step[];
}

export type AiButtonType = "formulera" | "granska" | "nastasteg";

export type AnswersState = Record<string, Record<string, string>>;
/**
 * Avbockning per steg och punktindex. Enkel checklista (`Step.checklist`)
 * använder 0/1 som av/på. Mätpunkter (`Step.measurementAreas`) använder
 * en skala 1 (låg) till 4 (hög); 0/saknas betyder obedömd.
 */
export type ChecksState = Record<string, Record<number, number>>;
export type DoneState = Record<string, boolean>;

export const RATING_SCALE = [1, 2, 3, 4] as const;
export type Rating = (typeof RATING_SCALE)[number];
export const RATING_LABELS: Record<Rating, string> = {
  1: "Låg",
  2: "Delvis",
  3: "Till stor del",
  4: "Hög",
};

// ─────────────────────────────────────────────────────────
// FÖRMÅGEBEDÖMNINGEN (/assess) — fristående diagnosflöde.
// Egen datamodell, skild från Step/MeasurementArea i metodstödet.
// ─────────────────────────────────────────────────────────

export type AssessmentAreaId =
  | "infrastruktur"
  | "metoder"
  | "manniskor"
  | "forvaltning";

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: "rating" | "yesno";
  rating?: { low: string; high: string };
  why?: string;
}

export interface AssessmentArea {
  id: AssessmentAreaId;
  title: string;
  description: string;
  color: string;
  lightColor: string;
  /** Namnet på lucide-react-ikonen som representerar området. */
  icon: string;
  questions: AssessmentQuestion[];
}

export type YesNoValue = "ja" | "delvis" | "nej" | "vetej";

export interface AssessmentAnswer {
  rating?: number;
  yesno?: YesNoValue;
  comment?: string;
}

export type AssessmentAnswersState = Record<
  string,
  Record<string, AssessmentAnswer>
>;

export interface AssessmentSnapshot {
  date: string;
  scores: Record<AssessmentAreaId, number | null>;
}
