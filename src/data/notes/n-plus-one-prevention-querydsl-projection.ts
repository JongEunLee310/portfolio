import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const nPlusOnePreventionQuerydslProjection: TechnicalNoteCard = {
  slug: "n-plus-one-prevention-querydsl-projection",
  title: "N+1 문제가 발생하지 않은 이유 — QueryDSL 필드 프로젝션 역추적",
  summary:
    "복잡한 연관 관계를 가진 예약 목록 조회에서 N+1이 발생하지 않은 원인을 역추적해, QueryDSL Projections.fields()로 영속성 컨텍스트 없이 단일 쿼리로 매핑하는 패턴이 처음부터 적용됐음을 확인한 기록입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/querydsl-projection.svg"),
  date: "2025.05.25",
  readingTime: "7분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "QueryDSL", category: "backend" },
    { name: "JPA", category: "backend" },
    { name: "MySQL", category: "database" },
  ],
  relatedProjectSlugs: ["halo"],
};
