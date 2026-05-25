import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const questionSearchFilterCondition: TechnicalNoteCard = {
  slug: "question-search-filter-condition",
  title: "문제 검색 필터 조합 시 조건 누락으로 인한 결과 오염",
  summary:
    "과목·난이도·키워드를 조합한 동적 검색에서 OR 조건이 전체 WHERE 절로 퍼지거나 삭제·권한 조건이 누락되면 의도하지 않은 문제가 검색 결과에 포함됩니다. 기본·선택·키워드 조건을 분리하고 OR 그룹핑을 명확히 한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/querydsl-projection.svg"),
  date: "2026.05.26",
  readingTime: "10분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "QueryDSL", category: "backend" },
    { name: "Dynamic Query", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "문제 검색 필터 조합 시 조건 누락으로 결과 오염",
    problem:
      "키워드 OR 조건이 전체 WHERE 절로 퍼지거나 soft delete·권한 조건이 일부 쿼리에서 누락되면, 삭제된 문제나 다른 사용자의 문제가 검색 결과에 섞입니다. 조건 개수가 아니라 AND/OR 결합 구조가 문제였습니다.",
    solution:
      "항상 적용되는 기본 조건, 요청 시에만 추가되는 선택 필터, 내부에서만 OR로 묶이는 키워드 그룹 세 계층으로 분리했습니다. 키워드 그룹은 전체 조건에 AND로 결합해 다른 필터를 우회하지 못하게 했습니다.",
    result:
      "복합 조건 조합 시 의도하지 않은 문제가 검색 결과에 포함되지 않게 되었습니다. 검색 결과의 신뢰성이 높아져 시험 생성·문제 관리 작업의 정확도가 함께 개선되었습니다.",
  },
};
