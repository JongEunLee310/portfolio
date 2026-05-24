import type { TechnicalNoteDetail } from "@/types/note";
import { aiLogAnalysisLatency } from "../notes/ai-log-analysis-latency";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const aiLogAnalysisLatencyDetail: TechnicalNoteDetail = {
  ...aiLogAnalysisLatency,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "파이프라인 실행이 실패하면 AI Review가 자동 요청됩니다. 그런데 실패한 Job의 stdout/stderr 전체를 그대로 LLM 입력으로 전달하자, 짧게는 8초, 길게는 30초 이상 응답을 기다려야 하는 경우가 발생했습니다. Claude API 호출 자체는 정상이었으나 분석 결과를 DB에 저장하는 시점까지 커넥션이 유지됐고, 동시에 여러 Pipeline이 실패하면 커넥션 풀이 고갈됐습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "LLM 응답이 느린 것이 아니라, 입력 토큰이 많아질수록 추론 시간이 선형 이상으로 증가하는 것이 문제였습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "Job 실행 stdout/stderr 전체(수천~수만 줄)를 LLM 입력으로 전달해 토큰 수가 폭증했습니다.",
        "반복되는 로그 라인(같은 예외가 수백 번 출력 등)이 걸러지지 않고 그대로 포함됐습니다.",
        "Git clone 로그, 패키지 설치 진행 메시지 등 분석과 무관한 INFO 레벨 로그가 다수 포함됐습니다.",
        "AI Review Service는 메시지를 수신하는 즉시 전체 로그를 조합해 Claude API를 호출하고, 응답을 기다리는 동안 커넥션을 점유했습니다.",
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "token-count-before.txt",
      code: "# 실패 Job 로그 예시 (전처리 전)\n[INFO] Cloning into '/workspace/pipeline-abc123'...\n[INFO] remote: Enumerating objects: 1843, done.\n... (200줄 git 출력)\n[INFO] Installing dependencies...\n... (500줄 pip install 출력)\n[ERROR] ModuleNotFoundError: No module named 'app.core'\n[ERROR] ModuleNotFoundError: No module named 'app.core'\n... (동일 에러 300회 반복)\n\n→ 입력 토큰: ~18,000 tokens\n→ LLM 응답 대기: 24s",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "Job 단계별 로그 요약",
          description:
            "Git clone, 의존성 설치, 실행 단계별로 로그를 분리하고 각 단계를 한 줄 요약으로 압축했습니다. 실패한 단계만 상세 로그를 유지합니다.",
          badge: "단계 분리",
        },
        {
          title: "에러 레벨 + 스택 트레이스 추출",
          description:
            "ERROR / CRITICAL 레벨 로그와 그 주변 10줄만 추출했습니다. INFO 레벨의 진행 메시지는 카운트만 남기고 제거했습니다.",
          badge: "레벨 필터",
        },
        {
          title: "반복 로그 핑거프린팅",
          description:
            "동일한 에러 메시지가 반복되면 첫 출현 + 반복 횟수로 축약했습니다. 핑거프린트 기준은 예외 클래스명 + 첫 번째 스택 프레임입니다.",
          badge: "중복 제거",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "전처리 로직이 효과가 있는지 측정하기 위해 SQLAlchemy Event Listener 기반 slow query 로깅 인프라를 먼저 구축했습니다. before_cursor_execute / after_cursor_execute 이벤트로 쿼리 실행 시간을 계측하고, ContextVar로 HTTP 요청 컨텍스트를 DB 드라이버 계층까지 전파해 어느 API 호출에서 slow query가 발생하는지 추적할 수 있게 했습니다.",
    },
    {
      type: "code",
      language: "python",
      filename: "sql_logging.py",
      code: "# SQLAlchemy Event Listener로 slow query 계측\nevent.listen(Engine, \"before_cursor_execute\", _before_cursor_execute)\nevent.listen(Engine, \"after_cursor_execute\", _after_cursor_execute)\n\n# ContextVar로 HTTP 요청 정보를 DB 레이어까지 전달\n_current_request: ContextVar[Request | None] = ContextVar(\n    \"current_request\", default=None\n)\n\n# slow_query_detected 로그 예시\n{\n  \"event\": \"slow_query_detected\",\n  \"elapsed_ms\": 532.41,\n  \"threshold_ms\": 300,\n  \"statement\": \"SELECT * FROM job_run_logs WHERE pipeline_run_id = $1\",\n  \"method\": \"GET\",\n  \"path\": \"/pipelines/{id}/execution-report\",\n  \"request_id\": \"a1b2c3d4-...\"\n}",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "LLM 입력 토큰 수",
          before: "~18,000 tokens",
          after: "~2,400 tokens",
          change: "-87%",
        },
        {
          label: "AI Review 응답 대기",
          before: "24s",
          after: "4s",
          change: "-83%",
        },
        {
          label: "커넥션 점유 시간",
          before: "24s+",
          after: "4s 이하",
          change: "-83%",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "slow query 로그에서 /pipelines/{id}/execution-report 경로의 DB 대기 시간이 줄고, AI Review 완료 이벤트가 평균 4초 내에 core.ai-review-result.queue에 도달하게 됐습니다.",
    },
    {
      type: "list",
      items: [
        "동시 Pipeline 실패 시 커넥션 풀 고갈 현상이 사라졌습니다.",
        "Claude API 호출 비용이 토큰 수 비례로 줄었습니다.",
        "분석 품질은 유지됐습니다. 핵심 에러와 스택 트레이스는 전처리 후에도 그대로 포함되기 때문입니다.",
      ],
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "AI 기능의 품질과 비용은 모델 선택보다 입력 설계에 더 크게 좌우됩니다. 어떤 맥락을 남기고 어떤 노이즈를 제거할지 결정하는 전처리 단계가 추론 결과와 운영 비용을 동시에 결정합니다.",
    },
  ],
  relatedNoteSlugs: ["async-pipeline-transition", "celery-prefork-asyncio-nullpool"],
};
