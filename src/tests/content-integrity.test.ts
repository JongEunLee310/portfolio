import { describe, expect, it } from "vitest";
import { noteDetails } from "@/data/noteDetails";
import { projectDetails } from "@/data/projectDetails";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";

function findDuplicates(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

describe("content integrity", () => {
  it("프로젝트 slug는 중복되지 않아야 한다", () => {
    const slugs = projects.map((project) => project.slug);
    const duplicates = findDuplicates(slugs);

    expect(
      duplicates,
      `projects.ts에 중복 slug가 있습니다: ${duplicates.join(", ")}`,
    ).toEqual([]);
  });

  it("기술 노트 slug는 중복되지 않아야 한다", () => {
    const slugs = technicalNotes.map((note) => note.slug);
    const duplicates = findDuplicates(slugs);

    expect(
      duplicates,
      `technicalNotes.ts에 중복 slug가 있습니다: ${duplicates.join(", ")}`,
    ).toEqual([]);
  });

  it("projectDetails의 slug는 projects에 존재해야 한다", () => {
    const projectSlugs = new Set(projects.map((project) => project.slug));
    const missing = projectDetails
      .map((detail) => detail.slug)
      .filter((slug) => !projectSlugs.has(slug));

    expect(
      missing,
      `projectDetails.ts에 projects.ts에 없는 slug가 있습니다: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("noteDetails의 slug는 technicalNotes에 존재해야 한다", () => {
    const noteSlugs = new Set(technicalNotes.map((note) => note.slug));
    const missing = noteDetails
      .map((detail) => detail.slug)
      .filter((slug) => !noteSlugs.has(slug));

    expect(
      missing,
      `noteDetails.ts에 technicalNotes.ts에 없는 slug가 있습니다: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("프로젝트 상세의 relatedNoteSlugs는 실제 기술 노트에 존재해야 한다", () => {
    const noteSlugs = new Set(technicalNotes.map((note) => note.slug));
    const missing = projectDetails.flatMap((project) =>
      project.relatedNoteSlugs.filter((slug) => !noteSlugs.has(slug)),
    );

    expect(
      missing,
      `projectDetails.ts의 relatedNoteSlugs 중 존재하지 않는 기술 노트 slug가 있습니다: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("기술 노트의 relatedProjectSlugs는 실제 프로젝트에 존재해야 한다", () => {
    const projectSlugs = new Set(projects.map((project) => project.slug));
    const missing = technicalNotes.flatMap((note) =>
      (note.relatedProjectSlugs ?? []).filter((slug) => !projectSlugs.has(slug)),
    );

    expect(
      missing,
      `technicalNotes.ts의 relatedProjectSlugs 중 존재하지 않는 프로젝트 slug가 있습니다: ${missing.join(", ")}`,
    ).toEqual([]);
  });
});
