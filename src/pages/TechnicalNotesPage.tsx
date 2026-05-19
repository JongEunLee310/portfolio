import { SectionHeader } from "@/components/common/SectionHeader";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { NoteGrid } from "@/components/note/NoteGrid";
import { noteCategoryFilters } from "@/data/filters";
import { pageHeroes } from "@/data/hero";
import { technicalNotes } from "@/data/technicalNotes";
import { pageChrome } from "./pageChrome";

export function TechnicalNotesPage() {
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
          <div className="mb-8 flex flex-wrap gap-2">
            {noteCategoryFilters.map((filter) => (
              <span
                key={filter.value}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {filter.label}
              </span>
            ))}
          </div>
          <NoteGrid notes={technicalNotes} />
        </div>
      </section>
    </PageLayout>
  );
}
