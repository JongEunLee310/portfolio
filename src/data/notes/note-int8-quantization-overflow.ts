import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteInt8QuantizationOverflow: TechnicalNoteCard = {
  slug: "note-int8-quantization-overflow",
  title: "INT8 Quantization Overflow 분석",
  summary:
    "weight × input 및 convolution 누적 결과의 int8, int16, int24 범위별 overflow 비율을 측정하고 저장 타입 설계 근거를 도출한 노트입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2022.11",
  readingTime: "8분 읽기",
  tags: [
    { name: "INT8 Quantization", category: "ai" },
    { name: "CNN", category: "ai" },
    { name: "C", category: "language" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
};
