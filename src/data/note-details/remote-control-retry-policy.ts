import type { TechnicalNoteDetail } from "@/types/note";
import { remoteControlRetryPolicy } from "../notes/remote-control-retry-policy";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const remoteControlRetryPolicyDetail: TechnicalNoteDetail = {
  ...remoteControlRetryPolicy,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 원격 제어 기능에서 중요한 것은 명령을 보내는 것만이 아닙니다. 명령이 실패했을 때 어떻게 처리할 것인지도 함께 설계해야 합니다. 제어 명령은 여러 이유로 실패할 수 있습니다. 네트워크가 일시적으로 끊길 수 있고, 게이트웨이가 꺼져 있을 수 있고, 장비 자체가 명령을 거부할 수도 있습니다. 그런데 이 모든 실패를 같은 방식으로 처리하면 문제가 생깁니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "모든 실패를 재시도",
          description:
            "잘못된 명령이나 장비 거부 같은 재시도해도 성공하지 않는 실패까지 반복 실행되어 불필요한 부하 발생",
          badge: "과도한 재시도",
        },
        {
          title: "어떤 실패도 재시도 안 함",
          description:
            "일시적인 네트워크 오류에도 제어 실패로 그냥 종료하여 사용자가 불필요하게 수동 재시도해야 하는 상황",
          badge: "복구 기회 손실",
        },
        {
          title: "무제한 재시도",
          description:
            "최대 횟수 제한이 없어 서버와 게이트웨이에 부하가 계속 증가하고 장비에 반복 명령이 전달",
          badge: "부하 누적",
        },
        {
          title: "장비 상태 확인 없는 재시도",
          description:
            "timeout 후 재시도할 때 장비가 실제로 이미 동작했을 가능성을 확인하지 않아 같은 명령이 중복 실행",
          badge: "중복 동작",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "예를 들어 급수 시작 명령을 보냈는데 timeout이 발생했다면, 이 timeout이 '장비가 동작하지 않았다'는 뜻이 아닐 수 있습니다. 명령은 장비에 도달했지만 응답만 늦었을 가능성도 있습니다. 이 상태에서 무조건 재시도하면 급수 명령이 중복 실행될 수 있고, 아무것도 하지 않으면 단순 네트워크 흔들림 때문에 제어가 실패로 끝날 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 원격 제어 실패를 하나의 상태로 단순화하기 쉽다는 점입니다. 일반적인 웹 API에서는 실패가 발생하면 그냥 다시 시도하는 것이 자연스럽습니다. 그런데 스마트팜 제어 명령은 물리 장비 동작으로 이어집니다. 실패 원인을 구분하지 않으면 재시도 자체가 위험해질 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "실패 유형 미분류",
          description:
            "timeout, 네트워크 오류, 장비 거부, 잘못된 명령을 구분하지 않아 재시도 가능 여부를 판단할 수 없음",
          badge: "분류 없음",
        },
        {
          title: "재시도 가능 실패와 불가 실패 미구분",
          description:
            "일시적 실패는 재시도해야 하고 영구적 실패는 재시도하면 안 되는데, 이 기준이 없어 둘 다 잘못 처리",
          badge: "기준 없음",
        },
        {
          title: "물리 부작용 미고려",
          description:
            "급수, 환기, 조명 같은 장비 제어는 중복 실행이 실제 환경에 영향을 주므로 재시도 전 상태 확인이 필요",
          badge: "안전 고려 없음",
        },
        {
          title: "timeout과 실제 미동작 혼동",
          description:
            "응답 없음이 '장비가 동작하지 않음'과 같지 않은데, 이를 구분하지 않아 재시도가 중복 동작으로 이어질 수 있음",
          badge: "의미 혼동",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "원격 제어 실패는 세 가지로 나눌 수 있습니다. 첫째, 일시적 실패: 네트워크 오류, timeout처럼 잠시 후 다시 시도하면 성공할 가능성이 있는 실패. 둘째, 영구적 실패: 잘못된 명령 형식, 존재하지 않는 장비처럼 재시도해도 성공하지 않는 실패. 셋째, 상태 충돌: 현재 장비 상태와 명령이 맞지 않아 먼저 상태를 확인해야 하는 실패. 이 세 가지를 구분하지 않으면 재시도 정책을 올바르게 설계할 수 없습니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 실패 유형별 재시도 정책을 명확히 정의하는 것입니다. 실패가 발생하면 바로 재시도하거나 바로 실패 처리하는 대신, 실패 원인을 분류하고 재시도 가능 여부를 먼저 판단합니다. 재시도 가능한 실패는 제한 횟수 내에서만 재시도하고, 재시도 불가능한 실패는 즉시 FAILED로 확정합니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "재시도 기준 없는 구조",
          description: "실패 원인을 구분하지 않고 일괄로 처리하는 구조입니다.",
          bullets: [
            "모든 실패에 동일한 처리 적용",
            "재시도 횟수 제한 없음",
            "장비 상태 확인 없이 재시도",
            "실패 원인을 사용자에게 표시하지 않음",
            "timeout과 거부를 구분하지 않음",
            "중복 명령 발생 가능",
          ],
        },
        {
          title: "실패 유형별 재시도 정책",
          description: "실패 원인을 분류하고 정책에 따라 처리하는 구조입니다.",
          bullets: [
            "timeout, 네트워크 오류, 거부, 잘못된 명령 분류",
            "일시적 실패만 제한적 재시도 대상",
            "재시도 전 장비 상태 확인 옵션",
            "실패 원인별 사용자 안내 메시지",
            "재시도 횟수 초과 시 FAILED 확정",
            "명령 상태 이력 기록",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "실패 유형과 재시도 정책을 정리하면 다음과 같습니다. Timeout과 Network Error는 일시적 실패로 제한 횟수 내 재시도 대상입니다. Gateway Unavailable은 중계 장치 접근 불가이므로 짧은 재시도 후 사용자 알림이 필요합니다. Device Rejected는 장비가 명령을 거부한 것이므로 즉시 실패 처리가 맞습니다. Invalid Command는 명령 형식이나 대상 자체가 잘못된 것으로 재시도 없이 요청 검증 실패로 처리합니다. State Conflict는 현재 장비 상태와 명령이 충돌하는 상황으로 상태 조회 후 판단이 필요합니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 실패 유형을 분류하지 않고 일괄 재시도할 때의 문제 흐름입니다. 재시도해도 의미 없는 실패나 위험한 실패까지 반복될 수 있습니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "remote-control-retry-policy-before.mermaid",
      code: "flowchart TD\n    A[Control Command Requested] --> B[Send Command to Device]\n    B --> C{Command Failed?}\n\n    C -- No --> D[CONFIRMED]\n    C -- Yes --> E[Retry Without Classification]\n\n    E --> F{Actually Retryable?}\n    F -- Yes --> G[May Recover]\n    F -- No --> H[Repeated Failure or Unsafe Retry]\n\n    H --> I[Device Load or State Mismatch Risk]",
    },
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 실패 유형을 분류하고 재시도 가능 여부를 판단하는 개선 후 흐름입니다. 실패가 발생하면 먼저 유형을 분류하고 재시도 가능 여부와 남은 횟수를 확인합니다. 재시도 불가능하거나 횟수를 초과하면 FAILED로 확정하고 사용자에게 알립니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "remote-control-retry-policy-after.mermaid",
      code: "flowchart TD\n    A[Control Command Requested] --> B[Send Command]\n    B --> C{Result}\n\n    C -- Success --> D[CONFIRMED]\n    C -- Failure --> E[Classify Failure]\n\n    E --> F{Retryable?}\n\n    F -- No --> G[FAILED]\n    F -- Yes --> H{Retry Count Left?}\n\n    H -- No --> I[FAILED]\n    H -- Yes --> J[Wait or Backoff]\n    J --> B\n\n    G --> K[Notify User with Reason]\n    I --> K\n    D --> L[Update Device State]",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드와 장비 로그가 남아 있지 않기 때문에, 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증에서 중요한 것은 '재시도했는가'가 아니라 '재시도해야 하는 실패만 재시도했는가'입니다.",
    },
    {
      type: "list",
      items: [
        "정상 제어: 장비가 성공 응답 반환 → 재시도 없이 CONFIRMED",
        "Timeout 1회 후 성공: 첫 요청 timeout, 두 번째 성공 → 재시도 후 CONFIRMED",
        "Timeout 반복: 제한 횟수만큼 응답 없음 → 최종 FAILED",
        "Network Error: 일시적 통신 실패 → 제한적 재시도 후 성공 또는 FAILED",
        "Device Rejected: 장비가 명령 거부 → 재시도 없이 즉시 FAILED",
        "Invalid Command: 잘못된 장비 ID 또는 명령 형식 → 재시도 없이 요청 실패",
        "State Conflict: 이미 ON 상태에서 ON 요청 → 정책에 따라 성공 간주 또는 무시",
        "급수 명령 timeout: 재시도 전 장비 실제 상태 확인 또는 보수적 실패 처리",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 재시도 발생 건수(제어 불안정성 빈도), 재시도 후 성공률(retry 정책 효과), 최종 실패율(제어 신뢰도), timeout 비율(장비 응답 문제 추적), 실패 유형별 건수(네트워크/장비/요청 문제 분리), 평균 제어 완료 시간, 중복 명령 방지 건수",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "실패 유형별 재시도 정책을 정의하면 일시적 실패는 복구 가능성을 높이고, 재시도하면 안 되는 실패는 빠르게 중단할 수 있습니다. 사용자에게는 단순 실패가 아니라 실패 원인을 전달할 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "Timeout 복구 가능성 확보",
          description:
            "일시적 네트워크 흔들림으로 인한 timeout은 제한적 재시도로 복구 가능성을 높일 수 있음",
          badge: "복구",
        },
        {
          title: "무분별한 재시도 방지",
          description:
            "장비 거부, 잘못된 명령처럼 재시도해도 성공하지 않는 실패를 즉시 종료하여 장비 부하 감소",
          badge: "방지",
        },
        {
          title: "사용자 실패 원인 안내",
          description:
            "단순 '제어 실패' 대신 '장비 응답 없음', '게이트웨이 연결 실패', '명령 거부'로 원인별 표시 가능",
          badge: "안내",
        },
        {
          title: "운영 진단 기반 마련",
          description:
            "실패 유형별 건수를 기록하면 네트워크 문제인지 장비 문제인지 정책 문제인지 분리해서 분석 가능",
          badge: "진단",
        },
      ],
    },
    {
      type: "list",
      items: [
        "일시적인 네트워크 문제에 대해 제어 성공 가능성을 높일 수 있습니다.",
        "재시도해도 의미 없는 실패를 반복하지 않을 수 있습니다.",
        "장비에 불필요한 반복 명령이 전달되는 것을 줄일 수 있습니다.",
        "사용자에게 실패 원인을 더 명확히 안내할 수 있습니다.",
        "실패 이력을 통해 네트워크, 게이트웨이, 장비 문제를 분리해 분석할 수 있습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 장비 연동 기록이 남아 있지 않아 재시도 후 성공률, timeout 감소율, 최종 실패율 같은 정량 지표는 확인할 수 없습니다. 이 문서에서는 원격 제어 실패를 안전하게 다루기 위한 재시도 정책 설계 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 재시도는 안정성을 높이는 도구이지만, 물리 장비 제어에서는 신중하게 사용해야 한다는 것입니다. 일반적인 API 요청에서는 일시적 실패를 재시도하는 것이 자연스럽습니다. 하지만 스마트팜 제어 명령은 실제 장비 동작으로 이어집니다. 원격 제어에서는 실패 원인이 무엇인지, 다시 시도하면 성공 가능성이 있는지, 다시 시도해도 안전한지, 언제 포기해야 하는지, 사용자에게 무엇을 알려야 하는지를 반드시 나눠서 판단해야 합니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "원격 제어의 retry는 작은 톱니바퀴가 아니라 안전핀에 가깝습니다. 너무 헐거우면 제어가 실패하고, 너무 세게 걸면 장비가 불필요하게 반복 동작합니다. 특히 급수, 환기처럼 물리 환경에 영향을 주는 명령은 서버가 실패로 판단했지만 장비가 이미 동작했을 가능성을 항상 고려해야 합니다. 재시도 정책은 예외 처리 코드가 아니라 시스템 안전성을 결정하는 설계 요소입니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 명령별 위험도에 따라 재시도 정책을 다르게 둘 수 있습니다. 조명 켜기와 급수 시작은 물리적 영향이 다르므로 같은 재시도 기준을 적용하면 안 됩니다. 제어 명령에 idempotency key를 부여하면 같은 명령이 재전송되더라도 중복 실행을 방지할 수 있습니다. 재시도 전에 장비 실제 상태를 확인하는 절차를 두면 timeout 이후 중복 동작 위험을 줄일 수 있습니다. 반복 실패하는 장비에 circuit breaker를 적용하면 점검이 필요한 장비에 명령을 계속 전송하는 것을 방지할 수 있습니다. 자동 제어와 연결될 경우 수동 제어보다 더 보수적인 재시도 정책이 필요합니다.",
    },
  ],
  relatedNoteSlugs: [
    "smart-farm-cloud-monitoring-architecture",
    "sensor-data-flow-responsibility-separation",
    "sensor-rest-ingestion-validation",
    "duplicate-sensor-data-idempotency",
    "sensor-timestamp-measurement-storage-mismatch",
    "sensor-log-table-growth-query-degradation",
    "latest-sensor-value-query-optimization",
    "sensor-threshold-alert-false-positive",
    "realtime-dashboard-refresh-delay",
    "abnormal-sensor-value-detection",
    "remote-control-device-state-mismatch",
  ],
};
