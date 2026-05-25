import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const remoteControlDeviceStateMismatch: TechnicalNoteCard = {
  slug: "remote-control-device-state-mismatch",
  title: "원격 제어 명령과 실제 장비 상태가 일치하지 않는 문제",
  summary:
    "스마트팜 모니터링 프로젝트에서 원격 제어 기능을 구현할 때 API 요청 성공을 장비 동작 성공과 동일하게 취급하면, 사용자가 장비가 동작했다고 오해하거나 실제 상태를 잘못 판단하게 됩니다. 명령 상태와 실제 장비 상태를 분리해서 관리해야 했던 설계 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/smart-farm-remote-control.svg"),
  date: "2024.10",
  readingTime: "13분 읽기",
  tags: [
    { name: "Remote Actuation", category: "backend" },
    { name: "State Machine", category: "backend" },
    { name: "Device Control", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "원격 제어 명령 상태와 장비 실제 상태 불일치",
    problem: "API 요청 성공을 장비 동작 성공으로 취급해 사용자에게 잘못된 상태를 표시하고 미반영 명령이 누적",
    solution: "요청됨·전달됨·반영됨·실패함 단계로 명령 상태를 분리해 실제 장비 상태와 독립적으로 관리",
  },
};
