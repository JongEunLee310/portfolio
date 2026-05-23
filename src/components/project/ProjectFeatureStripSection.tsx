import { SectionHeader } from "@/components/common/SectionHeader";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { ProjectDetail } from "@/types/project";
import { ProjectDetailIcon } from "./ProjectDetailIcon";

type ProjectFeatureStripSectionProps = {
  features: ProjectDetail["features"];
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

export function ProjectFeatureStripSection({
  features,
}: ProjectFeatureStripSectionProps) {
  const visibleFeatures = features.filter(
    (feature) => hasText(feature.title) && hasText(feature.description),
  );

  if (visibleFeatures.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.features.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.features.title}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {visibleFeatures.map((feature) => (
          <article
            key={feature.title}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] text-[var(--color-accent)]">
              <ProjectDetailIcon icon={feature.icon} />
            </span>
            <h3 className="mt-4 text-sm font-bold text-[var(--color-page-text)]">
              {feature.title}
            </h3>
            <p className="mt-2 text-xs leading-6 text-[var(--color-muted-text)]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
