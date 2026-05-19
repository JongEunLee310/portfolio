import { SectionHeader } from "@/components/common/SectionHeader";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectFilter } from "@/components/project/ProjectFilter";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { projectCategoryFilters } from "@/data/filters";
import { pageHeroes } from "@/data/hero";
import { projects } from "@/data/projects";
import { pageChrome } from "./pageChrome";

export function ProjectsPage() {
  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.projects} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            eyebrow="PROJECT INDEX"
            title="전체 프로젝트"
            description="카테고리와 기술 스택을 기준으로 확장할 수 있는 프로젝트 목록입니다."
          />
          <ProjectFilter options={projectCategoryFilters} />
          <div className="mt-8">
            <ProjectGrid projects={projects} />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
