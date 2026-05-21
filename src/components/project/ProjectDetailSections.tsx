import {
  Activity,
  BookOpen,
  Calendar,
  Clock,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  FileDown,
  Gauge,
  Github,
  Layers,
  Mail,
  MessageSquare,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { SectionHeader } from "@/components/common/SectionHeader";
import { TechTag } from "@/components/common/TechTag";
import { PROJECT_DETAIL_LABELS } from "@/constants/projectDetail";
import type { IconName, Metric, TechTag as TechTagType } from "@/types/common";
import type { ArchitectureNode, ProjectDetail } from "@/types/project";
import { ProjectMetricCard } from "./ProjectMetricCard";

const iconComponents: Record<IconName, LucideIcon> = {
  Code2,
  Server,
  Database,
  Cloud,
  Github,
  Mail,
  FileDown,
  Activity,
  Gauge,
  Layers,
  Workflow,
  MessageQueue: Workflow,
  MessageSquare,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
};

function hasText(value?: string) {
  return Boolean(value?.trim());
}

function hasItems<T>(items?: T[]) {
  return Boolean(items?.length);
}

function DetailIcon({ icon }: { icon?: IconName }) {
  if (!icon) {
    return null;
  }

  const Icon = iconComponents[icon];

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <Icon className="h-5 w-5" />
    </span>
  );
}

type ProjectDetailHeroProps = {
  project: ProjectDetail;
};

