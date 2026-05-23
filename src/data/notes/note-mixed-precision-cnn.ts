import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteMixedPrecisionCnn: TechnicalNoteCard = {
  slug: "note-mixed-precision-cnn",
  title: "CNN Mixed Precision 프레임워크 설계",
  summary:
    "FP32, FP16, INT8 정밀도를 레이어별로 선택할 수 있는 Mixed Precision 분기 시스템 설계와 구현 과정을 정리한 노트입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2022.04",
  readingTime: "12분 읽기",
  tags: [
    { name: "Mixed Precision", category: "ai" },
    { name: "CNN", category: "ai" },
    { name: "FP16", category: "ai" },
    { name: "INT8 Quantization", category: "ai" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
};
