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
  cardSummary: {
    title: "토큰 재발급 무한 요청",
    problem: "/api/reissue가 JWT 필터에서 만료 Access Token을 검사해 401 반환 → 클라이언트 재발급 반복",
    solution: "/api/reissue를 PUBLIC_URLS + JWT_FILTER_EXCLUDE_URLS 양쪽에 추가, 역할별 필터 체인에서 제거",
    result: "재발급 API가 JWT 검사 없이 ReissueService에 도달, 무한 루프 해소",
  },
};
