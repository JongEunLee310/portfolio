import type { TechnicalNoteDetail } from "@/types/note";
import { excelQuestionImportValidation } from "../notes/excel-question-import-validation";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const excelQuestionImportValidationDetail: TechnicalNoteDetail = {
  ...excelQuestionImportValidation,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서는 관리자가 Excel 파일을 업로드해 여러 문제를 한 번에 등록할 수 있습니다. 100개의 문제를 업로드했는데 57번째 행에서 정답 형식이 잘못되었다면, 1번부터 56번까지의 문제는 이미 저장되고 57번부터는 실패하는 상태가 생길 수 있습니다.",
    },
    {
      type: "list",
      items: [
        "1~56행 정상, 57행 오류 → 56개 문제만 저장, 사용자는 전체 실패로 오해",
        "중간 행에서 예외 발생 → 이전 행이 DB에 남아 재업로드 시 중복 저장 가능",
        "선택지 검증 실패 → 문제 본문만 저장되어 데이터 불완전",
        "파일 파싱 실패 → 일부 파싱된 행이 저장되어 파일 단위 원자성 없음",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "특히 사용자가 같은 Excel 파일을 다시 업로드하면 문제가 커집니다. 첫 번째 업로드에서 일부 행이 이미 저장된 상태라면 재업로드 시 정상 행이 중복 저장될 수 있습니다. Excel 업로드는 컨베이어 벨트처럼 보이지만, 실제로는 모든 상자가 검수장을 통과한 뒤 한 번에 창고에 넣는 방식이 더 안전합니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 Excel 일괄 등록을 '행을 하나씩 등록하는 반복 작업'으로만 처리했기 때문입니다. 도메인 관점에서 Excel 업로드는 하나의 bulk import 작업이므로 개별 행의 등록이 아니라 파일 전체를 하나의 작업 단위로 봐야 합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "검증과 저장의 단계 분리 부족",
          description:
            "행을 읽자마자 저장하면 중간 실패 시 업로드 작업의 원자성을 보장할 수 없습니다.",
          badge: "핵심 원인",
        },
        {
          title: "트랜잭션 범위 부족",
          description:
            "전체 업로드를 하나의 작업으로 묶지 않아 실패 시 이미 저장된 행이 rollback되지 않습니다.",
          badge: "원자성 부재",
        },
        {
          title: "행별 오류 수집 부재",
          description:
            "어느 행에서 왜 실패했는지 사용자에게 안내하지 않아 수정이 어렵습니다.",
          badge: "피드백 부재",
        },
        {
          title: "개별 등록과 검증 기준 불일치",
          description:
            "화면에서 직접 등록할 때는 막히는 데이터가 Excel 업로드에서 통과하면 데이터 정합성이 깨집니다.",
          badge: "검증 일관성 부재",
        },
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "잘못된 흐름 vs 올바른 흐름",
      code: "잘못된 흐름: 행 단위 즉시 저장\n  행 읽기 → 행 검증 → 행 저장 → 다음 행 읽기 → 행 검증 → 행 저장\n  중간 실패 시 → 이전 행은 이미 DB에 남음\n\n올바른 흐름: 전체 검증 후 일괄 저장\n  전체 파일 파싱 → 전체 행 검증 → 오류 목록 반환 또는 전체 저장",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "전체 성공 / 전체 실패",
          description:
            "모든 행이 검증을 통과해야만 저장하고, 하나라도 실패하면 아무 문제도 저장하지 않습니다. 데이터 일관성이 높고 MVP 단계에 적합합니다.",
          badge: "MVP 채택",
        },
        {
          title: "정상 행만 저장",
          description:
            "일부 데이터라도 활용할 수 있지만 사용자가 결과를 오해할 수 있습니다. 명확한 정책 없이는 보류합니다.",
          badge: "보류",
        },
        {
          title: "임시 테이블 저장 후 승인",
          description:
            "관리자가 검토 후 최종 반영하는 방식으로 검토 가능하지만 구현 복잡도가 높습니다.",
          badge: "추후 검토",
        },
        {
          title: "비동기 업로드 처리",
          description:
            "대량 파일에 유리하지만 상태 관리가 필요합니다. 데이터 규모가 커진 뒤 검토합니다.",
          badge: "추후 검토",
        },
      ],
    },
    {
      type: "list",
      items: [
        "파일 확장자와 크기를 먼저 확인합니다.",
        "Excel 파일을 파싱해 행 단위 import command 목록으로 변환합니다.",
        "필수 컬럼 존재 여부를 확인합니다.",
        "모든 행에 대해 기본 형식 검증을 수행합니다.",
        "모든 행에 대해 문제 유형별 도메인 검증을 수행합니다.",
        "오류가 하나라도 있으면 저장하지 않고 행 번호와 오류 목록을 반환합니다.",
        "오류가 없으면 하나의 트랜잭션에서 전체 문제를 저장합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "처리 흐름은 파싱 → 전체 검증 → 오류 있으면 즉시 반환 / 오류 없으면 트랜잭션 저장 순서로 정리됩니다. 검증이 끝나기 전까지 DB 저장이 발생하지 않습니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "Excel 일괄 등록 2단계 흐름",
      code: "Phase 1: 전체 검증\n  Controller: 파일 확장자 / 크기 확인\n  Parser: Excel 파싱 → ImportCommand 목록 생성\n  Validator: 필수 컬럼 확인\n  Validator: 모든 행 기본 형식 검증\n  Validator: 모든 행 문제 유형별 도메인 검증\n\n  오류 있음\n    → 행 번호 + 오류 사유 목록 반환 (400)\n    → DB 변경 없음\n\n  오류 없음 → Phase 2\n\nPhase 2: 전체 저장\n  Transaction 시작\n  Repository: 문제 / 선택지 / 정답 / 해설 일괄 저장\n  Transaction Commit\n  저장 중 예외 → 전체 rollback, DB 변경 없음\n  → 201 Created (등록 건수 반환)",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "문제 유형별 도메인 검증은 개별 문제 등록 API와 동일한 규칙을 재사용해야 합니다. Excel 업로드에서만 별도 검증 기준을 두면 화면에서 막히는 데이터가 Excel로는 통과하는 불일치가 생깁니다. Validator를 공통화해 등록 경로에 상관없이 같은 규칙이 적용되도록 해야 합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "정상 Excel 업로드",
          before: "전체 저장 (변경 없음)",
          after: "전체 검증 후 일괄 저장",
          change: "유지",
        },
        {
          label: "중간 행 오류 포함 파일 업로드",
          before: "오류 이전 행이 DB에 저장",
          after: "아무 행도 저장되지 않음",
          change: "차단",
        },
        {
          label: "저장 중 예외 발생",
          before: "일부 행만 저장 가능",
          after: "전체 rollback, DB 변경 없음",
          change: "차단",
        },
        {
          label: "오류 파일 재업로드",
          before: "이전 성공 행 중복 저장 가능",
          after: "오류 수정 후 안전하게 재업로드",
          change: "개선",
        },
        {
          label: "오류 위치 파악",
          before: "단순 실패 응답으로 수정 어려움",
          after: "행 번호 + 오류 사유 목록 반환",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "처리 방식",
          before: "행 단위 검증 후 즉시 저장",
          after: "전체 검증 후 일괄 저장",
          change: "개선",
        },
        {
          label: "오류 발생 시 DB 상태",
          before: "이전 행이 저장될 수 있음",
          after: "아무 행도 저장되지 않음",
          change: "개선",
        },
        {
          label: "사용자 피드백",
          before: "실패 원인 파악 어려움",
          after: "행 번호와 오류 사유 반환",
          change: "개선",
        },
        {
          label: "재업로드",
          before: "중복 저장 가능",
          after: "오류 수정 후 안전하게 재업로드",
          change: "개선",
        },
        {
          label: "검증 기준",
          before: "개별 등록과 달라질 수 있음",
          after: "문제 등록 검증 규칙 재사용",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "Excel 파일 하나가 하나의 import 작업으로 일관되게 처리됩니다. 사용자는 실패한 업로드가 DB에 반쯤 남았을지 걱정하지 않아도 됩니다. 시스템은 문제가 있는 파일을 조금만 저장하지 않고, 검수 도장을 받을 때까지 문 앞에서 기다리게 합니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "대량 등록 기능에서는 정상 케이스보다 실패 케이스 설계가 더 중요합니다. 실패했을 때 몇 개가 저장되었는지 불명확하면 사용자는 결과를 신뢰할 수 없습니다.",
        "검증 로직은 등록 경로마다 따로 만들면 안 됩니다. 화면에서 직접 등록할 때는 막히는 데이터가 Excel 업로드에서 통과한다면 데이터 정합성이 다시 깨집니다.",
        "Excel 업로드는 편의 기능처럼 보이지만 서비스 데이터 품질을 한 번에 크게 바꿀 수 있는 입구입니다. 입구가 넓을수록 문지기도 더 꼼꼼해야 합니다.",
        "오류 메시지는 구체적일수록 좋습니다. '검증 실패'만 반환하면 500행짜리 파일에서 어디를 수정해야 하는지 알 수 없습니다. 행 번호와 컬럼, 사유를 함께 제공해야 합니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 Validation Before Save와 Atomicity가 핵심 개념입니다. Excel 업로드는 여러 행을 다루지만 사용자에게는 하나의 작업으로 인식되므로 원자성을 보장하는 것이 중요합니다. Partial Failure(일부 데이터만 성공하고 나머지는 실패하는 상태)를 피하기 위해 전체 검증을 먼저 완료한 뒤 저장을 시작하는 2단계 구조가 가장 안전한 접근입니다.",
    },
  ],
  relatedNoteSlugs: [
    "question-option-answer-consistency",
    "question-update-child-data-transaction",
  ],
};
