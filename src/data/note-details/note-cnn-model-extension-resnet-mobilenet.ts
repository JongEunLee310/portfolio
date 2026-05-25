import type { TechnicalNoteDetail } from "@/types/note";
import { noteCnnModelExtensionResnetMobilenet } from "../notes/note-cnn-model-extension-resnet-mobilenet";

export const noteCnnModelExtensionResnetMobilenetDetail: TechnicalNoteDetail = {
  ...noteCnnModelExtensionResnetMobilenet,
  template: "technical-summary",
  toc: [
    { id: "background", title: "확장 배경", depth: 1 },
    { id: "baseline", title: "모델별 baseline 확보", depth: 1 },
    { id: "challenges", title: "구조별 확장 과제", depth: 1 },
    { id: "plan", title: "확장 실험 계획", depth: 1 },
    { id: "lesson", title: "배운 점", depth: 1 },
  ],
  content: [
    {
      type: "heading",
      id: "background",
      title: "1. 확장 배경",
    },
    {
      type: "paragraph",
      content:
        "YOLOv3-tiny에 대한 Mixed Precision 실험을 완료한 후, 동일한 전략이 다른 CNN 모델에도 적용 가능한지 검증하기 위해 VGG16, VGG19, ResNet50, MobileNetV2로 확장 실험을 계획했습니다. 각 모델의 구조적 차이로 인해 YOLOv3-tiny에서 적용한 precision 할당 전략을 그대로 사용하기 어려웠습니다.",
    },
    {
      type: "heading",
      id: "baseline",
      title: "2. 모델별 baseline 확보",
    },
    {
      type: "metrics",
      items: [
        {
          label: "VGG16 (CIFAR-10)",
          before: "baseline 필요",
          after: "88.08%",
          change: "확정",
        },
        {
          label: "VGG19 (CIFAR-10)",
          before: "재학습 필요",
          after: "53.39%",
          change: "재학습 선행 필요",
        },
        {
          label: "ResNet50 (CIFAR-10)",
          before: "baseline 필요",
          after: "72.73%",
          change: "확정",
        },
        {
          label: "MobileNetV2 (CIFAR-10)",
          before: "구현 이슈",
          after: "-",
          change: "추가 작업 필요",
        },
      ],
    },
    {
      type: "heading",
      id: "challenges",
      title: "3. 구조별 확장 과제",
    },
    {
      type: "cards",
      items: [
        {
          title: "VGG (Sequential)",
          description:
            "VGG는 순차적 구조라 레이어 번호로 precision 할당이 비교적 단순합니다. YOLOv3-tiny와 유사하게 초기/후반 레이어 분리 전략을 적용할 수 있습니다. VGG19는 53.39% baseline이 낮아 재학습이 선행되어야 합니다.",
          badge: "비교적 단순",
        },
        {
          title: "ResNet50 (Residual Connection)",
          description:
            "Residual connection(skip connection)이 있어 INT8 양자화 시 residual add 연산의 precision 처리가 추가로 필요합니다. skip connection 양쪽의 precision이 다르면 add 연산 전에 변환이 필요합니다.",
          badge: "residual add 처리",
        },
        {
          title: "MobileNetV2 (Depthwise Separable)",
          description:
            "Depthwise separable conv는 channel-wise conv와 pointwise conv로 분리된 구조입니다. 두 연산의 precision을 각각 설정해야 하며 Darknet 기반 구현이 아닌 TensorFlow/Keras 기반이라 precision 플래그 추가 방식이 다릅니다.",
          badge: "추가 이슈",
        },
        {
          title: "프레임워크 차이",
          description:
            "YOLOv3-tiny는 Darknet cfg 파일로 precision 플래그를 직접 설정할 수 있습니다. VGG/ResNet/MobileNet은 TensorFlow/Keras 기반이라 동일한 방식을 사용할 수 없고 구현 방식이 모델마다 달라집니다.",
          badge: "구현 전략 분리",
        },
      ],
    },
    {
      type: "heading",
      id: "plan",
      title: "4. 확장 실험 계획",
    },
    {
      type: "paragraph",
      content:
        "VGG16(88.08%)과 ResNet50(72.73%)을 우선 실험 대상으로 확정했습니다. VGG19 재학습과 MobileNetV2 이슈 해결은 별도 트랙으로 분리했습니다. 일반화 검증은 YOLOv3-tiny와 구조가 가장 다른 ResNet50(residual connection)을 우선 대상으로 설정했습니다.",
    },
    {
      type: "list",
      items: [
        "ResNet50의 residual add 연산에 대한 precision 처리 방법을 먼저 설계합니다.",
        "MobileNetV2의 depthwise separable conv INT8 양자화 방법을 별도로 연구합니다.",
        "Mini ImageNet 데이터셋으로 실험을 확장해 CIFAR-10 외 도메인에서 일반화 가능성을 검증합니다.",
        "VGG16 우선으로 Mixed Precision 확장 실험을 진행하고, 레이어별 precision 할당 전략이 다른 모델에도 유효한지 검증합니다.",
      ],
    },
    {
      type: "heading",
      id: "lesson",
      title: "5. 배운 점",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "실험 확장 범위를 정할 때는 모델 구조의 차이가 구현 복잡도에 어떤 영향을 주는지 사전에 검토해야 합니다. 동일한 Mixed Precision 개념이라도 프레임워크(Darknet vs TensorFlow)나 모델 구조(sequential vs residual vs depthwise separable)에 따라 구현 방식이 달라집니다. YOLOv3-tiny에서 검증된 전략을 그대로 이식하려 하면 각 모델의 특수성을 놓칠 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "note-mixed-precision-cnn",
    "note-int8-quantization-overflow",
    "note-cnn-lightweight-optimization",
  ],
};
