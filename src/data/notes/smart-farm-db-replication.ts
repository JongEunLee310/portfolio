import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmDbReplication: TechnicalNoteCard = {
  slug: "smart-farm-db-replication",
  title: "센서 데이터 손실 방지를 위한 Azure MySQL DB 이중화",
  summary:
    "실시간으로 누적되는 센서 데이터의 손실을 막기 위해 Azure MySQL DB 이중화 구조를 적용하고 저장 안정성을 확보한 기록입니다.",
  category: "database",
  thumbnail: publicPath("/images/notes/smart-farm-db-replication.svg"),
  date: "2024.10.18",
  readingTime: "7분 읽기",
  tags: [
    { name: "MySQL", category: "database" },
    { name: "Azure", category: "infra" },
    { name: "Replication", category: "database" },
  ],
  relatedProjectSlugs: ["smart-farm"],
};
