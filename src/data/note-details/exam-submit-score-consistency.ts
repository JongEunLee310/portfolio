import type { TechnicalNoteDetail } from "@/types/note";
import { examSubmitScoreConsistency } from "../notes/exam-submit-score-consistency";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const examSubmitScoreConsistencyDetail: TechnicalNoteDetail = {
  ...examSubmitScoreConsistency,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서 사용자는 시험을 응시한 뒤 답안을 제출합니다. 시험 제출은 단순히 답안을 저장하는 작업이 아닙니다. 내부적으로는 사용자 답안 저장, 정답 비교, 점수 계산, 시험 결과 저장, 제출 상태 변경, 통계 반영 등 여러 단계가 순서대로 이어집니다.",
    },
    {
      type: "list",
      items: [
        "사용자의 답안 제출 요청 수신",
        "시험 응시 상태 확인",
        "제출 답안 저장",
        "문제별 정답 비교",
        "총점 계산",
        "시험 결과 저장",
        "응시 상태를 제출 완료로 변경",
        "통계 또는 오답노트 반영",
      ],
    },
    {
      type: "list",
      items: [
        "답안은 저장됐지만 점수 계산에 실패해 결과 조회 불가",
        "점수는 계산됐지만 결과 저장 실패로 사용자에게 점수 미노출",
        "결과는 저장됐지만 상태 변경 실패로 응시 상태가 진행 중으로 남아 재제출 가능",
        "상태는 제출 완료인데 답안이 없어 채점 불가",
        "통계 반영 실패로 시험 결과와 관리자 지표 불일치",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "가장 피해야 하는 상태는 '답안은 저장됐는데 결과는 없는 상태' 또는 '결과는 있는데 제출 상태는 진행 중인 상태'입니다. 시험 제출은 한 번 울리는 종이어야 하는데, 내부 상태가 나뉘어 있으면 종은 울렸는데 출석부에는 결석으로 남는 이상한 장면이 만들어집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 답안 저장, 채점, 결과 저장, 상태 변경을 각각 독립적인 작업으로 처리했기 때문입니다. 이 데이터들은 물리적으로는 분리되어 있어도 제출이라는 하나의 도메인 이벤트에 의해 함께 만들어지거나 변경됩니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "트랜잭션 경계 부족",
          description:
            "답안과 결과가 하나의 작업으로 묶이지 않아 중간 실패 시 부분 저장 상태가 남습니다.",
          badge: "핵심 원인",
        },
        {
          title: "상태 전이 규칙 부재",
          description:
            "IN_PROGRESS에서 SUBMITTED로 가는 기준이 불명확해 상태 변경 위치가 일관되지 않습니다.",
          badge: "규칙 부재",
        },
        {
          title: "저장 순서 불안정",
          description:
            "상태를 먼저 바꾸거나 답안을 먼저 저장하면 실패 시 데이터가 꼬입니다. 특히 상태를 먼저 SUBMITTED로 바꾼 뒤 답안 저장에 실패하면 제출 완료인데 답안이 없는 상태가 됩니다.",
          badge: "순서 문제",
        },
        {
          title: "통계 반영과 제출 처리 결합",
          description:
            "재처리 가능한 통계·알림 작업이 핵심 제출 흐름에 포함되어 부가 작업 실패가 제출 전체를 깨뜨릴 수 있습니다.",
          badge: "책임 혼재",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "재제출 방어도 놓치기 쉬운 원인입니다. 같은 attempt에 대해 여러 번 제출이 가능하면 중복 결과가 생기거나 기존 채점 결과를 덮어쓸 수 있습니다. 제출 상태가 이미 SUBMITTED인 경우 재제출을 명확히 차단해야 합니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "모든 작업을 하나의 트랜잭션으로 처리",
          description:
            "강한 일관성을 보장하지만 통계·알림 실패가 제출 실패로 번집니다. 일부만 채택합니다.",
          badge: "일부 채택",
        },
        {
          title: "답안/결과/상태만 트랜잭션 처리",
          description:
            "핵심 일관성을 보장하면서 부가 작업은 분리합니다. MVP 단계에 적합합니다.",
          badge: "채택",
        },
        {
          title: "답안만 저장 후 채점은 비동기",
          description:
            "빠른 응답이 가능하지만 결과 지연과 중간 상태 관리가 필요합니다. 추후 검토합니다.",
          badge: "추후 검토",
        },
        {
          title: "상태만 먼저 제출 완료 처리",
          description: "구현이 단순하지만 답안 누락 위험이 있습니다. 미채택합니다.",
          badge: "미채택",
        },
      ],
    },
    {
      type: "list",
      items: [
        "제출 요청이 들어오면 응시 상태를 먼저 확인합니다.",
        "이미 제출된 시험이면 재제출을 차단합니다.",
        "제출 답안의 문제 ID와 시험 문제 구성을 검증합니다.",
        "답안 저장, 채점 결과 저장, 응시 상태 변경을 하나의 트랜잭션으로 묶습니다.",
        "통계, 오답노트, 알림은 제출 성공 이후 별도 후처리로 분리합니다.",
        "실패 시 사용자 답안만 남는 상태가 만들어지지 않도록 합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "처리 흐름은 상태 검증 → 답안 검증 → 점수 계산 → 트랜잭션(답안·결과·상태) → 후처리 순서로 정리됩니다. 핵심 제출 데이터가 모두 성공해야만 제출 완료가 되고, 중간 실패 시 전체가 rollback됩니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "시험 제출 처리 흐름",
      code: "Client → Controller: 시험 제출 요청\nService → Repository: 응시 정보 조회\n\n상태 검증\n  응시 상태 != IN_PROGRESS → 제출 실패 (400)\n  이미 SUBMITTED → 재제출 차단 (409)\n\n답안 검증\n  제출 문제 ID가 시험 문제 구성과 불일치 → 제출 실패 (400)\n\nScoringService: 정답 비교 및 점수 계산\n\nTransaction 시작\n  Repository: 사용자 답안 저장\n  Repository: 문제별 정오답 결과 저장\n  Repository: 전체 시험 결과 저장\n  Repository: 응시 상태 SUBMITTED 변경\nTransaction Commit\n  실패 시 전체 rollback → 기존 상태 유지\n\nPostProcessor: 통계/오답노트 후처리 (분리)\nController → Client: 200 OK",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "상태 변경은 반드시 트랜잭션 마지막에 위치해야 합니다. 답안과 결과가 모두 저장된 이후에 SUBMITTED로 변경해야 실패 시 rollback이 완전하게 작동합니다. 상태를 먼저 변경하면 이후 저장 실패 시 상태만 제출 완료로 남는 역전 현상이 발생합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "일부 답안 누락 제출",
          before: "부분 저장될 수 있음",
          after: "제출 실패, DB 변경 없음",
          change: "차단",
        },
        {
          label: "결과 저장 중 예외 발생",
          before: "답안만 DB에 남음",
          after: "전체 rollback, 기존 상태 유지",
          change: "차단",
        },
        {
          label: "응시 상태 변경 중 예외 발생",
          before: "답안·결과는 있으나 상태는 진행 중",
          after: "전체 rollback, 기존 상태 유지",
          change: "차단",
        },
        {
          label: "이미 제출된 시험 재제출",
          before: "중복 제출 가능",
          after: "응시 상태 기준으로 차단",
          change: "차단",
        },
        {
          label: "통계 반영 실패",
          before: "제출 실패로 번짐",
          after: "제출 결과 유지, 후처리 재처리 대상 기록",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "제출 처리 단위",
          before: "답안/결과/상태가 분리될 수 있음",
          after: "핵심 제출 흐름을 하나의 트랜잭션으로 처리",
          change: "개선",
        },
        {
          label: "실패 시 상태",
          before: "부분 저장 가능",
          after: "rollback으로 기존 상태 유지",
          change: "개선",
        },
        {
          label: "재제출 처리",
          before: "중복 제출 가능성",
          after: "제출 상태 기준으로 차단",
          change: "차단",
        },
        {
          label: "통계 반영",
          before: "제출 흐름과 강하게 결합",
          after: "후처리로 분리 가능",
          change: "개선",
        },
        {
          label: "사용자 경험",
          before: "제출했는데 결과가 없을 수 있음",
          after: "제출 성공 시 결과 조회 항상 가능",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "제출 성공 응답을 받으면 결과가 반드시 존재하는 일관된 상태가 보장됩니다. 채점 결과, 응시 상태, 사용자 답안이 서로 다른 이야기를 하는 문제를 줄일 수 있게 되었습니다. 서비스 내부의 기록들이 한 목소리로 '이 시험은 제출 완료'라고 말하게 된 것입니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "시험 제출은 단순 저장이 아니라 상태 전이를 포함한 도메인 이벤트입니다. 답안 저장, 점수 계산, 결과 저장은 각각 독립 기능처럼 보이지만, 사용자의 제출이라는 관점에서는 하나의 작업입니다.",
        "핵심 제출 데이터와 나중에 처리해도 되는 데이터를 분리해야 합니다. 통계나 알림처럼 재처리 가능한 작업은 제출 성공 이후로 분리하는 것이 더 안정적입니다.",
        "모든 것을 하나의 트랜잭션에 넣는 것이 항상 좋은 것은 아닙니다. 핵심 제출 데이터는 강한 일관성이 필요하지만 재처리 가능한 작업까지 묶으면 부가 실패가 핵심 작업을 깨뜨립니다.",
        "'실패했을 때 어떤 상태로 남길 것인가'를 먼저 정해야 합니다. 성공 흐름만 설계하면 시스템은 폭풍 없는 날의 지도만 가진 항해사처럼 됩니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 Atomicity(원자성)와 State Transition(상태 전이)이 핵심 개념입니다. 시험 제출은 데이터 저장인 동시에 상태 변경이므로 저장 결과와 상태가 반드시 함께 맞아야 합니다. 또한 같은 제출 요청이 반복되어도 중복 결과가 생기지 않도록 Idempotency를 고려해야 하며, 통계처럼 나중에 일관성을 맞출 수 있는 처리는 Eventually Consistency 방식으로 분리하는 것이 적합합니다.",
    },
  ],
  relatedNoteSlugs: [
    "question-update-child-data-transaction",
    "question-option-answer-consistency",
  ],
};
