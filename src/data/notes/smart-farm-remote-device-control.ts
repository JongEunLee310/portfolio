import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const smartFarmRemoteDeviceControl: TechnicalNoteCard = {
  slug: "smart-farm-remote-device-control",
  title: "API Server와 Device Controller를 통한 원격 디바이스 제어",
  summary:
    "사용자의 앱 제어 요청이 API Server와 Device Controller를 거쳐 ModbusTCP로 원격지 DAS에 전달되는 제어 흐름을 구현한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/smart-farm-remote-control.svg"),
  date: "2024.11.02",
  readingTime: "9분 읽기",
  tags: [
    { name: "ModbusTCP", category: "backend" },
    { name: "IoT", category: "infra" },
    { name: "WebSocket", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "원격 디바이스 제어 연동",
    problem: "사용자의 앱 제어 요청을 실제 원격지 디바이스 동작으로 연결해야 했다.",
    solution: "API Server가 Device Controller를 호출하고, Device Controller가 DAS와 ModbusTCP로 통신해 제어를 수행하도록 구성했다.",
    result: "사용자가 현장에 가지 않고도 디바이스를 제어할 수 있는 흐름을 구현했다.",
  },
};
