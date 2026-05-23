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
};
