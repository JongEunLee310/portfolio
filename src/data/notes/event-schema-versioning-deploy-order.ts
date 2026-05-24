import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const eventSchemaVersioningDeployOrder: TechnicalNoteCard = {
  slug: "event-schema-versioning-deploy-order",
  title: "이벤트 스키마 변경과 배포 순서 의존성",
  summary:
    "publisher만 먼저 배포하면 구버전 consumer가 필수 필드 누락으로 ValidationError를 던지고 메시지가 DLQ로 빠집니다. 하위 호환 원칙과 consumer-first 배포 전략을 정리합니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.22",
  readingTime: "10분 읽기",
  tags: [
    { name: "RabbitMQ", category: "messaging" },
    { name: "MSA", category: "infra" },
    { name: "Pydantic", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
