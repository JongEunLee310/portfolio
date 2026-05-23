import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteConvMaxpoolIntegration: TechnicalNoteCard = {
  slug: "note-conv-maxpool-integration",
  title: "Conv-Maxpool 통합 실행으로 수행시간 감소",
  summary:
    "Conv layer 직후 Maxpool을 별도 실행하지 않고 통합 처리해 평균 5% 수행시간 감소를 달성한 실험 노트입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2022.12",
  readingTime: "8분 읽기",
  tags: [
    { name: "CNN", category: "ai" },
    { name: "YOLOv3-tiny", category: "ai" },
    { name: "C", category: "language" },
    { name: "Jetson Nano", category: "infra" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
};
