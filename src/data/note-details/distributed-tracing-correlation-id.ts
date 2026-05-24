import type { TechnicalNoteDetail } from "@/types/note";
import { distributedTracingCorrelationId } from "../notes/distributed-tracing-correlation-id";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const distributedTracingCorrelationIdDetail: TechnicalNoteDetail = {
  ...distributedTracingCorrelationId,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "MSA Phase 2에서 서비스가 분리된 뒤, 파이프라인 실행 하나가 core-api → RabbitMQ → pipeline-execution-svc → ai-review-svc를 경유했습니다. 장애 발생 시 각 서비스 로그가 독립된 타임스탬프로 남아, 어떤 요청이 어떤 순서로 흘렀는지 재구성하기 어려웠습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "모놀리스에서는 하나의 프로세스가 요청의 시작부터 끝까지 책임지므로 추적 맥락이 자연스럽게 유지됩니다. MSA에서는 서비스 경계가 곧 추적 맥락의 단절점입니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "이벤트 경로: RabbitMQ 메시지 payload에 correlation_id 필드가 없어 consumer가 로깅 컨텍스트에 주입하지 못했습니다.",
        "HTTP 경로: PipelineExecutionReadClient 호출 시 X-Correlation-ID 헤더를 전달하지 않았습니다.",
        "각 서비스에 수신 헤더를 읽어 로깅 컨텍스트에 바인딩하는 미들웨어가 없었습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "RequestContextMiddleware",
          description:
            "요청 진입 시 X-Correlation-ID 헤더를 읽거나 없으면 새로 생성해 contextvars에 저장합니다. 이후 모든 structlog 출력에 correlation_id가 자동으로 포함됩니다.",
          badge: "FastAPI",
        },
        {
          title: "HTTP 헤더 전파",
          description:
            "PipelineExecutionReadClient와 AIReviewClient가 HTTP 요청 시 get_correlation_id()로 현재 컨텍스트 값을 읽어 X-Correlation-ID 헤더에 실어 보냅니다.",
          badge: "HTTP",
        },
        {
          title: "이벤트 payload 포함",
          description:
            "devops_messaging 이벤트 스키마에 correlation_id: str | None = None 필드를 추가합니다. publisher는 현재 컨텍스트 값을 채우고, consumer는 수신 즉시 contextvars에 주입합니다.",
          badge: "RabbitMQ",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "correlation_id는 나중에 추가하기 어렵습니다. 이벤트 스키마와 HTTP 클라이언트 설계 초기에 포함해야 하며, 나중에 추가하면 기존 consumer와의 하위 호환 문제가 함께 발생합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "서비스 간 요청 추적",
          before: "불가 (수작업 시간 비교)",
          after: "correlation_id로 로그 필터링",
          change: "가능",
        },
        {
          label: "이벤트 payload",
          before: "correlation_id 없음",
          after: "correlation_id 필드 포함",
          change: "추가",
        },
        {
          label: "HTTP 위임 헤더",
          before: "미전달",
          after: "X-Correlation-ID 자동 전파",
          change: "추가",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "curl -H 'X-Correlation-ID: test-123'로 요청하면 core-api, pipeline-execution-svc, ai-review-svc 로그 모두에 correlation_id=test-123이 포함됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "MSA에서 서비스 경계는 곧 추적 맥락의 단절점입니다. 네트워크를 건너는 모든 호출에 식별자를 명시적으로 실어야 합니다.",
        "correlation_id는 이벤트 스키마와 HTTP 클라이언트 설계 초기에 포함해야 합니다. 나중에 추가하면 스키마 버전 관리 문제가 함께 발생합니다.",
        "Python 3.7+ contextvars는 FastAPI 비동기 핸들러에서 안전하게 사용할 수 있는 요청 로컬 저장소입니다.",
        "OpenTelemetry SDK를 도입하면 HTTP 클라이언트와 미들웨어가 자동으로 트레이싱 컨텍스트를 전파합니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "msa-rabbitmq-migration",
    "event-schema-versioning-deploy-order",
    "rabbitmq-event-topology",
  ],
};
