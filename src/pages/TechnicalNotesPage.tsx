import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { NoteGrid } from "@/components/note/NoteGrid";
import { NoteListSidebar } from "@/components/note/NoteListSidebar";
import { NoteListToolbar } from "@/components/note/NoteListToolbar";
import { NotePagination } from "@/components/note/NotePagination";
import { useTheme } from "@/app/theme/useTheme";
import {
  noteCategoryFilters,
  noteFilterContent,
  noteListContent,
  noteSidebarContent,
  noteSortOptions,
  noteViewModeOptions,
} from "@/data/filters";
import { pageHeroes } from "@/data/hero";
import { technicalNotes } from "@/data/technicalNotes";
import { themeSurface } from "@/styles/classNames";
import type {
  NoteFilterState,
  NoteSortValue,
  NoteViewMode,
  TechnicalNoteCard,
} from "@/types/note";
import { matchesNoteFilter } from "@/utils/noteFilters";
import { pageChrome } from "@/utils/pageChrome";
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
import { PATHS } from "@/constants/paths";

const pageSize = 6;

function matchesTechnicalNoteFilter(
  note: TechnicalNoteCard,
  filters: NoteFilterState,
) {
  const matchesCategory = matchesNoteFilter(note, filters.category);

  const matchesTags =
    filters.tags.length === 0 ||
    note.tags.some((tag) => filters.tags.includes(tag.name));

  return matchesCategory && matchesTags;
}

function parseNoteDate(note: TechnicalNoteCard) {
  return new Date(note.date.replaceAll(".", "-")).getTime();
}

function getReadingTimeMinutes(note: TechnicalNoteCard) {
  return Number(note.readingTime.match(/\d+/)?.[0] ?? 0);
}

function compareNotesByDate(noteA: TechnicalNoteCard, noteB: TechnicalNoteCard) {
  return parseNoteDate(noteB) - parseNoteDate(noteA);
}

function sortNotes(notesToSort: TechnicalNoteCard[], sort: NoteSortValue) {
  return [...notesToSort].sort((noteA, noteB) => {
    if (sort === "readingTime") {
      return getReadingTimeMinutes(noteA) - getReadingTimeMinutes(noteB);
    }

    return compareNotesByDate(noteA, noteB);
  });
}

function countByCategory() {
  return noteCategoryFilters.reduce<Record<string, number>>((acc, option) => {
    acc[option.value] =
      option.value === "all"
        ? technicalNotes.length
        : technicalNotes.filter((note) => matchesNoteFilter(note, option.value))
            .length;

    return acc;
  }, {});
}

function getTagOptions() {
  const counts = technicalNotes.reduce<Record<string, number>>((acc, note) => {
    for (const tag of note.tags) {
      acc[tag.name] = (acc[tag.name] ?? 0) + 1;
    }

    return acc;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({ label: value, value, count }))
    .sort((optionA, optionB) => optionB.count - optionA.count);
}

export function TechnicalNotesPage() {
  useSeo(seoConfig[PATHS.technicalNotes].title);
  const { resolvedTheme } = useTheme();
  const [filters, setFilters] = useState<NoteFilterState>({
    category: "all",
    tags: [],
  });
  const [sort, setSort] = useState<NoteSortValue>("latest");
  const [viewMode, setViewMode] = useState<NoteViewMode>("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? "1");
  const setCurrentPage = (page: number) =>
    setSearchParams({ page: String(page) }, { replace: true });

  const categoryCounts = useMemo(() => countByCategory(), []);
  const tagOptions = useMemo(() => getTagOptions(), []);

  const filteredNotes = useMemo(
    () =>
      technicalNotes.filter((note) => matchesTechnicalNoteFilter(note, filters)),
    [filters],
  );
  const sortedNotes = useMemo(
    () => sortNotes(filteredNotes, sort),
    [filteredNotes, sort],
  );
  const totalPages = Math.max(1, Math.ceil(sortedNotes.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleNotes = sortedNotes.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const updateFilters = (nextFilters: NoteFilterState) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const updateSort = (nextSort: NoteSortValue) => {
    setSort(nextSort);
    setCurrentPage(1);
  };

  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.technicalNotes} variant={resolvedTheme} />
      <section className={`${themeSurface.lightBand} pb-16 lg:pb-20`}>
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid w-full min-w-0 max-w-full gap-6 lg:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="lg:col-start-2">
              <NoteListToolbar
                content={noteListContent}
                totalCount={sortedNotes.length}
                sort={sort}
                sortOptions={noteSortOptions}
                viewModeOptions={noteViewModeOptions}
                viewMode={viewMode}
                onSortChange={updateSort}
                onViewModeChange={setViewMode}
              />
            </div>
            <NoteListSidebar
              content={noteSidebarContent}
              filters={filters}
              categoryOptions={noteCategoryFilters}
              tagOptions={tagOptions}
              counts={{
                byCategory: categoryCounts,
              }}
              onChange={updateFilters}
            />
            <main className="w-full min-w-0 max-w-full lg:col-start-2 lg:row-start-2">
              {visibleNotes.length > 0 ? (
                <NoteGrid
                  notes={visibleNotes}
                  viewMode={viewMode}
                />
              ) : (
                <EmptyState
                  title={noteFilterContent.emptyTitle}
                  description={noteFilterContent.emptyDescription}
                />
              )}
              {sortedNotes.length > pageSize ? (
                <NotePagination
                  content={noteListContent}
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              ) : null}
            </main>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
