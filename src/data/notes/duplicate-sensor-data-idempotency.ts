import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const duplicateSensorDataIdempotency: TechnicalNoteCard = {
  slug: "duplicate-sensor-data-idempotency",
  title: "센서 데이터 재전송으로 인한 중복 저장 문제",
  summary:
    "스마트팜 모니터링 시스템에서 센서·게이트웨이의 재전송 특성을 고려하지 않아 같은 측정 이벤트가 DB에 중복 저장될 수 있었던 문제와 멱등성 기준 설계 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/smart-farm-data-collector.svg"),
  date: "2024.09",
  readingTime: "12분 읽기",
  tags: [
    { name: "Idempotency", category: "backend" },
    { name: "IoT", category: "infra" },
    { name: "Data Integrity", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "센서 재전송으로 인한 중복 데이터 저장",
    problem: "센서와 게이트웨이의 재전송 특성을 고려하지 않아 같은 측정 이벤트가 DB에 중복 저장될 수 있는 구조",
    solution: "장치 ID와 측정 시각 조합을 멱등성 기준으로 정의해 중복 수신 시 저장을 건너뛰도록 설계",
  },
};
