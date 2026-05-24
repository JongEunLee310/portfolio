import { Link } from "react-router-dom";
import { Badge } from "@/components/common/Badge";
import { TechTag } from "@/components/common/TechTag";
import type { ProjectCard as ProjectCardData } from "@/types/project";

type ProjectCardProps = {
  project: ProjectCardData;
  variant?: "grid" | "list";
};

export function ProjectCard({ project, variant = "grid" }: ProjectCardProps) {
  const isList = variant === "list";

  return (
    <Link
      to={project.links.detail}
      className={`group block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover ${
        isList ? "md:flex" : ""
      }`}
    >
      <div className={`p-4 ${isList ? "md:w-64 md:shrink-0" : ""}`}>
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-[var(--color-surface-muted)]">
          <img
            src={project.thumbnail}
            alt={`${project.title} 썸네일`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4">
        <Badge variant={project.status === "featured" ? "primary" : "light"}>
          {project.subtitle ?? project.category}
        </Badge>
        <h3 className="mt-3 text-xl font-bold leading-snug text-[var(--color-page-text)]">
          {project.title}
        </h3>
        <p className="mt-3 min-h-12 overflow-hidden text-sm leading-6 text-[var(--color-muted-text)]">
          {project.summary}
        </p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 8).map((tag) => (
            <TechTag key={`${project.slug}-${tag.name}`} tag={tag} />
          ))}
        </div>
      </div>
    </Link>
  );
}
