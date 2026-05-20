import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectFilter } from "@/components/project/ProjectFilter";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { projectCategoryFilters, projectFilterContent } from "@/data/filters";
import { pageHeroes } from "@/data/hero";
import { projects } from "@/data/projects";
import type { ProjectCard, ProjectFilterValue } from "@/types/project";
import { pageChrome } from "@/utils/pageChrome";

function matchesProjectFilter(
  project: ProjectCard,
  selectedFilter: ProjectFilterValue,
) {
  if (selectedFilter === "all") {
    return true;
  }

  return (
    project.category.includes(selectedFilter) ||
    project.type === selectedFilter ||
    project.techStack.some(
      (tech) =>
        tech.category === selectedFilter ||
        tech.name.toLowerCase().includes(selectedFilter),
    )
  );
}

export function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] =
    useState<ProjectFilterValue>("all");
  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => matchesProjectFilter(project, selectedFilter)),
    [selectedFilter],
  );

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
          <ProjectFilter
            options={projectCategoryFilters}
            selectedValue={selectedFilter}
            onChange={setSelectedFilter}
            ariaLabel={projectFilterContent.ariaLabel}
          />
          <div className="mt-8">
            {filteredProjects.length > 0 ? (
              <ProjectGrid projects={filteredProjects} />
            ) : (
              <EmptyState
                title={projectFilterContent.emptyTitle}
                description={projectFilterContent.emptyDescription}
              />
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
