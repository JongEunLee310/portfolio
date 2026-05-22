import { ChevronDown, SlidersHorizontal } from "lucide-react";
import type {
  NoteFeaturedFilterValue,
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

type NoteListSidebarProps = {
  content: {
    title: string;
    categoryTitle: string;
    tagTitle: string;
    featuredTitle: string;
    moreLabel: string;
  };
  filters: NoteFilterState;
  categoryOptions: readonly FilterOption<NoteFilterValue>[];
  tagOptions: TagOption[];
  featuredOptions: readonly FilterOption<NoteFeaturedFilterValue>[];
  counts: {
    byCategory: CountMap;
    byFeatured: CountMap;
  };
  onChange: (filters: NoteFilterState) => void;
};

function getCount(counts: CountMap, value: string) {
  return counts[value] ?? 0;
}

export function NoteListSidebar({
  content,
  filters,
  categoryOptions,
  tagOptions,
  featuredOptions,
  counts,
  onChange,
}: NoteListSidebarProps) {
  const visibleTagOptions = tagOptions.slice(0, 6);

  return (
    <aside className="sticky top-24 hidden w-56 shrink-0 self-start overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] text-white shadow-glow lg:block">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-semibold">{content.title}</h2>
        <SlidersHorizontal className="h-4 w-4 text-slate-400" />
      </div>

      <div className="space-y-7 px-5 py-5">
        <section>
          <h3 className="text-xs font-semibold text-slate-400">
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
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span>{option.label}</span>
                  <span>{getCount(counts.byCategory, option.value)}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="border-t border-white/10 pt-6">
          <h3 className="text-xs font-semibold text-slate-400">
            {content.tagTitle}
          </h3>
          <div className="mt-3 space-y-3">
            {visibleTagOptions.map((option) => {
              const isChecked = filters.tags.includes(option.value);
              const nextTags = isChecked
                ? filters.tags.filter((item) => item !== option.value)
                : [...filters.tags, option.value];

              return (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center justify-between gap-3 text-xs text-slate-400 transition hover:text-white"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onChange({ ...filters, tags: nextTags })}
                      className="h-3.5 w-3.5 rounded border-white/20 bg-transparent accent-blue-500"
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span>({option.count})</span>
                </label>
              );
            })}
          </div>
          {tagOptions.length > visibleTagOptions.length ? (
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-400"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              {content.moreLabel}
            </button>
          ) : null}
        </section>

        <section className="border-t border-white/10 pt-6">
          <h3 className="text-xs font-semibold text-slate-400">
            {content.featuredTitle}
          </h3>
          <div className="mt-3 space-y-1">
            {featuredOptions.map((option) => {
              const isSelected = filters.featured === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...filters, featured: option.value })}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-medium transition ${
                    isSelected
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span>{option.label}</span>
                  <span>{getCount(counts.byFeatured, option.value)}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
