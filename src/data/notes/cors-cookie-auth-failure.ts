import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const corsCookieAuthFailure: TechnicalNoteCard = {
  slug: "cors-cookie-auth-failure",
  title: "CORS와 Cookie 인증 설정 불일치로 인한 로그인 유지 실패",
  summary:
    "로그인 API가 200을 반환하고 Set-Cookie가 내려와도 CORS와 Cookie 속성이 맞지 않으면 브라우저가 Cookie를 저장하지 않거나 요청에 포함하지 않습니다. 환경별 CORS origin, credentials, SameSite/Secure 조합을 함께 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.26",
  readingTime: "12분 읽기",
  tags: [
    { name: "CORS", category: "frontend" },
    { name: "Cookie", category: "frontend" },
    { name: "Spring Boot", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "CORS와 Cookie 인증 설정 불일치로 인한 로그인 유지 실패",
    problem:
      "로그인 API가 200을 반환하고 Set-Cookie 헤더가 있어도 CORS 설정 누락이나 Cookie 속성 불일치로 브라우저가 Cookie를 저장하지 않거나 이후 요청에 포함하지 않습니다. 서버는 성공으로 보이지만 사용자는 로그인이 유지되지 않습니다.",
    solution:
      "CORS allowedOrigins를 실제 프론트엔드 origin으로 명시하고 credentials를 허용했습니다. 프론트엔드 API client에 credentials 포함 설정을 추가하고 배포 환경에서는 SameSite=None; Secure 조합을 환경별로 분리했습니다.",
    result:
      "로그인 성공 후 Cookie가 저장되고 이후 인증 요청에 자동으로 포함됩니다. 서버의 로그인 성공 응답과 브라우저의 Cookie 보관 상태가 일치하게 됩니다.",
  },
};
