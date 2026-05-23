import { footerNavigation, mainNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";
import { themeControlContent } from "@/data/theme";

export const pageChrome = {
  logoText: siteConfig.logoText,
  logoSrc: siteConfig.logo,
  copyright: siteConfig.copyright,
  navigation: mainNavigation,
  footerContacts: footerNavigation.contact,
  footerTagline: siteConfig.headline,
  themeControl: themeControlContent,
} as const;
