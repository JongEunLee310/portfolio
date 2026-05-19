import { ProjectCard } from "./ProjectCard";
import type { ProjectCard as ProjectCardData } from "@/types/project";

type ProjectGridProps = {
  projects: ProjectCardData[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
}
