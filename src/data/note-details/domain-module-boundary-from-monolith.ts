import type { TechnicalNoteDetail } from "@/types/note";
import { domainModuleBoundaryFromMonolith } from "../notes/domain-module-boundary-from-monolith";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const domainModuleBoundaryFromMonolithDetail: TechnicalNoteDetail = {
  ...domainModuleBoundaryFromMonolith,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "프로젝트 초반 구조는 settings.gradle에 api, common 두 모듈만 있는 사실상 Monolith에 가까운 구조였습니다. common 모듈 안에 257개 Java 파일이 admin, manager, reservation, customer 등 9개 패키지로만 나뉘어 있었습니다.",
    },
    {
      type: "list",
      items: [
        "같은 common 모듈 안에서 패키지만 나누면 클래스 참조가 자유로워 의존성을 빌드 레벨에서 강제할 수 없었습니다.",
        "예약 Repository가 manager, serviceCategory, review를 한 쿼리에 join해 도메인 경계 없이 결합도가 높아졌습니다.",
        "어떤 코드를 수정하면 다른 기능에서 문제가 생기는 일이 잦아졌고, 조회 쿼리가 여러 도메인을 가로지르는 방식이 반복됐습니다.",
      ],
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "패키지는 코드를 정리하는 데 도움이 되지만 빌드 의존성을 강제하지 않습니다. admin, customer, manager 같은 역할 기준 패키지와 reservation, review, payment 같은 업무 도메인이 한 모듈 안에 섞여 있어도 컴파일 단계에서 경계 위반을 막을 수 없었습니다.",
    },
    {
      type: "list",
      items: [
        "관리자 DTO가 수요자·매니저 엔티티를 직접 참조하거나, 예약 Repository가 리뷰·매니저·서비스 카테고리 정보를 한 번에 조합하는 코드가 자연스럽게 생겼습니다.",
        "QueryDSL join이 모듈 경계 없는 상태에서 화면 응답 필요 값을 계속 붙이다 보니 Repository가 특정 도메인의 저장소가 아닌 여러 도메인의 데이터 조립 장소가 됐습니다.",
        "필드 하나를 옮기거나 엔티티 관계를 바꾸면 직접 관련 없어 보이는 관리자 조회나 예약 조회가 함께 깨질 수 있었습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "도메인 기준 8모듈 분리",
          description:
            "admin, evaluation, inquiry, member, payment, reservation 등 업무 책임을 드러내는 모듈을 만들고, 인증·보안·파일·User·BaseEntity 같은 전역 성격의 코드는 global로 분리했습니다.",
          badge: "빌드 경계",
        },
        {
          title: "shared-domain 모듈 신설",
          description:
            "Reservation, ServiceCategory, ReservationStatus 등 여러 모듈이 공통으로 참조하는 예약 관련 핵심 타입을 shared-domain으로 옮겼습니다.",
          badge: "8개 파일",
        },
        {
          title: "build.gradle로 의존성 명시",
          description:
            "모듈별 build.gradle에 implementation project(...) 의존성을 명시해, 기존에는 import만 추가하면 지나갔던 결합이 이제 명시적인 결정으로 바뀌었습니다.",
          badge: "의존성 가시화",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "text",
      filename: "전환 후 모듈별 의존 현황 (build.gradle 기준)",
      code: "global          → 0개 모듈 의존\ninquiry         → 1개 (global)\nshared-domain   → 1개 (global)\nadmin           → 2개 (global, member)\nmember          → 2개 (global, shared-domain)\npayment         → 2개 (global, shared-domain)\nevaluation      → 3개 (global, shared-domain, member)\nreservation     → 5개 (global, shared-domain, member,\n                        evaluation, payment)",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "전환 전 common 모듈 Java 파일 수: 257개 (commit 90c1537 직전 기준)",
        "전환 전 common 모듈 최상위 패키지 수: 9개",
        "전환 후 전체 모듈 수: 8개",
        "모듈 간 의존 수 최대: 5개 (reservation)",
        "모듈 간 의존 수 최소: 1개 (inquiry — global만 의존)",
        "Port 인터페이스로 차단한 순환 참조 위험: 2건",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "패키지 경계(런타임 발견)에서 빌드 의존성 경계(컴파일 발견)로 전환됐습니다. evaluation, payment → reservation 순환 참조 2건이 구조적으로 차단됩니다. reservation 5개 의존 / inquiry 1개 의존으로 모듈별 책임 범위가 가시화됐습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "도메인 기준 모듈 분리는 출발점일 뿐입니다. reservation 모듈이 evaluation, payment를 직접 의존하는 방향은 도메인 경계 관점에서 다시 검토가 필요합니다. shared-domain은 강력하지만 위험합니다. 여러 모듈이 편하게 참조할 수 있다는 이유로 타입과 인터페이스를 계속 넣으면 과거 common 모듈과 같은 문제가 반복될 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "multi-module-shared-domain-port-pattern",
    "querydsl-info-layer-data-flow",
  ],
};
