import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const msaHttpRetryCircuitBreaker: TechnicalNoteCard = {
  slug: "msa-http-retry-circuit-breaker",
  title: "서비스 간 HTTP 호출 내결함성 — 재시도와 서킷 브레이커",
  summary:
    "sub-service가 순간 다운됐을 때 즉시 503을 반환하던 문제를 tenacity로 해결했습니다. 타임아웃 명시, 지수 백오프 재시도, 서킷 브레이커 패턴을 정리합니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2026.05.22",
  readingTime: "10분 읽기",
  tags: [
    { name: "MSA", category: "infra" },
    { name: "FastAPI", category: "backend" },
    { name: "Python", category: "backend" },
  ],
  relatedProjectSlugs: ["ai-devops-orchestration-platform"],
};
