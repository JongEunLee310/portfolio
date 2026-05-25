import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const rabbitmqEventTopology: TechnicalNoteCard = {
  slug: "rabbitmq-event-topology",
  title: "RabbitMQ 기반 이벤트 메시징 토폴로지 설계",
  summary:
    "서비스 간 결합도를 낮추고 안정적인 이벤트 전달을 위한 Exchange, Queue, DLQ 설계를 정리합니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.18",
  readingTime: "12분 읽기",
  tags: [
    { name: "RabbitMQ", category: "messaging" },
    { name: "MSA", category: "infra" },
    { name: "Event Driven", category: "messaging" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  cardSummary: {
    title: "RabbitMQ FieldTable 타입 불일치",
    problem: "aio-pika queue 선언 시 arguments 딕셔너리의 값 타입이 FieldTable 명세와 불일치해 런타임 오류가 발생했습니다.",
    solution: "x-dead-letter-exchange 등 DLQ 관련 arguments를 명시적 타입으로 캐스팅했습니다.",
    result: "consumer/publisher 정상 선언 및 DLQ 연동을 완료했습니다.",
  },
};
