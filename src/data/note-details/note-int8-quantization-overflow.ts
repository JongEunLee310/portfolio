import type { TechnicalNoteDetail } from "@/types/note";
import { noteInt8QuantizationOverflow } from "../notes/note-int8-quantization-overflow";
import { troubleshootingHeading, troubleshootingToc } from "./_helpers";

export const noteInt8QuantizationOverflowDetail: TechnicalNoteDetail = {
  ...noteInt8QuantizationOverflow,
  template: "troubleshooting",
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "YOLOv3-tiny inference에서 INT8 양자화를 처음 시도할 때 이미지 로딩 함수 내부에서 픽셀값을 int8_t로 직접 캐스팅했습니다. 실행은 완료되었으나 bounding box가 전혀 생성되지 않았습니다. 이후 weight에 INT8 affine mapping을 적용해도 detection confidence가 FP32 대비 크게 하락하는 문제가 이어졌습니다.",
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "uint8_t(0~255)를 int8_t(-128~127)로 직접 캐스팅하면 128 이상의 픽셀값이 음수로 변환됩니다. 이는 정규화된 입력 텐서 분포를 완전히 무너뜨려 모든 detection confidence가 threshold 이하로 떨어집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "int8_t 직접 캐스팅 문제: INT8 inference의 대상은 weight와 activation이지 입력 이미지 타입이 아닙니다. 이미지 로딩 단계에서 타입만 바꾸는 것은 양자화가 아니라 단순 타입 재해석입니다.",
        "후반 레이어 overflow: INT8 범위(-128~127)를 초과하는 activation은 클리핑됩니다. 후반 레이어(conv10 이후)는 채널 수가 많고 activation range가 넓어 overflow 비율이 높습니다. YOLO head 직전 레이어(conv15, conv22)의 overflow가 confidence 하락의 주원인입니다.",
        "단일 scale factor의 한계: per-layer quantization에서 레이어 전체에 단일 scale factor를 사용하면 큰 값은 클리핑되고 작은 값은 0으로 수렴합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "이미지 로딩은 float 표현을 유지하고, conv 레이어 weight에만 affine INT8 quantization(scale × q + zero_point)을 적용하는 방식으로 전환했습니다. 후반 레이어(conv10 이후)와 YOLO head 직전 레이어는 FP32를 유지하는 Mixed Precision 전략을 채택했습니다.",
    },
    troubleshootingHeading(3),
    {
      type: "comparison",
      items: [
        {
          title: "초기 레이어 (conv0~conv4)",
          description: "activation 분포가 안정적이고 overflow 비율이 낮습니다.",
          bullets: [
            "INT8 overflow 비율 ~0%",
            "INT16 overflow 비율 ~2~14%",
            "INT8 양자화 손실 적음 → 적용 가능",
          ],
        },
        {
          title: "후반 레이어 (conv10~conv15)",
          description:
            "채널 수가 많고 activation range가 넓어 overflow 비율이 높습니다.",
          bullets: [
            "INT16 overflow 비율 ~20~31%",
            "detection confidence에 직접 영향",
            "FP32 유지 필요",
          ],
        },
        {
          title: "Bias/BatchNorm",
          description:
            "batchnorm 파라미터는 feature 분포에 맞게 학습되어 value range가 넓습니다.",
          bullets: [
            "batchnorm INT8 적용 시 bbox 위치 왜곡 발생",
            "YOLO head bias INT8화 시 좌표 오차 발생",
            "FP32 유지 필요 — bias/batchnorm INT8은 보류",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "dog confidence",
          before: "FP32 전체: 81%",
          after: "INT8 전체: 31%",
          change: "-50%p",
        },
        {
          label: "bicycle",
          before: "FP32 전체: 38%",
          after: "INT8 전체: 미검출",
          change: "검출 불가",
        },
        {
          label: "Mixed Precision (초기 INT8 + 후반 FP32)",
          before: "INT8 전체: 31%",
          after: "dog 57%, bicycle 59%, car 52%",
          change: "회복",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "cards",
      items: [
        {
          title: "레이어별 차별화 전략",
          description:
            "overflow 분포 분석 결과를 기반으로 초기 레이어는 INT8, 후반 레이어는 FP32를 유지하는 Mixed Precision 전략을 확립했습니다.",
        },
        {
          title: "INT8 양자화 범위 확정",
          description:
            "conv weight에만 INT8을 적용하고, bias와 batchnorm은 FP32로 유지하는 것이 accuracy 손실 없이 INT8의 이점을 얻는 실용적인 기준임을 확인했습니다.",
        },
      ],
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "info",
      content:
        "INT8 inference는 이미지를 int8_t로 저장하는 것이 아닙니다. 내부 연산(GEMM)에 사용되는 weight와 중간 activation을 양자화된 정수로 표현하는 것입니다. 양자화의 영향은 레이어마다 다르므로, 레이어별 activation 분포를 먼저 측정해 overflow 비율이 낮은 레이어부터 INT8을 적용해야 합니다.",
    },
  ],
  relatedNoteSlugs: [
    "note-mixed-precision-cnn",
    "note-arm-fp16-compiler",
    "note-cnn-lightweight-optimization",
  ],
};
