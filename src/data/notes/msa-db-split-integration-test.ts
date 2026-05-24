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
};
