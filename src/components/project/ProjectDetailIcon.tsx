import {
  Activity,
  BookOpen,
  Calendar,
  Clock,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  FileDown,
  Gauge,
  Github,
  Layers,
  Mail,
  MessageSquare,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types/common";

const iconComponents: Record<IconName, LucideIcon> = {
  Code2,
  Server,
  Database,
  Cloud,
  Github,
  Mail,
  FileDown,
  Activity,
  Gauge,
  Layers,
  Workflow,
  MessageQueue: Workflow,
  MessageSquare,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
};

type ProjectDetailIconProps = {
  icon?: IconName;
  className?: string;
};

export function ProjectDetailIcon({
  icon,
  className = "h-5 w-5",
}: ProjectDetailIconProps) {
  if (!icon) {
    return null;
  }

  const Icon = iconComponents[icon];

  return <Icon className={className} aria-hidden="true" />;
}
