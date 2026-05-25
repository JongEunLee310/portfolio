import type { TechnicalNoteDetail } from "@/types/note";
import { noteConvMaxpoolIntegration } from "../notes/note-conv-maxpool-integration";
import { troubleshootingHeading, troubleshootingToc } from "./_helpers";

export const noteConvMaxpoolIntegrationDetail: TechnicalNoteDetail = {
  ...noteConvMaxpoolIntegration,
  template: "troubleshooting",
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "Mixed Precision 구성에서 INT8 conv 다음에 FP32 maxpool이 오면 dequantize → maxpool → quantize 변환이 레이어 경계마다 추가로 발생했습니다. YOLOv3-tiny는 conv가 항상 maxpool 바로 앞에 위치하는 구조(conv0→max1, conv2→max3, ...)이므로 이 변환 비용이 누적되었습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "maxpool은 인접 값 중 최댓값을 선택하는 연산입니다. max 비교는 값의 대소만 필요하므로 FP32 변환 없이 INT8 정수 비교로 동일한 결과를 얻을 수 있습니다.",
        "INT8 입력에 대해 maxpool을 직접 수행해도 FP32로 변환 후 maxpool을 수행한 것과 결과가 동일합니다. 정수의 max 비교는 float 변환이 필요 없습니다.",
        "따라서 INT8 conv 이후 dequantize 없이 INT8 상태로 maxpool을 수행하면 레이어 경계마다 발생하는 변환 비용을 줄일 수 있습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "maxpool 레이어를 INT8 입력을 직접 처리하도록 수정했습니다. INT8 conv 이후 dequantize(INT8→FP32) 없이 maxpool을 INT8 상태로 수행하고, 다음 레이어의 precision에 따라 필요한 경우에만 변환합니다.",
    },
    troubleshootingHeading(3),
    {
      type: "comparison",
      items: [
        {
          title: "Conv INT8 + 별도 maxpool FP32",
          description:
            "각 conv-maxpool 경계마다 quantize/dequantize 변환이 2회씩 발생합니다.",
          bullets: [
            "경계마다: INT8 conv → dequantize → FP32 maxpool → quantize → 다음 레이어",
            "레이어 수에 비례해 변환 횟수 증가",
            "detection 결과 정상",
          ],
        },
        {
          title: "Conv INT8 + maxpool INT8 통합",
          description:
            "maxpool을 INT8 입력 그대로 수행해 경계 변환 횟수를 줄입니다.",
          bullets: [
            "INT8 conv → INT8 maxpool → (블록 끝에서 1회만 변환)",
            "max 연산은 정수 비교로 동일 결과",
            "precision 손실 없음",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "quantize/dequantize 횟수",
          before: "레이어 경계마다 2회",
          after: "conv-maxpool 블록당 1회",
          change: "절반 감소",
        },
        {
          label: "detection 결과",
          before: "정상 (FP32 maxpool)",
          after: "동일 (INT8 maxpool)",
          change: "변화 없음",
        },
        {
          label: "전체 실행 시간",
          before: "기준",
          after: "약 5% 감소",
          change: "-5%",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "cards",
      items: [
        {
          title: "변환 오버헤드 제거",
          description:
            "Conv-Maxpool 블록 사이의 불필요한 quantize/dequantize를 제거해 실행 흐름을 단순화했습니다.",
        },
        {
          title: "Layer Fusion 원칙 적용",
          description:
            "인접 레이어를 하나의 실행 단위로 통합하면 중간 변환 비용을 줄일 수 있습니다. ReLU, BatchNorm도 동일한 원칙으로 통합 가능합니다.",
        },
      ],
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "info",
      content:
        "연산의 특성에 따라 precision 변환 없이 정수 도메인에서 처리 가능한 레이어를 식별하면 quantize/dequantize 비용을 줄일 수 있습니다. max 연산처럼 값의 대소 비교만 필요한 연산은 INT8 그대로 처리할 수 있습니다. Conv-BatchNorm-ReLU fusion도 동일한 원칙으로 INT8 도메인에서 구현하면 추가 변환 비용을 줄일 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "note-mixed-precision-cnn",
    "note-int8-quantization-overflow",
    "note-im2col-gemm-bottleneck",
  ],
};
