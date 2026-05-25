import type { TechnicalNoteDetail } from "@/types/note";
import { noteArmFp16Compiler } from "../notes/note-arm-fp16-compiler";

export const noteArmFp16CompilerDetail: TechnicalNoteDetail = {
  ...noteArmFp16Compiler,
  template: "technical-summary",
  toc: [
    { id: "background", title: "배경", depth: 1 },
    { id: "problem", title: "GCC에서 FP16이 동작하지 않는 이유", depth: 1 },
    { id: "solution", title: "이중 컴파일러 빌드 전략", depth: 1 },
    { id: "results", title: "컴파일러별 실행 결과", depth: 1 },
    { id: "lesson", title: "배운 점", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "background",
      title: "1. 배경",
    },
    {
      type: "paragraph",
      content:
        "YOLOv3-tiny Mixed Precision 실험에서 INT8, FP32 외에 FP16도 precision 옵션으로 검토했습니다. FP16은 이론적으로 NEON SIMD에서 FP32 대비 2배 처리량을 제공합니다. __fp16 타입을 conv 레이어에 적용하고 GCC로 빌드했지만 실행 시간이 FP32와 동일했습니다. FP16 연산이 실제로 수행되지 않고 FP32로 업캐스팅됨을 확인했습니다.",
    },
    {
      type: "heading",
      id: "problem",
      title: "2. GCC에서 FP16이 동작하지 않는 이유",
    },
    {
      type: "paragraph",
      content:
        "GCC의 __fp16은 저장 타입으로만 지원됩니다. C 표준의 'usual arithmetic conversion' 규칙에 따라 __fp16 변수에 산술 연산을 적용하면 float(FP32)로 자동 승격됩니다. 이는 GCC의 버그가 아니라 C 표준 동작입니다.",
    },
    {
      type: "code",
      language: "c",
      filename: "fp16-gcc-issue.c",
      code: "// GCC에서 FP16 연산 — 실제로는 FP32로 업캐스팅됨\n__fp16 a = 1.5f;\n__fp16 b = 2.5f;\n__fp16 c = a + b; // 내부적으로 float로 변환 후 연산, 결과를 __fp16으로 저장\n// 실행 시간: FP32와 동일 → FP16 연산 효과 없음\n\n// armclang에서 FP16 연산 — NEON float16 명령어 생성\n__fp16 a = 1.5f;\n__fp16 b = 2.5f;\n__fp16 c = a + b;\n// 실제 NEON vaddq_f16 명령어 사용 → FP16 처리량 달성",
    },
    {
      type: "heading",
      id: "solution",
      title: "3. 이중 컴파일러 빌드 전략",
    },
    {
      type: "cards",
      items: [
        {
          title: "GCC 빌드 (INT8/FP32)",
          description:
            "INT8과 FP32 precision은 GCC로 빌드합니다. Jetson Nano에서 무료로 사용 가능하며 int8_t, float 연산을 정확히 처리합니다.",
          badge: "주 실험 빌드",
        },
        {
          title: "armclang 빌드 (FP16)",
          description:
            "FP16 precision이 포함된 실험은 ARM Compiler(armclang)로 별도 빌드합니다. __fp16 연산을 NEON float16x8_t 명령어로 컴파일해 실제 FP16 처리량을 얻습니다.",
          badge: "FP16 전용",
        },
        {
          title: "기준값 분리 측정",
          description:
            "GCC-FP32와 armclang-FP32를 각각 기준으로 측정합니다. armclang은 GCC보다 약 4% 빠르므로 FP16 효과를 정확히 분리하려면 동일 컴파일러 기준이 필요합니다.",
          badge: "비교 기준",
        },
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "armclang은 상업용 라이센스가 필요합니다. FP16 전체 레이어 전략을 채택하면 전체 빌드가 armclang에 고착되므로 Mixed Precision에서 일부 레이어에만 FP16을 적용하고 나머지는 GCC로 빌드하는 이중 전략을 선택했습니다.",
    },
    {
      type: "heading",
      id: "results",
      title: "4. 컴파일러별 실행 결과",
    },
    {
      type: "metrics",
      items: [
        {
          label: "FP32 기준 (GCC)",
          before: "3.454s",
          after: "dog 81%, bicycle 38%, car 71%",
          change: "GCC 기준값",
        },
        {
          label: "FP32 기준 (armclang)",
          before: "3.454s (GCC)",
          after: "3.313s (armclang)",
          change: "약 4% 빠름",
        },
        {
          label: "FP16 (GCC)",
          before: "FP32와 동일",
          after: "FP16 NEON 명령어 미생성",
          change: "효과 없음",
        },
        {
          label: "INT8 전체 (GCC)",
          before: "3.454s",
          after: "2.21s",
          change: "-36%",
        },
      ],
    },
    {
      type: "heading",
      id: "lesson",
      title: "5. 배운 점",
    },
    {
      type: "list",
      items: [
        "__fp16 타입은 C 표준에서 완전히 정의된 것이 아닌 컴파일러 확장입니다. FP16 연산의 실제 수행 여부는 어셈블리 덤프나 perf로 확인해야 합니다.",
        "GCC에서 실제 FP16 SIMD 연산이 필요하면 NEON intrinsic(vaddq_f16 등)을 명시적으로 사용해야 합니다.",
        "실행 시간 비교표에는 반드시 컴파일러 정보를 표기해야 합니다. GCC-INT8과 armclang-FP32를 직접 비교하면 컴파일러 효과와 precision 효과가 혼재됩니다.",
        "ARMv8.2-A 이상 플랫폼에서 GCC에 --march=armv8.2-a+fp16 플래그를 전달하면 FP16 코드 생성이 가능해질 수 있으나 GCC 버전 제약이 있습니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "note-mixed-precision-cnn",
    "note-int8-quantization-overflow",
    "note-cnn-lightweight-optimization",
  ],
};
