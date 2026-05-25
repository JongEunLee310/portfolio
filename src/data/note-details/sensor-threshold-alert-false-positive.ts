import type { TechnicalNoteDetail } from "@/types/note";
import { sensorThresholdAlertFalsePositive } from "../notes/sensor-threshold-alert-false-positive";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const sensorThresholdAlertFalsePositiveDetail: TechnicalNoteDetail = {
  ...sensorThresholdAlertFalsePositive,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등 센서 데이터를 수집하고 사용자가 대시보드에서 현재 상태를 확인할 수 있도록 하는 시스템이었습니다. 모니터링 시스템의 중요한 역할 중 하나는 센서값이 정상 범위를 벗어났을 때 사용자에게 이상 상태를 알려주는 것입니다. 이때 알림의 핵심 질문은 단순히 '임계치를 넘었는가'가 아니라, '이 값이 실제로 대응이 필요한 환경 이상 상태인가'여야 합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "순간 튐 → 즉시 알림",
          description: "센서 노이즈나 측정 오차로 값이 순간적으로 튀었을 때 실제 이상이 아닌데 알림이 발생하는 구조",
          badge: "오탐",
        },
        {
          title: "경계값 흔들림 → 알림 반복",
          description: "기준값 근처에서 값이 오르내릴 때 알림 발생과 해제가 반복되어 사용자 신뢰를 떨어뜨리는 구조",
          badge: "반복",
        },
        {
          title: "통신 오류 → 잘못된 알림",
          description: "데이터 전송 과정의 오류로 유입된 비정상 값이 환경 이상 알림으로 이어지는 구조",
          badge: "오류",
        },
        {
          title: "지속 이상 = 순간 이상",
          description: "한 번 초과한 값과 시간이 지나도 계속 초과하는 값을 동일하게 처리하여 중요도 구분이 불가능한 구조",
          badge: "미분리",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "스마트팜에서 알림은 단순한 화면 표시에서 끝나지 않을 수 있습니다. 급수, 환기, 조명 제어 같은 후속 동작으로 이어질 수 있기 때문에, 오탐의 영향은 단순 알림 피로보다 더 클 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 '임계치 초과'와 '실제 이상 상태'를 같은 의미로 취급한다는 점입니다. 센서 데이터는 센서 노이즈, 통신 오류, 환경 변화, 경계값 흔들림, 지연 데이터 도착 등 다양한 이유로 일시적으로 흔들릴 수 있습니다. 단순 임계치 비교는 이 흔들림과 실제 지속적인 이상 상태를 구분하지 못합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "조건 구분 부재",
          description: "단일 측정값 초과와 반복·지속 초과를 동일하게 처리하여 순간 튐에 바로 반응",
          badge: "조건",
        },
        {
          title: "상태 관리 없음",
          description: "이미 알림이 발생한 상태인지 추적하지 않아 같은 이상 상태에 대해 반복 알림 가능",
          badge: "상태",
        },
        {
          title: "데이터 품질 미분리",
          description: "습도 150% 같은 데이터 오류값과 환경 이상값을 구분하지 않고 알림 판단으로 넘김",
          badge: "품질",
        },
        {
          title: "복귀 조건 부재",
          description: "이상 상태 해제 기준이 없어 언제 정상으로 돌아왔는지 시스템이 판단할 수 없음",
          badge: "복귀",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "알림이 반복되면 사용자는 알림을 신뢰하지 않게 됩니다. 오탐이 반복되면 실제 환경 이상이 발생했을 때도 알림을 무시하게 되는 알림 피로(Alert Fatigue)가 생깁니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 임계치 알림 조건을 단순 값 비교에서 상태 기반 판단으로 확장하는 것입니다. 이를 위해 알림 판단 전에 데이터 품질 검증을 먼저 수행하고, 단일 초과가 아니라 연속성이나 지속성을 확인하는 조건을 추가합니다. 또한 알림 발생 상태를 추적하고 정상 복귀 조건을 명확히 정의합니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "단순 임계치 비교",
          description: "한 번 초과하면 바로 알림을 발생시키는 구조입니다.",
          bullets: [
            "단일 측정값으로 알림 즉시 발생",
            "센서 노이즈와 실제 이상 구분 불가",
            "경계값 근처에서 알림 반복 가능",
            "데이터 오류값도 알림 판단으로 처리",
            "알림 상태 추적 없음",
            "해제 기준 부재",
          ],
        },
        {
          title: "안정화 조건 적용",
          description: "지속성·연속성을 확인한 후 알림을 발생시키는 구조입니다.",
          bullets: [
            "데이터 품질 검증을 알림 판단 전에 수행",
            "연속 N회 또는 일정 시간 지속 조건 검토",
            "발생 기준과 해제 기준 분리(히스테리시스)",
            "알림 발생 상태 추적으로 중복 알림 제한",
            "정상 복귀 조건 정의",
            "알림과 제어 판단 분리",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "안정화 조건의 구체적인 방식은 연속 N회 초과, 일정 시간 지속, 이동 평균 기반 판단 등 여러 선택지가 있습니다. 초기 프로젝트에서는 구현 복잡도가 낮은 연속 N회 초과 또는 일정 시간 지속 조건이 현실적인 선택이 될 수 있습니다. 발생 기준과 해제 기준을 다르게 두는 히스테리시스 정책은 경계값 흔들림 문제를 줄이는 데 효과적입니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 단순 임계치 비교 방식에서 오탐이 발생하는 흐름입니다. 임계치 초과 여부만 판단하기 때문에 순간적인 튐과 실제 지속 이상 상태를 구분하지 못합니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "threshold-alert-false-positive-before.mermaid",
      code: "flowchart TD\n    A[Sensor Data Received] --> B[Compare with Threshold]\n    B --> C{Value Exceeds Threshold?}\n\n    C -- No --> D[Normal State]\n    C -- Yes --> E[Trigger Alert Immediately]\n\n    E --> F[Possible False Alert]\n    F --> G[Alert Fatigue Increases]",
    },
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 해결 후 기대하는 흐름입니다. 임계치 초과 이후에도 바로 알림을 보내지 않고, 데이터 품질을 먼저 확인하고 연속성이나 지속성을 검토한 뒤 알림을 발생시킵니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "threshold-alert-false-positive-after.mermaid",
      code: "flowchart TD\n    A[Sensor Data Received] --> B[Validate Data Quality]\n    B --> C{Valid Sensor Data?}\n\n    C -- No --> D[Data Error / Skip Alert]\n    C -- Yes --> E[Compare with Threshold]\n\n    E --> F{Exceeded?}\n    F -- No --> G[Normal State]\n    F -- Yes --> H[Check Persistence or Consecutive Count]\n\n    H --> I{Condition Met?}\n    I -- No --> J[Hold Alert]\n    I -- Yes --> K[Trigger Alert]\n    K --> L[Track Alert State]\n    L --> M{Returned to Normal?}\n    M -- Yes --> N[Clear Alert State]",
    },
    {
      type: "comparison",
      items: [
        {
          title: "문제 구조",
          description: "단순 비교로 즉시 알림을 발생시키는 흐름입니다.",
          bullets: [
            "센서 데이터 수신 → 임계치 비교 → 즉시 알림",
            "데이터 품질 검증 없음",
            "순간 튐 = 지속 이상 상태로 동일 처리",
            "상태 추적 없음 → 중복 알림 가능",
          ],
        },
        {
          title: "개선 구조",
          description: "안정화 조건을 거쳐 알림을 발생시키는 흐름입니다.",
          bullets: [
            "품질 검증 → 임계치 비교 → 지속성 확인 → 알림",
            "데이터 오류는 알림 전에 분리",
            "연속·지속 조건으로 순간 튐 완화",
            "상태 추적 → 중복 알림 제한 → 복귀 감지",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드와 알림 로그가 남아 있지 않기 때문에, 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증에서 중요한 것은 '임계치를 넘으면 알림이 발생하는가'뿐 아니라, '임계치를 한 번 넘었다고 바로 알림이 발생하지 않는가'도 확인하는 것입니다.",
    },
    {
      type: "list",
      items: [
        "정상 범위 데이터: 기준값 이내 → 알림 없음",
        "단일 순간 초과: 한 번만 임계치 초과 → 알림 보류 또는 미발생",
        "연속 초과: N회 연속 임계치 초과 → 알림 발생",
        "지속 초과: 일정 시간 이상 초과 상태 유지 → 알림 발생",
        "경계값 흔들림: 기준값 근처에서 반복 변동 → 알림 반복 방지",
        "검증 실패 데이터: 습도 150%, 조도 -1 → 알림이 아니라 데이터 오류 처리",
        "정상 복귀: 이상 상태 이후 정상 범위 유지 → 알림 상태 해제",
        "중복 알림: 이미 알림 발생 상태에서 추가 초과 → 중복 알림 제한",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 알림 발생 건수, 단일 튐으로 발생한 오탐 의심 건수, 정상 복귀 처리 건수, 중복 알림 차단 건수, 알림 발생까지의 지연 시간(안정화 조건의 영향), 센서 오류 분류 건수(데이터 품질 문제와 환경 이상 분리 효과)",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "임계치 알림 조건을 단순 비교에서 지속성과 연속성을 고려하는 방식으로 설계하면, 순간적인 센서 튐이나 데이터 품질 문제로 인한 오탐을 줄일 수 있습니다. 알림 조건을 더 설명 가능하게 만들고, 사용자 신뢰도를 높이는 방향으로 구조를 전환할 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "알림 발생 기준",
          description:
            "한 번 초과하면 바로 알림을 보내던 구조에서 → 연속 또는 지속 조건을 확인하는 구조로",
          badge: "기준",
        },
        {
          title: "데이터 품질 분리",
          description:
            "센서 오류값도 알림 판단으로 넘기던 구조에서 → 품질 검증을 먼저 수행하고 오류는 별도 처리하는 구조로",
          badge: "품질",
        },
        {
          title: "알림 상태 관리",
          description:
            "알림 상태를 추적하지 않아 중복 알림이 가능했던 구조에서 → 발생 상태를 기록하고 중복을 제한하는 구조로",
          badge: "상태",
        },
        {
          title: "복귀 조건 정의",
          description:
            "이상 상태 해제 기준이 없던 구조에서 → 발생 기준과 해제 기준을 분리하는 히스테리시스 방식으로",
          badge: "복귀",
        },
      ],
    },
    {
      type: "list",
      items: [
        "순간적인 센서값 튐으로 인한 오탐을 줄일 수 있습니다.",
        "알림 발생 기준을 더 설명 가능하게 만들 수 있습니다.",
        "센서 오류와 실제 환경 이상 상태를 단계적으로 구분할 수 있습니다.",
        "중복 알림을 줄여 사용자 피로도를 낮출 수 있습니다.",
        "원격 제어로 이어지기 전 알림 판단의 안정성을 높일 수 있습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 알림 로그가 남아 있지 않아 오탐 감소율, 중복 알림 감소 건수 같은 정량 지표는 확인할 수 없습니다. 이 문서에서는 알림 조건 설계의 구조적 개선 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 모니터링 시스템에서 알림은 단순한 조건문이 아니라 사용자의 신뢰를 다루는 기능이라는 것입니다. 오탐이 반복되면 사용자는 알림을 신뢰하지 않게 되고, 실제 환경 이상이 발생했을 때도 알림이 장식음처럼 들릴 수 있습니다. 알림은 충분히 민감해야 하지만, 동시에 충분히 신중해야 합니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "입력 검증, 알림 판단, 제어 판단은 분리되어야 합니다. 입력 검증은 '이 값이 데이터로 저장 가능한가'(습도 150%는 저장 불가), 알림 판단은 '이 값이 대응이 필요한 상태인가'(습도 25%가 지속되면 건조 알림), 제어 판단은 '장비를 실제로 동작시켜야 하는가'(토양 수분 부족 지속 시 급수 검토)입니다. 이 세 판단을 하나의 단계에서 처리하면 데이터 품질 문제와 환경 이상 문제가 섞이게 됩니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 작물 종류나 생장 단계별로 임계치를 다르게 설정하면 더 정밀한 알림이 가능합니다. NORMAL, WARNING, CRITICAL, RECOVERED 같은 상태 기반 알림 모델을 도입하면 알림 흐름을 더 명확히 관리할 수 있습니다. 이동 평균이나 중앙값 기반 판단을 검토하면 센서 노이즈 영향을 줄일 수 있습니다. 알림 로그를 수집해 실제 사용자 대응 여부, 정상 복귀 시간, 반복 알림 횟수를 기록하면 알림 정책을 개선하는 근거가 됩니다.",
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
  ],
};
