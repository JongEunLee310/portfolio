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
  cardSummary: {
    title: "QueryDSL Info 중간 계층 — Repository가 RspDTO를 알지 못하게",
    problem: "QueryDSL Projections.fields() 매핑 대상을 어디에 둘지 결정 필요. Repository가 RspDTO를 직접 반환하면 HTTP 응답 형식이 영속성 계층에 스며들고, 엔티티를 반환하면 연관 필드 접근 시 N+1이 트리거됨",
    solution: "Repository → Info(service/info/ 패키지) → Service → RspDTO.fromInfo() 3계층 분리. Info는 Projections.fields() 매핑 전용 컨테이너(Jackson 어노테이션 없음). 변환 책임은 RspDTO 정적 팩토리 fromInfo()에 고정",
    result: "Repository가 RspDTO를 import하지 않아 계층 경계 유지. RspDTO 변경 시 Service와 RspDTO만 수정. 전 모듈 목록 조회 API에 동일 패턴 적용",
  },
};
