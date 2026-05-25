import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const questionImageUploadOrphanFile: TechnicalNoteCard = {
  slug: "question-image-upload-orphan-file",
  title: "문제 이미지 수정/삭제 후 스토리지 고아 파일 발생",
  summary:
    "문제 이미지를 교체하거나 삭제할 때 DB 경로만 변경하면 기존 스토리지 파일이 고아 파일로 누적됩니다. DB 저장 실패 시 새 파일 삭제, 기존 파일 삭제 실패 시 재처리 예약으로 파일 생명주기를 관리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.26",
  readingTime: "12분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "File Storage", category: "backend" },
    { name: "Object Storage", category: "backend" },
  ],
  relatedProjectSlugs: ["goorm-bank-problem-bank"],
  cardSummary: {
    title: "문제 이미지 수정/삭제 후 스토리지 고아 파일 발생",
    problem:
      "문제 이미지를 교체할 때 DB 경로만 새 이미지로 변경하면 기존 파일이 스토리지에 그대로 남습니다. DB 저장 실패 시 새로 업로드한 파일도 고아 파일이 되고, 파일 삭제 실패는 조용히 누적됩니다.",
    solution:
      "이미지 교체 흐름을 업로드 → DB 저장 → 기존 파일 정리 단계로 분리했습니다. DB 저장 실패 시 새 파일을 즉시 삭제하고, DB 저장 성공 후 기존 파일 삭제 실패는 재처리 대상으로 기록합니다.",
    result:
      "DB 저장 실패 시 새 파일이 고아 파일로 남지 않습니다. 기존 파일 삭제 실패도 재처리 가능한 형태로 기록되어 스토리지와 DB 상태를 점진적으로 일치시킬 수 있습니다.",
  },
};
