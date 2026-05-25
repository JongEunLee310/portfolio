import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const softDeleteQueryLeak: TechnicalNoteCard = {
  slug: "soft-delete-query-leak",
  title: "Soft Delete 문제 데이터가 검색과 시험 생성에 노출되는 문제",
  summary:
    "Soft Delete를 도입했지만 일부 조회 쿼리에서 deleted_at IS NULL 조건이 누락되면 삭제된 문제가 검색 결과와 시험 생성 후보에 포함됩니다. 일반 조회와 관리자 복구 조회를 Repository 메서드 수준에서 명확히 분리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.26",
  readingTime: "11분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Soft Delete", category: "backend" },
    { name: "Query", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "Soft Delete 문제 데이터가 검색과 시험 생성에 노출되는 문제",
    problem:
      "Soft Delete를 도입해도 일부 조회 쿼리에 deleted_at IS NULL 조건이 빠지면 삭제된 문제가 일반 검색 결과와 시험 생성 후보에 포함됩니다. 폐기된 문제가 다시 시험지에 출제되는 상황이 발생합니다.",
    solution:
      "Repository 메서드를 active 조회와 deleted 조회로 명확히 분리했습니다. 일반 서비스는 active 조회 메서드만 사용하고, 시험 생성 후보 쿼리에는 삭제 조건을 필수로 포함합니다.",
    result:
      "삭제된 문제는 일반 목록, 검색, 시험 생성 후보에서 제외됩니다. 관리자 복구 기능은 명시적으로 분리된 deleted 조회를 통해서만 접근할 수 있습니다.",
  },
};
