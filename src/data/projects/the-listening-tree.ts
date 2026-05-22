import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const theListeningTree: ProjectCard = {
  slug: "the-listening-tree",
  title: "The Listening Tree",
  subtitle: "하루 한 번, 이야기를 남기면 AI가 따뜻하게 공감합니다",
  summary:
    "GPT-4o 기반 AI 심리 상담 서비스. 사용자가 이야기를 입력하면 AI 상담사가 따뜻한 공감 응답을 돌려주고, 이야기가 쌓일수록 화면의 나무가 자라납니다.",
  description:
    "사용자가 하루 한 번 이야기를 남기면 GPT-4o 기반 AI 상담사가 따뜻한 공감 응답을 돌려주는 심리 상담 웹 서비스입니다. 이야기가 누적될수록 메인 화면의 나무에 나뭇잎이 쌓이고, 현재 계절에 따라 UI 테마가 자동으로 변합니다. 백엔드는 auth_service, auto_response, memory_service, user_service 4개의 독립 FastAPI 마이크로서비스로 구성되며, Google OAuth 2.0과 JWT 이중 토큰으로 인증을 처리합니다.",
  thumbnail: "/images/projects/the-listening-tree/thumbnail.svg",
  category: ["ai", "personal"],
  type: "personal",
  status: "featured",
  period: "2025.01 ~ 2025.02",
  role: "Full Stack (설계, 백엔드, 프론트엔드, CI/CD)",
  teamSize: "1",
  techStack: [
    { name: "Python", category: "language" },
    { name: "FastAPI", category: "backend" },
    { name: "SQLAlchemy", category: "backend" },
    { name: "Alembic", category: "backend" },
    { name: "httpx", category: "backend" },
    { name: "python-jose", category: "backend" },
    { name: "OpenAI SDK", category: "ai" },
    { name: "GPT-4o", category: "ai" },
    { name: "Vue 3", category: "frontend" },
    { name: "Vuex", category: "frontend" },
    { name: "Tailwind CSS", category: "frontend" },
    { name: "Vite", category: "tool" },
    { name: "axios", category: "tool" },
    { name: "Docker", category: "infra" },
    { name: "AWS ECR", category: "infra" },
    { name: "GitHub Actions", category: "devops" },
    { name: "SonarCloud", category: "devops" },
    { name: "PostgreSQL", category: "database" },
  ],
  links: {
    detail: PATHS.projectDetail("the-listening-tree"),
  },
};
