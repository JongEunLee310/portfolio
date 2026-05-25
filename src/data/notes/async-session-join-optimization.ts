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
  cardSummary: {
    title: "asyncio.gather + AsyncSession 충돌",
    problem: "GET /projects 등 여러 엔드포인트에서 독립적인 두 쿼리를 asyncio.gather로 동시 실행하자 'Method close() can't be called here' 에러가 발생하며 500이 반환됐습니다.",
    solution: "AsyncSession은 단일 커넥션을 사용해 동시 접근이 불가합니다. 병렬화 대신 COUNT를 스칼라 서브쿼리로 내장하고 소유권 검증을 JOIN으로 통합해 round-trip 자체를 줄였습니다.",
    result: "GET /projects 923ms → 642ms, POST /pipelines/{id}/jobs 1901ms → 1386ms.",
  },
};
