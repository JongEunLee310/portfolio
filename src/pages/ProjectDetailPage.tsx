import { useParams } from "react-router-dom";
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
import { ProjectFeatureStripSection } from "@/components/project/ProjectFeatureStripSection";
import { ProjectScreenshotGallerySection } from "@/components/project/ProjectScreenshotGallerySection";
import { ProjectTechStackGroupedSection } from "@/components/project/ProjectTechStackGroupedSection";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import { projectDetails } from "@/data/projectDetails";
import { pageChrome } from "@/utils/pageChrome";

export function ProjectDetailPage() {
  const { projectSlug } = useParams();
  const project = projectDetails.find((item) => item.slug === projectSlug);

  if (!project) {
    return (
      <PageLayout {...pageChrome}>
        <section className="bg-slate-50 py-20">
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

  return (
    <PageLayout {...pageChrome}>
      <ProjectDetailHero project={project} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-6 lg:px-8">
          <ProjectOverviewSection
            overview={project.overview}
            categories={project.category}
            techStack={project.techStack}
          />
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
          <ProjectArchitectureFlowSection
            architecture={project.architecture}
            architectureFlow={project.architectureFlow}
          />
          <ProjectFeatureStripSection features={project.features} />
          <ProjectScreenshotGallerySection
            projectTitle={project.title}
            screenshots={project.screenshots}
          />
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <ProjectTechStackGroupedSection
              projectSlug={project.slug}
              techStack={project.techStack}
              techStackGroups={project.techStackGroups}
            />
            <ProjectContributionTimelineSection
              contributions={project.contributions}
            />
          </div>
        </div>
      </section>
      <ProjectResultsSection performance={project.performance} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <ProjectClosingCardsSection project={project} />
      </section>
    </PageLayout>
  );
}
