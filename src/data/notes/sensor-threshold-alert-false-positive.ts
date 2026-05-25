import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const sensorThresholdAlertFalsePositive: TechnicalNoteCard = {
  slug: "sensor-threshold-alert-false-positive",
  title: "센서 임계치 알림 조건이 단순 비교에 머물러 오탐이 발생한 문제",
  summary:
    "스마트팜 모니터링 프로젝트에서 센서값이 기준을 한 번이라도 넘으면 알림을 발생시키는 단순 임계치 비교 방식이 순간적인 센서 튐이나 통신 오류와 실제 환경 이상을 구분하지 못한다는 점과, 지속성·연속성 기반 알림 조건 설계가 필요했던 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath(
    "/images/notes/sensor-threshold-alert-false-positive.svg"
  ),
  date: "2024.09",
  readingTime: "13분 읽기",
  tags: [
    { name: "Alert Design", category: "observability" },
    { name: "False Positive", category: "observability" },
    { name: "Threshold", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "임계치 단순 비교로 발생한 알림 오탐",
    problem: "센서값이 기준을 한 번이라도 넘으면 알림을 발생시키는 구조가 순간적인 센서 튐이나 통신 오류와 실제 환경 이상을 구분하지 못함",
    solution: "지속성·연속성 기반 조건으로 알림 트리거를 재설계해 오탐률을 낮추고 실제 이상 상황에 집중",
  },
};
