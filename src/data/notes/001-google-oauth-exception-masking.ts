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
};
