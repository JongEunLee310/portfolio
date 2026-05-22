import type { TechnicalNoteCard } from "@/types/note";

export const querydslProjectionOptimization: TechnicalNoteCard = {
  slug: "querydsl-projection-optimization",
  title: "QueryDSL Projection 활용으로 불필요한 조회 줄이기",
  summary:
    "엔티티 전체 조회 대신 필요한 필드만 조회해 메모리 사용량과 네트워크 비용을 줄인 사례입니다.",
  category: "database",
  thumbnail: "/images/notes/querydsl-projection.svg",
  date: "2025.07.17",
  readingTime: "6분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "QueryDSL", category: "backend" },
    { name: "JPA", category: "backend" },
    { name: "MySQL", category: "database" },
  ],
  relatedProjectSlugs: ["halo"],
};
