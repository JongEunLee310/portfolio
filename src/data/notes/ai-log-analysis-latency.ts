import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const aiLogAnalysisLatency: TechnicalNoteCard = {
  slug: "ai-log-analysis-latency",
  title: "AI 로그 분석 지연을 줄이기 위한 전처리 전략",
  summary:
    "실패 로그 전체를 바로 추론하지 않고 단계별 요약과 에러 패턴 추출을 거쳐 분석 시간을 줄인 기록입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.19",
  readingTime: "7분 읽기",
  tags: [
    { name: "OpenAI API", category: "ai" },
    { name: "Log Analysis", category: "observability" },
    { name: "FastAPI", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
