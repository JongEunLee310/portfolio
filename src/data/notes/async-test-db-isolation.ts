import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const asyncTestDbIsolation: TechnicalNoteCard = {
  slug: "async-test-db-isolation",
  title: "비동기 통합 테스트 DB 격리: UUID 스키마 + 트랜잭션 롤백",
  summary:
    "통합 테스트 간 DB 상태가 섞여 비결정적 실패가 발생했습니다. UUID 스키마로 세션을 격리하고 트랜잭션 롤백으로 케이스를 격리한 과정입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.22",
  readingTime: "8분 읽기",
  tags: [
    { name: "SQLAlchemy", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "pytest", category: "tool" },
    { name: "AsyncIO", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
