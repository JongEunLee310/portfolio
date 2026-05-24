import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const statisticConcurrencyOptimisticLock: TechnicalNoteCard = {
  slug: "statistic-concurrency-optimistic-lock",
  title: "통계 동시 갱신 충돌 — @Version 낙관적 락과 @Retryable 재시도 설계",
  summary:
    "예약 완료·리뷰 등록 시 같은 통계 row를 동시에 수정하는 상황에서 벌크 업데이트와 엔티티 변경 감지를 혼재한 구조를 정리하고, @Version 낙관적 락과 @Retryable 재시도로 동시성 충돌을 처리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/querydsl-projection.svg"),
  date: "2025.05.20",
  readingTime: "8분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "JPA", category: "backend" },
    { name: "Spring Retry", category: "backend" },
    { name: "MySQL", category: "database" },
  ],
  relatedProjectSlugs: ["halo"],
};
