import type { TechnicalNoteDetail } from "@/types/note";
import { consumerIdempotencyProcessedEvent } from "../notes/consumer-idempotency-processed-event";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const consumerIdempotencyProcessedEventDetail: TechnicalNoteDetail = {
  ...consumerIdempotencyProcessedEvent,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "RabbitMQ Consumer 구현 시, 동일 이벤트가 두 번 처리되면 Pipeline.status가 중복 갱신되거나 AIReview가 중복 저장될 수 있었습니다. RabbitMQ는 at-least-once 전달을 보장하므로 ack 전 프로세스가 죽으면 같은 메시지가 재전달됩니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "at-least-once delivery를 사용하는 모든 Consumer는 멱등성을 직접 구현해야 합니다. '보통은 한 번만 온다'는 가정은 프로덕션에서 반드시 깨집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "Consumer가 처리를 완료하고 commit했지만 ack를 보내기 직전 프로세스가 종료되면 RabbitMQ가 동일 메시지를 재전달합니다.",
        "Pipeline.status 갱신은 같은 값으로 덮어써 결과가 같지만, AIReview INSERT는 unique 제약 위반으로 실패합니다.",
        "IntegrityError가 발생하면 nack(requeue=True)로 처리해 같은 메시지가 무한 반복됩니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "ProcessedEvent 테이블",
          description:
            "event_id(UUID)를 unique 컬럼으로 갖는 processed_events 테이블을 도입합니다. 이벤트 처리 시 가장 먼저 ProcessedEvent를 INSERT합니다.",
          badge: "PostgreSQL",
        },
        {
          title: "IntegrityError 기반 중복 감지",
          description:
            "두 번째 INSERT 시 unique 제약 위반으로 IntegrityError가 발생합니다. 이를 catch해 False를 반환하면 Consumer는 비즈니스 로직을 건너뛰고 ack합니다.",
          badge: "멱등성",
        },
        {
          title: "트랜잭션 경계",
          description:
            "ProcessedEvent INSERT와 비즈니스 로직을 같은 세션에서 처리합니다. 비즈니스 로직 실패 시 ProcessedEvent도 함께 롤백되어 재처리 가능성이 유지됩니다.",
          badge: "트랜잭션",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "IntegrityError 기반 멱등성 패턴은 SELECT → 분기 방식보다 동시성 안전성이 높고 코드도 짧습니다. IntegrityError를 성공으로 처리한다는 점이 처음엔 직관에 어긋나 보이지만, 'DB가 이미 처리됐음을 보장한다'는 올바른 해석입니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "중복 이벤트 처리",
          before: "비즈니스 로직 중복 실행",
          after: "ProcessedEvent에서 차단",
          change: "해소",
        },
        {
          label: "AIReview 중복 INSERT",
          before: "Unique 제약 오류 → nack 무한 반복",
          after: "ProcessedEvent 단계에서 차단",
          change: "해소",
        },
        {
          label: "재처리 가능성",
          before: "유지",
          after: "유지 (ProcessedEvent rollback 포함)",
          change: "동일",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "단위 테스트에서 FakeProcessedEventRepository가 두 번째 save() 호출 시 IntegrityError를 raise하도록 구현해 멱등성을 검증했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "at-least-once delivery를 사용하는 모든 Consumer는 멱등성을 직접 구현해야 합니다.",
        "IntegrityError 기반 중복 감지는 SELECT 후 분기보다 동시성 안전성이 높습니다.",
        "processed_events 테이블은 시간이 지나면 무한 증가합니다. 일정 기간 이후 레코드를 삭제하는 스케줄러가 필요합니다.",
        "event_id가 없는 이벤트 유형이 추가되면 멱등성을 보장할 수 없으므로 공유 패키지의 모든 이벤트 스키마에 event_id 필드를 필수로 강제해야 합니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "msa-rabbitmq-migration",
    "event-schema-versioning-deploy-order",
    "rabbitmq-event-topology",
  ],
};
