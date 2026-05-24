import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const reissueInfiniteRequest: TechnicalNoteCard = {
  slug: "reissue-infinite-request",
  title: "토큰 재발급 API 무한 요청 — permitAll과 JWT 필터 제외의 차이",
  summary:
    "Access Token 만료 시 /api/reissue가 JWT 필터에서 401을 반환해 클라이언트가 재발급을 무한 반복하는 문제를 추적하고, 재발급 API를 공통 public URL과 JWT 필터 제외 목록에 모두 등록해 해결한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/springboot-jwt-login.svg"),
  date: "2025.05.22",
  readingTime: "7분 읽기",
  tags: [
    { name: "Spring Security", category: "backend" },
    { name: "Spring Boot", category: "backend" },
    { name: "JWT", category: "backend" },
  ],
  relatedProjectSlugs: ["halo"],
};
