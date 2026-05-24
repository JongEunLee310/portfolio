import type { TechnicalNoteDetail } from "@/types/note";
import { aiDevopsRetrospective } from "../notes/ai-devops-retrospective";

export const aiDevopsRetrospectiveDetail: TechnicalNoteDetail = {
  ...aiDevopsRetrospective,
  template: "retrospective",
  toc: [
    { id: "overview", title: "개요", depth: 1 },
    { id: "phase1", title: "Phase 1 · 물리적 서비스 분리", depth: 1 },
    { id: "phase2", title: "Phase 2 · RabbitMQ 이벤트 드리븐", depth: 1 },
    { id: "phase3", title: "Phase 3 · DB 소유권 물리 분리", depth: 1 },
    { id: "defects", title: "발견하고 수정한 버그들", depth: 1 },
    { id: "reflection", title: "전체 과정을 돌아보며", depth: 1 },
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
        "단일 FastAPI 서비스로 출발해 MSA Phase 3(DB 소유권 물리 분리)까지 완료한 과정을 정리한 회고입니다. Claude Code, Codex, GitHub Copilot을 활용한 AI 보조 개발이었으며, 각 도구의 토큰 한도를 여러 번 소진할 만큼 밀도 있는 작업이었습니다.",
    },
    {
      type: "paragraph",
      content:
        "출발점은 인증, CRUD, 파이프라인 실행, AI Review가 하나의 프로세스 안에 있는 단일 FastAPI 서비스였습니다. POST /run 하나가 DB 커넥션 풀을 점유하는 구조적 한계가 명확해지면서 MSA 전환을 결정했습니다. 전환을 더 늦출수록 뜯어내는 비용이 커진다는 판단이었습니다.",
    },
    {
      type: "list",
      items: [
        "Phase 1 — core-api / pipeline-execution-svc / ai-review-svc 물리 분리, uv workspace, CI 재편",
        "Phase 2 — RabbitMQ topic exchange 기반 이벤트 루프, 완전 비동기 처리 전환",
        "Phase 3 — DB 소유권 물리 분리, Neon 3개 프로젝트, REST 프록시 교체",
      ],
    },
    {
      type: "heading",
      id: "phase1",
      title: "Phase 1 · 물리적 서비스 분리",
    },
    {
      type: "paragraph",
      content:
        "단일 FastAPI 애플리케이션을 services/core-api, services/pipeline-execution-svc, services/ai-review-svc 세 디렉토리로 분리했습니다. uv workspace로 패키지 경계를 만들고 공유 라이브러리(libs/devops-messaging)를 위한 자리를 잡았습니다. CI를 서비스별 변경 감지 단위로 재편했습니다.",
    },
    {
      type: "paragraph",
      content: "고민했던 것",
    },
    {
      type: "comparison",
      items: [
        {
          title: "\"분리\"의 정의 — 복제 vs 분리",
          description:
            "Phase 1에서 가장 먼저 마주한 질문은 분리의 정의였습니다. 각 서비스 디렉토리에 고유 로직만 남겨두려 했지만, 실행 가능한 컨테이너를 만들려면 각 서비스가 최소한의 FastAPI 앱 골격과 인증 미들웨어를 가져야 했습니다. 결국 core-api 코드를 각 서비스 디렉토리에 복사하는 방식을 선택했습니다. Phase 1의 목표는 독립 배포 가능한 컨테이너 단위를 만드는 것이지 서비스 고유 로직을 당장 구현하는 것이 아니었습니다.",
          bullets: [
            "고유 로직만 분리: 초기부터 깔끔하지만 컨테이너 단위 구성이 지연됨",
            "코드 복제 후 분리: 기술 부채처럼 보이지만 Phase 2에서 각 서비스 역할을 떼어낼 수 있는 컨테이너 경계를 먼저 확보 — 이 판단이 없었다면 Phase 1·2 작업이 뒤섞여 무한 리팩토링에 빠졌을 것",
          ],
        },
        {
          title: "uv workspace vs 독립 패키지",
          description:
            "각 서비스를 완전히 독립된 Python 패키지로 분리할지, workspace로 묶을지를 고민했습니다. 독립 패키지는 서비스 경계가 가장 명확하지만 공유 코드를 매번 PyPI에 배포하거나 로컬 경로 의존성을 관리해야 합니다. 공유 라이브러리(libs/devops-messaging)가 필요할 것이 명확했으므로 workspace를 선택했습니다.",
          bullets: [
            "독립 패키지: 서비스 경계 명확, 공유 코드 배포·관리 부담",
            "uv workspace: 모노레포 내 패키지 간 참조가 자유롭고 공유 라이브러리 별도 배포 없이 사용 가능 — Phase 2에서 PipelineExecutionRequestedEvent 같은 Pydantic 스키마를 publisher·consumer가 같은 패키지에서 import하므로 필드 드리프트가 자동으로 방지",
          ],
        },
        {
          title: "서비스 간 통신 방식 선택 시점",
          description:
            "Phase 1에서 서비스 간 통신 방식을 미리 결정해야 했습니다. REST API를 직접 호출하면 당장 동작하지만 결합도가 높고, 이벤트 브로커를 두면 느슨하게 결합되지만 구현이 복잡해집니다. Phase 1에서는 결정을 미루고 core-api가 BackgroundTasks로 직접 실행하는 임시 구조를 유지했습니다.",
          bullets: [
            "Phase 1에 이벤트 브로커 도입: 구조적으로 올바르지만 분리 작업과 뒤섞여 범위가 무한 확장",
            "BackgroundTasks 임시 구조 유지: Phase 2의 작업 범위를 명확하게 만듦 — BackgroundTasks → RabbitMQ 이벤트로의 교체가 Phase 2의 핵심 목표가 됨",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: "어려웠던 점",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "Docker 빌드 컨텍스트 문제: 각 서비스의 Dockerfile이 루트의 libs/ 디렉토리를 참조해야 하는데, docker build의 컨텍스트를 서비스 디렉토리로 지정하면 libs/가 빌드 컨텍스트 밖에 있어서 COPY가 실패했습니다. Docker는 컨텍스트 밖의 경로를 허용하지 않습니다. 빌드 컨텍스트를 루트(ai_devops/)로 올리고 모든 Dockerfile 경로를 루트 기준으로 재작성해서 해결했습니다.",
    },
    {
      type: "list",
      items: [
        "libs/devops-messaging가 변경되면 세 서비스 모두 테스트해야 하는지 판단이 필요했습니다. 공유 라이브러리 변경은 전체 테스트를 트리거하고, 서비스 내부 변경은 해당 서비스 테스트만 트리거하는 방식으로 ADR-017에 정리했습니다.",
      ],
    },
    {
      type: "heading",
      id: "phase2",
      title: "Phase 2 · RabbitMQ 이벤트 드리븐 서비스 통신",
    },
    {
      type: "paragraph",
      content:
        "libs/devops-messaging에 이벤트 스키마와 토폴로지(Exchange, Queue, Routing Key)를 정의했습니다. core-api가 실행 요청·AI Review 요청을 publish하고, 각 서비스가 구독해서 처리한 뒤 결과 이벤트를 publish하고, core-api가 다시 결과를 수신하는 완전한 이벤트 루프를 구현했습니다.",
    },
    {
      type: "paragraph",
      content: "고민했던 것",
    },
    {
      type: "comparison",
      items: [
        {
          title: "Kafka vs RabbitMQ",
          description:
            "처음에는 MSA 표준으로 Kafka를 검토했습니다. Kafka는 이벤트 소싱, 재처리, 대용량 스트리밍에 강점이 있지만 ZooKeeper 클러스터를 포함한 인프라 복잡도가 높습니다. 이 프로젝트가 발생시키는 이벤트는 파이프라인 실행과 AI Review 두 종류뿐이고 동시 실행 수는 수십 건 수준이었습니다.",
          bullets: [
            "Kafka: 이벤트 소싱·재처리·대용량 스트리밍 강점, 로컬 개발에도 클러스터 여러 컨테이너 필요",
            "RabbitMQ: DLQ·Manual Ack·라우팅 키 기반 토폴로지 기본 제공, 관리 UI(15672)로 이벤트 흐름 실시간 확인 가능 — 이 프로젝트 규모에서 Kafka를 도입하는 것은 비용 대비 이점이 없음",
          ],
        },
        {
          title: "완전 이벤트 드리븐 vs REST 병행",
          description:
            "이벤트 루프 구현 중 조회 경로도 이벤트로 처리할지 고민했습니다. GET /pipeline-runs/{id}를 이벤트로 처리하는 request-reply 패턴은 동기 HTTP보다 복잡하면서 이점이 없습니다. 파이프라인 실행 요청·AI Review 요청은 처리 완료까지 수초~수십 초가 걸려 비동기가 자연스럽습니다.",
          bullets: [
            "완전 이벤트 드리븐: 구조 일관성은 있으나 조회 지연 증가, consumer 없을 때 timeout 처리 복잡",
            "조회는 REST, 명령은 이벤트: 명확한 분리 기준 — 이 원칙이 설계 문서에 명시됨",
          ],
        },
        {
          title: "Consumer idempotency 설계",
          description:
            "RabbitMQ는 at-least-once 전달이므로 같은 이벤트가 두 번 올 수 있습니다. 메모리 캐시는 서버 재시작 시 사라지고, DB 먼저 조회 후 처리하는 방식은 check-then-act 패턴으로 race condition에 취약합니다.",
          bullets: [
            "메모리 캐시: 구현 단순하지만 재시작 시 사라져 중복 처리 가능",
            "processed_events 테이블 + UniqueConstraint: DB의 UNIQUE 보장을 멱등성 수단으로 사용 — 중복 이벤트가 오면 INSERT가 IntegrityError를 내고 catch해서 skip, race condition 원천 차단",
          ],
        },
        {
          title: "폴백 경로의 필요성과 숨겨진 위험",
          description:
            "RabbitMQ publish 실패 시 AI Review 요청이 전부 실패하면 사용자 경험이 나쁩니다. ai-review-svc에 /internal/analyze 엔드포인트를 두고 publish 실패 시 직접 HTTP 호출하는 폴백을 구현했는데, 이 엔드포인트는 인증이 없는 내부 전용 경로였습니다.",
          bullets: [
            "폴백 없음: RabbitMQ 장애 시 AI Review 전 요청 실패",
            "/internal/analyze 폴백: 가용성 확보하지만 docker-compose에 포트 8002가 외부 노출돼 있어 인증 없는 엔드포인트가 직접 호출 가능한 상태 — 포트 바인딩 제거와 내부 Docker 네트워크 격리로 해결",
          ],
        },
        {
          title: "Consumer ack/nack 경계",
          description:
            "메시지 처리 중 예외가 발생했을 때 재시도 여부를 결정하는 경계가 필요했습니다. 이 경계가 명확하지 않으면 DLQ가 쌓이거나 무한 재처리가 발생합니다.",
          bullets: [
            "잘못된 메시지 형식(ConsumerMessageError): 재시도가 의미없으므로 nack(requeue=False)로 DLQ",
            "일시적 오류(DB 연결 실패): nack(requeue=True)로 재처리 / 비즈니스 예외(존재하지 않는 pipeline_id): 같은 오류가 반복되므로 DLQ로 보내되 로그에 상세 내용 기록",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: "어려웠던 점",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "서비스 간 HTTP 필드명 불일치: RabbitMQ를 AsyncMock으로 대체한 단위 테스트와 in-memory store를 사용한 통합 테스트 모두 실제 HTTP를 호출하지 않았습니다. AIReviewClient.analyze_job_run_log가 HTTP body에 \"status\" key를 보냈는데, ai-review-svc의 InternalAnalyzeRequest는 \"job_run_status\" key를 기대했습니다. 폴백 경로에서만 실행되는 코드여서 어떤 자동화 테스트도 이 버그를 잡지 못했습니다.",
    },
    {
      type: "list",
      items: [
        "aio_pika FieldTable 타입 문제: RabbitMQ에서 메시지를 수신할 때 헤더 필드가 FieldTable 타입으로 오는데 dict처럼 보이지만 Pydantic 모델에 바로 언패킹하면 예상치 못한 타입 오류가 발생했습니다. json.loads(message.body) 경로로 먼저 dict로 변환한 뒤 Pydantic 모델에 넣는 방식으로 경계를 명확히 했습니다.",
        "Exchange 이름·Queue 이름·Routing Key 오타는 AsyncMock 격리 테스트에서 발견할 수 없었습니다. test_messaging_contracts.py를 별도로 두어 상수 값을 코드 레벨에서 검증하는 방식으로 보완했습니다.",
      ],
    },
    {
      type: "heading",
      id: "phase3",
      title: "Phase 3 · DB 소유권 물리 분리",
    },
    {
      type: "paragraph",
      content:
        "core-api에서 pipeline_runs, job_run_logs 직접 쿼리 의존을 제거하고 REST 프록시(PipelineExecutionClient)로 교체했습니다. docker-compose의 DATABASE_URL을 서비스별로 분리하고, Neon DB 프로젝트를 3개로 분리해 alembic 마이그레이션을 올바른 순서로 적용했습니다.",
    },
    {
      type: "paragraph",
      content: "고민했던 것",
    },
    {
      type: "comparison",
      items: [
        {
          title: "분리 순서가 데이터를 보호한다",
          description:
            "코드 의존 제거 → DB URL 분리 → alembic 정리 순서를 지키지 않으면 어느 시점에 서비스가 존재하지 않는 테이블을 조회하거나 데이터가 있는 테이블이 DROP됩니다. core-api가 아직 pipeline_runs를 직접 조회하는 상태에서 alembic 0015(DROP)를 적용하면 조회가 전부 ProgrammingError로 깨집니다.",
          bullets: [
            "잘못된 순서: DB URL 분리 → 코드 의존 제거 — 어느 시점에 존재하지 않는 테이블 조회 또는 데이터 손실",
            "올바른 순서: pipeline-execution-svc CREATE → ai-review-svc CREATE → core-api 코드 의존 제거 → core-api DROP — 이 순서를 ADR-015에 명시",
          ],
        },
        {
          title: "Neon DB 프로젝트 3개 분리 vs 단일 프로젝트 내 분리",
          description:
            "단일 Neon 프로젝트 안에서 database를 여러 개 두는 방법도 있었습니다. 비용과 설정 복잡도가 낮아지지만 프로젝트 레벨 격리가 없어서 청구 기준과 접속 자격 증명이 섞입니다.",
          bullets: [
            "단일 프로젝트 내 분리: 비용 절감, 서비스 간 자격 증명 경계 없음",
            "3개 프로젝트 분리: 각 서비스가 자신의 DB에만 접속 자격 증명을 가지고, 한 서비스의 DB 문제가 다른 서비스에 전파되지 않는 구조 — 서비스 독립성 원칙을 인프라 레벨에서도 유지",
          ],
        },
        {
          title: ".env 환경변수 전략",
          description:
            "docker-compose에서 각 서비스에 DATABASE_URL을 주입할 때 서비스마다 같은 이름에 다른 값을 주입하거나, CORE_API_DATABASE_URL 등 서비스별 이름을 .env에서 사용하는 두 가지 방법이 있었습니다.",
          bullets: [
            "동일 이름 DATABASE_URL: 서비스 내부 코드 단순, 실수로 잘못된 DB에 연결 가능",
            "서비스별 이름 → docker-compose에서 매핑: DATABASE_URL: ${CORE_API_DATABASE_URL:?CORE_API_DATABASE_URL is required} 형태로 매핑 — 실수로 잘못된 DB에 연결하는 것을 docker-compose 시작 시점에 오류로 차단",
          ],
        },
        {
          title: "로컬 개발 환경에서 3개 DB 관리",
          description:
            "로컬에서 PostgreSQL 컨테이너를 3개 실행하는 방법 대신, 단일 PostgreSQL 컨테이너에서 데이터베이스를 3개 만드는 방식을 선택했습니다. 운영(Neon)에서는 프로젝트 3개로 완전히 분리되고, 로컬에서는 관리 편의성을 위해 단일 컨테이너를 유지합니다.",
          bullets: [
            "컨테이너 3개: 운영 환경과 동일하지만 로컬에서 컨테이너 수 증가",
            "단일 컨테이너 + postgres-init.sql: core_api_db·pipeline_execution_db·ai_review_db 3개 데이터베이스 초기화 — 로컬에서는 컨테이너 하나, 운영에서는 Neon 프로젝트 3개로 분리",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: "어려웠던 점",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "DB 소유권 분리 후 서비스 간 인증 실패: Phase 3에서 pipeline_execution_db와 ai_review_db를 분리한 뒤 GET /pipelines/{id}/runs 요청이 502로 실패했습니다. sub-service들의 get_current_user가 UserRepository를 통해 자신의 DB에서 users 테이블을 조회하려 했는데, DB 분리로 해당 테이블이 존재하지 않았습니다. users 테이블은 core-api가 소유합니다. 해결 방향으로 JWT 각자 검증, Redis 사용자 정보 공유, X-Internal-User-Id 헤더 주입 세 가지를 검토했고, 전달할 정보가 UUID 하나임을 감안해 헤더 주입을 선택했습니다.",
    },
    {
      type: "list",
      items: [
        "ai_reviews 마이그레이션 물리 FK: ai_review_db는 독립 DB라서 jobs 테이블이 없는데, 초기 마이그레이션 파일에 FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE가 남아 있었습니다. relation \"jobs\" does not exist 오류로 실패했고, 물리 FK를 제거 후 재실행해서 해결했습니다. 서비스 독립 DB에서 물리 FK는 존재할 수 없다는 원칙을 마이그레이션 파일 작성 단계에서 확인해야 합니다.",
        "asyncpg URL 형식: Neon이 제공하는 기본 연결 문자열은 postgresql://...?sslmode=require 형식이지만, SQLAlchemy asyncpg 드라이버는 postgresql+asyncpg://...?ssl=require를 요구합니다. 드라이버 접두사와 SSL 파라미터 이름이 모두 다릅니다. Neon URL을 .env에 추가할 때 두 항목을 체크리스트로 확인하는 습관이 생겼습니다.",
      ],
    },
    {
      type: "heading",
      id: "defects",
      title: "발견하고 수정한 버그들",
    },
    {
      type: "paragraph",
      content:
        "Phase 3 코드 검토 과정에서 드러난 버그들입니다. 세 가지 모두 단위 테스트와 통합 테스트가 통과한 상태에서 존재했다는 점이 공통점입니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "서비스 간 HTTP 필드명 불일치 (054)",
          description:
            "core-api의 AIReviewClient가 HTTP body에 \"status\" key를 보냈고, ai-review-svc의 InternalAnalyzeRequest는 \"job_run_status\" 필드로 선언돼 있었습니다. RabbitMQ publish가 성공하는 정상 경로에서는 이 코드가 전혀 실행되지 않아 어떤 자동화 테스트로도 발견할 수 없었습니다. 두 파일을 나란히 놓고 body 구성 코드와 Pydantic 모델 필드를 직접 대조해서 발견했습니다.",
          badge: "해결",
        },
        {
          title: "인증 없는 내부 엔드포인트 외부 포트 노출 (055)",
          description:
            "/internal/analyze는 인증 미들웨어가 적용되지 않은 서비스 내부 전용 경로입니다. docker-compose에서 ai-review-svc에 \"8002:8000\" 포트 바인딩이 있어 외부에서 직접 호출 가능한 상태였습니다. /internal/ 접두사는 단순한 라우터 prefix이지 접근 제어가 아닙니다. pipeline-execution-svc(8001)·ai-review-svc(8002) 포트 바인딩을 제거하고 내부 Docker 네트워크만 사용하도록 수정했습니다.",
          badge: "해결",
        },
        {
          title: "FastAPI status_code와 body code 불일치 (056)",
          description:
            "@router.post(..., status_code=HTTP_200_OK)로 선언된 엔드포인트에서 SuccessResponse(code=HTTP_202_ACCEPTED, ...)를 반환했습니다. HTTP 상태 코드는 200이지만 응답 body의 code 필드는 202였습니다. 클라이언트가 body의 code를 기준으로 처리하면 pending 상태로 폴링하는 로직이 트리거될 수 있습니다. 두 값을 200으로 통일했습니다.",
          badge: "해결",
        },
        {
          title: "DB 소유권 분리 후 서비스 간 인증 실패 (057)",
          description:
            "pipeline-execution-svc의 get_current_user가 자신의 DB에서 users 테이블을 조회하려 했는데 DB 분리로 테이블이 없었습니다. core-api가 JWT를 검증한 뒤 X-Internal-User-Id 헤더를 추가하고, sub-service의 get_current_user는 DB 대신 헤더에서 user_id를 읽는 방식으로 전환했습니다. UserRepository, TokenService, OAuth2PasswordBearer 의존성을 sub-service에서 완전히 제거했습니다.",
          badge: "해결",
        },
      ],
    },
    {
      type: "heading",
      id: "reflection",
      title: "전체 과정을 돌아보며",
    },
    {
      type: "cards",
      items: [
        {
          title: "AI 보조 개발에서 맥락 유지가 가장 어렵다",
          description:
            "Claude Code 5시간 토큰 한도를 여러 번 소진했고, 매번 새 세션에서 이전 결정의 배경을 다시 설명해야 했습니다. \"왜 Kafka가 아니라 RabbitMQ인가\", \"왜 완전 이벤트 드리븐이 아닌가\" 같은 질문을 새 세션에서 처음부터 다시 논하는 것은 시간 낭비입니다. AI가 맥락을 잃었을 때 설계 문서와 ADR이 복원 지점이 됩니다. 코드는 결과를 보여주지만 결정의 맥락을 보여주지 않습니다.",
        },
        {
          title: "설계 문서는 구현 전이 아니라 구현과 함께 발전한다",
          description:
            "설계 초안에는 완전 이벤트 드리븐으로 일원화라고 기록했다가, 구현 중에 조회 경로도 이벤트로 처리하는 것이 현실적으로 불합리하다는 것을 깨닫고 수정했습니다. processed_events 위치도 설계 초안과 실제 구현이 달라졌습니다. 설계 문서의 역할은 계획의 확정이 아니라 결정의 추적입니다. 설계 문서가 구현과 다르면 둘 중 하나가 틀린 것이고, 불일치를 방치하면 안 됩니다.",
        },
        {
          title: "테스트 격리의 역설",
          description:
            "격리가 강할수록 단위 테스트는 빠르고 안정적이지만 실제 서비스 간 계약이 드러나지 않습니다. \"status\" vs \"job_run_status\" 버그가 이 역설의 사례입니다. 단위·통합 테스트 모두 통과했지만 실제 HTTP 호출 경로에 버그가 있었습니다. 이벤트 스키마는 공유 패키지(devops-messaging)로 관리해서 컴파일 타임에 드리프트를 차단했지만, HTTP 요청·응답 스키마는 같은 방식으로 관리하지 않았습니다. devops-contracts 같은 패키지에 InternalAnalyzeRequest를 공유했다면 필드명 불일치를 IDE에서 바로 잡을 수 있었을 것입니다.",
        },
        {
          title: "순서가 안전을 만든다",
          description:
            "DB 소유권 분리에서 가장 중요했던 것은 순서입니다. 코드 의존을 먼저 제거하고, DB URL을 나누고, alembic을 적용하는 순서를 지켰기 때문에 데이터 손실 없이 전환이 완료됐습니다. 마이그레이션의 중간 상태가 지저분하고 코드가 이중으로 복잡해 보여도, 안전 순서를 지키면 어느 시점에도 시스템이 동작하는 상태를 유지할 수 있습니다.",
        },
        {
          title: "MSA가 Celery + Redis보다 비동기 처리를 잘할 것이라는 기대는 틀렸다",
          description:
            "100 동시 사용자 기준 부하 테스트에서 Celery + Redis는 47.4 req/s·실패율 0.0%·중앙값 12ms였고, RabbitMQ 기반 MSA는 6.0 req/s·실패율 12.9%·중앙값 4,400ms였습니다. MSA는 publish → 네트워크 → consume → 실행 → publish → 네트워크 → consume → DB 쓰기로 이어지는 여러 hop이 있습니다. MSA 전환의 목적은 단일 인스턴스 처리량을 높이는 것이 아니라 각 서비스를 독립적으로 확장하고 장애 격리를 확보하는 것입니다. 이 이점들은 단일 인스턴스 부하 테스트 수치에 나타나지 않습니다.",
        },
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
          title: "MSA Phase 1 — 물리적 서비스 분리",
          description: "core-api·pipeline-execution-svc·ai-review-svc 분리, uv workspace, CI 서비스별 변경 감지",
          badge: "완료",
        },
        {
          title: "MSA Phase 2 — RabbitMQ 이벤트 루프",
          description: "topic exchange 기반 완전 비동기 이벤트 루프, DLQ·Manual Ack·멱등성 보장",
          badge: "완료",
        },
        {
          title: "MSA Phase 3 — DB 소유권 물리 분리",
          description: "Neon DB 3개 프로젝트, alembic 마이그레이션, REST 프록시 교체",
          badge: "완료",
        },
        {
          title: "서비스 간 인증 — X-Internal-User-Id 헤더 주입",
          description: "core-api JWT 검증 후 헤더 주입, sub-service UserRepository·TokenService 의존 제거 (ADR-018)",
          badge: "완료",
        },
        {
          title: "메시징 레이어·서비스 레이어 단위 테스트",
          description: "consumer ack/nack, publisher routing, event contract, 서비스 레이어 단위 테스트 — 통합 테스트 커버리지 70% 달성",
          badge: "완료",
        },
        {
          title: "Dead code 제거·버그 수정 4건",
          description: "054·055·056·057 버그 수정, MSA 전환 후 역할 없어진 코드 정리",
          badge: "완료",
        },
        {
          title: "부하 테스트 (rest_msa_100, ThreadPoolExecutor 수정)",
          description: "100 동시 사용자 기준 Celery·MSA 전략별 처리량·실패율 실측, ThreadPoolExecutor 포화 수정",
          badge: "완료",
        },
        {
          title: "클라우드 환경 부하 테스트 재측정",
          description: "로컬 Docker Desktop VM 오버헤드를 벗어나 MSA 구조를 감당할 수 있는 클라우드 환경에서 재진행",
          badge: "미해결",
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
        "클라우드 환경 부하 테스트 재측정 — 로컬 Docker Desktop VM 오버헤드 배제",
        "Celery 폴백 코드 제거 (RabbitMQ 경로 안정화 후)",
        "CI/CD 파이프라인 구축 (ADR-017 기준)",
        "REST vs gRPC 조회 프록시 비교 실험 (ADR-015 Track A/B)",
        "HTTP 계약 공유 패키지 도입 — devops-contracts에 InternalAnalyzeRequest 등 서비스 간 HTTP 스키마 공유",
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
