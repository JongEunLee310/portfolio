import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const sensorRestIngestionValidation: TechnicalNoteCard = {
  slug: "sensor-rest-ingestion-validation",
  title: "센서 REST 수집 API에서 입력값 검증 부족으로 잘못된 데이터가 저장된 문제",
  summary:
    "스마트팜 모니터링 시스템에서 센서 수집 API가 입력값을 검증하지 않아 비정상 데이터가 저장소와 후속 기능으로 전파될 수 있었던 문제와 검증 계층 설계 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/sensor-ingestion-validation.svg"),
  date: "2024.09",
  readingTime: "10분 읽기",
  tags: [
    { name: "Input Validation", category: "backend" },
    { name: "IoT", category: "infra" },
    { name: "Data Quality", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "센서 수집 API 입력 검증 부재로 비정상 데이터 저장",
    problem: "센서 수집 API에 입력값 검증이 없어 범위 초과·null·형식 오류 데이터가 DB에 저장되고 모니터링·알림 기능으로 전파",
    solution: "수집 API 경계에서 센서 ID·값 범위·타임스탬프 형식을 검증하고 비정상 데이터를 수신 즉시 거부",
  },
};
