import type { TechnicalNoteDetail } from "@/types/note";
import { statelessPromptContextLoss } from "../notes/stateless-prompt-context-loss";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const statelessPromptContextLossDetail: TechnicalNoteDetail = {
  ...statelessPromptContextLoss,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "auto_response 서비스는 심리 상담 응답을 제공합니다. 그런데 사용자가 여러 메시지를 연속으로 보내도, AI는 이전 대화를 전혀 알지 못한 채 각 메시지를 독립적으로 처리합니다. '요즘 직장 스트레스가 너무 심해요' 다음에 '그래서 잠도 잘 못 자고 있어요'를 보내면, AI는 직장 스트레스 맥락 없이 수면 문제에만 반응합니다.",
    },
    {
      type: "paragraph",
      content:
        "프론트엔드(TellYourStoryPage.vue)도 이전 대화를 전달하지 않습니다. axios 호출 시 { message: userInput } 필드만 포함하며, 응답 후 showInput = false로 입력창을 숨겨 사실상 단일 턴 UI로 동작합니다. 요청에 포함되는 이전 메시지 수는 0개입니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "대화 이력을 관리하는 구조 자체가 없습니다. OpenAI API는 input 배열에 이전 대화를 이어 붙이면 맥락 있는 응답을 생성하지만, 현재 서비스는 요청마다 배열을 새로 만들기 때문에 이전 대화가 전혀 전달되지 않습니다.",
        "백엔드 핸들러는 request_data.get(\"message\")만 추출하고, 프론트엔드는 { message: userInput } 필드만 전송합니다. context 또는 history 필드가 없습니다.",
        "이 시기(2024/12~2025/02)는 LLM 연동에서 에이전트나 메모리 관리 패턴이 막 등장하던 시점이었습니다. 대화 이력 설계 없이 단일 프롬프트 방식이 먼저 구현됐습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "클라이언트 저장 방식",
          description:
            "클라이언트가 대화 이력을 가지고 있다가, 매 요청 시 이전 메시지 목록을 서버에 함께 전달합니다. 서버는 전달받은 이력을 input 배열에 포함해 API를 호출합니다. 서버가 상태를 저장하지 않아도 되지만, 이력이 길어질수록 요청 페이로드와 토큰 비용이 증가합니다.",
          badge: "우선 도입 방향",
        },
        {
          title: "서버 저장 방식",
          description:
            "서버(또는 Redis 캐시)가 세션별로 대화 이력을 저장합니다. 클라이언트는 세션 ID만 전달하고 서버가 이력을 관리합니다. memory_service가 이 역할을 담당하도록 설계되어 있으나 현재 미구현 상태입니다.",
          badge: "장기 방향",
        },
        {
          title: "슬라이딩 윈도우 이력",
          description:
            "대화 이력이 길어지면 토큰 비용이 선형으로 증가합니다. 최근 N개의 메시지만 유지하는 슬라이딩 윈도우 방식으로 이력 길이를 제한합니다.",
          badge: "비용 제어",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "클라이언트 저장 방식을 적용할 경우, 요청 스키마에 history 필드를 추가해 클라이언트가 이전 대화를 배열로 전달하도록 하고, 서버는 전달받은 이력을 input 배열에 순서대로 삽입한 뒤 API를 호출합니다. 백엔드와 프론트엔드를 동시에 변경해야 이력 전달이 동작합니다.",
    },
    {
      type: "code",
      language: "python",
      filename: "auto_response_handler.py",
      code: "# 현재: 단일 턴\ninput=[\n    {\"role\": \"system\", \"content\": SYSTEM_PROMPT},\n    {\"role\": \"user\",   \"content\": user_message}\n]\n\n# 개선 방향: 이력 포함\nhistory = request_data.get(\"history\", [])\ninput=[\n    {\"role\": \"system\", \"content\": SYSTEM_PROMPT},\n    *[{\"role\": msg[\"role\"], \"content\": msg[\"content\"]} for msg in history[-10:]],\n    {\"role\": \"user\",   \"content\": user_message}\n]",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "이전 메시지 수",
          before: "0개 (매 요청 독립 처리)",
          after: "최근 N개 이력 포함",
          change: "맥락 유지",
        },
        {
          label: "지시어 처리 ('그래서', '그게')",
          before: "선행 맥락 없이 응답",
          after: "선행 맥락을 참조해 응답",
          change: "대화 연속성",
        },
        {
          label: "프론트엔드 재입력",
          before: "응답 후 입력창 없음",
          after: "응답 후 다음 메시지 입력 가능",
          change: "UI 흐름 변경 필요",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "info",
      content:
        "현재 코드에서 맥락 전달은 구현되지 않았습니다. 관련 실패 기록은 docs/failures/ai/003-conversation-history-not-adopted.md에 보류 상태로 기록되어 있습니다. 도입 시에는 백엔드 핸들러와 프론트엔드 axios 호출을 동시에 변경해야 하며, 둘 중 하나만 바꾸면 필드 불일치로 이력이 무시됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "심리 상담처럼 연속 대화가 핵심인 서비스에서 stateless 응답은 근본적인 제약입니다. LLM을 단순 Q&A 도구로 연동할 때는 단일 턴으로 충분하지만, 대화형 서비스에서는 첫 설계 시점에 '누가 대화 이력을 관리하는가'를 결정해야 합니다. 이력 길이가 늘어나면 토큰 비용이 선형으로 증가하므로 최대 이력 수 제한도 함께 설계해야 합니다.",
    },
  ],
  relatedNoteSlugs: [
    "llm-response-format-not-enforced",
    "multirepo-ci-duplication-and-drift",
  ],
};
