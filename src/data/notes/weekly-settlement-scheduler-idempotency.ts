import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const weeklySettlementSchedulerIdempotency: TechnicalNoteCard = {
  slug: "weekly-settlement-scheduler-idempotency",
  title: "매주 정산 자동화와 중복 정산 방지 — @Scheduled + 멱등성 설계",
  summary:
    "Spring @Scheduled로 매주 목요일 자동 정산을 실행하면서, 이미 정산된 예약을 조회 단계에서 제외하는 방식으로 중복 실행을 방지한 멱등성 설계와 관리자 수동 실행 통합 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2025.06.10",
  readingTime: "6분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Spring Scheduler", category: "backend" },
    { name: "JPA", category: "backend" },
    { name: "MySQL", category: "database" },
  ],
  relatedProjectSlugs: ["halo"],
  cardSummary: {
    title: "주간 정산 멱등성",
    problem: "스케줄러 재실행 또는 관리자 수동 실행 시 동일 예약이 두 번 정산될 위험",
    solution: "조회 단계에서 기존 Settlement 연결 예약 제외, 스케줄러·수동 실행이 동일 서비스 메서드 호출",
    result: "동일 날짜 범위 재실행 시 신규 생성 건수 0, 이중 지급 방지",
  },
};
