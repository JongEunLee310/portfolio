import type { TechnicalNoteDetail } from "@/types/note";
import { realtimeDashboardRefreshDelay } from "../notes/realtime-dashboard-refresh-delay";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const realtimeDashboardRefreshDelayDetail: TechnicalNoteDetail = {
  ...realtimeDashboardRefreshDelay,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 센서로부터 온도, 습도, 조도, 토양 수분 등의 데이터를 수집하고, 사용자가 대시보드에서 현재 환경 상태를 확인할 수 있도록 하는 시스템이었습니다. 사용자가 기대하는 것은 단순히 '데이터가 저장되어 있다'가 아니라, 화면에 표시되는 값이 실제 스마트팜 상태를 충분히 빠르게 반영하는 것입니다. 그런데 센서 데이터는 센서 측정 → 게이트웨이 전송 → 서버 저장 → 대시보드 조회 → 화면 렌더링으로 이어지는 여러 단계를 거쳐 사용자 화면에 도달합니다. 이 단계들이 맞지 않으면 데이터가 서버에는 저장되어 있는데 화면에는 아직 반영되지 않거나, 화면이 너무 자주 조회해서 같은 값을 반복해서 가져오는 문제가 발생합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "갱신 주기가 너무 길면",
          description:
            "센서는 30초마다 데이터를 보내는데 대시보드가 5분마다 갱신된다면, 사용자는 최대 5분 가까이 오래된 값을 볼 수 있습니다",
          badge: "지연",
        },
        {
          title: "갱신 주기가 너무 짧으면",
          description:
            "센서가 1분마다 데이터를 보내는데 대시보드가 1초마다 조회한다면, 대부분의 요청은 새 데이터 없이 같은 값을 반복해서 가져오는 낭비가 됩니다",
          badge: "낭비",
        },
        {
          title: "신선도 표시가 없으면",
          description:
            "화면의 '온도 28℃'가 10초 전 값인지 10분 전 값인지 알 수 없어 사용자가 현재 상태를 판단하기 어렵습니다",
          badge: "불명확",
        },
        {
          title: "미수신 상태 표시가 없으면",
          description:
            "센서가 장시간 데이터를 보내지 않아도 마지막 정상값이 현재 상태처럼 표시되어 장애 탐지가 늦어집니다",
          badge: "오인",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "스마트팜에서는 환경 변화에 따라 환기, 급수, 조명 제어 같은 판단이 이어질 수 있습니다. 오래된 데이터가 최신 상태처럼 보이면 사용자는 잘못된 결정을 내릴 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 센서 데이터가 화면에 표시되기까지 여러 지연 구간이 존재하는데, 이를 단일 '실시간 조회'로 단순화하기 쉽다는 점입니다. 대시보드에 값이 표시되기까지는 측정 지연, 전송 지연, 저장 지연, 조회 지연, 렌더링 지연이 누적됩니다. 이 중 대시보드 갱신 주기는 사용자가 체감하는 실시간성에 가장 직접적인 영향을 주지만, 센서 수집 주기와의 관계를 고려하지 않으면 갱신 주기 설정이 현실과 맞지 않게 됩니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "수집·조회 주기 미정의",
          description:
            "센서가 얼마나 자주 데이터를 보내는지 파악하지 않고 대시보드 갱신 주기를 설정하면 너무 짧거나 너무 긴 주기가 됩니다",
          badge: "주기",
        },
        {
          title: "데이터 신선도 표시 부족",
          description:
            "마지막 측정 시각을 사용자에게 보여주지 않으면 화면 값이 얼마나 최신인지 알 수 없습니다",
          badge: "신선도",
        },
        {
          title: "stale 기준 부재",
          description:
            "일정 시간 이상 센서 데이터가 갱신되지 않았을 때 경고 표시가 없으면 오래된 정상값이 현재 상태로 보입니다",
          badge: "stale",
        },
        {
          title: "polling 부하 미고려",
          description:
            "사용자 수 증가나 센서 수 증가 시 주기적 조회 요청이 누적되어 서버와 DB에 부하가 생깁니다",
          badge: "부하",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "대시보드에서 중요한 것은 값 자체뿐 아니라 값의 신선도입니다. '온도 28℃'보다 '온도 28℃, 마지막 측정: 20초 전'이 운영 관점에서 훨씬 더 많은 정보를 줍니다. 마지막 측정 시각이 없으면 화면 갱신이 조금 늦더라도 사용자가 상태를 해석하기 어렵습니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 대시보드 갱신 주기를 센서 수집 주기와 맞추고, 데이터 신선도를 화면과 서버에서 명확히 관리하는 것입니다. 갱신 주기는 빠를수록 무조건 좋은 것이 아니라, 센서 데이터가 새로 들어오는 주기보다 훨씬 빠르게 조회하면 서버 자원만 낭비됩니다. 반대로 너무 길면 사용자가 오래된 값을 현재 상태로 오인합니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "갱신 주기 미정의 구조",
          description:
            "센서 수집 주기와 무관하게 대시보드 조회 주기를 설정하는 구조입니다.",
          bullets: [
            "조회 주기가 너무 짧으면 같은 데이터를 반복 조회",
            "조회 주기가 너무 길면 화면 반영이 늦어짐",
            "마지막 측정 시각 미표시로 신선도 알 수 없음",
            "센서 미수신 상태 구분 불가",
            "사용자 증가 시 polling 부하 제어 어려움",
            "최신값 API가 무거우면 주기적 호출이 부하로 이어짐",
          ],
        },
        {
          title: "갱신 주기 설계 구조",
          description:
            "센서 수집 주기를 기준으로 대시보드 조회 주기를 맞추는 구조입니다.",
          bullets: [
            "센서 수집 주기에 맞춰 polling 간격 설정",
            "마지막 측정 시각을 화면에 표시",
            "일정 시간 미갱신 시 stale 상태 표시",
            "최신값 전용 경량 API 분리",
            "화면 비활성 시 polling 빈도 조정 검토",
            "실시간성이 더 필요하면 WebSocket 또는 SSE 검토",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "polling 주기 설정 기준: 센서가 10초마다 데이터를 보내면 대시보드는 5~10초 간격으로, 30초마다 보내면 15~30초 간격으로, 1분마다 보내면 30초~1분 간격으로 조회하는 것이 균형적입니다. 수집 주기보다 훨씬 짧은 조회 주기는 불필요한 중복 조회를, 수집 주기보다 훨씬 긴 조회 주기는 실시간성 저하를 만들어냅니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 센서 데이터가 저장된 뒤 대시보드에 반영되기까지의 흐름을 나타냅니다. 데이터는 이미 DB에 저장되었지만, 대시보드가 다음 조회 시점까지 기다려야 하는 구조를 보여줍니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "realtime-dashboard-refresh-delay.mermaid",
      code: "sequenceDiagram\n    participant Sensor\n    participant Gateway\n    participant API\n    participant DB\n    participant Dashboard\n\n    Sensor->>Gateway: 측정값 생성\n    Gateway->>API: 센서 데이터 전송\n    API->>DB: 최신값 저장\n\n    Note over DB,Dashboard: 새 데이터는 저장되었지만 화면은 아직 조회하지 않음\n\n    Dashboard->>API: 다음 polling 시점에 최신값 요청\n    API->>DB: 최신값 조회\n    DB-->>API: 최신 데이터 반환\n    API-->>Dashboard: 화면 갱신",
    },
    {
      type: "paragraph",
      content:
        "실제 화면 반영 지연은 센서 전송 지연뿐 아니라 대시보드 조회 주기에도 영향을 받습니다. 아래는 대시보드 갱신 방식별 특징입니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "polling 방식",
          description:
            "클라이언트가 일정 주기로 서버에 데이터를 요청하는 방식입니다.",
          bullets: [
            "수동 새로고침: 구현 단순, 실시간성 낮음 — 초기 버전에 적합",
            "고정 polling: 구현 쉬움, 불필요한 반복 조회 가능 — 센서 주기가 일정할 때 적합",
            "동적 polling: 부하와 실시간성 균형, 상태 관리 필요 — 화면 활성 여부를 고려할 때 적합",
          ],
        },
        {
          title: "push 방식",
          description:
            "서버가 클라이언트로 변경 사항을 전달하는 방식입니다.",
          bullets: [
            "WebSocket: 즉시 반영 가능, 구현 복잡도 증가 — 실시간성이 매우 중요할 때 적합",
            "Server-Sent Events: 서버→클라이언트 단방향에 적합 — 상태 업데이트 알림 중심 구조에 적합",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드와 운영 로그가 남아 있지 않기 때문에, 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증에서 중요한 것은 '화면이 새로고침되는가'뿐 아니라, 새 데이터가 저장된 뒤 사용자가 볼 수 있기까지의 지연 시간을 확인하는 것입니다.",
    },
    {
      type: "list",
      items: [
        "새 센서 데이터 저장: 센서 데이터가 서버에 저장됨 → 다음 갱신 주기 내 화면 반영",
        "주기적 갱신: polling 주기 설정 → 설정된 간격으로 최신값 조회",
        "데이터 미변경: 새 센서 데이터 없음 → 화면 값 유지, 불필요한 변화 없음",
        "센서 미수신: 일정 시간 데이터 없음 → stale 상태 표시",
        "지연 데이터 도착: 과거 measuredAt 데이터가 늦게 저장 → 현재 최신값을 덮지 않음",
        "화면 비활성: 브라우저 탭 비활성 상태 → polling 감소 또는 중단 검토",
        "다중 사용자 접속: 여러 사용자가 대시보드 조회 → API와 DB 부하가 과도하지 않음",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 데이터 반영 지연 시간(measuredAt 또는 createdAt부터 화면 표시까지), API polling 횟수(일정 시간 동안 대시보드가 호출한 수), 동일 데이터 반복 조회 비율, stale 상태 발생 건수, 최신값 API 응답 시간, 동시 사용자 수 대비 요청량",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "대시보드 갱신 주기 문제를 정리하면서, 실시간성은 단순히 화면을 자주 새로고침하는 문제가 아니라는 점을 확인할 수 있었습니다. 센서 수집 주기와 화면 갱신 주기를 맞추고, 데이터 신선도를 명확히 표시하면 사용자 신뢰도와 시스템 효율을 함께 높일 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "화면 반영",
          description:
            "데이터 저장 후 반영 시점이 불명확한 구조에서 → 설정된 갱신 주기 내 반영되는 구조로",
          badge: "반영",
        },
        {
          title: "API 호출",
          description:
            "너무 적거나 너무 많을 수 있던 구조에서 → 수집 주기 기준으로 조정된 구조로",
          badge: "호출",
        },
        {
          title: "데이터 신선도",
          description:
            "사용자가 알기 어려웠던 구조에서 → 마지막 측정 시각을 표시하는 구조로",
          badge: "신선도",
        },
        {
          title: "센서 미수신",
          description:
            "오래된 값이 정상처럼 보일 수 있던 구조에서 → stale 상태로 구분하는 구조로",
          badge: "미수신",
        },
      ],
    },
    {
      type: "list",
      items: [
        "센서 데이터가 화면에 반영되는 흐름을 명확히 설명할 수 있습니다.",
        "대시보드 polling 주기를 센서 수집 주기와 맞춰 불필요한 조회를 줄일 수 있습니다.",
        "사용자가 값의 신선도를 판단할 수 있도록 마지막 측정 시각을 제공할 수 있습니다.",
        "센서 미수신 상태를 정상 최신값과 구분할 수 있습니다.",
        "향후 WebSocket, SSE, 최신 상태 테이블 같은 확장 방향을 검토할 수 있습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 운영 지표가 남아 있지 않아 화면 반영 지연 시간이나 API 호출 감소율 같은 정량 지표는 확인할 수 없습니다. 이 문서에서는 실시간성 요구와 리소스 효율 사이의 균형을 잡는 설계 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 모니터링 시스템에서 실시간성은 '최대한 자주 조회하는 것'이 아니라 '사용자가 신뢰할 수 있는 최신 상태를 적절한 비용으로 제공하는 것'이라는 점입니다. 센서가 1분마다 데이터를 보내는데 화면이 1초마다 조회한다고 해서 시스템이 1초 단위로 정확해지는 것은 아닙니다. 반대로 화면이 너무 늦게 갱신되면 사용자는 현재 상태를 보고 있다고 믿지만 실제로는 오래된 값을 보고 있을 수 있습니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "대시보드 설계에서는 세 가지를 함께 고려해야 합니다. 데이터 수집 주기(센서 데이터는 얼마나 자주 들어오는가), 화면 갱신 주기(사용자는 얼마나 빠른 반영을 기대하는가), 시스템 부하(그 주기를 감당할 수 있는가)입니다. 이 세 요소 중 하나만 보면 갱신 주기 설계가 어긋납니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 센서 수집 주기와 대시보드 갱신 주기를 설정값으로 관리하면 작물 종류·센서 종류·운영 환경에 따라 유연하게 조정할 수 있습니다. 최신값 API를 경량화하면 대시보드 갱신 경로의 부하를 줄일 수 있습니다. stale 상태 기준을 도입해 마지막 측정이 수집 주기 2~3회 이상 지났을 때 '업데이트 지연' 또는 '센서 미수신'을 표시하면 사용자가 상태를 더 정확히 인식할 수 있습니다. 화면 비활성 시 polling 빈도를 낮추면 백그라운드 탭의 불필요한 부하를 줄일 수 있습니다. 실시간성이 더 중요해지는 경우에는 WebSocket 또는 SSE를 검토할 수 있으며, 이 경우 연결 관리, 재연결, 서버 리소스까지 함께 고려해야 합니다.",
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
  ],
};
