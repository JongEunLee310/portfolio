import type { TechnicalNoteCard } from "@/types/note";

export const llmResponseFormatNotEnforced: TechnicalNoteCard = {
  slug: "006-llm-response-format-not-enforced",
  title: "LLM 응답 형식 미강제로 인한 파싱 불안정성",
  summary:
    "시스템 프롬프트만으로는 GPT-4o 응답 형식이 보장되지 않아 공감 이외의 응답이 섞이는 문제와 프롬프트 강화로 완화한 기록입니다.",
  category: "troubleshooting",
  thumbnail: "/images/notes/llm-response-format.svg",
  date: "2025.01.22",
  readingTime: "5분 읽기",
  tags: [
    { name: "GPT-4o", category: "ai" },
    { name: "OpenAI SDK", category: "ai" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
};
