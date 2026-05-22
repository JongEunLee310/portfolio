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
        image: "/images/projects/ai-devops/screenshot-dashboard.svg",
        description:
          "상태 배지(DRAFT/READY/QUEUED/RUNNING/SUCCESS/FAILED)와 실행 이력을 한눈에 확인",
      },
      {
        title: "PipelineRun 상세",
        image: "/images/projects/ai-devops/screenshot-logs.svg",
        description:
          "Job별 JobRunLog(exit_code, stdout, stderr, duration_ms) 확인",
      },
      {
        title: "AI Review 결과",
        image: "/images/projects/ai-devops/dashboard.svg",
        description:
          "severity, category, cause, suggestion, confidence 분석 결과",
      },
      {
        title: "Grafana 대시보드",
        image: "/images/projects/ai-devops/thumbnail.svg",
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
    troubleshooting: [
      {
        title: "DB 커넥션 풀 점유",
        problem:
          "POST /run이 Git clone + Job 실행 전 구간 동안 커넥션을 점유해 SELECT 쿼리 응답 시간이 수백 ms로 상승했습니다.",
        solution:
          "비동기화(POST /run -> 202 Accepted)로 실행 함수를 응답 경로에서 분리해 커넥션 점유 구간을 제거했습니다.",
        result:
          "일반 CRUD 쿼리의 대기 시간을 해소하고 비동기화 전략 선택의 계기를 만들었습니다.",
        noteSlug: "async-pipeline-transition",
      },
      {
        title: "N+1 쿼리",
        problem:
          "Pipeline 목록 조회 시 PipelineRun 수를 Job 수만큼 별도 SELECT로 반복 조회해 쿼리 수가 비례 증가했습니다.",
        solution:
          "explicit JOIN + selectinload eager loading을 적용해 목록 조회를 단일 흐름으로 통합했습니다.",
        result: "쿼리 수를 N+1에서 1~2로 줄였습니다.",
        noteSlug: "db-round-trip-optimization",
      },
      {
        title: "FastAPI BackgroundTasks 내구성 부재",
        problem:
          "서버 재시작 시 실행 중이거나 대기 중인 태스크가 모두 인메모리에서 유실되고 retry 경로가 없었습니다.",
        solution:
          "Celery + Redis로 전환한 뒤 최종적으로 RabbitMQ 기반 MSA로 대체했습니다.",
        result: "실패 결정 기록으로 보존해 같은 접근을 반복하지 않도록 했습니다.",
        noteSlug: "async-pipeline-transition",
      },
      {
        title: "RabbitMQ FieldTable 타입 불일치",
        problem:
          "aio-pika queue 선언 시 arguments 딕셔너리의 값 타입이 FieldTable 명세와 불일치해 런타임 오류가 발생했습니다.",
        solution:
          "x-dead-letter-exchange 등 DLQ 관련 arguments를 명시적 타입으로 캐스팅했습니다.",
        result: "consumer/publisher 정상 선언 및 DLQ 연동을 완료했습니다.",
        noteSlug: "rabbitmq-event-topology",
      },
      {
        title: "ThreadPoolExecutor 포화",
        problem:
          "pipeline-execution-svc의 asyncio.run_in_executor 기본 max_workers=2 설정으로 동시 실행 2건 초과 시 태스크 대기가 발생했습니다.",
        solution:
          "max_workers를 명시적으로 확장하고 실행 흐름을 재검토했습니다.",
        result: "100 VU 부하 테스트에서 실패율 12.9%를 해소했습니다.",
      },
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
    retrospective: {
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
    relatedNoteSlugs: [
      "async-pipeline-transition",
      "rabbitmq-event-topology",
      "db-round-trip-optimization",
      "ai-log-analysis-latency",
      "metric-cardinality-troubleshooting",
      "ai-devops-retrospective",
    ],
  },
  {
    ...findProject("halo"),
    heroImage: "/images/projects/halo/hero.svg",
    heroHighlights: [
      {
        label: "Access Token 무한 재발급 요청 차단",
        value: "12,294건 → 0",
        icon: "Shield",
      },
      {
        label: "낙관적 락 재시도 (동시성 충돌)",
        value: "최대 5회 · 50ms",
        icon: "RefreshCw",
      },
      {
        label: "정산 중복 실행 방지",
        value: "이중 지급 0건",
        icon: "CheckCircle",
      },
    ],
    overview:
      "고객이 매니저에게 청소 서비스를 예약하고 리뷰·문의·정산까지 처리하는 팀 프로젝트. common 단일 모듈로 기능을 빠르게 붙인 뒤 조회 책임이 뒤섞이는 시점에 도메인 기반 8모듈로 전환했다. Access Token 재발급 무한 루프(12,294건)를 직접 마주하고 원인을 규명해 해결한 경험, 낙관적 락 + @Retryable로 통계 동시 갱신 충돌을 자동 복구한 설계, 멱등성 기반 주간 정산으로 이중 지급을 방지한 세 가지가 핵심 기술 결정이다.",
    problem: {
      title: "단일 모듈의 조회 책임 혼재와 동시성 설계 부재",
      items: [
        "common 모듈 안에서 예약 Repository가 매니저·리뷰·서비스 카테고리를 한 쿼리에 join해 변경 영향 추적이 어려움",
        "JPA 엔티티 목록 조회 후 연관 필드 접근 시 N+1 쿼리 발생 구조",
        "동시 예약 완료 처리 시 통계 row 충돌 감지와 재시도 전략 부재",
        "스케줄러 재실행 시 동일 예약이 두 번 정산될 수 있는 구조",
      ],
    },
    solution: {
      title: "도메인 기반 멀티모듈 + DTO 프로젝션 + 낙관적 락 + 멱등성 정산",
      items: [
        "common → 8 도메인 모듈 분리, Gradle 의존성으로 경계 강제, shared-domain Port 인터페이스로 순환 참조 제거",
        "Projections.fields()로 필요한 필드만 선택해 단일 쿼리 고정, Repository → Info → Service → RspDTO.fromInfo() 계층 분리",
        "@Version 낙관적 락 + 별도 통계 서비스 분리 + @Retryable(5회, 50ms) + @Recover 실패 응답",
        "getCompletedReservationsWithoutSettlement 조회로 멱등성 보장, 스케줄러·수동 실행 동일 서비스 메서드 공유",
      ],
    },
    architecture: {
      title: "도메인 기반 Gradle 멀티모듈",
      description:
        "8개 도메인 모듈(admin, evaluation, global, inquiry, member, payment, reservation, shared-domain)이 Gradle 의존성으로 경계를 강제. evaluation·payment는 ReservationQueryPort 인터페이스로만 reservation 데이터에 접근해 순환 참조를 방지한다.",
      nodes: [
        {
          id: "global",
          title: "global",
          items: ["JWT 필터", "OAuth2 핸들러", "FilterChain", "User"],
          icon: "Shield",
        },
        {
          id: "member",
          title: "member",
          items: ["고객/매니저 회원", "통계(낙관적 락)"],
          icon: "Users",
        },
        {
          id: "reservation",
          title: "reservation",
          items: ["예약", "매칭", "체크인/아웃"],
          icon: "Calendar",
        },
        {
          id: "evaluation",
          title: "evaluation",
          items: ["리뷰", "평점 통계"],
          icon: "Star",
        },
        {
          id: "payment",
          title: "payment",
          items: ["주간 정산", "수동 정산"],
          icon: "CreditCard",
        },
        {
          id: "shared-domain",
          title: "shared-domain",
          items: ["Reservation 엔티티", "ReservationQueryPort"],
          icon: "Share2",
        },
        {
          id: "mysql",
          title: "MySQL",
          items: ["단일 DB, 도메인별 테이블"],
          icon: "Database",
        },
      ],
    },
    architectureFlow: {
      title: "도메인 모듈 의존 흐름",
      description:
        "global 모듈이 진입점으로 모든 API 요청을 처리하고, 비즈니스 모듈이 shared-domain Port 인터페이스를 통해 Reservation 데이터에 접근한다.",
      groups: [
        {
          id: "clients",
          title: "사용자 / 클라이언트",
          nodes: [
            {
              id: "browser",
              title: "브라우저 / API 클라이언트",
              items: ["REST API", "Swagger UI"],
              icon: "Monitor",
            },
          ],
        },
        {
          id: "gateway",
          title: "인증 / 진입점",
          nodes: [
            {
              id: "global",
              title: "global 모듈",
              items: ["JWT 필터", "OAuth2 핸들러", "FilterChain", "User"],
              icon: "Shield",
            },
          ],
        },
        {
          id: "business",
          title: "비즈니스 모듈",
          nodes: [
            {
              id: "member",
              title: "member 모듈",
              items: ["고객/매니저 회원", "통계(낙관적 락)"],
              icon: "Users",
            },
            {
              id: "reservation",
              title: "reservation 모듈",
              items: ["예약", "매칭", "체크인/아웃"],
              icon: "Calendar",
            },
            {
              id: "evaluation",
              title: "evaluation 모듈",
              items: ["리뷰", "평점 통계"],
              icon: "Star",
            },
            {
              id: "payment",
              title: "payment 모듈",
              items: ["주간 정산", "수동 정산"],
              icon: "CreditCard",
            },
            {
              id: "inquiry",
              title: "inquiry 모듈",
              items: ["문의 게시판"],
              icon: "MessageSquare",
            },
            {
              id: "admin",
              title: "admin 모듈",
              items: ["배너", "게시판", "관리자 정산"],
              icon: "Settings",
            },
          ],
        },
        {
          id: "shared",
          title: "공유 계층",
          nodes: [
            {
              id: "shared-domain",
              title: "shared-domain 모듈",
              items: ["Reservation 엔티티", "ReservationQueryPort"],
              icon: "Share2",
            },
          ],
        },
        {
          id: "data",
          title: "데이터 / 외부",
          nodes: [
            {
              id: "mysql",
              title: "MySQL",
              items: ["모든 도메인 데이터"],
              icon: "Database",
            },
            {
              id: "s3",
              title: "AWS S3",
              items: ["파일 업로드"],
              icon: "Cloud",
            },
            {
              id: "prometheus",
              title: "Prometheus",
              items: ["메트릭 수집"],
              icon: "Activity",
            },
          ],
        },
      ],
      connections: [
        {
          from: "browser",
          to: "global",
          tone: "sync",
          label: "REST API (JWT / OAuth2)",
        },
        { from: "global", to: "member", tone: "sync", label: "회원 정보 조회" },
        { from: "global", to: "reservation", tone: "sync", label: "예약 API" },
        { from: "global", to: "evaluation", tone: "sync", label: "리뷰 API" },
        { from: "global", to: "payment", tone: "sync", label: "정산 API" },
        { from: "global", to: "inquiry", tone: "sync", label: "문의 API" },
        { from: "global", to: "admin", tone: "sync", label: "관리자 API" },
        {
          from: "reservation",
          to: "shared-domain",
          tone: "data",
          label: "ReservationQueryPort 구현",
        },
        {
          from: "evaluation",
          to: "shared-domain",
          tone: "data",
          label: "예약 상태 검증",
        },
        {
          from: "payment",
          to: "shared-domain",
          tone: "data",
          label: "정산 대상 조회",
        },
        { from: "member", to: "mysql", tone: "data" },
        { from: "reservation", to: "mysql", tone: "data" },
        { from: "evaluation", to: "mysql", tone: "data" },
        { from: "payment", to: "mysql", tone: "data" },
        { from: "inquiry", to: "mysql", tone: "data" },
        { from: "admin", to: "mysql", tone: "data" },
        { from: "global", to: "s3", tone: "sync", label: "파일 업로드" },
        { from: "global", to: "prometheus", tone: "data", label: "메트릭 노출" },
      ],
      legends: [
        { label: "동기 요청", tone: "solid" },
        { label: "데이터 흐름", tone: "muted" },
      ],
    },
    features: [
      {
        title: "예약·매칭 시스템",
        description:
          "고객이 서비스 카테고리와 일정 선택 → 매니저 매칭 → 체크인/아웃으로 예약 완료. PENDING/MATCHED/CHECKED_IN/COMPLETED 상태 전이 관리.",
        icon: "Calendar",
      },
      {
        title: "JWT + OAuth2 인증",
        description:
          "Access Token(Header) + Refresh Token(HttpOnly Cookie) 이중 토큰. Google OAuth2 소셜 로그인. 고객·매니저·관리자 역할별 독립 SecurityFilterChain.",
        icon: "Shield",
      },
      {
        title: "QueryDSL DTO 프로젝션",
        description:
          "목록 조회 API 전 모듈에서 Projections.fields()로 필요한 필드만 선택해 단일 쿼리 처리. Repository → Info → Service → RspDTO.fromInfo() 계층으로 조회 책임 분리.",
        icon: "Database",
      },
      {
        title: "통계 동시성 처리",
        description:
          "예약 완료·리뷰 등록 시 @Version 낙관적 락으로 충돌 감지. @Retryable(최대 5회, 50ms) 자동 재시도. 재시도 초과 시 @Recover에서 동시성 오류 응답 반환.",
        icon: "RefreshCw",
      },
      {
        title: "주간 자동 정산",
        description:
          "Spring @Scheduled(매주 목요일 새벽 2시)로 지난주 완료 예약 자동 정산. 기존 Settlement가 없는 예약만 조회해 멱등성 보장. 관리자 수동 실행과 동일 서비스 메서드 공유.",
        icon: "CreditCard",
      },
      {
        title: "도메인 기반 멀티모듈",
        description:
          "common 단일 모듈에서 8 도메인 모듈로 전환. shared-domain에 Reservation 공유 엔티티와 ReservationQueryPort 인터페이스를 분리해 순환 참조 제거. 의존성을 Gradle로 강제.",
        icon: "Layers",
      },
    ],
    techStackGroups: [
      {
        title: "Backend",
        items: [
          { name: "Java 17", category: "language" },
          { name: "Spring Boot 3.4.5", category: "backend" },
          { name: "Spring Data JPA", category: "backend" },
          { name: "QueryDSL", category: "backend" },
          { name: "Spring Retry", category: "backend" },
        ],
      },
      {
        title: "Auth & Security",
        items: [
          { name: "Spring Security", category: "backend" },
          { name: "JWT", category: "backend" },
          { name: "OAuth2 (Google)", category: "backend" },
        ],
      },
      {
        title: "Data",
        items: [
          { name: "MySQL", category: "database" },
          { name: "AWS S3", category: "infra" },
          { name: "H2 (테스트)", category: "database" },
        ],
      },
      {
        title: "Scheduling",
        items: [{ name: "Spring Scheduler", category: "backend" }],
      },
      {
        title: "Observability & Build",
        items: [
          { name: "Prometheus", category: "observability" },
          { name: "Logback", category: "observability" },
          { name: "Gradle Multi-Module", category: "tool" },
        ],
      },
    ],
    screenshots: [
      {
        title: "예약 목록",
        image: "/images/projects/halo/reservation-list.svg",
        description: "고객 예약 목록 (상태 배지, 매니저 정보, 서비스 카테고리)",
      },
      {
        title: "정산 관리",
        image: "/images/projects/halo/settlement-dashboard.svg",
        description: "주간 자동 정산 결과 및 관리자 수동 실행 화면",
      },
      {
        title: "Prometheus 메트릭",
        image: "/images/projects/halo/prometheus.svg",
        description: "/actuator/prometheus 엔드포인트 메트릭",
      },
    ],
    contributions: [
      {
        date: "2025-05",
        title: "초기 세팅 및 공통 구조 설계",
        description:
          "Spring Boot 멀티모듈 Gradle 세팅, 공통 예외 처리, BaseEntity, User 모델 설계",
      },
      {
        date: "2025-06",
        title: "JWT + OAuth2 인증 구현",
        description:
          "Google OAuth2 소셜 로그인, Access/Refresh 이중 토큰, 역할별 SecurityFilterChain, 재발급 API 무한 루프 문제 해결",
      },
      {
        date: "2025-06",
        title: "QueryDSL 조회 최적화",
        description:
          "Projections.fields() DTO 프로젝션 적용, N+1 역추적 검증, Repository → Info → Service → RspDTO 계층 설계",
      },
      {
        date: "2025-07",
        title: "통계 동시성 처리 + 주간 정산 자동화",
        description:
          "@Version 낙관적 락 도입, @Retryable/@Recover 재시도 설계, Spring @Scheduled 기반 주간 정산, 멱등성 설계",
      },
      {
        date: "2025-06",
        title: "멀티모듈 전환",
        description:
          "common → 8 도메인 모듈 분리, shared-domain 설계(Reservation 엔티티 + ReservationQueryPort), 순환 참조 제거",
      },
      {
        date: "2026-05",
        title: "아키텍처 문서화",
        description:
          "ADR 6개, 실패 결정 6개, 트러블슈팅 8개 작성. 선택 근거와 포기한 대안 기록",
      },
    ],
    troubleshooting: [
      {
        title: "통계 업데이트 동시성 충돌",
        problem:
          "예약 완료·리뷰 등록 시 같은 통계 row를 동시에 수정해 일관성 보장 어려움. 벌크 업데이트와 엔티티 변경이 혼재",
        solution:
          "@Version 낙관적 락 + 통계 갱신 서비스 분리 + @Retryable(5회, 50ms) + @Recover",
        result: "동시성 충돌 자동 복구, 재시도 초과 시 409 계열 오류 응답, 통계 책임 분리",
        noteSlug: "statistic-concurrency-optimistic-lock",
      },
      {
        title: "토큰 재발급 무한 요청",
        problem:
          "/api/reissue가 JWT 필터에서 만료 Access Token을 검사해 401 반환 → 클라이언트 재발급 반복",
        solution:
          "/api/reissue를 PUBLIC_URLS + JWT_FILTER_EXCLUDE_URLS 양쪽에 추가, 역할별 필터 체인에서 제거",
        result: "재발급 API가 JWT 검사 없이 ReissueService에 도달, 무한 루프 해소",
        noteSlug: "reissue-infinite-request",
      },
      {
        title: "N+1 쿼리 방지 역추적",
        problem:
          "예약·회원 목록 조회에서 N+1 우려. 연관 엔티티 5개 이상을 한 화면에 표시",
        solution:
          "Projections.fields() — 영속성 컨텍스트가 엔티티를 관리하지 않아 지연 로딩 트리거 자체 없음",
        result: "목록 크기와 관계없이 쿼리 수 고정, 전 모듈 동일 패턴 유지",
        noteSlug: "n-plus-one-prevention-querydsl-projection",
      },
      {
        title: "멀티모듈 공유 엔티티 순환 참조",
        problem:
          "evaluation·payment가 Reservation 접근을 위해 reservation을 직접 의존 → 순환 참조 위험",
        solution:
          "shared-domain에 Reservation 엔티티 + ReservationQueryPort 분리, 구현은 reservation 모듈 제공",
        result: "모듈 간 순환 참조 제거, 구현 의존 없이 Port 인터페이스로 협력",
        noteSlug: "multi-module-shared-domain-port-pattern",
      },
      {
        title: "주간 정산 멱등성",
        problem:
          "스케줄러 재실행 또는 관리자 수동 실행 시 동일 예약이 두 번 정산될 위험",
        solution:
          "조회 단계에서 기존 Settlement 연결 예약 제외, 스케줄러·수동 실행이 동일 서비스 메서드 호출",
        result: "동일 날짜 범위 재실행 시 신규 생성 건수 0, 이중 지급 방지",
        noteSlug: "weekly-settlement-scheduler-idempotency",
      },
      {
        title: "다중 환경 토큰 충돌 (미해결)",
        problem:
          "고객·매니저 동시 로그인 시 단일 refresh cookie 이름이 덮여 기존 세션이 예고 없이 풀림",
        solution: "권한별 secure cookie 이름 분리 방향 결정 (마감으로 미적용)",
        result: "미해결 — 개선 방향과 cookie 이름 설계안을 문서로 보존",
        noteSlug: "multi-environment-login-token-overwrite",
      },
    ],
    improvements: [
      {
        title: "N+1 쿼리 설계 단계 방지",
        description:
          "목록 조회 API 전 모듈에서 QueryDSL Projections.fields()로 필요한 필드만 선택. 영속성 컨텍스트가 엔티티를 관리하지 않아 지연 로딩 트리거 자체 없음",
        result: "목록 크기와 관계없이 쿼리 수 N+1 → 1 고정",
        icon: "TrendingDown",
      },
      {
        title: "통계 벌크 업데이트 제거",
        description:
          "벌크 업데이트(영속성 컨텍스트 우회)를 제거하고 엔티티 조회 + 도메인 메서드 호출로 일원화",
        result: "통계 변경 경로 단일화, @Version 낙관적 락 정상 동작, 중복 증가 가능성 제거",
        icon: "RefreshCw",
      },
      {
        title: "정산 조회 쿼리 최적화",
        description:
          "기존 Settlement가 없는 완료 예약만 LEFT JOIN EXCLUSION 방식으로 DB 수준에서 필터링",
        result: "서비스 레이어 별도 존재 확인 쿼리 제거, 중복 정산 대상 DB 수준 필터링",
        icon: "Database",
      },
    ],
    performance: [
      {
        label: "목록 조회 쿼리 수",
        value: "N+1 → 1",
        description:
          "Projections.fields() 적용, 5개 이상 테이블 조인 목록 조회에서 항목 수 무관하게 쿼리 수 고정",
        icon: "TrendingDown",
      },
      {
        label: "낙관적 락 재시도",
        value: "5회 / 50ms",
        description:
          "통계 동시 갱신 충돌 시 자동 재시도 설정. 초과 시 @Recover로 클라이언트 오류 응답 분리",
        icon: "RefreshCw",
      },
      {
        label: "정산 중복 실행 방지",
        value: "이중 지급 0건",
        description:
          "동일 날짜 범위 재실행 시 기존 정산된 예약을 조회 단계에서 제외, 신규 생성 건수 0",
        icon: "Shield",
      },
      {
        label: "도메인 모듈 수",
        value: "8개",
        description:
          "common 2모듈 → admin, evaluation, global, inquiry, member, payment, reservation, shared-domain",
        icon: "Layers",
      },
      {
        label: "ADR + 실패 결정 문서",
        value: "12개",
        description: "채택 6개 + 미채택·보류 6개. 선택 근거와 포기한 대안 기록",
        icon: "FileText",
      },
      {
        label: "트러블슈팅 문서",
        value: "8개",
        description: "실제 장애·설계 결정 사례, 원인·선택 근거·재발 방지 포함",
        icon: "BookOpen",
      },
    ],
    retrospective: {
      learned: [
        "모듈 분리는 경계의 시작일 뿐이다. Gradle 의존성으로 방향을 강제하되, Port 인터페이스로 구현 의존을 추가로 차단해야 한다.",
        "Projections.fields()는 N+1을 사후에 해결하는 게 아니라 설계 단계에서 방지한다. 처음부터 DTO 프로젝션으로 설계하면 문제 자체가 발생하지 않는다.",
        "@Retryable은 AOP 프록시를 통해 동작한다. 같은 클래스 내부 호출은 프록시를 우회해 재시도가 적용되지 않는다. 별도 서비스로 분리해야 한다.",
        "permitAll과 JWT 필터 제외는 다르다. 커스텀 필터가 인가 단계보다 앞에 있으면 public endpoint도 명시적으로 제외하지 않으면 차단된다.",
      ],
      improvement: [
        "ReservationQueryPort를 사용 목적별로 분리 (리뷰용·정산용·관리자용)",
        "evaluation → member 직접 통계 접근을 MemberStatisticPort로 추상화",
        "다중 환경 토큰 충돌 — 권한별 secure cookie 이름 분리 구현",
        "정산 실행 결과 로그 테이블 추가 (처리 건수, 총액, 실패 건수)",
      ],
      noteSlug: "halo-retrospective",
    },
    relatedNoteSlugs: [
      "querydsl-projection-optimization",
      "alb-cors-troubleshooting",
    ],
  },
  {
    ...findProject("the-listening-tree"),
    heroImage: "/images/projects/the-listening-tree/hero.svg",
    heroHighlights: [
      { label: "마이크로서비스", value: "4개", icon: "Layers" },
      { label: "CI/CD 파이프라인", value: "3개", icon: "GitBranch" },
      { label: "트러블슈팅 기록", value: "6건", icon: "FileText" },
    ],
    overview:
      "The Listening Tree는 하루 한 번 이야기를 남기면 GPT-4o 기반 AI 상담사가 따뜻하게 공감하는 심리 상담 서비스입니다. AI는 정보 제공을 거절하고 오직 공감에만 응답하도록 시스템 프롬프트로 설계되었습니다. 이야기가 쌓일수록 메인 화면의 나무에 나뭇잎이 추가되고, 현재 월(KST 기준)에 따라 봄·여름·가을·겨울 테마로 UI가 전환됩니다. 백엔드는 auth_service, auto_response, memory_service, user_service 4개의 독립 FastAPI 마이크로서비스로 구성되며, Google OAuth 2.0과 JWT 이중 토큰으로 인증을 처리합니다.",
    problem: {
      title: "감정을 털어놓을 공간의 부재",
      items: [
        "정보 검색이 아닌 감정 공유와 공감을 원하는 사용자에게 맞는 AI 인터페이스의 부재",
        "일반 챗봇의 질문-답변 구조는 단순 공감 응답에 적합하지 않음",
        "이야기를 꾸준히 기록하고 싶지만 습관화를 유도하는 시각적 구조 부재",
      ],
    },
    solution: {
      title: "AI 공감 상담사와 시각적 이야기 나무",
      items: [
        "시스템 프롬프트로 AI에게 '정보 제공 거부 + 공감 중심' 페르소나를 부여해 상담 특화 응답 생성",
        "이야기가 쌓일수록 화면의 나무에 나뭇잎이 늘어나 기록 축적의 시각적 피드백 제공",
        "하루 한 번 제한(기획 단계)으로 과도한 의존 없이 규칙적인 사용 패턴 유도",
      ],
    },
    architecture: {
      title: "마이크로서비스 아키텍처",
      description:
        "4개의 독립 FastAPI 서비스로 구성. 각 서비스는 별도 git 레포지토리로 관리.",
      nodes: [
        {
          id: "frontend",
          title: "Vue 3 Frontend",
          items: [
            "로그인, 메인(나무 시각화), 이야기 작성 페이지",
            "Vuex 상태 관리 (로그인 상태, 계절 테마)",
          ],
          icon: "Monitor",
        },
        {
          id: "auth-service",
          title: "auth_service",
          items: [
            "Google OAuth 2.0 Authorization Code Flow",
            "JWT access/refresh 토큰 발급",
            "SQLAlchemy + Alembic 사용자 DB 관리",
          ],
          icon: "Shield",
        },
        {
          id: "auto-response",
          title: "auto_response",
          items: [
            "GPT-4o 기반 AI 공감 응답 생성",
            "초기 인사말 및 이야기 응답 2개 엔드포인트",
            "OpenAI Responses API (max_output_tokens=100)",
          ],
          icon: "MessageSquare",
        },
        {
          id: "external",
          title: "외부 서비스",
          items: [
            "Google OAuth API (토큰 발급, 사용자 정보 조회)",
            "OpenAI API (gpt-4o 응답 생성)",
          ],
          icon: "Cloud",
        },
      ],
    },
    architectureFlow: {
      title: "서비스 요청 흐름",
      description:
        "브라우저 → FastAPI 마이크로서비스 → 외부 API 순서로 동기 처리.",
      groups: [
        {
          id: "clients",
          title: "사용자 / 외부",
          nodes: [
            {
              id: "browser",
              title: "Vue 3 SPA",
              items: ["로그인 / 메인 / 이야기 작성 페이지"],
              icon: "Monitor",
            },
          ],
        },
        {
          id: "services",
          title: "마이크로서비스",
          nodes: [
            {
              id: "auth-service",
              title: "auth_service",
              items: ["Google OAuth 연동, JWT 발급, 사용자 DB 저장"],
              icon: "Shield",
            },
            {
              id: "auto-response",
              title: "auto_response",
              items: ["GPT-4o 공감 응답 생성, 2개 엔드포인트"],
              icon: "MessageSquare",
            },
          ],
        },
        {
          id: "data-ai",
          title: "데이터 & AI",
          nodes: [
            {
              id: "postgres",
              title: "PostgreSQL",
              items: ["사용자 정보 저장 (social_id, email, name)"],
              icon: "Database",
            },
            {
              id: "openai-api",
              title: "OpenAI API",
              items: ["gpt-4o Responses API"],
              icon: "Zap",
            },
          ],
        },
        {
          id: "infra-integrations",
          title: "인프라 / 외부 연동",
          nodes: [
            {
              id: "google-oauth",
              title: "Google OAuth API",
              items: ["Authorization Code → access_token + user_info"],
              icon: "ExternalLink",
            },
            {
              id: "aws-ecr",
              title: "AWS ECR",
              items: ["Docker 이미지 레지스트리"],
              icon: "FileDown",
            },
          ],
        },
      ],
      connections: [
        {
          from: "browser",
          to: "auth-service",
          tone: "sync",
          label: "POST /login/google {code}",
        },
        {
          from: "auth-service",
          to: "google-oauth",
          tone: "sync",
          label: "token + userinfo 조회",
        },
        {
          from: "auth-service",
          to: "postgres",
          tone: "sync",
          label: "사용자 조회 / 신규 생성",
        },
        {
          from: "browser",
          to: "auto-response",
          tone: "sync",
          label: "GET /initial_response",
        },
        {
          from: "browser",
          to: "auto-response",
          tone: "sync",
          label: "POST /response {message}",
        },
        {
          from: "auto-response",
          to: "openai-api",
          tone: "sync",
          label: "client.responses.create()",
        },
      ],
      legends: [
        { label: "동기 요청", tone: "solid" },
        { label: "비동기 이벤트", tone: "dashed" },
        { label: "데이터 흐름", tone: "muted" },
      ],
    },
    features: [
      {
        title: "AI 공감 응답",
        description:
          "GPT-4o 기반 심리 상담사 페르소나. 사용자 이야기에 100토큰 이내의 따뜻한 한 마디 응답. 정보 검색 요청은 거절하고 감정 공감에만 응답한다.",
        icon: "MessageSquare",
      },
      {
        title: "나무 시각화",
        description:
          "이야기가 추가될수록 나무에 나뭇잎이 쌓이는 인터랙티브 시각화. 이야기 수에 따라 나무 성장 상태가 변화하며 기록 축적을 시각적으로 확인할 수 있다.",
        icon: "Layers",
      },
      {
        title: "계절 연동 UI",
        description:
          "현재 월(KST)을 기준으로 봄·여름·가을·겨울 테마가 자동 전환. 배경, 텍스트, 버튼, 나뭇잎 색상이 계절에 맞게 변경된다.",
        icon: "Zap",
      },
      {
        title: "Google OAuth 로그인",
        description:
          "Google OAuth 2.0 Authorization Code Flow. 로그인 후 JWT access/refresh 이중 토큰 발급. 비로그인 사용자는 이야기 작성 시 401 에러 페이지로 리다이렉트된다.",
        icon: "Shield",
      },
      {
        title: "초기 인사말",
        description:
          "서비스 진입 시 AI가 먼저 따뜻한 인사말을 전달. 사용자가 이야기를 입력할 준비가 될 수 있도록 맥락을 제공한다.",
        icon: "MessageSquare",
      },
    ],
    techStackGroups: [
      {
        title: "Backend",
        items: [
          { name: "Python 3.12", category: "language" },
          { name: "FastAPI", category: "backend" },
          { name: "SQLAlchemy 2.x", category: "backend" },
          { name: "Alembic", category: "backend" },
          { name: "httpx", category: "backend" },
          { name: "python-jose", category: "backend" },
        ],
      },
      {
        title: "AI",
        items: [
          { name: "OpenAI SDK", category: "ai" },
          { name: "GPT-4o", category: "ai" },
          { name: "Responses API", category: "ai" },
        ],
      },
      {
        title: "Frontend",
        items: [
          { name: "Vue 3", category: "frontend" },
          { name: "Vuex", category: "frontend" },
          { name: "Tailwind CSS", category: "frontend" },
          { name: "Vite", category: "tool" },
          { name: "axios", category: "tool" },
        ],
      },
      {
        title: "Infra & DevOps",
        items: [
          { name: "Docker", category: "infra" },
          { name: "AWS ECR", category: "infra" },
          { name: "GitHub Actions", category: "devops" },
          { name: "SonarCloud", category: "devops" },
        ],
      },
      {
        title: "Data",
        items: [
          { name: "PostgreSQL", category: "database" },
          { name: "SQLite (테스트)", category: "database" },
        ],
      },
    ],
    screenshots: [
      {
        title: "메인 페이지 (나무 시각화)",
        image: "/images/projects/the-listening-tree/main.svg",
        description: "이야기 수에 따라 나뭇잎이 쌓이는 나무와 계절 연동 테마",
      },
      {
        title: "이야기 작성 페이지",
        image: "/images/projects/the-listening-tree/story.svg",
        description: "사용자 메시지 입력 및 AI 공감 응답 표시",
      },
      {
        title: "로그인 페이지",
        image: "/images/projects/the-listening-tree/signin.svg",
        description: "Google OAuth 소셜 로그인 버튼",
      },
    ],
    contributions: [
      {
        date: "2025.01",
        title: "인증 서비스 설계 및 구현",
        description:
          "Google OAuth 2.0 Authorization Code Flow 구현. JWT access/refresh 이중 토큰 발급 및 갱신 엔드포인트 설계. SQLAlchemy 모델과 Alembic 마이그레이션으로 사용자 DB 스키마 관리.",
      },
      {
        date: "2025.01",
        title: "AI 응답 서비스 구현",
        description:
          "OpenAI Responses API를 사용한 심리 상담 응답 생성. 시스템 프롬프트로 공감 중심 페르소나 설계. 초기 인사말(GET) + 이야기 응답(POST) 2개 엔드포인트 구현.",
      },
      {
        date: "2025.01",
        title: "프론트엔드 구현",
        description:
          "Vue 3 + Vuex 상태 관리. 계절 연동 UI 테마 시스템(seasonStore). 나무 시각화 컴포넌트(TreeVisualization) 개발. OAuth 콜백 처리 및 로그인 흐름 구현.",
      },
      {
        date: "2025.02",
        title: "CI/CD 파이프라인 구축",
        description:
          "auth_service, memory_service, user_service에 GitHub Actions 워크플로우 추가. pytest + SonarCloud 코드 품질 검사 → Docker 빌드 → AWS ECR + Docker Hub 이미지 배포 파이프라인 구성.",
      },
    ],
    troubleshooting: [
      {
        title: "Google OAuth 예외 재래핑",
        problem:
          "except Exception이 내부에서 raise한 HTTPException까지 잡아 원래 오류 메시지가 변형됨. 네트워크 오류·인증 오류·내부 오류가 모두 400으로 묶임.",
        solution:
          "except HTTPException: raise를 가장 먼저 배치해 재래핑 차단. httpx 예외를 HTTPStatusError·TimeoutException·RequestError로 분리.",
        result:
          "오류 유형별 상태 코드(400/502/503/504) 분리. 클라이언트가 재시도 여부를 판단할 수 있는 명확한 응답 반환.",
        noteSlug: "001-google-oauth-exception-masking",
      },
      {
        title: "OpenAI 응답 구조 직접 접근 취약성",
        problem:
          "response.output[0].content[0].text 직접 접근 시 빈 응답에서 IndexError 발생. 개발 중 추가한 print(user_message)가 사용자 상담 내용을 표준 출력에 노출.",
        solution:
          "응답 텍스트 추출 함수 분리 및 빈 응답 방어 로직 추가. print() 2개 제거. 오류 원인별 상태 코드 분기.",
        result:
          "빈 응답 → 503 반환으로 명확화. 사용자 메시지 표준 출력 노출 제거. API 오류·파싱 오류 구분 가능.",
        noteSlug: "002-openai-response-direct-access",
      },
      {
        title: "social_id 단독 unique 제약 불일치",
        problem:
          "DB는 social_id 단독 unique, 핸들러는 social_id + social_provider 복합 조건으로 조회. ADR 설계 의도가 모델과 마이그레이션에 반영되지 않음.",
        solution:
          "UniqueConstraint('social_id', 'social_provider')로 교체. Alembic 마이그레이션 순서(인덱스 제거 → 복합 제약 생성)대로 수정.",
        result:
          "DB 제약과 애플리케이션 조회 로직 정합성 확보. 다중 OAuth 제공자 추가 시 같은 social_id 값 충돌 방지.",
        noteSlug: "005-social-id-unique-constraint-mismatch",
      },
      {
        title: "멀티레포 CI 이름 불일치",
        problem:
          "auth_service CI를 복붙하면서 name 필드 수정 누락. memory_service·user_service가 GitHub Actions에서 'The Tree Auth Service CI'로 표시.",
        solution:
          "memory_service, user_service 워크플로우 name 필드를 각 서비스명으로 수정.",
        result: "CI 대시보드에서 서비스별 워크플로우 구분 가능.",
        noteSlug: "003-multirepo-ci-duplication-and-drift",
      },
    ],
    performance: [
      {
        label: "AI 응답 토큰 상한",
        value: "100",
        description: "max_output_tokens=100으로 짧고 집중된 공감 응답 보장",
        icon: "Zap",
      },
      {
        label: "인증 서비스 테스트 케이스",
        value: "3건",
        description:
          "pytest로 검증한 Google OAuth 핸들러 시나리오 (기존 사용자·신규 사용자·이메일 없음)",
        icon: "CheckCircle",
      },
      {
        label: "CI/CD 자동화 서비스",
        value: "3개",
        description:
          "GitHub Actions 파이프라인 적용 서비스 수 (auth, memory, user)",
        icon: "GitBranch",
      },
      {
        label: "트러블슈팅 문서",
        value: "6건",
        description: "개발 중 발견·해결한 문제 기록 수",
        icon: "FileText",
      },
    ],
    retrospective: {
      learned: [
        "except Exception as e는 FastAPI의 HTTPException까지 잡는다. 의도적으로 raise한 애플리케이션 오류가 재래핑되지 않으려면 except HTTPException: raise를 가장 먼저 배치해야 한다.",
        "멀티레포 구조에서 CI 워크플로우를 복붙으로 관리하면 이름·설정·의존성 버전 불일치가 빠르게 누적된다. GitHub Reusable Workflows 같은 공유 수단을 초기에 설계해야 한다.",
        "DB 모델 설계 결정(ADR)과 실제 마이그레이션 코드가 동기화되지 않으면 확장 시 예상치 못한 unique 충돌이 발생한다.",
        "테스트 격리 구조(FakeClient, FakeDBSession)를 처음부터 설계하지 않으면 나중에 리팩토링 범위가 핸들러 구조 전체로 확장된다.",
      ],
      improvement: [
        "서비스 전체 logging 인프라 도입 (현재 print() 2개가 사용자 메시지를 표준 출력에 노출, 구조화 로그 미존재)",
        "auto_response 서비스 테스트 격리 구현 (현재 테스트 0개, FakeClient + monkeypatch 구조 설계 필요)",
        "GitHub Reusable Workflows로 4개 서비스 CI 공통화 (현재 서비스별 중복 워크플로우)",
      ],
      noteSlug: "",
    },
    relatedNoteSlugs: [
      "001-google-oauth-exception-masking",
      "002-openai-response-direct-access",
      "003-multirepo-ci-duplication-and-drift",
      "004-stateless-prompt-context-loss",
      "005-social-id-unique-constraint-mismatch",
      "006-llm-response-format-not-enforced",
    ],
  },
  {
    ...findProject("smart-farm"),
    heroImage: "/images/projects/smart-farm/thumbnail.svg",
    heroHighlights: [
      { label: "개발 기여", value: "데이터 수집 / DB 업로드 / 디바이스 제어", icon: "Code2" },
      { label: "핵심 시스템", value: "실시간 모니터링 + 원격 제어", icon: "Activity" },
      { label: "인프라", value: "Azure VM + MySQL DB", icon: "Cloud" },
    ],
    overview:
      "클라우드 기반 스마트팜 실시간 모니터링 및 원격 제어 시스템은 원격지 DAS 장비에서 수집한 센서 및 디바이스 상태 데이터를 Azure VM의 Data Collector가 ModbusTCP로 수집하고, Azure MySQL DB에 저장한 뒤, API Server와 Monitoring Engine을 통해 사용자 애플리케이션에 실시간 조회, 이상 감지 알림, 원격 디바이스 제어 기능을 제공하는 프로젝트이다. 사용자는 Mobile 또는 Windows Application을 통해 센서 상태를 주기적으로 확인하고, 이상 값이 감지되면 알림을 받은 뒤 현장 방문 없이 디바이스 제어 요청을 수행할 수 있다.",
    problem: {
      title: "현장 중심 모니터링의 한계와 원격 제어 필요성",
      items: [
        "센서 값을 확인하기 위해 담당자가 현장에 직접 방문해야 하는 구조였다.",
        "이상 상황 발생 시 알림과 대응이 분리되어 있어 즉각적인 조치가 어려웠다.",
        "원격지 장비 상태를 실시간으로 수집하고 제어하는 통합 구조가 필요했다.",
      ],
    },
    solution: {
      title: "Azure Cloud 기반 실시간 수집, 이상 감지, 원격 제어 구조",
      items: [
        "Azure VM에서 Data Collector, API Server, Monitoring Engine, Device Controller를 운영했다.",
        "DAS와 ModbusTCP로 통신해 센서 및 디바이스 상태 데이터를 수집하고 MySQL DB에 저장했다.",
        "Monitoring Engine이 이상 값을 감지하면 Outlier 저장과 사용자 알림을 수행했다.",
        "사용자의 제어 요청을 API Server와 Device Controller를 통해 원격지 디바이스로 전달했다.",
      ],
    },
    architecture: {
      title: "클라우드 기반 IoT 모니터링 아키텍처",
      description:
        "원격지 DAS, Azure VM 기반 서버 모듈, Azure MySQL DB, Mobile/Windows Application이 연결된 구조이다.",
      nodes: [
        {
          id: "client-apps",
          title: "Client Applications",
          items: ["Mobile Application", "Windows Application", "센서 조회", "원격 제어 요청"],
          icon: "Monitor",
        },
        {
          id: "azure-server",
          title: "Azure Cloud Server",
          items: ["API Server", "Data Collector", "Monitoring Engine", "Device Controller"],
          icon: "Cloud",
        },
        {
          id: "data-layer",
          title: "Data Layer",
          items: ["Azure MySQL DB", "센서 데이터", "이상 값", "알림 이력"],
          icon: "Database",
        },
        {
          id: "remote-devices",
          title: "Remote Device Layer",
          items: ["DAS", "Sensors", "Devices", "ModbusTCP"],
          icon: "Workflow",
        },
      ],
    },
    architectureFlow: {
      title: "실시간 모니터링 및 원격 제어 플로우",
      description:
        "센서 데이터는 DAS에서 Azure VM의 Data Collector로 수집되고, 사용자의 제어 요청은 API Server와 Device Controller를 거쳐 DAS로 전달된다.",
      groups: [
        {
          id: "clients",
          title: "사용자 / 외부",
          nodes: [
            {
              id: "mobile-app",
              title: "Mobile Application",
              items: ["센서 조회", "알림 확인", "원격 제어"],
              icon: "Monitor",
            },
            {
              id: "windows-app",
              title: "Windows Application",
              items: ["모니터링 화면", "디바이스 제어 UI"],
              icon: "Monitor",
            },
            {
              id: "telegram",
              title: "Telegram Notification",
              items: ["이상 값 알림"],
              icon: "Zap",
            },
          ],
        },
        {
          id: "gateway",
          title: "API Gateway",
          nodes: [
            {
              id: "api-server",
              title: "API Server",
              items: ["REST API", "센서 데이터 조회", "제어 요청 전달"],
              icon: "Server",
            },
          ],
        },
        {
          id: "services",
          title: "서비스",
          nodes: [
            {
              id: "data-collector",
              title: "Data Collector",
              items: ["ModbusTCP 수집", "DB 업로드"],
              icon: "Cloud",
            },
            {
              id: "monitoring-engine",
              title: "Monitoring Engine",
              items: ["이상 값 감지", "Outlier 저장", "알림 트리거"],
              icon: "Activity",
            },
            {
              id: "device-controller",
              title: "Device Controller",
              items: ["제어 요청 처리", "DAS 제어 통신"],
              icon: "Settings",
            },
          ],
        },
        {
          id: "data",
          title: "데이터",
          nodes: [
            {
              id: "mysql-db",
              title: "Azure MySQL DB",
              items: ["센서 데이터", "목표 값", "알림 이력"],
              icon: "Database",
            },
            {
              id: "outlier-store",
              title: "Outlier Data",
              items: ["이상 값 감지 결과"],
              icon: "Shield",
            },
          ],
        },
        {
          id: "infra-integrations",
          title: "인프라 / 외부 연동",
          nodes: [
            {
              id: "azure-vm",
              title: "Azure VM",
              items: ["서버 실행 환경"],
              icon: "Cloud",
            },
            {
              id: "das",
              title: "DAS",
              items: ["센서 및 디바이스 상태 수집 장치"],
              icon: "Workflow",
            },
            {
              id: "sensors-devices",
              title: "Sensors & Devices",
              items: ["센서 값 제공", "제어 대상 장치"],
              icon: "Workflow",
            },
          ],
        },
      ],
      connections: [
        { from: "sensors-devices", to: "das", tone: "data", label: "센서 및 디바이스 상태 데이터" },
        { from: "das", to: "data-collector", tone: "data", label: "ModbusTCP 데이터 수집" },
        { from: "data-collector", to: "mysql-db", tone: "data", label: "센서 데이터 저장" },
        { from: "monitoring-engine", to: "mysql-db", tone: "data", label: "기준 값 조회" },
        { from: "monitoring-engine", to: "outlier-store", tone: "data", label: "이상 값 저장" },
        { from: "monitoring-engine", to: "telegram", tone: "async", label: "이상 상황 알림" },
        { from: "mobile-app", to: "api-server", tone: "sync", label: "센서 조회 / 제어 요청" },
        { from: "windows-app", to: "api-server", tone: "sync", label: "센서 조회 / 제어 요청" },
        { from: "api-server", to: "mysql-db", tone: "data", label: "센서 데이터 조회" },
        { from: "api-server", to: "device-controller", tone: "sync", label: "제어 명령 전달" },
        { from: "device-controller", to: "das", tone: "sync", label: "ModbusTCP 디바이스 제어" },
        { from: "api-server", to: "mobile-app", tone: "async", label: "WebSocket 상태 변경 알림" },
        { from: "api-server", to: "windows-app", tone: "async", label: "WebSocket 상태 변경 알림" },
      ],
      legends: [
        { label: "동기 요청", tone: "solid" },
        { label: "비동기 이벤트", tone: "dashed" },
        { label: "데이터 흐름", tone: "muted" },
      ],
    },
    features: [
      {
        title: "실시간 센서 데이터 수집",
        description:
          "원격지 DAS에서 센서 및 디바이스 상태 데이터를 주기적으로 수집하고 Azure MySQL DB에 저장한다.",
        icon: "Activity",
      },
      {
        title: "REST API 기반 센서 조회",
        description:
          "전체 센서 조회, 특정 센서 조회, 특정 날짜의 24시간 센서 데이터 조회 API를 제공한다.",
        icon: "Server",
      },
      {
        title: "이상 값 감지 및 알림",
        description:
          "Monitoring Engine이 기준 값을 기반으로 이상 값을 감지하고 Outlier 저장 및 사용자 알림을 수행한다.",
        icon: "Zap",
      },
      {
        title: "원격 디바이스 제어",
        description:
          "사용자의 제어 요청을 API Server와 Device Controller를 통해 원격지 디바이스로 전달한다.",
        icon: "Settings",
      },
      {
        title: "Mobile/Windows 앱 연동",
        description:
          "Mobile 및 Windows Application과 연동해 센서 조회, 알림 이력 확인, 제어 기능을 제공한다.",
        icon: "Monitor",
      },
    ],
    techStackGroups: [
      {
        title: "Backend",
        items: [
          { name: "Java", category: "language" },
          { name: "REST API", category: "backend" },
          { name: "API Server", category: "backend" },
          { name: "Monitoring Engine", category: "backend" },
          { name: "WebSocket", category: "backend" },
        ],
      },
      {
        title: "Infra & DevOps",
        items: [
          { name: "Azure Cloud", category: "infra" },
          { name: "Azure VM", category: "infra" },
        ],
      },
      {
        title: "Messaging",
        items: [
          { name: "ModbusTCP", category: "messaging" },
          { name: "Py4J", category: "tool" },
        ],
      },
      {
        title: "Data",
        items: [
          { name: "MySQL", category: "database" },
          { name: "Azure MySQL DB", category: "database" },
        ],
      },
      {
        title: "Frontend",
        items: [
          { name: "Mobile Application", category: "frontend" },
          { name: "Windows Application", category: "frontend" },
        ],
      },
    ],
    screenshots: [
      {
        title: "Smart Farm Monitoring",
        image: "/images/projects/smart-farm/thumbnail.svg",
        description:
          "센서 데이터 수집, 원격 제어, 이벤트 알림 흐름을 요약한 프로젝트 대표 화면이다.",
      },
    ],
    contributions: [
      {
        date: "2022.03",
        title: "인프라 설계 및 구성, API 설계, 프론트엔드 및 앱 설계",
        description: "Azure VM과 MySQL DB 구성, API 구조 설계, Mobile/Windows Application UI 설계를 진행했다.",
      },
      {
        date: "2022.04",
        title: "원격지 데이터 수집기 클라우드 연동 및 API Server 개발",
        description: "DAS와 ModbusTCP로 통신하는 Data Collector를 Azure VM에 구성하고, 센서 데이터 조회 REST API를 개발했다.",
      },
      {
        date: "2022.05",
        title: "모니터링 서비스, 프론트엔드/앱 초기 버전, 알림 시스템 개발",
        description: "이상 값을 감지하는 Monitoring Engine, Mobile/Windows Application 초기 버전, Telegram 알림 시스템을 구현했다.",
      },
      {
        date: "2022.06",
        title: "원격 디바이스 제어 시스템 개발 및 전체 기능 테스트",
        description: "Device Controller를 개발해 API Server와 DAS를 연결하고, 수집-저장-이상감지-알림-제어 전체 플로우를 검증했다.",
      },
      {
        date: "2022.07",
        title: "프로젝트 마감",
        description: "최종 결과 보고서와 논문을 작성하고 프로젝트를 마감했다.",
      },
    ],
    troubleshooting: [
      {
        title: "원격 센서 데이터 수집 안정화",
        problem: "원격지 DAS에서 수집되는 센서 값이 비정상적이거나 수집 실패가 발생할 수 있었다.",
        solution:
          "Data Collector를 Azure VM에서 실행하고, 비정상 데이터 수집 또는 수집 실패 시 정상화 기능을 개발했다.",
        result: "무정지 실시간 데이터 수집 환경을 목표로 안정적인 수집 구조를 구성했다.",
        noteSlug: "smart-farm-data-collector-recovery",
      },
      {
        title: "DB 저장 및 데이터 손실 방지",
        problem: "센서 데이터가 실시간으로 누적되기 때문에 데이터 손실이 발생하면 모니터링 신뢰성이 낮아질 수 있었다.",
        solution: "Azure MySQL DB 저장 구조와 DB 이중화 전략을 적용했다.",
        result: "데이터 손실 방지를 고려한 클라우드 DB 구조를 설계했다.",
        noteSlug: "smart-farm-db-replication",
      },
      {
        title: "원격 디바이스 제어 연동",
        problem: "사용자의 앱 제어 요청을 실제 원격지 디바이스 동작으로 연결해야 했다.",
        solution:
          "API Server가 Device Controller를 호출하고, Device Controller가 DAS와 ModbusTCP로 통신해 제어를 수행하도록 구성했다.",
        result: "사용자가 현장에 가지 않고도 디바이스를 제어할 수 있는 흐름을 구현했다.",
        noteSlug: "smart-farm-remote-device-control",
      },
    ],
    improvements: [
      {
        title: "24시간 센서 데이터 조회 최적화",
        description:
          "특정 센서의 24시간 원본 데이터를 그대로 전달하지 않고 시간 간격별 평균 값으로 가공해 제공하여 차트 표시 부담을 줄였다.",
        result:
          "클라이언트가 24시간 센서 변화 데이터를 빠르게 시각화할 수 있는 API 응답 구조를 구성했다.",
        icon: "Activity",
      },
      {
        title: "무정지 실시간 데이터 수집 안정성 개선",
        description:
          "원격지 DAS의 센서 데이터 수집 실패나 비정상 데이터 발생 가능성을 고려해 Azure VM 기반 수집 구조와 정상화 기능을 구성했다.",
        result:
          "센서 데이터가 지속적으로 수집되고 DB에 저장될 수 있는 실시간 모니터링 기반을 마련했다.",
        icon: "Zap",
      },
      {
        title: "원격 디바이스 제어 응답성 개선",
        description:
          "사용자가 현장에 직접 방문하지 않고 API Server와 Device Controller를 통해 원격으로 디바이스를 제어할 수 있도록 구성했다.",
        result:
          "이상 상황 발생 후 앱에서 제어 요청을 수행하고 상태 변경을 확인할 수 있는 대응 흐름을 만들었다.",
        icon: "Settings",
      },
      {
        title: "이상 값 추적 구조 개선",
        description:
          "Monitoring Engine이 기준 값을 기반으로 이상 값을 감지하고 일반 센서 데이터와 분리된 Outlier 정보로 저장하도록 구성했다.",
        result:
          "이상 상황 이력 추적과 알림 처리가 쉬운 데이터 구조를 확보했다.",
        icon: "Shield",
      },
    ],
    performance: [
      {
        label: "24시간 차트 조회",
        value: "원본 데이터 → 평균값 가공 제공",
        description: "하루치 원본 데이터 대신 시간 간격별 평균값을 API에서 가공해 클라이언트 차트 렌더링 부담을 줄였다.",
        icon: "BarChart",
      },
      {
        label: "실시간 수집 안정성",
        value: "무정지 수집 구조",
        description: "비정상 데이터 수집 또는 수집 실패 시 정상화 기능을 개발해 데이터 수집 흐름이 끊기지 않도록 구성했다.",
        icon: "Activity",
      },
      {
        label: "데이터 손실 방지",
        value: "DB 이중화 적용",
        description: "센서 데이터 손실 시 모니터링 신뢰도가 저하되는 문제를 방지하기 위해 DB 이중화 구조를 적용했다.",
        icon: "Database",
      },
      {
        label: "원격 제어 대응",
        value: "현장 방문 없이 디바이스 제어",
        description: "이상 상황 발생 시 현장 이동 없이 앱에서 제어 요청을 수행하고 WebSocket으로 상태 변경을 즉시 확인할 수 있게 했다.",
        icon: "Settings",
      },
      {
        label: "서버 확장성",
        value: "Azure VM + Cloud DB",
        description: "온프레미스 대비 서버 구축과 증설이 유연한 Azure VM과 MySQL DB 기반 구조로 운영 환경을 구성했다.",
        icon: "Cloud",
      },
    ],
    retrospective: {
      learned: [
        "수집, 저장, 이상 감지, 알림, 제어까지 이어지는 전체 IoT 서비스 흐름을 경험했다.",
        "원격지 장비와 서버를 연결할 때는 API 설계뿐 아니라 통신 프로토콜, 데이터 수집 안정성, 장애 대응까지 고려해야 한다는 점을 배웠다.",
        "Data Collector와 Device Controller처럼 데이터 수집과 제어 책임을 분리하는 설계가 중요했다.",
      ],
      improvement: [
        "데이터 수집 실패나 비정상 데이터 정상화 로직에 대한 정량 지표를 추가로 측정한다.",
        "DB 이중화 구성 방식과 장애 복구 시나리오를 더 구체적으로 문서화한다.",
        "향후 Big Data 또는 AI 기반 예측 모델을 적용해 이상 감지를 고도화한다.",
      ],
      noteSlug: "smart-farm-retrospective",
    },
    relatedNoteSlugs: [
      "smart-farm-data-collector-recovery",
      "smart-farm-db-replication",
      "smart-farm-remote-device-control",
      "smart-farm-api-server-design",
      "smart-farm-monitoring-engine",
    ],
  },
];
