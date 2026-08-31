"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AnswersState,
  AssessmentAnswer,
  AssessmentAnswersState,
  AssessmentAreaId,
  AssessmentSnapshot,
  ChecksState,
  DoneState,
  TrackId,
} from "./types";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage otillgänglig – svaren sparas endast i minnet denna session
  }
}

export function answersKey(track: TrackId) {
  return `tbg_${track}_answers`;
}
export function checksKey(track: TrackId) {
  return `tbg_${track}_checks`;
}
export function doneKey(track: TrackId) {
  return `tbg_${track}_done`;
}

export function useAnswers(track: TrackId) {
  const key = answersKey(track);
  const [answers, setAnswers] = useState<AnswersState>({});

  useEffect(() => {
    setAnswers(readStorage<AnswersState>(key, {}));
  }, [key]);

  const setAnswer = useCallback(
    (stepId: string, questionId: string, value: string) => {
      setAnswers((prev) => {
        const next: AnswersState = {
          ...prev,
          [stepId]: { ...prev[stepId], [questionId]: value },
        };
        writeStorage(key, next);
        return next;
      });
    },
    [key]
  );

  return { answers, setAnswer };
}

export function useChecks(track: TrackId) {
  const key = checksKey(track);
  const [checks, setChecks] = useState<ChecksState>({});

  useEffect(() => {
    setChecks(readStorage<ChecksState>(key, {}));
  }, [key]);

  const toggleCheck = useCallback(
    (stepId: string, index: number) => {
      setChecks((prev) => {
        const stepChecks = { ...prev[stepId] };
        stepChecks[index] = stepChecks[index] ? 0 : 1;
        const next: ChecksState = { ...prev, [stepId]: stepChecks };
        writeStorage(key, next);
        return next;
      });
    },
    [key]
  );

  const setRating = useCallback(
    (stepId: string, index: number, rating: number) => {
      setChecks((prev) => {
        const stepChecks = { ...prev[stepId] };
        // Klicka på samma betyg igen för att rensa bedömningen.
        stepChecks[index] = stepChecks[index] === rating ? 0 : rating;
        const next: ChecksState = { ...prev, [stepId]: stepChecks };
        writeStorage(key, next);
        return next;
      });
    },
    [key]
  );

  return { checks, toggleCheck, setRating };
}

// ─────────────────────────────────────────────────────────
// FÖRMÅGEBEDÖMNINGEN (/assess)
// ─────────────────────────────────────────────────────────

const ASSESSMENT_ANSWERS_KEY = "tbg_assessment_answers";
const ASSESSMENT_SNAPSHOTS_KEY = "tbg_assessment_snapshots";

export function useAssessmentAnswers() {
  const [answers, setAnswers] = useState<AssessmentAnswersState>({});

  useEffect(() => {
    setAnswers(readStorage<AssessmentAnswersState>(ASSESSMENT_ANSWERS_KEY, {}));
  }, []);

  const setAnswer = useCallback(
    (areaId: string, questionId: string, patch: Partial<AssessmentAnswer>) => {
      setAnswers((prev) => {
        const areaAnswers = { ...prev[areaId] };
        areaAnswers[questionId] = { ...areaAnswers[questionId], ...patch };
        const next: AssessmentAnswersState = { ...prev, [areaId]: areaAnswers };
        writeStorage(ASSESSMENT_ANSWERS_KEY, next);
        return next;
      });
    },
    []
  );

  return { answers, setAnswer };
}

/**
 * Poäng (0–4) för ett förmågeområde: summan av uppnådda poäng delat med
 * summan av möjliga poäng, skalat till 0–4. Skattningsfrågor (1–4) räknas
 * rakt av. Ja/nej-frågor: ja=3, delvis=2, nej=0, vet ej=0 (räknas som en
 * brist, inte som obesvarat) — ej relevant räknas bort helt, från både
 * uppnådd och möjlig poäng. Obesvarade frågor räknas inte alls.
 * Returnerar null om inget är besvarat än.
 */
export function computeAreaScore(
  areaAnswers: Record<string, AssessmentAnswer> | undefined
): number | null {
  if (!areaAnswers) return null;
  let achieved = 0;
  let max = 0;
  for (const answer of Object.values(areaAnswers)) {
    if (typeof answer.rating === "number") {
      achieved += answer.rating;
      max += 4;
    } else if (answer.yesno === "ja") {
      achieved += 3;
      max += 3;
    } else if (answer.yesno === "delvis") {
      achieved += 2;
      max += 3;
    } else if (answer.yesno === "nej") {
      max += 3;
    } else if (answer.yesno === "vetej") {
      max += 3;
    }
    // "ejrelevant" och obesvarat: räknas inte alls.
  }
  if (max === 0) return null;
  return (achieved / max) * 4;
}

// ─────────────────────────────────────────────────────────
// Separata flaggregister för "vet ej" och "ej relevant"-svar i
// förmågebedömningen, nyckel: `${areaId}_${questionId}`.
// ─────────────────────────────────────────────────────────

const ASSESS_VETEJ_KEY = "tbg_assess_vetej";
const ASSESS_EJRELEVANT_KEY = "tbg_assess_ejrelevant";

function useAssessFlags(key: string) {
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFlags(readStorage<Record<string, boolean>>(key, {}));
  }, [key]);

  const setFlag = useCallback(
    (flagId: string, value: boolean) => {
      setFlags((prev) => {
        const next = { ...prev };
        if (value) next[flagId] = true;
        else delete next[flagId];
        writeStorage(key, next);
        return next;
      });
    },
    [key]
  );

  return { flags, setFlag };
}

export function useAssessVetEjFlags() {
  return useAssessFlags(ASSESS_VETEJ_KEY);
}

export function useAssessEjRelevantFlags() {
  return useAssessFlags(ASSESS_EJRELEVANT_KEY);
}

export function computeAllScores(
  answers: AssessmentAnswersState
): Record<AssessmentAreaId, number | null> {
  return {
    infrastruktur: computeAreaScore(answers.infrastruktur),
    metoder: computeAreaScore(answers.metoder),
    manniskor: computeAreaScore(answers.manniskor),
    forvaltning: computeAreaScore(answers.forvaltning),
  };
}

export function useAssessmentSnapshots() {
  const [snapshots, setSnapshots] = useState<AssessmentSnapshot[]>([]);

  useEffect(() => {
    setSnapshots(readStorage<AssessmentSnapshot[]>(ASSESSMENT_SNAPSHOTS_KEY, []));
  }, []);

  const addSnapshot = useCallback((scores: AssessmentSnapshot["scores"]) => {
    setSnapshots((prev) => {
      const next = [...prev, { date: new Date().toISOString(), scores }];
      writeStorage(ASSESSMENT_SNAPSHOTS_KEY, next);
      return next;
    });
  }, []);

  return { snapshots, addSnapshot };
}

export function useDoneSteps(track: TrackId) {
  const key = doneKey(track);
  const [done, setDone] = useState<DoneState>({});

  useEffect(() => {
    setDone(readStorage<DoneState>(key, {}));
  }, [key]);

  const setStepDone = useCallback(
    (stepId: string, value: boolean) => {
      setDone((prev) => {
        const next: DoneState = { ...prev, [stepId]: value };
        writeStorage(key, next);
        return next;
      });
    },
    [key]
  );

  return { done, setStepDone };
}
