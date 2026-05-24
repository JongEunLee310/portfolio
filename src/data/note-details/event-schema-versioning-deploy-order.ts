import type { TechnicalNoteDetail } from "@/types/note";
import { eventSchemaVersioningDeployOrder } from "../notes/event-schema-versioning-deploy-order";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const eventSchemaVersioningDeployOrderDetail: TechnicalNoteDetail = {
  ...eventSchemaVersioningDeployOrder,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "devops_messaging 공유 패키지의 PipelineExecutionFinishedEvent에 필수 필드를 추가하고 pipeline-execution-svc(publisher)만 먼저 배포했습니다. 구버전 core-api consumer가 ValidationError를 던지고 메시지를 DLQ로 보내 실행 완료 이벤트가 소실됐습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이벤트 스키마는 HTTP API와 달리 버전 번호를 URL에 박지 않습니다. 대신 필드 자체가 하위 호환의 단위가 됩니다. '필수 필드는 추가하지 말 것'이라는 단순한 원칙 하나로 대부분의 배포 순서 문제를 예방할 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "필수 필드 추가는 가장 위험한 스키마 변경입니다. 신버전 publisher가 보내는 메시지를 구버전 consumer가 파싱할 때 'Field required' 오류가 발생합니다.",
        "ConsumerMessageError로 감싸면 DLQ로 라우팅되어 메시지가 소실됩니다.",
        "BaseEventPayload에 extra='forbid'가 설정되면 하위 클래스 전체가 영향을 받아 선택적 필드 추가도 위험해집니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "Optional 필드로 추가",
          description:
            "필드를 Optional[T] = None으로 추가합니다. 모든 서비스 배포가 완료된 후 필수로 전환합니다. 필드 제거 시에는 consumer에서 사용 제거 후 배포 → publisher에서 제거 순서를 따릅니다.",
          badge: "Pydantic",
        },
        {
          title: "consumer-first 배포",
          description:
            "consumer 서비스를 먼저 신버전으로 배포합니다. 구버전 메시지도 처리할 수 있도록 Optional 필드로 받습니다. 이후 publisher를 배포합니다.",
          badge: "배포 순서",
        },
        {
          title: "extra='ignore' 기본값",
          description:
            "BaseEventPayload에 model_config = ConfigDict(extra='ignore')를 설정합니다. 알 수 없는 필드를 조용히 무시해 미래 버전 publisher의 추가 필드가 consumer 크래시를 유발하지 않도록 합니다.",
          badge: "Pydantic",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "DLQ가 있어도 메시지가 거기 쌓이면 소실이나 마찬가지입니다. 운영 알림을 설정해 DLQ에 메시지가 쌓이면 즉시 탐지할 수 있어야 합니다. Schema Registry를 도입하면 이벤트 스키마 버전을 중앙에서 관리하고 호환성 검사를 자동화할 수 있습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "스키마 변경 방식",
          before: "필수 필드 즉시 추가",
          after: "Optional 필드로만 추가",
          change: "원칙 수립",
        },
        {
          label: "배포 순서",
          before: "무순서",
          after: "consumer 먼저, publisher 나중",
          change: "원칙 수립",
        },
        {
          label: "파싱 실패 처리",
          before: "DLQ 라우팅 (메시지 소실)",
          after: "extra='ignore'로 불명 필드 무시",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "구버전 consumer + 신버전 publisher: extra='ignore'로 파싱 성공, ack. 신버전 consumer + 구버전 publisher: Optional 필드 = None으로 파싱 성공, ack.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "devops_messaging 패키지가 공유 라이브러리이기 때문에 스키마 변경이 모든 서비스에 영향을 줍니다. 버전 올릴 때 CHANGELOG에 하위 호환 여부를 명시해야 합니다.",
        "필드 추가(Optional) → 배포 완료 → 필수로 전환하는 2단계 과정이 안전합니다.",
        "base class의 extra 설정은 하위 클래스 전체에 상속됩니다. 공유 라이브러리의 base class는 가장 관대한 쪽(extra='ignore')으로 설정합니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "consumer-idempotency-processed-event",
    "distributed-tracing-correlation-id",
    "msa-rabbitmq-migration",
  ],
};