export function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  const links = getProjectLinks(project);
  const metadata = [
    { label: PROJECT_DETAIL_LABELS.hero.period, value: project.period },
    { label: PROJECT_DETAIL_LABELS.hero.role, value: project.role },
    { label: PROJECT_DETAIL_LABELS.hero.teamSize, value: project.teamSize },
  ].filter((item) => hasText(item.value));

  return (
    <section className="bg-hero-radial py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <div className="flex flex-wrap gap-2">
            {project.category.map((category) => (
              <Badge key={`${project.slug}-${category}`} variant="dark">
                {category}
              </Badge>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          {hasText(project.summary) ? (
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              {project.summary}
            </p>
          ) : null}
          {metadata.length > 0 ? (
            <dl className="mt-8 grid gap-3 sm:grid-cols-3">
              {metadata.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <dt className="text-xs font-semibold uppercase tracking-widest text-blue-300">
                    {item.label}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold text-white">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {hasItems(project.techStack) ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.map((tag) => (
                <TechTag key={`${project.slug}-${tag.name}`} tag={tag} />
              ))}
            </div>
          ) : null}
          {links.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={[
                    "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition",
                    index === 0
                      ? "bg-blue-600 shadow-blue-soft hover:bg-blue-500"
                      : "border border-white/20 bg-white/5 hover:border-blue-400 hover:bg-blue-500/10",
                  ].join(" ")}
                >
                  {link.label}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
        {hasText(project.heroImage) ? (
          <img
            src={project.heroImage}
            alt={`${project.title} 대표 이미지`}
            className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover shadow-glow"
          />
        ) : null}
      </div>
    </section>
  );
}

type ProjectOverviewSectionProps = {
  overview: string;
};

export function ProjectOverviewSection({ overview }: ProjectOverviewSectionProps) {
  if (!hasText(overview)) {
    return null;
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.overview.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.overview.title}
      />
      <p className="text-sm leading-7 text-slate-600">{overview}</p>
    </article>
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
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {section.title}
      </h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

type ProjectArchitectureSectionProps = {
  architecture: ProjectDetail["architecture"];
};

export function ProjectArchitectureSection({
  architecture,
}: ProjectArchitectureSectionProps) {
  const nodes = architecture.nodes.filter(
    (node) => hasText(node.title) && hasItems(node.items),
  );

  if (!hasText(architecture.title) || nodes.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.architecture.eyebrow}
        title={architecture.title}
        description={architecture.description}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {nodes.map((node) => (
          <ArchitectureNodeCard key={node.title} node={node} />
        ))}
      </div>
    </div>
  );
}

function ArchitectureNodeCard({ node }: { node: ArchitectureNode }) {
  const items = node.items.filter(hasText);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <DetailIcon icon={node.icon} />
      <h3 className="mt-4 font-bold text-slate-900">{node.title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

type ProjectFeaturesSectionProps = {
  features: ProjectDetail["features"];
};

export function ProjectFeaturesSection({
  features,
}: ProjectFeaturesSectionProps) {
  const visibleFeatures = features.filter(
    (feature) => hasText(feature.title) && hasText(feature.description),
  );

  if (visibleFeatures.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.features.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.features.title}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {visibleFeatures.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <DetailIcon icon={feature.icon} />
            <h3 className="mt-4 font-bold text-slate-900">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

type ProjectTechStackSectionProps = {
  techStack: TechTagType[];
  projectSlug: string;
};

export function ProjectTechStackSection({
  techStack,
  projectSlug,
}: ProjectTechStackSectionProps) {
  if (!hasItems(techStack)) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.techStack.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.techStack.title}
      />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap gap-2">
          {techStack.map((tag) => (
            <TechTag key={`${projectSlug}-stack-${tag.name}`} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

type ProjectScreenshotsSectionProps = {
  screenshots: ProjectDetail["screenshots"];
};

export function ProjectScreenshotsSection({
  screenshots,
}: ProjectScreenshotsSectionProps) {
  const visibleScreenshots = screenshots.filter(
    (screenshot) => hasText(screenshot.title) && hasText(screenshot.image),
  );

  if (visibleScreenshots.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.screenshots.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.screenshots.title}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {visibleScreenshots.map((screenshot) => (
          <article
            key={screenshot.title}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            <img
              src={screenshot.image}
              alt={screenshot.title}
              className="aspect-[16/10] w-full bg-slate-100 object-cover"
            />
            <div className="p-5">
              <h3 className="font-bold text-slate-900">{screenshot.title}</h3>
              {hasText(screenshot.description) ? (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {screenshot.description}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

type ProjectResultsSectionProps = {
  performance: Metric[];
};

export function ProjectResultsSection({ performance }: ProjectResultsSectionProps) {
  if (!hasItems(performance)) {
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
        <div className="grid gap-4 md:grid-cols-3">
          {performance.map((metric) => (
            <ProjectMetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProjectContributionSectionProps = {
  contributions: ProjectDetail["contributions"];
};

export function ProjectContributionSection({
  contributions,
}: ProjectContributionSectionProps) {
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
    <div>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.contributions.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.contributions.title}
      />
      <div className="space-y-4">
        {visibleContributions.map((contribution) => (
          <article
            key={`${contribution.date}-${contribution.title}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              {contribution.date}
            </p>
            <h3 className="mt-2 font-bold text-slate-900">
              {contribution.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {contribution.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

type ProjectTroubleshootingSectionProps = {
  troubleshooting: ProjectDetail["troubleshooting"];
};

export function ProjectTroubleshootingSection({
  troubleshooting,
}: ProjectTroubleshootingSectionProps) {
  const visibleItems = troubleshooting.filter(
    (item) =>
      hasText(item.title) && hasText(item.problem) && hasText(item.solution),
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.troubleshooting.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.troubleshooting.title}
      />
      <div className="space-y-4">
        {visibleItems.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <h3 className="font-bold text-slate-900">{item.title}</h3>
            <dl className="mt-4 space-y-3 text-sm leading-6">
              <div>
                <dt className="font-semibold text-slate-900">
                  {PROJECT_DETAIL_LABELS.sections.troubleshooting.problem}
                </dt>
                <dd className="mt-1 text-slate-600">{item.problem}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">
                  {PROJECT_DETAIL_LABELS.sections.troubleshooting.solution}
                </dt>
                <dd className="mt-1 text-slate-600">{item.solution}</dd>
              </div>
              {hasText(item.result) ? (
                <div>
                  <dt className="font-semibold text-slate-900">
                    {PROJECT_DETAIL_LABELS.sections.troubleshooting.result}
                  </dt>
                  <dd className="mt-1 text-slate-600">{item.result}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}

type ProjectRetrospectiveSectionProps = {
  retrospective: ProjectDetail["retrospective"];
};

export function ProjectRetrospectiveSection({
  retrospective,
}: ProjectRetrospectiveSectionProps) {
  const learned = retrospective.learned.filter(hasText);
  const improvement = retrospective.improvement.filter(hasText);
  const sections = [
    {
      title: PROJECT_DETAIL_LABELS.sections.retrospective.learned,
      items: learned,
    },
    {
      title: PROJECT_DETAIL_LABELS.sections.retrospective.improvement,
      items: improvement,
    },
  ].filter((section) => section.items.length > 0);

  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:px-8">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
          >
            <h2 className="text-xl font-bold text-slate-900">
              {section.title}
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

type ProjectLinksSectionProps = {
  project: ProjectDetail;
};

export function ProjectLinksSection({ project }: ProjectLinksSectionProps) {
  const links = getProjectLinks(project);

  if (links.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader
        eyebrow={PROJECT_DETAIL_LABELS.sections.links.eyebrow}
        title={PROJECT_DETAIL_LABELS.sections.links.title}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-900 shadow-card transition hover:border-blue-300 hover:text-blue-600"
          >
            {link.label}
            <ExternalLink className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}

type ProjectExternalLink = {
  label: string;
  href: string;
};

function getProjectLinks(project: ProjectDetail) {
  const links: { label: string; href?: string }[] = [
    {
      label: PROJECT_DETAIL_LABELS.links.github,
      href: project.links.github,
    },
    {
      label: PROJECT_DETAIL_LABELS.links.demo,
      href: project.links.demo,
    },
    {
      label: PROJECT_DETAIL_LABELS.links.docs,
      href: project.links.docs,
    },
  ];

  return links.filter((link): link is ProjectExternalLink => hasText(link.href));
}
