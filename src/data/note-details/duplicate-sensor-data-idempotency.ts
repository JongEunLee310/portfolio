import type { TechnicalNoteDetail } from "@/types/note";
import { duplicateSensorDataIdempotency } from "../notes/duplicate-sensor-data-idempotency";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const duplicateSensorDataIdempotencyDetail: TechnicalNoteDetail = {
  ...duplicateSensorDataIdempotency,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 센서 또는 게이트웨이에서 온도, 습도, 조도, 토양 수분 등의 측정값을 주기적으로 서버에 전송하는 구조를 목표로 했습니다. 사용자가 직접 입력하는 데이터가 아니라 장비가 자동으로 전송하기 때문에, 네트워크 상태나 게이트웨이 재시도 로직에 따라 같은 측정값이 여러 번 전송될 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "네트워크 지연",
          description: "게이트웨이가 서버 응답을 받기 전에 timeout으로 판단하고 같은 데이터를 재전송",
          badge: "지연",
        },
        {
          title: "응답 유실",
          description: "서버는 저장했지만 게이트웨이가 성공 응답을 받지 못해 실패로 판단",
          badge: "유실",
        },
        {
          title: "게이트웨이 재시도",
          description: "안정적 수집을 위해 실패로 판단한 요청을 retry — 서버에 같은 데이터 재도달",
          badge: "재시도",
        },
        {
          title: "장비 재부팅",
          description: "마지막 전송 데이터를 복구 방식으로 다시 보내는 장비 동작",
          badge: "재부팅",
        },
        {
          title: "배치 재전송",
          description: "누락 방지를 위해 일정 구간 데이터를 묶어 재전송하는 정책",
          badge: "배치",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "중복 저장은 단순히 저장 공간을 더 쓰는 문제가 아닙니다. 같은 고온 데이터가 여러 번 저장되면 실제보다 고온 상태가 더 오래 지속된 것처럼 보일 수 있습니다. 반대로 정상 데이터가 중복 저장되면 이상 상태 비율과 평균값이 실제보다 완화되어 보일 수 있습니다. 대시보드, 그래프, 통계, 임계치 알림, 원격 제어 판단 모두가 이 왜곡의 영향을 받습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 센서 데이터 수집 API가 네트워크 재시도 가능성을 고려하지 않은 채, 요청 단위를 곧바로 측정 이벤트 단위로 취급했다는 점입니다. REST API에서는 같은 POST 요청이 여러 번 전송될 수 있으며, 특히 장비와 서버가 네트워크를 통해 통신하는 환경에서는 이 상황이 흔합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "측정 이벤트 식별자 부재",
          description: "같은 데이터인지 판단할 기준이 없어 재전송마다 새 데이터로 저장",
          badge: "식별",
        },
        {
          title: "수신 시각 기준 저장",
          description: "재전송마다 수신 시각이 달라지므로, 같은 측정값이 다른 데이터처럼 저장",
          badge: "시각",
        },
        {
          title: "재시도를 비정상 요청으로 취급",
          description: "재전송은 데이터 누락을 막기 위한 정상 복구 전략인데, 서버가 이를 인식하지 못함",
          badge: "재전송",
        },
        {
          title: "저장 전 존재 여부 미확인",
          description: "동일 측정 이벤트 저장 여부를 확인하지 않아 중복 INSERT 발생",
          badge: "확인",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "중복 요청이 항상 클라이언트의 잘못은 아닙니다. 게이트웨이가 재시도하는 것은 데이터 누락을 막기 위한 정상적인 안정화 전략일 수 있습니다. 따라서 서버는 재시도를 허용하되, 같은 측정 이벤트가 중복 저장되지 않도록 멱등성 기준을 가져야 합니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 센서 수집 API에 멱등성 기준을 도입하는 것입니다. '재시도가 발생하지 않게 만들기'보다 '재시도가 발생해도 결과가 한 번만 반영되게 만들기'가 더 현실적입니다. 멱등성 기준에서 가장 중요한 설계 결정은 '무엇을 같은 데이터로 볼 것인가'입니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "멱등성 기준 없음",
          description: "요청 단위를 곧바로 데이터 단위로 취급하는 구조입니다.",
          bullets: [
            "재전송마다 새 데이터로 INSERT",
            "DB에 같은 측정값이 여러 건 누적 가능",
            "대시보드에 중복 데이터 표시될 수 있음",
            "통계 평균·횟수·지속 시간 왜곡",
            "재시도로 인한 임계치 알림 오탐 가능",
          ],
        },
        {
          title: "멱등성 기준 적용",
          description: "측정 이벤트 단위로 저장 여부를 판단하는 구조입니다.",
          bullets: [
            "동일 측정 이벤트 재전송 시 중복 저장 방지",
            "DB에는 실제 측정 이벤트 기준으로 1건만 저장",
            "대시보드·그래프가 실제 측정 흐름 기반으로 표시",
            "통계 계산 신뢰도 향상",
            "중복 요청 로그로 네트워크·장비 문제 추적 가능",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "중복 요청에 대한 응답 정책도 함께 정해야 합니다. 이미 처리된 요청을 오류로 반환하면 게이트웨이가 계속 재시도하는 악순환이 생길 수 있습니다. 스마트팜 센서 수집에서는 중복 요청을 무시하고 성공으로 처리하거나 기존 저장 결과를 반환하는 방식이 적합합니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 멱등성 기준이 없을 때 응답 유실로 인한 재전송이 중복 저장으로 이어지는 흐름을 나타냅니다. 서버가 두 번째 요청을 '이미 처리한 요청'으로 판단하지 못하는 것이 핵심 문제입니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "before-idempotency.mermaid",
      code: "sequenceDiagram\n    participant Sensor\n    participant Gateway\n    participant API\n    participant DB\n\n    Sensor->>Gateway: 측정값 생성\n    Gateway->>API: 센서 데이터 전송\n    API->>DB: INSERT\n    DB-->>API: 저장 성공\n    API--x Gateway: 응답 유실\n\n    Gateway->>API: 같은 데이터 재전송\n    API->>DB: INSERT again\n    DB-->>API: 중복 데이터 저장",
    },
    {
      type: "paragraph",
      content:
        "해결 후 구조에서는 저장 전에 동일 측정 이벤트 존재 여부를 확인합니다. 이미 저장된 경우 추가 INSERT를 생략하고 성공으로 처리합니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "after-idempotency.mermaid",
      code: "flowchart TD\n    A[Sensor Data Request] --> B[Validate Input]\n    B --> C{Already Exists?}\n\n    C -- No --> D[Insert New Sensor Data]\n    C -- Yes --> E[Skip Insert]\n\n    D --> F[(Sensor Data DB)]\n    E --> G[Idempotent Success Response]",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드가 남아 있지 않기 때문에 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증에서 중요한 것은 API 응답이 성공하는지가 아니라, DB에 실제로 몇 건이 저장되었는지를 확인하는 것입니다.",
    },
    {
      type: "list",
      items: [
        "최초 센서 데이터 전송 → 새 데이터 저장",
        "동일 sensorId + measuredAt 재전송 → 중복 저장되지 않음",
        "같은 value, 다른 measuredAt → 새 데이터 저장",
        "다른 sensorId, 같은 measuredAt → 각각 저장",
        "저장 성공 후 응답 유실 상황에서 재전송 → 성공으로 처리되되 중복 저장 없음",
        "같은 데이터가 거의 동시에 2번 요청 → DB에는 1건만 저장",
        "대시보드 조회 → 중복 데이터 표시되지 않음",
        "통계 계산 → 평균·횟수·지속 시간이 왜곡되지 않음",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 중복 요청 감지 건수(게이트웨이 재시도·네트워크 문제 추적), 중복 저장 차단 건수(멱등성 로직 효과 확인), 센서별 중복 요청 비율(특정 장비 문제 파악), 재전송 후 최종 성공률(네트워크 불안정 환경 대응 확인)",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "멱등성 기준을 도입하면 같은 측정 이벤트가 여러 번 전송되더라도 DB에는 한 번만 반영되도록 만들 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "데이터 저장",
          description:
            "재전송마다 새 데이터로 저장되던 구조에서 → 동일 측정 이벤트 기준으로 1건만 저장되는 구조로",
          badge: "저장",
        },
        {
          title: "대시보드·그래프",
          description:
            "같은 값이 반복 표시될 수 있던 구조에서 → 실제 측정 이벤트 기준으로 표시되는 구조로",
          badge: "조회",
        },
        {
          title: "통계 계산",
          description:
            "평균·횟수·지속 시간이 왜곡될 수 있던 구조에서 → 중복 제거된 데이터 기준으로 계산되는 구조로",
          badge: "통계",
        },
        {
          title: "운영 진단",
          description:
            "재시도 여부 파악이 어렵던 구조에서 → 중복 요청 로그로 네트워크·장비 문제를 추적할 수 있는 구조로",
          badge: "진단",
        },
      ],
    },
    {
      type: "list",
      items: [
        "같은 센서 데이터가 여러 번 저장되는 문제를 줄일 수 있습니다.",
        "대시보드와 그래프가 실제 측정 흐름에 더 가깝게 표시될 수 있습니다.",
        "통계 계산과 임계치 판단의 신뢰도를 높일 수 있습니다.",
        "게이트웨이 재시도를 허용하면서도 저장 결과는 안정적으로 유지할 수 있습니다.",
        "특정 센서 또는 네트워크 구간에서 반복되는 재전송 문제를 추적할 수 있습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 운영 로그가 남아 있지 않아 중복 저장 차단 건수나 저장 공간 절감량 같은 정량 지표는 확인할 수 없습니다. 이 문서에서는 중복 요청을 고려한 데이터 수집 설계 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 장비 기반 데이터 수집 시스템에서는 '요청이 한 번만 온다'고 가정하면 안 된다는 것입니다. 센서와 게이트웨이는 네트워크가 불안정하거나 서버 응답을 받지 못하면 같은 데이터를 다시 보낼 수 있습니다. 이 재전송은 데이터 누락을 막기 위한 정상적인 복구 전략일 수 있습니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "요청 단위와 측정 이벤트 단위를 반드시 구분해야 합니다. API가 호출된 횟수(요청 단위)와 센서가 실제로 값을 측정한 횟수(측정 이벤트 단위)는 다릅니다. 스마트팜 모니터링에서 중요한 것은 요청이 몇 번 왔는지가 아니라, 실제 환경이 몇 번 측정되었는지입니다. DB 저장 기준도 API 요청 횟수가 아니라 측정 이벤트 기준으로 잡아야 합니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 게이트웨이에서 측정 이벤트 ID를 생성하도록 하면 같은 측정 이벤트를 더 명확하게 식별할 수 있습니다. DB 수준의 유니크 제약을 적용하면 동시 요청 상황의 race condition도 방어할 수 있습니다. 중복 요청 비율을 별도 지표로 수집하면 네트워크 품질 문제나 게이트웨이 timeout 설정 문제를 일찍 감지할 수 있습니다. 중복 방지와 함께 누락 구간 탐지를 병행하면 데이터 신뢰성을 더 높일 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "smart-farm-cloud-monitoring-architecture",
    "sensor-data-flow-responsibility-separation",
    "sensor-rest-ingestion-validation",
  ],
};
