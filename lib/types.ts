export type TrackId = "etablera" | "driva" | "skala";

/** De fyra kapacitetsområdena i testbäddsförmåga, i fast ordning. */
export type CapacityAreaId = "infrastruktur" | "metoder" | "population" | "forvaltning";

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

/** En grupp av 2 steg som hör ihop tematiskt, för den fasindelade stegöversikten. */
export interface TrackPhase {
  name: string;
  estimate: string;
  stepIds: string[];
}

export type AiButtonType = "formulera" | "granska" | "nastasteg";

export type AnswersState = Record<string, Record<string, string>>;
/** Avbockning per steg och punktindex — 0/1 som av/på, för både `Step.checklist` och `Step.measurementAreas`. */
export type ChecksState = Record<string, Record<number, number>>;
export type DoneState = Record<string, boolean>;

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

export type YesNoValue = "ja" | "delvis" | "nej" | "vetej" | "ejrelevant";

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
