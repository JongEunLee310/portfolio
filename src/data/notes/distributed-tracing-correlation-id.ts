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
  cardSummary: {
    title: "MSA 서비스 간 Correlation ID 전파 누락",
    problem:
      "서비스가 core-api·pipeline-execution-svc·ai-review-svc로 분리된 뒤, HTTP 헤더와 이벤트 payload에 correlation_id가 없어 장애 시 서비스 간 로그를 수작업으로 시간대 비교해야 했습니다.",
    solution:
      "core-api 진입 시 X-Correlation-ID 헤더를 생성하거나 수신합니다. HTTP 위임 클라이언트는 헤더를 전파하고, 이벤트 payload에 correlation_id 필드를 추가합니다. 각 서비스는 수신한 값을 contextvars에 주입해 이후 모든 로그에 자동 포함시킵니다.",
    result:
      "correlation_id 단일 필터로 여러 서비스의 관련 로그를 묶어 조회할 수 있게 됐습니다. 분산 트레이싱 기반을 수동으로 구현했습니다.",
  },
};
