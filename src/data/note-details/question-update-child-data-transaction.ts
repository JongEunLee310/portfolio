import type { TechnicalNoteDetail } from "@/types/note";
import { questionUpdateChildDataTransaction } from "../notes/question-update-child-data-transaction";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const questionUpdateChildDataTransactionDetail: TechnicalNoteDetail = {
  ...questionUpdateChildDataTransaction,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서 문제 수정 기능은 단순히 하나의 레코드를 바꾸는 작업이 아닙니다. 문제 본문은 question 데이터에 해당하고, 선택지·정답·해설·태그는 별도 하위 데이터로 관리됩니다. 수정 요청을 처리하는 도중 일부 단계에서 예외가 발생하면 문제가 불완전한 상태로 남을 수 있습니다.",
    },
    {
      type: "list",
      items: [
        "문제 본문이 수정됐지만 선택지는 이전 상태로 남음",
        "선택지 일부만 변경되고 정답은 기존 값을 참조함",
        "정답은 변경됐지만 선택지 목록과 불일치",
        "문제와 정답은 변경됐지만 해설은 이전 문제 기준으로 남음",
        "선택지 삭제 후 정답 저장에 실패해 채점 기준이 손상됨",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "이런 상태가 저장되면 문제 조회 화면에서는 정상처럼 보일 수 있지만, 시험 생성이나 채점 단계에서 뒤늦게 오류가 드러납니다. 특히 선택지는 바뀌었는데 정답이 이전 선택지를 가리키고 있으면 사용자는 정답이 없는 문제를 풀게 됩니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 문제 수정 작업의 실제 복잡도에 비해 트랜잭션 경계를 좁게 잡았기 때문입니다. 문제 수정은 겉으로는 하나의 API지만 내부적으로 여러 데이터 변경을 포함합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "트랜잭션 경계 불명확",
          description:
            "문제와 하위 데이터가 하나의 작업 단위로 묶이지 않아 중간 실패 시 부분 반영 상태가 남습니다.",
          badge: "핵심 원인",
        },
        {
          title: "검증보다 저장이 먼저 수행됨",
          description:
            "일부 데이터를 저장한 뒤 검증 실패가 발생하면 이미 저장된 데이터를 되돌리기 어렵습니다.",
          badge: "순서 문제",
        },
        {
          title: "하위 데이터 처리 순서 의존",
          description:
            "선택지 삭제 후 정답 저장에 실패하면 기존 선택지는 사라지고 새 정답도 없는 상태가 됩니다.",
          badge: "삭제-재생성",
        },
        {
          title: "수정 전략 미정의",
          description:
            "전체 교체 방식인지 부분 수정 방식인지 기준이 불명확해 Repository마다 처리 방식이 달랐습니다.",
          badge: "기준 부재",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "가장 위험한 지점은 기존 데이터를 먼저 삭제하고 새 데이터를 저장하는 방식입니다. 구현이 단순하지만 중간 단계에서 실패하면 기존 데이터도 잃고 새 데이터도 완성되지 않는 상태가 됩니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "전체 교체 방식",
          description:
            "기존 하위 데이터를 정리하고 요청 기준으로 전체를 다시 저장합니다. 구현이 단순하고 DB 상태와 요청 상태를 맞추기 쉽습니다. 반드시 트랜잭션으로 보호합니다.",
          badge: "MVP 채택",
        },
        {
          title: "변경분 반영 방식",
          description:
            "기존 데이터와 요청 데이터를 비교해 변경된 항목만 수정합니다. 변경량을 최소화하지만 비교 로직이 복잡합니다.",
          badge: "추후 개선",
        },
        {
          title: "부분 PATCH 방식",
          description:
            "필요한 필드만 선택적으로 수정합니다. 정합성 검증이 어려워 제한적으로 사용합니다.",
          badge: "제한적 사용",
        },
      ],
    },
    {
      type: "list",
      items: [
        "수정 요청 전체를 먼저 검증합니다. 검증이 끝나기 전에는 기존 데이터를 변경하지 않습니다.",
        "문제 본문, 선택지, 정답, 해설 변경을 하나의 트랜잭션으로 묶습니다.",
        "중간 단계에서 예외가 발생하면 전체 변경을 rollback합니다.",
        "문제 등록과 문제 수정에서 동일한 정합성 검증 규칙을 재사용합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "수정 흐름은 검증 → 트랜잭션 시작 → 기존 하위 데이터 정리 → 새 데이터 저장 → commit 순서로 정리됩니다. 검증 실패는 트랜잭션 안에서 rollback할 문제가 아니라, 애초에 저장 단계로 진입하지 않아야 하는 문제입니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "해결 후 문제 수정 흐름",
      code: "Client → Controller: 문제 수정 요청\nController: 기본 형식 검증 (DTO)\nController → Service: 수정 요청 전달\n\nService → Repository: 수정 대상 문제 조회\nService → Validator: 수정 요청 전체 정합성 검증\n\n검증 실패 시\n  Validator → Service: 검증 예외 (저장 전 차단)\n  Controller → Client: 400 Bad Request\n\n검증 성공 시\n  Service: Transaction 시작\n  Service → Repository: 문제 기본 정보 수정\n  Service → Repository: 기존 선택지/정답/해설 정리\n  Service → Repository: 새 선택지/정답/해설 저장\n  Service: Commit\n  Controller → Client: 200 OK",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "정답 없는 객관식으로 수정",
          before: "수정 가능 (부분 반영)",
          after: "수정 실패, 기존 유지",
          change: "차단",
        },
        {
          label: "선택지-정답 불일치 수정",
          before: "수정 가능 (채점 기준 손상)",
          after: "수정 실패, 기존 유지",
          change: "차단",
        },
        {
          label: "해설 저장 중 예외 발생",
          before: "본문·선택지만 변경됨",
          after: "전체 rollback",
          change: "개선",
        },
        {
          label: "오류 발견 시점",
          before: "채점·시험 생성 단계",
          after: "수정 요청 즉시",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "수정 단위",
          before: "문제/선택지/정답 개별 처리",
          after: "하나의 작업 단위로 처리",
          change: "개선",
        },
        {
          label: "검증 시점",
          before: "일부 저장 후 검증 가능",
          after: "저장 전 전체 검증",
          change: "개선",
        },
        {
          label: "실패 시 상태",
          before: "부분 반영 가능",
          after: "기존 데이터 유지",
          change: "개선",
        },
        {
          label: "채점 로직 부담",
          before: "불완전한 문제 방어 필요",
          after: "정합한 문제를 전제로 처리",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "문제 수정 API는 성공하면 전체 반영, 실패하면 기존 상태 유지라는 명확한 규칙을 갖게 되었습니다. 이후 시험 생성과 채점 로직이 불완전한 문제를 방어하는 코드를 줄일 수 있는 구조가 되었습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "하나의 API가 하나의 테이블 변경을 의미하지 않습니다. 도메인 관점에서 API 단위와 트랜잭션 단위를 함께 정의해야 합니다.",
        "저장 후 검증하는 방식은 위험합니다. 검증은 가능한 한 저장 전에 수행해야 하며, 저장이 필요한 검증이라면 반드시 트랜잭션 안에서 처리해야 합니다.",
        "문제 수정은 수술에 가깝습니다. 절개만 하고 봉합하지 않으면 안 됩니다. 메스가 들어갔다면 끝까지 하나의 흐름으로 책임져야 합니다.",
        "이미 시험에 사용된 문제는 수정 정책을 별도로 고민해야 합니다. 운영 단계에서는 문제를 직접 수정하기보다 새 버전을 생성하고 기존 시험 기록은 기존 버전을 참조하도록 설계하는 것이 더 안전합니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "Transaction과 Aggregate 관점에서 보면, 문제와 선택지·정답·해설은 물리적으로 여러 테이블에 있을 수 있지만 도메인 관점에서는 하나의 문제를 구성하는 묶음입니다. Aggregate의 일관성 경계를 트랜잭션 경계와 일치시키는 것이 핵심입니다.",
    },
  ],
  relatedNoteSlugs: ["question-option-answer-consistency"],
};
