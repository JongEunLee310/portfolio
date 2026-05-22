import type { TechnicalNoteCard } from "@/types/note";

export const dbRoundTripOptimization: TechnicalNoteCard = {
  slug: "db-round-trip-optimization",
  title: "DB Round-trip 최적화로 API 응답 시간 개선하기",
  summary:
    "불필요한 쿼리와 N+1 문제를 분석하고, 조회 최적화 및 캐싱 전략을 통해 응답 시간을 개선한 기록입니다.",
  category: "performance",
  thumbnail: "/images/notes/db-round-trip.svg",
  date: "2026.05.16",
  readingTime: "10분 읽기",
  featured: true,
  tags: [
    { name: "Database", category: "database" },
    { name: "Performance", category: "tool" },
    { name: "FastAPI", category: "backend" },
    { name: "SQLAlchemy", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
