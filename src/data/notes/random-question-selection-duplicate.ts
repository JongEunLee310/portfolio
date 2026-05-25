import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const randomQuestionSelectionDuplicate: TechnicalNoteCard = {
  slug: "random-question-selection-duplicate",
  title: "랜덤 시험 생성 시 동일 문제가 중복 포함되는 문제",
  summary:
    "랜덤 추출 로직에서 후보 문제 수를 검증하지 않거나 중복 없는 선택을 보장하지 않으면 동일 문제가 반복 포함된 시험지가 생성됩니다. 비복원 추출 방식과 저장 전 고유성 검증을 추가해 시험지 품질을 보장한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.26",
  readingTime: "10분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Random Sampling", category: "backend" },
    { name: "Data Integrity", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "랜덤 시험 생성 시 동일 문제 중복 포함",
    problem:
      "랜덤 인덱스를 반복 선택하거나 후보 문제 수가 요청 수보다 적을 때 중복으로 채우면, 같은 문제가 두 번 포함된 시험지가 생성됩니다. 후보군 크기 검증과 중복 제거가 모두 빠진 구조가 원인이었습니다.",
    solution:
      "후보 문제 수가 요청 수보다 적으면 즉시 실패 처리하고, 후보 목록 shuffle 후 앞에서 N개를 선택하는 비복원 추출 방식을 적용했습니다. 저장 전 선택 문제 ID 고유성을 검증하고 DB에 중복 제약도 추가했습니다.",
    result:
      "동일 문제가 반복 포함된 시험지 생성이 차단되었습니다. 후보가 부족하면 사용자에게 명확한 실패 응답을 반환해 시험 품질 기준이 흔들리지 않게 되었습니다.",
  },
};
