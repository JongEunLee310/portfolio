import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import type {
  NoteFilterState,
  NoteFilterValue,
} from "@/types/note";

type FilterOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type CountMap = Record<string, number>;

type TagOption = {
  label: string;
  value: string;
  count: number;
};

type ProjectOption = {
  label: string;
  value: string;
  count: number;
};

type NoteListSidebarProps = {
  content: {
    title: string;
    categoryTitle: string;
    tagTitle: string;
    projectTitle: string;
    moreLabel: string;
    lessLabel: string;
  };
  filters: NoteFilterState;
  categoryOptions: readonly FilterOption<NoteFilterValue>[];
  tagOptions: TagOption[];
  projectOptions: ProjectOption[];
  counts: {
    byCategory: CountMap;
  };
  onChange: (filters: NoteFilterState) => void;
};

function getCount(counts: CountMap, value: string) {
  return counts[value] ?? 0;
}

const TAG_COLLAPSED_COUNT = 3;
const PROJECT_COLLAPSED_COUNT = 3;
const COLLAPSED_FILTER_LIST_HEIGHT = "max-h-[6.75rem]";
const EXPANDED_FILTER_LIST_HEIGHT = "max-h-64";

export function NoteListSidebar({
  content,
  filters,
  categoryOptions,
  tagOptions,
  projectOptions,
  counts,
  onChange,
}: NoteListSidebarProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

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
            {content.tagTitle}
          </h3>
          <div
            className={`mt-3 space-y-2.5 pr-1 transition-[max-height] duration-300 ease-out ${
              showAllTags
                ? `${EXPANDED_FILTER_LIST_HEIGHT} overflow-y-auto`
                : `${COLLAPSED_FILTER_LIST_HEIGHT} overflow-hidden`
            }`}
          >
            {tagOptions.map((option, index) => {
              const isChecked = filters.tags.includes(option.value);
              const isCollapsedHidden = !showAllTags && index >= TAG_COLLAPSED_COUNT;
              const nextTags = isChecked
                ? filters.tags.filter((item) => item !== option.value)
                : [...filters.tags, option.value];

              return (
                <label
                  key={option.value}
                  className="flex min-h-7 cursor-pointer items-center justify-between gap-3 rounded-md px-2 text-xs font-medium text-[var(--color-muted-text)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
                  aria-hidden={isCollapsedHidden}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={isCollapsedHidden}
                      onChange={() => onChange({ ...filters, tags: nextTags })}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)] ${
                        isChecked
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-2 rotate-[-45deg] border-b-2 border-l-2 border-white transition ${
                          isChecked ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </span>
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span>({option.count})</span>
                </label>
              );
            })}
          </div>
          {tagOptions.length > TAG_COLLAPSED_COUNT ? (
            <button
              type="button"
              onClick={() => setShowAllTags((prev) => !prev)}
              className="mt-3 inline-flex min-h-6 items-center gap-1 text-xs font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              aria-expanded={showAllTags}
            >
              {showAllTags ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
              {showAllTags ? content.lessLabel : content.moreLabel}
            </button>
          ) : null}
        </section>

        {projectOptions.length > 0 ? (
          <section className="border-t border-[var(--color-border)] pt-5">
            <h3 className="px-2 text-xs font-semibold text-[var(--color-muted-text)]">
              {content.projectTitle}
            </h3>
            <div
              className={`mt-3 space-y-2.5 pr-1 transition-[max-height] duration-300 ease-out ${
                showAllProjects
                  ? `${EXPANDED_FILTER_LIST_HEIGHT} overflow-y-auto`
                  : `${COLLAPSED_FILTER_LIST_HEIGHT} overflow-hidden`
              }`}
            >
              {projectOptions.map((option, index) => {
                const isChecked = filters.projectSlugs.includes(option.value);
                const isCollapsedHidden = !showAllProjects && index >= PROJECT_COLLAPSED_COUNT;
                const nextProjectSlugs = isChecked
                  ? filters.projectSlugs.filter((item) => item !== option.value)
                  : [...filters.projectSlugs, option.value];

                return (
                  <label
                    key={option.value}
                    className="flex min-h-7 cursor-pointer items-center justify-between gap-3 rounded-md px-2 text-xs font-medium text-[var(--color-muted-text)] transition hover:bg-[var(--color-accent-bg)] hover:text-[var(--color-accent)]"
                    aria-hidden={isCollapsedHidden}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isCollapsedHidden}
                        onChange={() =>
                          onChange({ ...filters, projectSlugs: nextProjectSlugs })
                        }
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-accent)] ${
                          isChecked
                            ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-2 rotate-[-45deg] border-b-2 border-l-2 border-white transition ${
                            isChecked ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </span>
                      <span className="truncate">{option.label}</span>
                    </span>
                    <span>({option.count})</span>
                  </label>
                );
              })}
            </div>
            {projectOptions.length > PROJECT_COLLAPSED_COUNT ? (
              <button
                type="button"
                onClick={() => setShowAllProjects((prev) => !prev)}
                className="mt-3 inline-flex min-h-6 items-center gap-1 text-xs font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                aria-expanded={showAllProjects}
              >
                {showAllProjects ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
                {showAllProjects ? content.lessLabel : content.moreLabel}
              </button>
            ) : null}
          </section>
        ) : null}

      </div>
    </aside>
  );
}
