import type { TechnicalNoteDetail } from "@/types/note";
import { technicalNotes } from "./technicalNotes";

function findNote(slug: string) {
  const note = technicalNotes.find((item) => item.slug === slug);

  if (!note) {
    throw new Error(`technicalNotes.ts에 존재하지 않는 기술 노트 slug입니다: ${slug}`);
  }

  return note;
}

export const noteDetails: TechnicalNoteDetail[] = [
  {
    ...findNote("db-round-trip-optimization"),
    toc: [
      { id: "problem", title: "문제 상황", depth: 1 },
      { id: "root-cause", title: "원인 분석", depth: 1 },
      { id: "solution", title: "개선 방법", depth: 1 },
      { id: "performance", title: "성능 비교", depth: 1 },
      { id: "lesson", title: "배운 점", depth: 1 },
    ],
    content: [
      {
        type: "heading",
        id: "problem",
        title: "1. 문제 상황",
      },
      {
        type: "paragraph",
        content:
          "특정 목록 조회 API에서 응답 시간이 증가하는 문제가 발생했습니다. 로그를 확인해보니 하나의 요청을 처리하는 동안 여러 번의 DB 조회가 순차적으로 발생하고 있었습니다.",
      },
      {
        type: "heading",
        id: "root-cause",
        title: "2. 원인 분석",
      },
      {
        type: "list",
        items: [
          "소유권 확인 과정에서 Project와 Pipeline을 각각 조회했습니다.",
          "목록 조회에 limit이 없어 실행 이력 전체를 가져오는 문제가 있었습니다.",
          "인증 사용자 조회가 요청마다 반복되었습니다.",
        ],
      },
      {
        type: "code",
        language: "sql",
        filename: "before.sql",
        code: "SELECT * FROM pipelines WHERE id = :pipelineId;",
      },
      {
        type: "heading",
        id: "solution",
        title: "3. 개선 방법",
      },
      {
        type: "callout",
        variant: "warning",
        content:
          "성능 개선은 코드를 빠르게 만드는 일이 아니라, 불필요한 일을 하지 않도록 흐름을 다시 설계하는 일에 가깝습니다.",
      },
    ],
    relatedNoteSlugs: ["async-pipeline-transition"],
  },
  {
    ...findNote("async-pipeline-transition"),
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
    toc: [
      { id: "context", title: "프로젝트 맥락", depth: 1 },
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
          "AI DevOps Orchestration Platform은 파이프라인 실행, 로그 수집, 실패 원인 분석, 알림을 하나의 운영 흐름으로 연결한 프로젝트입니다.",
      },
      {
        type: "heading",
        id: "learned",
        title: "2. 배운 점",
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
        title: "3. 다음 개선 방향",
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
