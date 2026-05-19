import { describe, expect, it } from "vitest";
import { PATHS } from "@/constants/paths";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";

describe("route integrity", () => {
  it("프로젝트 상세 경로는 slug를 포함해야 한다", () => {
    for (const project of projects) {
      const path = PATHS.projectDetail(project.slug);

      expect(
        path,
        `프로젝트 상세 경로가 잘못되었습니다. slug: ${project.slug}, path: ${path}`,
      ).toBe(`/projects/${project.slug}`);
    }
  });

  it("기술 노트 상세 경로는 slug를 포함해야 한다", () => {
    for (const note of technicalNotes) {
      const path = PATHS.technicalNoteDetail(note.slug);

      expect(
        path,
        `기술 노트 상세 경로가 잘못되었습니다. slug: ${note.slug}, path: ${path}`,
      ).toBe(`/technical-notes/${note.slug}`);
    }
  });
});
