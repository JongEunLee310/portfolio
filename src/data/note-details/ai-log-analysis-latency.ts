import type { TechnicalNoteDetail } from "@/types/note";
import { aiLogAnalysisLatency } from "../notes/ai-log-analysis-latency";

export const aiLogAnalysisLatencyDetail: TechnicalNoteDetail = {
  ...aiLogAnalysisLatency,
  template: "troubleshooting",
  toc: [
    { id: "problem", title: "추론 지연 원인", depth: 1 },
    { id: "preprocess", title: "전처리 전략", depth: 1 },
    { id: "lesson", title: "배운 점", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "problem",
      title: "1. 추론 지연 원인",
    },
    {
      type: "paragraph",
      content:
        "실패 로그 전체를 그대로 AI 분석 입력으로 전달하면 토큰 수가 증가하고, 원인 후보를 추출하기까지 시간이 길어졌습니다.",
    },
    {
      type: "heading",
      id: "preprocess",
      title: "2. 전처리 전략",
    },
    {
      type: "list",
      items: [
        "Job 단계별 로그를 먼저 요약했습니다.",
        "에러 레벨과 stack trace 주변 로그만 추출했습니다.",
        "반복되는 로그 라인은 fingerprint 기준으로 묶었습니다.",
      ],
    },
    {
      type: "heading",
      id: "lesson",
      title: "3. 배운 점",
    },
    {
      type: "paragraph",
      content:
        "AI 기능은 모델 호출 이전에 어떤 맥락을 남기고 어떤 노이즈를 제거할지 정하는 과정이 품질과 비용을 크게 좌우합니다.",
    },
  ],
  relatedNoteSlugs: ["async-pipeline-transition"],
};
