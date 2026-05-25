import type { IconName, TechTag } from "@/types/common";

export type TechStackGroup = {
  title: string;
  description: string;
  icon: IconName;
  items: TechTag[];
};

export const techStackGroups: TechStackGroup[] = [
  {
    title: "General",
    description: "서비스 로직과 API 설계",
    icon: "Server",
    items: [
      { name: "Spring Boot", category: "backend" },
      { name: "FastAPI", category: "backend" },
      { name: "Java", category: "language" },
      { name: "Python", category: "language" },
    ],
  },
  {
    title: "Database",
    description: "데이터 모델링과 조회 최적화",
    icon: "Database",
    items: [
      { name: "MySQL", category: "database" },
      { name: "PostgreSQL", category: "database" },
    ],
  },
  {
    title: "Infra",
    description: "클라우드 인프라와 컨테이너 실행 환경",
    icon: "Cloud",
    items: [
      { name: "AWS", category: "infra" },
      { name: "Docker", category: "infra" },
    ],
  },
  {
    title: "DevOps",
    description: "빌드, 테스트, 배포 자동화",
    icon: "Workflow",
    items: [
      { name: "GitHub Actions", category: "devops" },
      { name: "Jenkins", category: "devops" },
    ],
  },
  {
    title: "Observability",
    description: "운영 모니터링과 지표 수집",
    icon: "Activity",
    items: [
      { name: "Prometheus", category: "observability" },
      { name: "Grafana", category: "observability" },
    ],
  },
  {
    title: "AI / LLM",
    description: "AI API 연동과 생성형 기능 설계",
    icon: "Gauge",
    items: [
      { name: "OpenAI API", category: "ai" },
      { name: "Claude Code", category: "ai" },
      { name: "Codex", category: "ai" },
      { name: "GitHub Copilot", category: "ai" },
      { name: "Prompt Engineering", category: "ai" },
    ],
  },
];
