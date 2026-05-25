import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const asyncPipelineTransition: TechnicalNoteCard = {
  slug: "async-pipeline-transition",
  title: "동기 파이프라인을 비동기 구조로 전환한 이유",
  summary:
    "HTTP 요청과 파이프라인 실행을 분리해 응답 시간과 커넥션 점유 문제를 개선한 과정입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.15",
  readingTime: "8분 읽기",
  tags: [
    { name: "FastAPI", category: "backend" },
    { name: "BackgroundTasks", category: "backend" },
    { name: "Celery", category: "messaging" },
    { name: "Redis", category: "database" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  cardSummary: {
    title: "DB 커넥션 풀 점유",
    problem: "POST /run이 Git clone + Job 실행 전 구간 동안 커넥션을 점유해 SELECT 쿼리 응답 시간이 수백 ms로 상승했습니다.",
    solution: "비동기화(POST /run -> 202 Accepted)로 실행 함수를 응답 경로에서 분리해 커넥션 점유 구간을 제거했습니다.",
    result: "일반 CRUD 쿼리의 대기 시간을 해소하고 비동기화 전략 선택의 계기를 만들었습니다.",
  },
};
