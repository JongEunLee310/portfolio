import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { Metric, TechTag as TechTagType } from "@/types/common";
import type { ProjectCategory } from "@/types/project";
import { ProjectMetricCard } from "./ProjectMetricCard";

function hasText(value?: string) {
  return Boolean(value?.trim());
}

type ProjectOverviewSectionProps = {
  overview: string;
  categories: ProjectCategory[];
  techStack: TechTagType[];
};

export function ProjectOverviewSection({
  overview,
  categories,
  techStack,
}: ProjectOverviewSectionProps) {
  const pills = [
    ...categories.map((category) => category),
    ...techStack.slice(0, 4).map((tag) => tag.name),
  ].slice(0, 6);

  if (!hasText(overview)) {
    return null;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
      <div>
        <SectionHeader
          eyebrow={PROJECT_DETAIL_LABELS.sections.overview.eyebrow}
          title={PROJECT_DETAIL_LABELS.sections.overview.title}
        />
        <p className="max-w-3xl text-sm leading-7 text-slate-700">{overview}</p>
      </div>
      {pills.length ? (
        <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
          {pills.map((pill) => (
            <span
              key={pill}
              className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              {pill}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

type NarrativeSection = {
  title: string;
  items: string[];
};

type ProjectNarrativeCardProps = {
  eyebrow: string;
  section: NarrativeSection;
};

export function ProjectNarrativeCard({
  eyebrow,
  section,
}: ProjectNarrativeCardProps) {
  const items = section.items.filter(hasText);

  if (!hasText(section.title) || items.length === 0) {
    return null;
  }

  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-6 shadow-card">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {section.title}
      </h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-600"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

type ProjectResultsSectionProps = {
  performance: Metric[];
};

export function ProjectResultsSection({ performance }: ProjectResultsSectionProps) {
  if (!performance.length) {
    return null;
  }

  return (
    <section className="bg-brand-dark py-16 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow={PROJECT_DETAIL_LABELS.sections.metrics.eyebrow}
          title={PROJECT_DETAIL_LABELS.sections.metrics.title}
          dark
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {performance.map((metric) => (
            <ProjectMetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
