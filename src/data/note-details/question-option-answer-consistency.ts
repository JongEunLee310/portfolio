import type { TechnicalNoteDetail } from "@/types/note";
import { questionOptionAnswerConsistency } from "../notes/question-option-answer-consistency";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const questionOptionAnswerConsistencyDetail: TechnicalNoteDetail = {
  ...questionOptionAnswerConsistency,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서 관리자가 문제를 등록할 때, 문제 유형에 따라 선택지와 정답의 구조가 달라져야 합니다. 객관식 단일 정답 문제는 선택지가 2개 이상이고 정답이 1개여야 하고, 단답형은 선택지 없이 정답 텍스트만 있어야 합니다. 하지만 등록 로직에서 필수 필드 존재 여부만 검증하면, 유형과 맞지 않는 데이터가 저장될 수 있습니다.",
    },
    {
      type: "list",
      items: [
        "객관식 단일 정답인데 정답 선택지가 2개 이상 지정됨",
        "객관식 단일 정답인데 정답 선택지가 없음",
        "객관식 문제인데 선택지가 1개 이하",
        "OX 문제인데 선택지가 O/X 외의 값으로 등록됨",
        "단답형 문제인데 선택지는 없고 정답 텍스트도 없음",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "이런 데이터가 저장되면 문제 조회, 시험지 생성, 채점, 통계 계산 흐름까지 영향을 줍니다. 시험 생성 시 잘못된 문제가 포함되면 사용자는 풀 수 없는 문제를 받게 되고, 채점 단계에서는 정답 기준이 없어 예외가 발생하거나 잘못된 점수가 계산될 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 입력 검증을 단순한 필드 검증 수준으로만 처리했기 때문입니다. 문제 등록 요청에는 여러 필드가 포함되는데, 검증의 성격이 다릅니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "형식 검증",
          description: "제목이 비어 있으면 안 됨. 단일 필드만 보면 판단 가능합니다.",
          badge: "Request DTO",
        },
        {
          title: "범위 검증",
          description: "난이도는 허용된 enum이어야 함. 단일 필드만 보면 판단 가능합니다.",
          badge: "Request DTO",
        },
        {
          title: "도메인 검증",
          description:
            "객관식 단일 정답은 정답이 1개여야 함. 문제 유형이라는 다른 필드를 함께 봐야 판단할 수 있습니다.",
          badge: "Service / Domain",
        },
        {
          title: "관계 검증",
          description:
            "정답은 실제 선택지 중 하나여야 함. 선택지 목록 전체를 함께 봐야 판단할 수 있습니다.",
          badge: "Service / Domain",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "선택지와 정답의 정합성은 여러 필드를 함께 봐야 판단할 수 있습니다. 단일 필드 validation만으로는 안전하게 막을 수 없고, 문제 유형별 검증이 없으면 채점·시험 생성·문제 조회 로직이 각각 예외 처리를 떠안게 됩니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "프론트엔드 검증",
          description:
            "사용자 경험을 개선하지만 API 직접 호출 시 우회 가능합니다. 보조 수단으로만 사용합니다.",
          badge: "보조 수단",
        },
        {
          title: "DB 제약 조건",
          description:
            "데이터 저장 단계에서 방어하지만, 문제 유형별 복합 규칙을 표현하기 어렵습니다. 일부만 사용합니다.",
          badge: "일부 사용",
        },
        {
          title: "Request DTO 검증",
          description:
            "기본 형식 검증에 적합하지만, 여러 필드 간 조건 검증은 복잡합니다. 기본 검증을 담당합니다.",
          badge: "기본 검증",
        },
        {
          title: "Service / Domain 검증",
          description:
            "도메인 규칙을 표현하기에 가장 적합합니다. 문제 등록과 수정에서 동일한 Validator를 재사용합니다.",
          badge: "채택",
        },
      ],
    },
    {
      type: "list",
      items: [
        "Request 단계에서는 기본 형식과 필수값을 검증합니다.",
        "Service 또는 Domain 계층에서 문제 유형별 정합성을 검증합니다.",
        "검증 실패 시 저장을 수행하지 않습니다.",
        "문제 등록과 문제 수정 모두 같은 검증 규칙을 사용합니다.",
        "채점 로직은 이미 정합한 문제를 입력받는다는 전제를 가질 수 있게 합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "검증 규칙은 문제 유형별로 분기합니다. 객관식 단일 정답이라면 선택지 2개 이상, 정답 1개, 정답이 선택지 목록 안에 존재해야 합니다. 다중 정답이라면 선택지 2개 이상, 정답 1개 이상, 중복 정답 없음, 모든 정답이 선택지 안에 존재해야 합니다. 단답형이라면 선택지 없음, 공백이 아닌 정답 텍스트 1개 이상이어야 합니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "문제 저장 흐름",
      code: "Client → Controller: 문제 등록 요청\nController: 기본 형식 검증 (DTO)\nController → Service: 요청 전달\nService → Validator: 문제 유형별 정합성 검증\n\n검증 실패 시\n  Validator → Service: 검증 예외\n  Controller → Client: 400 Bad Request\n\n검증 성공 시\n  Validator → Service: 검증 통과\n  Service → Repository: 문제 저장\n  Controller → Client: 201 Created",
    },
    {
      type: "paragraph",
      content:
        "검증 규칙은 문제 등록과 문제 수정에서 모두 재사용할 수 있도록 별도 Validator 또는 도메인 메서드로 분리합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "정답 없는 객관식 문제 등록",
          before: "저장 가능",
          after: "등록 실패",
          change: "차단",
        },
        {
          label: "단일 정답에 정답 2개 지정",
          before: "저장 가능",
          after: "등록 실패",
          change: "차단",
        },
        {
          label: "선택지가 1개뿐인 객관식 문제",
          before: "저장 가능",
          after: "등록 실패",
          change: "차단",
        },
        {
          label: "단답형에 선택지 포함",
          before: "저장 가능",
          after: "등록 실패",
          change: "차단",
        },
        {
          label: "오류 발견 시점",
          before: "채점·시험 생성 단계",
          after: "등록 요청 즉시",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "검증 기준",
          before: "필수값 중심",
          after: "문제 유형별 도메인 규칙",
          change: "개선",
        },
        {
          label: "잘못된 문제 저장 가능성",
          before: "있음",
          after: "저장 전 차단",
          change: "개선",
        },
        {
          label: "채점 로직 부담",
          before: "잘못된 문제 방어 필요",
          after: "정합한 문제를 전제로 처리",
          change: "개선",
        },
        {
          label: "사용자 피드백",
          before: "늦게 발견됨",
          after: "등록 요청 즉시 반환",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "문제 유형과 맞지 않는 데이터가 저장되는 것을 문제 등록 시점에서 차단할 수 있게 되었습니다. 이후 시험 생성과 채점 로직이 불필요한 방어 코드를 줄일 수 있는 구조가 되었습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "단순한 입력 검증과 도메인 검증은 다릅니다. 제목·난이도처럼 단일 필드만 보면 판단 가능한 값은 DTO 수준에서, 선택지와 정답의 관계처럼 여러 필드를 함께 봐야 하는 규칙은 도메인 검증으로 다루는 것이 적절합니다.",
        "잘못된 데이터는 저장된 뒤 처리하려고 하면 시험 생성, 채점, 통계 계산 등 훨씬 많은 기능에 영향을 줍니다. Fail Fast가 Defensive Programming보다 단순하고 안전합니다.",
        "문제은행 서비스에서 문제 데이터는 씨앗과 같습니다. 씨앗이 잘못 심기면 시험지, 채점, 통계라는 가지가 전부 비틀립니다.",
        "향후 문제 유형이 추가될 때 검증 로직을 if-else로 계속 늘리기보다 유형별 Validator를 분리하는 방식을 검토해야 합니다.",
        "Excel 일괄 등록 기능이 있다면 개별 등록 API와 동일한 검증 규칙을 재사용해야 합니다. 경로가 다르다고 검증이 달라지면 Excel로는 저장되는 문제가 다시 생깁니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "Invariant와 Aggregate Consistency 관점에서 보면, 문제 유형·선택지·정답은 함께 변경되고 함께 유효해야 하는 데이터 묶음입니다. 이 묶음의 정합성 책임은 저장소가 아닌 도메인 계층에 있습니다.",
    },
  ],
  relatedNoteSlugs: [],
};
