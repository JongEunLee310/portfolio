import type { IconName, SectionBase } from "./common";

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  icon: IconName;
  external?: boolean;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type ContactData = {
  sections: {
    contact: SectionBase;
    faq: SectionBase;
    collaboration: SectionBase;
  };
  channels: ContactChannel[];
  faq: FAQItem[];
  values: {
    title: string;
    description: string;
    icon: IconName;
  }[];
};
