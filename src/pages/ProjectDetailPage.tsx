import { useParams } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProjectMetricCard } from "@/components/project/ProjectMetricCard";
import { TechTag } from "@/components/common/TechTag";
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
              title="프로젝트를 찾을 수 없습니다"
              description="요청한 프로젝트 slug와 연결된 상세 데이터가 없습니다."
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
                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
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
              eyebrow="ARCHITECTURE"
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
        </div>
      </section>
      {project.performance.length > 0 ? (
        <section className="bg-brand-dark py-16 text-white lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeader eyebrow="METRICS" title="성과 지표" dark />
            <div className="grid gap-4 md:grid-cols-3">
              {project.performance.map((metric) => (
                <ProjectMetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PageLayout>
  );
}
