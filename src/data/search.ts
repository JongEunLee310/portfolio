import { projects } from "./projects";
import { technicalNotes } from "./technicalNotes";

export function searchContents(keyword: string) {
  const q = keyword.toLowerCase();

  const matchedProjects = projects.filter((project) =>
    [
      project.title,
      project.summary,
      project.description,
      ...project.techStack.map((tag) => tag.name),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );

  const matchedNotes = technicalNotes.filter((note) =>
    [note.title, note.summary, ...note.tags.map((tag) => tag.name)]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );

  return {
    projects: matchedProjects,
    notes: matchedNotes,
  };
}
