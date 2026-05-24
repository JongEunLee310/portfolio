import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const aiDevopsProjectRetrospective: TechnicalNoteCard = {
  slug: "ai-devops-project-retrospective",
  title: "AI DevOps 오케스트레이션 플랫폼 전체 회고 — 동기 모놀리스에서 RabbitMQ MSA까지",
  summary:
    "단순한 파이프라인 실행 API에서 출발해 세 가지 비동기 전략을 거쳐 RabbitMQ 이벤트 드리븐 MSA와 서비스별 DB 분리까지 완성한 여정의 전체 회고입니다. 각 단계의 결정 이유와 한계, 설계 문서와 실패 기록이 AI 보조 개발에서 맥락 복원 지점이 된 경험을 기록합니다.",
  category: "retrospective",
  thumbnail: publicPath("/images/notes/rabbitmq-topology.svg"),
  date: "2026.05.24",
  readingTime: "12분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "RabbitMQ", category: "infra" },
    { name: "FastAPI", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
