import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmDataCollectorRecovery: TechnicalNoteCard = {
  slug: "smart-farm-data-collector-recovery",
  title: "원격지 Data Collector 수집 실패와 비정상 데이터 정상화",
  summary:
    "Azure VM에서 실행되는 Data Collector가 수집 실패하거나 비정상 데이터를 반환할 때 자동으로 정상화하는 구조를 설계한 기록입니다.",
  category: "troubleshooting",
  thumbnail: "/images/notes/smart-farm-data-collector.svg",
  date: "2024.10.12",
  readingTime: "8분 읽기",
  tags: [
    { name: "IoT", category: "infra" },
    { name: "Azure VM", category: "infra" },
    { name: "ModbusTCP", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
};
