import type { TechnicalNoteDetail } from "@/types/note";
import { sensorTimestampMeasurementStorageMismatch } from "../notes/sensor-timestamp-measurement-storage-mismatch";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const sensorTimestampMeasurementStorageMismatchDetail: TechnicalNoteDetail =
  {
    ...sensorTimestampMeasurementStorageMismatch,
    template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
    toc: troubleshootingToc,
    content: [
      troubleshootingHeading(0),
      {
        type: "paragraph",
        content:
          "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등 센서 데이터를 주기적으로 수집하고, 대시보드에서 현재 상태와 시간별 변화 추이를 확인할 수 있도록 하는 시스템이었습니다. 이때 센서 데이터는 '언제 서버에 저장되었는가'보다 '언제 실제로 측정되었는가'가 더 중요합니다. 예를 들어 센서가 10:00에 측정한 데이터를 네트워크 문제로 인해 10:05에 서버로 전송할 수 있습니다. 이 경우 데이터를 10:05에 발생한 값처럼 처리하면, 실제 환경 변화 흐름과 대시보드 그래프가 어긋납니다.",
      },
      {
        type: "cards",
        items: [
          {
            title: "최신값 조회 왜곡",
            description:
              "실제 최신 측정값이 아닌, 늦게 저장된 과거 데이터가 최신값으로 보일 수 있음",
            badge: "최신값",
          },
          {
            title: "그래프 순서 오류",
            description:
              "시간 순서가 실제 환경 변화 순서와 다르게 표시됨",
            badge: "그래프",
          },
          {
            title: "임계치 판단 오탐",
            description:
              "과거 이상값이 뒤늦게 도착해 현재 이상 상태처럼 판단될 수 있음",
            badge: "알림",
          },
          {
            title: "통계 계산 왜곡",
            description: "시간 구간별 평균, 최대, 최소값이 잘못 집계될 수 있음",
            badge: "통계",
          },
          {
            title: "장애 분석 어려움",
            description:
              "센서 측정 지연인지 서버 저장 지연인지 구분하기 어려움",
            badge: "분석",
          },
        ],
      },
      {
        type: "callout",
        variant: "info",
        content:
          "센서 데이터에는 최소한 두 가지 시간이 분리되어야 했습니다. 측정 시각(센서가 실제 환경 값을 측정한 시간)과 저장 시각(서버가 데이터를 수신하거나 DB에 저장한 시간)입니다. 이 둘을 구분하지 않으면, 시스템은 '실제 환경의 시간 흐름'이 아니라 '서버에 도착한 순서'를 기준으로 상태를 해석하게 됩니다.",
      },
      troubleshootingHeading(1),
      {
        type: "paragraph",
        content:
          "문제의 핵심 원인은 센서 데이터의 시간 의미를 하나로 단순화할 수 있다고 가정한 점입니다. 일반적인 CRUD 데이터에서는 createdAt만으로도 충분한 경우가 많습니다. 사용자가 게시글을 작성했다면 생성 시각이 곧 이벤트 발생 시각일 수 있습니다. 하지만 센서 데이터는 다릅니다. 센서 데이터는 서버에 저장된 순간이 아니라, 물리 환경에서 측정된 순간에 의미가 있습니다.",
      },
      {
        type: "cards",
        items: [
          {
            title: "측정 시각 부재",
            description:
              "센서가 실제 측정한 시간이 없어 환경 흐름을 복원할 수 없음",
            badge: "부재",
          },
          {
            title: "저장 시각 기준 처리",
            description:
              "서버 도착 순서로 데이터를 해석해 그래프와 최신값이 왜곡됨",
            badge: "기준",
          },
          {
            title: "지연 전송 고려 부족",
            description:
              "네트워크 장애 후 재전송 가능성을 반영하지 않아 과거 데이터가 현재값처럼 보임",
            badge: "지연",
          },
          {
            title: "시간대 기준 불명확",
            description:
              "서버, 사용자, 장비 시간이 다를 수 있어 날짜 범위 조회에서 오류 발생",
            badge: "시간대",
          },
        ],
      },
      {
        type: "callout",
        variant: "info",
        content:
          "가장 중요한 원인은 측정 이벤트 시간과 저장 이벤트 시간을 같은 의미로 취급하는 것입니다. 스마트팜 모니터링 시스템에서 사용자는 '서버가 언제 이 데이터를 받았는가'보다 '그 시점의 작물 환경이 어땠는가'를 알고 싶어 합니다. 따라서 시간 기준은 서버 중심이 아니라 센서 측정 중심이어야 합니다.",
      },
      troubleshootingHeading(2),
      {
        type: "paragraph",
        content:
          "해결 방향은 센서 데이터 모델과 조회 기준에서 measuredAt과 createdAt의 역할을 분리하는 것입니다. 그래프와 최신값 조회는 실제 환경 변화 흐름을 보여줘야 하므로 서버 도착 순서가 아니라 측정 순서가 기준이 되어야 합니다. 저장 시각은 여전히 필요하지만, 그 역할은 데이터 정렬이 아니라 운영 추적과 장애 분석입니다.",
      },
      {
        type: "comparison",
        items: [
          {
            title: "저장 시각 중심 구조",
            description: "서버 도착 순서를 기준으로 데이터를 해석하는 구조입니다.",
            bullets: [
              "늦게 저장된 과거 데이터가 최신값으로 처리될 수 있음",
              "그래프가 실제 환경 변화 순서와 다르게 표시됨",
              "지연 전송 데이터가 현재 상태처럼 오해될 수 있음",
              "측정 지연과 전송 지연을 구분하기 어려움",
              "기간 조회가 저장일 기준으로 왜곡될 수 있음",
            ],
          },
          {
            title: "측정 시각 분리 구조",
            description: "실제 측정 시각을 기준으로 데이터를 해석하는 구조입니다.",
            bullets: [
              "가장 최근 측정값 기준으로 최신값 판단",
              "그래프가 실제 환경 변화 순서대로 표시됨",
              "지연 전송이 발생해도 원래 측정 시각에 반영",
              "measuredAt과 createdAt 차이로 전송 지연 추적 가능",
              "기간 조회가 실제 측정일 기준으로 동작",
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content:
          "센서 데이터 수집 API에서는 측정 시각의 유효성도 검증해야 합니다. 현재보다 미래인 측정 시각은 저장 거부 또는 보류 처리가 필요하고, 너무 오래된 데이터는 별도 정책이 필요합니다. 측정 시각이 없는 경우 거부하거나 서버 수신 시각으로 대체하는 정책을 명확히 해야 합니다. 시간대 기준은 서버와 DB에서 UTC로 통일하고, 화면에서는 지역 시간대로 변환하는 방식이 일반적으로 안전합니다.",
      },
      troubleshootingHeading(3),
      {
        type: "paragraph",
        content:
          "아래 다이어그램은 서버 저장 시각만 기준으로 데이터를 처리할 때 지연 전송된 과거 데이터가 현재 상태처럼 오해되는 흐름입니다. 게이트웨이가 10:00 측정값을 10:05에 재전송하면 서버는 이를 10:05 시점의 값으로 처리하게 됩니다.",
      },
      {
        type: "code",
        language: "mermaid",
        filename: "before-timestamp-separation.mermaid",
        code: "sequenceDiagram\n    participant Sensor\n    participant Gateway\n    participant API\n    participant DB\n    participant Dashboard\n\n    Sensor->>Gateway: 10:00 측정값 생성\n    Gateway--xAPI: 네트워크 지연으로 전송 실패\n    Gateway->>API: 10:05에 과거 데이터 재전송\n    API->>DB: 저장 시각 10:05로 저장\n    Dashboard->>DB: 최신 데이터 조회\n    DB-->>Dashboard: 10:05 저장 데이터 반환\n    Dashboard-->>Dashboard: 과거 측정값을 현재값처럼 표시",
      },
      {
        type: "paragraph",
        content:
          "해결 후 구조에서는 measuredAt과 createdAt이 분리됩니다. 대시보드는 measuredAt 기준으로 정렬하고 최신값을 판단합니다. createdAt은 저장 추적과 장애 분석에 활용됩니다.",
      },
      {
        type: "code",
        language: "mermaid",
        filename: "after-timestamp-separation.mermaid",
        code: "flowchart TD\n    A[Sensor Measurement] --> B[measuredAt 생성]\n    B --> C[Gateway 전송]\n    C --> D[API 수신]\n    D --> E[createdAt 기록]\n    D --> F[(DB 저장)]\n\n    F --> G[Dashboard Query]\n    G --> H[Order by measuredAt]\n    H --> I[실제 측정 순서대로 표시]",
      },
      troubleshootingHeading(4),
      {
        type: "paragraph",
        content:
          "실제 테스트 코드와 로그가 남아 있지 않기 때문에, 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증에서 가장 중요한 것은 저장 순서와 조회 순서를 분리해서 확인하는 것입니다.",
      },
      {
        type: "list",
        items: [
          "정상 순서 전송 → 측정 시각 순서대로 저장 및 조회",
          "지연 전송(과거 measuredAt 데이터가 늦게 도착) → 그래프에서 원래 시간 위치에 표시",
          "최신값 조회(늦게 도착한 과거 데이터 포함) → measuredAt 기준 최신값 반환",
          "기간 조회(특정 날짜 범위 선택) → measuredAt 기준으로 필터링",
          "미래 시각 데이터(현재보다 미래 measuredAt) → 저장 거부 또는 별도 처리",
          "측정 시각 누락(measuredAt 없음) → 정책에 따라 거부 또는 대체",
          "오래된 데이터 재전송(오래전 measuredAt 데이터 전송) → 정책에 따라 저장 또는 무시",
        ],
      },
      {
        type: "callout",
        variant: "info",
        content:
          "향후 확보하면 좋을 지표: 평균 전송 지연 시간(measuredAt과 createdAt 차이), 최대 전송 지연 시간(네트워크 또는 게이트웨이 장애 추적), 지연 도착 데이터 수(재전송 또는 일시 장애 빈도), 미래 시각 거부 건수(장비 시간 동기화 문제 확인), 측정 시각 누락 건수(게이트웨이 데이터 품질 확인)",
      },
      troubleshootingHeading(5),
      {
        type: "paragraph",
        content:
          "측정 시각과 저장 시각을 분리하면 센서 데이터가 실제 환경 변화 흐름에 맞게 해석될 수 있습니다.",
      },
      {
        type: "cards",
        items: [
          {
            title: "그래프 정렬",
            description:
              "서버 도착 순서 기준에서 → 실제 측정 순서 기준으로",
            badge: "그래프",
          },
          {
            title: "최신값 판단",
            description:
              "늦게 저장된 과거 데이터가 최신값 가능하던 구조에서 → 가장 최근 측정값 기준으로",
            badge: "최신값",
          },
          {
            title: "지연 전송 처리",
            description:
              "현재 데이터처럼 오해 가능하던 구조에서 → 원래 측정 시각에 반영되는 구조로",
            badge: "지연",
          },
          {
            title: "장애 분석",
            description:
              "지연 원인 파악이 어렵던 구조에서 → measuredAt과 createdAt 차이로 추적 가능한 구조로",
            badge: "분석",
          },
        ],
      },
      {
        type: "list",
        items: [
          "대시보드 그래프가 실제 환경 변화 순서를 더 정확히 반영할 수 있습니다.",
          "최신값 조회가 서버 저장 순서가 아니라 실제 측정 시각 기준으로 동작할 수 있습니다.",
          "지연 전송이나 재전송이 발생해도 데이터 해석 왜곡을 줄일 수 있습니다.",
          "측정 시각과 저장 시각 차이를 통해 네트워크 지연이나 게이트웨이 문제를 추적할 수 있습니다.",
          "기간별 통계와 알림 판단의 기준을 명확히 할 수 있습니다.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        content:
          "코드와 운영 로그가 남아 있지 않아 평균 지연 시간, 정렬 오류 개선 건수, 데이터 보정 건수 같은 정량 지표는 확인할 수 없습니다. 이 문서에서는 시간 기준 분리의 구조적 효과를 중심으로 정리했습니다.",
      },
      troubleshootingHeading(6),
      {
        type: "paragraph",
        content:
          "이 문제를 통해 센서 데이터에서 시간은 단순한 메타데이터가 아니라 데이터의 의미를 결정하는 핵심 값이라는 것을 배웠습니다. 일반적인 데이터에서는 createdAt만으로 충분할 수 있지만, 센서 데이터는 실제 물리 환경에서 발생한 이벤트를 기록합니다. measuredAt은 데이터 해석을 위한 시간이고, createdAt은 운영 추적을 위한 시간입니다. 이 둘을 분리하면 대시보드, 통계, 알림 판단, 장애 분석이 서로 다른 목적에 맞게 시간을 사용할 수 있습니다.",
      },
      {
        type: "callout",
        variant: "warning",
        content:
          "측정 이벤트 시간(measuredAt)과 저장 이벤트 시간(createdAt)은 반드시 구분해야 합니다. measuredAt은 '이 환경 값은 언제 측정되었는가'를 묻고, createdAt은 '서버는 이 데이터를 언제 받거나 저장했는가'를 묻습니다. 특히 스마트팜처럼 실제 환경을 다루는 시스템에서는 시간 순서가 곧 상태 변화의 흐름입니다. 시간 기준이 틀어지면 시스템은 맞는 값을 가지고도 잘못된 결론을 낼 수 있습니다.",
      },
      {
        type: "paragraph",
        content:
          "향후 개선 방향: 서버와 센서·게이트웨이 간 시간 동기화 정책(NTP 등)을 마련하면 measuredAt 자체의 신뢰도를 높일 수 있습니다. 측정 시각이 없는 데이터에 대한 처리 정책(거부, 수신 시각 대체, 품질 낮은 데이터로 별도 저장)을 명확히 해야 합니다. measuredAt과 createdAt의 차이를 지연 지표로 활용하면 네트워크 장애, 게이트웨이 버퍼링, 서버 처리 지연을 추적할 수 있습니다. 장기적으로 센서 데이터가 계속 누적된다면 인덱스 전략, 파티셔닝, 집계 테이블 등 시계열 데이터에 맞는 저장 구조를 검토해야 합니다.",
      },
    ],
    relatedNoteSlugs: [
      "smart-farm-cloud-monitoring-architecture",
      "sensor-data-flow-responsibility-separation",
      "sensor-rest-ingestion-validation",
      "duplicate-sensor-data-idempotency",
    ],
  };
