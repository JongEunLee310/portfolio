import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
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
    lessLabel: string;
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

const TECH_COLLAPSED_COUNT = 6;

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
  const [showAllTechOptions, setShowAllTechOptions] = useState(false);
  const visibleTechOptions = showAllTechOptions
    ? techOptions
    : techOptions.slice(0, TECH_COLLAPSED_COUNT);

  return (
    <aside className="sticky top-24 hidden w-56 shrink-0 self-start border-l border-[var(--color-border)] py-2 pl-3 text-[var(--color-page-text)] lg:col-start-1 lg:row-start-2 lg:block">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          {content.title}
        </h2>
        <SlidersHorizontal className="h-4 w-4 text-[var(--color-muted-text)]" />
      </div>

      <div className="mt-4 space-y-7">
        <section>
          <h3 className="px-2 text-xs font-semibold text-[var(--color-muted-text)]">
            {content.categoryTitle}
          </h3>
          <div className="mt-2 space-y-0.5">
            {categoryOptions.map((option) => {
              const isSelected = filters.category === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...filters, category: option.value })}
                  className={`flex min-h-8 w-full items-center justify-between rounded-md border-l-2 px-2 py-1.5 text-left text-xs font-semibold leading-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                      : "border-transparent text-[var(--color-muted-text)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
                  }`}
                  aria-current={isSelected ? "true" : undefined}
                >
                  <span>{option.label}</span>
                  <span>{getCount(counts.byCategory, option.value)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] pt-5">
          <h3 className="px-2 text-xs font-semibold text-[var(--color-muted-text)]">
            {content.techTitle}
          </h3>
          <div
            className={`mt-3 space-y-2.5 ${
              showAllTechOptions ? "max-h-52 overflow-y-auto pr-1" : ""
            }`}
          >
            {visibleTechOptions.map((option) => {
              const isChecked = filters.techStacks.includes(option.value);
              const nextTechStacks = isChecked
                ? filters.techStacks.filter((item) => item !== option.value)
                : [...filters.techStacks, option.value];

              return (
                <label
                  key={option.value}
                  className="flex min-h-7 cursor-pointer items-center justify-between gap-3 rounded-md px-2 text-xs font-medium text-[var(--color-muted-text)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        onChange({ ...filters, techStacks: nextTechStacks })
                      }
                      className="h-3.5 w-3.5 rounded border-[var(--color-border)] bg-transparent accent-[var(--color-accent)]"
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span>({option.count})</span>
                </label>
              );
            })}
          </div>
          {techOptions.length > TECH_COLLAPSED_COUNT ? (
            <button
              type="button"
              onClick={() => setShowAllTechOptions((prev) => !prev)}
              className="mt-3 inline-flex min-h-6 items-center gap-1 text-xs font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              aria-expanded={showAllTechOptions}
            >
              {showAllTechOptions ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              {showAllTechOptions ? content.lessLabel : content.moreLabel}
            </button>
          ) : null}
        </section>

        <section className="border-t border-[var(--color-border)] pt-5">
          <h3 className="px-2 text-xs font-semibold text-[var(--color-muted-text)]">
            {content.periodTitle}
          </h3>
          <div className="mt-3 space-y-2.5">
            {periodOptions.map((option) => {
              const isSelected = filters.period === option.value;

              return (
                <label
                  key={option.value}
                  className="flex min-h-7 cursor-pointer items-center gap-2 rounded-md px-2 text-xs font-medium text-[var(--color-muted-text)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
                >
                  <input
                    type="radio"
                    name="project-period"
                    checked={isSelected}
                    onChange={() => onChange({ ...filters, period: option.value })}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border bg-[var(--color-surface)] transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)] ${
                      isSelected
                        ? "border-[var(--color-accent)]"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full transition ${
                        isSelected ? "bg-[var(--color-accent)]" : "bg-transparent"
                      }`}
                    />
                  </span>
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] pt-5">
          <h3 className="px-2 text-xs font-semibold text-[var(--color-muted-text)]">
            {content.typeTitle}
          </h3>
          <div className="mt-2 space-y-0.5">
            {typeOptions.map((option) => {
              const isSelected = filters.type === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...filters, type: option.value })}
                  className={`flex min-h-8 w-full items-center justify-between rounded-md border-l-2 px-2 py-1.5 text-left text-xs font-semibold leading-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                      : "border-transparent text-[var(--color-muted-text)] hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
                  }`}
                  aria-current={isSelected ? "true" : undefined}
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
