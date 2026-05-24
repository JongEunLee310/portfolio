import { Grid2X2, List } from "lucide-react";
import type { NoteSortValue, NoteViewMode } from "@/types/note";

type SortOption = {
  label: string;
  value: NoteSortValue;
};

type ViewModeOption = {
  label: string;
  value: NoteViewMode;
};

type NoteListToolbarProps = {
  content: {
    countPrefix: string;
    countSuffix: string;
    sortAriaLabel: string;
  };
  totalCount: number;
  sort: NoteSortValue;
  sortOptions: readonly SortOption[];
  viewModeOptions: readonly ViewModeOption[];
  viewMode: NoteViewMode;
  onSortChange: (sort: NoteSortValue) => void;
  onViewModeChange: (mode: NoteViewMode) => void;
};

const viewModeIconMap = {
  grid: Grid2X2,
  list: List,
} as const;

export function NoteListToolbar({
  content,
  totalCount,
  sort,
  sortOptions,
  viewModeOptions,
  viewMode,
  onSortChange,
  onViewModeChange,
}: NoteListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[var(--color-muted-text)]">
        {content.countPrefix} {totalCount}
        {content.countSuffix}
      </p>

      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as NoteSortValue)}
          className="h-10 w-36 shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-semibold text-[var(--color-page-text)] outline-none transition hover:border-[var(--color-accent)]"
          aria-label={content.sortAriaLabel}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-900">
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
          {viewModeOptions.map((option) => {
            const Icon = viewModeIconMap[option.value];

            return (
              <button
                key={option.value}
                type="button"
                aria-label={option.label}
                aria-pressed={viewMode === option.value}
                onClick={() => onViewModeChange(option.value)}
                className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
                  viewMode === option.value
                    ? "bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-muted-text)] hover:text-[var(--color-page-text)]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
