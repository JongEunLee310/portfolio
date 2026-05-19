type TocItem = {
  id: string;
  title: string;
  depth: 1 | 2 | 3;
};

type ArticleTocProps = {
  items: TocItem[];
};

export function ArticleToc({ items }: ArticleTocProps) {
  return (
    <nav className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-sm font-bold text-slate-900">목차</p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="block text-sm text-slate-600 transition hover:text-blue-600"
          >
            {item.title}
          </a>
        ))}
      </div>
    </nav>
  );
}
