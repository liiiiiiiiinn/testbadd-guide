"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ASSESSMENT_QUESTION_ID, type Track, type TrackId } from "@/lib/types";
import { getChecklistItems, getPhases } from "@/data/playbook";
import { assessmentAreaForCapacity } from "@/data/assessment";
import { computeAreaScore, useAnswers, useAssessmentAnswers, useChecks, useDoneSteps } from "@/lib/storage";
import QuestionField from "./QuestionField";
import Checklist from "./Checklist";
import MeasurementAreas from "./MeasurementAreas";
import AssessmentBox from "./AssessmentBox";
import WhyBox from "./WhyBox";
import DoneWhenBox from "./DoneWhenBox";
import AbilityChip from "./AbilityChip";

export default function StepContent({
  track,
  stepIndex,
}: {
  track: Track;
  stepIndex: number;
}) {
  const { meta, steps } = track;
  const step = steps[stepIndex];
  const { answers, setAnswer } = useAnswers(meta.id);
  const { checks, toggleCheck, setRating } = useChecks(meta.id);
  const { done, setStepDone } = useDoneSteps(meta.id);

  const stepAnswers = answers[step.id] ?? {};
  const stepChecks = checks[step.id] ?? {};
  const isDone = !!done[step.id];
  const checklistItems = getChecklistItems(step);
  const allChecked =
    checklistItems.length > 0 &&
    checklistItems.every((_, i) => stepChecks[i]);
  const allQuestionsAnswered =
    step.questions.length > 0 &&
    step.questions.every((question) => (stepAnswers[question.id] ?? "").trim().length > 0);
  const batteryComplete = allChecked && allQuestionsAnswered;

  const prevStep = steps[stepIndex - 1];
  const nextStep = steps[stepIndex + 1];
  const stepLabel = `${meta.letter}${stepIndex + 1}`;

  const phaseMateCapacityArea =
    !step.capacityArea &&
    getPhases(meta.id as TrackId)
      .find((phase) => phase.stepIds.includes(step.id))
      ?.stepIds.map((id) => steps.find((s) => s.id === id)?.capacityArea)
      .find((area): area is NonNullable<typeof area> => !!area);
  const { answers: assessmentAnswers } = useAssessmentAnswers();
  const phaseMateScore = phaseMateCapacityArea
    ? computeAreaScore(assessmentAnswers[assessmentAreaForCapacity(phaseMateCapacityArea).id])
    : null;
  const showPhaseMateChip = phaseMateCapacityArea && phaseMateScore !== null && phaseMateScore < 2.5;

  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-7"
    >
      {step.capacityArea && <AbilityChip capacityArea={step.capacityArea} />}
      {showPhaseMateChip && phaseMateCapacityArea && (
        <AbilityChip capacityArea={phaseMateCapacityArea} />
      )}

      <div className="flex flex-col gap-2 border-l-4 pl-4" style={{ borderColor: meta.color }}>
        <span className="text-xs font-medium" style={{ color: meta.color }}>
          Steg {stepLabel} · {meta.name}
        </span>
        <h1 className="text-2xl font-medium text-ink">{step.title}</h1>
      </div>

      <p className="text-[15px] text-ink leading-relaxed">{step.intro}</p>

      <WhyBox text={step.why} color={meta.color} light={meta.light} />

      <div className="flex flex-col gap-5">
        <h2 className="text-sm font-medium text-ink">Frågor att besvara</h2>
        <div className="flex flex-col gap-5">
          {step.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={stepAnswers[question.id] ?? ""}
              onSave={(value) => setAnswer(step.id, question.id, value)}
            />
          ))}
        </div>
      </div>

      <div className="border border-line rounded-md px-5 py-4">
        {step.measurementAreas ? (
          <MeasurementAreas
            areas={step.measurementAreas}
            checked={stepChecks}
            onRate={(i, rating) => setRating(step.id, i, rating)}
            color={meta.color}
          />
        ) : (
          <Checklist
            items={step.checklist}
            checked={stepChecks}
            onToggle={(i) => toggleCheck(step.id, i)}
            color={meta.color}
          />
        )}
      </div>

      {step.assessmentPrompt && batteryComplete && (
        <AssessmentBox
          prompt={step.assessmentPrompt}
          value={stepAnswers[ASSESSMENT_QUESTION_ID] ?? ""}
          onSave={(value) => setAnswer(step.id, ASSESSMENT_QUESTION_ID, value)}
          color={meta.color}
          light={meta.light}
        />
      )}

      <DoneWhenBox text={step.doneWhen} />

      {step.tips && step.tips.length > 0 && (
        <div className="text-xs text-muted flex flex-col gap-1">
          {step.tips.map((tip, i) => (
            <p key={i}>💡 {tip}</p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 pt-2 border-t border-line">
        <div className="pt-4">
          {prevStep ? (
            <Link
              href={`/guide/${meta.id}/${prevStep.id}`}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              ← Föregående steg
            </Link>
          ) : (
            <Link
              href={`/guide/${meta.id}`}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              ← Till översikt
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4">
          {allChecked && !isDone && (
            <button
              onClick={() => setStepDone(step.id, true)}
              className="text-sm font-medium rounded-md px-4 py-2 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: meta.color }}
            >
              Markera steg som klart
            </button>
          )}
          {isDone && (
            <span className="text-sm text-success">Steget är klart ✓</span>
          )}
          {nextStep ? (
            <Link
              href={`/guide/${meta.id}/${nextStep.id}`}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: meta.color }}
            >
              Nästa steg →
            </Link>
          ) : (
            <Link
              href={`/export/${meta.id}`}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
              style={{ color: meta.color }}
            >
              Till sammanställning →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
