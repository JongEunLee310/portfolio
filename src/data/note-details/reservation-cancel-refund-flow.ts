import type { TechnicalNoteDetail } from "@/types/note";
import { reservationCancelRefundFlow } from "../notes/reservation-cancel-refund-flow";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const reservationCancelRefundFlowDetail: TechnicalNoteDetail = {
  ...reservationCancelRefundFlow,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "가사도우미 매칭 플랫폼에서 예약 취소는 단순한 상태 변경이 아니었습니다. 취소 한 건이 세 가지 도메인에 걸쳐 영향을 미쳤습니다.",
    },
    {
      type: "list",
      items: [
        "고객: 결제에 사용한 포인트를 환불받아야 한다.",
        "매니저: 자신의 스케줄에서 해당 예약이 취소되었음을 인지해야 한다.",
        "관리자 정산: 취소된 예약은 정산 대상에서 제외되어야 한다.",
      ],
    },
    {
      type: "paragraph",
      content:
        "취소 경로도 두 가지로 나뉘었습니다. 매니저를 선택하기 전에 취소하는 경우(결제 미발생)와 매니저를 확정하고 결제까지 완료한 뒤 취소하는 경우(결제 발생)를 같은 방식으로 처리하면 불필요한 환불이 발생하거나 반대로 환불이 누락될 수 있었습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "취소 상태를 CANCELED 하나로만 관리하면 결제가 발생했는지를 상태만으로 구분할 수 없습니다. 결제 발생 여부를 별도로 조회해야 하고, 조회 결과에 따라 분기 로직이 흩어집니다.",
        "취소 주체(고객/매니저)에 따라 후처리가 달라야 하는데, 주체 정보가 상태 값에 포함되지 않으면 취소 이후 누가 취소했는지 알기 위해 별도 조회가 필요합니다.",
        "매주 실행되는 정산 배치가 예약 상태를 필터로 사용하지 않으면 취소된 예약이 정산 대상에 포함될 수 있습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "취소 시점 분리",
          description:
            "매니저 선택 전 취소는 PRE_CANCELED, 결제 완료 후 취소는 CANCELED로 상태를 분리했습니다. 결제 발생 여부를 상태 값 자체가 나타내도록 설계했습니다.",
          badge: "상태 분기",
        },
        {
          title: "ReservationCancel 이력 테이블",
          description:
            "취소 발생 시 ReservationCancel 레코드를 생성하고 canceledByType(UserRole)에 취소 주체를 기록합니다. @PreRemove로 삭제를 막아 취소 이력을 영구 보존합니다.",
          badge: "책임 기록",
        },
        {
          title: "정산 조회 단계 제외",
          description:
            "정산 배치는 COMPLETED 상태 예약만 조회합니다. 취소 예약(CANCELED, PRE_CANCELED)은 조회 단계에서 자동으로 제외되어 별도 필터 로직이 필요 없습니다.",
          badge: "암묵적 제외",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "java",
      filename: "CustomerReservationServiceImpl.java",
      code: "// 매니저 확정 후 취소 — 결제 발생 → 환불 필요\n@Transactional\npublic void cancelReservationByCustomer(Long userId, UserRole userRole,\n        Long reservationId, ReservationCancelReqDTO cancelReqDTO) {\n    Reservation foundReservation = customerReservationRepository\n        .getCancelableReservation(reservationId, userId)\n        .orElseThrow(...);\n\n    foundReservation.changeStatus(cancelReqDTO.getCancelReason(), ReservationStatus.CANCELED);\n\n    cancelRepository.save(ReservationCancel.builder()\n        .reservation(foundReservation)\n        .canceledById(userId)\n        .canceledByType(userRole)   // 취소 주체 기록\n        .cancelReason(cancelReqDTO.getCancelReason())\n        .build());\n\n    customerService.chargePoint(userId, foundReservation.getPrice(), PointChargeType.CANCEL); // 포인트 원복\n    paymentService.changeStatus(foundReservation, PaymentStatus.CANCELED); // 결제 취소\n}",
    },
    {
      type: "code",
      language: "java",
      filename: "CustomerReservationServiceImpl.java",
      code: "// 매니저 선택 전 취소 — 결제 미발생 → 환불 없음\n@Transactional\npublic void cancelBeforeConfirmReservation(Long userId, UserRole userRole,\n        Long reservationId) {\n    String cancelReason = \"매니저 선택 전 취소\";\n\n    Reservation foundReservation = customerReservationRepository\n        .getCancelableReservation(reservationId, userId)\n        .orElseThrow(...);\n\n    foundReservation.changeStatus(cancelReason, ReservationStatus.PRE_CANCELED); // 결제 없음\n\n    cancelRepository.save(ReservationCancel.builder()\n        .reservation(foundReservation)\n        .canceledById(userId)\n        .canceledByType(userRole)\n        .cancelReason(cancelReason)\n        .build());\n    // chargePoint, paymentService 호출 없음\n}",
    },
    {
      type: "code",
      language: "java",
      filename: "MatchServiceImpl.java",
      code: "// 취소 시 매칭 상태 변경 — 매니저가 예약 취소를 인지\n@Transactional\npublic void changeStatus(Long reservationId) {\n    ReservationMatch foundMatch = matchingRepository\n        .findByReservation_ReservationId(reservationId);\n    foundMatch.changeStatus(MatchStatus.RESERVATION_CANCELED);\n}",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "실시간 정산 제외: 취소 이벤트 발생 시 즉시 정산 테이블을 수정 → 취소마다 트랜잭션이 정산 계산을 수행하여 시스템 부하 증가.",
        "배치 정산(채택): 정산 배치가 COMPLETED 상태 예약만 조회 → 취소 예약은 조회 단계에서 자동 제외. 매주 1회 일괄 처리로 부하 분산.",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "list",
      items: [
        "고객: Payment.status = CANCELED로 환불 처리 완료 확인 가능. 포인트는 즉시 원복.",
        "매니저: ReservationMatch.status = RESERVATION_CANCELED로 자신의 예약 목록에서 취소 사실 인지.",
        "관리자 정산: 정산 배치 조회 쿼리가 COMPLETED만 대상으로 하여 CANCELED·PRE_CANCELED 예약은 자동 제외.",
      ],
    },
    troubleshootingHeading(6),
    {
      type: "paragraph",
      content:
        "취소는 단일 트랜잭션이지만 여러 도메인에 파급 효과가 있습니다. 상태 값 자체가 결제 발생 여부를 암시하도록 설계하면 분기 로직이 단순해집니다. ReservationCancel처럼 이력 테이블을 두면 취소 주체와 사유가 명확히 추적되고, 정산 배치처럼 조회 단계에서 제외 조건을 처리하면 별도 취소 연동 로직 없이 정합성을 유지할 수 있습니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "매니저 거절(rejectReservation) 시 고객이 이미 결제를 완료한 경우 포인트 환불과 결제 취소가 자동으로 처리되지 않습니다. 현재 구현에서는 매니저 거절 후 고객이 직접 취소하거나 관리자가 개입해야 환불이 완료됩니다. 향후 개선 방향으로 매니저 거절 시 환불 자동 트리거를 추가할 필요가 있습니다.",
      },
  ],
  relatedNoteSlugs: [
    "weekly-settlement-scheduler-idempotency",
    "statistic-concurrency-optimistic-lock",
    "multi-module-shared-domain-port-pattern",
  ],
};
