import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const aiDevopsOrchestrationPlatform: ProjectCard = {
  slug: "ai-devops-orchestration-platform",
  title: "AI Agent Pipeline Backend Design",
  subtitle: "AI Agent를 파이프라인에 적용할 수 있는 백엔드 설계",
  summary:
    "Pipeline 실행 오케스트레이션과 AI 기반 실패 분석을 설계하고 구현한 FastAPI 백엔드 API 서버",
  description:
    "FastAPI 기반으로 Project/Pipeline/Job CRUD, Git 저장소 명령 실행, LLM 실패 분석을 구현하고 BackgroundTasks, Celery + Redis, RabbitMQ MSA 전략을 비교 실험한 백엔드 프로젝트입니다.",
  thumbnail: "/images/projects/ai-devops/thumbnail.svg",
  category: ["backend", "infra", "ai"],
  type: "personal",
  status: "featured",
  period: "2026.04 ~ 진행 중",
  role: "설계 · 구현 · 테스트 · 문서화 전담",
  teamSize: "1명",
  techStack: [
    { name: "FastAPI", category: "backend" },
    { name: "Python 3.12", category: "language" },
    { name: "SQLAlchemy 2.0", category: "backend" },
    { name: "PostgreSQL", category: "database" },
    { name: "RabbitMQ", category: "messaging" },
    { name: "Celery", category: "backend" },
    { name: "Redis", category: "database" },
    { name: "Docker Compose", category: "infra" },
    { name: "Prometheus", category: "observability" },
    { name: "Grafana", category: "observability" },
    { name: "Anthropic API", category: "ai" },
    { name: "OpenAI API", category: "ai" },
    { name: "Claude Code", category: "tool" },
    { name: "Codex", category: "tool" },
    { name: "GitHub Copilot", category: "tool" },
  ],
  metrics: [
    {
      label: "처리량",
      value: "47.4 req/s",
      description: "Celery + Redis, 100 VU 기준",
      icon: "Zap",
    },
  ],
  links: {
    detail: PATHS.projectDetail("ai-devops-orchestration-platform"),
    github: "https://gitlab.com/SighingOwl/ai_devops",
  },
};
