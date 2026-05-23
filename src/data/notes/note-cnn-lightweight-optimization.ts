import type { TechnicalNoteCard } from "@/types/note";

export const noteCnnLightweightOptimization: TechnicalNoteCard = {
  slug: "note-cnn-lightweight-optimization",
  title: "ARM 임베디드 환경에서 CNN 경량화 전략",
  summary:
    "Jetson Nano에서 YOLOv3-tiny CNN 추론 경량화를 위한 접근법과 실험 결과를 정리한 노트입니다.",
  category: "performance",
  thumbnail: "/images/notes/db-round-trip.svg",
  date: "2023.02",
  readingTime: "8분 읽기",
  tags: [
    { name: "CNN", category: "ai" },
    { name: "YOLOv3-tiny", category: "ai" },
    { name: "ARM", category: "infra" },
    { name: "Jetson Nano", category: "infra" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
};
