import type { TechnicalNoteDetail } from "@/types/note";
import { dbRoundTripOptimization } from "../notes/db-round-trip-optimization";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const dbRoundTripOptimizationDetail: TechnicalNoteDetail = {
  ...dbRoundTripOptimization,
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
};
