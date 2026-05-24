import type { TechnicalNoteDetail } from "@/types/note";
import { aiDevopsRetrospective } from "../notes/ai-devops-retrospective";

export const aiDevopsRetrospectiveDetail: TechnicalNoteDetail = {
  ...aiDevopsRetrospective,
  template: "retrospective",
  toc: [
    { id: "context", title: "프로젝트 맥락", depth: 1 },
    { id: "role", title: "내가 맡은 역할", depth: 1 },
    { id: "worked", title: "잘한 점", depth: 1 },
    { id: "missed", title: "아쉬운 점", depth: 1 },
    { id: "learned", title: "배운 점", depth: 1 },
    { id: "improvement", title: "다음 개선 방향", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "context",
      title: "1. 프로젝트 맥락",
    },
    {
      type: "paragraph",
      content:
        "Pipeline 실행 오케스트레이션과 AI 기반 실패 분석을 직접 설계하고 구현한 DevOps 자동화 백엔드입니다. POST /run 하나가 DB 커넥션 풀을 점유한다는 구조적 문제를 발견하고, 이를 해결하기 위해 FastAPI BackgroundTasks, Celery + Redis, RabbitMQ 이벤트 드리븐 MSA 세 가지 비동기화 전략을 브랜치별로 구현하고 부하 테스트로 비교했습니다.",
    },
    {
      type: "heading",
      id: "role",
      title: "2. 내가 맡은 역할",
    },
    {
      type: "list",
      items: [
        "FastAPI BackgroundTasks, Celery + Redis, RabbitMQ MSA 세 가지 비동기화 전략을 브랜치별로 직접 구현했습니다.",
        "core-api / pipeline-execution-svc / ai-review-svc 세 서비스의 RabbitMQ topic exchange 기반 이벤트 설계를 맡았습니다.",
        "Locust 부하 테스트로 전략별 처리량·실패율 수치를 측정하고 최종 전략 선택의 근거로 삼았습니다.",
        "서비스별 독립 PostgreSQL DB와 Alembic 마이그레이션을 분리해 DB 소유권 경계를 확보했습니다.",
      ],
    },
    {
      type: "heading",
      id: "worked",
      title: "3. 잘한 점",
    },
    {
      type: "list",
      items: [
        "추측으로 전략을 선택하지 않고 브랜치 비교 실험과 부하 테스트 수치를 기준으로 결정했습니다.",
        "FastAPI BackgroundTasks 내구성 부재, Celery 코드 커플링 한계를 실패 결정 기록으로 남겨 같은 접근을 반복하지 않도록 했습니다.",
        "RabbitMQ durable queue + manual ack + DLQ + 멱등성 보장으로 메시지 유실 없는 실행 흐름을 구성했습니다.",
        "pipeline_runs/job_run_logs, ai_reviews의 DB 소유권을 각 서비스로 이전해 서비스 간 직접 쿼리를 제거했습니다.",
      ],
    },
    {
      type: "heading",
      id: "missed",
      title: "4. 아쉬운 점",
    },
    {
      type: "paragraph",
      content:
        "부하 테스트를 로컬 Docker Desktop VM 환경에서 진행해 클라우드 실제 운영 환경과 오버헤드 조건이 달랐습니다. Celery + Redis 47.4 req/s, RabbitMQ MSA의 수치는 로컬 단일 인스턴스 기준이므로 클라우드 환경에서 재측정이 필요합니다.",
    },
    {
      type: "heading",
      id: "learned",
      title: "5. 배운 점",
    },
    {
      type: "list",
      items: [
        "MSA 전환의 목적은 단일 인스턴스 처리량 향상이 아니라 독립 배포, 독립 확장, 장애 격리입니다. 로컬 단일 인스턴스 기준에서 MSA는 모놀리스보다 느릴 수 있습니다.",
        "FastAPI BackgroundTasks는 내구성이 필요한 실행 작업에 부적합합니다. Celery + Redis는 프로세스를 분리하지만 코드베이스를 공유해 진정한 서비스 경계가 아닙니다.",
        "RabbitMQ topic exchange는 routing key 패턴 매칭으로 이벤트 타입 증가에 유연하게 대응할 수 있습니다.",
        "uv workspace 모노레포에서 공유 라이브러리로 이벤트 스키마를 관리하면 publisher/consumer 간 계약 드리프트를 컴파일 타임에 차단할 수 있습니다.",
      ],
    },
    {
      type: "heading",
      id: "improvement",
      title: "6. 다음 개선 방향",
    },
    {
      type: "list",
      items: [
        "REST vs gRPC 조회 프록시 비교 실험 (ADR-015 Track A/B)",
        "클라우드 환경 부하 테스트 재측정 (로컬 Docker Desktop VM 오버헤드 배제)",
        "CI/CD 파이프라인 구축 (GitLab CI, ADR-017 기준)",
        "Kubernetes 도입 (ADR-016)",
      ],
    },
  ],
  relatedNoteSlugs: [
    "async-pipeline-transition",
    "rabbitmq-event-topology",
    "metric-cardinality-troubleshooting",
    "msa-rabbitmq-migration",
    "consumer-idempotency-processed-event",
    "event-schema-versioning-deploy-order",
    "distributed-tracing-correlation-id",
    "cross-service-join-db-separation",
    "msa-load-test-threadpool-ownership",
  ],
};
