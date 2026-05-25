import type { TechnicalNoteDetail } from "@/types/note";
import { sensorDataFlowResponsibilitySeparation } from "../notes/sensor-data-flow-responsibility-separation";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const sensorDataFlowResponsibilitySeparationDetail: TechnicalNoteDetail = {
  ...sensorDataFlowResponsibilitySeparation,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트에서 센서 데이터 처리 흐름은 초기에 단순해 보였습니다. 센서가 데이터를 전송하면 서버가 받아 DB에 저장하고, 사용자가 대시보드에서 확인하며, 필요하면 임계치 초과 여부를 판단하는 흐름이었습니다. 그러나 실제 시스템 관점에서 이 흐름은 단순한 저장 기능이 아니라 여러 책임이 이어진 복합적인 데이터 파이프라인에 가까웠습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "데이터 수집",
          description: "센서 또는 게이트웨이로부터 측정값을 받는 책임",
          badge: "수집",
        },
        {
          title: "입력 검증",
          description: "값의 누락, 범위 초과, 형식 오류를 확인하는 책임",
          badge: "검증",
        },
        {
          title: "데이터 저장",
          description: "검증된 센서 데이터를 DB에 저장하는 책임",
          badge: "저장",
        },
        {
          title: "최신 상태 조회",
          description: "대시보드에서 현재 상태를 빠르게 조회하는 책임",
          badge: "조회",
        },
        {
          title: "임계치 판단",
          description: "온도, 습도 등의 이상 상태를 평가하는 책임",
          badge: "판단",
        },
        {
          title: "알림 또는 제어 연계",
          description: "이상 상태 발생 시 알림이나 원격 제어로 연결하는 책임",
          badge: "후속 처리",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "입력 검증과 임계치 판단은 목적이 다릅니다. 습도 값이 0~100 범위를 벗어나면 저장 전에 차단해야 할 비정상 데이터입니다. 반면 습도가 30% 미만으로 5분 이상 유지되면 저장 가능한 값이면서 동시에 건조 상태 알림의 대상입니다. 두 책임이 같은 흐름에 섞이면 구조가 빠르게 복잡해집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 근본 원인은 센서 데이터 처리 흐름을 '데이터 저장 API'로만 단순화해서 바라볼 수 있다는 점입니다. 스마트팜 모니터링 시스템에서 센서 데이터는 단순한 로그가 아닙니다. 현재 상태 표시, 그래프, 이상 상태 판단, 알림, 원격 제어, 통계 등 여러 기능의 출발점이 됩니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "책임 경계 부재",
          description:
            "수집, 저장, 조회, 판단이 분리되지 않아 변경 영향 범위가 증가합니다.",
          badge: "구조",
        },
        {
          title: "데이터 흐름 단순화",
          description:
            "센서 데이터를 단순 INSERT 대상으로만 바라봐 후속 기능 확장 시 구조가 복잡해집니다.",
          badge: "설계",
        },
        {
          title: "조회 목적 미분리",
          description:
            "최신값 조회와 이력 조회를 같은 방식으로 처리해 성능 저하와 결합도 증가가 발생합니다.",
          badge: "조회",
        },
        {
          title: "판단 로직 결합",
          description:
            "임계치 판단이 저장 흐름에 직접 결합되어 알림 정책 변경이 저장 로직에 영향을 줍니다.",
          badge: "결합",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "센서 데이터는 하나지만, 그 데이터를 사용하는 목적은 여러 개입니다. 따라서 데이터 자체의 저장 책임과 데이터를 해석하는 책임은 분리되어야 합니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 센서 데이터 처리 흐름을 단계별 책임으로 나누는 것입니다. 수집, 검증, 저장, 조회, 임계치 판단, 후속 처리를 각각 독립된 책임으로 분리합니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "책임 미분리 구조",
          description: "하나의 처리 흐름에 여러 책임이 섞여 있는 구조입니다.",
          bullets: [
            "센서 데이터 저장, 판단, 조회가 하나의 흐름에 섞임",
            "검증 기준 변경 시 저장 흐름 전체 수정 필요",
            "알림 조건 변경이 데이터 저장 로직에 영향",
            "대시보드 변경이 DB 저장 방식까지 흔들 수 있음",
            "모니터링 실패와 제어 실패 원인 구분 어려움",
          ],
        },
        {
          title: "책임 분리 구조",
          description: "각 단계의 책임이 독립적으로 분리된 구조입니다.",
          bullets: [
            "수집, 검증, 저장, 조회, 판단이 각각 독립된 책임",
            "저장 안정성을 유지하며 조회·판단 변경 가능",
            "알림 조건 변경이 저장 로직에 영향 없음",
            "조회 목적별 최적화 가능",
            "장애 원인을 레이어별로 분리하여 추적 가능",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "센서 데이터 저장은 시스템의 기본 기록 역할을 하므로 안정성이 중요합니다. 알림 조건이나 화면 요구사항이 바뀌더라도 저장 책임은 흔들리지 않아야 합니다. 원본 데이터를 안정적으로 저장하고, 조회 계층에서 화면 목적에 맞게 가공하면 구조가 더 유연해집니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 책임이 분리되지 않았을 때의 문제 흐름을 나타냅니다. 입력 검증, 저장, 조회, 임계치 판단, 알림 처리 책임이 하나의 처리 로직에 모여 있어 특정 책임의 변경이 전체 처리 흐름에 영향을 줄 수 있습니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "before-responsibility.mermaid",
      code: "flowchart TD\n    A[Sensor Data Request] --> B[Single Processing Logic]\n\n    B --> C[Validate Input]\n    B --> D[Save Sensor Data]\n    B --> E[Calculate Latest Value]\n    B --> F[Evaluate Threshold]\n    B --> G[Trigger Alert]\n    B --> H[Prepare Dashboard Response]\n\n    C -. Change .-> B\n    F -. Change .-> B\n    H -. Change .-> B",
    },
    {
      type: "paragraph",
      content:
        "해결 후 구조에서는 센서 데이터 수집, 저장, 조회, 임계치 판단이 각각 독립된 책임으로 나뉩니다. 저장 규칙 변경, 조회 요구사항 변경, 알림 조건 변경이 서로에게 주는 영향을 줄일 수 있습니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "after-responsibility.mermaid",
      code: "flowchart TD\n    A[Sensor Data Request] --> B[Validation Layer]\n    B --> C[Ingestion Service]\n    C --> D[Sensor Data Repository]\n    D --> E[(Sensor Data DB)]\n\n    F[Dashboard] --> G[Query Service]\n    G --> D\n\n    C --> H[Threshold Evaluation]\n    H --> I[Alert or Control Flow]",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드나 운영 로그가 남아 있지 않기 때문에 수치 기반 비교 대신, 책임 분리 구조를 검증하기 위한 구조적 기준으로 확인합니다.",
    },
    {
      type: "list",
      items: [
        "검증 규칙이 바뀌면 저장 구조 전체가 흔들리는가? — 아니라면 책임 분리 양호",
        "알림 조건이 바뀌면 데이터 저장 로직을 수정해야 하는가? — 수정하지 않아도 된다면 양호",
        "대시보드 조회 방식이 바뀌면 수집 API에 영향이 있는가? — 영향이 작다면 양호",
        "원격 제어 실패가 센서 데이터 저장 실패로 보이는가? — 구분된다면 양호",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 센서 데이터 저장 성공률(수집 안정성), 비정상 입력 차단 건수(검증 책임), 최신값 조회 응답 시간(조회 책임 최적화), 임계치 판단 정확도(모니터링 신뢰도), 제어 명령 실패율(제어 흐름 분리 필요성)",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "센서 데이터 흐름을 책임별로 분리해 바라보면서, 스마트팜 모니터링 시스템은 단순 데이터 저장 시스템이 아니라 확장 가능한 모니터링 구조로 정리될 수 있었습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "데이터 저장",
          description:
            "후속 기능과 강하게 결합된 구조에서 → 원본 데이터 누적에 집중하는 구조로",
          badge: "저장",
        },
        {
          title: "입력 검증",
          description:
            "저장 흐름 내부에 섞인 구조에서 → 저장 전 별도 책임으로 분리된 구조로",
          badge: "검증",
        },
        {
          title: "대시보드 조회",
          description:
            "저장 로직과 영향 관계가 큰 구조에서 → 조회 목적별 분리가 가능한 구조로",
          badge: "조회",
        },
        {
          title: "임계치 판단",
          description:
            "저장 시점에 함께 처리될 가능성에서 → 모니터링 규칙으로 분리된 구조로",
          badge: "판단",
        },
      ],
    },
    {
      type: "list",
      items: [
        "센서 데이터 저장의 안정성을 높일 수 있습니다.",
        "조회 요구사항 변경이 수집 로직에 주는 영향을 줄일 수 있습니다.",
        "임계치 판단 조건을 독립적으로 발전시킬 수 있습니다.",
        "알림과 원격 제어 기능을 후속 흐름으로 확장하기 쉬워집니다.",
        "장애 발생 시 수집, 저장, 조회, 판단 문제를 구분하기 쉬워집니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "실제 코드와 운영 로그가 남아 있지 않아 정량적 성능 개선보다 설계 구조 개선 효과 중심으로 정리했습니다. 저장 성공률, 비정상 데이터 차단 건수, 최신값 조회 응답 시간, 알림 오탐률 같은 지표를 남겼다면 이후 문서의 설득력이 크게 높아졌을 것입니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "센서 데이터 처리 기능을 단순한 CRUD로 보면 안 됩니다. 스마트팜에서 센서 데이터는 현재 상태 표시, 이력 조회, 이상 감지, 알림, 제어 판단의 기반이 됩니다. 따라서 센서 데이터를 저장하는 기능과 그 데이터를 해석하는 기능은 같은 흐름에 섞이지 않도록 분리해야 합니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "입력 검증과 임계치 판단은 비슷해 보이지만 목적이 다릅니다. 습도 150%는 저장 전에 차단해야 할 비정상 데이터입니다. 습도 25%는 저장 가능한 값이면서 건조 상태 알림의 대상이 될 수 있습니다. '잘못된 데이터인지'와 '의미 있는 이상 상태인지'는 다른 문제이며, 이 둘을 구분하는 것이 데이터 신뢰성을 높이는 핵심입니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 센서 타입별로 입력 검증 규칙을 분리하고, 최신값 조회와 이력 조회를 분리된 API 또는 조회 모델로 설계할 수 있습니다. 임계치 판단은 단순 비교에서 연속 초과나 이동 평균 기준으로 발전시킬 수 있으며, 알림과 원격 제어를 이벤트 기반 구조로 분리하면 각 기능의 결합도를 더 낮출 수 있습니다.",
    },
  ],
  relatedNoteSlugs: ["smart-farm-cloud-monitoring-architecture"],
};
