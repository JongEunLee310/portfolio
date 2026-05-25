import type { TechTag } from "./common";

export type NoteCategory =
  | "troubleshooting"
  | "architecture"
  | "performance"
  | "concept"
  | "retrospective";

export type NoteFilterValue = "all" | NoteCategory;

export type NoteSortValue = "latest" | "readingTime";

export type NoteViewMode = "grid" | "list";

export type NoteFilterState = {
  category: NoteFilterValue;
  tags: string[];
  projectSlugs: string[];
};

export type NoteDetailTemplate =
  | "troubleshooting"
  | "retrospective"
  | "technical-summary";

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
  cardSummary?: {
    title: string;
    problem: string;
    solution: string;
    result?: string;
  };
  isStub?: true;
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
      type: "cards";
      items: {
        title: string;
        description: string;
        badge?: string;
      }[];
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
      type: "comparison";
      items: {
        title: string;
        description: string;
        bullets: string[];
        code?: {
          language: string;
          filename?: string;
          code: string;
        };
      }[];
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

export type TechnicalNoteDetail = TechnicalNoteCard & {
  template?: NoteDetailTemplate;
  toc: {
    id: string;
    title: string;
    depth: 1 | 2 | 3;
  }[];
  content: ArticleSection[];
  relatedNoteSlugs: string[];
};
