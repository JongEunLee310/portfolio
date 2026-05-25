import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const latestSensorValueQueryOptimization: TechnicalNoteCard = {
  slug: "latest-sensor-value-query-optimization",
  title: "최신 센서값 조회 시 불필요한 전체 데이터 조회가 발생한 문제",
  summary:
    "스마트팜 대시보드에서 현재 상태를 표시하기 위해 센서 최신값을 조회할 때 전체 이력을 가져오는 방식으로 인해 데이터 누적에 취약해질 수 있었던 문제와 조회 목적 분리 및 쿼리 최적화 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath(
    "/images/notes/latest-sensor-value-query-optimization.svg"
  ),
  date: "2024.09",
  readingTime: "12분 읽기",
  tags: [
    { name: "Query Performance", category: "database" },
    { name: "Index", category: "database" },
    { name: "Time-series", category: "database" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "최신 센서값 조회에서 전체 이력 스캔 발생",
    problem: "대시보드 현재 상태 표시를 위한 최신값 조회가 전체 이력 테이블을 스캔하는 방식으로 데이터 누적에 취약",
    solution: "조회 목적을 최신값 조회와 기간 이력 조회로 분리하고 각 패턴에 맞는 인덱스와 쿼리를 설계",
  },
};
