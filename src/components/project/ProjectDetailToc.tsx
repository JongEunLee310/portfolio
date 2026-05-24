import { useEffect, useState } from "react";

export type ProjectDetailTocItem = {
  id: string;
  title: string;
};

type ProjectDetailTocProps = {
  items: ProjectDetailTocItem[];
  title: string;
  ariaLabel: string;
};

export function ProjectDetailToc({
  items,
  title,
  ariaLabel,
}: ProjectDetailTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) {
      return undefined;
    }

    const firstItem = items[0];

    if (!firstItem) {
      return undefined;
    }

    setActiveId(firstItem.id);

    if (typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.35, 0.6],
      },
    );

    items.forEach((item) => {
      const section = document.getElementById(item.id);

      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label={ariaLabel}
        className="sticky top-24 border-l border-[var(--color-border)] py-2 pl-3"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          {title}
        </p>
        <div className="mt-4 space-y-0.5">
          {items.map((item) => {
            const isActive = item.id === activeId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  document
                    .getElementById(item.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={[
                  "flex min-h-8 w-full items-center rounded-md border-l-2 px-2 py-1.5 text-left text-xs font-semibold leading-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 xl:text-sm",
                  isActive
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                    : "border-transparent text-[var(--color-muted-text)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]",
                ].join(" ")}
                aria-current={isActive ? "location" : undefined}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
