import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const openaiResponseDirectAccess: TechnicalNoteCard = {
  slug: "002-openai-response-direct-access",
  title: "OpenAI 응답 구조 직접 접근의 취약성과 방어 로직",
  summary:
    "response.output[0].content[0].text 직접 접근이 빈 응답에서 IndexError를 유발한 문제와 사용자 메시지 표준 출력 노출을 함께 수정한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/openai-response-access.svg"),
  date: "2025.01.20",
  readingTime: "5분 읽기",
  tags: [
    { name: "OpenAI SDK", category: "ai" },
    { name: "FastAPI", category: "backend" },
    { name: "Python", category: "language" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
};
