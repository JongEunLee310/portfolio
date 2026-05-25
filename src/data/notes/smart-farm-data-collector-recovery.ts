import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmDataCollectorRecovery: TechnicalNoteCard = {
  slug: "smart-farm-data-collector-recovery",
  title: "원격지 Data Collector 수집 실패와 비정상 데이터 정상화",
  summary:
    "Azure VM에서 실행되는 Data Collector가 수집 실패하거나 비정상 데이터를 반환할 때 자동으로 정상화하는 구조를 설계한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/smart-farm-data-collector.svg"),
  date: "2024.10.12",
  readingTime: "8분 읽기",
  tags: [
    { name: "IoT", category: "infra" },
    { name: "Azure VM", category: "infra" },
    { name: "ModbusTCP", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "원격 센서 데이터 수집 안정화",
    problem: "원격지 DAS에서 수집되는 센서 값이 비정상적이거나 수집 실패가 발생할 수 있었다.",
    solution: "Data Collector를 Azure VM에서 실행하고, 비정상 데이터 수집 또는 수집 실패 시 정상화 기능을 개발했다.",
    result: "무정지 실시간 데이터 수집 환경을 목표로 안정적인 수집 구조를 구성했다.",
  },
};
