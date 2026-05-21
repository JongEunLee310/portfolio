import { Grid2X2, List } from "lucide-react";
import type { ProjectSortValue, ProjectViewMode } from "@/types/project";

type SortOption = {
  label: string;
  value: ProjectSortValue;
};

type ViewModeOption = {
  label: string;
  value: ProjectViewMode;
};

type ProjectListToolbarProps = {
  content: {
    countPrefix: string;
    countSuffix: string;
    sortAriaLabel: string;
  };
  totalCount: number;
  sort: ProjectSortValue;
  sortOptions: readonly SortOption[];
  viewModeOptions: readonly ViewModeOption[];
  viewMode: ProjectViewMode;
  onSortChange: (sort: ProjectSortValue) => void;
  onViewModeChange: (mode: ProjectViewMode) => void;
};

const viewModeIconMap = {
  grid: Grid2X2,
  list: List,
} as const;

export function ProjectListToolbar({
  content,
  totalCount,
  sort,
  sortOptions,
  viewModeOptions,
  viewMode,
  onSortChange,
  onViewModeChange,
}: ProjectListToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-slate-300">
        {content.countPrefix} {totalCount}
        {content.countSuffix}
      </p>

      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as ProjectSortValue)
          }
          className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white outline-none transition hover:border-blue-400/60"
          aria-label={content.sortAriaLabel}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-900">
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-1">
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
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
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
