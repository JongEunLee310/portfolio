import type { TechnicalNoteDetail } from "@/types/note";
import { sensorRestIngestionValidation } from "../notes/sensor-rest-ingestion-validation";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const sensorRestIngestionValidationDetail: TechnicalNoteDetail = {
  ...sensorRestIngestionValidation,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등 생장 환경 데이터를 센서로부터 수집했습니다. 이 데이터는 사람이 직접 입력하는 것이 아니라 장비 또는 게이트웨이를 통해 주기적으로 서버에 전송됩니다. 따라서 서버는 들어오는 데이터가 항상 정상이라고 가정해서는 안 되었습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "필수값 누락",
          description: "온도 값 없음, 센서 ID 없음 — 저장 후 데이터 해석 불가",
          badge: "누락",
        },
        {
          title: "범위 초과",
          description: "습도 150%, 온도 -100℃ — 대시보드와 알림 판단 왜곡",
          badge: "범위",
        },
        {
          title: "형식 오류",
          description: "숫자 대신 문자열 전달 — 저장 실패 또는 런타임 오류",
          badge: "형식",
        },
        {
          title: "단위 불일치",
          description: "섭씨와 화씨 혼동 — 실제 환경과 다른 값 표시",
          badge: "단위",
        },
        {
          title: "비정상 급변",
          description: "1초 사이 온도 30℃ 상승 — 센서 오류를 환경 이상으로 오인",
          badge: "급변",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "초기 설계에서 센서 수집 API를 단순히 '요청을 받아 DB에 저장하는 기능'으로만 보면, 잘못된 데이터가 저장소까지 들어갈 수 있습니다. 한 번 저장된 잘못된 데이터는 최신값 조회, 그래프 표시, 임계치 알림, 원격 제어 판단에 연쇄적으로 영향을 줄 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 센서 데이터 수집 API를 '데이터 저장 입구'로만 보고, '데이터 품질을 보장하는 경계'로 보지 않았다는 점입니다. 일반적인 사용자 입력 API에서는 프론트엔드에서 어느 정도 입력 제한을 걸 수 있지만, 센서 수집 API는 장비나 게이트웨이에서 직접 호출되므로 서버가 최종 검증 책임을 가져야 합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "장비 데이터 신뢰 불가",
          description: "센서 오류, 통신 오류, 단위 오류가 발생할 수 있어 들어오는 값을 그대로 신뢰할 수 없습니다.",
          badge: "장비",
        },
        {
          title: "API 경계 검증 부족",
          description: "서버가 요청을 그대로 저장하면 데이터 품질이 저장소 수준으로 낮아집니다.",
          badge: "경계",
        },
        {
          title: "센서 타입별 기준 부재",
          description: "모든 값을 같은 기준으로 처리하면 온도, 습도, 조도 각각의 도메인 의미가 훼손됩니다.",
          badge: "기준",
        },
        {
          title: "저장 후 정정 어려움",
          description: "잘못된 데이터가 이력에 남으면 이후 그래프, 통계, 알림 판단이 왜곡됩니다.",
          badge: "이력",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "형식 검증과 도메인 검증은 목적이 다릅니다. 형식 검증은 저장 가능한 데이터 형태인지 확인하고, 도메인 검증은 스마트팜 환경에서 의미 있는 값인지 확인합니다. 예를 들어 150은 숫자 형식으로는 올바르지만 습도 값으로는 비정상입니다. 반대로 -5도 숫자 형식은 맞지만 조도나 토양 수분 값으로는 의미가 없습니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 REST 수집 API에 센서 데이터 검증 단계를 명확히 두는 것입니다. 잘못된 데이터는 저장 이후보다 저장 전에 막는 비용이 적으며, 저장소에 비정상 값이 섞이면 후속 기능마다 방어 로직을 반복해서 넣어야 하는 문제가 생깁니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "검증 부족 구조",
          description: "요청을 그대로 저장하는 구조입니다.",
          bullets: [
            "비정상 값이 DB에 그대로 저장될 수 있음",
            "대시보드에 오염된 데이터가 표시될 수 있음",
            "임계치 알림이 잘못된 값 기준으로 발생 가능",
            "센서 오류와 실제 환경 이상을 구분하기 어려움",
            "후속 기능마다 방어 로직이 반복됨",
          ],
        },
        {
          title: "검증 책임 분리 구조",
          description: "검증을 통과한 데이터만 저장하는 구조입니다.",
          bullets: [
            "검증 통과 데이터만 저장소에 저장됨",
            "대시보드와 알림이 신뢰 가능한 데이터 기준으로 동작",
            "검증 실패와 환경 이상을 별도로 추적 가능",
            "센서 타입별 규칙을 독립적으로 정의하고 확장 가능",
            "검증 실패 로그를 통해 장비 오류 추적 가능",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "검증 실패와 환경 이상을 구분하는 것도 중요합니다. 습도 150%는 저장 전에 차단해야 할 비정상 데이터입니다. 반면 습도 25%는 저장 가능한 값이지만 건조 상태 알림의 대상이 될 수 있습니다. 이 둘을 같은 '이상'으로 처리하면 데이터 품질 문제와 환경 상태 문제를 구분하기 어려워집니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 검증이 부족할 때 잘못된 데이터가 저장소와 모니터링 기능 전체로 전파되는 흐름을 나타냅니다. REST API가 잘못된 데이터를 막지 못하면 DB 이후의 모든 기능이 오염된 데이터를 기준으로 동작합니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "before-validation.mermaid",
      code: "flowchart TD\n    A[Sensor or Gateway] --> B[REST Ingestion API]\n    B --> C[Save without Validation]\n    C --> D[(Sensor Data DB)]\n    D --> E[Dashboard]\n    D --> F[Threshold Evaluation]\n    F --> G[Alert or Control Decision]\n\n    C -. Invalid Data .-> D\n    D -. Distorted View .-> E\n    F -. Wrong Decision .-> G",
    },
    {
      type: "paragraph",
      content:
        "해결 후 구조에서는 검증 실패 데이터가 저장소로 들어가지 않습니다. 대시보드, 임계치 판단, 알림, 제어 기능은 최소한의 품질 기준을 통과한 데이터를 기준으로 동작합니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "after-validation.mermaid",
      code: "flowchart TD\n    A[Sensor or Gateway] --> B[REST Ingestion API]\n    B --> C{Validate Sensor Data}\n\n    C -- Valid --> D[Save Sensor Data]\n    D --> E[(Sensor Data DB)]\n    E --> F[Dashboard]\n    E --> G[Threshold Evaluation]\n\n    C -- Invalid --> H[Reject Request]\n    H --> I[Error Response or Log]",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드가 남아 있지 않기 때문에 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증 시 중요한 것은 '비정상 데이터가 저장되지 않았는가'와 '저장 가능한 환경 이상값은 차단하지 않았는가'를 함께 확인하는 것입니다.",
    },
    {
      type: "list",
      items: [
        "정상 온도·습도 데이터 → 저장 성공",
        "습도 150% 입력 → 저장 거부",
        "조도 음수(-1) 입력 → 저장 거부",
        "value 필드 누락 → 저장 거부",
        "sensorId 누락 → 저장 거부",
        "value가 문자열 형식 → 저장 거부",
        "습도 25% (저장 가능 범위이지만 임계치 초과) → 저장 성공 후 모니터링 판단으로 전달",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 검증 실패 건수(센서·게이트웨이 품질 지표), 오류 유형별 분류(누락/범위초과/형식오류), 비정상 값이 차단되지 않았을 때 대시보드 표시 왜곡 여부, 임계치 알림 오탐률",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "입력값 검증 책임을 수집 API 앞단에 두면 잘못된 센서 데이터가 저장소와 후속 기능으로 전파되는 것을 줄일 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "데이터 저장",
          description:
            "요청값을 그대로 저장할 위험에서 → 검증 통과 데이터만 저장되는 구조로",
          badge: "저장",
        },
        {
          title: "대시보드 표시",
          description:
            "비정상 값 표시 가능성에서 → 데이터 품질이 보장된 표시로",
          badge: "조회",
        },
        {
          title: "알림 판단",
          description:
            "잘못된 값으로 오탐이 발생하던 구조에서 → 검증 실패와 환경 이상이 분리된 구조로",
          badge: "알림",
        },
        {
          title: "원인 추적",
          description:
            "이상값 원인 구분이 어렵던 구조에서 → 센서 오류와 환경 이상을 구분 가능한 구조로",
          badge: "추적",
        },
      ],
    },
    {
      type: "list",
      items: [
        "비정상 센서 값이 DB에 누적되는 것을 방지할 수 있습니다.",
        "대시보드가 신뢰 가능한 데이터를 기준으로 표시될 수 있습니다.",
        "임계치 알림이 잘못된 입력값에 의해 발생하는 것을 줄일 수 있습니다.",
        "센서 오류와 실제 환경 이상 상태를 구분할 수 있습니다.",
        "이후 센서 타입이 추가되어도 검증 기준을 확장하기 쉬워집니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 운영 로그가 남아 있지 않아 실제 차단 건수, 오류율 같은 정량 지표는 확인할 수 없습니다. 이 문서에서는 검증 계층을 통해 데이터 신뢰성을 높일 수 있었다는 구조적 결과 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 센서 데이터 수집 API는 단순한 저장 API가 아니라, 시스템 전체 데이터 품질을 결정하는 경계라는 것을 배웠습니다. 스마트팜에서 센서 데이터는 대시보드, 알림, 원격 제어 판단 모두의 기반이 됩니다. 잘못된 데이터가 저장되는 순간 문제는 저장소 안에만 머물지 않고 화면, 알림, 제어 판단으로 계속 전파됩니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "입력 검증, 임계치 판단, 장비 진단은 반드시 구분해야 합니다. 입력 검증은 '이 값은 저장 가능한가'를 묻고, 임계치 판단은 '이 값은 환경 이상을 의미하는가'를 묻습니다. 장비 진단은 '센서 자체에 문제가 있는가'를 따로 추적합니다. 이 경계를 명확히 하면 데이터 품질 문제, 환경 이상 문제, 장비 오류 문제를 별도로 바라볼 수 있습니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 센서 타입별 검증 규칙을 설정값으로 분리하면 운영 유연성이 높아집니다. 검증 실패 데이터를 별도 진단 로그로 남기면 특정 센서의 반복적인 이상값 발생 여부를 추적할 수 있습니다. 단순 범위 검증 외에 이전 값 대비 변화량 검증을 추가하면 센서 오류를 더 정확하게 걸러낼 수 있습니다. 검증 실패율과 환경 이상 발생률을 별도 지표로 관리하면 운영자가 문제 원인을 더 빠르게 파악할 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "smart-farm-cloud-monitoring-architecture",
    "sensor-data-flow-responsibility-separation",
  ],
};
