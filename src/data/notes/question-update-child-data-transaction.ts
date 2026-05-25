import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const questionUpdateChildDataTransaction: TechnicalNoteCard = {
  slug: "question-update-child-data-transaction",
  title: "문제 수정 중 선택지/정답/해설 데이터 부분 반영 문제",
  summary:
    "문제 수정 API는 단일 테이블 변경이 아니라 선택지·정답·해설을 함께 바꾸는 복합 작업입니다. 트랜잭션 경계가 불명확하면 중간 실패 시 일부만 반영된 불완전한 문제가 남습니다. 검증을 저장 전에 완료하고 전체 흐름을 단일 트랜잭션으로 묶은 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.26",
  readingTime: "10분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Transaction", category: "backend" },
    { name: "JPA", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "문제 수정 시 하위 데이터 부분 반영 문제",
    problem:
      "문제 본문·선택지·정답·해설을 각각 저장하는 도중 중간 단계에서 예외가 발생하면, 앞서 저장된 데이터는 반영된 채로 불완전한 문제가 DB에 남습니다. 선택지는 바뀌었는데 정답이 기존 선택지를 가리키는 상태가 대표 사례입니다.",
    solution:
      "수정 요청 전체를 먼저 검증한 뒤 문제 본문·선택지·정답·해설 변경 전체를 하나의 트랜잭션으로 묶었습니다. 검증 실패는 저장 단계 진입 전에 차단하고, 저장 실패는 rollback으로 기존 데이터를 유지합니다.",
    result:
      "문제 수정 API가 성공하면 전체 반영, 실패하면 기존 상태 유지라는 명확한 규칙을 갖게 되었습니다. 채점·시험 생성 로직이 불완전한 문제를 방어하는 코드를 줄일 수 있습니다.",
  },
};
