import { useParams } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  ProjectArchitectureSection,
  ProjectContributionSection,
  ProjectDetailHero,
  ProjectFeaturesSection,
  ProjectLinksSection,
  ProjectNarrativeCard,
  ProjectOverviewSection,
  ProjectResultsSection,
  ProjectRetrospectiveSection,
  ProjectScreenshotsSection,
  ProjectTechStackSection,
  ProjectTroubleshootingSection,
} from "@/components/project/ProjectDetailSections";
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
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <ProjectOverviewSection overview={project.overview} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
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
          <div className="mt-12">
            <ProjectArchitectureSection architecture={project.architecture} />
          </div>
          <div className="mt-12">
            <ProjectFeaturesSection features={project.features} />
          </div>
          <div className="mt-12">
            <ProjectTechStackSection
              projectSlug={project.slug}
              techStack={project.techStack}
            />
          </div>
          <div className="mt-12">
            <ProjectScreenshotsSection screenshots={project.screenshots} />
          </div>
        </div>
      </section>
      <ProjectResultsSection performance={project.performance} />
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <ProjectContributionSection contributions={project.contributions} />
          <ProjectTroubleshootingSection
            troubleshooting={project.troubleshooting}
          />
        </div>
        <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
          <ProjectLinksSection project={project} />
        </div>
      </section>
      <ProjectRetrospectiveSection retrospective={project.retrospective} />
    </PageLayout>
  );
}
