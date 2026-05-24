import { existsSync, readFileSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const DOC_PATHS = ["AGENTS.md", "CLAUDE.md", "docs"];
const FILE_REFERENCE_PATTERN =
  /`([\w./-]+\.(?:ts|tsx|md|js|mjs|json|css|yml|yaml))`/g;

async function walkMarkdownFiles(targetPath) {
  if (!existsSync(targetPath)) {
    return [];
  }

  const targetStat = await stat(targetPath);

  if (targetStat.isFile()) {
    return targetPath.endsWith(".md") ? [targetPath] : [];
  }

  const entries = await readdir(targetPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractReferencedFiles(content) {
  const references = [];
  let match;

  while ((match = FILE_REFERENCE_PATTERN.exec(content)) !== null) {
    references.push(match[1]);
  }

  return references;
}

async function main() {
  const markdownFiles = (await Promise.all(DOC_PATHS.map(walkMarkdownFiles))).flat();
  const missingReferences = [];

  for (const markdownFile of markdownFiles) {
    const content = readFileSync(markdownFile, "utf-8");
    const references = extractReferencedFiles(content);

    for (const reference of references) {
      if (
        reference.startsWith("http") ||
        path.isAbsolute(reference) ||
        reference.startsWith("./") ||
        reference.startsWith("../")
      ) {
        continue;
      }

      if (!existsSync(reference)) {
        missingReferences.push({
          markdownFile,
          reference,
        });
      }
    }
  }

  if (missingReferences.length > 0) {
    console.error("문서에 언급됐지만 실제로 존재하지 않는 파일이 있습니다:");

    for (const item of missingReferences) {
      console.error(`  - ${item.markdownFile} -> ${item.reference}`);
    }

    process.exit(1);
  }

  console.log("문서 드리프트 없음");
}

main().catch((error) => {
  console.error("문서 드리프트 검사 중 오류가 발생했습니다.");
  console.error(error);
  process.exit(1);
});
