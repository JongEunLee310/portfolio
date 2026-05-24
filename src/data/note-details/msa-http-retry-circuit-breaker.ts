import type { TechnicalNoteDetail } from "@/types/note";
import { msaHttpRetryCircuitBreaker } from "../notes/msa-http-retry-circuit-breaker";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const msaHttpRetryCircuitBreakerDetail: TechnicalNoteDetail = {
  ...msaHttpRetryCircuitBreaker,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "core-api는 PipelineExecutionReadClient와 AIReviewClient로 sub-service에 동기 HTTP 요청을 보냅니다. sub-service가 재시작 중일 때 httpx는 타임아웃까지 대기하다 ConnectError를 발생시켰고, 재시도 로직이 없어 일시적 네트워크 지연 하나로 사용자 요청 전체가 실패했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "분산 시스템에서 원격 호출에 타임아웃이 없다는 것은 '무한정 기다린다'는 의미입니다. 타임아웃 설정은 선택이 아니라 필수입니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "일시적 오류(ConnectError, ReadTimeout)는 sub-service 재시작이나 순간 과부하로 발생합니다. 재시도하면 성공할 가능성이 높습니다.",
        "타임아웃이 설정되지 않아 sub-service 장애 시 모든 요청 핸들러가 OS 기본 타임아웃까지 대기 상태로 묶입니다.",
        "동시 요청이 많으면 이벤트 루프에서 await 중인 코루틴이 누적되어 전체 처리량이 급락하는 연쇄 장애(Cascade Failure)로 이어질 수 있습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "타임아웃 명시 설정",
          description:
            "httpx.Timeout(connect=3.0, read=10.0, write=5.0, pool=3.0)으로 연결 타임아웃과 읽기 타임아웃을 분리해 응답 없는 서비스에 무한정 대기하지 않습니다.",
          badge: "httpx",
        },
        {
          title: "tenacity 재시도",
          description:
            "ConnectError와 ReadTimeout처럼 재시도해서 성공할 수 있는 예외만 대상으로 최대 3회, 지수 백오프(0.5~4s)로 재시도합니다. 4xx 응답은 재시도하지 않습니다.",
          badge: "tenacity",
        },
        {
          title: "서킷 브레이커 패턴",
          description:
            "CLOSED → OPEN(연속 실패 N회) → HALF-OPEN(복구 탐색) 상태를 순환합니다. OPEN 상태에서 즉시 503을 반환해 core-api 자원을 보호합니다. 현 단계는 재시도만 적용하고 서킷 브레이커는 향후 개선 예정입니다.",
          badge: "패턴",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "재시도는 멱등한 요청에만 안전합니다. GET은 재시도해도 부작용이 없지만 POST는 side effect가 발생할 수 있으므로 재시도 대상에서 제외하거나 멱등성을 별도로 보장해야 합니다. 이 프로젝트에서 core-api가 sub-service에 보내는 요청은 모두 GET(조회)입니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "일시적 오류 처리",
          before: "즉시 실패 (503)",
          after: "최대 3회 재시도 후 실패",
          change: "개선",
        },
        {
          label: "타임아웃",
          before: "설정 없음 (OS 기본값)",
          after: "connect=3s, read=10s 명시",
          change: "추가",
        },
        {
          label: "연쇄 장애 위험",
          before: "높음 (타임아웃 대기 누적)",
          after: "낮음 (빠른 실패로 자원 회수)",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "pipeline-execution-svc를 1초간 중단 후 요청하면 재시도 2회 후 성공합니다. 완전 중단 시 3회 재시도 후 약 3~4초 만에 503을 반환합니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "서킷 브레이커는 '요청을 덜 보내는' 보호 장치가 아니라 '장애 중인 서비스에 더 이상 부담을 주지 않는' 복구 협력 장치입니다. 재시도와 함께 쓸 때 효과가 큽니다.",
        "지수 백오프는 과부하 상태의 서비스에 추가 부담을 주지 않기 위한 전략입니다.",
        "서비스 메시(Istio, Linkerd) 도입 시 재시도와 서킷 브레이커를 사이드카가 처리하므로 애플리케이션 코드의 재시도 로직을 제거할 수 있습니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "msa-rabbitmq-migration",
    "consumer-idempotency-processed-event",
    "msa-load-test-threadpool-ownership",
  ],
};
