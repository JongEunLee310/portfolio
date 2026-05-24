import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const distributedTracingCorrelationId: TechnicalNoteCard = {
  slug: "distributed-tracing-correlation-id",
  title: "MSA 서비스 간 요청 추적 — Correlation ID 전파 누락",
  summary:
    "서비스가 분리되면 요청 맥락도 함께 끊깁니다. HTTP 헤더와 이벤트 payload에 Correlation ID를 전파해 분산 트레이싱 기반을 만든 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.22",
  readingTime: "10분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "RabbitMQ", category: "messaging" },
    { name: "FastAPI", category: "backend" },
    { name: "Observability", category: "observability" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
