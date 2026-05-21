import { PATHS } from "@/constants/paths";
import type { ProjectCard } from "@/types/project";

export const projects: ProjectCard[] = [
  {
    slug: "ai-devops-orchestration-platform",
    title: "AI DevOps Orchestration Platform",
    subtitle: "AI 기반 DevOps 자동화 플랫폼",
    summary:
      "Git 저장소 기반 파이프라인을 실행하고, 실패 로그를 분석해 AI Review를 생성하는 DevOps 자동화 플랫폼",
    description:
      "FastAPI 기반으로 Pipeline, Job, PipelineRun을 모델링하고 실행 로그와 AI 분석을 분리한 DevOps 오케스트레이션 플랫폼입니다.",
    thumbnail: "/images/projects/ai-devops/thumbnail.svg",
    category: ["backend", "infra", "ai"],
    type: "personal",
    status: "featured",
    period: "2026.01 - 진행 중",
    role: "Backend Lead / 설계 · 개발",
    teamSize: "1명",
    techStack: [
      { name: "FastAPI", category: "backend" },
      { name: "Python", category: "language" },
      { name: "PostgreSQL", category: "database" },
      { name: "Celery", category: "messaging" },
      { name: "RabbitMQ", category: "messaging" },
      { name: "Docker", category: "infra" },
      { name: "Prometheus", category: "observability" },
      { name: "Grafana", category: "observability" },
      { name: "OpenAI API", category: "ai" },
    ],
    metrics: [
      {
        label: "Pipeline 응답 구조 개선",
        value: "Async",
        description: "실행 요청과 실제 작업 처리를 분리",
        icon: "Workflow",
      },
      {
        label: "DB 접근 최적화",
        value: "Round-trip 감소",
        description: "중복 SELECT 및 unbounded query 개선",
        icon: "Database",
      },
    ],
    links: {
      detail: PATHS.projectDetail("ai-devops-orchestration-platform"),
      github: "https://github.com/JongEunLee310/ai-devops",
    },
  },
  {
    slug: "halocare",
    title: "HaloCare",
    subtitle: "홈케어 매칭 서비스",
    summary:
      "고객과 매니저를 연결하는 홈케어 서비스 백엔드 시스템 및 AWS 인프라 구축 프로젝트",
    description:
      "Spring Boot 멀티모듈 구조, 예약/매칭/결제/정산 도메인 흐름, AWS 기반 Blue-Green 배포를 경험한 팀 프로젝트입니다.",
    thumbnail: "/images/projects/halocare/thumbnail.svg",
    category: ["backend", "infra"],
    type: "team",
    status: "featured",
    period: "2025.05 - 2025.07",
    role: "Backend / Infra",
    teamSize: "팀 프로젝트",
    techStack: [
      { name: "Spring Boot", category: "backend" },
      { name: "JPA", category: "backend" },
      { name: "QueryDSL", category: "backend" },
      { name: "MySQL", category: "database" },
      { name: "AWS", category: "infra" },
      { name: "Docker", category: "infra" },
      { name: "GitHub Actions", category: "devops" },
      { name: "Blue-Green Deploy", category: "devops" },
    ],
    links: {
      detail: PATHS.projectDetail("halocare"),
      github: "https://github.com/JongEunLee310/halocare",
    },
  },
  {
    slug: "story-tree",
    title: "나만의 이야기 나무",
    subtitle: "AI 인터랙티브 스토리 서비스",
    summary:
      "ChatGPT API와 FastAPI, Vue 애니메이션을 활용한 인터랙티브 스토리 생성 서비스",
    description:
      "사용자의 선택에 따라 이야기가 나뭇가지처럼 확장되는 AI 기반 인터랙티브 스토리 프로젝트입니다.",
    thumbnail: "/images/projects/story-tree/thumbnail.svg",
    category: ["ai", "personal"],
    type: "personal",
    status: "normal",
    period: "2023.11 - 2024.01",
    role: "기획 / Backend / Prompt Engineering",
    techStack: [
      { name: "FastAPI", category: "backend" },
      { name: "Vue.js", category: "frontend" },
      { name: "OpenAI API", category: "ai" },
      { name: "Python", category: "language" },
    ],
    links: {
      detail: PATHS.projectDetail("story-tree"),
      github: "https://github.com/JongEunLee310/story-tree",
    },
  },
  {
    slug: "smart-farm",
    title: "Smart Farm",
    subtitle: "스마트팜 모니터링 시스템",
    summary:
      "센서 데이터를 수집하고 원격 제어 및 이벤트 알림을 제공하는 스마트팜 모니터링 시스템",
    description:
      "센서 데이터 수집, REST API 기반 저장, 원격 제어, 이벤트 알림 구조를 설계한 프로젝트입니다.",
    thumbnail: "/images/projects/smart-farm/thumbnail.svg",
    category: ["backend", "iot"],
    type: "team",
    status: "normal",
    period: "2024.03 - 2024.05",
    role: "Backend / Cloud Architecture",
    techStack: [
      { name: "Spring Boot", category: "backend" },
      { name: "MySQL", category: "database" },
      { name: "REST API", category: "backend" },
      { name: "Azure", category: "infra" },
      { name: "IoT", category: "tool" },
    ],
    links: {
      detail: PATHS.projectDetail("smart-farm"),
      github: "https://github.com/JongEunLee310/smart-farm",
    },
  },
  {
    slug: "log-eye",
    title: "LogEye",
    subtitle: "로그 수집 · 검색 플랫폼",
    summary:
      "분산 서비스 로그를 수집하고 검색과 알림을 제공하는 운영 관찰성 지원 플랫폼",
    description:
      "Spring Boot 기반 로그 수집 API와 Elasticsearch 검색 흐름을 설계하고, 운영자가 장애 단서를 빠르게 찾을 수 있도록 정리한 프로젝트입니다.",
    thumbnail: "/images/projects/log-eye/thumbnail.svg",
    category: ["backend", "infra"],
    type: "personal",
    status: "normal",
    period: "2025.09 - 2025.11",
    role: "Backend / Observability",
    techStack: [
      { name: "Spring Boot", category: "backend" },
      { name: "Elasticsearch", category: "observability" },
      { name: "Kibana", category: "observability" },
      { name: "Kafka", category: "messaging" },
      { name: "S3", category: "infra" },
      { name: "Docker", category: "infra" },
      { name: "Slack", category: "tool" },
      { name: "AWS", category: "infra" },
    ],
    links: {
      detail: PATHS.projectDetail("log-eye"),
      github: "https://github.com/JongEunLee310/log-eye",
    },
  },
  {
    slug: "code-mentor",
    title: "CodeMentor",
    subtitle: "AI 코드 리뷰 도우미",
    summary:
      "코드 리뷰와 학습 추천을 제공하는 AI 기반 개발자 보조 도구",
    description:
      "GitHub Pull Request 변경 내용을 분석해 리뷰 코멘트와 학습 포인트를 생성하는 AI 코드 멘토링 프로젝트입니다.",
    thumbnail: "/images/projects/code-mentor/thumbnail.svg",
    category: ["ai", "backend"],
    type: "personal",
    status: "normal",
    period: "2025.12 - 2026.01",
    role: "Backend / AI Integration",
    techStack: [
      { name: "FastAPI", category: "backend" },
      { name: "Python", category: "language" },
      { name: "OpenAI API", category: "ai" },
      { name: "PostgreSQL", category: "database" },
      { name: "Redis", category: "database" },
      { name: "Docker", category: "infra" },
      { name: "Celery", category: "messaging" },
      { name: "JWT", category: "backend" },
    ],
    links: {
      detail: PATHS.projectDetail("code-mentor"),
      github: "https://github.com/JongEunLee310/code-mentor",
    },
  },
];
