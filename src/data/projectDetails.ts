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
    heroImage: "/images/projects/halo/hero.png",
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
        image: "/images/projects/halo/reservation-list.png",
        description: "고객 예약 목록 (상태 배지, 매니저 정보, 서비스 카테고리)",
      },
      {
        title: "정산 관리",
        image: "/images/projects/halo/settlement-dashboard.png",
        description: "주간 자동 정산 결과 및 관리자 수동 실행 화면",
      },
      {
        title: "Prometheus 메트릭",
        image: "/images/projects/halo/prometheus.png",
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
      "statistic-concurrency-optimistic-lock",
      "reissue-infinite-request",
      "n-plus-one-prevention-querydsl-projection",
      "multi-module-shared-domain-port-pattern",
      "domain-module-boundary-from-monolith",
      "weekly-settlement-scheduler-idempotency",
      "querydsl-info-layer-data-flow",
      "multi-environment-login-token-overwrite",
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
