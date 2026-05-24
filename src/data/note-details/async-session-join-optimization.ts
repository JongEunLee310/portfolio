import type { TechnicalNoteDetail } from "@/types/note";
import { asyncSessionJoinOptimization } from "../notes/async-session-join-optimization";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const asyncSessionJoinOptimizationDetail: TechnicalNoteDetail = {
  ...asyncSessionJoinOptimization,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "GET /projects 엔드포인트가 부하 없는 환경에서도 923ms까지 측정됐습니다. 독립적인 두 쿼리를 asyncio.gather로 동시 실행하려 했으나 AsyncSession 세션 상태 머신 충돌로 500 에러가 발생했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "SQLAlchemy AsyncSession은 단일 커넥션을 사용해 동시 접근을 지원하지 않습니다. asyncio.gather가 아닌 JOIN으로 round-trip 자체를 줄여야 합니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "독립적인 두 쿼리(COUNT / SELECT)를 순차 await으로 실행해 round-trip이 2회 발생했습니다.",
        "asyncio.gather로 동시 실행을 시도하면 AsyncSession 내부 상태가 충돌해 InvalidRequestError가 발생합니다.",
        "asyncio의 협력형 멀티태스킹으로 두 코루틴이 await 지점에서 번갈아 실행되면서 세션 상태를 덮어씁니다.",
        "_get_owned_pipeline 내부에서도 pipeline → project 2-hop 의존 체인이 순차 실행됐습니다.",
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "slow-query-log.txt",
      code: "# GET /projects — 923ms\n363ms  SELECT count(projects.id) WHERE owner_id = ?   ← round-trip 1\n~350ms SELECT projects.* WHERE owner_id = ? LIMIT ?  ← round-trip 2\n\n# POST /pipelines/{id}/jobs — 1901ms\n448ms  SELECT pipelines WHERE id = ?       ← round-trip 1\n~280ms SELECT projects WHERE id = ?       ← round-trip 2\n307ms  SELECT jobs WHERE pipeline_id = ?  ← round-trip 3",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "스칼라 서브쿼리로 COUNT 내장",
          description:
            "find_cursor_page_by_owner에서 COUNT를 SELECT 절 안에 스칼라 서브쿼리로 내장해 2 쿼리를 1 쿼리로 통합했습니다.",
          badge: "Subquery",
        },
        {
          title: "소유권 검증 JOIN 통합",
          description:
            "_get_owned_pipeline을 pipelines + projects JOIN 단일 쿼리로 교체해 2 round-trip을 1 round-trip으로 줄였습니다.",
          badge: "JOIN",
        },
        {
          title: "Job 목록 + 소유권 LEFT OUTER JOIN",
          description:
            "list_jobs, create_job에서 소유권 검증과 Job 조회를 pipelines + projects + jobs LEFT JOIN 단일 쿼리로 통합했습니다.",
          badge: "LEFT JOIN",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "asyncio.gather는 AsyncSession과 함께 사용할 수 없습니다. 해결은 병렬화가 아닌 쿼리 통합입니다. 단, round-trip 절감 효과는 네트워크 레이턴시에 따라 달라집니다. Docker 환경(round-trip ~350ms)에서는 큰 효과가 있지만, 동일 VPC(round-trip < 1ms)에서는 JOIN 비용이 더 클 수 있습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "GET /projects",
          before: "923ms",
          after: "642ms",
          change: "-30%",
        },
        {
          label: "POST /pipelines/{id}/jobs",
          before: "1901ms",
          after: "1386ms",
          change: "-27%",
        },
        {
          label: "GET /pipelines/{id}/execution-report",
          before: "1234ms",
          after: "967ms",
          change: "-22%",
        },
        {
          label: "GET /projects slow query",
          before: "1개",
          after: "0개",
          change: "-100%",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "slow query 로그에서 SELECT count 항목이 사라지고, 소유권 검증 쿼리들이 단일 JOIN으로 통합됐습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "SQLAlchemy AsyncSession은 단일 커넥션 기반이며 asyncio.gather로 같은 세션에서 두 쿼리를 동시 실행하면 세션 상태 머신 충돌로 500 에러가 발생합니다.",
        "round-trip을 줄이는 올바른 방법은 asyncio.gather(병렬화)가 아닌 JOIN(쿼리 통합)입니다.",
        "소유권 검증과 데이터 조회는 같은 관계 경로를 공유하므로 JOIN 한 번으로 통합할 수 있습니다.",
        "빈 데이터와 소유권 실패를 구분해야 하는 경우(예: 빈 로그 vs 권한 없음)에는 소유권 검증 쿼리를 분리 유지해야 합니다.",
      ],
    },
  ],
  relatedNoteSlugs: ["async-sqlalchemy-eager-loading", "db-round-trip-optimization"],
};
