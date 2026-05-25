import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteCnnLightweightOptimization: TechnicalNoteCard = {
  slug: "note-cnn-lightweight-optimization",
  title: "ARM 임베디드 환경에서 CNN 경량화 전략",
  summary:
    "Jetson Nano에서 YOLOv3-tiny CNN 추론 경량화를 위한 접근법과 실험 결과를 정리한 노트입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2023.02",
  readingTime: "8분 읽기",
  tags: [
    { name: "CNN", category: "ai" },
    { name: "YOLOv3-tiny", category: "ai" },
    { name: "ARM", category: "infra" },
    { name: "Jetson Nano", category: "infra" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
  cardSummary: {
    title: "Jetson Nano 실험 시간 문제",
    problem: "Mini ImageNet 4만 장 실험도 Jetson Nano에서 1회 수행에 1~2일이 걸릴 정도로 오래 걸렸다.",
    solution: "전체 ImageNet 대신 Mini ImageNet을 사용하고, 데이터셋 축소 후 실험을 지속하는 방향을 선택했다.",
    result: "실험 가능성을 유지하면서 정확도, 실행시간, 메모리 사용량 비교 계획을 수립했다.",
  },
};
