import { ChevronDown, SlidersHorizontal } from "lucide-react";
import type {
  ProjectFilterState,
  ProjectFilterValue,
  ProjectPeriodFilterValue,
  ProjectTypeFilterValue,
} from "@/types/project";

type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type CountMap = Record<string, number>;

type TechOption = {
  label: string;
  value: string;
  count: number;
};

type ProjectListSidebarProps = {
  content: {
    title: string;
    categoryTitle: string;
    techTitle: string;
    periodTitle: string;
    typeTitle: string;
    moreLabel: string;
  };
  filters: ProjectFilterState;
  categoryOptions: readonly FilterOption<ProjectFilterValue>[];
  techOptions: TechOption[];
  periodOptions: readonly FilterOption<ProjectPeriodFilterValue>[];
  typeOptions: readonly FilterOption<ProjectTypeFilterValue>[];
  counts: {
    byCategory: CountMap;
    byType: CountMap;
  };
  onChange: (filters: ProjectFilterState) => void;
};

function getCount(counts: CountMap, value: string) {
  return counts[value] ?? 0;
}

export function ProjectListSidebar({
  content,
  filters,
  categoryOptions,
  techOptions,
  periodOptions,
  typeOptions,
  counts,
  onChange,
}: ProjectListSidebarProps) {
  const visibleTechOptions = techOptions.slice(0, 6);

  return (
    <aside className="sticky top-24 hidden w-56 shrink-0 self-start overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-page-text)] shadow-card lg:block">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
        <h2 className="text-sm font-semibold">{content.title}</h2>
        <SlidersHorizontal className="h-4 w-4 text-[var(--color-muted-text)]" />
      </div>

      <div className="space-y-7 px-5 py-5">
        <section>
          <h3 className="text-xs font-semibold text-[var(--color-muted-text)]">
            {content.categoryTitle}
          </h3>
          <div className="mt-3 space-y-1">
            {categoryOptions.map((option) => {
              const isSelected = filters.category === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...filters, category: option.value })}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-page-text)]"
                  }`}
                >
                  <span>{option.label}</span>
                  <span>{getCount(counts.byCategory, option.value)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] pt-6">
          <h3 className="text-xs font-semibold text-[var(--color-muted-text)]">
            {content.techTitle}
          </h3>
          <div className="mt-3 space-y-3">
            {visibleTechOptions.map((option) => {
              const isChecked = filters.techStacks.includes(option.value);
              const nextTechStacks = isChecked
                ? filters.techStacks.filter((item) => item !== option.value)
                : [...filters.techStacks, option.value];

              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between gap-3 text-xs text-[var(--color-muted-text)] transition hover:text-[var(--color-page-text)]"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        onChange({ ...filters, techStacks: nextTechStacks })
                      }
                      className="h-3.5 w-3.5 rounded border-[var(--color-border)] bg-transparent accent-blue-500"
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span>({option.count})</span>
                </label>
              );
            })}
          </div>
          {techOptions.length > visibleTechOptions.length ? (
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-400"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              {content.moreLabel}
            </button>
          ) : null}
        </section>

        <section className="border-t border-[var(--color-border)] pt-6">
          <h3 className="text-xs font-semibold text-[var(--color-muted-text)]">
            {content.periodTitle}
          </h3>
          <div className="mt-3 space-y-3">
            {periodOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-muted-text)] transition hover:text-[var(--color-page-text)]"
              >
                <input
                  type="radio"
                  name="project-period"
                  checked={filters.period === option.value}
                  onChange={() => onChange({ ...filters, period: option.value })}
                  className="h-3.5 w-3.5 border-[var(--color-border)] bg-transparent accent-blue-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] pt-6">
          <h3 className="text-xs font-semibold text-[var(--color-muted-text)]">
            {content.typeTitle}
          </h3>
          <div className="mt-3 space-y-1">
            {typeOptions.map((option) => {
              const isSelected = filters.type === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...filters, type: option.value })}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-[var(--color-muted-text)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-page-text)]"
                  }`}
                >
                  <span>{option.label}</span>
                  <span>{getCount(counts.byType, option.value)}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
