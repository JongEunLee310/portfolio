import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const refreshTokenReissueLoop: TechnicalNoteCard = {
  slug: "refresh-token-reissue-loop",
  title: "Access Token 만료 후 재발급 실패 시 무한 요청 문제",
  summary:
    "모든 401 응답에 대해 재발급을 시도하면 재발급 API 자체가 401을 반환할 때 무한 요청이 발생합니다. 재발급 API 예외 처리와 요청별 retry flag로 종료 조건을 명확히 해 인증 실패 흐름을 안정화한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.26",
  readingTime: "11분 읽기",
  tags: [
    { name: "Auth", category: "backend" },
    { name: "Token Reissue", category: "backend" },
    { name: "Interceptor", category: "frontend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "Access Token 만료 후 재발급 실패 시 무한 요청 문제",
    problem:
      "클라이언트 interceptor가 모든 401 응답에 대해 재발급을 시도하면, 재발급 API 자체가 401을 반환할 때 다시 재발급을 호출하는 무한 루프가 발생합니다. 브라우저와 서버에 불필요한 요청이 계속 쌓입니다.",
    solution:
      "재발급 API URL을 interceptor 재시도 대상에서 제외하고, 원래 요청 객체에 retry flag를 추가해 요청당 재시도를 1회로 제한했습니다. 재발급 실패 시 토큰을 제거하고 로그인 화면으로 이동하는 종료 조건을 명확히 설정했습니다.",
    result:
      "재발급 실패 시 무한 요청이 차단됩니다. Access Token 만료는 재발급으로 복구하고, Refresh Token 만료는 세션 종료로 처리하는 명확한 인증 실패 흐름이 완성됩니다.",
  },
};
