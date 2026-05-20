import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { FilterPills } from "@/components/common/FilterPills";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { NoteGrid } from "@/components/note/NoteGrid";
import { noteCategoryFilters, noteFilterContent } from "@/data/filters";
import { pageHeroes } from "@/data/hero";
import { technicalNotes } from "@/data/technicalNotes";
import type { NoteFilterValue } from "@/types/note";
import { matchesNoteFilter } from "@/utils/noteFilters";
import { pageChrome } from "@/utils/pageChrome";

export function TechnicalNotesPage() {
  const [selectedFilter, setSelectedFilter] = useState<NoteFilterValue>("all");
  const filteredNotes = useMemo(
    () => technicalNotes.filter((note) => matchesNoteFilter(note, selectedFilter)),
    [selectedFilter],
  );

  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.technicalNotes} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="NOTE INDEX"
            title="전체 기술 노트"
            description="개발 중 마주한 문제와 해결 과정을 구조화해 기록합니다."
          />
          <FilterPills
            options={noteCategoryFilters}
            selectedValue={selectedFilter}
            onChange={setSelectedFilter}
            ariaLabel={noteFilterContent.ariaLabel}
          />
          <div className="mt-8">
            {filteredNotes.length > 0 ? (
              <NoteGrid notes={filteredNotes} />
            ) : (
              <EmptyState
                title={noteFilterContent.emptyTitle}
                description={noteFilterContent.emptyDescription}
              />
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
