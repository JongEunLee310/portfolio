import type { TechnicalNoteCard } from "@/types/note";

export const springbootJwtSocialLogin: TechnicalNoteCard = {
  slug: "springboot-jwt-social-login",
  title: "Spring Boot JWT 기반 네이버 소셜 로그인 구현",
  summary:
    "네이버 OAuth를 통해 로그인하고 Spring Boot에서 JWT를 발급해 회원 인증을 처리하는 흐름 구현 기록입니다.",
  category: "security",
  thumbnail: "/images/notes/springboot-jwt-login.svg",
  date: "2022.10.15",
  readingTime: "8분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "JWT", category: "backend" },
    { name: "Java", category: "language" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
};
