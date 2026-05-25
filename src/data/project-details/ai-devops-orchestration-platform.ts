import { publicPath } from "@/utils/publicPath";
import type { ProjectDetail } from "@/types/project";
import { aiDevopsOrchestrationPlatform } from "../projects/ai-devops-orchestration-platform";

export const aiDevopsOrchestrationPlatformDetail: ProjectDetail = {
  ...aiDevopsOrchestrationPlatform,
  heroImage: publicPath("/images/projects/ai-devops/dashboard.svg"),
  heroHighlights: [
    {
      label: "처리량 (Celery + Redis, 100 VU)",
      value: "47.4 req/s",
      icon: "Zap",
    },
    {
      label: "실패율 (Celery + Redis, 100 VU)",
      value: "0%",
      icon: "CheckCircle",
    },
  ],
  overview:
    'Pipeline 실행 오케스트레이션과 AI 기반 실패 분석을 직접 설계하고 구현한 DevOps 자동화 백엔드입니다. 단순한 CRUD 서버가 아니라, "POST /run 하나가 DB 커넥션 풀을 점유한다"는 구조적 문제를 발견하고 이를 해결하기 위해 FastAPI BackgroundTasks, Celery + Redis, RabbitMQ 이벤트 드리븐 MSA 세 가지 비동기화 전략을 브랜치별로 구현하고 부하 테스트로 비교했습니다. 최종적으로 core-api / pipeline-execution-svc / ai-review-svc 세 서비스를 RabbitMQ topic exchange로 연결하고 DB 소유권을 물리적으로 분리했습니다.',
  problem: {
    title: "단일 프로세스 실행 구조의 한계",
    items: [
      "POST /run이 Git clone + Job 실행 전 구간에서 DB 커넥션을 점유해 SELECT 쿼리가 수백 ms 대기했습니다.",
      "Pipeline 실행(CPU/IO 집약)과 AI Review(LLM 레이턴시)가 같은 프로세스에서 동작해 독립 스케일아웃이 어려웠습니다.",
      "BackgroundTasks, Celery, 메시지 브로커 중 어떤 접근이 신뢰성과 서비스 분리에 실질적으로 유리한지 판단할 수 있는 수치가 없었습니다.",
    ],
  },
  solution: {
    title: "브랜치 비교 실험에서 RabbitMQ 이벤트 드리븐 MSA까지",
    items: [
      "FastAPI BackgroundTasks(Track 1), Celery + Redis(Track 2), RabbitMQ MSA(Track 3)를 브랜치별로 구현하고 Locust 부하 테스트로 정량 비교했습니다.",
      "RabbitMQ topic exchange + durable queue + manual ack + DLQ로 메시지 내구성과 서비스 경계를 함께 확보했습니다.",
      "pipeline_runs/job_run_logs는 pipeline-execution-svc, ai_reviews는 ai-review-svc가 자체 DB로 소유하게 분리했습니다.",
    ],
  },
  architecture: {
    title: "RabbitMQ 이벤트 드리븐 MSA",
    description:
      "3개 서비스(core-api / pipeline-execution-svc / ai-review-svc)가 RabbitMQ topic exchange를 통해 비동기로 통신합니다. 각 서비스는 독립 PostgreSQL DB를 소유하며 서비스 간 데이터 참조는 UUID 논리 참조로만 처리합니다.",
    nodes: [
      {
        id: "core-api",
        title: "Core API",
        items: ["FastAPI", "JWT 인증", "CRUD", "RabbitMQ Publisher/Consumer"],
        icon: "Server",
      },
      {
        id: "pipeline-svc",
        title: "Pipeline Execution Service",
        items: ["Git clone", "Job 순차 실행", "PipelineRun/JobRunLog 저장"],
        icon: "Play",
      },
      {
        id: "ai-review-svc",
        title: "AI Review Service",
        items: ["LLM 호출(Anthropic/OpenAI)", "실패 원인 분석", "폴백 체인"],
        icon: "Brain",
      },
      {
        id: "rabbitmq",
        title: "RabbitMQ",
        items: ["topic exchange", "durable queue", "DLQ", "manual ack"],
        icon: "MessageSquare",
      },
      {
        id: "postgresql",
        title: "PostgreSQL",
        items: ["서비스별 독립 DB", "core-db / exec-db / review-db"],
        icon: "Database",
      },
      {
        id: "observability",
        title: "Observability",
        items: ["Prometheus 메트릭 수집", "Grafana 대시보드"],
        icon: "BarChart",
      },
    ],
  },
  architectureFlow: {
    title: "Pipeline 실행 및 AI Review 이벤트 흐름",
    description:
      "POST /run -> 이벤트 발행 -> 실행 서비스 -> 결과 이벤트 -> Core API 상태 업데이트 흐름으로 동작합니다. AI Review도 동일한 이벤트 루프 패턴으로 처리됩니다.",
    groups: [
      {
        id: "clients",
        title: "사용자 / 외부",
        nodes: [
          {
            id: "browser",
            title: "브라우저 / API 클라이언트",
            items: ["React SPA", "Swagger UI"],
            icon: "Monitor",
          },
        ],
      },
      {
        id: "gateway",
        title: "Core API",
        nodes: [
          {
            id: "core-api",
            title: "Core API",
            items: ["FastAPI", "JWT", "CRUD", "RabbitMQ Publisher/Consumer"],
            icon: "Server",
          },
        ],
      },
      {
        id: "services",
        title: "마이크로서비스",
        nodes: [
          {
            id: "pipeline-svc",
            title: "Pipeline Execution Service",
            items: ["Git clone", "Job 실행", "PipelineRun 저장"],
            icon: "Play",
          },
          {
            id: "ai-review-svc",
            title: "AI Review Service",
            items: ["LLM 분석", "폴백 체인", "AIReview 저장"],
            icon: "Brain",
          },
        ],
      },
      {
        id: "data",
        title: "데이터",
        nodes: [
          {
            id: "rabbitmq",
            title: "RabbitMQ",
            items: ["topic exchange", "durable queue", "DLQ"],
            icon: "MessageSquare",
          },
          {
            id: "core-db",
            title: "Core DB",
            items: ["project, pipeline, job, user"],
            icon: "Database",
          },
          {
            id: "exec-db",
            title: "Execution DB",
            items: ["pipeline_runs, job_run_logs"],
            icon: "Database",
          },
          {
            id: "review-db",
            title: "Review DB",
            items: ["ai_reviews"],
            icon: "Database",
          },
        ],
      },
      {
        id: "ai",
        title: "AI",
        nodes: [
          {
            id: "llm",
            title: "LLM API",
            items: ["Anthropic Claude", "OpenAI (폴백)"],
            icon: "Zap",
          },
        ],
      },
      {
        id: "infra-integrations",
        title: "인프라 / 외부 연동",
        nodes: [
          {
            id: "prometheus",
            title: "Prometheus",
            items: ["메트릭 수집"],
            icon: "Activity",
          },
          {
            id: "grafana",
            title: "Grafana",
            items: ["대시보드"],
            icon: "BarChart",
          },
        ],
      },
    ],
    connections: [
      {
        from: "browser",
        to: "core-api",
        tone: "sync",
        label: "REST API",
      },
      {
        from: "core-api",
        to: "core-db",
        tone: "data",
        label: "CRUD 쿼리",
      },
      {
        from: "core-api",
        to: "rabbitmq",
        tone: "async",
        label: "pipeline.execution.requested 발행",
      },
      {
        from: "rabbitmq",
        to: "pipeline-svc",
        tone: "async",
        label: "실행 요청 수신",
      },
      {
        from: "pipeline-svc",
        to: "exec-db",
        tone: "data",
        label: "PipelineRun / JobRunLog 저장",
      },
      {
        from: "pipeline-svc",
        to: "rabbitmq",
        tone: "async",
        label: "pipeline.execution.finished 발행",
      },
      {
        from: "rabbitmq",
        to: "core-api",
        tone: "async",
        label: "실행 결과 수신 -> Pipeline.status 업데이트",
      },
      {
        from: "core-api",
        to: "rabbitmq",
        tone: "async",
        label: "ai_review.requested 발행",
      },
      {
        from: "rabbitmq",
        to: "ai-review-svc",
        tone: "async",
        label: "분석 요청 수신",
      },
      {
        from: "ai-review-svc",
        to: "llm",
        tone: "sync",
        label: "LLM 호출",
      },
      {
        from: "ai-review-svc",
        to: "review-db",
        tone: "data",
        label: "AIReview 저장",
      },
      {
        from: "ai-review-svc",
        to: "rabbitmq",
        tone: "async",
        label: "ai_review.completed 발행",
      },
      {
        from: "rabbitmq",
        to: "core-api",
        tone: "async",
        label: "분석 결과 수신 -> AIReview 저장",
      },
      {
        from: "core-api",
        to: "prometheus",
        tone: "data",
        label: "메트릭 노출",
      },
      {
        from: "prometheus",
        to: "grafana",
        tone: "data",
        label: "메트릭 시각화",
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
      title: "Pipeline 실행 오케스트레이션",
      description:
        "Git 저장소 클론 후 Job을 순차 실행합니다. exit_code, stdout, stderr, duration_ms를 JobRunLog에 저장하고 실행 결과로 Pipeline을 SUCCESS/FAILED terminal 상태로 전이합니다.",
      icon: "Play",
    },
    {
      title: "AI 기반 실패 분석",
      description:
        "실패한 Job의 로그를 LLM에 전달해 severity, category, cause, suggestion, confidence를 분석합니다. Anthropic -> OpenAI -> MockAnalyzer 폴백 체인으로 Provider 장애 시에도 분석 결과를 반환합니다.",
      icon: "Brain",
    },
    {
      title: "비동기 이벤트 드리븐 통신",
      description:
        "RabbitMQ topic exchange를 통해 서비스 간 통신합니다. durable queue + manual ack + DLQ로 메시지 유실을 방지하고 processed_events 기반 중복 수신 차단으로 멱등성을 보장합니다.",
      icon: "MessageSquare",
    },
    {
      title: "DB 소유권 물리 분리",
      description:
        "서비스별 자체 PostgreSQL 인스턴스를 두고 서비스 간 데이터 참조는 UUID 논리 참조로만 처리합니다. 물리 FK를 제거해 MSA 서비스 경계를 분명히 했습니다.",
      icon: "Database",
    },
    {
      title: "JWT 인증 + 계층형 소유권 검증",
      description:
        "Pipeline은 project -> owner 2-hop, Job은 job -> pipeline -> project 3-hop으로 소유권을 검증합니다. 어느 단계에서 실패해도 404를 반환해 리소스 존재를 노출하지 않습니다.",
      icon: "Shield",
    },
    {
      title: "Observability",
      description:
        "Prometheus 메트릭 수집과 Grafana 대시보드를 구성했습니다. 구조화 JSON 로깅, SQL 슬로우 쿼리 임계치 로깅, 미들웨어 기반 요청 추적을 함께 적용했습니다.",
      icon: "BarChart",
    },
  ],
  techStackGroups: [
    {
      title: "Backend",
      items: [
        { name: "Python 3.12", category: "language" },
        { name: "FastAPI", category: "backend" },
        { name: "SQLAlchemy 2.0 (async)", category: "backend" },
        { name: "Pydantic v2", category: "backend" },
        { name: "Alembic", category: "backend" },
      ],
    },
    {
      title: "Infra & DevOps",
      items: [
        { name: "Docker Compose", category: "infra" },
        { name: "Prometheus", category: "observability" },
        { name: "Grafana", category: "observability" },
        { name: "uv", category: "tool" },
        { name: "GitLab CI", category: "devops" },
      ],
    },
    {
      title: "Messaging",
      items: [
        { name: "RabbitMQ (topic exchange, DLQ)", category: "messaging" },
        { name: "aio-pika", category: "messaging" },
        { name: "Celery", category: "backend" },
        { name: "Redis", category: "database" },
      ],
    },
    {
      title: "Data",
      items: [
        { name: "PostgreSQL (asyncpg)", category: "database" },
      ],
    },
    {
      title: "AI",
      items: [
        { name: "Anthropic Claude API", category: "ai" },
        { name: "OpenAI API (fallback)", category: "ai" },
      ],
    },
    {
      title: "Development Tools",
      items: [
        { name: "Claude Code", category: "tool" },
        { name: "Codex", category: "tool" },
        { name: "GitHub Copilot", category: "tool" },
      ],
    },
    {
      title: "Frontend",
      items: [
        { name: "React 18", category: "frontend" },
        { name: "TypeScript", category: "frontend" },
        { name: "Vite 4", category: "frontend" },
        { name: "Tailwind CSS", category: "frontend" },
      ],
    },
  ],
  screenshots: [
    {
      title: "Pipeline 목록",
      image: publicPath("/images/projects/ai-devops/screenshot-dashboard.svg"),
      description:
        "상태 배지(DRAFT/READY/QUEUED/RUNNING/SUCCESS/FAILED)와 실행 이력을 한눈에 확인",
    },
    {
      title: "PipelineRun 상세",
      image: publicPath("/images/projects/ai-devops/screenshot-logs.svg"),
      description:
        "Job별 JobRunLog(exit_code, stdout, stderr, duration_ms) 확인",
    },
    {
      title: "AI Review 결과",
      image: publicPath("/images/projects/ai-devops/dashboard.svg"),
      description:
        "severity, category, cause, suggestion, confidence 분석 결과",
    },
    {
      title: "Grafana 대시보드",
      image: publicPath("/images/projects/ai-devops/thumbnail.svg"),
      description: "멀티 서비스 Prometheus 메트릭 시각화",
    },
  ],
  contributions: [
    {
      date: "2026-04",
      title: "MVP Monolith 구축",
      description:
        "FastAPI 레이어 아키텍처(API/Service/Repository/Domain), JWT 인증, Project/Pipeline/Job CRUD, 동기 Pipeline 실행 흐름, React SPA 데모 프론트엔드를 구축했습니다.",
    },
    {
      date: "2026-05",
      title: "쿼리 최적화",
      description:
        "N+1 쿼리를 탐지하고 explicit JOIN + eager loading으로 개선했습니다. 이 과정에서 DB 커넥션 풀 점유 문제의 원인을 분석했습니다.",
    },
    {
      date: "2026-05",
      title: "FastAPI BackgroundTasks 비동기화 (Track 1)",
      description:
        "POST /run을 202 Accepted로 전환하고 응답 후 실행 함수를 백그라운드로 처리했습니다. 태스크 내구성 부재를 확인해 실패 결정 기록으로 남겼습니다.",
    },
    {
      date: "2026-05",
      title: "Celery + Redis 비동기화 (Track 2)",
      description:
        "별도 worker 프로세스로 실행을 분리했습니다. Redis 메시지 내구성 문제와 코드 커플링 한계를 확인한 뒤 RabbitMQ로 전환하기로 결정했습니다.",
    },
    {
      date: "2026-05",
      title: "RabbitMQ 이벤트 드리븐 MSA (dev-msa)",
      description:
        "core-api / pipeline-execution-svc / ai-review-svc 3서비스로 분리했습니다. topic exchange, durable queue, DLQ, manual ack, 멱등성 보장을 구현했습니다.",
    },
    {
      date: "2026-05",
      title: "DB 소유권 물리 분리",
      description:
        "서비스별 Alembic 마이그레이션과 DATABASE_URL을 독립화하고 core-api의 cross-service 직접 쿼리를 제거했습니다.",
    },
    {
      date: "2026-05",
      title: "Observability 구축",
      description:
        "Prometheus 멀티 서비스 설정, Grafana 대시보드, Locust 부하 테스트 시나리오를 작성하고 브랜치별 성능을 측정했습니다.",
    },
  ],
  troubleshootingNoteSlugs: [
    "async-sqlalchemy-eager-loading",
    "ai-devops-backgroundtasks-durability",
    "ai-devops-threadpool-saturation",
    "celery-prefork-asyncio-nullpool",
    "async-test-db-isolation",
  ],
  improvements: [
    {
      title: "동기 -> 비동기 실행 전환",
      description:
        "POST /run을 202 Accepted로 전환해 실행 함수를 HTTP 응답 경로에서 분리했습니다. BackgroundTasks(Track 1), Celery(Track 2), RabbitMQ(Track 3) 순서로 실험했습니다.",
      result: "DB 커넥션 점유 구간 제거, 일반 CRUD API 응답 시간 개선",
      icon: "Zap",
    },
    {
      title: "N+1 쿼리 제거",
      description:
        "explicit JOIN + selectinload eager loading 적용으로 목록 조회 쿼리를 통합했습니다.",
      result: "쿼리 수 N+1 -> 1~2",
      icon: "Database",
    },
    {
      title: "중복 유일성 검사 제거",
      description:
        "서비스 레이어에서 중복 수행하던 사전 SELECT를 제거하고 DB 제약으로 일원화했습니다.",
      result: "불필요한 쿼리 왕복 제거",
      icon: "BarChart",
    },
  ],
  performance: [
    {
      label: "비동기화 전략 비교",
      value: "3가지",
      description:
        "BackgroundTasks / Celery + Redis / RabbitMQ MSA를 브랜치별로 구현한 뒤 Locust로 정량 비교",
      icon: "GitBranch",
    },
    {
      label: "부하 테스트 (Celery + Redis)",
      value: "47.4 req/s",
      description: "100 VU, 실패율 0%, 중앙값 12ms",
      icon: "Activity",
    },
    {
      label: "테스트 커버리지",
      value: "70%+",
      description: "단위 테스트(FakeService/FakeRepository) + 통합 테스트(실제 PostgreSQL)",
      icon: "CheckCircle",
    },
    {
      label: "마이크로서비스 수",
      value: "3개",
      description:
        "core-api / pipeline-execution-svc / ai-review-svc, 각 서비스 독립 DB",
      icon: "Layers",
    },
    {
      label: "ADR 문서",
      value: "19개",
      description: "아키텍처 결정 기록, 실패 결정 9개 포함",
      icon: "FileText",
    },
  ],
  retrospectives: [
    {
      title: "전체 프로젝트 회고",
      learned: [
        "각 단계는 다음 단계의 이유를 만들었습니다. 직접 구현하고 한계를 경험했기 때문에 다음 단계의 판단이 근거 있었습니다. 처음부터 MSA로 시작했다면 각 선택의 근거를 가질 수 없었습니다.",
        "실패한 접근이 문서화되지 않으면 반복됩니다. BackgroundTasks·Celery를 채택하지 않은 이유가 실패 결정으로 기록됐고, 이 문서가 AI 보조 개발에서 세션 간 맥락의 복원 지점이 됐습니다.",
        "설계 문서의 역할은 계획 확정이 아니라 결정 추적입니다. 구현 중에 더 나은 판단이 생기면 설계 문서도 바뀌어야 합니다.",
        "단위·통합 테스트가 통과해도 서비스 간 HTTP 계약 불일치 버그가 존재할 수 있습니다. 이벤트 스키마를 공유 패키지로 관리한 이유입니다.",
        "MSA는 서비스를 분리하는 것이 아니라 서비스 간 계약과 경계를 설계하는 것입니다.",
      ],
      improvement: [
        "REST vs gRPC 조회 프록시 비교 실험 (ADR-015 Track A/B)",
        "클라우드 환경 부하 테스트 재측정 (로컬 Docker Desktop VM 오버헤드 배제)",
        "CI/CD 파이프라인 구축 (GitLab CI, ADR-017 기준)",
        "Kubernetes 도입 (ADR-016)",
      ],
      noteSlug: "ai-devops-project-retrospective",
    },
    {
      title: "MSA 전환 회고",
      learned: [
        "MSA 전환의 목적은 단일 인스턴스 처리량 향상이 아니라 독립 배포, 독립 확장, 장애 격리입니다. 로컬 단일 인스턴스 기준에서 MSA는 모놀리스보다 느릴 수 있습니다.",
        "FastAPI BackgroundTasks는 내구성이 필요한 실행 작업에 부적합합니다. Celery + Redis는 프로세스를 분리하지만 코드베이스를 공유해 진정한 서비스 경계가 아닙니다.",
        "RabbitMQ topic exchange는 routing key 패턴 매칭으로 이벤트 타입 증가에 유연하게 대응할 수 있습니다.",
        "uv workspace 모노레포에서 공유 라이브러리로 이벤트 스키마를 관리하면 publisher/consumer 간 계약 드리프트를 컴파일 타임에 차단할 수 있습니다.",
      ],
      improvement: [
        "REST vs gRPC 조회 프록시 비교 실험 (ADR-015 Track A/B)",
        "클라우드 환경 부하 테스트 재측정 (로컬 Docker Desktop VM 오버헤드 배제)",
        "CI/CD 파이프라인 구축 (GitLab CI, ADR-017 기준)",
        "Kubernetes 도입 (ADR-016)",
      ],
      noteSlug: "ai-devops-retrospective",
    },
  ],
};
