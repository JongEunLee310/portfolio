import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const googleOauthExceptionMasking: TechnicalNoteCard = {
  slug: "001-google-oauth-exception-masking",
  title: "Google OAuth 예외 재래핑 문제와 HTTPException 처리 순서",
  summary:
    "except Exception이 FastAPI HTTPException을 재래핑해 오류 유형이 뭉개지는 문제를 분석하고, 예외 처리 순서를 재배치해 해결한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/google-oauth-exception.svg"),
  date: "2025.01.15",
  readingTime: "5분 읽기",
  tags: [
    { name: "FastAPI", category: "backend" },
    { name: "Python", category: "language" },
    { name: "httpx", category: "backend" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
  cardSummary: {
    title: "Google OAuth 예외 재래핑",
    problem: "except Exception이 내부에서 raise한 HTTPException까지 잡아 원래 오류 메시지가 변형됨. 네트워크 오류·인증 오류·내부 오류가 모두 400으로 묶임.",
    solution: "except HTTPException: raise를 가장 먼저 배치해 재래핑 차단. httpx 예외를 HTTPStatusError·TimeoutException·RequestError로 분리.",
    result: "오류 유형별 상태 코드(400/502/503/504) 분리. 클라이언트가 재시도 여부를 판단할 수 있는 명확한 응답 반환.",
  },
};
