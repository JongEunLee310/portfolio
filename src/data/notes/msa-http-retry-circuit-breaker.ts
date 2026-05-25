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
  cardSummary: {
    title: "서비스 간 HTTP 호출 타임아웃·재시도 미설정으로 즉시 503",
    problem:
      "sub-service가 순간 재시작 중일 때 httpx 타임아웃 설정이 없어 ConnectError가 즉시 503으로 전파됩니다. 지속 장애 시 core-api 이벤트 루프가 타임아웃 대기로 묶여 연쇄 장애 위험이 있었습니다.",
    solution:
      "httpx에 connect=3s, read=10s 타임아웃을 명시했습니다. tenacity로 ConnectError·ReadTimeout에 한해 지수 백오프 최대 3회 재시도를 설정하고, 4xx 응답은 재시도 대상에서 제외했습니다.",
    result:
      "일시적 오류 시 재시도로 성공률이 향상되고, 지속 장애 시 3~4초 내 빠른 실패로 자원을 회수합니다. 연쇄 장애 위험이 감소했습니다.",
  },
};
