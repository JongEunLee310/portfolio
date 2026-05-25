import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const reservationCancelRefundFlow: TechnicalNoteCard = {
  slug: "reservation-cancel-refund-flow",
  title: "예약 취소가 고객·매니저·정산에 전파되는 흐름 설계 — 취소 주체별 상태 분기",
  summary:
    "예약 취소 시 포인트 환불, 매칭 상태 변경, 정산 제외를 각 역할에 올바르게 전파하기 위해 취소 주체(고객/매니저)와 결제 발생 시점에 따라 PRE_CANCELED와 CANCELED를 분리하고 ReservationCancel 이력으로 책임을 명확히 한 설계 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2025.07.10",
  readingTime: "7분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "JPA", category: "backend" },
    { name: "MySQL", category: "database" },
  ],
  relatedProjectSlugs: ["halo"],
  cardSummary: {
    title: "예약 취소 상태 분리와 도메인 전파 설계",
    problem:
      "취소 상태가 CANCELED 하나뿐이어서 결제 발생 여부를 상태값만으로 구분할 수 없었고, 취소 주체(고객/매니저)별 후처리 분기 로직이 서비스 전반에 흩어지는 문제가 있었습니다.",
    solution:
      "매니저 확정 전 취소는 PRE_CANCELED, 결제 후 취소는 CANCELED로 상태를 분리했습니다. ReservationCancel 이력 테이블로 취소 주체를 기록하고, 정산 배치는 COMPLETED 상태만 조회해 취소 예약을 자동 제외했습니다.",
    result:
      "취소 상태 자체가 결제 발생 여부를 암시해 환불 분기가 단순해졌고, 취소 주체 추적이 가능해졌습니다. 정산 배치에서 별도 필터 없이 취소 예약을 자동으로 제외합니다.",
  },
};
