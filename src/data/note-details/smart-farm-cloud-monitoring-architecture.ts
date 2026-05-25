import type { TechnicalNoteDetail } from "@/types/note";
import { smartFarmCloudMonitoringArchitecture } from "../notes/smart-farm-cloud-monitoring-architecture";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const smartFarmCloudMonitoringArchitectureDetail: TechnicalNoteDetail = {
  ...smartFarmCloudMonitoringArchitecture,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 프로젝트는 온도, 습도, 조도, 토양 수분 등 작물 생장 환경 센서 데이터를 수집하고, 사용자가 원격에서 상태를 확인하는 것을 목표로 했습니다. 초기에는 스마트팜 내부에 서버를 두는 구조를 고려했으나, 시스템의 핵심 목적인 '원격 모니터링과 제어'를 만족시키기 어렵다는 판단이 생겼습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "단순히 데이터를 수집하는 시스템이 아니라, 사용자가 현장에 없어도 현재 상태를 확인하고 원격 제어까지 수행할 수 있어야 했습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "원격 접근성",
          description:
            "외부 네트워크에서 스마트팜 상태를 확인하려면 포트포워딩, 고정 IP, 방화벽 설정 등 별도 네트워크 구성이 필요했습니다.",
          badge: "접근 문제",
        },
        {
          title: "운영 안정성",
          description:
            "로컬 서버 장애 시 센서 데이터 수집, 저장, 조회가 모두 동시에 영향을 받을 수 있었습니다. 장애 동안 유실된 센서 로그는 이후 상태 분석도 어렵게 했습니다.",
          badge: "단일 장애점",
        },
        {
          title: "확장성",
          description:
            "센서 수가 늘거나 데이터 보관 기간이 길어질수록 저장소와 서버 리소스를 직접 확장해야 했습니다.",
          badge: "확장 부담",
        },
      ],
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "문제의 핵심은 스마트팜 모니터링 시스템의 목적과 서버 배치 방식이 맞지 않았다는 점입니다. 이 시스템은 '현장 내부에서만 데이터를 보는 시스템'이 아니라 '원격에서 모니터링하고 필요하면 제어할 수 있는 시스템'이어야 했습니다.",
    },
    {
      type: "list",
      items: [
        "서버가 현장 네트워크에 종속되어 외부 접근을 위한 추가 설정이 필요했습니다.",
        "데이터 저장소가 로컬 환경에 종속되어 장비 문제 시 데이터 유실 가능성이 있었습니다.",
        "모니터링 기능과 현장 인프라가 강하게 결합되어 장애 원인 분리와 복구가 어려웠습니다.",
        "센서 증가, 데이터 증가에 대한 확장 책임을 직접 부담해야 했습니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "단순히 서버를 어디에 둘 것인가의 문제가 아니라, 모니터링 시스템의 운영 책임을 로컬 장비에 둘 것인지 클라우드 인프라로 분리할 것인지의 문제였습니다.",
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "해결 방향은 온프레미스 서버 의존도를 낮추고, 클라우드(Azure)를 기반으로 센서 데이터를 수집·저장·조회할 수 있는 구조로 전환하는 것이었습니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "온프레미스 서버",
          description: "현장 장비와 직접 연결하기 쉽지만 운영 부담이 큽니다.",
          bullets: [
            "외부 접근을 위한 네트워크 설정 필요",
            "서버 장애 시 전체 모니터링 중단",
            "저장소와 서버를 직접 확장해야 함",
            "현장 방문 없이 장애 복구 어려움",
          ],
        },
        {
          title: "클라우드 API 서버",
          description: "원격 모니터링 목적에 부합하는 구조입니다.",
          bullets: [
            "외부 네트워크 접근 기본 제공",
            "클라우드 인프라의 가용성 활용",
            "서버와 저장소 탄력적 확장 가능",
            "장애 원인을 레이어별로 분리하여 추적 가능",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content:
        "최종 방향은 센서 또는 게이트웨이가 데이터를 API 서버로 전송하고, 클라우드 서버가 MySQL에 저장한 뒤, 사용자가 대시보드에서 조회하는 구조입니다. 원격 제어도 현장 장비에 직접 접근하는 방식이 아니라 서버를 통해 제어 명령을 전달하는 흐름으로 설계했습니다.",
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content: "온프레미스 중심 구조에서 발생하는 접근성과 운영 한계를 아키텍처로 정리하면 다음과 같습니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "before-architecture.mermaid",
      code: "flowchart LR\n    Sensor[Smart Farm Sensors] --> LocalServer[On-premise Server]\n    LocalServer --> LocalDB[(Local Database)]\n\n    User[Remote User] -. External Access .-> LocalServer\n\n    LocalServer -. Failure .-> MonitoringDown[Monitoring Unavailable]\n    LocalServer -. Network Config Required .-> AccessIssue[Remote Access Issue]",
    },
    {
      type: "paragraph",
      content: "클라우드 기반으로 전환한 목표 구조는 다음과 같습니다. API 서버가 센서 데이터와 사용자 요청 사이의 중간 계층이 되어 수집, 저장, 조회, 제어 책임을 분리합니다.",
    },
    {
      type: "code",
      language: "mermaid",
      filename: "after-architecture.mermaid",
      code: "flowchart LR\n    Sensor[Smart Farm Sensors] --> Gateway[Sensor Gateway]\n    Gateway --> API[Cloud API Server]\n    API --> DB[(MySQL Database)]\n\n    User[Remote User] --> Dashboard[Monitoring Dashboard]\n    Dashboard --> API\n\n    API --> Control[Control Command]\n    Control --> Gateway\n    Gateway --> Device[Farm Device]",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "실제 운영 로그와 성능 수치가 남아 있지 않아 정량 지표 비교 대신, 두 구조가 각 요구사항을 얼마나 충족하는지 비교합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "원격 접근",
          description:
            "온프레미스: 추가 네트워크 설정 필요 / 클라우드: 외부 네트워크 접근 기본 지원",
          badge: "접근성",
        },
        {
          title: "장애 대응",
          description:
            "온프레미스: 현장 확인 의존 / 클라우드: 서버·DB·네트워크 레이어별 원인 분리 가능",
          badge: "운영성",
        },
        {
          title: "확장성",
          description:
            "온프레미스: 장비와 서버 자원에 제한 / 클라우드: 센서·사용자 증가에 탄력적 대응",
          badge: "확장성",
        },
        {
          title: "원격 제어",
          description:
            "온프레미스: 직접 연결 중심 / 클라우드: API 기반 제어 흐름으로 상태 관리 및 재시도 정책 추가 가능",
          badge: "제어",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "paragraph",
      content:
        "클라우드 기반 구조를 검토하고 적용 방향을 잡으면서, 스마트팜 모니터링 시스템은 단순한 로컬 데이터 수집 시스템이 아니라 원격 운영을 고려한 구조로 정리되었습니다.",
    },
    {
      type: "list",
      items: [
        "센서 데이터 수집과 사용자 조회 흐름을 API 서버를 통해 분리했습니다.",
        "외부에서도 스마트팜 상태를 확인할 수 있는 접근 구조를 마련했습니다.",
        "데이터 누적 저장을 기반으로 모니터링, 알림, 분석 기능을 확장할 수 있게 했습니다.",
        "원격 제어 기능을 API 기반으로 확장할 수 있는 기반을 만들었습니다.",
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "실제 수치 기반 검증 자료가 남아 있지 않아 '수치 기반 개선 결과'보다 '구조적 개선 결과' 중심으로 정리했습니다. API 응답 시간, 센서 데이터 저장 성공률, 데이터 누락률 같은 지표를 남겼다면 이후 문서의 설득력이 크게 높아졌을 것입니다.",
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "스마트팜 모니터링 시스템에서 중요한 것은 센서 데이터를 단순히 수집하는 것이 아니라, 그 데이터를 어떤 운영 구조 안에서 활용할 것인지입니다. 온프레미스 구조는 초기 구현에는 단순해 보이지만, 원격 접근·장애 대응·확장성까지 고려하면 운영 부담이 커집니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "스마트팜처럼 물리 장비와 소프트웨어가 연결되는 시스템에서는 서버 장애, 네트워크 장애, 장비 장애를 구분할 수 있는 구조가 중요합니다. 이를 위해 센서, 게이트웨이, API 서버, DB, 대시보드의 책임을 분리해야 합니다.",
    },
    {
      type: "paragraph",
      content:
        "이 문서에서 가장 중요한 판단은 '클라우드를 사용했다'가 아니라, 원격 모니터링이라는 목표를 만족시키기 위해 서버 위치와 접근 책임을 분리했다는 점입니다.",
    },
  ],
  relatedNoteSlugs: [],
};
