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
    heroHighlights: [
      {
        label: "배포 자동화 시간 절감",
        value: "90%+",
        icon: "Workflow",
      },
      {
        label: "장애 탐지 정확도",
        value: "95%+",
        icon: "Gauge",
      },
      {
        label: "운영 비용 절감",
        value: "40%",
        icon: "Cloud",
      },
    ],
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
    architectureFlow: {
      title: "아키텍처",
      description:
        "사용자 요청부터 파이프라인 실행, 로그 분석, 배포 알림까지를 독립된 서비스와 인프라 경계로 나눠 운영 흐름을 단순화했습니다.",
      groups: [
        {
          id: "clients",
          title: "사용자 / 외부",
          nodes: [
            {
              id: "web-ui",
              title: "Web UI",
              items: ["Pipeline 실행", "AI Review 확인"],
              icon: "Code2",
            },
            {
              id: "cli",
              title: "CLI",
              items: ["실행 요청", "상태 조회"],
              icon: "Workflow",
            },
            {
              id: "api-clients",
              title: "API Clients",
              items: ["Webhook", "외부 연동"],
              icon: "ExternalLink",
            },
          ],
        },
        {
          id: "gateway",
          title: "API Gateway",
          nodes: [
            {
              id: "gateway-service",
              title: "Gateway",
              items: ["Auth", "Routing", "Rate Limit"],
              icon: "Server",
            },
          ],
        },
        {
          id: "services",
          title: "마이크로서비스",
          nodes: [
            {
              id: "auth-service",
              title: "Auth Service",
              items: ["Token", "Permission"],
              icon: "Server",
            },
            {
              id: "pipeline-service",
              title: "Pipeline Service",
              items: ["PipelineRun", "JobRun"],
              icon: "Workflow",
            },
            {
              id: "deploy-service",
              title: "Deploy Service",
              items: ["Release", "History"],
              icon: "Cloud",
            },
            {
              id: "ai-insight-service",
              title: "AI Insight Service",
              items: ["Log Summary", "Review"],
              icon: "Gauge",
            },
            {
              id: "notification-service",
              title: "Notification Service",
              items: ["Slack", "Email"],
              icon: "MessageSquare",
            },
            {
              id: "monitoring-service",
              title: "Monitoring Service",
              items: ["Metric", "Alert"],
              icon: "Activity",
            },
          ],
        },
        {
          id: "data-ai",
          title: "데이터 & AI",
          nodes: [
            {
              id: "postgresql",
              title: "PostgreSQL",
              items: ["Metadata", "Run State"],
              icon: "Database",
            },
            {
              id: "redis",
              title: "Redis",
              items: ["Cache", "Queue State"],
              icon: "Database",
            },
            {
              id: "s3-minio",
              title: "S3 / MinIO",
              items: ["Artifacts", "Logs"],
              icon: "Cloud",
            },
            {
              id: "ml-model",
              title: "ML Model",
              items: ["Anomaly", "Review"],
              icon: "Gauge",
            },
          ],
        },
        {
          id: "infra-integrations",
          title: "인프라 / 외부 연동",
          nodes: [
            {
              id: "kubernetes",
              title: "Kubernetes",
              items: ["Worker", "Scaling"],
              icon: "Cloud",
            },
            {
              id: "aws-gcp",
              title: "AWS / GCP",
              items: ["Registry", "Storage"],
              icon: "Cloud",
            },
            {
              id: "docker-registry",
              title: "Docker Registry",
              items: ["Image", "Tag"],
              icon: "Layers",
            },
            {
              id: "slack-email",
              title: "Slack / Email",
              items: ["Alert", "Report"],
              icon: "MessageSquare",
            },
          ],
        },
      ],
      connections: [
        {
          from: "web-ui",
          to: "gateway-service",
          tone: "sync",
          label: "HTTP/API",
        },
        {
          from: "cli",
          to: "gateway-service",
          tone: "sync",
          label: "CLI 요청",
        },
        {
          from: "api-clients",
          to: "gateway-service",
          tone: "sync",
          label: "Webhook",
        },
        {
          from: "gateway-service",
          to: "auth-service",
          tone: "sync",
          label: "인증",
        },
        {
          from: "gateway-service",
          to: "pipeline-service",
          tone: "sync",
          label: "실행 요청",
        },
        {
          from: "pipeline-service",
          to: "deploy-service",
          tone: "async",
          label: "배포 이벤트",
        },
        {
          from: "pipeline-service",
          to: "ai-insight-service",
          tone: "async",
          label: "로그 분석",
        },
        {
          from: "ai-insight-service",
          to: "notification-service",
          tone: "async",
          label: "리뷰 결과",
        },
        {
          from: "deploy-service",
          to: "monitoring-service",
          tone: "async",
          label: "상태 변경",
        },
        {
          from: "pipeline-service",
          to: "postgresql",
          tone: "data",
          label: "실행 상태",
        },
        {
          from: "pipeline-service",
          to: "s3-minio",
          tone: "data",
          label: "로그/산출물",
        },
        {
          from: "ai-insight-service",
          to: "ml-model",
          tone: "sync",
          label: "추론",
        },
        {
          from: "pipeline-service",
          to: "redis",
          tone: "data",
          label: "캐시",
        },
        {
          from: "deploy-service",
          to: "kubernetes",
          tone: "sync",
          label: "배포",
        },
        {
          from: "deploy-service",
          to: "docker-registry",
          tone: "sync",
          label: "이미지",
        },
        {
          from: "notification-service",
          to: "slack-email",
          tone: "async",
          label: "알림",
        },
        {
          from: "s3-minio",
          to: "aws-gcp",
          tone: "data",
          label: "스토리지",
        },
      ],
      legends: [
        {
          label: "동기 요청",
          tone: "solid",
        },
        {
          label: "비동기 이벤트",
          tone: "dashed",
        },
        {
          label: "데이터 흐름",
          tone: "muted",
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
        title: "인프라 자동화",
        description:
          "Terraform 기반 환경 프로비저닝과 실행 환경 변경 이력을 관리합니다.",
        icon: "Cloud",
      },
      {
        title: "AI Review",
        description: "실패 로그를 기반으로 원인 분류와 개선 제안을 생성합니다.",
        icon: "Gauge",
      },
      {
        title: "실시간 모니터링",
        description:
          "Prometheus와 Grafana로 실행 지표와 장애 신호를 추적합니다.",
        icon: "Activity",
      },
      {
        title: "배포 관리",
        description:
          "릴리스 이력과 배포 상태를 한 흐름에서 확인할 수 있게 구성했습니다.",
        icon: "Workflow",
      },
    ],
    techStackGroups: [
      {
        title: "Backend",
        items: [
          { name: "FastAPI", category: "backend" },
          { name: "Python", category: "language" },
          { name: "SQLAlchemy", category: "backend" },
          { name: "Pydantic", category: "backend" },
        ],
      },
      {
        title: "Infra & DevOps",
        items: [
          { name: "Kubernetes", category: "infra" },
          { name: "Docker", category: "infra" },
          { name: "Terraform", category: "devops" },
          { name: "ArgoCD", category: "devops" },
        ],
      },
      {
        title: "Data & AI",
        items: [
          { name: "PostgreSQL", category: "database" },
          { name: "Redis", category: "database" },
          { name: "PyTorch", category: "ai" },
          { name: "Scikit-learn", category: "ai" },
        ],
      },
      {
        title: "Messaging & Etc",
        items: [
          { name: "Kafka", category: "messaging" },
          { name: "Prometheus", category: "observability" },
          { name: "Grafana", category: "observability" },
          { name: "Slack API", category: "tool" },
        ],
      },
    ],
    screenshots: [
      {
        title: "파이프라인 실행 현황",
        image: "/images/projects/ai-devops/screenshot-dashboard.svg",
      },
      {
        title: "AI 이상 탐지 대시보드",
        image: "/images/projects/ai-devops/screenshot-logs.svg",
      },
      {
        title: "배포 히스토리",
        image: "/images/projects/ai-devops/dashboard.svg",
      },
      {
        title: "서비스 모니터링",
        image: "/images/projects/ai-devops/thumbnail.svg",
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
        problem:
          "Git clone과 Job 실행이 HTTP 요청 중 처리되어 응답 시간이 길어졌습니다.",
        solution:
          "PipelineRun을 QUEUED 상태로 생성한 뒤 백그라운드 실행으로 분리했습니다.",
        result: "사용자 요청 응답과 실제 실행 처리가 분리되었습니다.",
        noteSlug: "async-pipeline-transition",
      },
      {
        title: "AI 모델 추론 지연",
        problem:
          "배치 수집 로그 전체를 한 번에 분석하면서 실패 원인 제안까지 도달하는 시간이 길어졌습니다.",
        solution:
          "로그를 단계별로 요약하고 핵심 에러 패턴만 추론 입력으로 전달하도록 전처리했습니다.",
        result: "분석 후보가 줄어들어 실패 원인 확인 시간이 단축되었습니다.",
        noteSlug: "ai-log-analysis-latency",
      },
      {
        title: "메트릭 고카디널리티 문제",
        problem:
          "파이프라인 실행 ID를 그대로 metric label에 포함해 시계열 수가 빠르게 증가했습니다.",
        solution:
          "라벨 기준을 서비스, 상태, 단계로 제한하고 실행 상세는 로그와 DB에서 조회하도록 분리했습니다.",
        result: "관측 비용과 쿼리 부하를 줄이면서 주요 지표는 유지했습니다.",
        noteSlug: "metric-cardinality-troubleshooting",
      },
      {
        title: "이벤트 재처리 누락",
        problem:
          "워커 장애 이후 일부 배포 이벤트가 재처리되지 않아 실행 상태와 알림 상태가 어긋났습니다.",
        solution:
          "RabbitMQ Exchange, Queue, DLQ 경계를 다시 정리하고 실패 이벤트를 별도 재처리 큐로 분리했습니다.",
        result: "실패 이벤트를 추적하고 재시도할 수 있는 운영 경로가 생겼습니다.",
        noteSlug: "rabbitmq-event-topology",
      },
      {
        title: "목록 조회 DB 병목",
        problem:
          "대시보드 목록 조회에서 PipelineRun과 JobRunLog를 반복 조회하며 응답 시간이 늘어났습니다.",
        solution:
          "목록 API의 조회 범위를 제한하고 필요한 필드만 projection해 DB round-trip을 줄였습니다.",
        result: "대시보드 초기 로딩 시간이 안정화되었습니다.",
        noteSlug: "db-round-trip-optimization",
      },
    ],
    improvements: [
      {
        title: "DB 쿼리 최적화",
        description:
          "PipelineRun 목록 조회에서 필요한 필드만 가져오고 N+1 접근을 줄였습니다.",
        result: "응답 시간 65% 개선",
        icon: "Database",
      },
      {
        title: "캐시 전략 도입",
        description:
          "자주 조회되는 프로젝트 메타데이터와 권한 정보를 Redis에 캐싱했습니다.",
        result: "API 응답 시간 50% 단축",
        icon: "Activity",
      },
      {
        title: "비동기 처리 확대",
        description:
          "배포와 AI 분석을 이벤트 기반 작업으로 분리해 사용자 요청 흐름을 가볍게 만들었습니다.",
        result: "처리량 2.2배 증가",
        icon: "Workflow",
      },
    ],
    performance: [
      {
        label: "배포 자동화 시간 절감",
        value: "90%+",
        description: "수동 실행 단계를 파이프라인으로 통합",
        icon: "Workflow",
      },
      {
        label: "장애 탐지 정확도",
        value: "95%+",
        description: "실패 로그 기반 원인 후보 분류",
        icon: "Gauge",
      },
      {
        label: "인프라 운영 비용 절감",
        value: "40%",
        description: "자동 스케일링과 캐시 전략 적용",
        icon: "Cloud",
      },
      {
        label: "시스템 가용성",
        value: "99.9%",
        description: "관측 지표 기반 장애 대응 흐름 구축",
        icon: "Activity",
      },
      {
        label: "팀 만족도",
        value: "4.5/5",
        description: "운영자 피드백 기반 사용성 개선",
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
      noteSlug: "ai-devops-retrospective",
    },
    relatedNoteSlugs: [
      "async-pipeline-transition",
      "rabbitmq-event-topology",
      "db-round-trip-optimization",
      "ai-devops-retrospective",
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
      description:
        "Spring Boot 멀티모듈 애플리케이션을 AWS 배포 인프라와 분리하고, 요청 흐름은 ALB와 도메인 서버를 거쳐 MySQL에 저장되도록 구성했습니다.",
      nodes: [
        {
          title: "Backend",
          items: ["Spring Boot", "Multi Module", "Spring Security", "REST API"],
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
        {
          title: "Delivery",
          items: ["GitHub Actions", "Docker Image", "Blue-Green Deploy"],
          icon: "Workflow",
        },
      ],
    },
    features: [
      {
        title: "예약/매칭 도메인 API",
        description:
          "고객 요청, 매니저 매칭, 예약 상태 변경을 도메인 단위 API로 분리해 서비스 흐름을 구성했습니다.",
        icon: "Workflow",
      },
      {
        title: "관리자 운영 기능",
        description:
          "서비스 운영에 필요한 사용자, 예약, 정산 관련 조회 흐름을 백오피스 관점에서 정리했습니다.",
        icon: "Layers",
      },
      {
        title: "AWS Blue-Green 배포",
        description:
          "ALB 대상 그룹과 배포 스크립트를 활용해 신규 버전 전환 시 중단 시간을 줄이는 구조를 적용했습니다.",
        icon: "Cloud",
      },
    ],
    screenshots: [
      {
        title: "HaloCare Service Overview",
        image: "/images/projects/halocare/dashboard.svg",
        description:
          "홈케어 예약, 매칭, 운영 관리 흐름을 백엔드 도메인과 배포 인프라 관점에서 정리한 화면입니다.",
      },
    ],
    contributions: [
      {
        date: "2025.05",
        title: "도메인 구조 설계",
        description:
          "예약, 매칭, 결제, 정산 흐름을 분리하고 Spring Boot 멀티모듈 기준으로 책임 경계를 정리했습니다.",
      },
      {
        date: "2025.06",
        title: "AWS 배포 환경 구성",
        description:
          "ALB, ACM, Route53, RDS, ECR을 연결하고 HTTPS 및 배포 자동화 흐름을 구축했습니다.",
      },
      {
        date: "2025.07",
        title: "조회 성능 개선",
        description:
          "QueryDSL Projection을 활용해 목록 조회에서 필요한 필드만 가져오도록 개선했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "ALB 환경 CORS/OPTIONS 오류",
        problem:
          "프론트엔드 요청이 Cloudflare와 ALB를 거치는 과정에서 OPTIONS 요청이 안정적으로 처리되지 않았습니다.",
        solution:
          "Spring Boot CORS 설정, ALB 리스너 규칙, HTTPS 인증서 연결 상태를 함께 점검하고 요청 경로를 정리했습니다.",
        result: "운영 도메인 기준으로 API 호출 흐름이 정상화되었습니다.",
      },
      {
        title: "공통 모듈 책임 집중",
        problem:
          "초기 구조에서 공통 모듈이 비대해져 도메인 코드 변경 영향 범위가 커졌습니다.",
        solution:
          "도메인별 모듈과 공통 모듈의 역할을 다시 구분하고 의존성 방향을 정리했습니다.",
        result: "기능 변경 시 수정 지점을 더 빠르게 파악할 수 있게 되었습니다.",
      },
    ],
    performance: [
      {
        label: "배포 전환",
        value: "Blue-Green",
        description: "ALB 대상 그룹 전환 기반 배포 흐름 적용",
        icon: "Cloud",
      },
      {
        label: "조회 최적화",
        value: "Projection",
        description: "QueryDSL로 필요한 응답 필드만 조회",
        icon: "Database",
      },
      {
        label: "운영 경로",
        value: "HTTPS",
        description: "ACM, Route53, ALB 기반 공개 API 경로 구성",
        icon: "Server",
      },
    ],
    retrospective: {
      learned: [
        "도메인 기준 모듈 분리는 코드 구조보다 의존성 방향 설계가 더 중요합니다.",
        "배포 장애는 애플리케이션 설정과 클라우드 네트워크 경계를 함께 봐야 빠르게 좁힐 수 있습니다.",
      ],
      improvement: ["모듈별 테스트 경계 강화", "운영 로그/트레이싱 고도화"],
    },
    relatedNoteSlugs: [
      "querydsl-projection-optimization",
      "alb-cors-troubleshooting",
    ],
  },
  {
    ...findProject("story-tree"),
    heroImage: "/images/projects/story-tree/thumbnail.svg",
    overview:
      "나만의 이야기 나무는 사용자의 선택에 따라 다음 장면이 분기되고, AI가 이어지는 이야기를 생성하는 인터랙티브 스토리 서비스입니다.",
    problem: {
      title: "개발 배경",
      items: [
        "일방향으로 소비되는 생성형 AI 텍스트보다 사용자가 직접 선택하고 다시 분기하는 경험을 만들고 싶었습니다.",
        "LLM 응답을 그대로 노출하면 이야기 톤과 선택지 형식이 흔들릴 수 있었습니다.",
        "프론트엔드 애니메이션과 백엔드 생성 흐름을 느슨하게 연결할 구조가 필요했습니다.",
      ],
    },
    solution: {
      title: "해결 방향",
      items: [
        "스토리 노드를 기준으로 현재 장면, 선택지, 다음 장면 생성 요청을 분리했습니다.",
        "프롬프트에 장르, 독자 연령, 이전 선택 맥락을 포함해 응답 일관성을 높였습니다.",
        "FastAPI API와 Vue 화면을 분리해 생성 요청, 로딩 상태, 결과 렌더링을 명확히 나눴습니다.",
      ],
    },
    architecture: {
      title: "스토리 생성 구조",
      description:
        "사용자 선택을 Story Node로 저장하고, 백엔드는 이전 맥락을 조합해 OpenAI API에 다음 장면 생성을 요청합니다.",
      nodes: [
        {
          title: "Client",
          items: ["Vue.js", "Story Tree UI", "Choice Interaction"],
          icon: "Code2",
        },
        {
          title: "API",
          items: ["FastAPI", "Story Request", "Prompt Builder"],
          icon: "Server",
        },
        {
          title: "AI Layer",
          items: ["OpenAI API", "Context Prompt", "Choice Generation"],
          icon: "Gauge",
        },
        {
          title: "Story Model",
          items: ["Story Node", "Branch", "History Context"],
          icon: "Layers",
        },
      ],
    },
    features: [
      {
        title: "선택 기반 스토리 분기",
        description:
          "사용자가 고른 선택지를 기준으로 다음 장면이 생성되고, 전체 이야기가 나무 구조처럼 확장됩니다.",
        icon: "Workflow",
      },
      {
        title: "프롬프트 템플릿 관리",
        description:
          "장르, 이전 줄거리, 선택지 조건을 조합해 AI 응답의 톤과 형식을 안정화했습니다.",
        icon: "Code2",
      },
      {
        title: "인터랙티브 애니메이션",
        description:
          "Vue 화면에서 이야기 노드가 확장되는 시각적 피드백을 제공해 선택의 결과를 직관적으로 보여줬습니다.",
        icon: "Activity",
      },
    ],
    screenshots: [
      {
        title: "Story Tree Preview",
        image: "/images/projects/story-tree/thumbnail.svg",
        description:
          "선택지가 누적되며 이야기가 가지처럼 이어지는 서비스 콘셉트 화면입니다.",
      },
    ],
    contributions: [
      {
        date: "2023.11",
        title: "서비스 흐름 기획",
        description:
          "스토리 시작, 선택지 제공, 다음 장면 생성, 분기 저장까지의 핵심 사용자 흐름을 정의했습니다.",
      },
      {
        date: "2023.12",
        title: "FastAPI 생성 API 구현",
        description:
          "프론트엔드에서 전달한 선택 맥락을 받아 프롬프트를 구성하고 AI 응답을 반환하는 API를 구현했습니다.",
      },
      {
        date: "2024.01",
        title: "프롬프트 품질 조정",
        description:
          "선택지 개수, 문장 길이, 장르 톤을 제한해 화면에서 바로 사용 가능한 응답 형식을 만들었습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "AI 응답 형식 흔들림",
        problem:
          "장면 본문과 선택지가 매번 다른 형식으로 생성되어 화면 렌더링 로직이 복잡해졌습니다.",
        solution:
          "프롬프트에 출력 구조와 선택지 개수를 명시하고, 응답 후 검증 가능한 필드 단위로 파싱하도록 정리했습니다.",
        result:
          "프론트엔드가 예측 가능한 데이터 구조로 스토리 노드를 렌더링할 수 있게 되었습니다.",
      },
      {
        title: "긴 맥락으로 인한 응답 지연",
        problem:
          "이전 장면 전체를 계속 전달하면 프롬프트가 길어지고 생성 시간이 늘어났습니다.",
        solution:
          "최근 선택과 요약된 줄거리만 다음 요청에 포함하도록 맥락 범위를 제한했습니다.",
        result: "스토리 일관성을 유지하면서 요청 payload를 줄였습니다.",
      },
    ],
    performance: [
      {
        label: "생성 흐름",
        value: "Node-based",
        description: "장면과 선택지를 Story Node 단위로 관리",
        icon: "Workflow",
      },
      {
        label: "응답 안정성",
        value: "Template",
        description: "프롬프트 출력 형식 제한으로 렌더링 안정화",
        icon: "Code2",
      },
      {
        label: "맥락 관리",
        value: "Summarized",
        description: "이전 줄거리 요약으로 프롬프트 길이 제어",
        icon: "Gauge",
      },
    ],
    retrospective: {
      learned: [
        "LLM 기능은 프롬프트만큼 응답을 소비하는 데이터 구조 설계가 중요합니다.",
        "생성형 UI에서는 로딩, 실패, 재시도 상태를 초기에 함께 설계해야 사용자 경험이 안정됩니다.",
      ],
      improvement: [
        "스토리 노드 영속화와 이어하기 기능 추가",
        "응답 품질 평가를 위한 샘플 시나리오 테스트 구축",
      ],
    },
    relatedNoteSlugs: [],
  },
  {
    ...findProject("smart-farm"),
    heroImage: "/images/projects/smart-farm/thumbnail.svg",
    overview:
      "Smart Farm은 온습도 등 센서 데이터를 수집해 저장하고, 원격 제어와 이벤트 알림을 제공하는 스마트팜 모니터링 시스템입니다.",
    problem: {
      title: "개발 배경",
      items: [
        "농장 환경 데이터는 주기적으로 쌓이지만, 이상 상태를 늦게 발견하면 대응 비용이 커집니다.",
        "센서 수집, 저장, 제어 요청, 알림 처리가 한 흐름에 섞이면 장애 원인을 추적하기 어렵습니다.",
        "현장 장비와 클라우드 API 사이의 네트워크 지연과 실패를 고려한 구조가 필요했습니다.",
      ],
    },
    solution: {
      title: "해결 방향",
      items: [
        "센서 데이터 수집 API와 원격 제어 API를 분리해 읽기/쓰기 흐름을 명확히 했습니다.",
        "임계치 기반 이벤트 판단 로직을 두어 온습도 변화에 따른 알림 조건을 관리했습니다.",
        "Azure 배포 환경에서 API 서버와 데이터베이스를 분리해 운영 구조를 단순화했습니다.",
      ],
    },
    architecture: {
      title: "IoT 모니터링 구조",
      description:
        "센서 장비가 REST API로 데이터를 전송하면 백엔드는 측정값을 저장하고, 임계치 조건에 따라 이벤트와 제어 상태를 관리합니다.",
      nodes: [
        {
          title: "Device",
          items: ["Temperature Sensor", "Humidity Sensor", "Control Module"],
          icon: "Activity",
        },
        {
          title: "API Server",
          items: ["Spring Boot", "Sensor API", "Control API"],
          icon: "Server",
        },
        {
          title: "Database",
          items: ["MySQL", "Sensor Reading", "Control History"],
          icon: "Database",
        },
        {
          title: "Cloud",
          items: ["Azure", "Deployment", "Remote Access"],
          icon: "Cloud",
        },
      ],
    },
    features: [
      {
        title: "센서 데이터 수집",
        description:
          "온습도 등 환경 데이터를 REST API로 수신하고 시간 기준으로 저장해 모니터링 화면에서 활용할 수 있게 했습니다.",
        icon: "Activity",
      },
      {
        title: "원격 제어 API",
        description:
          "팬, 조명, 급수와 같은 장치 제어 요청을 API로 분리하고 제어 이력을 남기는 구조를 설계했습니다.",
        icon: "Workflow",
      },
      {
        title: "임계치 이벤트 알림",
        description:
          "측정값이 설정 범위를 벗어나는 경우 이벤트로 기록해 운영자가 이상 상태를 빠르게 확인할 수 있게 했습니다.",
        icon: "Gauge",
      },
    ],
    screenshots: [
      {
        title: "Smart Farm Monitoring",
        image: "/images/projects/smart-farm/thumbnail.svg",
        description:
          "센서 데이터 수집, 원격 제어, 이벤트 알림 흐름을 요약한 프로젝트 대표 화면입니다.",
      },
    ],
    contributions: [
      {
        date: "2024.03",
        title: "센서 데이터 모델링",
        description:
          "측정값, 장비 식별자, 수집 시간을 기준으로 저장 모델과 API 요청 구조를 설계했습니다.",
      },
      {
        date: "2024.04",
        title: "제어 API 설계",
        description:
          "원격 장치 제어 요청과 처리 상태를 분리해 제어 이력을 추적할 수 있도록 구성했습니다.",
      },
      {
        date: "2024.05",
        title: "클라우드 배포 구조 정리",
        description:
          "Azure 기반 실행 환경에서 API 서버와 데이터베이스 연결 정보를 분리해 운영 가능한 형태로 배포했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "센서 데이터 누락 가능성",
        problem:
          "네트워크 상태가 불안정할 때 일부 센서 데이터가 늦게 도착하거나 누락될 수 있었습니다.",
        solution:
          "측정 시각과 수신 시각을 구분하고, API 요청 단위로 저장 결과를 확인할 수 있도록 응답 구조를 정리했습니다.",
        result:
          "데이터 지연과 서버 저장 실패를 구분해 확인할 수 있게 되었습니다.",
      },
      {
        title: "제어 명령 상태 추적",
        problem:
          "원격 제어 요청이 실제 장비 상태와 바로 일치하지 않을 수 있어 사용자에게 혼란을 줄 수 있었습니다.",
        solution:
          "제어 요청, 처리 중, 완료 상태를 분리하고 이력을 남기는 방식으로 상태 모델을 설계했습니다.",
        result:
          "제어 요청의 진행 상태를 API 응답과 저장 데이터로 추적할 수 있게 되었습니다.",
      },
    ],
    performance: [
      {
        label: "수집 단위",
        value: "Time-series",
        description: "측정 시각 기준 센서 데이터 저장",
        icon: "Activity",
      },
      {
        label: "제어 흐름",
        value: "Tracked",
        description: "원격 제어 요청과 처리 상태 분리",
        icon: "Workflow",
      },
      {
        label: "운영 환경",
        value: "Azure",
        description: "클라우드 기반 API 서버 배포",
        icon: "Cloud",
      },
    ],
    retrospective: {
      learned: [
        "IoT 백엔드는 데이터 저장뿐 아니라 지연, 중복, 누락을 어떻게 관찰할지 함께 설계해야 합니다.",
        "원격 제어 기능은 요청 성공과 실제 장비 반영 사이의 상태 차이를 모델에 드러내는 것이 중요합니다.",
      ],
      improvement: [
        "MQTT 기반 비동기 수집 구조 검토",
        "센서 데이터 집계와 이상 탐지 대시보드 추가",
      ],
    },
    relatedNoteSlugs: [],
  },
  {
    ...findProject("log-eye"),
    heroImage: "/images/projects/log-eye/thumbnail.svg",
    overview:
      "LogEye는 여러 서비스에서 발생하는 로그를 수집하고 검색, 필터링, 알림 흐름까지 연결하는 운영 관찰성 중심 프로젝트입니다.",
    problem: {
      title: "개발 배경",
      items: [
        "장애 상황에서 로그가 서버별로 흩어져 있으면 원인 추적 시간이 길어집니다.",
        "운영자가 필요한 로그만 빠르게 검색하고 필터링할 수 있는 기준이 필요했습니다.",
        "반복되는 오류 패턴은 알림으로 연결해 초기에 대응할 수 있어야 했습니다.",
      ],
    },
    solution: {
      title: "해결 방향",
      items: [
        "로그 수집 API와 검색 API를 분리해 입력과 조회 책임을 나눴습니다.",
        "Elasticsearch 인덱스를 서비스명, 레벨, 시간 기준으로 설계했습니다.",
        "오류 레벨 로그를 Slack 알림 후보로 분류하는 간단한 이벤트 흐름을 구성했습니다.",
      ],
    },
    architecture: {
      title: "로그 수집 구조",
      description:
        "서비스 로그를 API 또는 메시지 큐로 수집하고, 검색 저장소와 장기 보관 저장소로 분리해 운영 조회와 보관 책임을 나눕니다.",
      nodes: [
        {
          title: "Collector",
          items: ["Spring Boot", "Log API", "Validation"],
          icon: "Server",
        },
        {
          title: "Stream",
          items: ["Kafka", "Retry", "Buffering"],
          icon: "MessageQueue",
        },
        {
          title: "Search",
          items: ["Elasticsearch", "Kibana", "Index Mapping"],
          icon: "Database",
        },
        {
          title: "Alert",
          items: ["Slack", "Error Rule", "Notification"],
          icon: "Activity",
        },
      ],
    },
    features: [
      {
        title: "로그 수집 API",
        description:
          "서비스명, 로그 레벨, traceId, 메시지를 기준으로 운영 로그를 표준 형식으로 수집합니다.",
        icon: "Server",
      },
      {
        title: "검색 인덱스 설계",
        description:
          "시간 범위와 로그 레벨 필터를 빠르게 적용할 수 있도록 Elasticsearch 매핑을 구성했습니다.",
        icon: "Database",
      },
      {
        title: "오류 알림 후보 분류",
        description:
          "ERROR 로그와 반복 패턴을 분리해 Slack 알림으로 연결할 수 있는 이벤트 흐름을 설계했습니다.",
        icon: "Activity",
      },
    ],
    screenshots: [
      {
        title: "LogEye Dashboard",
        image: "/images/projects/log-eye/thumbnail.svg",
        description:
          "로그 검색, 오류 추세, 알림 후보를 한 화면에서 확인하는 운영 대시보드 콘셉트입니다.",
      },
    ],
    contributions: [
      {
        date: "2025.09",
        title: "로그 스키마 정의",
        description:
          "서비스명, 레벨, traceId, timestamp, message 필드를 기준으로 공통 로그 모델을 설계했습니다.",
      },
      {
        date: "2025.10",
        title: "검색 API 구현",
        description:
          "시간 범위, 레벨, 키워드 조건을 조합해 운영자가 필요한 로그를 조회할 수 있게 했습니다.",
      },
      {
        date: "2025.11",
        title: "알림 흐름 설계",
        description:
          "반복 오류와 치명 오류를 분류해 Slack 알림 후보로 전달하는 구조를 정리했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "검색 조건 증가로 인한 API 복잡도",
        problem:
          "키워드, 레벨, 서비스명, 시간 조건이 늘어나며 검색 API 파라미터 조합이 복잡해졌습니다.",
        solution:
          "검색 조건 객체를 분리하고 기본 시간 범위를 적용해 API 입력을 단순화했습니다.",
        result: "조회 조건이 늘어나도 컨트롤러와 검색 로직의 책임을 분리할 수 있었습니다.",
      },
    ],
    performance: [
      {
        label: "검색 기준",
        value: "Indexed",
        description: "서비스명, 레벨, 시간 기준 인덱스 설계",
        icon: "Database",
      },
      {
        label: "알림 후보",
        value: "Rule-based",
        description: "오류 레벨과 반복 패턴 기반 분류",
        icon: "Activity",
      },
    ],
    retrospective: {
      learned: [
        "관찰성 도구는 데이터를 많이 모으는 것보다 운영자가 찾는 질문을 빠르게 답하게 하는 구조가 중요합니다.",
        "로그 검색은 저장 모델, 인덱스, UI 필터가 함께 맞물려야 사용성이 좋아집니다.",
      ],
      improvement: [
        "traceId 기반 요청 흐름 시각화",
        "로그 샘플링과 보존 정책 추가",
      ],
    },
    relatedNoteSlugs: [],
  },
  {
    ...findProject("code-mentor"),
    heroImage: "/images/projects/code-mentor/thumbnail.svg",
    overview:
      "CodeMentor는 Pull Request 변경 내용을 분석해 코드 리뷰 코멘트, 개선 제안, 학습 포인트를 생성하는 AI 기반 개발 보조 프로젝트입니다.",
    problem: {
      title: "개발 배경",
      items: [
        "개인 프로젝트에서는 코드 리뷰 피드백을 꾸준히 받기 어렵습니다.",
        "LLM 리뷰 결과를 그대로 보여주면 중요도와 근거가 불명확할 수 있습니다.",
        "리뷰 생성은 응답 시간이 길어질 수 있어 비동기 처리 구조가 필요했습니다.",
      ],
    },
    solution: {
      title: "해결 방향",
      items: [
        "PR diff 수집, 리뷰 요청, 결과 저장을 독립 단계로 분리했습니다.",
        "리뷰 결과를 severity, file, suggestion 단위로 구조화했습니다.",
        "Celery 작업 큐를 활용해 리뷰 생성 요청과 실제 분석 처리를 분리했습니다.",
      ],
    },
    architecture: {
      title: "AI 리뷰 처리 구조",
      description:
        "API 서버는 리뷰 요청을 접수하고, 워커가 diff를 분석해 OpenAI API로 리뷰 결과를 생성한 뒤 저장합니다.",
      nodes: [
        {
          title: "Client",
          items: ["Review Request", "Result View", "Learning Notes"],
          icon: "Code2",
        },
        {
          title: "API",
          items: ["FastAPI", "JWT", "Review API"],
          icon: "Server",
        },
        {
          title: "Worker",
          items: ["Celery", "Diff Parser", "Retry"],
          icon: "Workflow",
        },
        {
          title: "AI Layer",
          items: ["OpenAI API", "Prompt Template", "Structured Output"],
          icon: "Gauge",
        },
      ],
    },
    features: [
      {
        title: "PR Diff 분석",
        description:
          "변경 파일과 코드 조각을 분리해 리뷰에 필요한 맥락만 AI 요청에 전달합니다.",
        icon: "Code2",
      },
      {
        title: "구조화된 리뷰 결과",
        description:
          "리뷰 코멘트를 중요도, 파일 경로, 제안 내용으로 나눠 사용자가 바로 확인할 수 있게 했습니다.",
        icon: "Gauge",
      },
      {
        title: "비동기 리뷰 생성",
        description:
          "리뷰 요청은 즉시 접수하고 분석 작업은 Celery 워커에서 처리해 응답 지연을 줄였습니다.",
        icon: "Workflow",
      },
    ],
    screenshots: [
      {
        title: "CodeMentor Review",
        image: "/images/projects/code-mentor/thumbnail.svg",
        description:
          "AI 리뷰 결과와 학습 추천을 함께 보여주는 개발 보조 대시보드 콘셉트입니다.",
      },
    ],
    contributions: [
      {
        date: "2025.12",
        title: "리뷰 요청 모델 설계",
        description:
          "저장소, 브랜치, diff, 리뷰 상태를 분리해 요청 접수와 결과 생성을 추적할 수 있게 했습니다.",
      },
      {
        date: "2025.12",
        title: "AI 리뷰 프롬프트 구성",
        description:
          "중요도와 근거가 포함된 리뷰 결과를 만들 수 있도록 출력 형식을 제한했습니다.",
      },
      {
        date: "2026.01",
        title: "비동기 작업 큐 적용",
        description:
          "Celery와 Redis를 활용해 리뷰 생성 작업을 백그라운드로 분리했습니다.",
      },
    ],
    troubleshooting: [
      {
        title: "리뷰 결과 과다 생성",
        problem:
          "작은 변경에도 너무 많은 코멘트가 생성되어 핵심 피드백을 찾기 어려웠습니다.",
        solution:
          "severity 기준과 최대 코멘트 수를 프롬프트에 포함하고, 중복 제안을 후처리했습니다.",
        result: "리뷰 결과가 더 짧고 실행 가능한 제안 중심으로 정리되었습니다.",
      },
      {
        title: "긴 diff 처리",
        problem:
          "큰 변경 사항을 한 번에 전달하면 토큰 사용량이 늘고 응답 품질이 흔들렸습니다.",
        solution:
          "파일 단위로 diff를 나누고 핵심 변경이 있는 조각만 리뷰 대상으로 선택했습니다.",
        result: "리뷰 요청 크기를 제어하면서 파일별 피드백을 유지할 수 있었습니다.",
      },
    ],
    performance: [
      {
        label: "리뷰 처리",
        value: "Async",
        description: "요청 접수와 AI 분석 작업 분리",
        icon: "Workflow",
      },
      {
        label: "결과 구조",
        value: "Structured",
        description: "severity, file, suggestion 단위 저장",
        icon: "Gauge",
      },
      {
        label: "작업 큐",
        value: "Celery",
        description: "Redis 기반 백그라운드 리뷰 생성",
        icon: "MessageQueue",
      },
    ],
    retrospective: {
      learned: [
        "AI 리뷰 도구는 생성 품질뿐 아니라 사용자가 바로 판단할 수 있는 출력 구조가 중요합니다.",
        "긴 작업은 초기에 비동기 상태 모델을 넣어야 UI와 API가 단순해집니다.",
      ],
      improvement: [
        "GitHub Review Comment 자동 등록",
        "프로젝트별 리뷰 규칙 프리셋 추가",
      ],
    },
    relatedNoteSlugs: [],
  },
];
