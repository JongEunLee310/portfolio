import type { TechnicalNoteDetail } from "@/types/note";
import { noteTensorflowCBindingArm } from "../notes/note-tensorflow-c-binding-arm";
import { troubleshootingHeading, troubleshootingToc } from "./_helpers";

export const noteTensorflowCBindingArmDetail: TechnicalNoteDetail = {
  ...noteTensorflowCBindingArm,
  template: "troubleshooting",
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "Jetson Nano(ARM Cortex-A57, 4GB) 환경에서 TensorFlow C API를 빌드해 YOLOv3-tiny inference를 TF 기반으로 전환하거나 Darknet 구현과 성능 비교를 시도했습니다. Bazel 빌드가 완료까지 약 34시간이 소요되었고, 빌드 중 메모리 부족으로 프로세스가 반복적으로 중단되었습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "TensorFlow Bazel 빌드는 대용량 C++ 코드를 병렬 컴파일합니다. Jetson Nano에서 기본 병렬도로 실행하면 동시 컴파일 작업 수가 RAM 용량을 초과해 OOM으로 중단됩니다.",
        "공식 TensorFlow ARM 빌드는 x86 대비 최적화 수준이 낮아 ARM NEON 벡터 최적화가 충분히 적용되지 않습니다.",
        "빌드 성공 후에도 Darknet 기반 구현 대비 유의미한 성능 차이가 없었습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "Bazel 병렬 작업 수를 -j 2로 제한하고 swap 공간을 8GB로 확장해 빌드를 완료했습니다. 빌드 결과물(libtensorflow.so)은 재사용을 위해 보관했고, TF C API 실험은 탐색적 시도로 기록하고 추가 개발하지 않기로 결정했습니다.",
    },
    troubleshootingHeading(3),
    {
      type: "comparison",
      items: [
        {
          title: "TensorFlow C API 경로",
          description:
            "Bazel로 직접 빌드해 libtensorflow.so를 생성합니다.",
          bullets: [
            "빌드 시간: 약 34시간 (swap 확장 후)",
            "메모리: 4GB RAM + 8GB swap",
            "ARM NEON 최적화 수준 제한적",
          ],
        },
        {
          title: "Darknet 기반 경로 (채택)",
          description:
            "Darknet 소스를 직접 수정해 Mixed Precision 분기를 구현합니다.",
          bullets: [
            "빌드 시간: 수십 초 수준",
            "ARM 임베디드 환경에 최적화된 경량 구현",
            "cfg 파일 기반 precision 플래그 실험 가능",
          ],
        },
        {
          title: "TensorFlow Lite (대안)",
          description:
            "Jetson Nano용 사전 빌드 패키지가 제공됩니다.",
          bullets: [
            "Bazel 빌드 불필요",
            "임베디드 환경 최적화",
            "Darknet 모델 변환 필요",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "TF C API Bazel 빌드 시간",
          before: "예상: 수 시간",
          after: "실제: 약 34시간",
          change: "x86 대비 수십 배",
        },
        {
          label: "최대 메모리 사용",
          before: "4GB RAM (OOM 발생)",
          after: "4GB RAM + 8GB swap (성공)",
          change: "swap 필수",
        },
        {
          label: "YOLOv3-tiny 메모리 사용량",
          before: "이론치: ~31MB",
          after: "실측(Raspberry Pi 4): 112MB",
          change: "약 3.6배 차이",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "cards",
      items: [
        {
          title: "방향 전환",
          description:
            "TF C API 경로는 탐색적 시도로 마무리하고, Darknet 기반 Mixed Precision 구현을 주요 개발 경로로 유지했습니다.",
        },
        {
          title: "빌드 환경 인사이트",
          description:
            "ARM 임베디드에서 대형 C++ 프레임워크 빌드는 x86 교차 컴파일이나 사전 빌드 바이너리가 현실적입니다.",
        },
      ],
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "info",
      content:
        "임베디드 ARM 환경에서 대형 C++ 프레임워크 빌드는 시간과 메모리 모두 큰 비용이 듭니다. x86 호스트에서 교차 컴파일하거나 사전 빌드 바이너리를 사용하는 것이 실용적입니다. TFLite는 Jetson Nano용 패키지가 제공되므로 TF C API 대신 TFLite로 전환하는 것이 현실적인 대안이었습니다.",
    },
  ],
  relatedNoteSlugs: [
    "note-cnn-lightweight-optimization",
    "note-mixed-precision-cnn",
    "note-yolov3-tiny-layer-architecture",
  ],
};
