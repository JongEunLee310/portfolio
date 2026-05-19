import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const REQUIRED_PATHS = [
  "AGENTS.md",
  "CLAUDE.md",
  "docs/decisions",
  "docs/conventions",
  "docs/domain",
  "docs/failures",
  "src/data/AGENTS.md",
  "src/data/CLAUDE.md",
  "src/components/AGENTS.md",
  "src/components/CLAUDE.md",
  "src/pages/AGENTS.md",
  "src/pages/CLAUDE.md",
  "src/types/AGENTS.md",
  "src/constants/AGENTS.md",
];

const FORBIDDEN_PATTERNS = [
  /^temp_/,
  /_new\./,
  /_old\./,
  /_backup\./,
  /_fix\./,
  /\.bak$/,
  /\.tmp$/,
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (["node_modules", "dist", ".git", "coverage"].includes(entry.name)) {
        continue;
      }

      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function matchesForbiddenPattern(filePath) {
  const filename = path.basename(filePath);
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(filename));
}

async function main() {
  const missingRequiredPaths = REQUIRED_PATHS.filter(
    (requiredPath) => !existsSync(requiredPath),
  );

  const files = await walk(".");
  const forbiddenFiles = files.filter(matchesForbiddenPattern);

  if (missingRequiredPaths.length > 0 || forbiddenFiles.length > 0) {
    if (missingRequiredPaths.length > 0) {
      console.error("필수 하네스 파일 또는 디렉토리가 없습니다:");
      for (const missingPath of missingRequiredPaths) {
        console.error(`  - ${missingPath}`);
      }
    }

    if (forbiddenFiles.length > 0) {
      console.error("구조 규칙 위반 파일이 발견되었습니다:");
      for (const file of forbiddenFiles) {
        console.error(`  - ${file}`);
      }
    }

    process.exit(1);
  }

  console.log("구조 드리프트 없음");
}

main().catch((error) => {
  console.error("구조 드리프트 검사 중 오류가 발생했습니다.");
  console.error(error);
  process.exit(1);
});
