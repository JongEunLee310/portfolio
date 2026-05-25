import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmCloudMonitoringArchitecture: TechnicalNoteCard = {
  slug: "smart-farm-cloud-monitoring-architecture",
  title: "온프레미스 한계와 클라우드 기반 모니터링 구조 전환",
  summary:
    "원격 모니터링 목표를 만족시키기 위해 온프레미스 서버 의존 구조에서 클라우드 API 서버 중심 구조로 전환한 설계 판단을 정리한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/smart-farm-monitoring.svg"),
  date: "2024.09",
  readingTime: "8분 읽기",
  tags: [
    { name: "Cloud Architecture", category: "infra" },
    { name: "IoT", category: "infra" },
    { name: "Azure", category: "infra" },
  ],
  relatedProjectSlugs: ["smart-farm"],
};
