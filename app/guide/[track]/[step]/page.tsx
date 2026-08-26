import { notFound } from "next/navigation";
import { getStepIndex, getTrack, isValidTrack } from "@/data/playbook";
import StepPageClient from "./StepPageClient";

export default function StepPage({
  params,
}: {
  params: { track: string; step: string };
}) {
  if (!isValidTrack(params.track)) notFound();
  const track = getTrack(params.track);
  if (!track) notFound();

  const stepIndex = getStepIndex(params.track, params.step);
  if (stepIndex === -1) notFound();

  return <StepPageClient trackId={params.track} stepIndex={stepIndex} />;
}
