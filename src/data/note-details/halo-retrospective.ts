import type { TechnicalNoteDetail } from "@/types/note";
import { haloRetrospective } from "../notes/halo-retrospective";

export const haloRetrospectiveDetail: TechnicalNoteDetail = {
  ...haloRetrospective,
  template: "retrospective",
  toc: [
    { id: "overview", title: "개요", depth: 1 },
    { id: "phase1", title: "Phase 1 · 인증 구조 설계", depth: 1 },
    { id: "phase2", title: "Phase 2 · 조회 최적화·동시성 처리", depth: 1 },
    { id: "phase3", title: "Phase 3 · 멀티모듈 전환", depth: 1 },
    { id: "defects", title: "발견하고 수정한 설계 결함", depth: 1 },
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
        "청소 서비스 매칭 플랫폼 HALO를 4인 팀으로 개발하면서 겪은 설계 결정과 기술적 난관을 정리한 회고입니다. 출발점은 api, common 2모듈 구조에 패키지로 도메인을 구분한 Monolithic이었습니다.",
    },
    {
      type: "paragraph",
      content:
        "기능이 붙을수록 Repository가 여러 도메인을 가로지르는 join으로 채워지고, 통계 갱신 로직에 동시성 보장이 없었으며, JWT 필터 설계 미비로 재발급 무한 루프가 발생했습니다. 이 세 가지 문제를 해결하는 과정이 이 회고의 핵심입니다.",
    },
    {
      type: "list",
      items: [
        "Phase 1 — Spring Security FilterChain 역할별 분리, JWT 재발급 구조 설계",
        "Phase 2 — QueryDSL 조회 최적화, 통계 동시성 처리, 주간 정산 멱등성 설계",
        "Phase 3 — common 단일 모듈에서 8개 도메인 모듈로 전환, Gradle 경계 강제",
      ],
    },
    {
      type: "heading",
      id: "phase1",
      title: "Phase 1 · JWT + OAuth2 인증 구조 설계",
    },
    {
      type: "paragraph",
      content:
        "Spring Security FilterChain을 역할별로 분리했습니다. 고객·매니저·관리자가 각각 독립된 FilterChain(CustomerSecurityConfig, ManagerSecurityConfig, AdminSecurityConfig)을 가지도록 구성하고, Access Token(Authorization Header) + Refresh Token(HttpOnly Cookie) 이중 토큰 구조를 설계했습니다. Google OAuth2 소셜 로그인을 연동했으며, Access Token 재발급 API의 무한 루프 문제를 해결했습니다.",
    },
    {
      type: "paragraph",
      content: "고민했던 것",
    },
    {
      type: "comparison",
      items: [
        {
          title: "역할별 FilterChain 분리",
          description:
            "단일 FilterChain 방식은 설정이 단순하지만, 역할별로 인증 흐름이 다를 때 설정 파일이 커지면서 다루기 어려워집니다. 역할별 FilterChain을 분리하면 변경이 필요할 때 다른 역할의 보안 설정에 영향을 주지 않습니다.",
          bullets: [
            "단일 FilterChain: requestMatcher + .hasRole() — 설정 단순, 역할이 섞일수록 복잡",
            "역할별 분리: CustomerSecurityConfig 등 각각 독립 — 이 결정이 나중에 재발급 문제 분석의 핵심 단서",
          ],
        },
        {
          title: "Refresh Token 저장소 선택",
          description:
            "localStorage는 XSS에 노출됩니다. HttpOnly Cookie는 JavaScript 접근이 차단되고 SameSite 설정으로 CSRF를 제한할 수 있습니다. Refresh Token은 유효 기간이 길어 탈취 시 피해가 크기 때문에 HttpOnly Cookie를 선택했습니다.",
          bullets: [
            "localStorage: JavaScript 접근 가능 — XSS 시 Refresh Token 탈취",
            "HttpOnly Cookie: JavaScript 접근 차단 — 이 선택이 나중에 다중 환경 토큰 충돌 문제를 드러냄",
          ],
        },
        {
          title: "permitAll()과 JWT 필터 제외 분리",
          description:
            "permitAll()은 인가(authorization) 단계에서 동작하고, JWT 커스텀 필터는 그 이전 단계에서 실행됩니다. permitAll() 설정과 관계없이 JWT 필터가 먼저 토큰을 검사하고 401을 반환할 수 있어 두 목록을 별도로 관리해야 합니다.",
          bullets: [
            "PUBLIC_URLS: 인가 단계 permitAll() 목록",
            "JWT_FILTER_EXCLUDE_URLS: 필터 단계 제외 목록 — 두 레이어가 다르므로 반드시 분리 관리",
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
        "Access Token 재발급 무한 루프: /api/reissue는 Access Token이 만료된 상태에서 호출되는 API인데, JWT 필터가 이 요청의 만료된 토큰을 검사하고 401을 반환했습니다. 클라이언트는 401을 받으면 재발급을 시도하지만 재발급 요청도 같은 이유로 401을 받는 순환이 발생했습니다.",
    },
    {
      type: "list",
      items: [
        "/api/reissue가 역할별 FilterChain에서 permitAll() 목록에만 있었고 JWT_FILTER_EXCLUDE_URLS에 없었습니다.",
        "공통 API여서 어떤 역할별 FilterChain이 처리하는지 명확하지 않은 상태였습니다.",
        "/api/reissue를 PUBLIC_URLS와 JWT_FILTER_EXCLUDE_URLS 양쪽에 추가하고 모든 역할별 FilterChain에서 통일하여 해결했습니다.",
      ],
    },
    {
      type: "heading",
      id: "phase2",
      title: "Phase 2 · QueryDSL 조회 최적화와 통계 동시성 처리",
    },
    {
      type: "paragraph",
      content:
        "목록 조회 API 전 모듈에서 QueryDSL Projections.fields()로 DTO를 직접 반환하는 방식을 적용했습니다. Repository → Info 중간 객체 → Service → RspDTO.fromInfo() 계층 구조를 설계해 조회 책임을 분리했습니다. 통계 갱신에 @Version 낙관적 락을 도입하고 @Retryable/@Recover로 재시도와 실패 응답을 처리했습니다. 주간 정산을 Spring Scheduler로 자동화하면서 멱등성을 보장하는 LEFT JOIN EXCLUSION 쿼리를 작성했습니다.",
    },
    {
      type: "paragraph",
      content: "고민했던 것",
    },
    {
      type: "comparison",
      items: [
        {
          title: "N+1 사후 해결 vs 설계 단계 방지",
          description:
            "JPA 엔티티를 반환하고 나중에 fetchJoin이나 @EntityGraph로 N+1을 보완하는 방식은 처음에는 빠르지만, 연관 엔티티가 5개 이상일 때 어느 필드가 지연 로딩을 트리거하는지 추적하기 어렵습니다. Projections.fields()는 JPA 영속성 컨텍스트가 엔티티를 관리하지 않아 지연 로딩 자체가 트리거되지 않습니다.",
          bullets: [
            "엔티티 반환 + fetchJoin: 초기 구현 빠름, N+1 뒤늦게 발견",
            "Projections.fields(): 목록 크기 관계없이 쿼리 수 SELECT+COUNT로 고정 — 전 모듈에서 일관된 패턴 유지",
          ],
        },
        {
          title: "Repository가 RspDTO를 반환하면 무엇이 문제인가",
          description:
            "Repository에서 바로 RspDTO를 반환하면 HTTP 응답 형식이 Repository 레이어에 흘러 들어옵니다. API 응답 필드 하나가 바뀌면 Repository 코드를 수정해야 하고, 단위 테스트에서 Repository가 특정 DTO 형식에 결합됩니다.",
          bullets: [
            "Repository → RspDTO 직접: 레이어 간 결합, API 변경 시 Repository 수정 필요",
            "Repository → Info → Service → RspDTO.fromInfo(): API 응답 필드가 바뀌면 RspDTO와 fromInfo()만 수정, Repository 불변",
          ],
        },
        {
          title: "비관적 락 vs 낙관적 락",
          description:
            "비관적 락(SELECT FOR UPDATE)은 충돌이 잦은 환경에서 일관성을 확실히 보장하지만 대기가 발생합니다. 통계 갱신 충돌이 얼마나 자주 발생할지 미리 알기 어려운 상황에서 낙관적 락을 선택했습니다.",
          bullets: [
            "비관적 락: 충돌 시 다른 트랜잭션 대기 — 충돌이 드문 환경에서 불필요한 비용",
            "@Version 낙관적 락 + @Retryable(maxAttempts=5): 충돌 없을 때 락 없이 진행, 충돌 시만 재시도",
          ],
        },
        {
          title: "주간 정산 멱등성",
          description:
            "정산 중복은 매니저에게 이중으로 돈을 지급하는 결과를 낳습니다. 조회 단계에서 이미 Settlement가 연결된 예약을 LEFT JOIN EXCLUSION으로 제외하면 같은 날짜 범위를 재실행해도 신규 Settlement가 생성되지 않습니다.",
          bullets: [
            "잠금 기반 중복 방지: 구현 복잡, 잠금 해제 후 재시도 가능성",
            "LEFT JOIN EXCLUSION: 조회 단계에서 이미 처리된 건 제거 — 스케줄러 자동 실행과 관리자 수동 실행 모두 동일하게 보장",
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
        "@Retryable이 같은 클래스 내부 호출(this.method())에서 동작하지 않았습니다. Spring AOP 프록시를 통해 동작하는 @Retryable은 내부 호출 시 프록시를 거치지 않아 재시도가 일어나지 않습니다. @Transactional도 같은 이유로 내부 호출에서 작동하지 않는 Spring AOP의 핵심 특성입니다.",
    },
    {
      type: "list",
      items: [
        "통계 갱신 로직을 기존 서비스 안에 두고 @Retryable을 붙였을 때 충돌이 발생해도 재시도가 일어나지 않았습니다.",
        "통계 갱신을 별도 서비스(MemberStatisticUpdateService)로 분리 후 프록시를 통해 호출되어 정상 동작했습니다.",
        "벌크 업데이트 방식에서 엔티티 변경 방식으로 전환하는 과정에서 기존 벌크 업데이트 호출이 일부 코드에 남아 @Version 충돌 감지가 작동하지 않았습니다. 코드 전체를 추적해서 엔티티 기반 방식으로 일원화했습니다.",
      ],
    },
    {
      type: "heading",
      id: "phase3",
      title: "Phase 3 · 멀티모듈 전환",
    },
    {
      type: "paragraph",
      content:
        "common 중심 단일 모듈 구조를 admin, evaluation, global, inquiry, member, payment, reservation, shared-domain 8개 도메인 모듈로 분리했습니다. Gradle 의존성으로 모듈 간 경계를 강제했습니다. evaluation과 payment가 reservation을 직접 의존하는 구조를 shared-domain의 ReservationQueryPort 인터페이스로 교체해 순환 참조를 제거했습니다.",
    },
    {
      type: "paragraph",
      content: "고민했던 것",
    },
    {
      type: "comparison",
      items: [
        {
          title: "역할 기준 모듈 vs 도메인 책임 기준 모듈",
          description:
            "역할 기준(customer, manager, admin)으로 모듈을 나누면 화면 기능을 묶기는 쉽지만, 핵심 도메인 로직이 역할별로 중복될 위험이 있습니다. 매니저 예약 조회와 고객 예약 조회가 다른 모듈에 중복 구현되면 예약 상태 전이 로직이 바뀔 때 두 곳을 수정해야 합니다.",
          bullets: [
            "역할 기준: 화면 기능 묶기 쉬움, 핵심 도메인 로직 중복 위험",
            "도메인 기준: reservation이 예약 생성·상태 전이·매칭 소유 — 변경 영향이 모듈 단위로 제한",
          ],
        },
        {
          title: "shared-domain 범위 제한",
          description:
            "evaluation과 payment는 예약 데이터가 필요합니다. reservation을 직접 의존하면 구현이 빠르지만 순환 참조 위험이 있고 내부 구현이 사용 모듈로 전파됩니다. Port 인터페이스 방식은 reservation 내부 쿼리가 바뀌어도 evaluation이나 payment 코드를 수정하지 않아도 됩니다.",
          bullets: [
            "reservation 직접 의존: 구현 빠름, 순환 참조 위험, 내부 구현 전파",
            "shared-domain ReservationQueryPort: 여러 bounded context에서 공유하는 타입과 계약만 추가 — Spring DI가 런타임에 구현체 주입",
          ],
        },
        {
          title: "멀티모듈 전환 시점",
          description:
            "처음부터 멀티모듈로 시작하면 모듈 경계를 잘못 설정했을 때 전환 비용이 오히려 더 커집니다. 도메인 책임은 기능을 어느 정도 구현해봐야 명확해집니다. common 구조로 기능을 빠르게 붙이고 변경 영향이 퍼지는 시점에 전환한 것이 실제 경험에서는 맞는 판단이었습니다.",
          bullets: [
            "처음부터 멀티모듈: 경계 잘못 설정 시 전환 비용 더 큼",
            "기능 안정화 후 전환: 전환 비용 있지만 잘못 그은 경계를 나중에 수정하는 비용보다 낮음",
          ],
        },
      ],
    },
    {
      type: "paragraph",
      content: "어려웠던 점",
    },
    {
      type: "list",
      items: [
        "Gradle 의존성 설정만으로는 Port 인터페이스를 통해야 한다는 규칙을 강제할 수 없습니다. Port 없이 shared-domain 클래스를 직접 참조해도 빌드는 통과합니다. 이 부분은 팀 규약으로 유지해야 했습니다.",
        "멀티모듈 전환 후 인프라 구성 변경 과정에서 ALB와 Spring Security에 각각 CORS 설정이 있어 Preflight 요청이 실패했습니다. ALB CORS 설정을 제거하고 Spring Security 단일 레이어에서 처리하는 방식으로 통일하여 해결했습니다.",
      ],
    },
    {
      type: "heading",
      id: "defects",
      title: "발견하고 수정한 설계 결함",
    },
    {
      type: "paragraph",
      content:
        "기능 테스트에서는 통과하지만 특정 경로나 조건에서만 드러나는 설계 결함들입니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "다중 환경 토큰 충돌",
          description:
            "고객과 매니저가 같은 브라우저에서 동시에 로그인하면 단일 이름 refreshToken을 가진 Cookie가 덮입니다. 고객으로 로그인한 뒤 매니저로 로그인하면 고객 Refresh Token이 교체되어 고객 세션이 예고 없이 해제됩니다. 권한별 Cookie 이름 분리(customerRefreshToken, managerRefreshToken) 설계안을 도출했지만 프로젝트 마감으로 적용하지 못했습니다.",
          badge: "미해결",
        },
        {
          title: "파일 업로드와 삭제 API 분리",
          description:
            "초기에는 파일 업로드와 삭제가 단일 엔드포인트로 연결된 구조였습니다. 업로드 실패 시 임시 파일이 S3에 남는 문제와 삭제 권한 검증 누락 문제를 API를 분리하면서 각 경로에서 독립적으로 처리하도록 수정했습니다. Presigned URL 방식으로 S3 업로드를 클라이언트에 위임하고 도메인 API의 S3 의존성을 제거했습니다.",
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
          title: "모듈을 나누는 것과 경계를 지키는 것은 다르다",
          description:
            "8모듈로 분리했지만 Gradle 의존성 설정만으로는 충분하지 않습니다. Port 인터페이스를 통하지 않고 shared-domain 클래스를 직접 참조해도 빌드는 통과합니다. 반대로, Gradle 의존성이 허용되지 않은 모듈의 클래스를 컴파일 단계에서 차단하는 것만으로도 큰 가치가 있습니다. common 구조에서는 코드 리뷰로만 확인하던 결합이 멀티모듈에서는 컴파일 오류로 드러납니다.",
        },
        {
          title: "설계 결정의 맥락을 기록하는 이유",
          description:
            "ADR을 6개, 실패 결정을 6개 작성했습니다. 코드는 결과를 보여주지만 왜 그 결과를 선택했는지는 보여주지 않습니다. \"낙관적 락 대신 비관적 락을 쓰면 안 되나요?\"라는 질문에 코드만 보여주면 @Version이 있다는 것만 알 수 있습니다. ADR-002에 왜 낙관적 락을 선택했는지, 어떤 트레이드오프가 있는지를 기록해두면 결정의 맥락을 이해할 수 있습니다.",
        },
        {
          title: "구현이 설계를 앞서는 순간을 인식해야 한다",
          description:
            "@Retryable 문제가 대표적입니다. \"AOP 프록시를 통해 동작한다\"는 것을 알고 있었지만, 설계할 때 그 제약을 실제로 적용하지 않았습니다. 코드를 작성하고 동작을 확인했을 때 비로소 통계 갱신 서비스를 분리했습니다. 설계 단계에서 \"이 기술이 어떤 조건에서 동작하지 않는가\"를 의식적으로 확인하는 습관이 필요합니다.",
        },
        {
          title: "해결하지 못한 것도 기록에 남긴다",
          description:
            "다중 환경 토큰 충돌 문제는 마감까지 해결하지 못했습니다. 처음에는 미해결 항목을 회고에 넣는 것이 어색했지만, 문제가 있다는 것을 모르는 것과 문제를 알지만 우선순위상 미뤘다는 것은 다릅니다. \"해결하지 못한 이유\"와 \"어떤 방향으로 해결할 수 있는지\"를 기록하는 것은 다음 단계의 자신에게 유효한 정보입니다.",
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
          title: "JWT + OAuth2 인증 구조",
          description: "역할별 FilterChain 분리, 이중 토큰 구조, Google OAuth2 소셜 로그인",
          badge: "완료",
        },
        {
          title: "Access Token 재발급 무한 루프 해결",
          description: "permitAll()과 JWT 필터 제외 분리, 전 FilterChain 통일 처리",
          badge: "완료",
        },
        {
          title: "QueryDSL Projections.fields() 전 모듈 적용",
          description: "Repository → Info → Service → RspDTO 계층, N+1 구조적 방지",
          badge: "완료",
        },
        {
          title: "통계 낙관적 락 + @Retryable/@Recover",
          description: "MemberStatisticUpdateService 분리, 최대 5회 재시도, 초과 시 동시성 오류 응답",
          badge: "완료",
        },
        {
          title: "주간 정산 멱등성",
          description: "LEFT JOIN EXCLUSION으로 이미 정산된 예약 조회 제외, 이중 지급 방지",
          badge: "완료",
        },
        {
          title: "common → 8 도메인 모듈 전환",
          description: "Gradle 의존성 경계 강제, ReservationQueryPort 순환 참조 제거, ALB CORS 충돌 해결",
          badge: "완료",
        },
        {
          title: "ADR 6개 + 실패 결정 6개 + 트러블슈팅 11개",
          description: "설계 결정의 맥락과 채택하지 않은 접근을 문서로 보존",
          badge: "완료",
        },
        {
          title: "다중 환경 토큰 충돌",
          description: "권한별 Cookie 이름 분리(customerRefreshToken, managerRefreshToken) 설계안 보존, 코드 미적용",
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
        "권한별 secure cookie 분리로 다중 환경 로그인 토큰 충돌 해소",
        "ReservationQueryPort를 사용 목적별(리뷰 검증·매니저 정산·관리자 정산)로 분리해 각 모듈의 의존 범위 최소화",
        "evaluation → member 직접 통계 접근을 MemberStatisticPort로 추상화",
        "통계 동시성 부하 테스트 추가 — @Retryable 재시도 성공률 실측",
        "S3 Lifecycle 규칙으로 TEMP 상태 파일 자동 만료 처리",
      ],
    },
  ],
  relatedNoteSlugs: [
    "domain-module-boundary-from-monolith",
    "multi-module-shared-domain-port-pattern",
    "n-plus-one-prevention-querydsl-projection",
    "querydsl-info-layer-data-flow",
    "statistic-concurrency-optimistic-lock",
    "weekly-settlement-scheduler-idempotency",
    "reissue-infinite-request",
    "alb-cors-troubleshooting",
    "multi-environment-login-token-overwrite",
    "file-upload-delete-api-separation",
  ],
};
