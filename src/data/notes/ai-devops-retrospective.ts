import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const aiDevopsRetrospective: TechnicalNoteCard = {
  slug: "ai-devops-retrospective",
  title: "AI DevOps 오케스트레이션 플랫폼 회고 — MSA 전환과 비동기 전략 실험",
  summary:
    "BackgroundTasks → Celery → RabbitMQ MSA 세 가지 비동기 전략을 직접 구현·비교하고, MSA 전환의 목적과 이벤트 스키마 관리의 중요성을 정리한 회고입니다.",
  category: "retrospective",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.21",
  readingTime: "9분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "RabbitMQ", category: "infra" },
    { name: "FastAPI", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
