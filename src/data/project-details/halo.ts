import { publicPath } from "@/utils/publicPath";
import type { ProjectDetail } from "@/types/project";
import { halo } from "../projects/halo";

export const haloDetail: ProjectDetail = {
  ...halo,
  heroImage: publicPath("/images/projects/halo/hero.svg"),
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
      image: publicPath("/images/projects/halo/reservation-list.svg"),
      description: "고객 예약 목록 (상태 배지, 매니저 정보, 서비스 카테고리)",
    },
    {
      title: "정산 관리",
      image: publicPath("/images/projects/halo/settlement-dashboard.svg"),
      description: "주간 자동 정산 결과 및 관리자 수동 실행 화면",
    },
    {
      title: "Prometheus 메트릭",
      image: publicPath("/images/projects/halo/prometheus.svg"),
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
};
