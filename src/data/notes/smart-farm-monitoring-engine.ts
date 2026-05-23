import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmMonitoringEngine: TechnicalNoteCard = {
  slug: "smart-farm-monitoring-engine",
  title: "Monitoring Engine의 이상 값 감지와 Outlier 분리 저장",
  summary:
    "기준 값 기반으로 센서 이상 값을 감지하고 일반 데이터와 분리된 Outlier 테이블에 저장해 이력 추적과 알림 처리를 용이하게 한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/smart-farm-monitoring.svg"),
  date: "2024.11.15",
  readingTime: "8분 읽기",
  tags: [
    { name: "IoT", category: "infra" },
    { name: "MySQL", category: "database" },
    { name: "Monitoring", category: "observability" },
  ],
  relatedProjectSlugs: ["smart-farm"],
};
