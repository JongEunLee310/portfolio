import type { TechnicalNoteDetail } from "@/types/note";
import { examTimeoutSubmitRaceCondition } from "../notes/exam-timeout-submit-race-condition";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const examTimeoutSubmitRaceConditionDetail: TechnicalNoteDetail = {
  ...examTimeoutSubmitRaceCondition,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서 사용자는 제한 시간이 있는 시험을 응시할 수 있습니다. 시험 응시 중에는 사용자가 직접 제출 버튼을 누르는 수동 제출과, 제한 시간이 만료되어 시스템이 자동으로 처리하는 자동 제출 두 가지 흐름이 존재합니다. 두 흐름은 서로 다른 원인으로 시작되지만 같은 시험 응시 데이터를 최종 상태로 변경합니다.",
    },
    {
      type: "list",
      items: [
        "사용자가 제출 버튼을 누르는 순간 타이머 만료 — 수동 제출과 자동 제출이 동시에 발생",
        "네트워크 지연으로 요청 도착 시간이 늦어짐 — 사용자는 시간 안에 눌렀지만 서버는 만료 후로 판단",
        "브라우저 탭 여러 개에서 같은 시험 제출 — 동일 attempt에 중복 제출 발생",
        "자동 제출 API와 수동 제출 API가 분리됨 — 서로 다른 상태 변경 로직으로 충돌",
        "클라이언트 타이머 기준으로만 제출 허용 — 서버 기준 시간과 불일치",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "이 문제는 단순 UI 타이머 문제가 아니라 시험 응시 상태의 최종 결과를 결정하는 경합 조건입니다. 수동 제출과 자동 제출이 같은 attempt에 동시에 성공하면 답안·결과가 중복 저장되고, 두 상태(SUBMITTED와 EXPIRED)가 충돌해 최종 상태가 예측 불가능해집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 시험 제출을 상태 전이 관점으로 관리하지 않고 API 요청 단위로만 처리했기 때문입니다. 수동 제출 API와 자동 제출 API가 각각 독립적으로 ExamAttempt 상태를 변경하면서 서로의 처리 결과를 확인하지 않았습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "상태 전이 규칙 부재",
          description:
            "어떤 상태에서 어떤 상태로 갈 수 있는지 정의되지 않아 SUBMITTED와 EXPIRED가 같은 시점에 경쟁합니다.",
          badge: "핵심 원인",
        },
        {
          title: "조건부 상태 변경 부재",
          description:
            "IN_PROGRESS일 때만 제출 성공하도록 제한하지 않아 두 요청 모두 성공할 수 있습니다.",
          badge: "동시성 취약",
        },
        {
          title: "서버 시간 기준 미적용",
          description:
            "클라이언트 타이머를 신뢰해 제출 가능 여부 판단이 요청마다 다를 수 있습니다. 브라우저 시간은 조작되거나 환경에 따라 다를 수 있습니다.",
          badge: "시간 기준 불일치",
        },
        {
          title: "수동·자동 제출 로직 분리",
          description:
            "같은 도메인 작업이 서로 다른 코드 경로로 처리되어 일관성이 없습니다.",
          badge: "책임 분산",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "단순 if status == IN_PROGRESS 조건 확인만으로는 경합을 막기 어렵습니다. 두 요청이 같은 시점에 같은 상태를 읽고 모두 IN_PROGRESS로 확인한 뒤 각각 진행하면 결국 둘 다 상태 변경까지 도달할 수 있습니다. 상태 변경 자체에 원자적 조건이 필요합니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "DB 조건부 업데이트",
          description:
            "IN_PROGRESS 조건으로 상태 변경 시도 후 변경된 row 수로 권한 획득 여부를 확인합니다. 한 요청만 성공하도록 보장됩니다.",
          badge: "채택",
        },
        {
          title: "서버 시간 기준 검증",
          description:
            "제출 가능 여부를 서버 현재 시각으로 판단합니다. 클라이언트 시간 조작이나 네트워크 지연 영향을 제거합니다.",
          badge: "채택",
        },
        {
          title: "비관적 lock",
          description:
            "데이터를 잠가 동시 접근을 제한합니다. 동시성 제어가 강하지만 대기 및 성능 부담이 있습니다. 필요 시 검토합니다.",
          badge: "필요 시 검토",
        },
        {
          title: "프론트엔드 타이머만으로 제어",
          description:
            "구현은 쉽지만 우회 가능하고 서버 기준 시간과 불일치합니다. 미채택합니다.",
          badge: "미채택",
        },
      ],
    },
    {
      type: "list",
      items: [
        "수동 제출과 자동 제출을 공통 제출 Service로 통합합니다.",
        "서버 현재 시각을 기준으로 시험 제한 시간을 확인하고 제출 사유를 결정합니다.",
        "IN_PROGRESS 조건부 업데이트로 상태 전이를 시도합니다.",
        "변경된 row 수가 1이면 제출 권한 획득, 0이면 이미 처리된 attempt로 판단합니다.",
        "제출 권한을 획득한 요청만 답안 저장·채점·결과 저장을 진행합니다.",
        "나머지 요청은 기존 제출 결과를 조회해 반환합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "처리 흐름은 서버 시간 검증 → 조건부 상태 전이 → 권한 획득 요청만 채점·저장 → 나머지는 기존 결과 반환 순서로 정리됩니다. IN_PROGRESS 상태에서 최종 상태로 전이되는 작업이 단 한 번만 성공하는 구조입니다.",
      },
    {
      type: "code",
      language: "text",
      filename: "시험 제출 경합 처리 흐름",
      code: "수동 제출 요청 & 자동 제출 요청 동시 도착\n  ↓\nService: 서버 시간 기준 제한 시간 확인\n  제한 시간 이내 → 제출 사유: MANUAL_SUBMIT\n  제한 시간 이후 (자동) → 제출 사유: AUTO_SUBMIT\n  제한 시간 이후 (수동) → 정책에 따라 거부 또는 AUTO_SUBMIT 처리\n  ↓\nDB: IN_PROGRESS 조건부 상태 전이 시도\n  UPDATE exam_attempt\n  SET status = ?\n  WHERE id = ? AND status = 'IN_PROGRESS'\n  ↓\n[변경 row 수 = 1] → 이 요청이 제출 권한 획득\n  Service: 답안 검증\n  ScoringService: 채점\n  Transaction: 답안 / 문제별 결과 / 전체 결과 저장 + commit\n  → 제출 성공 응답\n  ↓\n[변경 row 수 = 0] → 이미 다른 요청이 처리 완료\n  Service: 기존 제출 결과 조회\n  → 중복 요청 응답 반환",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "상태 변경 이후 답안을 저장하는 방식은 위험합니다. 상태를 먼저 SUBMITTED로 바꿨는데 이후 답안 저장이 실패하면 제출 완료 상태인데 답안이 없는 상태가 됩니다. 답안 저장과 결과 저장이 완료된 후 마지막에 상태를 변경하거나, 전체를 하나의 트랜잭션으로 묶어 실패 시 rollback되도록 해야 합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "제한 시간 내 수동 제출",
          before: "정상 처리 (변경 없음)",
          after: "서버 시간 기준 확인 후 정상 처리",
          change: "유지",
        },
        {
          label: "수동·자동 제출 동시 요청",
          before: "둘 다 성공해 중복 저장 가능",
          after: "하나만 성공, 나머지는 기존 결과 반환",
          change: "차단",
        },
        {
          label: "이미 제출된 시험 재제출",
          before: "중복 제출 가능",
          after: "상태 전이 실패로 차단",
          change: "차단",
        },
        {
          label: "만료 처리 완료 후 수동 제출",
          before: "결과 덮어쓰기 가능",
          after: "기존 결과 반환",
          change: "차단",
        },
        {
          label: "브라우저 시간 조작 후 제출",
          before: "클라이언트 시간 기준으로 허용 가능",
          after: "서버 시간 기준으로 판단",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "시간 판단 기준",
          before: "클라이언트 타이머 의존 가능",
          after: "서버 시간 기준으로 통일",
          change: "개선",
        },
        {
          label: "제출 흐름",
          before: "수동·자동 로직 분리",
          after: "공통 제출 Service 사용",
          change: "개선",
        },
        {
          label: "상태 전이",
          before: "중복 전이 가능",
          after: "IN_PROGRESS에서 한 번만 전이",
          change: "개선",
        },
        {
          label: "중복 요청 처리",
          before: "답안·결과 중복 저장 가능",
          after: "기존 결과 반환 또는 차단",
          change: "차단",
        },
        {
          label: "최종 상태",
          before: "SUBMITTED·EXPIRED 충돌 가능",
          after: "하나의 최종 상태만 유지",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "사용자가 제출 버튼을 누르는 순간과 자동 타이머가 울리는 순간이 겹치더라도, 시스템은 하나의 정해진 문으로만 최종 상태에 들어갑니다. 시험 응시 상태는 더 이상 요청 도착 순서에 휘둘리지 않습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "시간 제한이 있는 기능은 단순한 타이머 UI가 아니라 서버 상태 전이 문제입니다. 프론트엔드 타이머는 사용자에게 남은 시간을 보여주는 역할을 할 수 있지만, 제출 가능 여부의 최종 판단 기준이 되어서는 안 됩니다.",
        "동시성 문제는 낮은 확률로 발생하더라도 한 번 발생하면 데이터 신뢰성을 크게 해칩니다. 시험 결과처럼 사용자의 성과에 직접 영향을 주는 기능에서는 최종 상태 전이가 반드시 한 번만 일어나야 합니다.",
        "이번 사례의 핵심은 '누가 먼저 요청했는가'보다 '누가 유효한 상태 전이에 성공했는가'를 기준으로 삼는 것입니다. 단순 조건 확인이 아니라 DB 조건부 업데이트로 원자적 권한 획득을 보장해야 합니다.",
        "수동 제출과 자동 제출을 별도 API로 분리하면 같은 도메인 작업이 서로 다른 규칙으로 처리될 위험이 있습니다. 공통 제출 Service로 통합해 제출 사유만 구분하는 방식이 더 안전합니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 Race Condition, State Transition, Conditional Update가 핵심 개념입니다. 시험 제출은 IN_PROGRESS 상태를 최종 상태로 바꾸는 전이 작업이며, 이 전이는 한 번만 성공해야 합니다. Optimistic Lock(버전 조건 업데이트)이나 Pessimistic Lock(행 잠금)도 대안이지만, MVP 단계에서는 상태 조건부 업데이트만으로 충분한 방어가 됩니다.",
    },
  ],
  relatedNoteSlugs: [
    "exam-submit-score-consistency",
    "question-update-child-data-transaction",
  ],
};
