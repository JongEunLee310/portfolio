export type IconName =
  | "Code2"
  | "Server"
  | "Database"
  | "Cloud"
  | "Github"
  | "Mail"
  | "FileDown"
  | "Activity"
  | "Gauge"
  | "Layers"
  | "Workflow"
  | "MessageQueue"
  | "MessageSquare"
  | "BookOpen"
  | "Calendar"
  | "Clock"
  | "ExternalLink";

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
