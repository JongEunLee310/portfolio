import type { TechnicalNoteDetail } from "@/types/note";
import { noteIm2colGemmBottleneck } from "../notes/note-im2col-gemm-bottleneck";
import { troubleshootingHeading, troubleshootingToc } from "./_helpers";

export const noteIm2colGemmBottleneckDetail: TechnicalNoteDetail = {
  ...noteIm2colGemmBottleneck,
  template: "troubleshooting",
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "YOLOv3-tiny의 conv 레이어에서 im2col+GEMM 연산이 전체 실행 시간의 대부분을 차지했습니다. 인접 픽셀 간 값의 유사도가 높으면 conv 출력도 유사할 것이라는 가정 하에, 이전 결과를 재사용해 GEMM 연산 횟수를 줄이는 최적화를 구현해 실험했습니다.",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "im2col 변환 이후 행렬 구조에서 픽셀 유사도 가정이 성립하는지 검증하는 것이 이 실험의 핵심이었습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "im2col 변환 후 픽셀 위치 관계가 바뀝니다. 이미지 레벨에서 인접한 픽셀이 GEMM 행렬에서는 서로 다른 행에 배치되어 단순 유사도 비교가 불가능합니다.",
        "conv 연산의 출력 하나는 수용 영역(receptive field) 전체에 대한 연산입니다. 중심 픽셀이 유사해도 주변 픽셀이 다르면 결과가 달라집니다.",
        "유사도 판단 비용이 절약되는 GEMM 연산 비용보다 크거나 비슷합니다. 모든 픽셀 쌍에 대해 임계값 비교를 수행하면 오히려 실행 시간이 늘어납니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "픽셀 유사도 기반 최적화 코드를 제거하고, 레이어별 precision 조정(Mixed Precision)과 Conv-Maxpool 통합 실행으로 전략을 전환했습니다. 임계값을 아무리 조정해도 속도-정확도 Pareto 최적 지점이 없었습니다.",
    },
    troubleshootingHeading(3),
    {
      type: "comparison",
      items: [
        {
          title: "픽셀 유사도 재사용 방식",
          description:
            "이미지 레벨에서 인접 픽셀이 유사하면 GEMM 결과를 재사용하는 방식입니다.",
          bullets: [
            "이미지 레벨 직관 ≠ GEMM 행렬 레벨 구조",
            "receptive field 전체를 고려하지 못함",
            "유사도 판단 비용 > GEMM 절감 비용",
          ],
        },
        {
          title: "Mixed Precision + Layer Fusion",
          description:
            "레이어별 정밀도 조정과 Conv-Maxpool 통합으로 실행 시간을 줄이는 방식입니다.",
          bullets: [
            "INT8 레이어에서 연산 비트 수 자체를 줄임",
            "Conv-Maxpool 통합으로 quantize/dequantize 횟수 감소",
            "실제 측정 가능한 실행 시간 단축 달성",
          ],
        },
      ],
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "픽셀 유사도 최적화 효과",
          before: "기대: 실행 시간 단축",
          after: "실제: 유의미한 차이 없음",
          change: "포기",
        },
        {
          label: "Mixed Precision (INT8 혼합)",
          before: "FP32 전체: 3.45s (GCC)",
          after: "INT8 혼합: 2.21s (GCC)",
          change: "-36%",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "cards",
      items: [
        {
          title: "최적화 방향 전환",
          description:
            "연산 생략 대신 연산 정밀도 감소(INT8)로 방향을 전환해 실질적인 속도 향상을 달성했습니다.",
        },
        {
          title: "im2col 구조 이해",
          description:
            "im2col+GEMM 변환 이후 데이터 레이아웃이 어떻게 바뀌는지 파악하는 것이 최적화 설계의 전제조건이었습니다.",
        },
      ],
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "이미지 레벨의 직관이 GEMM 행렬 레벨에서는 성립하지 않습니다. 최적화 아이디어의 유효성을 검증할 때는 실제 연산이 이루어지는 추상화 레벨에서 검토해야 합니다. Sparse activation을 활용한 sparse GEMM이나 direct conv 구현이라면 다른 접근이 가능할 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "note-yolov3-tiny-layer-architecture",
    "note-mixed-precision-cnn",
    "note-conv-maxpool-integration",
  ],
};
