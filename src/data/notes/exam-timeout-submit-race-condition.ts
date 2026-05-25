import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const examTimeoutSubmitRaceCondition: TechnicalNoteCard = {
  slug: "exam-timeout-submit-race-condition",
  title: "시험 시간 만료와 제출 요청의 경합 조건",
  summary:
    "제한 시간 만료와 사용자 수동 제출이 동시에 발생하면 수동/자동 제출 요청이 경합해 답안과 결과가 중복 저장될 수 있습니다. 서버 시간 기준 검증과 조건부 상태 전이로 최종 상태가 한 번만 결정되도록 보장한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.26",
  readingTime: "12분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Race Condition", category: "backend" },
    { name: "State Transition", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "시험 시간 만료와 제출 요청의 경합 조건",
    problem:
      "제한 시간 만료 직전에 사용자가 제출 버튼을 누르면 수동 제출과 자동 제출 요청이 동시에 서버에 도달할 수 있습니다. 상태 전이 규칙과 동시 요청 방어가 없으면 두 요청 모두 성공해 답안·결과가 중복 저장되거나 최종 상태가 충돌합니다.",
    solution:
      "서버 시간을 기준으로 제출 가능 여부를 판단하고, 수동·자동 제출을 공통 제출 Service로 통합했습니다. 상태 변경은 IN_PROGRESS 조건부 업데이트로 처리해 한 요청만 제출 권한을 획득하고 나머지는 중복 요청으로 처리합니다.",
    result:
      "동시 제출 요청이 들어와도 하나만 처리되고 최종 상태가 한 번만 결정됩니다. 답안·결과 중복 저장 없이 일관된 시험 응시 결과가 보장됩니다.",
  },
};
