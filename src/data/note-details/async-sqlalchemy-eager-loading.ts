import type { TechnicalNoteDetail } from "@/types/note";
import { asyncSqlalchemyEagerLoading } from "../notes/async-sqlalchemy-eager-loading";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const asyncSqlalchemyEagerLoadingDetail: TechnicalNoteDetail = {
  ...asyncSqlalchemyEagerLoading,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "async SQLAlchemy 환경에서 ORM 관계에 접근하면 MissingGreenlet 에러가 발생하거나, 접근 가능해도 행 수만큼 SELECT가 추가 실행됩니다. 소유권 검증도 Job → Pipeline → Project 경로를 단계별 SELECT로 구현하면 매 요청마다 3번의 쿼리가 실행됩니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "async SQLAlchemy는 event loop 밖에서 DB I/O가 불가능하므로 lazy loading이 MissingGreenlet으로 즉시 실패합니다. N+1을 억누르는 것이 아닌 쿼리 설계를 수정해야 합니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "ORM 관계(relationship)는 기본적으로 lazy loading입니다. job.pipeline.name처럼 속성 접근 시 내부적으로 SELECT가 실행됩니다.",
        "async 환경에서 lazy loading은 MissingGreenlet 에러로 즉시 실패합니다. 에러가 N+1의 존재를 명시적으로 드러냅니다.",
        "소유권 검증(Job→Pipeline→Project)을 단계별 쿼리로 구현하면 요청마다 SELECT 3회가 발생합니다.",
        "WHERE 조건에 이미 JOIN이 있을 때 joinedload를 추가로 쓰면 같은 JOIN이 중복 발생합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "Explicit JOIN",
          description:
            "소유권 확인과 데이터 조회를 단일 JOIN 쿼리로 통합합니다. find_by_id_and_owner, find_all_by_pipeline_and_owner처럼 메서드 이름에 로드 범위를 명시합니다.",
          badge: "소유권 + 조회",
        },
        {
          title: "contains_eager",
          description:
            "WHERE 조건에 이미 JOIN이 있을 때, 그 JOIN 결과를 ORM 관계 속성에 매핑합니다. 중복 JOIN 없이 관계를 로드할 수 있습니다. 목록 조회에 적합합니다.",
          badge: "목록 조회",
        },
        {
          title: "joinedload",
          description:
            "필터용 JOIN이 없는 단건 조회에 사용합니다. SQLAlchemy가 LEFT OUTER JOIN을 자동으로 추가해 관계를 함께 로드합니다.",
          badge: "단건 조회",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "contains_eager는 이미 WHERE 조건에 JOIN이 있을 때만 의미가 있습니다. JOIN 없이 쓰면 관계가 빈 값으로 매핑됩니다. 목록 조회에서 joinedload를 쓰면 WHERE 조건용 JOIN과 중복되는 경우가 많으므로 contains_eager를 우선 검토하는 것이 좋습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "소유권 확인 + Job 조회",
          before: "SELECT 3회",
          after: "SELECT 1회",
          change: "-67%",
        },
        {
          label: "목록 조회 + 관계 로드",
          before: "MissingGreenlet 에러",
          after: "SELECT 1회",
          change: "정상화",
        },
        {
          label: "단건 조회 + 관계 로드",
          before: "MissingGreenlet 에러",
          after: "SELECT 1회",
          change: "정상화",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "MissingGreenlet 에러가 사라지고, 소유권 검증과 데이터 조회가 단일 쿼리로 처리됩니다. 소유권과 데이터를 원자적으로 확인하므로 TOCTOU 경쟁 조건도 방지됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "MissingGreenlet 에러는 N+1의 징후입니다. 에러를 억누르는 것이 아니라 쿼리 설계를 수정해야 합니다.",
        "contains_eager는 이미 WHERE 조건에 JOIN이 있을 때만 사용합니다. 목록 조회에서 joinedload와 혼용하면 JOIN이 중복됩니다.",
        "소유권 검증과 데이터 조회는 같은 관계 경로를 공유합니다. JOIN으로 통합하면 원자적으로 처리되어 TOCTOU 문제를 방지합니다.",
        "메서드 이름에 로드 범위를 포함하면(find_by_id_and_owner, find_by_pipeline_id_with_job) 호출 측에서 추가 쿼리를 기대하지 않게 됩니다.",
      ],
    },
  ],
  relatedNoteSlugs: ["async-session-join-optimization", "db-round-trip-optimization"],
};
