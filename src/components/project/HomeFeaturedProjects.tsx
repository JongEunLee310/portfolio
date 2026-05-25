import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { TechTag } from "@/components/common/TechTag";
import { surface } from "@/styles/classNames";
import type { ProjectCard } from "@/types/project";

type HomeFeaturedProjectsProps = {
  featured: ProjectCard[];
  others: ProjectCard[];
};

function getProjectLabel(project: ProjectCard) {
  return project.subtitle ?? project.category;
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
          <Link
            to={primaryProject.links.detail}
            className={`${surface.darkCard} flex min-h-[420px] flex-col justify-between p-8 text-[var(--color-page-text)] transition duration-300 hover:-translate-y-1 hover:shadow-card-hover lg:col-span-2`}
          >
            <div>
              <Badge variant="dark">{getProjectLabel(primaryProject)}</Badge>
              <h3 className="mt-5 max-w-2xl text-2xl font-bold tracking-tight md:text-3xl">
                {primaryProject.title}
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted-text)] md:text-base">
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
          </Link>
        ) : null}

        {secondaryProject ? (
          <Link
            to={secondaryProject.links.detail}
            className={`${surface.card} overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
          >
            <div className="aspect-[16/10] overflow-hidden bg-[var(--color-surface-muted)]">
              <img
                src={secondaryProject.thumbnail}
                alt={`${secondaryProject.title} 썸네일`}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <Badge variant="light">{getProjectLabel(secondaryProject)}</Badge>
              <h3 className="mt-4 text-xl font-bold text-[var(--color-page-text)]">
                {secondaryProject.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted-text)]">
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
            </div>
          </Link>
        ) : null}
      </div>

      {others.length > 0 ? (
        <section className="mt-12">
          <h3 className="text-lg font-bold text-[var(--color-page-text)]">기타 프로젝트</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {others.map((project) => (
              <Link
                key={project.slug}
                to={project.links.detail}
                className={`${surface.card} flex gap-4 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
              >
                <div className="h-16 w-24 flex-none overflow-hidden rounded-xl bg-[var(--color-surface-muted)]">
                  <img
                    src={project.thumbnail}
                    alt={`${project.title} 썸네일`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-bold text-[var(--color-page-text)]">
                    {project.title}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-[var(--color-muted-text)]">
                    {project.period}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 3).map((tag) => (
                      <TechTag key={`${project.slug}-${tag.name}`} tag={tag} />
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
