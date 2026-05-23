import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteIm2colGemmBottleneck: TechnicalNoteCard = {
  slug: "note-im2col-gemm-bottleneck",
  title: "im2col/GEMM 연산 병목 분석 실험",
  summary:
    "Convolution layer의 핵심 연산인 im2col과 GEMM의 계산량과 구조적 제약을 실험적으로 검증한 노트입니다.",
  category: "performance",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2021.10",
  readingTime: "9분 읽기",
  tags: [
    { name: "CNN", category: "ai" },
    { name: "im2col", category: "ai" },
    { name: "GEMM", category: "ai" },
    { name: "C", category: "language" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
};
