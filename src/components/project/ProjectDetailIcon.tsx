import {
  Activity,
  BarChart,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Cloud,
  Code2,
  CreditCard,
  Database,
  ExternalLink,
  FileDown,
  FileText,
  Gauge,
  GitBranch,
  Github,
  Layers,
  Mail,
  MessageSquare,
  Monitor,
  Play,
  RefreshCw,
  Server,
  Settings,
  Share2,
  Shield,
  Star,
  TrendingDown,
  Users,
  Workflow,
  Zap,
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
  BarChart,
  Brain,
  CheckCircle,
  FileText,
  GitBranch,
  Gauge,
  Layers,
  Monitor,
  Play,
  Shield,
  Workflow,
  Zap,
  MessageQueue: Workflow,
  MessageSquare,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  CreditCard,
  RefreshCw,
  Settings,
  Share2,
  Star,
  TrendingDown,
  Users,
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
