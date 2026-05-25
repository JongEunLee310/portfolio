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
  cardSummary: {
    title: "이벤트 스키마 필수 필드 추가 시 DLQ 메시지 소실",
    problem:
      "publisher(pipeline-execution-svc)를 먼저 배포하자 구버전 consumer(core-api)가 새 필수 필드 누락으로 ValidationError를 던지고 모든 실행 완료 이벤트가 DLQ로 소실됐습니다.",
    solution:
      "새 필드는 Optional[T] = None으로 먼저 추가합니다. consumer를 먼저 배포한 뒤 publisher를 배포하는 consumer-first 전략을 도입하고, 모든 이벤트 스키마에 extra='ignore' 설정으로 미래 필드를 무시합니다.",
    result:
      "배포 순서에 무관하게 하위 호환을 보장하고 DLQ 메시지 소실을 방지합니다. 스키마 변경 원칙을 수립해 이후 변경에도 동일 문제가 재발하지 않습니다.",
  },
};
