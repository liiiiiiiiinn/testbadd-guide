import { notFound } from "next/navigation";
import ExportView from "@/components/ExportView";
import { getTrack, isValidTrack } from "@/data/playbook";

export default function ExportPage({ params }: { params: { track: string } }) {
  if (!isValidTrack(params.track)) notFound();
  const track = getTrack(params.track);
  if (!track) notFound();

  return <ExportView track={track} />;
}
