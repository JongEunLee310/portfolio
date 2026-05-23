import type { TechnicalNoteCard } from "@/types/note";

export const noteArmFp16Compiler: TechnicalNoteCard = {
  slug: "note-arm-fp16-compiler",
  title: "ARM Compiler FP16 컴파일 환경 구성",
  summary:
    "ARM Compiler와 armclang을 사용해 C/C++에서 __fp16, __Float16 타입을 컴파일하고 gemm_fp16 함수를 검증한 노트입니다.",
  category: "performance",
  thumbnail: "/images/notes/db-round-trip.svg",
  date: "2022.02",
  readingTime: "7분 읽기",
  tags: [
    { name: "FP16", category: "ai" },
    { name: "ARM Compiler", category: "tool" },
    { name: "armclang", category: "tool" },
    { name: "C++", category: "language" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
};
