import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const sensorLogTableGrowthQueryDegradation: TechnicalNoteCard = {
  slug: "sensor-log-table-growth-query-degradation",
  title: "센서 로그 테이블이 커지면서 조회 성능이 저하된 문제",
  summary:
    "스마트팜 모니터링 시스템에서 센서 데이터가 계속 누적되는 구조를 고려하지 않아 대시보드 최신값 조회와 기간 그래프 조회가 데이터 증가에 취약해질 수 있었던 문제와 조회 패턴 기반 설계 판단을 정리한 기록입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/smart-farm-db-replication.svg"),
  date: "2024.09",
  readingTime: "12분 읽기",
  tags: [
    { name: "Query Performance", category: "database" },
    { name: "Index", category: "database" },
    { name: "Time-series", category: "database" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "센서 로그 누적으로 인한 조회 성능 저하",
    problem: "센서 데이터가 단일 테이블에 계속 누적되는 구조에서 최신값 조회와 기간 그래프 조회가 데이터 증가에 따라 느려지는 구조",
    solution: "최신값 조회와 기간 조회 패턴을 분리해 인덱스 전략과 데이터 구조를 각 패턴에 맞게 최적화",
  },
};
