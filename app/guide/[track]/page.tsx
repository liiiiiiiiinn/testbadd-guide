import { notFound } from "next/navigation";
import { isValidTrack } from "@/data/playbook";
import { FEATURES } from "@/config/features";
import PlaybookView from "@/components/PlaybookView";
import GuideOverviewClient from "./GuideOverviewClient";

export default function GuideOverviewPage({
  params,
}: {
  params: { track: string };
}) {
  if (!isValidTrack(params.track)) notFound();

  if (FEATURES.guideMode === "playbook") {
    return <PlaybookView trackId={params.track} />;
  }

  return <GuideOverviewClient track={params.track} />;
}
