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
  cardSummary: {
    title: "at-least-once 중복 이벤트 ProcessedEvent 멱등성",
    problem:
      "RabbitMQ ack 전 프로세스가 종료되면 동일 이벤트가 재전달됩니다. 멱등성 처리 없이는 Pipeline.status 중복 갱신, AIReview 중복 INSERT로 Unique 제약 오류가 발생했습니다.",
    solution:
      "processed_events 테이블에 event_id를 unique 컬럼으로 두고, 이벤트 처리 시 ProcessedEvent INSERT를 먼저 실행합니다. IntegrityError 발생 시 중복 이벤트로 간주해 비즈니스 로직을 건너뛰고 ack를 반환합니다.",
    result:
      "동일 event_id 재도착 시 IntegrityError로 중복 실행을 차단하고 이벤트 손실 없이 ack 처리합니다. 비즈니스 로직 실패 시 ProcessedEvent도 함께 롤백되어 재처리 가능성이 유지됩니다.",
  },
};
