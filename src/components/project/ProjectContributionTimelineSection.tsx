import { SectionHeader } from "@/components/common/SectionHeader";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { ProjectDetail } from "@/types/project";

type ProjectContributionTimelineSectionProps = {
  contributions: ProjectDetail["contributions"];
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

export function ProjectContributionTimelineSection({
  contributions,
}: ProjectContributionTimelineSectionProps) {
  const visibleContributions = contributions.filter(
    (contribution) =>
      hasText(contribution.date) &&
      hasText(contribution.title) &&
      hasText(contribution.description),
  );

  if (visibleContributions.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.contributions.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.contributions.title}
      />
      <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleContributions.map((contribution) => (
          <li key={`${contribution.date}-${contribution.title}`}>
            <article className="relative h-full rounded-lg border border-slate-200 bg-white p-5 shadow-card">
              <span className="absolute -top-3 left-5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-slate-50" />
              <p className="mt-2 text-xs font-bold text-blue-600">
                {contribution.date}
              </p>
              <h3 className="mt-3 text-sm font-bold text-slate-900">
                {contribution.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600">
                {contribution.description}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
