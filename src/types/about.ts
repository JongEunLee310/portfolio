import type { IconName, Metric, TechTag } from "./common";

export type ProfileInfo = {
  name: string;
  role: string;
  location: string;
  email: string;
  experience: string;
  avatar: string;
  introduction: string[];
};

export type Strength = {
  title: string;
  description: string;
  icon: IconName;
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

export type AboutData = {
  profile: ProfileInfo;
  strengths: Strength[];
  timeline: TimelineItem[];
  skills: {
    title: string;
    icon: IconName;
    items: TechTag[];
  }[];
  workStyle: WorkStyle;
  growthMetrics: Metric[];
};
