import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const msaDbSplitIntegrationTest: TechnicalNoteCard = {
  slug: "msa-db-split-integration-test",
  title: "MSA DB 소유권 분리 후 통합 테스트 ORM 직접 삽입 불가",
  summary:
    "DB 소유권 분리로 pipeline_runs 테이블이 core-api DB에서 사라지자 기존 통합 테스트 픽스처가 전부 깨졌습니다. 인-메모리 스토어와 클라이언트 fake로 서비스 경계를 준수한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.22",
  readingTime: "9분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "SQLAlchemy", category: "backend" },
    { name: "pytest", category: "tool" },
    { name: "PostgreSQL", category: "database" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  cardSummary: {
    title: "DB 소유권 분리 후 ORM 직접 삽입 픽스처 전면 붕괴",
    problem:
      "core-api Alembic 마이그레이션으로 pipeline_runs·job_run_logs 테이블을 DROP하자, 통합 테스트 픽스처가 SQLAlchemy ORM으로 직접 삽입하던 코드 전부가 ProgrammingError로 실패했습니다.",
    solution:
      "DB 직접 삽입 대신 인-메모리 스토어를 도입했습니다. HTTP 위임 클라이언트 fake가 스토어를 공유해 서비스 경계를 준수한 채로 픽스처를 생성합니다.",
    result:
      "테스트 130개 통과, DB 소유권 이동에 무관한 견고한 픽스처 구조를 확립했습니다. 서비스 경계를 강제하는 테스트 설계 패턴을 수립했습니다.",
  },
};
