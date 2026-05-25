import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const domainModuleBoundaryFromMonolith: TechnicalNoteCard = {
  slug: "domain-module-boundary-from-monolith",
  title: "Monolith → 8 도메인 모듈 전환 — 패키지 경계에서 빌드 경계로",
  summary:
    "common 모듈 257개 파일이 9개 패키지로만 나뉜 사실상 Monolith 구조에서, 도메인 기준 8개 모듈로 전환하며 패키지 경계를 Gradle 의존성 경계로 끌어올린 의사결정과 남은 한계를 정리한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2025.06.05",
  readingTime: "9분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Gradle", category: "tool" },
    { name: "JPA", category: "backend" },
  ],
  relatedProjectSlugs: ["halo"],
  cardSummary: {
    title: "Monolith → 8 도메인 모듈 전환 경계 설정",
    problem: "common 모듈 257개 파일이 9개 패키지로만 나뉜 사실상 Monolith 구조. 예약 Repository가 manager·serviceCategory·review를 한 쿼리에 join해 도메인 경계 없이 결합도가 계속 높아짐",
    solution: "도메인 소유권 기준으로 8개 모듈(admin, evaluation, global, inquiry, member, payment, reservation, shared-domain) 분리. build.gradle 의존성으로 경계 강제. 여러 모듈이 공유하는 Reservation 타입과 ReservationQueryPort를 shared-domain(8파일)으로 분리",
    result: "패키지 경계(런타임 발견) → 빌드 의존성 경계(컴파일 발견)로 전환. evaluation·payment → reservation 순환 참조 2건 구조적 차단. reservation 5개 의존 / inquiry 1개 의존으로 모듈별 책임 범위 가시화",
  },
};
