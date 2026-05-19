import { spawnSync } from "node:child_process";

const result = spawnSync(
  "pnpm",
  ["vitest", "run", "src/tests/content-integrity.test.ts"],
  {
    stdio: "inherit",
    shell: true,
  },
);

if (result.status !== 0) {
  console.error("콘텐츠 무결성 검사 실패");
  process.exit(result.status ?? 1);
}

console.log("콘텐츠 무결성 검사 통과");
