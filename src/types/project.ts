import type { IconName, Metric, TechTag } from "./common";

export type ProjectCategory = "backend" | "infra" | "ai" | "iot" | "personal";

export type ProjectFilterValue = "all" | ProjectCategory;

export type ProjectType = "team" | "personal";

export type ProjectStatus = "featured" | "normal" | "archived";

export type ProjectSortValue = "latest" | "featured" | "name";

export type ProjectViewMode = "grid" | "list";

export type ProjectPeriodFilterValue =
  | "all"
  | "last6Months"
  | "last1Year"
  | "over1Year";

export type ProjectTypeFilterValue = "all" | ProjectType;

export type ProjectFilterState = {
  category: ProjectFilterValue;
  techStacks: string[];
  period: ProjectPeriodFilterValue;
  type: ProjectTypeFilterValue;
};

export type ProjectCard = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  description: string;
  thumbnail: string;
  category: ProjectCategory[];
  type: ProjectType;
  status: ProjectStatus;
  period: string;
  role: string;
  teamSize?: string;
  techStack: TechTag[];
  metrics?: Metric[];
  links: {
    detail: string;
    github?: string;
    demo?: string;
    docs?: string;
  };
};

export type ArchitectureNode = {
  title: string;
  items: string[];
  icon?: IconName;
};

export type ProjectDetail = ProjectCard & {
  heroImage: string;
  overview: string;
  problem: {
    title: string;
    items: string[];
  };
  solution: {
    title: string;
    items: string[];
  };
  architecture: {
    title: string;
    description?: string;
    nodes: ArchitectureNode[];
  };
  features: {
    title: string;
    description: string;
    icon: IconName;
  }[];
  screenshots: {
    title: string;
    image: string;
    description?: string;
  }[];
  contributions: {
    date: string;
    title: string;
    description: string;
  }[];
  troubleshooting: {
    title: string;
    problem: string;
    solution: string;
    result?: string;
  }[];
  performance: Metric[];
  retrospective: {
    learned: string[];
    improvement: string[];
  };
  relatedNoteSlugs: string[];
};
