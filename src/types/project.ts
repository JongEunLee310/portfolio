import type { IconName, Metric, TechTag } from "./common";

export type ProjectCategory = "service" | "infra" | "research";

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
  category: ProjectCategory;
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
  id?: string;
  title: string;
  items: string[];
  icon?: IconName;
};

export type ProjectHeroHighlight = {
  label: string;
  value: string;
  icon?: IconName;
};

export type ProjectTechStackGroup = {
  title: string;
  items: TechTag[];
};

export type ProjectArchitectureGroup = {
  id?: string;
  title: string;
  nodes: ArchitectureNode[];
};

export type ProjectArchitectureConnectionTone = "sync" | "async" | "data";

export type ProjectArchitectureConnection = {
  from: string;
  to: string;
  tone: ProjectArchitectureConnectionTone;
  label?: string;
};

export type ProjectArchitectureLegend = {
  label: string;
  tone: "solid" | "dashed" | "muted";
};

export type ProjectArchitectureFlow = {
  title: string;
  description?: string;
  groups: ProjectArchitectureGroup[];
  connections?: ProjectArchitectureConnection[];
  legends?: ProjectArchitectureLegend[];
};

export type ProjectImprovement = {
  title: string;
  description: string;
  result?: string;
  icon: IconName;
};

export type ProjectDetail = ProjectCard & {
  heroImage: string;
  heroHighlights?: ProjectHeroHighlight[];
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
  architectureFlow?: ProjectArchitectureFlow;
  features: {
    title: string;
    description: string;
    icon: IconName;
  }[];
  techStackGroups?: ProjectTechStackGroup[];
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
    noteSlug?: string;
  }[];
  improvements?: ProjectImprovement[];
  performance: Metric[];
  retrospective: {
    learned: string[];
    improvement: string[];
    noteSlug?: string;
  };
  relatedNoteSlugs: string[];
};
