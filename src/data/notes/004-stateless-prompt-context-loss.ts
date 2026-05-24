import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const statelessPromptContextLoss: TechnicalNoteCard = {
  slug: "004-stateless-prompt-context-loss",
  title: "Stateless 프롬프트에서 대화 맥락이 사라지는 문제",
  summary:
    "매 요청마다 독립적으로 GPT-4o를 호출할 때 이전 대화 맥락이 유지되지 않는 한계와 이를 수용한 설계 결정을 정리한 기록입니다.",
  category: "concept",
  thumbnail: publicPath("/images/notes/stateless-prompt-context.svg"),
  date: "2025.01.25",
  readingTime: "5분 읽기",
  tags: [
    { name: "GPT-4o", category: "ai" },
    { name: "FastAPI", category: "backend" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
};
