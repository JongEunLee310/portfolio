import type { TechnicalNoteDetail } from "@/types/note";
import { remoteControlDeviceStateMismatch } from "../notes/remote-control-device-state-mismatch";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const remoteControlDeviceStateMismatchDetail: TechnicalNoteDetail = {
  ...remoteControlDeviceStateMismatch,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등 환경 데이터를 확인하는 것뿐 아니라, 환기 장치, 급수 장치, 조명 장치, 차광 장치 등을 원격으로 제어하는 흐름까지 고려한 시스템이었습니다. 이때 중요한 점은 사용자가 '제어 명령을 보냈다'는 사실과 '장비가 실제로 동작했다'는 사실이 같지 않다는 것입니다. 원격 제어 기능에서 API 응답 성공만으로 제어 완료를 판단하면 사용자는 장비 상태를 잘못 이해하게 됩니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "API 성공 → 제어 완료 오해",
          description: "서버가 요청을 받았다는 응답을 장비가 실제로 동작했다는 의미로 사용자에게 표시하는 구조",
          badge: "오해",
        },
        {
          title: "장비 미응답 → 상태 불명확",
          description: "장비가 명령을 받았는지 또는 수행했는지 확인하지 않아 성공인지 실패인지 알 수 없는 상태",
          badge: "불명확",
        },
        {
          title: "상태 반영 지연 → 화면 불일치",
          description: "장비는 실제로 켜졌지만 서버가 상태 응답을 받지 못해 화면에는 꺼짐으로 남아 사용자가 다시 명령을 보내는 상황",
          badge: "불일치",
        },
        {
          title: "중복 명령 → 반복 요청",
          description: "진행 중인 명령이 있는지 확인하지 않아 사용자가 같은 명령을 반복 실행하게 되는 구조",
          badge: "중복",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "스마트팜에서 원격 제어는 모니터링 결과에 따른 후속 행동입니다. 급수 장치가 실제로 동작하지 않았는데 화면에서 '급수 중'으로 표시되면, 사용자는 필요한 조치를 놓치고 작물이 피해를 입을 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심 원인은 원격 제어를 일반적인 웹 API 요청과 같은 방식으로 단순화한 것입니다. 일반적인 웹 기능에서는 서버가 요청을 처리하고 DB에 저장하면 성공으로 볼 수 있는 경우가 많습니다. 하지만 스마트팜 원격 제어는 물리 장비와 연결됩니다. 서버가 정상이어도 게이트웨이가 꺼져 있을 수 있고, 게이트웨이는 살아 있어도 장비가 고장나 있을 수 있습니다. 제어 요청은 '서버 내부 처리'가 아니라 '외부 장비와의 상태 동기화 문제'로 봐야 합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "명령 상태와 장비 상태 미분리",
          description: "API 요청 성공과 장비 동작 성공을 하나의 성공으로 합쳐서 처리하여 상태 불일치 발생",
          badge: "미분리",
        },
        {
          title: "장비 응답 확인 부족",
          description: "장비가 명령을 수행했다는 응답을 확인하지 않아 실제 동작 여부를 알 수 없는 상태",
          badge: "확인",
        },
        {
          title: "timeout 정책 부재",
          description: "장비 응답이 없을 때 얼마나 기다려야 실패로 볼지 기준이 없어 상태가 계속 대기로 남음",
          badge: "정책",
        },
        {
          title: "실패 유형 미분류",
          description: "게이트웨이 전달 실패, 장비 거부, 응답 없음을 구분하지 않아 장애 원인 파악이 어려움",
          badge: "분류",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "원격 제어에는 최소한 세 겹의 성공 기준이 있습니다. 첫째, API 요청 성공: 서버가 사용자의 명령을 받았는가. 둘째, 명령 전달 성공: 게이트웨이 또는 장비로 명령이 도달했는가. 셋째, 장비 동작 성공: 장비가 실제로 원하는 상태로 변경되었는가. 이 세 가지를 하나로 합치면 상태 불일치가 발생합니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 원격 제어 명령의 처리 상태와 실제 장비 상태를 분리해서 관리하는 것입니다. 사용자의 요청이 접수된 순간부터 장비 상태가 확인되는 순간까지 각 단계를 별도 상태로 관리하고, 일정 시간 응답이 없으면 명확하게 실패 또는 지연으로 처리합니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "API 성공 중심 구조",
          description: "서버가 요청을 받으면 제어 완료로 처리하는 구조입니다.",
          bullets: [
            "사용자 클릭 → API 성공 → 제어 완료로 표시",
            "장비 응답 확인 없음",
            "명령 상태와 장비 상태 구분 없음",
            "장비 미응답 시 상태 불명확",
            "실패 원인 분류 없음",
            "중복 명령 방지 불가",
          ],
        },
        {
          title: "명령 상태 분리 구조",
          description: "명령 단계별 상태를 구분하고 장비 응답을 확인하는 구조입니다.",
          bullets: [
            "요청 접수 → PENDING → SENT → CONFIRMED 단계 구분",
            "장비 응답 acknowledgement 확인",
            "명령 상태와 실제 장비 상태 별도 관리",
            "응답 없으면 TIMEOUT 또는 FAILED 처리",
            "전달 실패, 장비 거부, 응답 없음 분류",
            "진행 중 명령 있을 때 중복 요청 제한",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "명령 상태 모델은 PENDING(요청 접수), SENT(명령 전달), CONFIRMED(장비 확인), TIMEOUT(응답 없음), FAILED(처리 실패)로 구분합니다. 실제 장비 상태는 명령 상태와 별도로 관리하며, 장비가 보고하거나 센서 데이터로 확인된 현재 상태를 기록합니다. UI에서는 API 성공을 곧바로 제어 완료로 표시하지 않고 '요청됨', '처리 중', '완료', '실패'처럼 명령 상태를 구분해서 표시합니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 API 성공을 곧바로 제어 완료로 판단할 때 발생하는 문제 흐름입니다. 명령 전달 이후의 과정을 확인하지 않기 때문에 장비가 실제로 동작했는지 알 수 없습니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "remote-control-device-state-mismatch-before.mermaid",
      code: "flowchart TD\n    A[User Clicks Control Button] --> B[API Receives Command]\n    B --> C[Return Success Response]\n    C --> D[UI Shows Control Completed]\n\n    B -. Command Delivery May Fail .-> E[Gateway or Device Not Reached]\n    E --> F[Actual Device State Unchanged]\n\n    D --> G[User Believes Device Changed]\n    F --> H[State Mismatch]",
    },
    {
      type: "paragraph",
      content:
        "아래 다이어그램은 명령 상태를 단계별로 관리하는 개선 후 구조입니다. 각 전이마다 실패 경로가 존재하고 일정 시간 응답이 없으면 TIMEOUT으로 처리합니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "remote-control-device-state-mismatch-after.mermaid",
      code: "stateDiagram-v2\n    [*] --> PENDING : user requested\n    PENDING --> SENT : command delivered\n    PENDING --> FAILED : delivery error\n    SENT --> CONFIRMED : device acknowledged\n    SENT --> TIMEOUT : no response\n    SENT --> FAILED : device rejected\n    TIMEOUT --> FAILED\n    CONFIRMED --> [*]\n    FAILED --> [*]",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 테스트 코드와 장비 로그가 남아 있지 않기 때문에, 검증했어야 하는 테스트 케이스를 기준으로 정리합니다. 검증에서 중요한 것은 API 응답 성공만 확인하는 것이 아니라, 명령 상태와 장비 상태가 올바르게 변하는지 확인하는 것입니다.",
    },
    {
      type: "list",
      items: [
        "정상 제어: 장비가 명령 수신 후 성공 응답 → CONFIRMED 상태 전환",
        "게이트웨이 전달 실패: 서버가 장비로 명령 전달 실패 → FAILED 상태 전환",
        "장비 미응답: 명령 전달 후 일정 시간 응답 없음 → TIMEOUT 처리",
        "장비 거부: 장비가 명령 수행 불가 응답 → FAILED 상태 전환",
        "상태 반영 지연: 장비 응답이 timeout 기준 전에 도착 → CONFIRMED 처리",
        "중복 명령: 같은 장비에 진행 중 명령이 있을 때 반복 요청 → 제한 또는 기존 상태 반환",
        "반대 명령: ON 진행 중 OFF 요청 → 정책에 따라 대기, 취소, 또는 대체 처리",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "향후 확보하면 좋을 지표: 제어 명령 성공률(전체 명령 중 CONFIRMED 비율), 명령 timeout 비율, 요청부터 CONFIRMED까지 평균 소요 시간, 실패 유형별 건수(네트워크·장비·timeout 구분), 중복 명령 차단 건수, 명령 상태와 실제 장비 상태 불일치 건수",
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "명령 상태와 실제 장비 상태를 분리하면 원격 제어 요청이 어디까지 진행되었는지 더 명확히 표현할 수 있습니다. 사용자가 현재 명령이 접수된 것인지, 전달된 것인지, 실제로 장비가 동작한 것인지를 구분해서 확인할 수 있습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "성공 기준 명확화",
          description:
            "서버가 요청을 받으면 완료로 보던 구조에서 → 장비 확인까지 단계별로 판단하는 구조로",
          badge: "기준",
        },
        {
          title: "화면 상태 표현",
          description:
            "제어 완료로 오해할 수 있던 표시에서 → 요청됨, 처리 중, 완료, 실패를 구분하는 표시로",
          badge: "표현",
        },
        {
          title: "실패 원인 분류",
          description:
            "실패 원인을 알 수 없던 구조에서 → 전달 실패, 장비 거부, timeout을 구분하는 구조로",
          badge: "분류",
        },
        {
          title: "자동 제어 확장성",
          description:
            "상태 기반 구조를 마련하면 향후 센서 이상 감지 기반의 자동 제어 기능을 안전하게 연결할 수 있음",
          badge: "확장",
        },
      ],
    },
    {
      type: "list",
      items: [
        "API 요청 성공과 실제 장비 동작 성공을 구분할 수 있습니다.",
        "사용자가 원격 제어 상태를 더 정확히 이해할 수 있습니다.",
        "장비 응답 없음이나 전달 실패를 명확히 처리할 수 있습니다.",
        "제어 실패 원인을 분류해 운영 진단에 활용할 수 있습니다.",
        "향후 자동 제어 기능을 도입할 때 안전한 상태 기반 구조를 마련할 수 있습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "코드와 장비 연동 기록이 남아 있지 않아 제어 명령 성공률, 오류 감소 건수 같은 정량 지표는 확인할 수 없습니다. 이 문서에서는 원격 제어의 상태 일관성을 확보하기 위한 설계 판단을 중심으로 정리했습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "이 문제를 통해 배운 점은 물리 장비 제어에서는 '요청 성공'과 '동작 성공'을 절대 같은 의미로 보면 안 된다는 것입니다. 원격 제어에는 요청 성공(서버가 명령을 받았는가), 전달 성공(장비 또는 게이트웨이에 명령이 도달했는가), 동작 성공(장비가 실제로 상태를 바꿨는가)이라는 세 겹의 성공이 있습니다. 이 단계를 구분하지 않으면 시스템은 낙관적인 착각을 하게 됩니다. 서버의 작은 성공 응답이 현장 장비의 실제 움직임까지 보증하는 것은 아닙니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "물리 장비 제어는 처음부터 실패와 지연을 정상적인 상태로 모델링해야 합니다. 성공만 있는 제어 흐름은 현실 세계와 연결되는 순간 금이 갑니다. 특히 급수나 환기처럼 작물 안전에 영향을 미치는 제어에서는 '장비가 동작했을 것이다'라는 낙관적 가정이 아니라 '장비가 동작했음을 확인했다'는 기준이 필요합니다.",
    },
    {
      type: "paragraph",
      content:
        "향후 개선 방향: 제어 명령 이력 테이블을 두면 사용자가 언제 어떤 명령을 보냈고 어떤 상태로 끝났는지 추적할 수 있습니다. 장비가 명령을 '받았다'는 응답과 '실제로 수행했다'는 응답을 구분해서 acknowledgement 의미를 명확히 정의해야 합니다. timeout과 retry 정책을 함께 설계하면 장비 응답이 없을 때 즉시 실패로 볼지, 일정 횟수 재시도할지 판단할 수 있습니다. 자동 제어로 확장할 경우 센서 이상 감지 → 제어 명령 생성 → 장비 응답 확인 → 결과 기록까지 이어지는 전체 흐름에서 각 단계의 상태가 명확해야 합니다.",
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
  ],
};
