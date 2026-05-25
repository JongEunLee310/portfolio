import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const metricCardinalityTroubleshooting: TechnicalNoteCard = {
  slug: "metric-cardinality-troubleshooting",
  title: "Prometheus 메트릭 고카디널리티 줄이기",
  summary:
    "실행 ID와 사용자 식별자를 metric label에서 제거하고 로그/DB 조회로 상세 추적을 분리한 과정입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.20",
  readingTime: "8분 읽기",
  tags: [
    { name: "Prometheus", category: "observability" },
    { name: "Grafana", category: "observability" },
    { name: "Metrics", category: "tool" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  cardSummary: {
    title: "Prometheus 고카디널리티 레이블 제거",
    problem:
      "실행 ID와 사용자 식별자를 metric label에 포함하면 label 조합이 요청마다 달라져 Prometheus 메모리 사용량이 선형 증가하고, 집계 쿼리 성능이 저하됩니다.",
    solution:
      "handler·method·status 같은 저카디널리티 레이블만 metric에 유지합니다. 실행 ID·사용자 식별자는 구조화 로그와 DB 조회로 상세 추적을 분리했습니다.",
    result:
      "메트릭 시계열 수가 고정되어 Prometheus 메모리가 안정화됩니다. 레이블 설계 원칙을 수립해 이후 메트릭 추가 시에도 고카디널리티 문제가 재발하지 않습니다.",
  },
};
