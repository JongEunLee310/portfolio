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
  cardSummary: {
    title: "라우터 삭제 후 테스트 통과·프로덕션 404 불일치",
    problem:
      "MSA 코드 정리 중 pipelines.py 라우터를 삭제하자 run·retry 엔드포인트가 앱에 미등록됐습니다. 기존 테스트는 dependency_overrides로 서비스 레이어를 직접 교체해 라우터 등록 여부를 검증하지 않아 통과됐습니다.",
    solution:
      "삭제한 라우터 기능을 pipeline_runs.py에 pipelines_router로 재구현하고 main.py에 include_router를 등록했습니다. OpenAPI 문서로 경로 등록 여부를 확인했습니다.",
    result:
      "run·retry 엔드포인트 404 해소. dependency_overrides가 라우터 존재 자체를 검증하지 않는다는 구조적 함정을 파악하고, 스모크 테스트 필요성을 확인했습니다.",
  },
};
