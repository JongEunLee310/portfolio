import type { TechnicalNoteDetail } from "@/types/note";
import { msaRabbitmqMigration } from "../notes/msa-rabbitmq-migration";

export const msaRabbitmqMigrationDetail: TechnicalNoteDetail = {
  ...msaRabbitmqMigration,
  template: "technical-summary",
  toc: [
    { id: "background", title: "전환 배경", depth: 1 },
    { id: "decisions", title: "핵심 결정", depth: 1 },
    { id: "rabbitmq", title: "RabbitMQ 설계", depth: 1 },
    { id: "rejected", title: "포기한 대안", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "background",
      title: "1. 전환 배경",
    },
    {
      type: "paragraph",
      content:
        "MVP Modular Monolith로 도메인 검증을 마쳤습니다. FastAPI BackgroundTasks(태스크 유실·retry 없음)와 Celery + Redis(메시지 내구성 미흡·코드 커플링 해소 불완전)를 실험했으나 독립 배포 가능한 서비스 경계에 이르지 못했습니다. PipelineExecution과 AI Review는 이미 Protocol 경계로 분리되어 있어 MSA 전환 대상으로 선정했습니다.",
    },
    {
      type: "heading",
      id: "decisions",
      title: "2. 핵심 결정",
    },
    {
      type: "cards",
      items: [
        {
          title: "RabbitMQ 브로커 채택",
          description:
            "durable exchange + durable queue + persistent message로 메시지 내구성을 보장합니다. Dead Letter Queue로 실패 태스크 재처리 경로를 명확히 합니다. Redis는 캐시 겸용 임시 브로커로 메시지 내구성 보장을 위한 별도 설정이 필요합니다.",
          badge: "RabbitMQ",
        },
        {
          title: "DB 소유권 Execution Service로 이전",
          description:
            "Core API가 DB를 소유하면 Execution Service는 실행 워커에 불과해 Celery + RabbitMQ와 개념적 차이가 없습니다. pipeline_runs, job_run_logs는 Execution Service의 도메인입니다. 서비스 간 참조는 물리적 FK 없이 UUID 논리 참조로 유지합니다.",
          badge: "DB 소유권",
        },
        {
          title: "REST vs gRPC 비교 실험",
          description:
            "ADR-012의 BackgroundTasks vs Celery 비교와 동일하게, gRPC를 바로 도입하지 않고 실제 수치로 결정합니다. proto 관리와 stub 생성의 추가 복잡도가 MSA 초기 단계에서 실질적인 문제가 되는지 측정이 목표입니다.",
          badge: "실험 설계",
        },
      ],
    },
    {
      type: "heading",
      id: "rabbitmq",
      title: "3. RabbitMQ 이벤트 설계",
    },
    {
      type: "list",
      items: [
        "Exchange: devops.events (topic 타입 — routing key 패턴 매칭으로 이벤트 추가 시 유연하게 대응)",
        "pipeline.execution.requested → pipeline-execution.request.queue → Pipeline Execution Service (파이프라인 실행 처리)",
        "pipeline.execution.finished → core.pipeline-result.queue → Core API Consumer (Pipeline.status 업데이트)",
        "ai_review.requested → ai-review.request.queue → AI Review Service (LLM 분석 요청)",
        "ai_review.completed → core.ai-review-result.queue → Core API Consumer (AIReview 저장)",
        "completed/failed를 하나의 finished 이벤트로 통합 — Core API 입장에서는 같은 상태 전이이며 payload의 status 필드로 분기",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "Consumer는 DB 반영 성공 후 manual ack합니다. 실패 시 nack/requeue 또는 DLQ로 라우팅해 메시지 유실 없이 재처리합니다.",
    },
    {
      type: "heading",
      id: "rejected",
      title: "4. 포기한 대안",
    },
    {
      type: "cards",
      items: [
        {
          title: "Kafka 기각",
          description:
            "대용량 트래픽 처리에 적합하지만 이 프로젝트 규모에서 처리량 이점이 필요하지 않습니다. Broker, Topic, Partition, Consumer Group, Offset 관리까지 운영 복잡도가 높아 서비스 개발과 운영 양쪽에 리스크가 됩니다.",
          badge: "과도한 복잡도",
        },
        {
          title: "Core API DB 소유 유지 기각",
          description:
            "Core API가 DB를 소유하면 Execution Service가 실행 워커에 불과해집니다. MSA의 핵심은 서비스가 자신의 데이터를 소유하는 것입니다.",
          badge: "서비스 경계 미확보",
        },
      ],
    },
  ],
  relatedNoteSlugs: ["rabbitmq-event-topology", "async-pipeline-transition"],
};
