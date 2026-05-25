import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const sensorDataFlowResponsibilitySeparation: TechnicalNoteCard = {
  slug: "sensor-data-flow-responsibility-separation",
  title: "센서 수집, 저장, 조회 책임이 뒤섞여 발생한 데이터 흐름 복잡도 문제",
  summary:
    "스마트팜 모니터링 시스템에서 센서 데이터의 수집, 저장, 조회, 임계치 판단 책임이 분리되지 않아 발생하는 구조적 복잡도 문제와 책임 분리 설계 판단을 정리한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/sensor-data-flow.svg"),
  date: "2024.09",
  readingTime: "10분 읽기",
  tags: [
    { name: "Responsibility Separation", category: "backend" },
    { name: "IoT", category: "infra" },
    { name: "Sensor Data Pipeline", category: "backend" },
  ],
  relatedProjectSlugs: ["smart-farm"],
  cardSummary: {
    title: "센서 수집·저장·조회 책임 분리 설계",
    problem: "수집, 저장, 조회, 임계치 판단 로직이 같은 컴포넌트에 혼재해 각 역할의 변경이 다른 역할로 전파되는 구조적 복잡도 문제",
    solution: "Data Collector, Storage Layer, Query API, Monitoring Engine을 독립 역할로 분리해 변경 범위를 역할 단위로 제한",
  },
};
