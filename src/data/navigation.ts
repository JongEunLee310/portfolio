import { externalLinks } from "@/constants/externalLinks";
import { PATHS } from "@/constants/paths";

export const mainNavigation = [
  { label: "Home", href: PATHS.home },
  { label: "Projects", href: PATHS.projects },
  { label: "Technical Notes", href: PATHS.technicalNotes },
  { label: "About", href: PATHS.about },
  { label: "Contact", href: PATHS.contact },
] as const;

export const footerNavigation = {
  contact: [
    {
      label: "Email",
      value: "whddms1208@gmail.com",
      href: externalLinks.email,
      icon: "Mail",
      external: true,
    },
    {
      label: "GitHub",
      value: "github.com/JongEunLee310",
      href: externalLinks.github,
      icon: "Github",
      external: true,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/jong-eun-lee-5094ab240",
      href: externalLinks.linkedin,
      icon: "ExternalLink",
      external: true,
    },
    {
      label: "GitLab",
      value: "gitlab.com/SighingOwl",
      href: externalLinks.gitlab,
      icon: "ExternalLink",
      external: true,
    },
  ],
  cta: {
    label: "이력서 다운로드",
    href: externalLinks.resumePdf,
    icon: "FileDown",
  },
} as const;
