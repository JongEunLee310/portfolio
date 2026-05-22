import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHero } from "@/components/hero/PageHero";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectGrid } from "@/components/project/ProjectGrid";
import { ProjectListSidebar } from "@/components/project/ProjectListSidebar";
import { ProjectListToolbar } from "@/components/project/ProjectListToolbar";
import { ProjectPagination } from "@/components/project/ProjectPagination";
import { ProjectTechStackBand } from "@/components/project/ProjectTechStackBand";
import { useTheme } from "@/app/theme/useTheme";
import {
  projectCategoryFilters,
  projectFilterContent,
  projectListContent,
  projectPeriodFilters,
  projectSidebarContent,
  projectSortOptions,
  projectTechStackContent,
  projectTypeFilters,
  projectViewModeOptions,
} from "@/data/filters";
import { pageHeroes } from "@/data/hero";
import { projects } from "@/data/projects";
import { techStackGroups } from "@/data/techStack";
import { themeSurface } from "@/styles/classNames";
import type {
  ProjectCard,
  ProjectFilterState,
  ProjectPeriodFilterValue,
  ProjectSortValue,
  ProjectViewMode,
} from "@/types/project";
import { pageChrome } from "@/utils/pageChrome";

const pageSize = 6;

function matchesProjectFilter(
  project: ProjectCard,
  filters: ProjectFilterState,
) {
  const matchesCategory =
    filters.category === "all" ||
    project.category.includes(filters.category) ||
    project.type === filters.category;

  const matchesTech =
    filters.techStacks.length === 0 ||
    project.techStack.some((tech) => filters.techStacks.includes(tech.name));

  const matchesType = filters.type === "all" || project.type === filters.type;

  const matchesPeriod = matchesProjectPeriod(project, filters.period);

  return matchesCategory && matchesTech && matchesType && matchesPeriod;
}

function getProjectStartDate(project: ProjectCard) {
  const [year, month] = project.period.match(/\d{4}\.\d{2}/)?.[0].split(".") ?? [];

  if (!year || !month) {
    return null;
  }

  return new Date(Number(year), Number(month) - 1, 1);
}

function matchesProjectPeriod(
  project: ProjectCard,
  period: ProjectPeriodFilterValue,
) {
  if (period === "all") {
    return true;
  }

  const startDate = getProjectStartDate(project);

  if (!startDate) {
    return true;
  }

  const now = new Date();
  const months =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    now.getMonth() -
    startDate.getMonth();

  if (period === "last6Months") {
    return months <= 6;
  }

  if (period === "last1Year") {
    return months <= 12;
  }

  return months > 12;
}

function compareProjects(projectA: ProjectCard, projectB: ProjectCard) {
  const dateA = getProjectStartDate(projectA)?.getTime() ?? 0;
  const dateB = getProjectStartDate(projectB)?.getTime() ?? 0;

  return dateB - dateA;
}

function sortProjects(projectsToSort: ProjectCard[], sort: ProjectSortValue) {
  return [...projectsToSort].sort((projectA, projectB) => {
    if (sort === "name") {
      return projectA.title.localeCompare(projectB.title);
    }

    if (sort === "featured") {
      const featuredA = projectA.status === "featured" ? 0 : 1;
      const featuredB = projectB.status === "featured" ? 0 : 1;

      return featuredA - featuredB || compareProjects(projectA, projectB);
    }

    return compareProjects(projectA, projectB);
  });
}

function countByCategory() {
  return projectCategoryFilters.reduce<Record<string, number>>(
    (acc, option) => {
      acc[option.value] =
        option.value === "all"
          ? projects.length
          : projects.filter(
              (project) =>
                project.category.includes(option.value) ||
                project.type === option.value,
            ).length;

      return acc;
    },
    {},
  );
}

function countByType() {
  return projectTypeFilters.reduce<Record<string, number>>((acc, option) => {
    acc[option.value] =
      option.value === "all"
        ? projects.length
        : projects.filter((project) => project.type === option.value).length;

    return acc;
  }, {});
}

function getTechOptions() {
  const counts = projects.reduce<Record<string, number>>((acc, project) => {
    for (const tech of project.techStack) {
      acc[tech.name] = (acc[tech.name] ?? 0) + 1;
    }

    return acc;
  }, {});

  return Object.entries(counts)
    .map(([value, count]) => ({ label: value, value, count }))
    .sort((optionA, optionB) => optionB.count - optionA.count);
}

export function ProjectsPage() {
  const { resolvedTheme } = useTheme();
  const [filters, setFilters] = useState<ProjectFilterState>({
    category: "all",
    techStacks: [],
    period: "all",
    type: "all",
  });
  const [sort, setSort] = useState<ProjectSortValue>("latest");
  const [viewMode, setViewMode] = useState<ProjectViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const categoryCounts = useMemo(() => countByCategory(), []);
  const typeCounts = useMemo(() => countByType(), []);
  const techOptions = useMemo(() => getTechOptions(), []);

  const filteredProjects = useMemo(
    () => projects.filter((project) => matchesProjectFilter(project, filters)),
    [filters],
  );
  const sortedProjects = useMemo(
    () => sortProjects(filteredProjects, sort),
    [filteredProjects, sort],
  );
  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleProjects = sortedProjects.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const updateFilters = (nextFilters: ProjectFilterState) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const updateSort = (nextSort: ProjectSortValue) => {
    setSort(nextSort);
    setCurrentPage(1);
  };

  return (
    <PageLayout {...pageChrome}>
      <PageHero {...pageHeroes.projects} variant={resolvedTheme} />
      <section className={`${themeSurface.lightBand} pb-16 lg:pb-20`}>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex gap-6">
            <ProjectListSidebar
              content={projectSidebarContent}
              filters={filters}
              categoryOptions={projectCategoryFilters}
              techOptions={techOptions}
              periodOptions={projectPeriodFilters}
              typeOptions={projectTypeFilters}
              counts={{ byCategory: categoryCounts, byType: typeCounts }}
              onChange={updateFilters}
            />
            <main className="min-w-0 flex-1">
              <ProjectListToolbar
                content={projectListContent}
                totalCount={sortedProjects.length}
                sort={sort}
                sortOptions={projectSortOptions}
                viewModeOptions={projectViewModeOptions}
                viewMode={viewMode}
                onSortChange={updateSort}
                onViewModeChange={setViewMode}
              />
              <div className="mt-6">
                {visibleProjects.length > 0 ? (
                  <ProjectGrid
                    projects={visibleProjects}
                    labels={projectListContent}
                    viewMode={viewMode}
                  />
                ) : (
                  <EmptyState
                    title={projectFilterContent.emptyTitle}
                    description={projectFilterContent.emptyDescription}
                  />
                )}
              </div>
              {sortedProjects.length > pageSize ? (
                <ProjectPagination
                  content={projectListContent}
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  canShowMore={safeCurrentPage < totalPages}
                  onPageChange={setCurrentPage}
                  onShowMore={() =>
                    setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))
                  }
                />
              ) : null}
            </main>
          </div>
        </div>
      </section>
      <ProjectTechStackBand
        content={projectTechStackContent}
        groups={techStackGroups}
        variant={resolvedTheme}
      />
    </PageLayout>
  );
}
