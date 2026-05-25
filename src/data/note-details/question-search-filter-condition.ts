import type { TechnicalNoteDetail } from "@/types/note";
import { questionSearchFilterCondition } from "../notes/question-search-filter-condition";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const questionSearchFilterConditionDetail: TechnicalNoteDetail = {
  ...questionSearchFilterCondition,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서 관리자는 과목·단원·난이도·문제 유형·공개 여부·키워드 등을 조합해 문제를 검색할 수 있습니다. 하지만 동적 검색 조건을 조합하는 과정에서 일부 조건이 누락되거나 AND와 OR 조건이 의도와 다르게 묶이면 검색 결과에 원하지 않는 문제가 포함됩니다.",
    },
    {
      type: "list",
      items: [
        "키워드 검색과 과목 필터를 함께 사용했을 때 다른 과목의 문제가 함께 조회됨",
        "공개 여부 필터를 사용했을 때 비공개 문제가 섞여 조회됨",
        "soft delete된 문제가 일반 검색 결과에 포함됨",
        "작성자별 문제 조회에서 다른 사용자의 문제가 함께 조회됨",
        "난이도와 유형 필터를 조합했을 때 일부 조건만 적용된 결과가 조회됨",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "검색 결과가 조금 이상한 수준에서 끝나지 않습니다. 잘못된 문제가 시험 생성 후보로 사용되면 출제 의도와 다른 시험지가 만들어질 수 있습니다. 특히 괄호 하나가 빠졌을 뿐인데 검색 결과의 문이 엉뚱한 방향으로 열립니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 동적 쿼리에서 조건의 존재 여부만 관리하고, 조건의 논리적 결합 구조를 명확히 관리하지 않았기 때문입니다. 키워드 대상 필드끼리는 OR가 맞지만 그 외 필터와는 AND로 결합되어야 한다는 구조가 코드에 반영되지 않았습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "OR 조건 그룹핑 누락",
          description:
            "키워드 검색에서 제목·본문·해설을 OR로 묶어야 하는데, 이 OR 조건이 전체 WHERE 절에 퍼져 삭제·권한 조건을 우회합니다.",
          badge: "핵심 원인",
        },
        {
          title: "기본 조건 공통화 부재",
          description:
            "deleted_at IS NULL, owner_id, visibility 같은 조건을 각 쿼리에서 직접 조립하면 일부 쿼리에서 누락될 가능성이 높아집니다.",
          badge: "조건 누락",
        },
        {
          title: "조건 조립 순서 미정의",
          description:
            "기본 조건, 선택 필터, 키워드 조건 중 어떤 순서로 어떻게 결합하는지 명확한 기준 없이 리스트에 순서대로 추가했습니다.",
          badge: "구조 부재",
        },
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "잘못된 조건 조합 예시 vs 올바른 조건 조합",
      code: "-- 잘못된 경우: OR 조건이 전체 WHERE 절에 퍼짐\nWHERE deleted_at IS NULL\n  AND subject = '수학'\n  AND title LIKE '%확률%'\n   OR content LIKE '%확률%'   -- AND 바깥으로 빠짐\n   OR explanation LIKE '%확률%'\n\n-- 올바른 경우: 키워드 OR를 괄호로 그룹화\nWHERE deleted_at IS NULL\n  AND subject = '수학'\n  AND (\n      title LIKE '%확률%'\n   OR content LIKE '%확률%'\n   OR explanation LIKE '%확률%'\n  )",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "기본 조건 레이어",
          description:
            "삭제 여부, 권한, 공개 범위 조건을 항상 먼저 적용합니다. 검색 API마다 직접 작성하지 않고 공통 흐름에 포함합니다.",
          badge: "항상 적용",
        },
        {
          title: "선택 필터 레이어",
          description:
            "과목·단원·난이도·문제 유형은 요청 값이 있을 때만 AND 조건으로 추가합니다. 값이 없으면 해당 조건을 건너뜁니다.",
          badge: "AND 조건",
        },
        {
          title: "키워드 그룹 레이어",
          description:
            "키워드가 있으면 제목·본문·해설 검색 조건을 하나의 OR 그룹으로 만든 뒤 전체 조건에 AND로 결합합니다.",
          badge: "OR 내부 그룹",
        },
      ],
    },
    {
      type: "list",
      items: [
        "검색 요청을 SearchCondition 객체로 정리합니다.",
        "기본 조건(삭제 여부, 권한)은 항상 먼저 추가합니다.",
        "선택 필터는 값이 있을 때만 AND로 추가합니다.",
        "키워드 조건은 별도 OR 그룹으로 묶은 뒤 전체 조건에 AND로 추가합니다.",
        "검색 조건과 pagination 조건을 분리합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "검색 조건은 기본 조건 AND 권한 조건 AND 선택 필터 조건 AND 키워드 그룹 순서로 조립합니다. 키워드 그룹은 내부에서만 OR를 사용하고 전체 조건에는 AND로 결합되어 다른 필터를 우회하지 않습니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "검색 조건 조립 구조",
      code: "SearchCondition 조립 순서:\n1. deleted_at IS NULL           (기본 조건, 항상)\n2. owner_id = ? OR visibility = PUBLIC  (권한 조건)\n3. subject = ?                  (선택 필터, 값이 있을 때)\n4. difficulty = ?               (선택 필터, 값이 있을 때)\n5. question_type = ?            (선택 필터, 값이 있을 때)\n6. (\n     title LIKE ?               (키워드 그룹, OR 내부)\n  OR content LIKE ?\n  OR explanation LIKE ?\n   )                            (전체 조건에 AND로 결합)\n7. ORDER BY ? LIMIT ? OFFSET ?  (정렬 및 pagination)",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "과목 + 키워드 조합 검색",
          before: "다른 과목 문제 포함 가능",
          after: "지정 과목 문제만 조회",
          change: "정확",
        },
        {
          label: "soft delete 문제 포함 여부",
          before: "일부 쿼리에서 조회됨",
          after: "모든 쿼리에서 제외",
          change: "차단",
        },
        {
          label: "다른 사용자 문제 노출 여부",
          before: "권한 조건 누락 가능",
          after: "권한 조건 항상 적용",
          change: "차단",
        },
        {
          label: "복합 조건(5개) 조합 정확도",
          before: "조건 일부 우회 가능",
          after: "모든 조건 AND 적용",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "조건 조립 방식",
          before: "조건을 순서대로 추가",
          after: "기본/선택/키워드 계층 분리",
          change: "개선",
        },
        {
          label: "키워드 OR 처리",
          before: "전체 조건을 느슨하게 만들 수 있음",
          after: "키워드 그룹 내부에서만 OR",
          change: "개선",
        },
        {
          label: "기본 조건 적용 일관성",
          before: "쿼리마다 직접 작성해 누락 가능",
          after: "공통 흐름에서 항상 적용",
          change: "개선",
        },
        {
          label: "테스트 기준",
          before: "단일 필터 중심",
          after: "복합 조건 조합 중심",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "검색은 단순한 편의 기능이 아니라 문제은행 서비스의 입구입니다. 검색 결과가 정확해야 시험 생성·문제 관리·검토 작업도 정확해집니다. 조건 분리 이후 복합 필터 조합 시 의도하지 않은 문제가 검색 결과에 포함되지 않게 되었습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "동적 쿼리에서 중요한 것은 조건의 개수보다 조건의 결합 구조입니다. 각 조건이 존재하는지만 확인하면 충분해 보이지만, AND와 OR가 어떻게 묶이는지가 결과를 결정합니다.",
        "기본 조건을 매번 직접 작성하는 방식은 위험합니다. 삭제 여부·권한·공개 범위처럼 항상 지켜야 하는 조건은 공통 검색 흐름 안에 넣어야 합니다.",
        "문제 검색 쿼리는 체와 같습니다. 구멍이 하나만 커도 원하지 않는 데이터가 빠져나옵니다. 좋은 검색은 조건을 많이 붙이는 것이 아니라 조건의 구멍 크기를 정확히 맞추는 일입니다.",
        "초기에는 조건 조합의 정확성을 먼저 보장하는 것이 우선입니다. 검색 최적화(복합 인덱스, full-text search)는 실제 데이터 규모와 사용 패턴을 보고 결정해야 합니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "Operator Precedence 관점에서 AND는 OR보다 우선순위가 높습니다. 괄호 없이 조건을 나열하면 AND가 먼저 묶인 뒤 OR가 적용되어 의도와 다른 논리 구조가 됩니다. QueryDSL의 BooleanBuilder나 Expressions.anyOf()를 사용할 때도 OR 그룹은 명시적으로 감싸야 합니다.",
    },
  ],
  relatedNoteSlugs: [
    "question-option-answer-consistency",
    "question-update-child-data-transaction",
  ],
};
