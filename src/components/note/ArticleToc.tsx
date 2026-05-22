type TocItem = {
  id: string;
  title: string;
  depth: 1 | 2 | 3;
};

type ArticleTocProps = {
  items: TocItem[];
  title: string;
};

export function ArticleToc({ items, title }: ArticleTocProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card">
      <p className="text-sm font-bold text-[var(--color-page-text)]">{title}</p>
      <div className="mt-4 space-y-1.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={[
              "block rounded-md px-3 py-2 text-sm font-medium text-[var(--color-muted-text)] transition hover:bg-blue-500/10 hover:text-blue-500",
              item.depth === 2 ? "ml-3" : "",
              item.depth === 3 ? "ml-6" : "",
            ].join(" ")}
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
