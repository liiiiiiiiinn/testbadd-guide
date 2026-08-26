import { notFound } from "next/navigation";
import { getAssessmentArea, isValidAssessmentArea } from "@/data/assessment";
import AssessAreaClient from "./AssessAreaClient";

export default function AssessAreaPage({ params }: { params: { area: string } }) {
  if (!isValidAssessmentArea(params.area)) notFound();
  const area = getAssessmentArea(params.area);
  if (!area) notFound();

  return <AssessAreaClient areaId={params.area} />;
}
