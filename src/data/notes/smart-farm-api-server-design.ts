import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmApiServerDesign: TechnicalNoteCard = {
  slug: "smart-farm-api-server-design",
  title: "스마트팜 IoT 서비스 API Server 설계",
  summary:
    "수집, 저장, 이상 감지, 알림, 제어를 통합하는 스마트팜 API Server의 엔드포인트 구조와 서비스 간 책임 분리를 정리한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/smart-farm-api-design.svg"),
  date: "2024.09.20",
  readingTime: "10분 읽기",
  tags: [
    { name: "REST API", category: "backend" },
    { name: "IoT", category: "infra" },
    { name: "Azure", category: "infra" },
  ],
  relatedProjectSlugs: ["smart-farm"],
};
