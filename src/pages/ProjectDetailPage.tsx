import { ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectMetricCard } from "@/components/project/ProjectMetricCard";
import { TechTag } from "@/components/common/TechTag";
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
      <section className="bg-hero-radial py-20 text-white lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Badge variant="dark">{project.period}</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              {project.overview}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.map((tag) => (
                <TechTag key={`${project.slug}-${tag.name}`} tag={tag} />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.github ? (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10"
                >
                  {PROJECT_DETAIL_LABELS.links.github}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              {project.links.demo ? (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-blue-soft transition hover:bg-blue-500"
                >
                  {PROJECT_DETAIL_LABELS.links.demo}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
          <img
            src={project.heroImage}
            alt={`${project.title} 대표 이미지`}
            className="aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover shadow-glow"
          />
        </div>
      </section>
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {[project.problem, project.solution].map((section) => (
              <article
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
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
          <div className="mt-12">
            <SectionHeader
              eyebrow={PROJECT_DETAIL_LABELS.sections.architecture.eyebrow}
              title={project.architecture.title}
              description={project.architecture.description}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {project.architecture.nodes.map((node) => (
                <article
                  key={node.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
                >
                  <h3 className="font-bold text-slate-900">{node.title}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    {node.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
          {project.features.length > 0 ? (
            <div className="mt-12">
              <SectionHeader
                eyebrow={PROJECT_DETAIL_LABELS.sections.features.eyebrow}
                title={PROJECT_DETAIL_LABELS.sections.features.title}
              />
              <div className="grid gap-4 md:grid-cols-3">
                {project.features.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
                  >
                    <h3 className="font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {project.screenshots.length > 0 ? (
            <div className="mt-12">
              <SectionHeader
                eyebrow={PROJECT_DETAIL_LABELS.sections.screenshots.eyebrow}
                title={PROJECT_DETAIL_LABELS.sections.screenshots.title}
              />
              <div className="grid gap-6 md:grid-cols-2">
                {project.screenshots.map((screenshot) => (
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
                      <h3 className="font-bold text-slate-900">
                        {screenshot.title}
                      </h3>
                      {screenshot.description ? (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {screenshot.description}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
      {project.performance.length > 0 ? (
        <section className="bg-brand-dark py-16 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader
              eyebrow={PROJECT_DETAIL_LABELS.sections.metrics.eyebrow}
              title={PROJECT_DETAIL_LABELS.sections.metrics.title}
              dark
            />
            <div className="grid gap-4 md:grid-cols-3">
              {project.performance.map((metric) => (
                <ProjectMetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          {project.contributions.length > 0 ? (
            <div>
              <SectionHeader
                eyebrow={PROJECT_DETAIL_LABELS.sections.contributions.eyebrow}
                title={PROJECT_DETAIL_LABELS.sections.contributions.title}
              />
              <div className="space-y-4">
                {project.contributions.map((contribution) => (
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
          ) : null}
          {project.troubleshooting.length > 0 ? (
            <div>
              <SectionHeader
                eyebrow={PROJECT_DETAIL_LABELS.sections.troubleshooting.eyebrow}
                title={PROJECT_DETAIL_LABELS.sections.troubleshooting.title}
              />
              <div className="space-y-4">
                {project.troubleshooting.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
                  >
                    <h3 className="font-bold text-slate-900">{item.title}</h3>
                    <dl className="mt-4 space-y-3 text-sm leading-6">
                      <div>
                        <dt className="font-semibold text-slate-900">
                          {
                            PROJECT_DETAIL_LABELS.sections.troubleshooting
                              .problem
                          }
                        </dt>
                        <dd className="mt-1 text-slate-600">{item.problem}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-900">
                          {
                            PROJECT_DETAIL_LABELS.sections.troubleshooting
                              .solution
                          }
                        </dt>
                        <dd className="mt-1 text-slate-600">{item.solution}</dd>
                      </div>
                      {item.result ? (
                        <div>
                          <dt className="font-semibold text-slate-900">
                            {
                              PROJECT_DETAIL_LABELS.sections.troubleshooting
                                .result
                            }
                          </dt>
                          <dd className="mt-1 text-slate-600">{item.result}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:px-8">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              {PROJECT_DETAIL_LABELS.sections.retrospective.learned}
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {project.retrospective.learned.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              {PROJECT_DETAIL_LABELS.sections.retrospective.improvement}
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              {project.retrospective.improvement.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </PageLayout>
  );
}
