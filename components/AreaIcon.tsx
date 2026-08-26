import { Building2, Compass, Users, Landmark, type LucideProps } from "lucide-react";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  Building2,
  Compass,
  Users,
  Landmark,
};

export default function AreaIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  const Icon = ICONS[name] ?? Building2;
  return <Icon {...props} />;
}
