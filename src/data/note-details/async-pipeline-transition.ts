import type { TechnicalNoteDetail } from "@/types/note";
import { asyncPipelineTransition } from "../notes/async-pipeline-transition";

export const asyncPipelineTransitionDetail: TechnicalNoteDetail = {
  ...asyncPipelineTransition,
  template: "technical-summary",
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
};
