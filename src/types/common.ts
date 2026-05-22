export type IconName =
  | "Code2"
  | "Server"
  | "Database"
  | "Cloud"
  | "Github"
  | "Mail"
  | "FileDown"
  | "Activity"
  | "BarChart"
  | "Brain"
  | "CheckCircle"
  | "FileText"
  | "GitBranch"
  | "Gauge"
  | "Layers"
  | "Monitor"
  | "Play"
  | "Shield"
  | "Workflow"
  | "Zap"
  | "MessageQueue"
  | "MessageSquare"
  | "BookOpen"
  | "Calendar"
  | "Clock"
  | "ExternalLink"
  | "CreditCard"
  | "RefreshCw"
  | "Settings"
  | "Share2"
  | "Star"
  | "TrendingDown"
  | "Users";

export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type TechTag = {
  name: string;
  category:
    | "backend"
    | "frontend"
    | "database"
    | "infra"
    | "devops"
    | "messaging"
    | "observability"
    | "ai"
    | "language"
    | "tool";
};

export type Metric = {
  label: string;
  value: string;
  description?: string;
  icon?: IconName;
};

export type SectionBase = {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
};
