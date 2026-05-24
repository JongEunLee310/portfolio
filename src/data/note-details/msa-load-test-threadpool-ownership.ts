import type { TechnicalNoteDetail } from "@/types/note";
import { msaLoadTestThreadpoolOwnership } from "../notes/msa-load-test-threadpool-ownership";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const msaLoadTestThreadpoolOwnershipDetail: TechnicalNoteDetail = {
  ...msaLoadTestThreadpoolOwnership,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "MSA 전환 후 Locust 100 VU 부하 테스트에서 두 가지 문제가 발견됐습니다. 첫째, 로그인 요청 중앙값이 37초로 폭등하고 실패율이 12.9%를 기록했습니다. 둘째, GET /pipelines/{id}/runs에서 소유권 검증 없이 타 사용자 실행 이력이 200으로 반환됐습니다. 기능 테스트는 통과했지만 부하 테스트에서 구조적 결함 두 개가 동시에 드러났습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "부하 테스트는 기능 테스트가 보지 못하는 두 가지를 드러냅니다. 동시성 병목(executor 포화)과 인가 검증 누락(소유권 미확인). 두 결함 모두 단일 요청에서는 증상이 나타나지 않습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "pipeline-execution-svc는 Git clone과 Job 실행을 asyncio.run_in_executor로 스레드 풀에 위임합니다. 기본 ThreadPoolExecutor max_workers=2라 동시 실행 2건 초과 시 태스크가 큐에 쌓입니다.",
        "100 VU 로그인 → POST /run 시나리오에서 큐 깊이 98 → 모든 대기 요청이 executor 완료를 기다려 중앙값 37초가 됐습니다.",
        "GET /pipelines/{id}/runs 핸들러에 current_user 소유권 검증이 없었습니다. pipeline_id가 유효하면 소유자와 무관하게 실행 이력을 반환했습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "ThreadPoolExecutor 크기 조정",
          description:
            "max_workers=min(32, (os.cpu_count() or 1) + 4)로 설정합니다. CPU 코어 수에 비례해 I/O 대기 작업을 처리할 여유 스레드를 확보합니다. 상한 32는 스레드 과다 생성에 의한 컨텍스트 스위칭 비용을 제한합니다.",
          badge: "Python",
        },
        {
          title: "소유권 검증 추가",
          description:
            "list_pipeline_runs 핸들러에 pipeline_service.get_pipeline(pipeline_id, current_user.id) 호출을 추가합니다. 해당 파이프라인이 current_user 소유가 아니면 404를 반환합니다. 이후 pipeline-execution-svc에 조회를 위임합니다.",
          badge: "FastAPI",
        },
        {
          title: "부하 테스트 시나리오 검토",
          description:
            "단순 응답 코드 확인이 아니라 응답 body의 소유자 일치 여부도 assertion합니다. 인가 결함은 기능 테스트에서 잡기 어렵고 부하 테스트 시나리오가 멀티 사용자를 시뮬레이션할 때 드러납니다.",
          badge: "Locust",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "executor max_workers를 무한정 늘리는 것은 해결책이 아닙니다. 근본적으로 CPU/IO 집약 작업을 별도 서비스(pipeline-execution-svc)로 이미 분리했으므로, executor는 해당 서비스 내 실제 실행 병렬성 기준으로 적절히 설정해야 합니다. 소유권 검증 누락은 부하 테스트 시나리오가 멀티 사용자를 커버했기 때문에 발견됐습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "로그인 응답 중앙값",
          before: "37초 (executor 포화)",
          after: "12ms",
          change: "개선",
        },
        {
          label: "실패율 (100 VU)",
          before: "12.9%",
          after: "0%",
          change: "해소",
        },
        {
          label: "타 사용자 실행 이력 노출",
          before: "200 반환 (소유권 미검증)",
          after: "404 반환",
          change: "보안 수정",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "100 VU 부하 테스트: 처리량 47.4 req/s, 중앙값 12ms, 실패율 0%. GET /pipelines/{id}/runs: 소유자 요청 → 200, 타 사용자 요청 → 404.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "ThreadPoolExecutor 기본 max_workers는 부하 테스트 없이는 드러나지 않는 병목입니다. CPU 집약 작업을 executor에 위임하는 서비스는 적절한 max_workers를 명시적으로 설정해야 합니다.",
        "인가 검증 누락은 단일 사용자 기능 테스트에서는 보이지 않습니다. 부하 테스트 시나리오에 다중 사용자 소유권 교차 검증을 포함해야 합니다.",
        "소유권 검증은 서비스 진입점(core-api)에서 한 번 수행하고, downstream 서비스는 신뢰된 식별자만 받아 처리합니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "msa-http-retry-circuit-breaker",
    "async-pipeline-transition",
    "celery-prefork-asyncio-nullpool",
  ],
};
