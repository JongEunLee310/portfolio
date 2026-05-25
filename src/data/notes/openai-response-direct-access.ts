import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const openaiResponseDirectAccess: TechnicalNoteCard = {
  slug: "openai-response-direct-access",
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
  cardSummary: {
    title: "OpenAI 응답 구조 직접 접근 취약성",
    problem: "response.output[0].content[0].text 직접 접근 시 빈 응답에서 IndexError 발생. 개발 중 추가한 print(user_message)가 사용자 상담 내용을 표준 출력에 노출.",
    solution: "응답 텍스트 추출 함수 분리 및 빈 응답 방어 로직 추가. print() 2개 제거. 오류 원인별 상태 코드 분기.",
    result: "빈 응답 → 503 반환으로 명확화. 사용자 메시지 표준 출력 노출 제거. API 오류·파싱 오류 구분 가능.",
  },
};
