import type { TechnicalNoteCard } from "@/types/note";

export const socialIdUniqueConstraintMismatch: TechnicalNoteCard = {
  slug: "005-social-id-unique-constraint-mismatch",
  title: "social_id 단독 unique 제약과 복합 조회 조건의 불일치",
  summary:
    "DB 제약은 social_id 단독 unique, 핸들러는 복합 조건으로 조회해 설계 의도가 모델에 반영되지 않은 문제를 Alembic 마이그레이션으로 해결한 기록입니다.",
  category: "database",
  thumbnail: "/images/notes/social-id-unique-constraint.svg",
  date: "2025.01.18",
  readingTime: "6분 읽기",
  tags: [
    { name: "SQLAlchemy", category: "backend" },
    { name: "Alembic", category: "backend" },
    { name: "PostgreSQL", category: "database" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
};
