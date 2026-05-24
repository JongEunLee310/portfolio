import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const msaRouterDeletionTest404: TechnicalNoteCard = {
  slug: "msa-router-deletion-test-404",
  title: "테스트 통과, 프로덕션 404 — MSA 라우터 삭제 후 의존성 주입 우회",
  summary:
    "MSA 코드 정리 중 라우터를 삭제하자 테스트는 초록인데 프로덕션은 404였습니다. FastAPI dependency_overrides가 라우터 등록 자체를 검증하지 않는 구조적 함정을 기록합니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2026.05.22",
  readingTime: "8분 읽기",
  tags: [
    { name: "FastAPI", category: "backend" },
    { name: "MSA", category: "infra" },
    { name: "pytest", category: "tool" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
