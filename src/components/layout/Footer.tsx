import { ExternalLink, Github, Mail, type LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

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

type FooterProps = {
  logoText: string;
  tagline: string;
  navigation: readonly NavigationItem[];
  contacts: readonly FooterContact[];
  copyright: string;
};

function getContactIcon(label: string): LucideIcon {
  if (label === "GitHub") {
    return Github;
  }

  if (label === "Email") {
    return Mail;
  }

  return ExternalLink;
}

export function Footer({
  logoText,
  tagline,
  navigation,
  contacts,
  copyright,
}: FooterProps) {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <NavLink to="/" className="font-mono text-lg font-bold text-white">
              {logoText}
            </NavLink>
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              {tagline}
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-6 lg:justify-end">
              {navigation.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-wrap gap-6 lg:justify-end">
              {contacts.map((contact) => {
                const Icon = getContactIcon(contact.label);

                return (
                  <a
                    key={contact.href}
                    href={contact.href}
                    target={contact.external ? "_blank" : undefined}
                    rel={contact.external ? "noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {contact.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-xs text-slate-500">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
