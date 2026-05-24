import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const querydslInfoLayerDataFlow: TechnicalNoteCard = {
  slug: "querydsl-info-layer-data-flow",
  title: "QueryDSL Info 중간 계층 — Repository가 RspDTO를 알지 못하게",
  summary:
    "QueryDSL Projections.fields() 결과를 담을 클래스를 어디에 둘지 결정하는 과정에서, Repository → Info → Service → RspDTO 3계층 분리를 채택해 영속성 계층이 API 응답 형식을 알지 못하도록 경계를 고정한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/querydsl-projection.svg"),
  date: "2025.06.15",
  readingTime: "6분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "QueryDSL", category: "backend" },
    { name: "JPA", category: "backend" },
  ],
  relatedProjectSlugs: ["halo"],
};
