import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const roleBasedQuestionAccess: TechnicalNoteCard = {
  slug: "role-based-question-access",
  title: "역할별 문제 접근 권한 검증 누락",
  summary:
    "역할 기반 인가만으로는 같은 역할을 가진 사용자 간 리소스 경계를 막을 수 없습니다. 소유권·배정 여부를 조회 조건에 함께 포함해 문제 ID 직접 접근(IDOR) 취약점과 권한 범위 우회를 방어한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.26",
  readingTime: "11분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Authorization", category: "backend" },
    { name: "Security", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "역할별 문제 접근 권한 검증 누락",
    problem:
      "역할 여부만 확인하고 리소스 소유권·배정 여부를 확인하지 않으면, 같은 역할을 가진 다른 사용자의 문제를 조회·수정하거나 배정되지 않은 시험 문제에 접근하는 IDOR 취약점이 발생합니다.",
    solution:
      "문제 조회·수정·삭제 시 questionId 단독 조회 대신 owner_id, deleted_at, 시험 배정 여부를 조건에 포함해 조회합니다. 인증은 Security에서, 역할 기능 접근은 Controller에서, 리소스 소유권은 Service에서 각각 책임을 분리했습니다.",
    result:
      "문제 ID를 직접 호출해도 접근 조건을 만족하지 못하면 결과가 반환되지 않습니다. 역할·소유권·상태·배정 여부를 계층별로 검증해 리소스 단위 접근 통제를 보장합니다.",
  },
};
