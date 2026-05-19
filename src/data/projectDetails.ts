import type { ProjectDetail } from "@/types/project";
import { projects } from "./projects";

function findProject(slug: string) {
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw new Error(`projects.ts에 존재하지 않는 프로젝트 slug입니다: ${slug}`);
  }

  return project;
}

export const projectDetails: ProjectDetail[] = [
  {
    ...findProject("ai-devops-orchestration-platform"),
    heroImage: "/images/projects/ai-devops/dashboard.svg",
    overview:
      "AI DevOps Orchestration Platform은 Git 저장소 기반 파이프라인 실행, Job 로그 수집, 실패 원인 분석, AI Review 생성을 하나의 흐름으로 연결한 백엔드 중심 프로젝트입니다.",
    problem: {
      title: "문제 정의",
      items: [
        "파이프라인 실행 요청이 HTTP 요청 생명주기와 강하게 결합되어 응답 시간이 길어졌습니다.",
        "Git clone, 명령 실행, 로그 저장이 하나의 흐름에 섞여 있어 장애 원인 추적이 어려웠습니다.",
        "동기 실행 구조에서는 확장성과 운영 관점의 한계가 있었습니다.",
      ],
    },
    solution: {
      title: "해결 방향",
      items: [
        "PipelineRun을 도입해 실행 기록을 불변 실행 단위로 분리했습니다.",
        "실행 엔진과 AI 분석기를 JobRunLog 경계로 분리했습니다.",
        "Prometheus, Grafana, Loki를 통해 성능 병목을 관찰하고 개선했습니다.",
      ],
    },
    architecture: {
      title: "아키텍처",
      description:
        "API 서버, 실행 워커, 메시지 브로커, 데이터베이스, 관측 도구를 분리해 실행과 분석의 책임을 나눴습니다.",
      nodes: [
        {
          title: "Client",
          items: ["React UI", "Pipeline YAML", "Project Dashboard"],
          icon: "Code2",
        },
        {
          title: "API Server",
          items: ["FastAPI", "Auth", "Pipeline API", "AI Review API"],
          icon: "Server",
        },
        {
          title: "Execution Worker",
          items: ["Git Clone", "Job Command", "Log Capture"],
          icon: "Workflow",
        },
        {
          title: "Storage",
          items: ["PostgreSQL", "JobRunLog", "PipelineRun"],
          icon: "Database",
        },
      ],
    },
    features: [
      {
        title: "YAML 기반 파이프라인 생성",
        description:
          "GitHub Actions/GitLab CI와 유사한 YAML 구조로 Pipeline과 Job을 정의합니다.",
        icon: "Code2",
      },
      {
        title: "AI Review",
        description: "실패 로그를 기반으로 원인 분류와 개선 제안을 생성합니다.",
        icon: "Gauge",
      },
    ],
    screenshots: [
      {
        title: "Pipeline Dashboard",
        image: "/images/projects/ai-devops/screenshot-dashboard.svg",
      },
      {
        title: "Job Run Logs",
        image: "/images/projects/ai-devops/screenshot-logs.svg",
      },
    ],
    contributions: [
      {
        date: "Day 1 - 3",
        title: "도메인 모델링",
        description:
          "Pipeline, Job, PipelineRun, JobRunLog를 분리해 실행 정의와 실행 기록의 책임을 구분했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "Pipeline 실행 요청 지연",
        problem: "Git clone과 Job 실행이 HTTP 요청 중 처리되어 응답 시간이 길어졌습니다.",
        solution: "PipelineRun을 QUEUED 상태로 생성한 뒤 백그라운드 실행으로 분리했습니다.",
        result: "사용자 요청 응답과 실제 실행 처리가 분리되었습니다.",
      },
    ],
    performance: [
      {
        label: "실행 요청 응답",
        value: "Queued",
        description: "실행 완료 대기 대신 접수 즉시 응답",
        icon: "Workflow",
      },
      {
        label: "DB Round-trip",
        value: "Reduced",
        description: "중복 SELECT와 unbounded query 제거",
        icon: "Database",
      },
    ],
    retrospective: {
      learned: [
        "실행과 분석을 분리하면 기능 확장과 장애 추적이 쉬워집니다.",
        "모니터링은 단순 시각화가 아니라 개선 대상을 찾는 도구입니다.",
      ],
      improvement: [
        "Kubernetes 기반 Executor 확장",
        "LLM Review 품질 평가 지표 추가",
      ],
    },
    relatedNoteSlugs: [
      "async-pipeline-transition",
      "rabbitmq-event-topology",
      "db-round-trip-optimization",
    ],
  },
  {
    ...findProject("halocare"),
    heroImage: "/images/projects/halocare/dashboard.svg",
    overview:
      "HaloCare는 고객과 매니저를 연결하는 홈케어 매칭 서비스로, 예약, 매칭, 결제, 정산, 관리자 기능을 포함한 Spring Boot 기반 팀 프로젝트입니다.",
    problem: {
      title: "문제 정의",
      items: [
        "공통 모듈에 기능이 집중되어 도메인별 책임이 불명확했습니다.",
        "운영 환경에서 HTTPS, CORS, 배포 안정성 문제가 있었습니다.",
      ],
    },
    solution: {
      title: "해결 방향",
      items: [
        "도메인 기준 멀티모듈 구조로 리팩토링했습니다.",
        "AWS ALB, ACM, Route53, Blue-Green 배포 구조를 적용했습니다.",
      ],
    },
    architecture: {
      title: "아키텍처",
      nodes: [
        {
          title: "Backend",
          items: ["Spring Boot", "Multi Module", "Spring Security"],
          icon: "Server",
        },
        {
          title: "Database",
          items: ["MySQL", "JPA", "QueryDSL"],
          icon: "Database",
        },
        {
          title: "AWS",
          items: ["ALB", "ACM", "RDS", "ECR", "CloudFront"],
          icon: "Cloud",
        },
      ],
    },
    features: [],
    screenshots: [],
    contributions: [],
    troubleshooting: [],
    performance: [],
    retrospective: {
      learned: [
        "도메인 기준 모듈 분리는 코드 구조보다 의존성 방향 설계가 더 중요합니다.",
      ],
      improvement: ["모듈별 테스트 경계 강화", "운영 로그/트레이싱 고도화"],
    },
    relatedNoteSlugs: [
      "querydsl-projection-optimization",
      "alb-cors-troubleshooting",
    ],
  },
];
