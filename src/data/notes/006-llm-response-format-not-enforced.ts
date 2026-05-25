import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const llmResponseFormatNotEnforced: TechnicalNoteCard = {
  slug: "006-llm-response-format-not-enforced",
  title: "LLM 응답 형식 미강제로 인한 파싱 불안정성",
  summary:
    "시스템 프롬프트만으로는 GPT-4o 응답 형식이 보장되지 않아 공감 이외의 응답이 섞이는 문제와 프롬프트 강화로 완화한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/llm-response-format.svg"),
  date: "2025.01.22",
  readingTime: "5분 읽기",
  tags: [
    { name: "GPT-4o", category: "ai" },
    { name: "OpenAI SDK", category: "ai" },
  ],
  relatedProjectSlugs: ["the-listening-tree"],
  cardSummary: {
    title: "LLM 응답 형식 미강제로 인한 런타임 불안정성",
    problem:
      "auto_response_handler.py에서 response_format 파라미터 없이 OpenAI API를 호출하고, 응답 객체의 output[0].content[0].text를 직접 접근했습니다. output type이 function_call이거나 content가 비어 있으면 AttributeError / IndexError가 발생해 500으로 처리됐습니다.",
    solution:
      "응답 텍스트 추출 로직을 별도 함수로 분리하고 output이 비어 있는지, output[0].type == 'message'인지, content[0].type == 'output_text'인지 순서대로 검증합니다. 위반 케이스는 503으로 처리하고, auto_response_schemas.py에 응답 스키마를 정의합니다.",
    result:
      "비정상 응답 형식에서 500 대신 503을 반환해 오류 원인을 명확히 구분할 수 있습니다. 외부 API 응답에서 타입을 먼저 확인하고 값에 접근하는 방어적 검증 패턴의 필요성을 확인했습니다.",
  },
};
