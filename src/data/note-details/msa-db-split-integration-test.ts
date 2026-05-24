import type { TechnicalNoteDetail } from "@/types/note";
import { msaDbSplitIntegrationTest } from "../notes/msa-db-split-integration-test";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const msaDbSplitIntegrationTestDetail: TechnicalNoteDetail = {
  ...msaDbSplitIntegrationTest,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "MSA DB 소유권 분리로 core-api DB에서 pipeline_runs, ai_reviews 테이블을 DROP했습니다. conftest.py가 ORM 모델로 직접 픽스처 데이터를 INSERT하던 통합 테스트 전체가 깨졌습니다. 실제 실행 흐름에서는 pipeline-execution-svc, ai-review-svc가 각자 DB에 저장하므로 core-api DB에 해당 레코드가 없는 것이 올바른 상태입니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "통합 테스트가 ORM으로 직접 INSERT한다는 것은 테스트가 실제 서비스 경계를 무시하고 DB를 공유 상태로 다룬다는 신호입니다. 서비스 경계가 변경될 때마다 테스트가 함께 깨집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "conftest.py의 pipeline_run_factory, ai_review_factory 픽스처가 core-api DB에 직접 INSERT를 시도했습니다. 테이블이 사라졌으므로 OperationalError가 발생했습니다.",
        "GET /pipelines/{id}/runs, GET /pipelines/{id}/ai-reviews 테스트가 전부 실패했습니다.",
        "실제 런타임에서 이 데이터는 HTTP 위임 클라이언트(PipelineExecutionReadClient, AIReviewClient)를 통해 downstream 서비스에서 조회됩니다. 테스트에서는 이 클라이언트를 fake로 교체해야 합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "인-메모리 스토어 도입",
          description:
            "_IntegrationPipelineExecutionStore, _IntegrationAIReviewStore 딕셔너리 기반 인-메모리 스토어를 conftest.py에 정의합니다. 픽스처 데이터를 DB 대신 스토어에 적재합니다.",
          badge: "테스트 설계",
        },
        {
          title: "HTTP 클라이언트 fake 공유",
          description:
            "FakePipelineExecutionReadClient, FakeAIReviewClient가 스토어를 참조합니다. core-api의 dependency_overrides로 fake를 주입하면 조회 요청이 스토어에서 데이터를 반환합니다.",
          badge: "FastAPI",
        },
        {
          title: "픽스처 책임 분리",
          description:
            "DB 픽스처(core-api 소유 테이블)와 인-메모리 픽스처(downstream 서비스 소유 데이터)를 명확히 분리합니다. ORM insert는 core-api 소유 데이터에만 사용합니다.",
          badge: "pytest",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "인-메모리 스토어 패턴은 DB 없이 테스트를 빠르게 실행할 수 있지만, downstream 서비스의 실제 동작을 검증하지 않습니다. 서비스 간 계약 검증이 필요하다면 Consumer-Driven Contract Testing을 별도로 구성해야 합니다. 현 단계에서는 core-api 레이어 책임 검증에 집중합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "통합 테스트 실패 수",
          before: "pipeline_run / ai_review 관련 전부 실패",
          after: "0개 실패",
          change: "복구",
        },
        {
          label: "픽스처 방식",
          before: "ORM 직접 INSERT (소유권 침범)",
          after: "인-메모리 스토어 + fake 클라이언트",
          change: "개선",
        },
        {
          label: "테스트 DB 의존성",
          before: "core-api DB에 타 서비스 테이블 필요",
          after: "core-api DB는 core-api 소유 테이블만",
          change: "경계 정리",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "GET /pipelines/{id}/runs: 인-메모리 스토어에서 픽스처 데이터 반환, 200. GET /pipelines/{id}/ai-reviews: fake 클라이언트에서 반환, 200. 기존 통합 테스트 전체 통과.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "통합 테스트가 타 서비스 소유 테이블에 ORM으로 직접 INSERT한다면 서비스 경계 침범입니다. 경계를 지키는 테스트를 작성해야 DB 소유권 분리가 테스트까지 유효합니다.",
        "인-메모리 스토어는 단순하고 빠르지만 실제 직렬화·역직렬화 로직을 검증하지 않습니다. HTTP fake도 응답 스키마를 명시적으로 정의해야 계약이 드리프트하지 않습니다.",
        "DB 소유권 분리 계획 시, 기존 테스트에서 어떤 픽스처가 타 서비스 소유 테이블에 접근하는지 사전에 파악해두면 마이그레이션 과정의 테스트 깨짐을 예측할 수 있습니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "cross-service-join-db-separation",
    "async-test-db-isolation",
    "msa-rabbitmq-migration",
  ],
};
