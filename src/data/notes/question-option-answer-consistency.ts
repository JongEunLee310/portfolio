import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const questionOptionAnswerConsistency: TechnicalNoteCard = {
  slug: "question-option-answer-consistency",
  title: "문제 등록 시 선택지와 정답 개수 불일치",
  summary:
    "문제 유형에 따라 선택지와 정답 조건이 달라지는데 공통 필드 검증만 수행하면 채점 불가 문제가 저장될 수 있습니다. DTO 형식 검증과 Service 계층 도메인 검증을 분리해 등록 시점에 정합성을 강제한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.26",
  readingTime: "10분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Domain Validation", category: "backend" },
    { name: "Input Validation", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "문제 등록 시 선택지·정답 정합성 검증 누락",
    problem:
      "객관식·단답형 등 문제 유형마다 선택지와 정답 조건이 다른데 공통 필드 검증만 수행해 정답이 없는 객관식 문제, 선택지가 1개뿐인 객관식 문제 등 잘못된 데이터 저장이 가능했습니다.",
    solution:
      "Request DTO는 기본 형식과 필수값 검증 담당, Service 계층에서 유형별 도메인 검증(정답 개수, 선택지 존재 여부, 정답-선택지 포함 관계) 수행. 등록과 수정에 같은 Validator 재사용",
    result:
      "잘못된 문제 데이터를 등록 시점에 차단. 채점·시험 생성 로직이 정합한 문제를 전제로 처리 가능해져 불필요한 방어 코드 제거",
  },
};
