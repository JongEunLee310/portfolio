import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const asyncSessionJoinOptimization: TechnicalNoteCard = {
  slug: "async-session-join-optimization",
  title: "AsyncSession에서 asyncio.gather가 실패하는 이유와 JOIN 해결",
  summary:
    "SQLAlchemy AsyncSession은 단일 커넥션을 사용해 asyncio.gather로 동시 쿼리 시 세션 상태 머신이 충돌합니다. JOIN으로 round-trip을 줄여 해결한 기록입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.22",
  readingTime: "10분 읽기",
  tags: [
    { name: "SQLAlchemy", category: "backend" },
    { name: "AsyncIO", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "FastAPI", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
