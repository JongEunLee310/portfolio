import type { TechnicalNoteCard } from "@/types/note";

export const aiDevopsRetrospective: TechnicalNoteCard = {
  slug: "ai-devops-retrospective",
  title: "AI DevOps 플랫폼을 만들며 배운 운영 경계 설계",
  summary:
    "파이프라인 실행, 로그 분석, 알림, 모니터링을 나누며 배운 책임 경계와 다음 개선 방향을 정리한 회고입니다.",
  category: "architecture",
  thumbnail: "/images/notes/rabbitmq-topology.svg",
  date: "2026.05.21",
  readingTime: "9분 읽기",
  tags: [
    { name: "DevOps", category: "devops" },
    { name: "Architecture", category: "infra" },
    { name: "Observability", category: "observability" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
