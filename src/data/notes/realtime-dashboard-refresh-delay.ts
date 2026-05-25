import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const realtimeDashboardRefreshDelay: TechnicalNoteCard = {
  slug: "realtime-dashboard-refresh-delay",
  title: "대시보드 갱신 주기와 센서 수집 주기가 맞지 않아 실시간성이 떨어진 문제",
  summary:
    "스마트팜 모니터링 프로젝트에서 센서 측정·전송·저장·조회·렌더링으로 이어지는 여러 지연 구간이 존재하는데, 이를 단일 '실시간 조회'로 단순화하면 갱신 주기가 수집 주기와 맞지 않게 되고 데이터 신선도를 사용자가 알 수 없다는 점과, 수집 주기 기반 polling 설계와 마지막 측정 시각 표시가 필요했던 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/smart-farm-monitoring.svg"),
  date: "2024.09",
  readingTime: "12분 읽기",
  tags: [
    { name: "Polling", category: "backend" },
    { name: "Data Freshness", category: "observability" },
    { name: "Realtime", category: "observability" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "수집 주기와 갱신 주기 불일치로 인한 실시간성 저하",
    problem: "센서 측정·전송·저장·조회·렌더링 각 단계의 지연을 단순 polling으로 처리해 갱신 주기가 수집 주기와 맞지 않고 데이터 신선도를 사용자가 알 수 없음",
    solution: "수집 주기 기반 polling 간격 설계와 마지막 측정 시각 표시로 사용자가 데이터 신선도를 인지할 수 있도록 개선",
  },
};
