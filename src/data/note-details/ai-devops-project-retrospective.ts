import type { TechnicalNoteDetail } from "@/types/note";
import { aiDevopsProjectRetrospective } from "../notes/ai-devops-project-retrospective";

export const aiDevopsProjectRetrospectiveDetail: TechnicalNoteDetail = {
  ...aiDevopsProjectRetrospective,
  template: "retrospective",
  toc: [
    { id: "overview", title: "개요", depth: 1 },
    { id: "monolith", title: "출발점 — 동기 모놀리스", depth: 1 },
    { id: "track1", title: "Track 1 · FastAPI BackgroundTasks", depth: 1 },
    { id: "track2", title: "Track 2 · Celery + Redis", depth: 1 },
    { id: "msa", title: "MSA 전환 — RabbitMQ 이벤트 드리븐", depth: 1 },
    { id: "reflection", title: "전체를 돌아보며", depth: 1 },
    { id: "status", title: "현재 상태", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "overview",
      title: "개요",
    },
    {
      type: "paragraph",
      content:
        "이 프로젝트는 \"DevOps 역량을 보여주는 포트폴리오를 만들어보자\"는 단순한 동기에서 출발했다. 처음 목표는 파이프라인 실행을 자동화하는 API 서버였다. 지금 이 문서를 쓰는 시점에 프로젝트는 세 개의 독립 서비스, RabbitMQ 이벤트 브로커, 서비스별 DB, CI 전략까지 갖춘 MSA 구조가 됐다. 이 여정은 처음부터 계획된 것이 아니었다.",
    },
    {
      type: "paragraph",
      content:
        "각 단계에서 무엇을 만들었고, 무엇이 막혔고, 왜 다음 단계로 넘어갔는지를 기록한다. MSA 전환 이후의 Phase 1~3 상세 과정은 별도 회고에 기술돼 있다. 이 문서는 프로젝트 전체의 흐름을 서술한다.",
    },
    {
      type: "heading",
      id: "monolith",
      title: "출발점 — 동기 모놀리스",
    },
    {
      type: "paragraph",
      content:
        "단일 FastAPI 애플리케이션이었다. 인증, Project/Pipeline/Job CRUD, Pipeline 실행, AI Review가 하나의 프로세스 안에 있었다. DB는 PostgreSQL 하나였고, 모든 테이블이 같은 스키마에 있었다. 사용자가 Pipeline을 만들고 POST /run을 호출하면, 서버가 Git 저장소를 clone하고, 정의된 Job을 순차 실행하고, 완료 후 AI가 실행 결과를 분석해서 리포트를 반환했다. 이 과정이 모두 단일 HTTP 요청 안에서 동기 실행됐다.",
    },
    {
      type: "paragraph",
      content:
        "이 구조가 MVP에서는 옳았다. 배포 단위가 하나이고, 로컬에서 uvicorn만 실행하면 모든 기능이 동작했다. 초기 개발 속도가 빨랐다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "POST /run이 응답을 반환하는 데 수십 초가 걸렸다. Git clone과 Job 실행이 모두 끝나야 HTTP 응답이 반환되는 구조였기 때문이다. 이 구간 내내 DB 커넥션이 점유됐다. /run이 커넥션을 쥐고 있는 동안 다른 요청이 커넥션을 기다리면서 대기가 발생했다. 쿼리 최적화로 어느 정도 완화됐지만 근본 문제를 해소하지 못했다. 결론은 POST /run을 HTTP 응답 경로에서 분리하는 것이었다.",
    },
    {
      type: "heading",
      id: "track1",
      title: "Track 1 · FastAPI BackgroundTasks",
    },
    {
      type: "paragraph",
      content:
        "FastAPI에는 BackgroundTasks가 내장돼 있다. 응답을 반환한 뒤 함수를 백그라운드에서 실행하는 가장 단순한 방법이다. 별도 인프라가 필요 없다. POST /run에서 PipelineRun 레코드를 만들고 202를 반환한 뒤, background_tasks.add_task(execute_pipeline_run, pipeline_run_id)로 실행 함수를 등록했다. 이 변경으로 POST /run 응답 시간이 수십 초에서 수백 ms로 줄었다. DB 커넥션 점유 문제도 해소됐다.",
    },
    {
      type: "paragraph",
      content: "동작했지만 채택하지 않았다. 이유는 세 가지였다.",
    },
    {
      type: "list",
      items: [
        "태스크 내구성이 없다. BackgroundTasks는 인메모리 큐다. 서버가 재시작되거나 프로세스가 죽으면 대기 중이거나 실행 중인 태스크가 모두 사라진다.",
        "실행 서비스를 독립 배포하는 경로가 없다. BackgroundTasks는 API 서버와 같은 프로세스에서 실행된다. 실행 서비스를 독립 컨테이너로 분리하려면 프로세스를 나눠야 하고, 나누는 순간 BackgroundTasks는 사용할 수 없게 된다.",
        "API 서버 부하와 실행 부하가 공유된다. 파이프라인 실행이 CPU를 많이 쓰면 API 응답성이 떨어진다. 두 가지 부하를 나누려면 프로세스 분리가 필수다.",
      ],
    },
    {
      type: "heading",
      id: "track2",
      title: "Track 2 · Celery + Redis",
    },
    {
      type: "paragraph",
      content:
        "BackgroundTasks의 태스크 유실 문제를 해결하려면 외부 큐가 필요하다. Celery는 Python 생태계에서 가장 성숙한 태스크 큐 라이브러리고, Redis와의 조합이 흔하다. POST /run이 202를 반환하고 celery_app.send_task(\"run_pipeline_task\", args=[str(pipeline_run_id)])로 태스크를 등록한다. Redis가 태스크 메시지를 저장하고, Celery worker가 별도 프로세스에서 꺼내 실행한다. BackgroundTasks 대비 태스크가 Redis에 저장되므로 서버 재시작 후에도 보존된다.",
    },
    {
      type: "paragraph",
      content: "구현했고 동작했다. 그러나 구조적 문제가 확인됐다.",
    },
    {
      type: "list",
      items: [
        "Redis는 메시지 브로커가 아니다. AOF나 RDB persistence를 별도로 설정하지 않으면 Redis가 재시작될 때 큐에 있던 태스크가 사라진다. BackgroundTasks의 태스크 유실 문제를 해결하기 위해 Celery를 도입했는데, Redis 기본 설정에서는 동일한 유실 위험이 있다.",
        "Celery worker를 별도 컨테이너로 분리해도 진정한 서비스 경계가 아니다. worker 컨테이너는 Core API의 코드베이스를 그대로 포함해야 한다. 물리적으로는 컨테이너가 분리됐지만 코드는 여전히 결합돼 있다. 이것은 프로세스 분리이지 서비스 분리가 아니다.",
        "Celery 프로토콜은 Python 전용이다. 향후 다른 언어로 작성된 서비스와 통합할 때 Celery 프로토콜이 장벽이 된다.",
        "Dead Letter Queue와 유연한 라우팅이 기본 제공되지 않는다. 실패한 태스크의 재처리, 우선순위 큐, Exchange 기반 라우팅이 필요해지면 Redis 브로커로는 대응이 어렵다.",
      ],
    },
    {
      type: "heading",
      id: "msa",
      title: "MSA 전환 — RabbitMQ 이벤트 드리븐",
    },
    {
      type: "paragraph",
      content:
        "Celery + Redis의 한계가 확인된 시점에 메시지 브로커로 Kafka와 RabbitMQ를 검토했다. Kafka는 이벤트 소싱, 재처리, 대용량 스트리밍에 강점이 있다. 그러나 이 프로젝트에서 발생하는 이벤트는 파이프라인 실행 요청과 AI Review 요청 두 종류뿐이다. Kafka 클러스터는 이 규모에서 오버엔지니어링이다. RabbitMQ는 메시지 내구성이 기본 설정으로 보장되고, Dead Letter Queue와 Exchange 기반 라우팅이 내장돼 있다. 관리 UI(15672)로 이벤트 흐름을 눈으로 확인할 수 있어 개발 중 디버깅이 편했다.",
    },
    {
      type: "paragraph",
      content:
        "한 번에 모든 것을 바꾸는 big-bang 전환을 하지 않았다. 중간 상태가 항상 동작하는 시스템이어야 한다는 원칙을 지키기 위해 세 단계로 나눴다. Phase 1은 services/core-api, services/pipeline-execution-svc, services/ai-review-svc 물리적 디렉토리 분리다. Phase 2는 libs/devops-messaging에 이벤트 스키마와 토폴로지를 정의하고 완전한 이벤트 루프를 완성했다. Phase 3은 서비스별 DATABASE_URL 분리와 Neon DB 프로젝트 3개 분리다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "MSA로 전환하면서 비동기 처리 성능이 당연히 더 좋아질 것이라고 예상했다. 실제 부하 테스트 결과는 반대였다. MSA는 publish → 네트워크 → consume → 실행 → publish → 네트워크 → consume → DB 쓰기로 이어지는 여러 hop이 있다. MSA 전환의 목적은 단일 인스턴스 처리량을 높이는 것이 아니다. 서비스별 독립 확장, 장애 격리, 독립 배포를 가능하게 하는 것이다. 이 이점들은 단일 인스턴스 부하 테스트에서 수치로 나타나지 않는다.",
    },
    {
      type: "heading",
      id: "reflection",
      title: "전체를 돌아보며",
    },
    {
      type: "list",
      items: [
        "각 단계는 다음 단계의 이유를 만들었다 — 동기 모놀리스에서 DB 커넥션 점유 문제가 드러났기 때문에 비동기화가 필요해졌다. BackgroundTasks로 비동기화를 달성했지만 태스크 내구성이 없었다. Celery + Redis로 내구성을 확보했지만 서비스 경계가 없었다. RabbitMQ MSA로 서비스 경계를 만들었지만 DB가 공유됐다. 처음부터 MSA로 시작했다면 더 빨랐을까? 각 단계를 직접 구현하고 한계를 경험했기 때문에 다음 단계의 판단이 근거 있었다.",
        "실패한 접근이 문서화되지 않으면 반복된다 — BackgroundTasks와 Celery + Redis는 채택하지 않았다. 그 이유가 실패 결정 005, 006으로 기록돼 있다. 이 문서들이 없으면 새 세션의 AI나 새로 합류한 개발자가 같은 방향을 다시 제안할 수 있다. 이 프로젝트에서 설계 문서와 실패 결정 기록을 유지한 직접적인 이유는 AI 보조 개발에서의 맥락 유지 문제였다.",
        "설계가 구현을 선행하지 않는다 — 설계 문서를 쓰고 구현하면 구현하면서 설계의 결함이 드러났다. processed_events 테이블 위치, ai_reviews 소유권 타이밍, 서비스 간 HTTP 스키마 불일치가 모두 구현 중에 발견됐다. 설계 문서의 역할은 계획의 확정이 아니라 결정의 추적이다.",
        "테스트 격리는 계약 검증을 보장하지 않는다 — 단위 테스트와 통합 테스트가 모두 통과한 상태에서 서비스 간 HTTP 필드명 불일치 버그가 존재했다. 단위 테스트는 fake로 격리돼 실제 HTTP body를 만들지 않는다. 통합 테스트는 in-memory store를 사용해서 실제 HTTP 호출이 없다. 이벤트 스키마를 devops-messaging 공유 패키지로 관리한 이유가 여기에 있다.",
        "MSA는 서비스를 분리하는 것이 아니다 — 소유권(데이터, 인증, 인가), 통신 방식(이벤트 vs REST 프록시), 테스트 격리 수준, dead code 경계. 이 모든 것이 모놀리스에서는 암묵적으로 결정돼 있었는데, MSA에서는 명시적으로 선택해야 한다. MSA는 \"서비스를 분리하는 것\"이 아니라 \"서비스 간 계약과 경계를 설계하는 것\"이다.",
      ],
    },
    {
      type: "heading",
      id: "status",
      title: "현재 상태",
    },
    {
      type: "cards",
      items: [
        {
          title: "MVP — 동기 모놀리스",
          description: "단일 FastAPI 앱, 인증·CRUD·파이프라인 실행·AI Review 하나의 프로세스",
          badge: "완료·폐기",
        },
        {
          title: "Track 1 — FastAPI BackgroundTasks",
          description: "인메모리 비동기 실행, POST /run 응답 분리 달성, 태스크 내구성 없음",
          badge: "구현·실험·폐기",
        },
        {
          title: "Track 2 — Celery + Redis",
          description: "외부 큐 기반 비동기 실행, worker 프로세스 분리, 서비스 경계 없음",
          badge: "구현·실험·폐기",
        },
        {
          title: "MSA Phase 1 — 물리 서비스 분리",
          description: "core-api, pipeline-execution-svc, ai-review-svc 디렉토리 분리, uv workspace, CI 재편",
          badge: "완료",
        },
        {
          title: "MSA Phase 2 — RabbitMQ 이벤트 루프",
          description: "libs/devops-messaging 이벤트 스키마, topic exchange 기반 완전 비동기 이벤트 루프",
          badge: "완료",
        },
        {
          title: "MSA Phase 3 — DB 소유권 물리 분리",
          description: "Neon DB 3개 프로젝트, 서비스별 DATABASE_URL, alembic 마이그레이션 순서 보장",
          badge: "완료",
        },
      ],
    },
    {
      type: "paragraph",
      content: "남은 과제",
    },
    {
      type: "list",
      items: [
        "클라우드 환경 부하 테스트 — 로컬 Docker Desktop 환경의 VM 오버헤드 없이 MSA 재측정",
        "Celery 폴백 코드 제거 (RabbitMQ 경로 안정화 확인 후)",
        "HTTP 계약 공유 패키지 (devops-contracts) 도입",
        "CI/CD 파이프라인 구축 (ADR-017)",
        "Kubernetes 도입 (ADR-016)",
      ],
    },
  ],
  relatedNoteSlugs: [
    "async-pipeline-transition",
    "msa-rabbitmq-migration",
    "consumer-idempotency-processed-event",
    "cross-service-join-db-separation",
    "msa-load-test-threadpool-ownership",
  ],
};
