import { describe, expect, it } from "vitest";
import { noteDetails } from "@/data/noteDetails";
import { projectDetails } from "@/data/projectDetails";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";
import { projectNoteStubs } from "@/data/projectNoteStubs";

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

  it("projects의 모든 slug는 projectDetails에 존재해야 한다", () => {
    const detailSlugs = new Set(projectDetails.map((detail) => detail.slug));
    const missing = projects
      .map((project) => project.slug)
      .filter((slug) => !detailSlugs.has(slug));

    expect(
      missing,
      `projects.ts의 slug 중 projectDetails.ts에 상세 데이터가 없는 항목이 있습니다: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("프로젝트 상세 slug는 중복되지 않아야 한다", () => {
    const slugs = projectDetails.map((detail) => detail.slug);
    const duplicates = findDuplicates(slugs);

    expect(
      duplicates,
      `projectDetails.ts에 중복 slug가 있습니다: ${duplicates.join(", ")}`,
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

  it("프로젝트 상세의 troubleshootingNoteSlugs는 technicalNotes 또는 projectNoteStubs에 존재해야 한다", () => {
    const allNoteSlugs = new Set([
      ...technicalNotes.map((n) => n.slug),
      ...projectNoteStubs.map((n) => n.slug),
    ]);
    const missing = projectDetails.flatMap((project) =>
      project.troubleshootingNoteSlugs.filter((slug) => !allNoteSlugs.has(slug)),
    );
    expect(
      missing,
      `troubleshootingNoteSlugs 중 존재하지 않는 slug가 있습니다: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("troubleshootingNoteSlugs에 참조된 note는 모두 cardSummary를 가져야 한다", () => {
    const allNotes = [...technicalNotes, ...projectNoteStubs];
    const missing = projectDetails.flatMap((project) =>
      project.troubleshootingNoteSlugs.filter((slug) => {
        const note = allNotes.find((n) => n.slug === slug);
        return !note?.cardSummary;
      }),
    );
    expect(
      missing,
      `troubleshootingNoteSlugs 중 cardSummary 없는 slug: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("troubleshootingNoteSlugs에 참조된 note는 모두 category가 troubleshooting이어야 한다", () => {
    const allNotes = [...technicalNotes, ...projectNoteStubs];
    const wrong = projectDetails.flatMap((project) =>
      project.troubleshootingNoteSlugs.filter((slug) => {
        const note = allNotes.find((n) => n.slug === slug);
        return note !== undefined && note.category !== "troubleshooting";
      }),
    );
    expect(
      wrong,
      `troubleshootingNoteSlugs 중 category가 troubleshooting이 아닌 slug: ${wrong.join(", ")}`,
    ).toEqual([]);
  });

  it("기술 노트의 relatedProjectSlugs는 실제 프로젝트에 존재해야 한다", () => {
    const projectSlugs = new Set(projects.map((project) => project.slug));
    const missing = technicalNotes.flatMap((note) =>
      (note.relatedProjectSlugs ?? []).filter(
        (slug) => !projectSlugs.has(slug),
      ),
    );

    expect(
      missing,
      `technicalNotes.ts의 relatedProjectSlugs 중 존재하지 않는 프로젝트 slug가 있습니다: ${missing.join(", ")}`,
    ).toEqual([]);
  });
});
