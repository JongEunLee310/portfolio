import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { themeSurface } from "@/styles/classNames";
import type { ThemeControlContent } from "@/types/theme";

type NavigationItem = {
  label: string;
  href: string;
};

type FooterContact = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

type LogoSrc = {
  light: string;
  dark: string;
};

type PageLayoutProps = {
  logoText: string;
  logoSrc: LogoSrc;
  copyright: string;
  navigation: readonly NavigationItem[];
  footerContacts: readonly FooterContact[];
  footerTagline: string;
  themeControl: ThemeControlContent;
  children: ReactNode;
};

export function PageLayout({
  logoText,
  logoSrc,
  copyright,
  navigation,
  footerContacts,
  footerTagline,
  themeControl,
  children,
}: PageLayoutProps) {
  return (
    <div className={`${themeSurface.page} min-h-screen`}>
      <Header
        logoText={logoText}
        logoSrc={logoSrc}
        navigation={navigation}
        themeControl={themeControl}
      />
      <main>{children}</main>
      <Footer
        logoText={logoText}
        logoSrc={logoSrc}
        tagline={footerTagline}
        navigation={navigation}
        contacts={footerContacts}
        copyright={copyright}
      />
    </div>
  );
}
