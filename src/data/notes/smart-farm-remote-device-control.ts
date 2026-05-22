import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmRemoteDeviceControl: TechnicalNoteCard = {
  slug: "smart-farm-remote-device-control",
  title: "API Server와 Device Controller를 통한 원격 디바이스 제어",
  summary:
    "사용자의 앱 제어 요청이 API Server와 Device Controller를 거쳐 ModbusTCP로 원격지 DAS에 전달되는 제어 흐름을 구현한 기록입니다.",
  category: "architecture",
  thumbnail: "/images/notes/smart-farm-remote-control.svg",
  date: "2024.11.02",
  readingTime: "9분 읽기",
  tags: [
    { name: "ModbusTCP", category: "backend" },
    { name: "IoT", category: "infra" },
    { name: "WebSocket", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
};
