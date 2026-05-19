import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["vitest", "run", "src/tests/image-paths.test.ts"], {
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  console.error("이미지 경로 검사 실패");
  process.exit(result.status ?? 1);
}

console.log("이미지 경로 검사 통과");
