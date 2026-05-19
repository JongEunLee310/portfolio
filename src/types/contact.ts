import type { IconName } from "./common";

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
  icon: IconName;
  external?: boolean;
};

export type ContactFormField = {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "textarea" | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type ContactData = {
  responsePromise: {
    title: string;
    description: string;
    value: string;
  };
  channels: ContactChannel[];
  formFields: ContactFormField[];
  faq: FAQItem[];
  values: {
    title: string;
    description: string;
    icon: IconName;
  }[];
};
