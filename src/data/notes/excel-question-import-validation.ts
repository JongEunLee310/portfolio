import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const excelQuestionImportValidation: TechnicalNoteCard = {
  slug: "excel-question-import-validation",
  title: "Excel 문제 일괄 등록 중 일부 행 저장 문제",
  summary:
    "Excel 파일을 행 단위로 즉시 저장하면 중간 오류 발생 시 일부 행만 DB에 남는 부분 저장 상태가 만들어집니다. 전체 검증 후 일괄 저장하는 2단계 흐름으로 Excel 업로드의 원자성을 보장한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.26",
  readingTime: "11분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "Bulk Import", category: "backend" },
    { name: "Validation", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "Excel 문제 일괄 등록 중 일부 행 저장 문제",
    problem:
      "Excel 파일을 행 단위로 검증·저장하면 중간 행에서 오류 발생 시 이전 행이 이미 DB에 저장된 상태로 남습니다. 사용자는 전체 실패로 오해하지만 DB에는 일부 문제가 남아 재업로드 시 중복 저장 위험도 생깁니다.",
    solution:
      "파싱·검증·저장을 단계로 분리했습니다. 전체 행 검증을 먼저 수행하고 오류가 없을 때만 하나의 트랜잭션으로 일괄 저장합니다. 오류 시 행 번호와 사유를 함께 반환해 사용자가 수정 후 재업로드하도록 안내합니다.",
    result:
      "Excel 파일에 오류가 있으면 DB는 업로드 전 상태를 그대로 유지합니다. 전체 성공 또는 전체 실패의 명확한 결과와 행별 오류 위치가 제공되어 재업로드 시 중복 저장 없이 안전하게 처리됩니다.",
  },
};
