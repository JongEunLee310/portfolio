import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const msaRabbitmqMigration: TechnicalNoteCard = {
  slug: "msa-rabbitmq-migration",
  title: "Monolith에서 MSA로: RabbitMQ와 DB 소유권 분리 전략",
  summary:
    "Kafka를 기각하고 RabbitMQ를 선택한 이유, Execution Service에 DB 소유권을 이전한 설계 결정, REST vs gRPC 비교 실험 설계를 기록합니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.22",
  readingTime: "12분 읽기",
  tags: [
    { name: "RabbitMQ", category: "messaging" },
    { name: "MSA", category: "infra" },
    { name: "FastAPI", category: "backend" },
    { name: "PostgreSQL", category: "database" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
