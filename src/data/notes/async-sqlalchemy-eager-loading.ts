import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const asyncSqlalchemyEagerLoading: TechnicalNoteCard = {
  slug: "async-sqlalchemy-eager-loading",
  title: "async SQLAlchemy에서 MissingGreenlet과 N+1 해결하기",
  summary:
    "async 환경에서 lazy loading에 접근하면 MissingGreenlet 에러가 발생합니다. joinedload, contains_eager, Explicit JOIN 세 가지 전략의 적용 기준을 정리합니다.",
  category: "troubleshooting",
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
  cardSummary: {
    title: "N+1 쿼리 및 MissingGreenlet",
    problem: "async SQLAlchemy에서 ORM 관계 속성에 접근하면 MissingGreenlet 에러가 발생하거나, Job 목록 조회 시 소유권 검증을 Pipeline → Project 순서로 별도 SELECT해 요청당 3회 쿼리가 실행됐습니다.",
    solution: "contains_eager로 목록 조회 JOIN을 재활용하고, find_by_id_and_owner처럼 소유권 확인과 데이터 조회를 단일 JOIN으로 통합했습니다.",
    result: "소유권 확인 + 데이터 조회 SELECT 3회를 1회로 줄이고 MissingGreenlet 에러를 제거했습니다.",
  },
};
