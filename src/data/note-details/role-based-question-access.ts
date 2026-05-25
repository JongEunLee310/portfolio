import type { TechnicalNoteDetail } from "@/types/note";
import { roleBasedQuestionAccess } from "../notes/role-based-question-access";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const roleBasedQuestionAccessDetail: TechnicalNoteDetail = {
  ...roleBasedQuestionAccess,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서는 사용자 역할에 따라 문제에 접근할 수 있는 범위가 달라집니다. 관리자는 전체 문제를 관리하고, 출제자는 자신이 등록한 문제를 수정할 수 있으며, 학생은 자신에게 배정된 시험의 문제만 조회할 수 있어야 합니다. 하지만 문제 조회·수정·삭제 API에서 로그인 여부나 역할만 확인하면 사용자가 접근하면 안 되는 문제에 접근하는 상황이 발생합니다.",
    },
    {
      type: "list",
      items: [
        "출제자 권한만 확인 → 다른 출제자의 문제 수정 가능 (소유권 검증 누락)",
        "학생 권한만 확인 → 배정되지 않은 시험 문제 조회 가능 (시험 배정 검증 누락)",
        "관리자 API만 분리 → 일반 문제 API에서는 권한 범위 누락",
        "문제 ID 직접 접근 → 화면에서는 안 보이지만 API 직접 호출 시 반환됨",
        "soft delete된 문제 ID 접근 → 삭제 정책 우회",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "이 문제는 단순한 화면 표시 오류가 아니라 IDOR(Insecure Direct Object Reference) 취약점입니다. 문제 ID를 알기만 하면 남의 서랍을 열 수 있는 구조가 됩니다. 권한 없는 사용자가 문제 내용을 조회하거나 수정할 수 있는 보안 문제로 이어집니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 인증과 인가의 책임을 구분하지 않았기 때문입니다. 인증은 '누구인가'를 확인하는 과정이고, 인가는 '이 사용자가 이 리소스에 접근할 수 있는가'를 판단하는 과정입니다. 역할 검증은 기능 접근을 막는 데는 유용하지만 개별 리소스 접근을 판단하기에는 부족합니다. 두 출제자가 모두 TEACHER 역할이라면 role == TEACHER 조건은 둘 다 통과합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "role 기반 검증에만 의존",
          description:
            "같은 역할 내 리소스 경계가 없어 동일 역할 사용자 간 접근이 구분되지 않습니다.",
          badge: "핵심 원인",
        },
        {
          title: "questionId 단독 조회",
          description:
            "findById(questionId)처럼 ID만으로 조회하면 owner, visibility, deleted 상태 조건이 빠집니다. 문제 조회는 'ID가 존재하는가'가 아니라 '이 사용자에게 보이는 ID인가'를 기준으로 해야 합니다.",
          badge: "조회 조건 부재",
        },
        {
          title: "Service 인가 책임 누락",
          description:
            "Repository 조회 전 접근 가능 여부를 판단하지 않아 데이터가 반환된 이후에야 권한 체크를 시도합니다.",
          badge: "계층 책임 불명확",
        },
        {
          title: "API별 검증 방식 불일치",
          description:
            "조회·수정·삭제 API마다 권한 기준이 달라져 일부 API에서 검증이 누락됩니다.",
          badge: "일관성 부재",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "403과 404 응답 정책도 사전에 정해야 합니다. 보안 관점에서는 권한 없는 리소스에 404를 반환하면 리소스 존재 여부 노출을 줄일 수 있습니다. 관리자 기능에서는 403이 더 명확할 수 있으므로 API 성격에 따라 정책을 정해야 합니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "Service에서 리소스 인가 검증",
          description:
            "소유권, 배정 여부, 상태를 Service 레이어에서 확인합니다. 도메인 규칙을 반영하기 적합합니다.",
          badge: "채택",
        },
        {
          title: "Repository에서 접근 조건 포함 조회",
          description:
            "owner_id, deleted_at, 배정 관계를 조회 조건에 함께 포함해 데이터 노출 자체를 차단합니다.",
          badge: "채택",
        },
        {
          title: "Controller에서 역할 기반 1차 제한",
          description:
            "기능 접근 자체는 역할로 먼저 제한합니다. 리소스 단위 검증은 Service에서 담당합니다.",
          badge: "함께 채택",
        },
        {
          title: "AOP로 권한 검증",
          description:
            "공통 처리가 가능하지만 복잡한 리소스 관계(소유권, 배정)에는 적합하지 않습니다.",
          badge: "보조 검토",
        },
      ],
    },
    {
      type: "list",
      items: [
        "인증은 Security(Filter)에서 처리합니다.",
        "역할 기반 기능 접근은 Controller 또는 Method Security에서 1차로 제한합니다.",
        "리소스 소유권과 배정 여부는 Service에서 검증합니다.",
        "Repository 조회 시 questionId만이 아니라 사용자 접근 조건을 함께 사용합니다.",
        "권한 없는 리소스는 정책에 따라 404 또는 403으로 응답합니다.",
        "조회·수정·삭제 API에서 동일한 인가 기준을 재사용합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "처리 흐름은 인증(Security) → 역할 확인(Controller) → 접근 조건 포함 조회(Service + Repository) → 결과 없으면 404/403 응답 순서로 정리됩니다. 문제 ID를 알더라도 접근 조건을 만족하지 못하면 조회 결과 자체가 나오지 않습니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "접근 조건 포함 조회 구조",
      code: "출제자 문제 조회 / 수정:\n  WHERE id = :questionId\n    AND owner_id = :currentUserId\n    AND deleted_at IS NULL\n\n학생 시험 문제 조회:\n  SELECT q.*\n  FROM question q\n  JOIN exam_question eq ON eq.question_id = q.id\n  JOIN exam_attempt ea ON ea.exam_id = eq.exam_id\n  WHERE q.id = :questionId\n    AND ea.user_id = :currentUserId\n    AND q.deleted_at IS NULL\n\n조회 결과 없음\n  → 리소스가 없거나 접근 권한 없음\n  → 404 (일반 사용자) 또는 403 (관리자 기능)\n\n조회 결과 있음\n  → 접근 가능한 문제로 처리\n  → 조회 / 수정 / 삭제 진행",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "접근 조건을 Repository 조회에 포함하는 방식은 Service에서 별도로 소유권을 확인하는 방식보다 안전합니다. 데이터를 먼저 가져온 뒤 권한을 확인하면, 권한이 없어도 이미 데이터가 메모리에 올라온 상태입니다. 조회 자체가 실패하도록 만드는 것이 더 근본적인 방어입니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "출제자가 다른 출제자 문제 조회",
          before: "역할 확인 통과 후 조회 성공",
          after: "owner_id 조건 불일치로 조회 실패",
          change: "차단",
        },
        {
          label: "출제자가 다른 출제자 문제 수정",
          before: "수정 가능",
          after: "접근 조건 포함 조회 실패로 수정 불가",
          change: "차단",
        },
        {
          label: "학생이 배정되지 않은 시험 문제 조회",
          before: "학생 역할 확인 후 조회 성공",
          after: "배정 관계 조건 불일치로 조회 실패",
          change: "차단",
        },
        {
          label: "questionId 직접 API 호출",
          before: "문제 내용 반환 가능",
          after: "접근 조건 미충족으로 404 반환",
          change: "차단",
        },
        {
          label: "soft delete된 문제 접근",
          before: "일부 쿼리에서 조회 가능",
          after: "deleted_at IS NULL 조건으로 차단",
          change: "차단",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "권한 검증 기준",
          before: "역할 중심",
          after: "역할 + 소유권 + 관계 + 상태",
          change: "개선",
        },
        {
          label: "문제 조회 방식",
          before: "questionId 단독 조회",
          after: "접근 조건 포함 조회",
          change: "개선",
        },
        {
          label: "ID 직접 접근",
          before: "문제 노출 가능",
          after: "접근 불가 처리",
          change: "차단",
        },
        {
          label: "삭제 데이터 접근",
          before: "일부 쿼리에서 누락 가능",
          after: "기본 조건으로 차단",
          change: "차단",
        },
        {
          label: "API별 권한 정책",
          before: "제각각일 수 있음",
          after: "공통 인가 기준 적용",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "사용자는 자신에게 허용된 문제만 조회하거나 수정할 수 있게 됩니다. 문제은행 서비스에서 문제 데이터는 단순 콘텐츠가 아니라 출제 권한, 시험 배정, 학습 결과와 연결된 자원입니다. 문제 접근 권한을 정교하게 다루는 것은 기능 안정성뿐 아니라 서비스 신뢰성과도 직결됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "인증과 인가는 분리해서 생각해야 합니다. 로그인한 사용자라고 해서 모든 문제에 접근할 수 있는 것은 아닙니다. 역할은 문을 통과할 수 있는 신분증에 가깝고, 리소스 권한은 특정 방의 열쇠에 가깝습니다.",
        "권한 검증은 화면에서 버튼을 숨기는 것만으로는 충분하지 않습니다. 사용자는 API를 직접 호출할 수 있으므로 서버는 항상 최종 방어선이 되어야 합니다.",
        "리소스 접근은 '이 ID가 존재하는가'가 아니라 '이 사용자에게 보이는 ID인가'를 기준으로 조회해야 합니다. 접근 조건을 조회 자체에 포함하는 방식이 데이터를 가져온 뒤 확인하는 방식보다 안전합니다.",
        "조회·수정·삭제 API에서 동일한 인가 기준을 재사용해야 합니다. API별로 권한 로직이 다르면 일부 API에서 검증이 누락될 위험이 높아집니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 RBAC(역할 기반 접근 제어)만으로는 부족하고 리소스 단위 권한 검증이 함께 필요하다는 점이 핵심입니다. IDOR(Insecure Direct Object Reference)는 ID를 직접 조작해 권한 없는 리소스에 접근하는 취약점으로, 리소스 조회 조건에 소유권 필터를 포함하는 것이 가장 효과적인 방어 방법입니다. Least Privilege 원칙에 따라 각 역할이 필요한 최소 범위만 접근하도록 설계해야 합니다.",
    },
  ],
  relatedNoteSlugs: [
    "question-search-filter-condition",
    "exam-submit-score-consistency",
  ],
};
