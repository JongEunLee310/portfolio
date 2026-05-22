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
    <nav className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm font-bold text-slate-950">{title}</p>
      <div className="mt-4 space-y-1.5">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={[
              "block rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700",
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
