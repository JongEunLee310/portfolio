import { surface } from "@/styles/classNames";
import type { TimelineItem } from "@/types/about";

type AboutTimelineProps = {
  items: TimelineItem[];
};

export function AboutTimeline({ items }: AboutTimelineProps) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 h-full w-0.5 bg-slate-200" />
      {items.map((item) => (
        <div key={`${item.type}-${item.title}`} className="relative mb-8 last:mb-0">
          <div className="absolute -left-[1.375rem] top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" />
          <article className={`p-5 ${surface.card}`}>
            <div className="flex flex-wrap items-center gap-2">
              {item.badge ? (
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {item.badge}
                </span>
              ) : null}
              <span className="text-xs text-slate-400">{item.period}</span>
            </div>
            <h4 className="mt-1 text-sm font-semibold text-slate-900">{item.title}</h4>
            <p className="text-xs text-slate-500">{item.organization}</p>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        </div>
      ))}
    </div>
  );
}
