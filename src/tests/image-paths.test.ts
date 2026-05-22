import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { aboutData } from "@/data/about";
import { pageHeroes } from "@/data/hero";
import { projectDetails } from "@/data/projectDetails";
import { projects } from "@/data/projects";
import { technicalNotes } from "@/data/technicalNotes";

function toPublicPath(src: string) {
  return path.join(process.cwd(), "public", src.replace(/^\//, ""));
}

function expectPublicFileExists(src: string, context: string) {
  const filePath = toPublicPath(src);

  expect(
    existsSync(filePath),
    `${context}에서 참조한 이미지 파일이 존재하지 않습니다. src: ${src}, expected: ${filePath}`,
  ).toBe(true);
}

function expectHeroVisualExists(
  visual: string | { readonly light: string; readonly dark: string },
  context: string,
) {
  if (typeof visual === "string") {
    expectPublicFileExists(visual, context);
    return;
  }

  expectPublicFileExists(visual.light, `${context}.light`);
  expectPublicFileExists(visual.dark, `${context}.dark`);
}

describe("image paths", () => {
  it("hero visual 이미지가 public에 존재해야 한다", () => {
    for (const [key, hero] of Object.entries(pageHeroes)) {
      if ("visual" in hero && hero.visual) {
        expectHeroVisualExists(hero.visual, `pageHeroes.${key}.visual`);
      }
    }
  });

  it("profile 이미지가 public에 존재해야 한다", () => {
    expectPublicFileExists(aboutData.profile.avatar, "aboutData.profile.avatar");
  });

  it("project thumbnail 이미지가 public에 존재해야 한다", () => {
    for (const project of projects) {
      expectPublicFileExists(
        project.thumbnail,
        `projects.${project.slug}.thumbnail`,
      );
    }
  });

  it("project detail 이미지가 public에 존재해야 한다", () => {
    for (const project of projectDetails) {
      expectPublicFileExists(
        project.heroImage,
        `projectDetails.${project.slug}.heroImage`,
      );

      for (const screenshot of project.screenshots) {
        expectPublicFileExists(
          screenshot.image,
          `projectDetails.${project.slug}.screenshots.${screenshot.title}`,
        );
      }
    }
  });

  it("technical note thumbnail 이미지가 public에 존재해야 한다", () => {
    for (const note of technicalNotes) {
      expectPublicFileExists(note.thumbnail, `technicalNotes.${note.slug}`);
    }
  });
});
