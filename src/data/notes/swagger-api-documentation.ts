import type { TechnicalNoteCard } from "@/types/note";

export const swaggerApiDocumentation: TechnicalNoteCard = {
  slug: "swagger-api-documentation",
  title: "Swagger UI로 Spring Boot API 문서 자동화",
  summary:
    "Spring Boot 프로젝트에 Swagger UI를 적용해 문제풀이, 게시판, 회원 API 규격을 자동으로 문서화한 기록입니다.",
  category: "architecture",
  thumbnail: "/images/notes/swagger-api-docs.svg",
  date: "2022.10.18",
  readingTime: "6분 읽기",
  tags: [
    { name: "Swagger UI", category: "tool" },
    { name: "Spring Boot", category: "backend" },
    { name: "Java", category: "language" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
