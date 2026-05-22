import type { TechnicalNoteCard } from "@/types/note";

export const rabbitmqEventTopology: TechnicalNoteCard = {
  slug: "rabbitmq-event-topology",
  title: "RabbitMQ 기반 이벤트 메시징 토폴로지 설계",
  summary:
    "서비스 간 결합도를 낮추고 안정적인 이벤트 전달을 위한 Exchange, Queue, DLQ 설계를 정리합니다.",
  category: "messaging",
  thumbnail: "/images/notes/rabbitmq-topology.svg",
  date: "2026.05.18",
  readingTime: "12분 읽기",
  tags: [
    { name: "RabbitMQ", category: "messaging" },
    { name: "MSA", category: "infra" },
    { name: "Event Driven", category: "messaging" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
