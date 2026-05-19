import type { TechTag } from "./common";

export type NoteCategory =
  | "performance"
  | "architecture"
  | "async"
  | "database"
  | "aws"
  | "observability"
  | "messaging"
  | "troubleshooting"
  | "security";

export type TechnicalNoteCard = {
  slug: string;
  title: string;
  summary: string;
  category: NoteCategory;
  thumbnail: string;
  date: string;
  readingTime: string;
  tags: TechTag[];
  featured?: boolean;
  relatedProjectSlugs?: string[];
};

export type ArticleSection =
  | {
      type: "heading";
      id: string;
      title: string;
    }
  | {
      type: "paragraph";
      content: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "callout";
      variant: "info" | "warning" | "success";
      content: string;
    }
  | {
      type: "code";
      language: string;
      filename?: string;
      code: string;
    }
  | {
      type: "metrics";
      items: {
        label: string;
        before: string;
        after: string;
        change: string;
      }[];
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

export type TechnicalNoteDetail = TechnicalNoteCard & {
  toc: {
    id: string;
    title: string;
    depth: 1 | 2 | 3;
  }[];
  content: ArticleSection[];
  relatedNoteSlugs: string[];
};
