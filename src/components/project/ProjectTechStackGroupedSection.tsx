import { SectionHeader } from "@/components/common/SectionHeader";
import { TechTag } from "@/components/common/TechTag";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { ProjectDetail } from "@/types/project";

type ProjectTechStackGroupedSectionProps = {
  projectSlug: string;
  techStack: ProjectDetail["techStack"];
  techStackGroups?: ProjectDetail["techStackGroups"];
};

export function ProjectTechStackGroupedSection({
  projectSlug,
  techStack,
  techStackGroups,
}: ProjectTechStackGroupedSectionProps) {
  const groups = techStackGroups?.length
    ? techStackGroups
    : [
        {
          title: PROJECT_DETAIL_LABELS.sections.techStack.title,
          items: techStack,
        },
      ];

  if (groups.every((group) => group.items.length === 0)) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.techStack.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.techStack.title}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <article
            key={`${projectSlug}-${group.title}`}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-card"
          >
            <h3 className="text-sm font-bold text-[var(--color-page-text)]">{group.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((tag) => (
                <TechTag
                  key={`${projectSlug}-${group.title}-${tag.name}`}
                  tag={tag}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
