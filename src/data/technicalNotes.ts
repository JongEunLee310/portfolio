import type { TechnicalNoteCard } from "@/types/note";

export const technicalNotes: TechnicalNoteCard[] = [
  {
    slug: "db-round-trip-optimization",
    title: "DB Round-trip 최적화로 API 응답 시간 개선하기",
    summary:
      "불필요한 쿼리와 N+1 문제를 분석하고, 조회 최적화 및 캐싱 전략을 통해 응답 시간을 개선한 기록입니다.",
    category: "performance",
    thumbnail: "/images/notes/db-round-trip.svg",
    date: "2026.05.16",
    readingTime: "10분 읽기",
    featured: true,
    tags: [
      { name: "Database", category: "database" },
      { name: "Performance", category: "tool" },
      { name: "FastAPI", category: "backend" },
      { name: "SQLAlchemy", category: "backend" },
    ],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  },
  {
    slug: "async-pipeline-transition",
    title: "동기 파이프라인을 비동기 구조로 전환한 이유",
    summary:
      "HTTP 요청과 파이프라인 실행을 분리해 응답 시간과 커넥션 점유 문제를 개선한 과정입니다.",
    category: "architecture",
    thumbnail: "/images/notes/async-pipeline.svg",
    date: "2026.05.15",
    readingTime: "8분 읽기",
    tags: [
      { name: "FastAPI", category: "backend" },
      { name: "BackgroundTasks", category: "backend" },
      { name: "Celery", category: "messaging" },
      { name: "Redis", category: "database" },
    ],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  },
  {
    slug: "rabbitmq-event-topology",
    title: "RabbitMQ 기반 이벤트 메시징 토폴로지 설계",
    summary:
      "서비스 간 결합도를 낮추고 안정적인 이벤트 전달을 위한 Exchange, Queue, DLQ 설계를 정리합니다.",
    category: "messaging",
    thumbnail: "/images/notes/rabbitmq-topology.svg",
    date: "2026.05.18",
    readingTime: "12분 읽기",
    tags: [
      { name: "RabbitMQ", category: "messaging" },
      { name: "MSA", category: "infra" },
      { name: "Event Driven", category: "messaging" },
    ],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  },
  {
    slug: "ai-log-analysis-latency",
    title: "AI 로그 분석 지연을 줄이기 위한 전처리 전략",
    summary:
      "실패 로그 전체를 바로 추론하지 않고 단계별 요약과 에러 패턴 추출을 거쳐 분석 시간을 줄인 기록입니다.",
    category: "performance",
    thumbnail: "/images/notes/async-pipeline.svg",
    date: "2026.05.19",
    readingTime: "7분 읽기",
    tags: [
      { name: "OpenAI API", category: "ai" },
      { name: "Log Analysis", category: "observability" },
      { name: "FastAPI", category: "backend" },
    ],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  },
  {
    slug: "metric-cardinality-troubleshooting",
    title: "Prometheus 메트릭 고카디널리티 줄이기",
    summary:
      "실행 ID와 사용자 식별자를 metric label에서 제거하고 로그/DB 조회로 상세 추적을 분리한 과정입니다.",
    category: "observability",
    thumbnail: "/images/notes/db-round-trip.svg",
    date: "2026.05.20",
    readingTime: "8분 읽기",
    tags: [
      { name: "Prometheus", category: "observability" },
      { name: "Grafana", category: "observability" },
      { name: "Metrics", category: "tool" },
    ],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  },
  {
    slug: "ai-devops-retrospective",
    title: "AI DevOps 플랫폼을 만들며 배운 운영 경계 설계",
    summary:
      "파이프라인 실행, 로그 분석, 알림, 모니터링을 나누며 배운 책임 경계와 다음 개선 방향을 정리한 회고입니다.",
    category: "architecture",
    thumbnail: "/images/notes/rabbitmq-topology.svg",
    date: "2026.05.21",
    readingTime: "9분 읽기",
    tags: [
      { name: "DevOps", category: "devops" },
      { name: "Architecture", category: "infra" },
      { name: "Observability", category: "observability" },
    ],
    relatedProjectSlugs: ["ai-devops-orchestration-platform"],
  },
  {
    slug: "querydsl-projection-optimization",
    title: "QueryDSL Projection 활용으로 불필요한 조회 줄이기",
    summary:
      "엔티티 전체 조회 대신 필요한 필드만 조회해 메모리 사용량과 네트워크 비용을 줄인 사례입니다.",
    category: "database",
    thumbnail: "/images/notes/querydsl-projection.svg",
    date: "2025.07.17",
    readingTime: "6분 읽기",
    tags: [
      { name: "Spring Boot", category: "backend" },
      { name: "QueryDSL", category: "backend" },
      { name: "JPA", category: "backend" },
      { name: "MySQL", category: "database" },
    ],
    relatedProjectSlugs: ["halocare"],
  },
  {
    slug: "alb-cors-troubleshooting",
    title: "ALB + CORS 설정 트러블슈팅 기록",
    summary:
      "Cloudflare, ALB, Spring Boot 환경에서 발생한 CORS/OPTIONS 502 문제를 추적한 기록입니다.",
    category: "troubleshooting",
    thumbnail: "/images/notes/alb-cors.svg",
    date: "2025.06.29",
    readingTime: "9분 읽기",
    tags: [
      { name: "AWS", category: "infra" },
      { name: "ALB", category: "infra" },
      { name: "CORS", category: "backend" },
      { name: "Spring Boot", category: "backend" },
    ],
    relatedProjectSlugs: ["halocare"],
  },
];
