import type { TechnicalNoteDetail } from "@/types/note";
import { noteCnnLightweightOptimization } from "../notes/note-cnn-lightweight-optimization";

export const noteCnnLightweightOptimizationDetail: TechnicalNoteDetail = {
  ...noteCnnLightweightOptimization,
  template: "technical-summary",
  toc: [
    { id: "background", title: "실험 환경과 목표", depth: 1 },
    { id: "strategies", title: "경량화 전략 비교", depth: 1 },
    { id: "results", title: "실험 결과", depth: 1 },
    { id: "memory", title: "메모리 분석", depth: 1 },
    { id: "lesson", title: "배운 점", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "background",
      title: "1. 실험 환경과 목표",
    },
    {
      type: "paragraph",
      content:
        "Jetson Nano(ARM Cortex-A57 4코어, 4GB RAM)에서 YOLOv3-tiny inference를 경량화하는 것이 목표였습니다. FP32 단독 실행 시 3.45~3.9초가 소요되어 실시간 처리가 불가능한 수준이었습니다. 정확도 손실을 최소화하면서 실행 시간을 줄이기 위한 여러 전략을 실험했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "모든 실험은 동일한 이미지(dog.jpg)와 동일한 detection threshold를 사용해 dog, car, bicycle 객체의 confidence를 측정하며 비교했습니다.",
    },
    {
      type: "heading",
      id: "strategies",
      title: "2. 경량화 전략 비교",
    },
    {
      type: "cards",
      items: [
        {
          title: "INT8 전체 레이어",
          description:
            "모든 conv 레이어에 INT8 양자화를 적용합니다. 실행 시간은 크게 줄지만 detection confidence가 크게 하락합니다(dog 81% → 31%). YOLO head 근처 레이어의 overflow로 인해 accuracy 손실이 큽니다.",
          badge: "속도 ↑ 정확도 ↓↓",
        },
        {
          title: "FP16 전체 레이어",
          description:
            "armclang 전용으로만 실제 FP16 연산이 수행됩니다. GCC에서는 FP32로 업캐스팅되어 효과가 없습니다. armclang에서도 실행 시간 단축이 INT8 대비 제한적이었습니다.",
          badge: "컴파일러 의존",
        },
        {
          title: "Mixed Precision",
          description:
            "초기 레이어(conv0~conv9)에 INT8, 후반 레이어(conv10 이후)와 YOLO head 직전은 FP32를 유지합니다. accuracy 손실을 줄이면서 일부 속도 향상을 달성합니다.",
          badge: "균형 전략",
        },
        {
          title: "Conv-Maxpool 통합",
          description:
            "INT8 conv 다음에 오는 maxpool을 dequantize 없이 INT8 상태로 수행합니다. max 비교는 정수 도메인에서 수행 가능하므로 precision 변환 오버헤드를 줄일 수 있습니다.",
          badge: "추가 최적화",
        },
      ],
    },
    {
      type: "heading",
      id: "results",
      title: "3. 실험 결과",
    },
    {
      type: "metrics",
      items: [
        {
          label: "FP32 전체 (GCC 기준)",
          before: "3.45s",
          after: "dog 81%, bicycle 38%, car 71%",
          change: "기준값",
        },
        {
          label: "INT8 전체 (GCC)",
          before: "3.45s",
          after: "2.21s",
          change: "-36%",
        },
        {
          label: "Mixed Precision (초기 INT8 + 후반 FP32)",
          before: "3.45s",
          after: "3.86s",
          change: "정확도 회복 우선",
        },
        {
          label: "FP32 기준 (armclang)",
          before: "3.45s (GCC)",
          after: "3.31s (armclang)",
          change: "컴파일러 4% 차이",
        },
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "INT8 전체 적용 시 실행 시간은 단축되지만 detection confidence가 크게 하락합니다. dog 81% → 31%, bicycle은 미검출 수준으로 떨어집니다. Mixed Precision으로 dog 57%, bicycle 59%, car 52% 수준까지 회복이 가능했습니다.",
    },
    {
      type: "heading",
      id: "memory",
      title: "4. 메모리 분석",
    },
    {
      type: "paragraph",
      content:
        "레이어별 activation 메모리만 계산하면 이론치는 약 31 MB이지만, Raspberry Pi 4 실측값은 112 MB였습니다. weight 파일 로드(~34 MB), route layer 참조 버퍼, Darknet workspace 사전 할당, 프로세스 오버헤드가 추가됩니다. Jetson Nano 4 GB에서는 메모리가 제약이 되지 않았지만, 더 작은 디바이스에서는 weight INT8 양자화로 weight 메모리를 줄이는 것이 중요합니다.",
    },
    {
      type: "heading",
      id: "lesson",
      title: "5. 배운 점",
    },
    {
      type: "list",
      items: [
        "단순히 전체 레이어에 INT8을 적용하는 것은 실용적이지 않습니다. 레이어별 overflow 분포를 분석한 후 precision을 선택해야 합니다.",
        "컴파일러 종류(GCC vs armclang)가 FP16 연산 실행 여부를 결정합니다. 동일 코드라도 컴파일러에 따라 결과가 달라지므로 실험 시 컴파일러 정보를 반드시 표기해야 합니다.",
        "메모리 사용량 추정 시 weight, route 버퍼, workspace를 포함해야 합니다. activation 이론치만으로는 실측값을 크게 과소평가합니다.",
        "NVDLA, RISC-V VP 등 하드웨어 가속기는 지원 레이어 타입의 제약이 있습니다. YOLOv3-tiny의 route, upsample은 NVDLA에서 미지원되어 CPU 기반 구현을 유지했습니다.",
      ],
    },
  ],
  relatedNoteSlugs: [
    "note-int8-quantization-overflow",
    "note-mixed-precision-cnn",
    "note-conv-maxpool-integration",
  ],
};
