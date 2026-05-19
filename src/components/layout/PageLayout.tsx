import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

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

type PageLayoutProps = {
  logoText: string;
  copyright: string;
  navigation: readonly NavigationItem[];
  footerContacts: readonly FooterContact[];
  children: ReactNode;
};

export function PageLayout({
  logoText,
  copyright,
  navigation,
  footerContacts,
  children,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header logoText={logoText} navigation={navigation} />
      <main>{children}</main>
      <Footer copyright={copyright} contacts={footerContacts} />
    </div>
  );
}
