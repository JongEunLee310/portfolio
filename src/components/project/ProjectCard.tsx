import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { TechTag } from "@/components/common/TechTag";
import type { ProjectCard as ProjectCardData } from "@/types/project";

type ProjectCardProps = {
  project: ProjectCardData;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={project.thumbnail}
          alt={`${project.title} 썸네일`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <Badge variant={project.status === "featured" ? "primary" : "light"}>
          {project.subtitle ?? project.category.join(" · ")}
        </Badge>
        <h3 className="mt-4 text-xl font-bold text-slate-900">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {project.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.slice(0, 5).map((tag) => (
            <TechTag key={`${project.slug}-${tag.name}`} tag={tag} />
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={project.links.detail}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            상세 보기
          </Link>
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-blue-500 hover:text-blue-600"
            >
              GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
