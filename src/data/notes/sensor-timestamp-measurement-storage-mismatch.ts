import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const sensorTimestampMeasurementStorageMismatch: TechnicalNoteCard = {
  slug: "sensor-timestamp-measurement-storage-mismatch",
  title: "센서 측정 시각과 서버 저장 시각이 달라 데이터 정렬이 어긋난 문제",
  summary:
    "스마트팜 모니터링 시스템에서 센서 측정 시각과 서버 저장 시각을 구분하지 않아 대시보드 그래프와 최신값 조회가 실제 환경 변화 흐름과 어긋날 수 있었던 문제와 시간 기준 분리 설계 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/smart-farm-data-collector.svg"),
  date: "2024.09",
  readingTime: "12분 읽기",
  tags: [
    { name: "Timestamp", category: "backend" },
    { name: "IoT", category: "infra" },
    { name: "Time-series", category: "database" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "센서 측정 시각과 저장 시각 혼용으로 데이터 정렬 오류",
    problem: "측정 시각 대신 서버 저장 시각을 기준으로 데이터를 정렬해 대시보드 그래프와 최신값 조회가 실제 환경 변화 흐름과 어긋남",
    solution: "센서 측정 시각을 수집 페이로드에 포함하고 저장 시각과 구분해 관리, 조회 기준을 측정 시각으로 통일",
  },
};
