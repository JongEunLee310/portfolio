import type { TechnicalNoteDetail } from "@/types/note";
import { rabbitmqEventTopology } from "../notes/rabbitmq-event-topology";

export const rabbitmqEventTopologyDetail: TechnicalNoteDetail = {
  ...rabbitmqEventTopology,
  template: "technical-summary",
  toc: [
    { id: "background", title: "설계 배경", depth: 1 },
    { id: "topology", title: "토폴로지 구성", depth: 1 },
    { id: "event-flow", title: "이벤트 흐름", depth: 1 },
    { id: "idempotency", title: "멱등성 보장", depth: 1 },
    { id: "caution", title: "운영 기준", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "background",
      title: "1. 설계 배경",
    },
    {
      type: "paragraph",
      content:
        "파이프라인 실행과 AI Review는 처리 시간이 길고 실패 가능성이 있는 작업입니다. 초기에는 FastAPI BackgroundTasks로 실행했으나 프로세스 재시작 시 태스크가 유실되고 retry 경로가 없었습니다. Celery + Redis를 실험했으나 메시지 내구성 보장을 위한 추가 설정이 필요했고, 서비스 간 코드 결합도 해소되지 않았습니다. 세 서비스(core-api, pipeline-execution-svc, ai-review-svc)가 독립 배포 가능하려면 각자 메시지를 구독하고 처리하는 구조가 필요했습니다.",
    },
    {
      type: "heading",
      id: "topology",
      title: "2. 토폴로지 구성",
    },
    {
      type: "cards",
      items: [
        {
          title: "Topic Exchange: devops.events",
          description:
            "단일 exchange에서 routing key 패턴 매칭으로 여러 서비스에 이벤트를 분배합니다. 이벤트 종류가 늘어나도 exchange 추가 없이 routing key와 queue만 추가하면 됩니다.",
          badge: "durable=True",
        },
        {
          title: "Queue + Dead Letter Queue",
          description:
            "각 큐에 DLQ를 연결했습니다. Consumer가 처리에 실패해 nack/requeue를 반복하면 설정된 횟수 이후 DLQ로 이동합니다. DLQ는 수동 재처리 또는 알림 트리거에 사용합니다.",
          badge: "DLQ 분리",
        },
        {
          title: "Persistent Message",
          description:
            "delivery_mode=PERSISTENT로 발행해 RabbitMQ 재시작 후에도 메시지가 유실되지 않습니다. durable exchange + durable queue + persistent message 세 조건이 모두 충족돼야 내구성이 보장됩니다.",
          badge: "PERSISTENT",
        },
      ],
    },
    {
      type: "code",
      language: "python",
      filename: "topology.py",
      code: "DEVOPS_EVENTS_EXCHANGE = RabbitMQExchangeConfig(\n    name=\"devops.events\",\n    exchange_type=RabbitMQExchangeType.TOPIC,\n    durable=True,\n)\n\nPIPELINE_EXECUTION_QUEUE = RabbitMQQueueBindingConfig(\n    name=\"pipeline-execution.request.queue\",\n    routing_key=\"pipeline.execution.requested\",\n    dead_letter_queue=\"pipeline-execution.request.dlq\",\n)\n\nCORE_PIPELINE_RESULT_QUEUE = RabbitMQQueueBindingConfig(\n    name=\"core.pipeline-result.queue\",\n    routing_key=\"pipeline.execution.finished\",\n    dead_letter_queue=\"core.pipeline-result.dlq\",\n)\n\nAI_REVIEW_REQUEST_QUEUE = RabbitMQQueueBindingConfig(\n    name=\"ai-review.request.queue\",\n    routing_key=\"ai_review.requested\",\n    dead_letter_queue=\"ai-review.request.dlq\",\n)\n\nCORE_AI_REVIEW_RESULT_QUEUE = RabbitMQQueueBindingConfig(\n    name=\"core.ai-review-result.queue\",\n    routing_key=\"ai_review.completed\",\n    dead_letter_queue=\"core.ai-review-result.dlq\",\n)",
    },
    {
      type: "heading",
      id: "event-flow",
      title: "3. 이벤트 흐름",
    },
    {
      type: "list",
      items: [
        "POST /pipelines/{id}/run → CoreEventPublisher가 pipeline.execution.requested 발행",
        "PipelineExecutionConsumer 수신 → Git clone + Job 순차 실행 → pipeline.execution.finished 발행 (status: SUCCESS / FAILED)",
        "CoreAPIConsumer 수신 → Pipeline.status 업데이트 → 실패 시 ai_review.requested 추가 발행",
        "AIReviewConsumer 수신 → LLM 분석 → ai_review.completed 발행",
        "CoreAPIConsumer 수신 → AIReview DB 저장",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "pipeline.execution.finished 이벤트는 성공/실패를 payload의 status 필드로 구분합니다. Core API 입장에서는 같은 상태 전이이므로 routing key를 분리하지 않았습니다.",
    },
    {
      type: "heading",
      id: "idempotency",
      title: "4. 멱등성 보장",
    },
    {
      type: "paragraph",
      content:
        "RabbitMQ는 At-Least-Once 전달을 보장합니다. 네트워크 장애나 Consumer 재시작 시 같은 메시지가 두 번 도달할 수 있습니다. Consumer가 ack를 보내기 전에 재시작되면 RabbitMQ는 메시지를 재전송합니다. 이를 막기 위해 processed_events 테이블에 event_id UNIQUE constraint를 두고, 중복 수신 시 IntegrityError를 잡아 ack만 보냅니다.",
    },
    {
      type: "code",
      language: "python",
      filename: "consumer.py",
      code: "async def on_message(message: AbstractIncomingMessage) -> None:\n    async with message.process(requeue=False):\n        payload = EventPayload.model_validate_json(message.body)\n        try:\n            # UNIQUE constraint: 중복 event_id는 IntegrityError\n            await repository.create_processed_event(payload.event_id)\n            await service.handle(payload)\n            await message.ack()\n        except IntegrityError:\n            # 이미 처리한 이벤트: 건너뛰고 ack\n            await message.ack()\n        except Exception:\n            # 처리 실패: nack → DLQ로 이동\n            await message.nack(requeue=False)",
    },
    {
      type: "heading",
      id: "caution",
      title: "5. 운영 기준",
    },
    {
      type: "cards",
      items: [
        {
          title: "재처리 가능 여부 판단",
          description:
            "일시적 외부 장애(네트워크, API 타임아웃)는 DLQ에서 수동 재발행합니다. 데이터 오류나 스키마 불일치는 재처리해도 같은 결과가 나오므로 알림 후 폐기합니다.",
          badge: "재처리 vs 폐기",
        },
        {
          title: "DLQ 모니터링",
          description:
            "DLQ 메시지 수를 Prometheus에서 수집합니다. 0보다 크면 Grafana 알림을 보내 즉시 확인합니다. DLQ가 쌓이는 속도가 처리 속도를 초과하면 서비스 장애로 간주합니다.",
          badge: "알림 필수",
        },
        {
          title: "Manual Ack 정책",
          description:
            "Consumer는 반드시 DB 반영 성공 후 ack합니다. auto-ack를 사용하면 DB 저장 전에 메시지가 소비된 것으로 간주되어 실패 시 유실됩니다.",
          badge: "DB 반영 후 ack",
        },
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "메시징 구조에서 코드보다 중요한 것은 운영 기준입니다. 어떤 실패를 재처리하고 어떤 실패를 알림으로 올릴지, DLQ를 언제 비울지를 먼저 정하지 않으면 장애 대응 시 판단이 느려집니다.",
    },
  ],
  relatedNoteSlugs: ["async-pipeline-transition", "consumer-idempotency-processed-event", "msa-rabbitmq-migration"],
};
