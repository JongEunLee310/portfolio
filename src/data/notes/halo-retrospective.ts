import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const haloRetrospective: TechnicalNoteCard = {
  slug: "halo-retrospective",
  title: "HALO 프로젝트 회고 — 인증·조회 최적화·멀티모듈 전환 전체 과정",
  summary:
    "Spring Boot 멀티모듈 청소 서비스 매칭 플랫폼을 팀으로 개발하며 JWT 인증 구조 설계, QueryDSL 조회 최적화, 통계 동시성 처리, common 단일 모듈에서 8개 도메인 모듈로 전환한 3 Phase 과정을 기록한 회고입니다.",
  category: "retrospective",
  thumbnail: publicPath("/images/notes/stateless-prompt-context.svg"),
  date: "2025.07.20",
  readingTime: "10분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Spring Security", category: "backend" },
    { name: "JWT", category: "backend" },
    { name: "QueryDSL", category: "backend" },
    { name: "Gradle", category: "tool" },
    { name: "MySQL", category: "database" },
  ],
  relatedProjectSlugs: ["halo"],
};
