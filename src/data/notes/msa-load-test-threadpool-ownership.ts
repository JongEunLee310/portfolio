import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const msaLoadTestThreadpoolOwnership: TechnicalNoteCard = {
  slug: "msa-load-test-threadpool-ownership",
  title: "MSA 부하 테스트 — 로그인 병목과 소유권 검증 누락 발견",
  summary:
    "100 VU 부하 테스트에서 로그인 중앙값 37초, 타 사용자 실행 이력 무단 접근이 동시에 발견됐습니다. max_workers=2 포화와 인가 로직 누락을 함께 수정한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.22",
  readingTime: "10분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "FastAPI", category: "backend" },
    { name: "AsyncIO", category: "backend" },
    { name: "Python", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
