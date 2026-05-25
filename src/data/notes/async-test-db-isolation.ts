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
  cardSummary: {
    title: "통합 테스트 DB 상태 오염",
    problem: "통합 테스트를 여러 개 실행하면 이전 테스트의 잔여 데이터가 다음 테스트에 영향을 줘 UNIQUE 제약 오류나 비결정적 실패가 발생했습니다.",
    solution: "test_engine fixture(session scope)에서 UUID 기반 PostgreSQL 스키마를 생성하고 search_path를 고정해 세션을 격리했습니다. db_session fixture(function scope)에서 트랜잭션을 시작하고 종료 시 롤백해 케이스를 격리했습니다.",
    result: "테스트 간 데이터 간섭 제거, CI 비결정적 실패 안정화.",
  },
};
