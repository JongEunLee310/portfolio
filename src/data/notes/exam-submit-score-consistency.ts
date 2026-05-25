import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const examSubmitScoreConsistency: TechnicalNoteCard = {
  slug: "exam-submit-score-consistency",
  title: "시험 제출 후 채점 결과와 답안 저장 불일치",
  summary:
    "시험 제출 과정에서 답안 저장, 채점, 결과 저장, 상태 변경이 분리되면 일부 단계만 성공해 데이터 불일치가 발생합니다. 핵심 제출 흐름을 하나의 트랜잭션으로 묶고 부가 처리를 분리해 일관성을 보장한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.26",
  readingTime: "12분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Transaction", category: "backend" },
    { name: "Data Integrity", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "시험 제출 후 채점 결과와 답안 저장 불일치",
    problem:
      "답안 저장, 채점, 결과 저장, 상태 변경이 각각 독립 작업으로 처리되어 중간 실패 시 부분 저장 상태가 남았습니다. 사용자는 제출했는데 결과가 없거나, 결과는 있는데 상태는 진행 중인 상황이 발생할 수 있었습니다.",
    solution:
      "핵심 제출 데이터(답안, 채점 결과, 응시 상태)를 하나의 트랜잭션으로 묶었습니다. 통계·오답노트 등 부가 처리는 제출 성공 이후 후처리로 분리하고, 재제출은 응시 상태 기준으로 차단했습니다.",
    result:
      "제출 실패 시 전체가 rollback되어 불완전한 제출 상태가 남지 않게 되었습니다. 제출 성공 응답을 받으면 결과가 반드시 존재하는 일관된 상태가 보장됩니다.",
  },
};
