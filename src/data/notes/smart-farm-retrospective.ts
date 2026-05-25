import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmRetrospective: TechnicalNoteCard = {
  slug: "smart-farm-retrospective",
  title: "스마트팜 모니터링 프로젝트 전체 회고 — 센서 수집 API에서 상태 기반 백엔드 구조까지",
  summary:
    "재배 환경 모니터링 시스템을 설계하면서 단순 센서 데이터 저장 구조의 한계를 인식하고, 데이터 수집 신뢰성·원격 제어 상태 전이·이상 감지까지 고려한 백엔드 설계 판단을 정리한 회고입니다.",
  category: "retrospective",
  thumbnail: publicPath("/images/notes/smart-farm-monitoring.svg"),
  date: "2026.05",
  readingTime: "10분 읽기",
  tags: [
    { name: "IoT", category: "infra" },
    { name: "Spring Boot", category: "backend" },
    { name: "Architecture", category: "infra" },
  ],
  relatedProjectSlugs: ["smart-farm"],
};
