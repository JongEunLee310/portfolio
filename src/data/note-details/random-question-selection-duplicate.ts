import type { TechnicalNoteDetail } from "@/types/note";
import { randomQuestionSelectionDuplicate } from "../notes/random-question-selection-duplicate";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const randomQuestionSelectionDuplicateDetail: TechnicalNoteDetail = {
  ...randomQuestionSelectionDuplicate,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서 사용자는 과목·단원·난이도·문제 유형·문제 수를 지정해 랜덤 시험지를 생성할 수 있습니다. 시스템은 조건에 맞는 후보 문제에서 요청한 개수만큼 문제를 추출해야 합니다. 하지만 랜덤 추출 로직이 명확하지 않거나 후보군 부족 상황을 처리하지 않으면 하나의 시험지 안에 동일한 문제가 중복 포함됩니다.",
    },
    {
      type: "list",
      items: [
        "후보 문제 수가 요청 문제 수보다 적을 때 같은 문제가 반복 포함됨",
        "랜덤 인덱스 기반 추출에서 이미 선택된 인덱스가 다시 선택됨",
        "난이도별 문제 수 배분 시 특정 난이도 후보가 부족해 중복 선택됨",
        "문제 ID 중복 검증 누락으로 최종 시험지에 같은 문제 ID가 여러 번 저장됨",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "사용자 입장에서는 같은 문제가 반복 출제되어 시험 품질이 떨어지고 결과 통계도 왜곡됩니다. 시험지가 랜덤하게 섞인 카드 묶음이어야 하는데, 같은 카드가 두 장 복사되어 들어간 상태가 됩니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 랜덤 추출을 '문제 개수를 채우는 과정'으로만 보고 '고유한 문제 집합을 구성하는 과정'으로 보지 않았기 때문입니다. 랜덤 시험 생성에는 필터 조건 충족, 개수 충족, 고유성 보장, 실패 처리가 동시에 필요합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "후보 문제 수 확인 누락",
          description:
            "요청 수보다 후보가 적어도 생성을 진행해 부족한 만큼 기존 문제를 반복 선택합니다.",
          badge: "핵심 원인",
        },
        {
          title: "랜덤 인덱스 반복 선택",
          description:
            "후보 [Q1, Q2, Q3, Q4, Q5]에서 3개를 뽑는데 [Q2, Q2, Q4]처럼 같은 인덱스가 여러 번 선택될 수 있습니다.",
          badge: "복원 추출",
        },
        {
          title: "List 기반 단순 append",
          description:
            "선택 결과를 리스트에 추가할 때 이미 선택된 문제인지 확인하지 않아 중복이 포함됩니다.",
          badge: "검증 누락",
        },
        {
          title: "DB 저장 제약 부재",
          description:
            "같은 exam_id + question_id 조합에 대한 유니크 제약이 없어 중복 매핑이 저장됩니다.",
          badge: "DB 방어 부재",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "후보 문제 수가 부족한 상황은 반드시 별도로 처리해야 합니다. 요청한 문제 수가 20개인데 조건에 맞는 문제가 12개뿐이라면 시험 생성은 실패해야 합니다. 같은 문제를 반복해서 20개를 채우는 것은 기능 성공이 아니라 데이터 품질 실패입니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "랜덤 인덱스 반복 선택",
          description: "구현이 단순하지만 중복이 발생할 수 있습니다. 미채택합니다.",
          badge: "미채택",
        },
        {
          title: "후보 목록 shuffle 후 N개 선택",
          description:
            "비복원 추출로 중복이 없고 구현이 직관적입니다. MVP 단계에 적합합니다.",
          badge: "채택",
        },
        {
          title: "DB에서 ORDER BY RANDOM + LIMIT",
          description: "구현이 간단하지만 대량 데이터에서 성능 부담이 생깁니다. 소규모에서만 사용합니다.",
          badge: "보조 검토",
        },
        {
          title: "exam-question 유니크 제약",
          description:
            "저장 단계에서 중복을 방어합니다. 애플리케이션 레벨 검증과 함께 이중 방어로 채택합니다.",
          badge: "함께 채택",
        },
      ],
    },
    {
      type: "list",
      items: [
        "조건에 맞는 후보 문제를 조회합니다.",
        "후보 문제 수가 요청 수보다 적으면 즉시 실패 응답을 반환합니다.",
        "후보 목록을 shuffle한 뒤 앞에서 요청 수만큼 선택합니다.",
        "선택된 문제 ID 수와 고유 ID 수가 같은지 검증합니다.",
        "시험지와 문제 매핑을 저장합니다. DB에는 exam_id + question_id 중복 제약을 둡니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "처리 흐름은 후보 수 검증 → shuffle 선택 → 고유성 검증 → 저장 순서로 정리됩니다. 중복 제거를 운에 맡기지 않고 명시적 규칙으로 고정합니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "랜덤 시험 생성 흐름",
      code: "Client → Controller: 랜덤 시험 생성 요청\nService → Repository: 조건에 맞는 후보 문제 조회\n\n후보 수 검증\n  후보 수 < 요청 수 → 즉시 실패 반환 (400)\n  후보 수 >= 요청 수 → 다음 단계\n\n비복원 추출\n  후보 목록 shuffle\n  앞에서 N개 선택\n\n고유성 검증\n  선택 문제 ID 수 == 고유 ID 수 → 통과\n  다르면 → 시험 생성 실패 (내부 오류)\n\nService → ExamRepo: 시험지 및 문제 매핑 저장\nDB: exam_id + question_id 유니크 제약으로 이중 방어\nController → Client: 201 Created",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "고유성 검증은 선택된 문제 수와 Set으로 변환한 고유 ID 수를 비교합니다. 요청 5개, 선택 결과 [1, 2, 2, 3, 4]라면 고유 수는 4개로 불일치합니다. 이 케이스는 shuffle 기반 선택에서는 발생하지 않지만 최종 안전망으로 두는 것이 좋습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "후보 3개, 요청 5개 시험 생성",
          before: "중복으로 채워져 생성됨",
          after: "생성 실패, 명확한 안내",
          change: "차단",
        },
        {
          label: "후보 5개, 요청 5개 시험 생성",
          before: "중복 가능 (랜덤 인덱스)",
          after: "5개 고유 문제로 정상 생성",
          change: "보장",
        },
        {
          label: "중복 문제 ID 포함 시험지 저장",
          before: "저장됨",
          after: "서비스 검증 + DB 제약으로 차단",
          change: "차단",
        },
        {
          label: "시험지 문제 고유성",
          before: "보장 안 됨",
          after: "100% 보장",
          change: "보장",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "후보 부족 처리",
          before: "중복으로 채워질 수 있음",
          after: "생성 전 실패 처리",
          change: "개선",
        },
        {
          label: "랜덤 선택 방식",
          before: "복원 추출 (반복 선택 가능)",
          after: "비복원 추출 (shuffle + slice)",
          change: "개선",
        },
        {
          label: "최종 검증",
          before: "개수만 확인",
          after: "고유 문제 ID까지 확인",
          change: "개선",
        },
        {
          label: "저장 안정성",
          before: "중복 매핑 저장 가능",
          after: "서비스·DB 이중 방어",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "랜덤성은 유지하되 시험지의 품질 기준은 흔들리지 않게 되었습니다. 주사위는 굴리되 같은 문제를 몰래 복사해 넣지 않는 구조가 된 셈입니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "랜덤 기능은 단순히 무작위로 뽑는 것이 아니라 결과의 제약 조건까지 함께 보장해야 합니다. 시험 생성에서 중요한 것은 '랜덤하게 보이는 결과'가 아니라 '조건을 만족하는 고유한 문제 집합'입니다.",
        "후보군이 부족한 상황을 성공으로 처리하려고 하면 데이터 품질 문제가 생깁니다. '조건에 맞는 문제가 부족하다'고 명확히 알려주는 것이 더 안전합니다.",
        "애플리케이션 레벨 검증만으로는 충분하지 않을 수 있습니다. 서비스 로직에서 중복을 막더라도 동시 요청이나 다른 저장 경로를 고려하면 DB 제약 조건도 함께 두는 것이 좋습니다.",
        "초기 단계에서는 성능 최적화보다 중복 없는 결과와 후보 부족 처리 기준을 먼저 고정하는 것이 중요합니다. ORDER BY RANDOM() 성능 문제는 데이터가 많아진 뒤 검토해도 늦지 않습니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "Sampling Without Replacement(비복원 추출)가 핵심 개념입니다. 시험지는 같은 문제를 여러 번 뽑는 복원 추출이 아니라, 한 번 뽑은 문제는 다시 뽑지 않는 비복원 추출이어야 합니다. shuffle 후 slice는 이를 가장 간단하게 보장하는 방법입니다.",
    },
  ],
  relatedNoteSlugs: [
    "question-option-answer-consistency",
    "question-search-filter-condition",
  ],
};
