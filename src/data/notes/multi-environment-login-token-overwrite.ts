import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const multiEnvironmentLoginTokenOverwrite: TechnicalNoteCard = {
  slug: "multi-environment-login-token-overwrite",
  title: "다중 환경 로그인 시 토큰 덮임 문제 — cookie 단위 저장 정책의 한계",
  summary:
    "같은 브라우저에서 고객·매니저·관리자 환경으로 순차 로그인 시 단일 refresh cookie가 덮이면서 이전 환경의 인증 상태가 풀리는 문제를 분석하고, 권한별 secure cookie 분리 방향을 도출한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/springboot-jwt-login.svg"),
  date: "2025.06.20",
  readingTime: "7분 읽기",
  tags: [
    { name: "Spring Security", category: "backend" },
    { name: "Spring Boot", category: "backend" },
    { name: "JWT", category: "backend" },
  ],
  relatedProjectSlugs: ["halo"],
};
