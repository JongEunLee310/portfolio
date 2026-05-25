import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const albCorsTroubleshooting: TechnicalNoteCard = {
  slug: "alb-cors-troubleshooting",
  title: "ALB + CORS 설정 트러블슈팅 기록",
  summary:
    "Cloudflare, ALB, Spring Boot 환경에서 발생한 CORS/OPTIONS 502 문제를 추적한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/alb-cors.svg"),
  date: "2025.06.29",
  readingTime: "9분 읽기",
  tags: [
    { name: "AWS", category: "infra" },
    { name: "ALB", category: "infra" },
    { name: "CORS", category: "backend" },
    { name: "Spring Boot", category: "backend" },
  ],
  relatedProjectSlugs: ["halo"],
  cardSummary: {
    title: "ALB 직접 연결 구조에서 CORS Preflight 실패 분석",
    problem: "nginx 없이 ALB → Spring Boot 직접 연결 구조에서 OPTIONS Preflight 요청이 Spring Security 필터체인과 상호작용하는 방식 미검증. ALB 또는 Cloudflare가 CORS 헤더를 중복 추가하면 브라우저가 헤더 두 개를 받아 오류 처리",
    solution: "Spring Security가 CORS 단일 처리 지점임을 확인. corsConfigurationSource()로 5개 origin 명시, allowedMethods 와일드카드로 OPTIONS 포함. JwtFilter는 Authorization 헤더 없는 OPTIONS를 filterChain.doFilter()로 통과시켜 CorsFilter가 먼저 단락 처리",
    result: "Preflight가 인증 체인 진입 없이 CorsFilter에서 200 반환되는 구조 검증. 역할별 FilterChain exceptionHandling 누락과 allowedOrigins 하드코딩 두 가지 구조적 개선 포인트 식별",
  },
};
