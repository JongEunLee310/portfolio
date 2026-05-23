import { themeSurface } from "@/styles/classNames";
import type { TimelineItem } from "@/types/about";

type AboutTimelineProps = {
  items: TimelineItem[];
};

export function AboutTimeline({ items }: AboutTimelineProps) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 h-full w-0.5 bg-[var(--color-border)]" />
      {items.map((item) => (
        <div key={`${item.type}-${item.title}`} className="relative mb-8 last:mb-0">
          <div className="absolute -left-[1.375rem] top-1.5 h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-page-bg)]" />
          <article className={`p-5 ${themeSurface.card}`}>
            <div className="flex flex-wrap items-center gap-2">
              {item.badge ? (
                <span className="badge badge-light rounded-full px-2.5 py-0.5 text-xs font-medium">
                  {item.badge}
                </span>
              ) : null}
              <span className="text-xs text-[var(--color-muted-text)]">{item.period}</span>
            </div>
            <h4 className="mt-1 text-sm font-semibold text-[var(--color-page-text)]">{item.title}</h4>
            <p className="text-xs text-[var(--color-muted-text)]">{item.organization}</p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted-text)]">
              {item.description}
            </p>
          </article>
        </div>
      ))}
    </div>
  );
}
