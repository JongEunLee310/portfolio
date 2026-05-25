import type { TechnicalNoteDetail } from "@/types/note";
import { abnormalSensorValueDetection } from "../notes/abnormal-sensor-value-detection";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const abnormalSensorValueDetectionDetail: TechnicalNoteDetail = {
  ...abnormalSensorValueDetection,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등의 센서 데이터를 수집하고 작물 생장 환경을 대시보드로 확인할 수 있도록 하는 시스템이었습니다. 모니터링에서 중요한 기능 중 하나는 센서값이 평소와 다르거나 기준 범위를 벗어났을 때 이를 감지하는 것입니다. 그런데 '이상값'이라는 표현 안에는 서로 다른 두 가지 상황이 섞여 있습니다. 하나는 습도 150%, 조도 -1처럼 물리적으로 불가능한 센서 오류이고, 다른 하나는 토양 수분 부족이나 고온 지속처럼 실제 환경 대응이 필요한 상태입니다. 이 둘을 구분하지 않으면 센서 오류를 환경 이상으로 오해하거나, 실제 이상 상태를 단순 오류로 넘길 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "센서 오류 → 환경 알림",
          description: "습도 150% 같은 물리적으로 불가능한 값이 과습 알림으로 이어지는 구조",
          badge: "오탐",
        },
        {
          title: "환경 이상 → 오류 처리",
          description: "실제 건조 또는 고온 상태가 센서 이상으로만 분류되어 대응이 누락되는 구조",
          badge: "미분류",
        },
        {
          title: "순간 급변 = 지속 이상",
          description: "센서 튐으로 인한 단발성 급변과 실제 환경 변화를 동일하게 처리하는 구조",
          badge: "미분리",
        },
        {
          title: "데이터 미수신 → 정상 표시",
          description: "일정 시간 새 데이터가 없어도 마지막 정상값을 현재 상태로 표시하는 구조",
          badge: "누락",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "스마트팜에서 센서값은 단순 표시용 데이터로 끝나지 않습니다. 알림, 통계, 원격 제어 판단의 근거가 될 수 있기 때문에 이상값을 잘못 해석하면 대시보드 오류에서 끝나지 않고 잘못된 제어 동작까지 이어질 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 '값이 이상하다'는 표현 안에 데이터 오류, 센서 또는 통신 이상, 실제 환경 이상이라는 서로 다른 유형이 섞여 있다는 점입니다. 이 세 유형은 대응 방식이 다릅니다. 데이터 오류는 저장을 차단하거나 진단 로그를 남기는 처리가 필요하고, 센서 또는 통신 이상은 장비 점검 알림이 필요하며, 환경 이상은 사용자 알림이나 제어 판단으로 이어져야 합니다. 분류 기준이 없으면 모든 이상값이 같은 후속 흐름을 타게 됩니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "이상값 정의 미분리",
          description: "센서 오류와 환경 이상을 같은 이상으로 취급해 알림 오탐이 발생하는 원인",
          badge: "분류",
        },
        {
          title: "데이터 품질 판단 부족",
          description: "물리적으로 불가능한 값도 환경 판단 로직으로 넘겨 잘못된 대시보드 표시로 이어지는 원인",
          badge: "품질",
        },
        {
          title: "급격한 변화 기준 부재",
          description: "순간적인 센서 튐을 실제 환경 변화로 오해하는 원인",
          badge: "기준",
        },
        {
          title: "지속성 확인 부족",
          description: "단발성 이상과 지속적 이상을 구분하지 못해 알림 신뢰도가 낮아지는 원인",
          badge: "지속성",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "센서 데이터는 물리 세계의 값을 소프트웨어로 가져오는 경계에 있습니다. 이 경계에서는 값이 틀릴 수도 있고, 늦게 도착할 수도 있고, 아예 오지 않을 수도 있습니다. '들어온 값을 그대로 믿는 구조'가 아니라 값의 신뢰도를 평가하는 구조가 필요합니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 센서값을 단순 정상/이상으로 나누는 것이 아니라, 이상 유형을 분류하는 것입니다. 물리적 유효 범위를 먼저 확인해 말이 되지 않는 값은 환경 이상으로 보지 않고, 이전 값 대비 급격한 변화는 의심 데이터로 분류해 다음 측정을 확인합니다. 일정 시간 또는 연속 횟수 이상 지속될 때 환경 이상으로 판단하고, 데이터 미수신은 별도 이상 유형으로 다룹니다. 이렇게 분류 결과에 따라 로그, 알림, 제어 판단을 다르게 처리합니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "단순 이상 처리",
          description: "모든 이상값을 동일한 환경 문제로 처리하는 구조입니다.",
          bullets: [
            "물리적으로 불가능한 값도 환경 알림 판단으로 넘김",
            "순간 튐과 지속 이상을 동일하게 처리",
            "데이터 오류, 센서 이상, 환경 이상 구분 없음",
            "미수신 상태를 별도 유형으로 다루지 않음",
            "후속 처리(로그, 알림, 제어)가 분리되지 않음",
            "잘못된 제어 판단으로 이어질 수 있음",
          ],
        },
        {
          title: "이상 유형 분류",
          description: "이상 원인을 먼저 분류한 뒤 후속 처리를 분리하는 구조입니다.",
          bullets: [
            "물리적 유효 범위 확인 → 데이터 오류 분리",
            "이전 값 대비 변화량 확인 → 의심 데이터 보류",
            "지속성 확인 → 환경 이상 확정",
            "미수신 상태를 별도 이상 유형으로 감지",
            "분류 결과에 따라 로그, 알림, 제어 판단 분리",
            "진단 로그로 센서 오류 이력 추적",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "이상값 분류 단계는 정상 데이터, 검증 실패 데이터(물리적으로 불가능), 의심 데이터(급격한 변화), 환경 이상 후보(임계치 초과, 지속성 미확인), 환경 이상 확정(일정 시간 또는 연속 횟수 이상 지속), 센서 미수신(일정 시간 새 데이터 없음)으로 구성합니다. 센서별 정상 범위와 변화량 기준은 센서 스펙과 측정 주기에 따라 달라지므로 설정값으로 분리해 관리하는 것이 적합합니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 이상값을 분류하지 않고 바로 환경 이상으로 처리했을 때의 문제 흐름입니다. 센서 오류, 통신 오류, 실제 환경 이상이 모두 같은 경로를 타고 알림과 제어 판단으로 이어집니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "abnormal-sensor-value-detection-before.mermaid",
      code: "flowchart TD\n    A[Sensor Data Received] --> B[Abnormal Value Detected]\n    B --> C[Treat as Environmental Issue]\n    C --> D[Trigger Alert]\n    C --> E[Consider Control Action]\n\n    D --> F[False Alert Risk]\n    E --> G[Wrong Control Risk]",
    },
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 이상 유형을 단계적으로 분류하는 기대 흐름입니다. 물리적 유효성을 먼저 확인하고, 급격한 변화는 의심 데이터로 보류하며, 임계치 초과가 지속될 때만 환경 이상으로 확정합니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "abnormal-sensor-value-detection-after.mermaid",
      code: "flowchart TD\n    A[Sensor Data Received] --> B{Physically Valid?}\n\n    B -- No --> C[Sensor or Data Error]\n    C --> D[Record Diagnostic Log]\n\n    B -- Yes --> E{Sudden Change?}\n    E -- Yes --> F[Suspicious Data]\n    F --> G[Wait for Next Measurement]\n\n    E -- No --> H{Threshold Exceeded?}\n    H -- No --> I[Normal State]\n    H -- Yes --> J{Sustained?}\n\n    J -- No --> K[Hold Alert]\n    J -- Yes --> L[Environmental Abnormal State]\n    L --> M[Trigger Alert]",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드와 운영 로그가 남아 있지 않기 때문에, 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증에서 중요한 것은 '이상값을 감지했는가'뿐 아니라 '이상값의 종류를 올바르게 분류했는가'입니다.",
    },
    {
      type: "list",
      items: [
        "정상 데이터: 허용 범위 안의 값 → 정상으로 처리",
        "물리적 범위 초과: 습도 150%, 조도 -1 → 데이터 오류로 분류, 환경 알림 없음",
        "단발성 급변: 이전 값 대비 큰 변화 1회 → 의심 데이터로 분류, 알림 보류",
        "급변 후 정상 복귀: 튄 값 이후 정상 범위 복귀 → 환경 이상 알림 없음",
        "지속적 임계치 초과: 여러 번 연속 기준 초과 → 환경 이상으로 확정, 알림 발생",
        "데이터 미수신: 일정 시간 새 데이터 없음 → 센서 또는 통신 이상으로 분류",
        "환경 이상 후 복구: 이상 상태 지속 후 정상 범위 복귀 → 복구 상태로 전환",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 검증 실패 데이터 건수(센서 오류 빈도), 의심 데이터 건수(순간 튐 빈도), 환경 이상 확정 건수(실제 알림 대상), 미수신 상태 발생 건수(네트워크/장비 장애 빈도), 오탐 의심 알림 건수(알림 정책 개선 근거)",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "센서 이상값을 유형별로 분류하면 잘못된 데이터가 실제 환경 이상으로 오해되는 문제를 줄이고, 대시보드와 알림, 제어 판단의 신뢰도를 높일 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "데이터 오류 처리",
          description:
            "습도 150%, 조도 -1 같은 값이 환경 알림으로 이어지던 구조에서 → 데이터 오류로 분류하고 진단 로그를 남기는 구조로",
          badge: "오탐 감소",
        },
        {
          title: "의심 데이터 보류",
          description:
            "순간 급변을 바로 환경 이상으로 처리하던 구조에서 → 다음 측정 확인을 거쳐 판단하는 구조로",
          badge: "안정성",
        },
        {
          title: "환경 이상 확정",
          description:
            "단발성 이상과 지속 이상을 구분하기 어렵던 구조에서 → 지속성 확인 후 환경 이상을 확정하는 구조로",
          badge: "정확도",
        },
        {
          title: "미수신 상태 감지",
          description:
            "마지막 정상값을 현재 상태로 표시하던 구조에서 → 미수신 상태를 별도 이상 유형으로 표시하는 구조로",
          badge: "신뢰도",
        },
      ],
    },
    {
      type: "list",
      items: [
        "센서 오류와 실제 환경 이상을 구분할 수 있습니다.",
        "잘못된 센서값으로 인한 오탐을 줄일 수 있습니다.",
        "대시보드에서 데이터 신뢰도를 더 명확히 표현할 수 있습니다.",
        "원격 제어 판단에 사용되는 데이터의 안정성을 높일 수 있습니다.",
        "센서 또는 통신 문제를 별도 운영 이슈로 추적할 수 있습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 운영 로그가 남아 있지 않아 오탐 감소율, 센서 오류 감지 건수 같은 정량 결과는 확인할 수 없습니다. 이 문서에서는 센서 데이터 해석의 정확도를 높이기 위한 분류 설계 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 센서값이 이상하다는 말만으로는 충분하지 않다는 것입니다. 스마트팜 시스템에서 이상값은 물리적으로 가능한 값인가, 이전 값과 비교해 자연스러운가, 이 상태가 지속되고 있는가, 이 값을 기준으로 장비를 제어해도 되는가라는 네 가지 질문을 거쳐야 합니다. 이 질문들을 분리하지 않으면 센서 오류, 통신 장애, 실제 환경 이상, 제어 필요 상태가 하나로 섞이게 됩니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "입력 검증, 이상 감지, 제어 판단은 분리되어야 합니다. 입력 검증은 '이 값이 저장 가능한 데이터인가'(습도 150%는 저장 불가), 이상 감지는 '이 값이 환경적으로 의미 있는 이상인가'(습도 25%가 지속되면 건조 후보), 제어 판단은 '신뢰도가 확인된 상태를 기준으로 장비를 동작시켜야 하는가'입니다. 이 세 판단을 하나의 단계에서 처리하면 데이터 품질 문제와 환경 이상 문제가 섞이게 됩니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 센서별 정상 범위와 변화량 기준을 설정값으로 분리하면 온도, 습도, 조도, 토양 수분 각각의 특성을 반영할 수 있습니다. 이상값을 버리지 않고 진단 데이터로 남기면 반복적으로 오류값을 보내는 센서를 추적해 교체 시점을 파악할 수 있습니다. 미수신 상태를 대시보드에 명확히 표시하면 마지막 정상값이 오래된 상황을 현재 상태로 오해하는 문제를 줄일 수 있습니다. 장기적으로는 이동 평균, 중앙값 필터 같은 방식을 검토할 수 있지만, 초기 단계에서는 명확한 규칙 기반 분류가 설명 가능성과 유지보수 측면에서 더 적합합니다.",
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
  ],
};
