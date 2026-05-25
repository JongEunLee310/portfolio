import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const abnormalSensorValueDetection: TechnicalNoteCard = {
  slug: "abnormal-sensor-value-detection",
  title: "센서 이상값과 실제 환경 이상 상태를 구분하지 못한 문제",
  summary:
    "스마트팜 모니터링 프로젝트에서 습도 150%처럼 물리적으로 불가능한 센서 오류값과 토양 수분 부족 같은 실제 환경 이상값을 구분하지 않으면 오탐과 잘못된 제어 판단이 발생하는 점과, 이상값을 유형별로 분류해 후속 처리를 분리해야 했던 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath(
    "/images/notes/abnormal-sensor-value-detection.svg"
  ),
  date: "2024.09",
  readingTime: "12분 읽기",
  tags: [
    { name: "Abnormal Detection", category: "observability" },
    { name: "Data Quality", category: "observability" },
    { name: "Sensor Fault", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "센서 오류값과 실제 환경 이상값 미구분",
    problem: "습도 150% 같은 물리적 불가능 오류와 토양 수분 부족 같은 실제 환경 이상을 같은 방식으로 처리해 오탐과 잘못된 제어 판단 발생",
    solution: "이상값을 센서 오류·범위 경계·실제 환경 이상으로 분류해 유형별 후속 처리 경로를 분리",
  },
};
