import type { TechnicalNoteDetail } from "@/types/note";
import { noteYolov3TinyLayerArchitecture } from "../notes/note-yolov3-tiny-layer-architecture";

export const noteYolov3TinyLayerArchitectureDetail: TechnicalNoteDetail = {
  ...noteYolov3TinyLayerArchitecture,
  template: "technical-summary",
  toc: [
    { id: "background", title: "배경", depth: 1 },
    { id: "layer-types", title: "레이어 타입별 역할", depth: 1 },
    { id: "detection-flow", title: "Detection 흐름", depth: 1 },
    { id: "precision-implication", title: "Mixed Precision 적용 시 주의점", depth: 1 },
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
        "YOLOv3-tiny를 Jetson Nano(ARM Cortex-A57)에서 실행하기 위해 네트워크 구조를 코드 수준에서 먼저 분석했습니다. Darknet은 cfg 파일로 레이어 타입과 파라미터를 정의하고, 코드에서는 parser.c가 이를 파싱해 layer 구조체 배열로 변환합니다. Mixed Precision을 적용하려면 각 레이어 타입이 어떤 연산을 하는지, 어떤 레이어가 precision 변환 대상인지를 먼저 파악해야 했습니다.",
    },
    {
      type: "heading",
      id: "layer-types",
      title: "2. 레이어 타입별 역할",
    },
    {
      type: "cards",
      items: [
        {
          title: "CONVOLUTIONAL",
          description:
            "conv weight와 activation에 대한 im2col+GEMM 연산을 수행합니다. Mixed Precision에서 fp32/fp16/int8 플래그 적용 대상입니다.",
          badge: "precision 대상",
        },
        {
          title: "MAXPOOL",
          description:
            "수용 영역 내 최댓값을 선택하는 연산입니다. max 비교는 INT8 정수 그대로 수행할 수 있어 precision 변환 없이 통합 실행이 가능합니다.",
          badge: "fusion 가능",
        },
        {
          title: "ROUTE",
          description:
            "이전 레이어의 output을 참조해 feature map을 concatenate합니다. FPN 구조의 핵심이며, 참조 대상 레이어의 output이 메모리에 유지되어야 합니다.",
          badge: "메모리 유지",
        },
        {
          title: "UPSAMPLE / YOLO",
          description:
            "UPSAMPLE은 feature map을 2배 확장합니다. YOLO 레이어는 anchor 기반 bbox와 confidence를 최종 출력합니다. 두 타입 모두 precision 플래그 대상이 아닙니다.",
          badge: "FP32 고정",
        },
      ],
    },
    {
      type: "heading",
      id: "detection-flow",
      title: "3. Detection 흐름",
    },
    {
      type: "paragraph",
      content:
        "YOLOv3-tiny는 총 23개 레이어로 구성됩니다. 입력 이미지(416×416×3)가 conv+maxpool 블록을 통과하며 feature map이 생성되고, route layer가 두 스케일의 feature를 concatenate해 두 개의 YOLO detection head(conv15→yolo16, conv22→yolo23)로 출력합니다. 이 FPN 구조로 인해 route layer(layer 17, 20)가 이전 레이어를 참조하므로 해당 레이어의 output 버퍼가 GC되지 않고 메모리에 유지됩니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "yolov3-tiny.cfg (layer 구조 요약)",
      code: "conv0  → max1 → conv2 → max3 → conv4 → max5\n→ conv6 → max7 → conv8 → max9 → conv10 → max11\n→ conv12 → conv13 (route 참조 대상)\n→ conv14 → yolo15 (head 1, 13×13)\n→ route16 ← conv13\n→ conv17 → upsample18\n→ route19 ← upsample18 + max11\n→ conv20 → conv21 → yolo22 (head 2, 26×26)",
    },
    {
      type: "heading",
      id: "precision-implication",
      title: "4. Mixed Precision 적용 시 주의점",
    },
    {
      type: "list",
      items: [
        "precision 플래그(fp32/fp16/int8)는 CONVOLUTIONAL 레이어에만 적용됩니다. route, upsample, yolo 타입에는 플래그를 설정해도 동작하지 않습니다.",
        "YOLO head 직전 conv 레이어(conv14, conv21)는 bbox 좌표와 confidence에 직접 영향을 주므로 FP32를 유지해야 accuracy 손실을 최소화할 수 있습니다.",
        "NVDLA는 conv, maxpool만 지원하며 route, upsample, yolo는 미지원입니다. YOLOv3-tiny를 NVDLA에서 실행하려면 TensorRT로 변환해야 합니다.",
        "route layer는 참조 대상 레이어의 output 버퍼를 유지해야 하므로 메모리 사용량이 activation 이론치보다 큽니다. Raspberry Pi 4 실측값은 이론치(~31 MB)의 약 3.6배인 112 MB였습니다.",
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
        "레이어 타입 분석은 precision 할당 실험 전에 반드시 선행되어야 합니다. 어떤 레이어가 precision 변환 대상인지, 어떤 레이어가 FP32를 유지해야 하는지를 먼저 파악하지 않으면 실험 결과를 해석하기 어렵습니다. 특히 YOLO detection head 근처 레이어의 sensitivity를 사전에 인지하는 것이 Mixed Precision 설계의 출발점이었습니다.",
    },
  ],
  relatedNoteSlugs: [
    "note-mixed-precision-cnn",
    "note-int8-quantization-overflow",
    "note-im2col-gemm-bottleneck",
  ],
};
