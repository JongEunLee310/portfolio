import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const multiModuleSharedDomainPortPattern: TechnicalNoteCard = {
  slug: "multi-module-shared-domain-port-pattern",
  title: "멀티모듈 공유 엔티티 참조 문제와 shared-domain Port 패턴",
  summary:
    "evaluation, payment 모듈이 reservation 엔티티에 접근해야 하는 상황에서 직접 의존 시 발생하는 순환 참조를 Port 인터페이스로 해소하고, shared-domain에 공유 엔티티와 ReservationQueryPort를 분리한 설계 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2025.06.01",
  readingTime: "8분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Gradle", category: "tool" },
    { name: "JPA", category: "backend" },
  ],
  relatedProjectSlugs: ["halo"],
  cardSummary: {
    title: "멀티모듈 공유 엔티티 순환 참조",
    problem: "evaluation·payment가 Reservation 접근을 위해 reservation을 직접 의존 → 순환 참조 위험",
    solution: "shared-domain에 Reservation 엔티티 + ReservationQueryPort 분리, 구현은 reservation 모듈 제공",
    result: "모듈 간 순환 참조 제거, 구현 의존 없이 Port 인터페이스로 협력",
  },
};
