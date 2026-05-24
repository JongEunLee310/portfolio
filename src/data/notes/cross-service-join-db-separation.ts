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
};
