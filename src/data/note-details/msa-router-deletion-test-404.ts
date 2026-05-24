import type { TechnicalNoteDetail } from "@/types/note";
import { msaRouterDeletionTest404 } from "../notes/msa-router-deletion-test-404";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const msaRouterDeletionTest404Detail: TechnicalNoteDetail = {
  ...msaRouterDeletionTest404,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "MSA Phase 3 코드 정리 중 pipeline-execution-svc의 불필요한 모놀리스 라우터 파일(app/api/pipelines.py)을 삭제했습니다. 단위 테스트와 API 레이어 테스트가 모두 통과했지만, 실제 실행 흐름에서 POST /pipelines/{id}/run과 POST /pipelines/{id}/retry가 404를 반환했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "FastAPI의 dependency_overrides는 라우터 등록 자체를 검증하지 않습니다. 테스트가 통과한다고 해서 경로가 앱에 등록되어 있다는 의미가 아닙니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "라우터 파일 삭제 시 app.include_router() 호출도 함께 제거되어 경로가 앱에 미등록됩니다.",
        "TestClient는 starlette.testclient를 통해 ASGI 앱을 인-프로세스로 호출합니다. dependency_overrides로 서비스 레이어를 교체하면 HTTP 라우팅을 거치지 않고 서비스 fake가 직접 호출됩니다.",
        "결과적으로 라우터 존재 여부와 무관하게 테스트가 통과하는 상태가 발생했습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "라우터 재구현",
          description:
            "삭제한 라우터의 기능을 pipeline_runs.py에 pipelines_router를 추가해 재구현하고, main.py에 app.include_router(pipelines_router)를 명시적으로 등록했습니다.",
          badge: "FastAPI",
        },
        {
          title: "경로 등록 검증",
          description:
            "GET /openapi.json로 /pipelines/{id}/run, /pipelines/{id}/retry 경로가 포함되는지 확인하는 스모크 테스트를 추가했습니다.",
          badge: "테스트",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "MSA 전환처럼 라우터 파일을 대량 삭제·재편하는 작업에서는 경로 등록 여부를 별도로 검증하는 스모크 테스트가 필요합니다. '코드 정리'와 '기능 재등록'은 항상 같은 PR에서 함께 다뤄야 합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "POST /pipelines/{id}/run",
          before: "404",
          after: "202",
          change: "복구",
        },
        {
          label: "POST /pipelines/{id}/retry",
          before: "404",
          after: "202",
          change: "복구",
        },
        {
          label: "OpenAPI 경로",
          before: "경로 없음",
          after: "경로 포함",
          change: "추가",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "READY 파이프라인으로 POST /run → 202 QUEUED 반환, FAILED 파이프라인으로 POST /retry → 202 QUEUED 반환. 130개 테스트 통과.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "FastAPI의 의존성 주입 테스트는 비즈니스 로직을 격리하는 데 효과적이지만, 라우터 등록 자체를 검증하지는 않습니다.",
        "삭제할 때는 그 파일이 담당하는 경로가 다른 곳에 반드시 살아있는지 확인해야 합니다.",
        "app.routes를 순회해 필수 경로 목록이 등록되어 있는지 확인하는 테스트를 추가하면 유사 문제를 사전 차단할 수 있습니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "msa-db-split-integration-test",
    "async-test-db-isolation",
    "msa-rabbitmq-migration",
  ],
};
