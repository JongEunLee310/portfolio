import { themeSurface } from "@/styles/classNames";
import type { TimelineItem } from "@/types/about";

type AboutTimelineProps = {
  items: TimelineItem[];
};

type TimelineRow = {
  left: TimelineItem | null;
  right: TimelineItem | null;
};

type YearGroup = {
  year: number;
  rows: TimelineRow[];
};

export function getStartYear(period: string): number {
  return parseInt(period.slice(0, 4), 10);
}

export function buildYearGroups(items: TimelineItem[]): YearGroup[] {
  const yearMap = new Map<number, { left: TimelineItem[]; right: TimelineItem[] }>();

  for (const item of items) {
    const year = getStartYear(item.period);
    if (!yearMap.has(year)) {
      yearMap.set(year, { left: [], right: [] });
    }
    const group = yearMap.get(year)!;
    if (item.type === "project") {
      group.right.push(item);
    } else {
      group.left.push(item);
    }
  }

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, { left, right }]) => {
      const len = Math.max(left.length, right.length);
      const rows: TimelineRow[] = Array.from({ length: len }, (_, i) => ({
        left: left[i] ?? null,
        right: right[i] ?? null,
      }));
      return { year, rows };
    });
}

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <article className={`${themeSurface.card} p-5`}>
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
      <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted-text)]">{item.description}</p>
    </article>
  );
}

function MobileTimeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 h-full w-0.5 bg-[var(--color-border)]" />
      {items.map((item) => (
        <div key={`${item.type}-${item.title}`} className="relative mb-8 last:mb-0">
          <div className="absolute -left-[1.375rem] top-1.5 h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-page-bg)]" />
          <TimelineCard item={item} />
        </div>
      ))}
    </div>
  );
}

function DesktopTimeline({ groups }: { groups: YearGroup[] }) {
  return (
    <div className="relative">
      {/* 중앙 수직선 */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[var(--color-border)]" />
      {groups.map(({ year, rows }) => (
        <div key={year}>
          {/* 연도 마커 */}
          <div className="relative z-10 flex justify-center py-3">
            <span className="rounded-full bg-[var(--color-accent)] px-3 py-0.5 text-xs font-bold text-white">
              {year}
            </span>
          </div>
          {rows.map((row, i) => (
            <div key={i} className="relative mb-6 grid grid-cols-[1fr_2.5rem_1fr] items-start last:mb-0">
              {/* 왼쪽 */}
              <div className="pr-6">
                {row.left ? <TimelineCard item={row.left} /> : null}
              </div>
              {/* 가운데 dot */}
              <div className="flex justify-center pt-4">
                <div className="h-3 w-3 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-page-bg)]" />
              </div>
              {/* 오른쪽 */}
              <div className="pl-6">
                {row.right ? <TimelineCard item={row.right} /> : null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function AboutTimeline({ items }: AboutTimelineProps) {
  const groups = buildYearGroups(items);
  return (
    <>
      {/* 모바일 */}
      <div className="lg:hidden">
        <MobileTimeline items={items} />
      </div>
      {/* 데스크탑 */}
      <div className="hidden lg:block">
        <DesktopTimeline groups={groups} />
      </div>
    </>
  );
}
