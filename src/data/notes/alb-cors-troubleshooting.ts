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
};
