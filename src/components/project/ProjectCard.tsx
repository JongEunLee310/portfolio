import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { TechTag } from "@/components/common/TechTag";
import type { ProjectCard as ProjectCardData } from "@/types/project";

type ProjectCardProps = {
  project: ProjectCardData;
  labels: {
    detailLabel: string;
    githubLabel: string;
  };
  variant?: "grid" | "list";
};

export function ProjectCard({
  project,
  labels,
  variant = "grid",
}: ProjectCardProps) {
  const isList = variant === "list";

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        isList ? "md:flex" : ""
      }`}
    >
      <div className={`p-4 ${isList ? "md:w-64 md:shrink-0" : ""}`}>
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
          <img
            src={project.thumbnail}
            alt={`${project.title} 썸네일`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4">
        <Badge variant={project.status === "featured" ? "primary" : "light"}>
          {project.subtitle ?? project.category.join(" · ")}
        </Badge>
        <h3 className="mt-3 text-xl font-bold leading-snug text-slate-950">
          {project.title}
        </h3>
        <p className="mt-3 min-h-12 overflow-hidden text-sm leading-6 text-slate-600">
          {project.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 8).map((tag) => (
            <TechTag key={`${project.slug}-${tag.name}`} tag={tag} />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            to={project.links.detail}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            {labels.detailLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
          {project.links.github ? (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-blue-500 hover:text-blue-600"
            >
              {labels.githubLabel}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
