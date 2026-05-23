import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const metricCardinalityTroubleshooting: TechnicalNoteCard = {
  slug: "metric-cardinality-troubleshooting",
  title: "Prometheus 메트릭 고카디널리티 줄이기",
  summary:
    "실행 ID와 사용자 식별자를 metric label에서 제거하고 로그/DB 조회로 상세 추적을 분리한 과정입니다.",
  category: "observability",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.20",
  readingTime: "8분 읽기",
  tags: [
    { name: "Prometheus", category: "observability" },
    { name: "Grafana", category: "observability" },
    { name: "Metrics", category: "tool" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
