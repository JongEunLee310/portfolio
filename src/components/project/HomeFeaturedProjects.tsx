import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { TechTag } from "@/components/common/TechTag";
import { button, surface } from "@/styles/classNames";
import type { ProjectCard } from "@/types/project";

type HomeFeaturedProjectsProps = {
  featured: ProjectCard[];
  others: ProjectCard[];
};

function getProjectLabel(project: ProjectCard) {
  return project.subtitle ?? project.category.join(" · ");
}

export function HomeFeaturedProjects({
  featured,
  others,
}: HomeFeaturedProjectsProps) {
  const primaryProject = featured[0];
  const secondaryProject = featured[1];

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {primaryProject ? (
          <article
            className={`${surface.darkCard} flex min-h-[420px] flex-col justify-between p-8 text-white lg:col-span-2`}
          >
            <div>
              <Badge variant="dark">{getProjectLabel(primaryProject)}</Badge>
              <h3 className="mt-5 max-w-2xl text-2xl font-bold tracking-tight md:text-3xl">
                {primaryProject.title}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                {primaryProject.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {primaryProject.techStack.slice(0, 5).map((tag) => (
                  <TechTag
                    key={`${primaryProject.slug}-${tag.name}`}
                    tag={tag}
                  />
                ))}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={primaryProject.links.detail} className={button.primary}>
                상세 보기
              </Link>
              {primaryProject.links.github ? (
                <a
                  href={primaryProject.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className={`${button.darkOutline} gap-2`}
                >
                  GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </article>
        ) : null}

        {secondaryProject ? (
          <article
            className={`${surface.card} overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
          >
            <div className="aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={secondaryProject.thumbnail}
                alt={`${secondaryProject.title} 썸네일`}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <Badge variant="light">{getProjectLabel(secondaryProject)}</Badge>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {secondaryProject.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {secondaryProject.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {secondaryProject.techStack.slice(0, 4).map((tag) => (
                  <TechTag
                    key={`${secondaryProject.slug}-${tag.name}`}
                    tag={tag}
                  />
                ))}
              </div>
              <Link
                to={secondaryProject.links.detail}
                className={`${button.primary} mt-6`}
              >
                상세 보기
              </Link>
            </div>
          </article>
        ) : null}
      </div>

      {others.length > 0 ? (
        <section className="mt-12">
          <h3 className="text-lg font-bold text-slate-900">기타 프로젝트</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {others.map((project) => (
              <article
                key={project.slug}
                className={`${surface.card} flex gap-4 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
              >
                <div className="h-16 w-24 flex-none overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={project.thumbnail}
                    alt={`${project.title} 썸네일`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-slate-900">
                    {project.title}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {project.period}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tag) => (
                      <TechTag key={`${project.slug}-${tag.name}`} tag={tag} />
                    ))}
                  </div>
                  <Link
                    to={project.links.detail}
                    className="mt-4 inline-flex text-sm font-semibold text-blue-600 transition hover:text-blue-500"
                  >
                    상세 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
