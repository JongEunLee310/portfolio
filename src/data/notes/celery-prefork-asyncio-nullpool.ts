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
  cardSummary: {
    title: "Celery prefork event loop mismatch",
    problem: "Celery prefork worker에서 asyncio.run()을 반복 호출하자 이전 태스크가 QueuePool에 캐시한 커넥션이 닫힌 event loop에 묶여 'attached to a different loop' RuntimeError가 간헐적으로 발생하며 태스크 약 50%가 실패했습니다.",
    solution: "Celery worker 환경에서는 DB_NULL_POOL=true로 NullPool을 선택해 커넥션을 캐시하지 않도록 했습니다. API 서버는 QueuePool을 그대로 유지했습니다.",
    result: "태스크 실패율 ~50% → 0%.",
  },
};
