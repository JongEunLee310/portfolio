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
};
