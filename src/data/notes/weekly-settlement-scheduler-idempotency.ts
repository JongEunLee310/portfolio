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
};
