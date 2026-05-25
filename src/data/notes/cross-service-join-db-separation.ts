import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const crossServiceJoinDbSeparation: TechnicalNoteCard = {
  slug: "cross-service-join-db-separation",
  title: "DB 소유권 분리 후 cross-service JOIN으로 조회 실패",
  summary:
    "모놀리스 코드를 복사할 때 JOIN 안에 숨어있던 서비스 간 결합이 DB 물리 분리 시점에 드러났습니다. 소유권 검증 책임을 재배치해 해결한 과정을 기록합니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.22",
  readingTime: "9분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "SQLAlchemy", category: "backend" },
    { name: "PostgreSQL", category: "database" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  cardSummary: {
    title: "DB 소유권 분리 후 cross-service JOIN 502 오류",
    problem:
      "모놀리스 코드를 복사할 때 pipeline_runs 조회 쿼리가 pipelines·projects 테이블을 JOIN했는데, DB 물리 분리 후 해당 테이블이 pipeline_execution_db에 존재하지 않아 502 오류가 발생했습니다.",
    solution:
      "소유권 검증 책임을 core-api로 이전했습니다. core-api가 JWT 검증 후 호출한다는 사실 자체를 소유권 검증 완료 신호로 간주하고, pipeline-execution-svc는 pipeline_id로만 단순 조회하도록 JOIN을 제거했습니다.",
    result:
      "cross-service JOIN 제거로 502 해소, 서비스 경계 내 테이블만 참조하는 구조로 DB 소유권 원칙을 준수하게 됐습니다.",
  },
};
