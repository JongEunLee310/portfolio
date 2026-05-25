import type { TechnicalNoteDetail } from "@/types/note";
import { llmResponseFormatNotEnforced } from "../notes/llm-response-format-not-enforced";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const llmResponseFormatNotEnforcedDetail: TechnicalNoteDetail = {
  ...llmResponseFormatNotEnforced,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "auto_response_handler.py에서 OpenAI API를 호출할 때 응답 형식을 강제하거나 검증하는 코드가 없었습니다. max_output_tokens=100 제약은 설정되어 있지만, 반환된 응답이 실제로 텍스트 메시지인지, 내용이 유효한지를 확인하는 로직이 없었습니다.",
    },
    {
      type: "paragraph",
      content:
        "Pydantic 스키마 파일(auto_response_schemas.py)은 비어 있고, 응답 내용에 대한 테스트 케이스도 0개였습니다. OpenAI Responses API의 응답 구조나 출력 타입이 변경될 경우, 코드는 경고 없이 런타임 오류로 이어지는 상태였습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "응답 출력 타입에 대한 암묵적 가정: OpenAI Responses API의 output 항목은 type 필드를 가지며 message, function_call, reasoning 등 여러 타입이 존재합니다. 현재 코드는 output[0]이 항상 type: 'message'라고 가정합니다.",
        "Pydantic 스키마 미작성: auto_response_schemas.py가 비어 있어 응답 페이로드를 검증할 수단이 없습니다. 응답 구조 변경을 감지할 수 있는 정적 안전망이 없습니다.",
        "response_format 파라미터 미사용: 텍스트 응답만 필요한 서비스임에도 response_format을 명시하지 않아 응답 타입 불일치 문제를 사전에 차단하지 못했습니다.",
        "테스트 부재: auto_response 서비스의 테스트 파일이 비어 있어 핸들러가 비정상 응답에 어떻게 반응하는지 코드 레벨에서 검증된 적이 없었습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "응답 타입 순서대로 검증",
          description:
            "응답 텍스트 추출 로직을 별도 함수로 분리하고, output[0].type을 확인한 뒤 text 필드에 접근합니다. 추출 결과가 None이거나 빈 문자열이면 503으로 처리합니다.",
          badge: "방어적 검증",
        },
        {
          title: "Pydantic 스키마 정의",
          description:
            "auto_response_schemas.py에 응답 스키마를 정의해 핸들러 반환 타입을 명시합니다. 응답 구조를 정적으로 선언하면 파싱 시점에 타입 오류를 잡을 수 있습니다.",
          badge: "정적 안전망",
        },
        {
          title: "비정상 응답 테스트 추가",
          description:
            "OpenAI 응답 객체를 mock으로 대체해 output이 빈 리스트, function_call 타입, content가 없는 경우 등 5개 이상의 케이스를 검증하는 단위 테스트를 추가합니다.",
          badge: "테스트 보강",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "응답 텍스트 추출 함수에서 output이 비어 있는지, output[0].type이 'message'인지, content가 비어 있는지, content[0].type이 'output_text'인지를 순서대로 확인합니다. 위 조건 중 하나라도 실패하면 None을 반환하고 503으로 처리합니다.",
    },
    {
      type: "code",
      language: "python",
      filename: "auto_response_handler.py",
      code: "def extract_response_text(response) -> str | None:\n    if not response.output:\n        return None\n    if response.output[0].type != \"message\":\n        return None\n    if not response.output[0].content:\n        return None\n    if response.output[0].content[0].type != \"output_text\":\n        return None\n    return response.output[0].content[0].text\n\n# 검증이 필요한 테스트 케이스\n# output == []               → 503\n# output[0].type == \"function_call\" → 503\n# content == []              → 503\n# text == \"\"                 → 503\n# 정상 구조                  → 200 + 텍스트",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "output type 검증",
          before: "없음",
          after: "'message' 타입 확인 후 접근",
          change: "타입 안전성 확보",
        },
        {
          label: "Pydantic 응답 스키마",
          before: "0 필드 (파일 비어 있음)",
          after: "응답 구조 정의",
          change: "정적 안전망",
        },
        {
          label: "형식 오류 반환 코드",
          before: "500",
          after: "503",
          change: "오류 원인 구분 가능",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "info",
      content:
        "현재 코드에서 응답 형식 검증은 적용되지 않았습니다. 응답 텍스트 추출 로직 분리와 Pydantic 스키마 정의, 비정상 응답 케이스 테스트 추가가 모두 남아 있습니다. 관련 문서는 docs/troubleshooting/backend/002-openai-response-direct-access.md를 함께 참고합니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "OpenAI Responses API의 output은 단순한 텍스트 배열이 아닙니다. type 필드로 출력 종류를 구분하며, 모델 설정이나 API 변경에 따라 예상치 못한 타입이 반환될 수 있습니다. Pydantic 스키마 파일이 비어 있다는 것은 단순한 미완성이 아니라, 응답 계약이 코드에 존재하지 않는다는 신호입니다.",
    },
  ],
  relatedNoteSlugs: [
    "openai-response-direct-access",
    "stateless-prompt-context-loss",
  ],
};
