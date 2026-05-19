type FooterContact = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

type FooterProps = {
  copyright: string;
  contacts: readonly FooterContact[];
};

export function Footer({ copyright, contacts }: FooterProps) {
  return (
    <footer className="bg-brand-dark text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 lg:px-8">
        <div className="flex flex-wrap gap-4">
          {contacts.map((contact) => (
            <a
              key={contact.href}
              href={contact.href}
              target={contact.external ? "_blank" : undefined}
              rel={contact.external ? "noreferrer" : undefined}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {contact.label}: {contact.value}
            </a>
          ))}
        </div>
        <p className="text-xs text-slate-500">{copyright}</p>
      </div>
    </footer>
  );
}
