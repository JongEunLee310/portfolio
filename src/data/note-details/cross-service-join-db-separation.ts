import type { TechnicalNoteDetail } from "@/types/note";
import { crossServiceJoinDbSeparation } from "../notes/cross-service-join-db-separation";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const crossServiceJoinDbSeparationDetail: TechnicalNoteDetail = {
  ...crossServiceJoinDbSeparation,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "MSA DB 소유권 분리 후 GET /pipelines/{id}/runs 엔드포인트에서 502가 반환됐습니다. pipeline-execution-svc 로그에는 sqlalchemy.exc.ProgrammingError: relation \"pipelines\" does not exist가 찍혔습니다. 모놀리스 코드를 복사할 때 pipelines, projects 테이블을 JOIN하는 쿼리도 함께 복사됐고, pipeline_execution_db에는 해당 테이블이 존재하지 않았습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "DB를 물리적으로 분리했다고 소유권까지 이전된 것은 아닙니다. '어느 서비스가 이 데이터의 진실의 원천인가'를 명확히 정해두지 않으면, 코드 복사 시 소유권을 침범하는 쿼리가 함께 따라옵니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "pipeline-execution-svc의 PipelineRunRepository가 모놀리스에서 복사된 JOIN 쿼리를 포함하고 있었습니다. pipelines.project_id → projects.user_id 경로로 소유권을 직접 검증했습니다.",
        "pipeline_execution_db에는 core-api 소유 테이블인 pipelines, projects가 존재하지 않아 ProgrammingError가 발생했습니다.",
        "소유권 검증 책임이 어느 서비스에 있는지 명시적으로 정의하지 않은 채 코드 이식이 이루어졌습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "소유권 검증을 core-api로 이전",
          description:
            "GET /pipelines/{id}/runs 진입점인 core-api에서 pipeline_service.get_pipeline(pipeline_id, current_user.id)를 호출해 소유권을 확인합니다. 검증이 통과한 이후에야 pipeline-execution-svc에 조회를 위임합니다.",
          badge: "설계 원칙",
        },
        {
          title: "PipelineRunRepository JOIN 제거",
          description:
            "PipelineRunRepository에서 pipelines, projects 테이블 JOIN을 제거합니다. pipeline_id 컬럼만으로 단순 WHERE 절 조회로 대체합니다. PipelineRepository, JobRepository 의존성을 제거합니다.",
          badge: "SQLAlchemy",
        },
        {
          title: "서비스 경계 원칙 수립",
          description:
            "각 서비스는 자신의 DB에 있는 테이블만 쿼리합니다. 타 서비스 소유 데이터가 필요하면 HTTP 위임 또는 이벤트 수신으로만 접근합니다.",
          badge: "MSA 원칙",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "소유권 검증을 consumer 쪽에서 수행하면 서비스마다 소유권 로직이 중복됩니다. 진입점인 core-api에서 한 번만 검증하고, downstream 서비스는 pipeline_id를 신뢰된 식별자로 받아 자체 데이터만 조회합니다. 이 패턴을 적용하면 소유권 로직 변경이 core-api 한 곳에만 영향을 줍니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "GET /pipelines/{id}/runs",
          before: "502 (ProgrammingError)",
          after: "200 정상 응답",
          change: "복구",
        },
        {
          label: "PipelineRunRepository 의존성",
          before: "pipelines + projects JOIN",
          after: "pipeline_id WHERE 절만",
          change: "단순화",
        },
        {
          label: "소유권 검증 위치",
          before: "각 서비스 Repository",
          after: "core-api 진입점 단일",
          change: "통합",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "GET /pipelines/{id}/runs: 소유자 요청 → 200 + 실행 이력 반환. 타 사용자 요청 → core-api에서 404 반환. pipeline-execution-svc 로그에 ProgrammingError 없음.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "DB를 물리 분리할 때는 코드 이식 전에 '어느 서비스가 이 테이블의 소유자인가'를 먼저 정의합니다.",
        "소유권 검증은 시스템 진입점에서 한 번 수행합니다. downstream 서비스는 upstream이 검증한 식별자를 신뢰합니다.",
        "서비스가 자신의 DB에 없는 테이블을 JOIN하는 코드가 있다면 소유권 침범 신호입니다. 이를 탐지하는 테스트(실제 DB 스키마 검증)가 필요합니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "msa-db-split-integration-test",
    "msa-load-test-threadpool-ownership",
    "msa-rabbitmq-migration",
  ],
};
