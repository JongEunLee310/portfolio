import { useParams } from "react-router-dom";
import { useTheme } from "@/app/theme/useTheme";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectArchitectureFlowSection } from "@/components/project/ProjectArchitectureFlowSection";
import { ProjectClosingCardsSection } from "@/components/project/ProjectClosingCardsSection";
import { ProjectContributionTimelineSection } from "@/components/project/ProjectContributionTimelineSection";
import { ProjectDetailHero } from "@/components/project/ProjectDetailHero";
import {
  ProjectNarrativeCard,
  ProjectOverviewSection,
  ProjectResultsSection,
} from "@/components/project/ProjectDetailSections";
import {
  ProjectDetailToc,
  type ProjectDetailTocItem,
} from "@/components/project/ProjectDetailToc";
import { ProjectFeatureStripSection } from "@/components/project/ProjectFeatureStripSection";
import { ProjectScreenshotGallerySection } from "@/components/project/ProjectScreenshotGallerySection";
import { ProjectTechStackGroupedSection } from "@/components/project/ProjectTechStackGroupedSection";
import { PATHS } from "@/constants/paths";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import { projectDetails } from "@/data/projectDetails";
import { seoConfig } from "@/data/seo";
import { themeSurface } from "@/styles/classNames";
import { pageChrome } from "@/utils/pageChrome";
import { useSeo } from "@/utils/useSeo";
import { technicalNotes } from "@/data/technicalNotes";
import { projectNoteStubs } from "@/data/projectNoteStubs";
import type { TechnicalNoteCard } from "@/types/note";

function hasText(value?: string) {
  return Boolean(value?.trim());
}

export function ProjectDetailPage() {
  const { resolvedTheme } = useTheme();
  const { projectSlug } = useParams();
  const project = projectDetails.find((item) => item.slug === projectSlug);
  const allNotes = [...technicalNotes, ...projectNoteStubs];
  const troubleshootingCards: TechnicalNoteCard[] = project
    ? project.troubleshootingNoteSlugs
        .map((slug) => allNotes.find((n) => n.slug === slug))
        .filter((n): n is TechnicalNoteCard => n !== undefined && n.cardSummary !== undefined)
    : [];
  useSeo(project ? `${project.title} | 이종은 포트폴리오` : seoConfig[PATHS.projects].title);

  if (!project) {
    return (
      <PageLayout {...pageChrome}>
        <section className={`${themeSurface.lightBand} py-20`}>
          <div className="mx-auto max-w-3xl px-6">
            <EmptyState
              title={PROJECT_DETAIL_LABELS.emptyState.title}
              description={PROJECT_DETAIL_LABELS.emptyState.description}
            />
          </div>
        </section>
      </PageLayout>
    );
  }

  const tocItems: ProjectDetailTocItem[] = [];

  if (hasText(project.overview)) {
    tocItems.push({
      id: "project-overview",
      title: PROJECT_DETAIL_LABELS.toc.overview,
    });
  }

  if (hasText(project.problem.title) || hasText(project.solution.title)) {
    tocItems.push({
      id: "project-problem-solution",
      title: PROJECT_DETAIL_LABELS.toc.problemSolution,
    });
  }

  if (hasText(project.architecture.title) || project.architectureFlow) {
    tocItems.push({
      id: "project-architecture",
      title: PROJECT_DETAIL_LABELS.toc.architecture,
    });
  }

  if (project.features.length > 0) {
    tocItems.push({
      id: "project-features",
      title: PROJECT_DETAIL_LABELS.toc.features,
    });
  }

  // TODO: screenshot 확보 후 활성화
  // if (project.screenshots.length > 0) {
  //   tocItems.push({
  //     id: "project-screenshots",
  //     title: PROJECT_DETAIL_LABELS.toc.screenshots,
  //   });
  // }

  if (project.techStack.length > 0 || project.contributions.length > 0) {
    tocItems.push({
      id: "project-tech-contribution",
      title: PROJECT_DETAIL_LABELS.toc.techContribution,
    });
  }

  if (project.performance.length > 0) {
    tocItems.push({
      id: "project-results",
      title: PROJECT_DETAIL_LABELS.toc.metrics,
    });
  }

  if (
    troubleshootingCards.length > 0 ||
    (project.improvements?.length ?? 0) > 0 ||
    (project.retrospectives[0]?.learned.length ?? 0) > 0 ||
    (project.retrospectives[0]?.improvement.length ?? 0) > 0
  ) {
    tocItems.push({
      id: "project-closing",
      title: PROJECT_DETAIL_LABELS.toc.closing,
    });
  }

  return (
    <PageLayout {...pageChrome}>
      <ProjectDetailHero project={project} variant={resolvedTheme} />
      <section className={`${themeSurface.lightBand} py-16 lg:py-20`}>
        <div className="mx-auto grid max-w-[92rem] gap-6 px-6 lg:grid-cols-[9.5rem_minmax(0,1fr)] lg:px-8 xl:grid-cols-[10rem_minmax(0,1fr)] xl:gap-8">
          <ProjectDetailToc
            items={tocItems}
            title={PROJECT_DETAIL_LABELS.toc.title}
            ariaLabel={PROJECT_DETAIL_LABELS.toc.ariaLabel}
          />
          <main className="min-w-0 space-y-12">
            <div id="project-overview" className="scroll-mt-24">
              <ProjectOverviewSection
                overview={project.overview}
                categories={project.category}
                techStack={project.techStack}
              />
            </div>
            <div id="project-problem-solution" className="scroll-mt-24">
              <div className="grid gap-6 lg:grid-cols-2">
                <ProjectNarrativeCard
                  eyebrow={PROJECT_DETAIL_LABELS.sections.problem.eyebrow}
                  section={project.problem}
                />
                <ProjectNarrativeCard
                  eyebrow={PROJECT_DETAIL_LABELS.sections.solution.eyebrow}
                  section={project.solution}
                />
              </div>
            </div>
            <div id="project-architecture" className="scroll-mt-24">
              <ProjectArchitectureFlowSection
                architecture={project.architecture}
                architectureFlow={project.architectureFlow}
              />
            </div>
            <div id="project-features" className="scroll-mt-24">
              <ProjectFeatureStripSection features={project.features} />
            </div>
            {/* TODO: screenshot 확보 후 활성화 */}
            {/* <div id="project-screenshots" className="scroll-mt-24">
              <ProjectScreenshotGallerySection
                projectTitle={project.title}
                screenshots={project.screenshots}
              />
            </div> */}
            <div
              id="project-tech-contribution"
              className="grid scroll-mt-24 gap-6 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <ProjectTechStackGroupedSection
                projectSlug={project.slug}
                techStack={project.techStack}
                techStackGroups={project.techStackGroups}
              />
              <ProjectContributionTimelineSection
                contributions={project.contributions}
              />
            </div>
            <div id="project-results" className="scroll-mt-24">
              <ProjectResultsSection performance={project.performance} />
            </div>
            <div id="project-closing" className="scroll-mt-24">
              <ProjectClosingCardsSection project={project} troubleshootingCards={troubleshootingCards} />
            </div>
          </main>
        </div>
      </section>
    </PageLayout>
  );
}
