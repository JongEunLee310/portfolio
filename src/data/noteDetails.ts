import { TROUBLESHOOTING_NOTE_TEMPLATE } from "@/constants/noteDetail";
import type { TechnicalNoteDetail } from "@/types/note";
import { technicalNotes } from "./technicalNotes";

function findNote(slug: string) {
  const note = technicalNotes.find((item) => item.slug === slug);

  if (!note) {
    throw new Error(`technicalNotes.ts에 존재하지 않는 기술 노트 slug입니다: ${slug}`);
  }

  return note;
}

const troubleshootingToc: TechnicalNoteDetail["toc"] =
  TROUBLESHOOTING_NOTE_TEMPLATE.sections.map((section) => ({
    id: section.id,
    title: section.tocTitle,
    depth: 1,
  }));

function troubleshootingHeading(sectionIndex: number) {
  const section = TROUBLESHOOTING_NOTE_TEMPLATE.sections[sectionIndex];

  if (!section) {
    throw new Error(`트러블슈팅 템플릿 섹션 인덱스가 잘못되었습니다: ${sectionIndex}`);
  }

  return {
    type: "heading",
    id: section.id,
    title: section.headingTitle,
  } as const;
}

export const noteDetails: TechnicalNoteDetail[] = [
  {
    ...findNote("db-round-trip-optimization"),
    template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
    toc: troubleshootingToc,
    content: [
      troubleshootingHeading(0),
      {
        type: "paragraph",
        content:
          "특정 API에서 주문 상세 정보와 함께 고객, 상품, 결제, 배송 정보를 조합하는 과정에서 응답 시간이 간헐적으로 1초 이상 소요되었습니다. 로그를 확인해보니 하나의 요청을 처리하는 동안 여러 번의 DB 조회가 순차적으로 발생하고 있었습니다.",
      },
      {
        type: "callout",
        variant: "info",
        content:
          "사용자 경험에 영향을 주는 지연을 줄이기 위해 쿼리 수와 DB 접근 패턴을 먼저 관찰하고, 조회 책임을 명확히 분리했습니다.",
      },
      troubleshootingHeading(1),
      {
        type: "list",
        items: [
          "하나의 API 호출에서 12회의 DB Round-trip이 발생했습니다.",
          "N+1 쿼리 문제로 연관 엔티티 조회가 반복되었습니다.",
          "연관 데이터 조회 시 Lazy Loading 사용으로 추가 쿼리가 발생했습니다.",
          "목록 화면에 필요한 필드보다 많은 데이터를 엔티티 단위로 조회했습니다.",
        ],
      },
      {
        type: "code",
        language: "sql",
        filename: "query-log-before.sql",
        code: "GET /api/orders/123\n[SELECT] orders      ... (1.2 ms)\n[SELECT] customer    ... (1.1 ms)\n[SELECT] order_items ... (1.6 ms)\n[SELECT] product     ... (18.7 ms)\n[SELECT] payments    ... (2.3 ms)\n[SELECT] shipments   ... (2.1 ms)\n\nTotal: 12 queries / 142.3 ms DB time",
      },
      troubleshootingHeading(2),
      {
        type: "cards",
        items: [
          {
            title: "3.1 쿼리 통합 및 Fetch Join",
            description:
              "연관 엔티티를 한 번에 조회해 N+1 문제를 제거했습니다.",
            badge: "JOIN FETCH",
          },
          {
            title: "3.2 DTO Projection",
            description:
              "화면에 필요한 필드만 조회해 불필요한 엔티티 로딩을 줄였습니다.",
            badge: "SELECT NEW",
          },
          {
            title: "3.3 IN 쿼리 배치 처리",
            description:
              "다건 조회 시 반복 쿼리를 배치 조회로 묶어 Round-trip을 줄였습니다.",
            badge: "IN BATCH",
          },
          {
            title: "3.4 캐시 적용",
            description:
              "변경 빈도가 낮은 참조 데이터는 Redis 캐시를 통해 조회했습니다.",
            badge: "CACHE",
          },
        ],
      },
      {
        type: "callout",
        variant: "success",
        content:
          "성능 개선은 코드를 빠르게 만드는 일이 아니라, 불필요한 일을 하지 않도록 조회 흐름을 다시 설계하는 일에 가깝습니다.",
      },
      troubleshootingHeading(3),
      {
        type: "comparison",
        items: [
          {
            title: "개선 전 구조",
            description:
              "API 요청이 서비스 계층을 거치며 연관 엔티티를 순차적으로 조회했습니다.",
            bullets: [
              "다수의 SELECT 발생",
              "불필요한 반복 조회",
              "조회 흐름이 화면 요구사항과 분리되지 않음",
            ],
          },
          {
            title: "개선 후 구조",
            description:
              "상세 화면에 필요한 데이터를 전용 조회 모델로 모아 한 번에 가져오도록 변경했습니다.",
            bullets: [
              "1회의 쿼리로 필요한 데이터 조회",
              "캐시를 활용해 반복 조회 제거",
              "조회 책임을 명확히 분리",
            ],
          },
          {
            title: "주요 SQL 예시",
            description:
              "DTO Projection과 명시적인 join으로 필요한 필드만 조회합니다.",
            bullets: ["화면 필드 중심 조회", "연관 정보 명시적 결합"],
            code: {
              language: "sql",
              filename: "optimized-query.sql",
              code: "SELECT new com.example.dto.OrderDetailDto(\n  o.id,\n  o.orderNumber,\n  c.name,\n  p.name,\n  oi.quantity,\n  pay.method,\n  pay.paidAt,\n  ship.trackingNumber,\n  ship.status\n)\nFROM Order o\nJOIN FETCH o.customer c\nJOIN FETCH o.orderItems oi\nJOIN FETCH oi.product p\nLEFT JOIN FETCH o.payment pay\nLEFT JOIN FETCH o.shipment ship\nWHERE o.id = :orderId",
            },
          },
        ],
      },
      troubleshootingHeading(4),
      {
        type: "metrics",
        items: [
          {
            label: "DB Round-trip",
            before: "12회",
            after: "1회",
            change: "-91.7%",
          },
          {
            label: "응답 시간",
            before: "1,024ms",
            after: "326ms",
            change: "-68.2%",
          },
          {
            label: "DB 시간",
            before: "142ms",
            after: "28ms",
            change: "-80.3%",
          },
        ],
      },
      troubleshootingHeading(5),
      {
        type: "cards",
        items: [
          {
            title: "사용자 경험 개선",
            description:
              "상세 화면 진입 시간이 1,850ms에서 340ms 수준으로 줄었습니다.",
          },
          {
            title: "서버 자원 절감",
            description:
              "CPU 사용률과 DB 연결 점유 시간이 함께 감소했습니다.",
          },
          {
            title: "DB 부하 감소",
            description:
              "반복 조회를 제거해 조회 쿼리 수와 인덱스 스캔량을 줄였습니다.",
          },
        ],
      },
      troubleshootingHeading(6),
      {
        type: "callout",
        variant: "warning",
        content:
          "ORM을 사용할 때도 SQL이 어떻게 실행되는지 항상 확인해야 합니다. 데이터 접근 패턴을 이해하고, 화면 요구사항에 맞는 조회 모델을 설계하는 과정이 성능 개선의 출발점이었습니다.",
      },
    ],
    relatedNoteSlugs: ["async-pipeline-transition"],
  },
  {
    ...findNote("async-pipeline-transition"),
    template: "technical-summary",
    toc: [
      { id: "problem", title: "동기 실행의 한계", depth: 1 },
      { id: "boundary", title: "실행 경계 분리", depth: 1 },
      { id: "result", title: "개선 결과", depth: 1 },
    ],
    content: [
      {
        type: "heading",
        id: "problem",
        title: "1. 동기 실행의 한계",
      },
      {
        type: "paragraph",
        content:
          "파이프라인 실행 요청이 Git clone, Job 실행, 로그 저장까지 기다리면서 API 응답 시간이 길어지고 커넥션 점유 시간이 늘어났습니다.",
      },
      {
        type: "heading",
        id: "boundary",
        title: "2. 실행 경계 분리",
      },
      {
        type: "list",
        items: [
          "요청 시점에는 PipelineRun을 QUEUED 상태로 생성했습니다.",
          "실제 실행은 워커가 가져가도록 분리했습니다.",
          "사용자는 실행 상태 조회 API로 진행 상황을 확인하도록 구성했습니다.",
        ],
      },
      {
        type: "callout",
        variant: "success",
        content:
          "사용자 요청 흐름과 실행 흐름을 분리하면 응답 시간뿐 아니라 장애 원인 추적도 단순해집니다.",
      },
      {
        type: "heading",
        id: "result",
        title: "3. 개선 결과",
      },
      {
        type: "paragraph",
        content:
          "실행 완료를 기다리지 않고 접수 즉시 응답하는 구조가 되었고, 실패 로그는 JobRunLog 기준으로 독립 추적할 수 있게 되었습니다.",
      },
    ],
    relatedNoteSlugs: ["db-round-trip-optimization", "rabbitmq-event-topology"],
  },
  {
    ...findNote("rabbitmq-event-topology"),
    template: "technical-summary",
    toc: [
      { id: "problem", title: "이벤트 손실 위험", depth: 1 },
      { id: "topology", title: "토폴로지 설계", depth: 1 },
      { id: "operation", title: "운영 기준", depth: 1 },
    ],
    content: [
      {
        type: "heading",
        id: "problem",
        title: "1. 이벤트 손실 위험",
      },
      {
        type: "paragraph",
        content:
          "워커 장애나 일시적인 외부 API 실패가 발생하면 배포 이벤트와 알림 이벤트가 처리되지 않은 채 사라질 수 있었습니다.",
      },
      {
        type: "heading",
        id: "topology",
        title: "2. 토폴로지 설계",
      },
      {
        type: "list",
        items: [
          "도메인 이벤트별 Exchange를 분리했습니다.",
          "실패 이벤트는 DLQ로 이동하도록 구성했습니다.",
          "재처리 가능한 이벤트와 즉시 실패 처리할 이벤트를 구분했습니다.",
        ],
      },
      {
        type: "heading",
        id: "operation",
        title: "3. 운영 기준",
      },
      {
        type: "callout",
        variant: "info",
        content:
          "메시징 구조는 코드보다 운영 기준이 중요합니다. 어떤 실패를 재시도하고 어떤 실패를 알림으로 보낼지 먼저 정해야 합니다.",
      },
    ],
    relatedNoteSlugs: ["async-pipeline-transition"],
  },
  {
    ...findNote("ai-log-analysis-latency"),
    template: "troubleshooting",
    toc: [
      { id: "problem", title: "추론 지연 원인", depth: 1 },
      { id: "preprocess", title: "전처리 전략", depth: 1 },
      { id: "lesson", title: "배운 점", depth: 1 },
    ],
    content: [
      {
        type: "heading",
        id: "problem",
        title: "1. 추론 지연 원인",
      },
      {
        type: "paragraph",
        content:
          "실패 로그 전체를 그대로 AI 분석 입력으로 전달하면 토큰 수가 증가하고, 원인 후보를 추출하기까지 시간이 길어졌습니다.",
      },
      {
        type: "heading",
        id: "preprocess",
        title: "2. 전처리 전략",
      },
      {
        type: "list",
        items: [
          "Job 단계별 로그를 먼저 요약했습니다.",
          "에러 레벨과 stack trace 주변 로그만 추출했습니다.",
          "반복되는 로그 라인은 fingerprint 기준으로 묶었습니다.",
        ],
      },
      {
        type: "heading",
        id: "lesson",
        title: "3. 배운 점",
      },
      {
        type: "paragraph",
        content:
          "AI 기능은 모델 호출 이전에 어떤 맥락을 남기고 어떤 노이즈를 제거할지 정하는 과정이 품질과 비용을 크게 좌우합니다.",
      },
    ],
    relatedNoteSlugs: ["async-pipeline-transition"],
  },
  {
    ...findNote("metric-cardinality-troubleshooting"),
    template: "troubleshooting",
    toc: [
      { id: "problem", title: "고카디널리티 문제", depth: 1 },
      { id: "solution", title: "라벨 기준 재설계", depth: 1 },
      { id: "result", title: "운영 결과", depth: 1 },
    ],
    content: [
      {
        type: "heading",
        id: "problem",
        title: "1. 고카디널리티 문제",
      },
      {
        type: "paragraph",
        content:
          "PipelineRun ID처럼 매번 달라지는 값을 Prometheus label에 포함하면서 시계열 수가 빠르게 증가했습니다.",
      },
      {
        type: "heading",
        id: "solution",
        title: "2. 라벨 기준 재설계",
      },
      {
        type: "list",
        items: [
          "metric label은 service, status, step처럼 반복 가능한 값으로 제한했습니다.",
          "실행 단위 상세 추적은 로그와 DB 조회로 분리했습니다.",
          "대시보드는 집계 지표 중심으로 재구성했습니다.",
        ],
      },
      {
        type: "heading",
        id: "result",
        title: "3. 운영 결과",
      },
      {
        type: "callout",
        variant: "success",
        content:
          "관측 비용을 줄이면서도 장애 탐지에 필요한 핵심 지표는 유지할 수 있었습니다.",
      },
    ],
    relatedNoteSlugs: ["db-round-trip-optimization"],
  },
  {
    ...findNote("ai-devops-retrospective"),
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
          "AI Agent Pipeline Backend Design은 파이프라인 실행, 로그 수집, 실패 원인 분석을 하나의 백엔드 흐름으로 연결하고 AI Agent를 어느 경계에 붙일 수 있는지 실험한 프로젝트입니다.",
      },
      {
        type: "heading",
        id: "role",
        title: "2. 내가 맡은 역할",
      },
      {
        type: "list",
        items: [
          "파이프라인 실행 요청과 실제 실행 흐름을 분리했습니다.",
          "실패 로그 수집과 AI 분석 요청 경계를 설계했습니다.",
          "알림, 모니터링, 재처리 기준을 운영 흐름에 맞춰 정리했습니다.",
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
          "실행과 분석의 책임을 분리해 장애 원인 추적을 단순하게 만들었습니다.",
          "모니터링 지표를 화면 장식이 아니라 개선 대상을 찾는 기준으로 사용했습니다.",
          "AI 분석 입력을 정리하는 과정을 별도 책임으로 보고 품질과 비용을 함께 고려했습니다.",
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
          "초기에는 실행 로그와 분석 결과의 책임 경계가 충분히 분리되지 않아, 실패 원인을 재현할 때 필요한 데이터를 다시 찾아야 하는 경우가 있었습니다.",
      },
      {
        type: "heading",
        id: "learned",
        title: "5. 배운 점",
      },
      {
        type: "list",
        items: [
          "실행과 분석의 책임을 분리하면 장애 원인을 추적하기 쉬워집니다.",
          "모니터링은 시각화보다 개선 대상을 찾는 기준을 제공할 때 가치가 커집니다.",
          "AI 기능은 모델 호출보다 입력 맥락을 어떻게 정리할지가 품질을 좌우합니다.",
        ],
      },
      {
        type: "heading",
        id: "improvement",
        title: "6. 다음 개선 방향",
      },
      {
        type: "callout",
        variant: "info",
        content:
          "다음 단계에서는 Kubernetes 기반 Executor와 LLM Review 품질 평가 지표를 추가해 운영 자동화의 신뢰도를 더 높일 계획입니다.",
      },
    ],
    relatedNoteSlugs: [
      "async-pipeline-transition",
      "rabbitmq-event-topology",
      "metric-cardinality-troubleshooting",
    ],
  },
];
