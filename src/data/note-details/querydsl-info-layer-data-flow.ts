import type { TechnicalNoteDetail } from "@/types/note";
import { querydslInfoLayerDataFlow } from "../notes/querydsl-info-layer-data-flow";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const querydslInfoLayerDataFlowDetail: TechnicalNoteDetail = {
  ...querydslInfoLayerDataFlow,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "QueryDSL Projections.fields()로 원하는 필드만 선택해 조회하면 N+1 문제를 피할 수 있습니다. 그런데 이 방식에서는 프로젝션 결과를 담을 매핑 대상 클래스가 반드시 필요합니다. 이 클래스를 어디에 두고, 서비스 레이어에서 어떻게 받아서, 최종적으로 API 응답 DTO로 어떻게 전달할지가 결정되어야 했습니다.",
    },
    {
      type: "list",
      items: [
        "Repository가 직접 RspDTO를 반환하면 HTTP 응답 구조(Jackson 어노테이션, 페이지네이션 형식)가 영속성 계층에 스며듭니다.",
        "Repository가 엔티티를 반환하면 서비스나 매퍼에서 연관 필드에 접근하는 순간 지연 로딩이 트리거됩니다.",
        "매핑 대상 클래스를 어디에 두느냐에 따라 계층 간 책임 분리와 코드 유연성이 달라집니다.",
      ],
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "Repository가 RspDTO를 직접 생성하면 Repository가 API 응답 형식을 알아야 합니다. RspDTO가 변경되면 Repository 쿼리도 함께 수정해야 하고, Jackson 직렬화 설정 등 HTTP 레이어 관심사가 영속성 계층으로 흘러 들어옵니다.",
    },
    {
      type: "paragraph",
      content:
        "엔티티를 반환하면 영속성 컨텍스트가 엔티티를 관리하고 연관 필드 접근 시 지연 로딩이 트리거됩니다. 화면에 필요한 필드 조합이 API마다 달라서 범용 fetch join 전략을 유지하기 어렵습니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "Info 중간 객체 도입",
          description:
            "Custom Repository의 Projections.fields() 매핑 대상으로 Info 클래스를 사용합니다. Info는 Jackson 어노테이션도 없고 API 응답 구조도 모르는 순수 데이터 컨테이너입니다.",
          badge: "service/info/ 패키지",
        },
        {
          title: "RspDTO.fromInfo() 패턴",
          description:
            "RspDTO에 fromInfo() 정적 팩토리 메서드를 두어 Info → RspDTO 변환 책임을 RspDTO 안에 고정합니다. 서비스 코드는 변환 방법을 모르고 위임만 합니다.",
          badge: "변환 책임 고정",
        },
        {
          title: "Service에서 가공",
          description:
            "Service는 Info를 받아 필요한 가공 후 RspDTO.fromInfo()를 호출합니다. 응답 구조를 추가 가공하거나 바꿀 여지가 Service에 있습니다.",
          badge: "서비스 레이어 가공",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "java",
      filename: "계층별 역할 — Admin 예약 목록 조회 예시",
      code: "// 1. Custom Repository → Info 반환\nCustomAdminReservationRepositoryImpl\n    .findReservationList()\n    → Page<AdminReservationSummaryInfo>\n\n// 2. Service → RspDTO 변환\nAdminReservationServiceImpl\n    .getReservationList()\n    → page.map(AdminReservationSummaryRspDTO::fromInfo)\n\n// 3. RspDTO — 정적 팩토리\npublic static AdminReservationSummaryRspDTO fromInfo(\n        AdminReservationSummaryInfo info) {\n    return new AdminReservationSummaryRspDTO(...);\n}",
    },
    {
      type: "paragraph",
      content:
        "Info 객체는 QueryDSL Projections.fields()의 매핑 대상이므로 기본 생성자가 있어야 하고, 필드명이 QueryDSL의 .as(\"필드명\") alias와 정확히 일치해야 합니다. Builder를 함께 제공해 서비스 테스트에서 직접 생성할 수 있게 합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "Projection 대상 Info 클래스 수: 36개 (UserInfo 엔티티 제외)",
        "fromInfo() 정적 팩토리 사용 횟수: 69회",
        "Custom Repository Impl 파일 수: 16개",
        "Projections.fields() 호출 횟수: 28회",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "Custom Repository Impl 파일에서 RspDTO import가 없습니다. Repository는 영속성 계층에 집중하고, RspDTO 변경 시 Service와 RspDTO만 수정하면 됩니다. 모든 모듈의 목록 조회 API에 동일한 패턴이 적용되어 있습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "info",
      content:
        "QueryDSL 프로젝션에서 매핑 대상 클래스를 어디에 두느냐는 단순한 패키지 문제가 아닙니다. RspDTO를 Repository에 직접 쓰면 Repository가 HTTP 응답이 어떻게 생겼는지를 알게 됩니다. Info를 중간에 두면 Repository는 어떤 필드를 조회했는지만 알고 Service는 그 필드를 어떻게 응답으로 바꿀지만 압니다. Projections.fields()는 필드 이름 기반 주입이라 타입 안전성이 낮아 필드명 오타는 컴파일 오류 없이 null로 채워지므로 주의가 필요합니다.",
    },
  ],
  relatedNoteSlugs: [
    "n-plus-one-prevention-querydsl-projection",
    "querydsl-projection-optimization",
  ],
};
