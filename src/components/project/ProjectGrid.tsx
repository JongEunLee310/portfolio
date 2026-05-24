import { ProjectCard } from "./ProjectCard";
import type {
  ProjectCard as ProjectCardData,
  ProjectViewMode,
} from "@/types/project";

type ProjectGridProps = {
  projects: ProjectCardData[];
  viewMode?: ProjectViewMode;
};

export function ProjectGrid({ projects, viewMode = "grid" }: ProjectGridProps) {
  return (
    <div
      className={
        viewMode === "list"
          ? "grid grid-cols-1 gap-5"
          : "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
      }
    >
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} variant={viewMode} />
      ))}
    </div>
  );
}
