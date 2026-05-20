import { footerNavigation, mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export const pageChrome = {
  logoText: siteConfig.logoText,
  copyright: siteConfig.copyright,
  navigation: mainNavigation,
  footerContacts: footerNavigation.contact,
  footerTagline: siteConfig.headline,
} as const;
