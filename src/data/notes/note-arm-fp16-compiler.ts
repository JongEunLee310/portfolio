import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const noteArmFp16Compiler: TechnicalNoteCard = {
  slug: "note-arm-fp16-compiler",
  title: "ARM Compiler FP16 컴파일 환경 구성",
  summary:
    "ARM Compiler와 armclang을 사용해 C/C++에서 __fp16, __Float16 타입을 컴파일하고 gemm_fp16 함수를 검증한 노트입니다.",
  category: "troubleshooting",
  thumbnail: publicPath("/images/notes/db-round-trip.svg"),
  date: "2022.02",
  readingTime: "7분 읽기",
  tags: [
    { name: "FP16", category: "ai" },
    { name: "ARM Compiler", category: "tool" },
    { name: "armclang", category: "tool" },
    { name: "C++", category: "language" },
  ],
  relatedProjectSlugs: ["arm-embedded-cnn-mixed-precision"],
  cardSummary: {
    title: "GCC FP16 업캐스팅으로 FP16 연산 효과 없음",
    problem:
      "YOLOv3-tiny conv 레이어에 __fp16 타입을 적용해 GCC로 빌드하면 빌드는 완료되지만, C 표준 float promotion 규칙에 따라 FP32로 자동 업캐스팅되어 FP32 대비 실행시간 차이가 없었습니다.",
    solution:
      "FP16 레이어 빌드를 ARM Compiler(armclang) 전용으로 분리했습니다. GCC는 __fp16을 저장 타입으로만 지원하며, armclang은 AArch64 ARMv8.2-A FP16 extension을 활용해 NEON float16 명령어를 자동 생성합니다.",
    result:
      "armclang 빌드에서 실제 FP16 NEON 명령어 생성을 확인했습니다. FP16 실험은 armclang 전용으로 진행하고, GCC 환경에서는 NEON intrinsic 수동 구현 또는 INT8 대체 방향을 수립했습니다.",
  },
};
