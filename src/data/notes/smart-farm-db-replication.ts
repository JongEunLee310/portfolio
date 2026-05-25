import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmDbReplication: TechnicalNoteCard = {
  slug: "smart-farm-db-replication",
  title: "센서 데이터 손실 방지를 위한 Azure MySQL DB 이중화",
  summary:
    "실시간으로 누적되는 센서 데이터의 손실을 막기 위해 Azure MySQL DB 이중화 구조를 적용하고 저장 안정성을 확보한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/smart-farm-db-replication.svg"),
  date: "2024.10.18",
  readingTime: "7분 읽기",
  tags: [
    { name: "MySQL", category: "database" },
    { name: "Azure", category: "infra" },
    { name: "Replication", category: "database" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "DB 저장 및 데이터 손실 방지",
    problem: "센서 데이터가 실시간으로 누적되기 때문에 데이터 손실이 발생하면 모니터링 신뢰성이 낮아질 수 있었다.",
    solution: "Azure MySQL DB 저장 구조와 DB 이중화 전략을 적용했다.",
    result: "데이터 손실 방지를 고려한 클라우드 DB 구조를 설계했다.",
  },
};
