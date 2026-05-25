import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const socialIdUniqueConstraintMismatch: TechnicalNoteCard = {
  slug: "005-social-id-unique-constraint-mismatch",
  title: "social_id 단독 unique 제약과 복합 조회 조건의 불일치",
  summary:
    "DB 제약은 social_id 단독 unique, 핸들러는 복합 조건으로 조회해 설계 의도가 모델에 반영되지 않은 문제를 Alembic 마이그레이션으로 해결한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/social-id-unique-constraint.svg"),
  date: "2025.01.18",
  readingTime: "6분 읽기",
  tags: [
    { name: "SQLAlchemy", category: "backend" },
    { name: "Alembic", category: "backend" },
    { name: "PostgreSQL", category: "database" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
  cardSummary: {
    title: "social_id 단독 unique 제약 불일치",
    problem: "DB는 social_id 단독 unique, 핸들러는 social_id + social_provider 복합 조건으로 조회. ADR 설계 의도가 모델과 마이그레이션에 반영되지 않음.",
    solution: "UniqueConstraint('social_id', 'social_provider')로 교체. Alembic 마이그레이션 순서(인덱스 제거 → 복합 제약 생성)대로 수정.",
    result: "DB 제약과 애플리케이션 조회 로직 정합성 확보. 다중 OAuth 제공자 추가 시 같은 social_id 값 충돌 방지.",
  },
};
