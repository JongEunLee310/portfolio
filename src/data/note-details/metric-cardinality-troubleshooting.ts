import type { TechnicalNoteDetail } from "@/types/note";
import { metricCardinalityTroubleshooting } from "../notes/metric-cardinality-troubleshooting";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const metricCardinalityTroubleshootingDetail: TechnicalNoteDetail = {
  ...metricCardinalityTroubleshooting,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "Prometheus + Grafana 스택을 구성하고 파이프라인 실행 지표를 수집하기 시작한 지 며칠 만에 Prometheus 메모리 사용량이 급격히 증가했습니다. TSDB 저장 경로가 빠르게 채워졌고, 쿼리 응답 시간도 늘어났습니다. prometheus-fastapi-instrumentator가 수집하는 시계열 수를 조회해보니 며칠 만에 수만 개를 초과하고 있었습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "Prometheus는 label 값 조합 수만큼 시계열을 생성합니다. label이 하나라도 고카디널리티 값을 가지면 시계열 수가 기하급수적으로 증가합니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "초기에 PipelineRun ID(UUID)를 Prometheus label에 포함했습니다. 실행마다 새 UUID가 생성되므로 라벨 조합이 무한정 늘어납니다.",
        "prometheus-fastapi-instrumentator 기본 설정에서 handler 값이 정규화되지 않은 경로를 포함할 경우 path parameter가 label에 삽입됩니다.",
        "단기간에 수백 회 이상 파이프라인을 실행하자 시계열이 폭증했고 TSDB가 메모리 압박을 받기 시작했습니다.",
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "high-cardinality-labels.txt",
      code: "# 문제가 된 label 구성 예시\nfastapi_request_duration_seconds{\n  handler=\"run_pipeline\",\n  method=\"POST\",\n  status_code=\"202\",\n  pipeline_run_id=\"3f8a1c2d-...\"   ← 매 실행마다 새 시계열 생성\n}\n\n# 며칠 후 시계열 수\n$ curl localhost:9090/api/v1/label/__name__/values | jq '.data | length'\n→ active series: 94,821",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "label 값 기준 재정의",
          description:
            "label은 service, status, step처럼 반복 가능한 열거형 값으로만 구성했습니다. PipelineRun ID, 사용자 ID, timestamp처럼 고유값은 label에서 완전히 제거했습니다.",
          badge: "열거형만 허용",
        },
        {
          title: "실행 단위 추적 분리",
          description:
            "실행별 상세 추적은 Prometheus가 아닌 Loki 로그와 DB 조회로 분리했습니다. Prometheus는 집계 지표(처리량, 오류율, 응답 시간 분포)만 담당합니다.",
          badge: "책임 분리",
        },
        {
          title: "instrumentator 설정 명시화",
          description:
            "should_include_handler=True로 handler 이름(함수명)을 사용하도록 명시했습니다. 경로 파라미터가 아닌 FastAPI 라우터 함수명은 고정값이므로 카디널리티가 증가하지 않습니다.",
          badge: "핸들러명 사용",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "python",
      filename: "metrics.py",
      code: "from prometheus_fastapi_instrumentator import Instrumentator, metrics\n\ninstrumentator = Instrumentator(\n    should_group_status_codes=False,\n    should_instrument_requests_inprogress=True,\n)\ninstrumentator.add(\n    metrics.requests(\n        should_include_handler=True,   # 함수명(고정) — 카디널리티 안전\n        should_include_method=True,    # GET, POST, PATCH, DELETE\n        should_include_status=True,    # 상태 코드\n        # pipeline_run_id 같은 런타임 값은 포함하지 않음\n    )\n)\n\n# 노출 메트릭:\n# fastapi_requests_total{handler, method, status_code}\n# fastapi_request_duration_seconds{handler, method, status_code}\n# fastapi_requests_in_progress{handler, method}",
    },
    {
      type: "paragraph",
      content:
        "Grafana 대시보드는 집계 지표 중심으로 재구성했습니다. 개별 실행 추적이 필요한 경우에는 Loki에서 pipeline_run_id로 로그를 검색하도록 워크플로우를 정리했습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "활성 시계열 수",
          before: "94,821",
          after: "312",
          change: "-99.7%",
        },
        {
          label: "Prometheus 메모리 사용량",
          before: "~2.1 GB",
          after: "~140 MB",
          change: "-93%",
        },
        {
          label: "PromQL 쿼리 응답 시간",
          before: "4~8s",
          after: "< 200ms",
          change: "-97%",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "Grafana 대시보드에서 파이프라인 처리량, API 오류율, 엔드포인트별 응답 시간 분포를 실시간으로 확인할 수 있게 됐습니다. 장애 탐지에 필요한 집계 지표는 그대로 유지하면서 관측 인프라 비용을 대폭 줄였습니다.",
    },
    {
      type: "list",
      items: [
        "fastapi_requests_total 기준 endpoint별 오류율 알림 규칙을 설정했습니다.",
        "실행 단위 추적은 Loki 로그 검색으로 분리하여 Prometheus 부하 없이 디버깅할 수 있게 됐습니다.",
        "TSDB 저장소 용량이 안정화됐습니다.",
      ],
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "메트릭 label을 설계할 때는 '이 값이 런타임에 몇 가지 종류가 나올 수 있는가'를 먼저 따져야 합니다. 고유값(UUID, 사용자 ID, timestamp)은 label이 아닌 로그 필드나 DB에 저장하는 것이 원칙입니다. Prometheus는 집계용이고, 개별 추적은 로그 시스템의 책임입니다.",
    },
  ],
  relatedNoteSlugs: ["distributed-tracing-correlation-id", "db-round-trip-optimization"],
};
