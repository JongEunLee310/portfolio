import type { TechnicalNoteDetail } from "@/types/note";
import { openaiResponseDirectAccess } from "../notes/openai-response-direct-access";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const openaiResponseDirectAccessDetail: TechnicalNoteDetail = {
  ...openaiResponseDirectAccess,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "auto_response 서비스의 auto_response_handler.py에서 OpenAI API 응답을 response.output[0].content[0].text로 직접 접근하고 있었습니다. 응답 구조가 예상과 다를 경우 방어 코드 없이 IndexError 또는 AttributeError가 발생하며, 개발 중 추가한 print() 구문이 그대로 남아 운영 로그를 오염시킬 수 있는 상태였습니다.",
    },
    {
      type: "paragraph",
      content:
        "두 핸들러(initial_message_handler, response_handler) 모두 동일한 방식으로 응답을 접근하고 있었으며, response_handler에는 print(user_message)와 print(response.output[0].content[0].text)가 남아 있어 사용자의 심리 상담 메시지가 서버 표준 출력으로 노출되는 개인 정보 문제도 있었습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "응답 구조에 대한 암묵적 가정: client.responses.create()의 반환 타입이 output[0].content[0].text 구조를 항상 가진다고 가정했습니다. OpenAI API 스펙이 바뀌면 이 가정이 깨질 수 있습니다.",
        "예외 처리 범위가 너무 넓음: 두 핸들러 모두 try/except Exception as e로 전체를 감싸고 있어 응답 파싱 오류, 네트워크 오류, 인증 오류가 동일한 500 + str(e)로 묶였습니다.",
        "print() 디버그 잔존: 개발 중 추가한 print(user_message)가 핸들러 코드에 남아 있어 사용자가 입력한 심리 상담 내용이 서버 표준 출력으로 노출됐습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "응답 텍스트 추출 함수 분리",
          description:
            "응답에서 텍스트를 추출하는 로직을 별도 함수로 분리하고, output이 비거나 구조가 맞지 않을 때 None을 반환하도록 합니다. None인 경우 503 Service Unavailable을 반환합니다.",
          badge: "방어적 추출",
        },
        {
          title: "print() 구문 제거",
          description:
            "디버그 목적의 print() 두 개를 모두 제거합니다. 운영 로깅이 필요하면 logging.debug()로 대체하되, 사용자 메시지 내용은 로그 레벨을 구분해 운영에서 노출되지 않도록 합니다.",
          badge: "개인정보 보호",
        },
        {
          title: "오류 원인별 상태 코드 분기",
          description:
            "OpenAI 인증 오류는 401, 응답 구조 파싱 실패는 503, 기타 API 오류는 502로 반환합니다. 클라이언트가 오류 원인을 구분할 수 있게 합니다.",
          badge: "상태 코드 분리",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "응답 텍스트 추출 함수에서는 output이 비어 있는지, output[0].type이 'message'인지, content가 비어 있는지, content[0].type이 'output_text'인지를 순서대로 검증합니다. 위 조건 중 하나라도 실패하면 None을 반환합니다.",
    },
    {
      type: "code",
      language: "python",
      filename: "auto_response_handler.py",
      code: "def extract_response_text(response) -> str | None:\n    if not response.output:\n        return None\n    output_item = response.output[0]\n    if output_item.type != \"message\":\n        return None\n    if not output_item.content:\n        return None\n    content_item = output_item.content[0]\n    if content_item.type != \"output_text\":\n        return None\n    return content_item.text\n\n# 핸들러에서 사용\ntext = extract_response_text(response)\nif text is None:\n    raise HTTPException(status_code=503, detail=\"AI 응답을 받지 못했습니다\")",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "빈 응답 처리",
          before: "IndexError → 500",
          after: "503 + 명확한 메시지",
          change: "오류 구분 가능",
        },
        {
          label: "디버그 print",
          before: "사용자 메시지 표준 출력 노출",
          after: "제거됨",
          change: "개인정보 보호",
        },
        {
          label: "예외 원인 구분",
          before: "모든 오류 → 500 + str(e)",
          after: "401 / 502 / 503 분리",
          change: "원인별 분리",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "빈 응답에서 IndexError 대신 503을 반환해 오류 원인이 명확해졌습니다. 사용자의 심리 상담 메시지가 표준 출력에 노출되는 문제를 제거했습니다. 응답 텍스트 추출 로직을 함수로 분리해 두 핸들러에서 공유할 수 있는 구조가 됐습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "외부 API 응답은 항상 방어적으로 접근해야 합니다. 인덱스 기반 접근(response.output[0].content[0].text)은 API 스펙 변경에 취약합니다. 개발 편의를 위해 추가한 print()는 배포 전 반드시 제거해야 합니다. 사용자의 심리 상담 메시지처럼 민감한 정보를 처리하는 서비스에서 표준 출력 노출은 개인 정보 문제로 이어질 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "google-oauth-exception-masking",
    "llm-response-format-not-enforced",
  ],
};
