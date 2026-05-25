import type { TechnicalNoteDetail } from "@/types/note";
import { softDeleteQueryLeak } from "../notes/soft-delete-query-leak";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const softDeleteQueryLeakDetail: TechnicalNoteDetail = {
  ...softDeleteQueryLeak,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서는 문제를 삭제할 때 실제 데이터를 바로 제거하지 않고 deleted_at 컬럼으로 삭제 상태를 표시하는 Soft Delete를 사용합니다. 그런데 일부 조회 로직에서 deleted_at IS NULL 조건이 누락되면 삭제된 문제가 일반 검색 결과나 시험 생성 후보에 다시 노출될 수 있습니다.",
    },
    {
      type: "list",
      items: [
        "문제 목록 조회 → 삭제 조건 있음, 검색 쿼리 → 삭제 조건 없음 (불일치)",
        "시험 생성 후보 조회에 삭제 조건 누락 → 폐기된 문제가 시험지에 포함",
        "상세 조회가 ID만 사용 → deleted_at 무관하게 삭제 문제 직접 접근 가능",
        "통계 쿼리에 삭제 조건 없음 → 삭제 문제까지 일반 통계에 포함",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "특히 위험한 경우는 시험 생성 후보 조회입니다. 문제 관리자가 삭제한 문제는 더 이상 사용하지 않겠다는 의미인데, 랜덤 시험 생성이나 조건별 시험 생성에서 삭제된 문제가 후보로 포함되면 사용자는 이미 폐기된 문제를 다시 풀게 됩니다. 삭제된 문제는 무대 뒤로 내려간 배우인데, 쿼리 조건 하나가 빠지면 다시 시험장 조명 아래로 끌려 나올 수 있습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 Soft Delete를 저장 방식으로만 도입하고 조회 정책으로는 충분히 정리하지 않았기 때문입니다. deleted_at에 값을 채우는 것만으로는 완성되지 않으며, 삭제 이후 모든 조회 흐름에서 '삭제된 데이터를 볼 것인가'라는 기준이 필요합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "조회별 조건 중복 작성",
          description:
            "각 Repository 메서드마다 삭제 조건을 직접 추가해야 해서 일부 메서드에서 누락이 발생합니다.",
          badge: "핵심 원인",
        },
        {
          title: "기본 조회 정책 부재",
          description:
            "일반 조회의 기본값이 명확하지 않아 개발자마다 조건 추가 여부가 달라집니다.",
          badge: "정책 없음",
        },
        {
          title: "일반 조회와 복구 조회 혼재",
          description:
            "삭제 포함 조회가 일반 조회와 명확히 분리되지 않아 의도치 않게 섞일 수 있습니다.",
          badge: "책임 혼재",
        },
        {
          title: "시험 생성 후보 조건 누락",
          description:
            "출제 가능 문제 기준이 명확히 정의되지 않아 active 문제만 후보로 올려야 한다는 제약이 쿼리에 반영되지 않습니다.",
          badge: "출제 오류",
        },
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "일반 조회 vs 복구 조회 조건 차이",
      code: "// 위험: 삭제 조건 없는 단순 조회\nfindById(questionId)\n  → DELETE된 문제도 반환\n\n// 올바른 일반 사용자 조회\nSELECT * FROM question\nWHERE id = :id\n  AND deleted_at IS NULL\n\n// 권한 포함 시\nSELECT * FROM question\nWHERE id = :id\n  AND owner_id = :ownerId\n  AND deleted_at IS NULL\n\n// 관리자 복구 목록 조회\nSELECT * FROM question\nWHERE deleted_at IS NOT NULL",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "모든 쿼리에 직접 조건 추가",
          description:
            "구현이 단순하지만 메서드가 늘어날수록 누락 가능성이 높습니다.",
          badge: "지양",
        },
        {
          title: "Repository 공통 조건 메서드 사용",
          description:
            "반복되는 active 조건 생성을 공통 메서드로 줄입니다. 개발자가 명시적으로 사용해야 합니다.",
          badge: "채택",
        },
        {
          title: "일반 조회·삭제 포함 조회 메서드 분리",
          description:
            "메서드 이름만 봐도 삭제 데이터 포함 여부를 알 수 있어 의도가 명확합니다.",
          badge: "채택",
        },
        {
          title: "ORM 전역 필터 사용",
          description:
            "누락 위험을 줄일 수 있지만 관리자 복구 조회에서 예외 처리가 필요합니다.",
          badge: "추후 검토",
        },
      ],
    },
    {
      type: "list",
      items: [
        "일반 사용자 조회에서는 삭제되지 않은 데이터만 조회합니다.",
        "삭제된 데이터가 필요한 기능은 메서드 이름과 책임을 명확히 분리합니다.",
        "시험 생성 후보 조회에는 삭제 조건을 반드시 포함합니다.",
        "문제 상세, 수정, 삭제 API도 삭제되지 않은 문제만 대상으로 합니다.",
        "테스트 데이터에 삭제된 문제를 포함해 조건 누락 여부를 검증합니다.",
        "공통 조건 생성 메서드로 deleted_at IS NULL 누락 가능성을 줄입니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "Repository 메서드를 active 조회와 deleted 조회로 분리합니다. 일반 서비스는 active 조회 메서드만 사용하고, 관리자 복구 기능만 deleted 조회를 사용합니다. 메서드 이름만 보고도 삭제 데이터 포함 여부를 알 수 있도록 명명합니다.",
      },
    {
      type: "code",
      language: "text",
      filename: "Repository 메서드 명명 규칙과 처리 흐름",
      code: "// 일반 서비스에서 사용 (active 전용)\nfindActiveById(id)\nfindActiveByCondition(condition)\n\n// 관리자·복구 기능에서만 사용\nfindDeletedById(id)\nfindAllDeleted()\nfindByIdIncludingDeleted(id)\n\n일반 문제 검색 흐름:\n  QuestionService.search()\n    → QuestionRepository.findActiveByCondition()\n    → WHERE deleted_at IS NULL + 검색 조건\n    → 삭제 문제 제외된 결과 반환\n\n관리자 복구 목록 흐름:\n  AdminQuestionService.listDeleted()\n    → QuestionRepository.findAllDeleted()\n    → WHERE deleted_at IS NOT NULL\n    → 복구 대상 목록 반환\n\n시험 생성 후보 흐름:\n  ExamService.generateCandidates()\n    → QuestionRepository.findActiveByCondition(examCriteria)\n    → WHERE deleted_at IS NULL + 난이도/유형 조건\n    → 폐기 문제 제외된 후보 반환",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "findByIdIncludingDeleted 같은 메서드는 일반 서비스에서 쉽게 사용하지 않도록 주의해야 합니다. 메서드 이름에 Including Deleted 또는 Deleted를 명시해 코드 리뷰 시 의도를 확인할 수 있게 합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "일반 문제 목록 조회",
          before: "삭제 조건 누락 가능",
          after: "active 조회 기본 적용",
          change: "개선",
        },
        {
          label: "문제 검색 (삭제 문제에만 키워드 일치)",
          before: "검색 결과에 포함",
          after: "검색 결과 없음",
          change: "차단",
        },
        {
          label: "삭제된 ID로 상세 조회",
          before: "삭제 문제 반환 가능",
          after: "404 또는 조회 실패",
          change: "차단",
        },
        {
          label: "시험 생성 후보 (삭제 문제 조건 부합)",
          before: "후보에 포함",
          after: "후보에서 제외",
          change: "차단",
        },
        {
          label: "관리자 복구 목록 조회",
          before: "일반 조회와 혼재 가능",
          after: "deleted 조회로 명확히 분리",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "일반 조회",
          before: "삭제 조건 누락 가능",
          after: "active 조회 기본 적용",
          change: "개선",
        },
        {
          label: "문제 검색",
          before: "삭제 문제 포함 가능",
          after: "삭제 문제 제외",
          change: "개선",
        },
        {
          label: "시험 생성 후보",
          before: "삭제 문제 출제 가능",
          after: "active 문제만 후보",
          change: "개선",
        },
        {
          label: "관리자 복구 조회",
          before: "일반 조회와 혼재 가능",
          after: "deleted 조회로 분리",
          change: "개선",
        },
        {
          label: "테스트 기준",
          before: "정상 데이터 중심",
          after: "삭제 데이터 포함 검증",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "Soft Delete된 문제는 DB에 남아 있지만, 일반 서비스 흐름에서는 퇴장한 데이터처럼 다뤄집니다. 다시 무대에 올리는 일은 관리자 복구 기능처럼 명시적인 통로를 통해서만 가능합니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "Soft Delete는 삭제 기능이 아니라 조회 정책까지 포함하는 설계입니다. deleted_at 값을 채우는 것만으로는 삭제가 완성되지 않습니다.",
        "일반 조회와 관리자 조회는 목적이 다릅니다. 목적이 다른 조회를 같은 Repository 메서드로 처리하면 조건 누락이 발생하기 쉽습니다.",
        "시험 생성 후보 조회에는 삭제 조건이 반드시 들어가야 합니다. 문제 관리자가 삭제한 문제는 더 이상 출제 대상이 아니어야 합니다.",
        "테스트 데이터에 삭제된 문제를 포함해야 조건 누락을 조기에 발견할 수 있습니다. 정상 데이터만으로 구성된 테스트는 Soft Delete 정책 위반을 감지하지 못합니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 Soft Delete와 Query Filter가 핵심 개념입니다. Soft Delete된 데이터는 DB에 존재하지만 일반 기능에서는 존재하지 않는 것처럼 다뤄야 합니다. 향후에는 과거 시험 결과와 삭제 문제의 관계를 별도로 설계해야 합니다. 이미 시험에 출제된 문제를 삭제하더라도 과거 사용자의 시험 결과에서는 당시 문제 내용이 보여야 할 수 있으므로, 제출 당시 문제 본문과 선택지를 스냅샷으로 저장하는 방식을 검토할 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "question-search-filter-condition",
    "role-based-question-access",
  ],
};
