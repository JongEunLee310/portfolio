import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const celeryPreforkAsyncioNullpool: TechnicalNoteCard = {
  slug: "celery-prefork-asyncio-nullpool",
  title: "Celery prefork worker에서 asyncio event loop mismatch 해결",
  summary:
    "prefork worker에서 asyncio.run()을 반복 호출하면 pool에 캐시된 커넥션이 닫힌 event loop에 묶입니다. NullPool로 태스크 실패율 50%를 0%로 낮춘 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.22",
  readingTime: "9분 읽기",
  tags: [
    { name: "Celery", category: "messaging" },
    { name: "AsyncIO", category: "backend" },
    { name: "SQLAlchemy", category: "backend" },
    { name: "PostgreSQL", category: "database" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
