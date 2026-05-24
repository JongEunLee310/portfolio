import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const consumerIdempotencyProcessedEvent: TechnicalNoteCard = {
  slug: "consumer-idempotency-processed-event",
  title: "Consumer 멱등성 — at-least-once 중복 이벤트 ProcessedEvent 패턴",
  summary:
    "RabbitMQ는 at-least-once 전달을 보장합니다. ack 전 프로세스가 죽으면 같은 메시지가 재전달됩니다. IntegrityError로 중복을 차단하는 ProcessedEvent 패턴을 기록합니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.22",
  readingTime: "10분 읽기",
  tags: [
    { name: "RabbitMQ", category: "messaging" },
    { name: "MSA", category: "infra" },
    { name: "FastAPI", category: "backend" },
    { name: "PostgreSQL", category: "database" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
