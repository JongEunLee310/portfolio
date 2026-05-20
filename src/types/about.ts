import type { IconName, Metric, SectionBase } from "./common";

export type ProfileLink = {
  label: string;
  href: string;
  icon: "Mail" | "Github" | "ExternalLink";
};

export type ProfileInfo = {
  name: string;
  role: string;
  location: string;
  email: string;
  experience: string;
  avatar: string;
  links: ProfileLink[];
  introduction: string[];
};

export type Role = {
  title: string;
  description: string;
  icon: IconName;
  tags?: string[];
};

export type TimelineItem = {
  type: "career" | "education" | "project" | "bootcamp";
  badge?: string;
  title: string;
  organization: string;
  period: string;
  description: string;
};

export type WorkStyle = {
  quote: string;
  principles: string[];
};

export type AboutSections = {
  profile: SectionBase;
  roles: SectionBase;
  timeline: SectionBase;
  techStack: SectionBase;
  workStyle: SectionBase;
  growthMetrics: SectionBase;
};

export type AboutData = {
  profile: ProfileInfo;
  sections: AboutSections;
  roles: Role[];
  timeline: TimelineItem[];
  workStyle: WorkStyle;
  growthMetrics: Metric[];
};
