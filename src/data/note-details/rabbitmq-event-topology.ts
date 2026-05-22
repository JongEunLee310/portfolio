import type { TechnicalNoteDetail } from "@/types/note";
import { rabbitmqEventTopology } from "../notes/rabbitmq-event-topology";

export const rabbitmqEventTopologyDetail: TechnicalNoteDetail = {
  ...rabbitmqEventTopology,
  template: "technical-summary",
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
};
