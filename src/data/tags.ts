import { projects } from "./projects";
import { technicalNotes } from "./technicalNotes";

export const tagGroups = [
  {
    title: "Backend",
    tags: ["Spring Boot", "FastAPI", "JPA", "QueryDSL", "SQLAlchemy"],
  },
  {
    title: "Database",
    tags: ["MySQL", "PostgreSQL", "Redis"],
  },
  {
    title: "Infra",
    tags: ["AWS", "Docker", "Nginx", "GitHub Actions"],
  },
  {
    title: "Messaging",
    tags: ["Celery", "RabbitMQ", "Event Driven"],
  },
  {
    title: "Observability",
    tags: ["Prometheus", "Grafana", "Loki"],
  },
  {
    title: "AI",
    tags: ["OpenAI API", "LLM Analyzer", "Prompt Engineering"],
  },
] as const;

export function getContentsByTag(tagName: string) {
  const normalized = tagName.toLowerCase();

  const matchedProjects = projects.filter((project) =>
    project.techStack.some((tag) => tag.name.toLowerCase() === normalized),
  );

  const matchedNotes = technicalNotes.filter((note) =>
    note.tags.some((tag) => tag.name.toLowerCase() === normalized),
  );

  return {
    projects: matchedProjects,
    notes: matchedNotes,
  };
}
