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
  cardSummary: {
    title: "100 동시 로그인 37초·타 사용자 실행 이력 무단 접근 동시 발견",
    problem:
      "ThreadPoolExecutor max_workers=2로 Argon2 해시 처리 큐 깊이가 98까지 쌓여 로그인 중앙값이 37초에 달했습니다. 동시에 pipeline_id 소유권 검증 누락으로 타 사용자 실행 이력이 200으로 반환됐습니다.",
    solution:
      "max_workers를 min(32, cpu_count + 4)로 변경해 큐 대기 시간을 줄였습니다. list_pipeline_runs 엔드포인트에 pipeline 소유권 검증을 삽입해 pipeline-execution-svc 호출 전에 인가를 완결했습니다.",
    result:
      "401 cascade 감소, 타 사용자 실행 이력 접근 시 404 반환. 인증(authentication)과 인가(authorization) 책임 분리 원칙을 수립했습니다.",
  },
};
