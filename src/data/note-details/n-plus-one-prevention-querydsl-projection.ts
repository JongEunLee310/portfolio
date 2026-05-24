import type { TechnicalNoteDetail } from "@/types/note";
import { nPlusOnePreventionQuerydslProjection } from "../notes/n-plus-one-prevention-querydsl-projection";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const nPlusOnePreventionQuerydslProjectionDetail: TechnicalNoteDetail = {
  ...nPlusOnePreventionQuerydslProjection,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "예약 목록, 회원 목록처럼 여러 연관 엔티티를 함께 조회해야 하는 API가 다수 존재했습니다. 수요자의 예약 목록 조회 시 Reservation, ServiceCategory, ReservationSchedule, ReservationMatch, User(매니저) 등을 한 화면에 노출해야 했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "JPA에서 연관 관계가 지연 로딩으로 설정되어 있으면 목록을 가져온 뒤 각 항목마다 추가 쿼리가 발생합니다. 팀 내에서도 조회 성능 이슈가 생기지 않을까라는 우려가 제기됐고, 개발 후반에 역추적 방식으로 원인을 확인했습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "N+1이 발생하지 않은 핵심 이유는 처음부터 Projections.fields()를 사용해 필요한 스칼라 필드만 선택했기 때문입니다. JPA에서 N+1이 발생하는 근본 원인은 연관 엔티티를 영속성 컨텍스트가 관리하는 객체로 로딩하기 때문입니다. Projections.fields()는 쿼리 결과를 DTO에 직접 매핑하므로 영속성 컨텍스트에 엔티티가 올라오지 않아, 지연 로딩이 트리거될 여지가 없습니다.",
    },
    {
      type: "list",
      items: [
        "member, reservation, inquiry, payment, evaluation, admin 6개 모듈의 Custom Repository Impl 16개 파일 전체에 Projections.fields() 패턴이 일관되게 적용되어 있습니다.",
        "CustomMatchRepositoryImpl은 예외적으로 Tuple을 사용합니다. 동적 컬럼 조합이 필요하거나 여러 집계 값을 한 쿼리에서 가져와야 할 때 Tuple로 조회한 뒤 수동으로 Info 객체에 매핑합니다.",
        "Projections.fields() 호출 횟수 28회, leftJoin 호출 횟수 112회가 16개 Impl 파일에서 집계됩니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "N+1 문제를 사후에 해결한 것이 아니라 초기 설계 단계에서 조회 전용 DTO 프로젝션 방식을 선택한 결과입니다. 역추적을 통해 왜 문제가 없었는가를 확인하고, 이 방식이 의도적으로 유지되어야 한다는 판단을 내렸습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "Projections.fields() 일관 적용",
          description:
            "목록 조회 API에서 Projections.fields()를 사용해 필요한 필드만 DTO에 직접 매핑합니다. 엔티티를 직접 반환하거나 findAll() 기반 목록 조회를 사용하지 않습니다.",
          badge: "영속성 컨텍스트 우회",
        },
        {
          title: "leftJoin으로 조인 쿼리 구성",
          description:
            "여러 테이블에서 데이터를 가져와야 할 때 QueryDSL의 leftJoin으로 조인 쿼리를 구성합니다. 페이지네이션은 offset/limit을 쿼리에 직접 적용합니다.",
          badge: "단일 쿼리",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "java",
      filename: "CustomCustomerReservationRepositoryImpl.java",
      code: "// 수요자 예약 목록 조회\nqueryFactory\n    .select(Projections.fields(\n        CustomerReservationSummaryInfo.class,\n        reservation.reservationId,\n        reservation.serviceCategory.serviceId.as(\"serviceCategoryId\"),\n        reservation.status,\n        reservation.price,\n        location.roadAddress,\n        location.detailAddress,\n        match.manager.userName,\n        serviceCategory.serviceName,\n        schedule.requestDate,\n        schedule.startTime,\n        schedule.turnaround\n    ))\n    .from(reservation)\n    .leftJoin(location).on(...)\n    .leftJoin(match).on(...)\n    .leftJoin(schedule).on(...)\n    .where(조건)\n    .fetch();",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "로컬 환경에서 예약 목록 API 호출 후 쿼리 로그 확인 결과: 단일 SELECT + 단일 COUNT 쿼리만 발생",
        "목록 항목 수 증가 시 쿼리 수 변화 없음 — 항목 수와 관계없이 쿼리 수 고정",
        "여러 모듈(member, reservation, inquiry)에서 동일 패턴 확인 — 전 모듈 동일하게 Projections.fields() 사용",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "예약 목록 조회 API에서 N+1 없이 단일 쿼리로 처리됩니다. Reservation, Location, ReservationMatch, ReservationSchedule, ServiceCategory 5개 테이블에서 필요한 13개 필드만 선택해 단일 조인 쿼리로 가져옵니다. findAll() 기반 목록 조회 서비스는 Banner, AvailableTime, ServiceCategory 등 핵심 도메인 외 3개에만 존재합니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "N+1 문제는 발생한 뒤에 fetchJoin이나 EntityGraph로 해결하는 것보다, 처음부터 엔티티 조회가 아닌 필드 프로젝션 방식으로 설계하면 문제 자체가 발생하지 않습니다. 다만 이 방식을 유지하려면 팀 전체가 Custom Repository를 통해 QueryDSL 쿼리를 작성하는 패턴을 합의하고 일관되게 지켜야 합니다. 한 곳에서라도 엔티티를 직접 반환하면 N+1이 특정 API에서만 발생하는 상황이 생깁니다.",
    },
  ],
  relatedNoteSlugs: [
    "querydsl-projection-optimization",
    "querydsl-info-layer-data-flow",
  ],
};
