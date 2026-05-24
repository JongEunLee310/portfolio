import type { TechnicalNoteDetail } from "@/types/note";
import { aiDevopsRetrospective } from "../notes/ai-devops-retrospective";

export const aiDevopsRetrospectiveDetail: TechnicalNoteDetail = {
  ...aiDevopsRetrospective,
  template: "retrospective",
  toc: [
    { id: "context", title: "프로젝트 맥락", depth: 1 },
    { id: "role", title: "내가 맡은 역할", depth: 1 },
    { id: "worked", title: "잘한 점", depth: 1 },
    { id: "missed", title: "아쉬운 점", depth: 1 },
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
        "AI Agent Pipeline Backend Design은 파이프라인 실행, 로그 수집, 실패 원인 분석을 하나의 백엔드 흐름으로 연결하고 AI Agent를 어느 경계에 붙일 수 있는지 실험한 프로젝트입니다.",
    },
    {
      type: "heading",
      id: "role",
      title: "2. 내가 맡은 역할",
    },
    {
      type: "list",
      items: [
        "파이프라인 실행 요청과 실제 실행 흐름을 분리했습니다.",
        "실패 로그 수집과 AI 분석 요청 경계를 설계했습니다.",
        "알림, 모니터링, 재처리 기준을 운영 흐름에 맞춰 정리했습니다.",
      ],
    },
    {
      type: "heading",
      id: "worked",
      title: "3. 잘한 점",
    },
    {
      type: "list",
      items: [
        "실행과 분석의 책임을 분리해 장애 원인 추적을 단순하게 만들었습니다.",
        "모니터링 지표를 화면 장식이 아니라 개선 대상을 찾는 기준으로 사용했습니다.",
        "AI 분석 입력을 정리하는 과정을 별도 책임으로 보고 품질과 비용을 함께 고려했습니다.",
      ],
    },
    {
      type: "heading",
      id: "missed",
      title: "4. 아쉬운 점",
    },
    {
      type: "paragraph",
      content:
        "초기에는 실행 로그와 분석 결과의 책임 경계가 충분히 분리되지 않아, 실패 원인을 재현할 때 필요한 데이터를 다시 찾아야 하는 경우가 있었습니다.",
    },
    {
      type: "heading",
      id: "learned",
      title: "5. 배운 점",
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
      title: "6. 다음 개선 방향",
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
    "msa-rabbitmq-migration",
    "consumer-idempotency-processed-event",
    "event-schema-versioning-deploy-order",
    "distributed-tracing-correlation-id",
    "cross-service-join-db-separation",
    "msa-load-test-threadpool-ownership",
  ],
};
