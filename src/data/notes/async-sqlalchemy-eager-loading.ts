import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const asyncSqlalchemyEagerLoading: TechnicalNoteCard = {
  slug: "async-sqlalchemy-eager-loading",
  title: "async SQLAlchemy에서 MissingGreenlet과 N+1 해결하기",
  summary:
    "async 환경에서 lazy loading에 접근하면 MissingGreenlet 에러가 발생합니다. joinedload, contains_eager, Explicit JOIN 세 가지 전략의 적용 기준을 정리합니다.",
  category: "database",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.22",
  readingTime: "10분 읽기",
  tags: [
    { name: "SQLAlchemy", category: "backend" },
    { name: "AsyncIO", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "ORM", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
