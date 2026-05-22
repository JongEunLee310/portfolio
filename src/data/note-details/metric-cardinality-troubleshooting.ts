import type { TechnicalNoteDetail } from "@/types/note";
import { metricCardinalityTroubleshooting } from "../notes/metric-cardinality-troubleshooting";

export const metricCardinalityTroubleshootingDetail: TechnicalNoteDetail = {
  ...metricCardinalityTroubleshooting,
  template: "troubleshooting",
  toc: [
    { id: "problem", title: "고카디널리티 문제", depth: 1 },
    { id: "solution", title: "라벨 기준 재설계", depth: 1 },
    { id: "result", title: "운영 결과", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "problem",
      title: "1. 고카디널리티 문제",
    },
    {
      type: "paragraph",
      content:
        "PipelineRun ID처럼 매번 달라지는 값을 Prometheus label에 포함하면서 시계열 수가 빠르게 증가했습니다.",
    },
    {
      type: "heading",
      id: "solution",
      title: "2. 라벨 기준 재설계",
    },
    {
      type: "list",
      items: [
        "metric label은 service, status, step처럼 반복 가능한 값으로 제한했습니다.",
        "실행 단위 상세 추적은 로그와 DB 조회로 분리했습니다.",
        "대시보드는 집계 지표 중심으로 재구성했습니다.",
      ],
    },
    {
      type: "heading",
      id: "result",
      title: "3. 운영 결과",
    },
    {
      type: "callout",
      variant: "success",
      content:
        "관측 비용을 줄이면서도 장애 탐지에 필요한 핵심 지표는 유지할 수 있었습니다.",
    },
  ],
  relatedNoteSlugs: ["db-round-trip-optimization"],
};
