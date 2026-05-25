import type { TechnicalNoteDetail } from "@/types/note";
import { questionImageUploadOrphanFile } from "../notes/question-image-upload-orphan-file";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const questionImageUploadOrphanFileDetail: TechnicalNoteDetail = {
  ...questionImageUploadOrphanFile,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서는 문제 본문에 이미지가 포함될 수 있습니다. 문제 이미지를 새 이미지로 교체하거나 삭제할 때 DB의 이미지 경로만 변경되고, 실제 스토리지에 저장된 기존 파일은 삭제되지 않으면 더 이상 참조되지 않는 고아 파일이 누적됩니다.",
    },
    {
      type: "list",
      items: [
        "이미지 교체 → DB는 새 이미지 경로를 참조, 기존 파일이 스토리지에 남음",
        "이미지 삭제 → DB 경로는 null 처리, 실제 파일은 삭제되지 않음",
        "문제 삭제 → 문제는 삭제됨, 연결된 이미지 파일은 스토리지에 남음",
        "새 이미지 업로드 후 DB 저장 실패 → 새 파일이 고아 파일로 남음",
        "기존 파일 삭제 실패 → 삭제 실패 파일이 재시도 없이 누적",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "이 문제는 기능상 즉시 눈에 띄지 않습니다. 사용자 화면에서는 새 이미지가 정상적으로 보이고 수정도 성공한 것처럼 보이지만, 스토리지 내부에는 더 이상 사용되지 않는 파일이 조용히 쌓입니다. 처음에는 몇 개의 먼지처럼 보이지만 시간이 지나면 비용과 관리 부담이 됩니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 DB 작업과 외부 스토리지 파일 작업의 트랜잭션 경계가 다르다는 점을 충분히 고려하지 않았기 때문입니다. DB 경로 변경은 트랜잭션으로 rollback할 수 있지만, 스토리지에 업로드된 파일은 DB rollback과 함께 자동으로 되돌아가지 않습니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "DB와 스토리지의 트랜잭션 경계 차이",
          description:
            "DB rollback이 스토리지 파일 작업까지 되돌리지 못합니다. 두 시스템은 서로 다른 성격의 작업입니다.",
          badge: "핵심 원인",
        },
        {
          title: "기존 파일 정리 누락",
          description:
            "이미지 교체 후 기존 파일을 삭제하는 흐름이 없어 old 파일이 스토리지에 계속 남습니다.",
          badge: "정리 흐름 없음",
        },
        {
          title: "업로드 후 DB 실패 시 보상 처리 없음",
          description:
            "새 파일 업로드 성공 후 DB 저장이 실패하면 새 파일이 고아 파일로 남는 경로가 처리되지 않습니다.",
          badge: "보상 처리 없음",
        },
        {
          title: "파일 삭제 실패 재처리 경로 없음",
          description:
            "스토리지 장애 등으로 파일 삭제가 실패해도 재시도 대상으로 기록하지 않아 누적됩니다.",
          badge: "재처리 없음",
        },
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "이미지 교체 순서별 실패 위치",
      code: "새 파일 업로드 → DB 경로 변경 → 기존 파일 삭제\n\n실패 위치별 문제:\n  새 파일 업로드 실패\n    → DB는 기존 이미지 유지, 문제 없음\n\n  새 파일 업로드 성공 후 DB 저장 실패\n    → 새 파일이 고아 파일로 남음\n\n  DB 저장 성공 후 기존 파일 삭제 실패\n    → 기존 파일이 고아 파일로 남음\n\n  기존 파일 삭제 후 DB 저장 실패 (잘못된 순서)\n    → DB는 기존 파일을 참조하지만 파일은 사라짐",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "DB 경로만 수정",
          description:
            "구현이 단순하지만 고아 파일이 누적되어 스토리지 비용과 관리 부담이 증가합니다.",
          badge: "미채택",
        },
        {
          title: "기존 파일 즉시 삭제",
          description:
            "빠르게 정리할 수 있지만 삭제 실패 처리와 DB 실패 시 복구 경로를 함께 고려해야 합니다.",
          badge: "조건부 채택",
        },
        {
          title: "삭제 예약 테이블 사용",
          description:
            "삭제 실패 파일을 재시도 대상으로 저장해 안정적으로 처리할 수 있습니다. 구현 복잡도는 증가합니다.",
          badge: "권장",
        },
        {
          title: "주기적 정리 배치",
          description:
            "DB에서 참조하지 않는 파일을 주기적으로 정리합니다. 즉시 정리는 아니지만 보조 안전망으로 유용합니다.",
          badge: "보조 수단",
        },
      ],
    },
    {
      type: "list",
      items: [
        "이미지 교체 시 기존 파일 경로를 먼저 조회합니다.",
        "새 파일을 스토리지에 업로드합니다.",
        "DB 경로 변경을 트랜잭션으로 처리합니다.",
        "DB 저장이 실패하면 새로 업로드한 파일을 즉시 삭제합니다.",
        "DB 저장이 성공하면 기존 파일 삭제를 시도합니다.",
        "기존 파일 삭제 실패 시 로그 또는 삭제 예약 테이블에 남깁니다.",
        "주기적 정리 배치로 재처리 대상 파일을 정리하는 것을 검토합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "처리 흐름은 기존 경로 조회 → 새 파일 업로드 → DB 트랜잭션 → DB 성공 시 기존 파일 삭제 시도 / DB 실패 시 새 파일 삭제 순서로 정리됩니다. 파일 삭제 실패는 사용자 요청 실패로 보지 않고 재처리 대상으로 분리합니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "이미지 교체 처리 흐름",
      code: "이미지 교체 요청\n  ↓\n기존 이미지 경로 조회 (old-image.png)\n  ↓\n새 이미지 업로드 (new-image.png)\n  실패 → DB 변경 없음, 안전 종료\n  ↓\nDB Transaction 시작\n  이미지 경로 변경 (new-image.png)\nDB Commit\n  실패 → new-image.png 즉시 삭제 (보상 처리)\n  성공 → 기존 파일 삭제 시도\n\n기존 파일 삭제\n  성공 → 이미지 교체 완료\n  실패 → old-image.png 삭제 예약 또는 로그 기록\n         이미지 교체 자체는 성공으로 응답",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "기존 파일 삭제 실패를 사용자 요청 실패로 볼지 후처리 대상으로 볼지 정책을 명확히 해야 합니다. 사용자에게 중요한 것은 새 이미지가 정상 반영되었는지이고, 기존 파일 정리는 운영 안정성과 비용 관리의 문제에 가깝습니다. 일반적으로 파일 삭제 실패는 재처리 가능한 후처리로 분리하는 편이 더 안정적입니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "이미지 정상 교체",
          before: "DB 경로만 변경",
          after: "기존 파일 정리 흐름 포함",
          change: "개선",
        },
        {
          label: "새 파일 업로드 후 DB 저장 실패",
          before: "새 파일이 고아 파일로 남음",
          after: "새 파일 즉시 삭제 (보상 처리)",
          change: "차단",
        },
        {
          label: "DB 저장 성공 후 기존 파일 삭제 실패",
          before: "조용히 누락",
          after: "삭제 예약 또는 로그 기록",
          change: "개선",
        },
        {
          label: "문제 삭제",
          before: "연결 이미지 파일이 남을 수 있음",
          after: "파일 정리 정책 적용",
          change: "개선",
        },
        {
          label: "이미지 없는 문제에서 삭제 요청",
          before: "처리 불명확",
          after: "안전하게 성공 또는 no-op",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "이미지 교체",
          before: "DB 경로만 변경 가능",
          after: "기존 파일 정리 흐름 포함",
          change: "개선",
        },
        {
          label: "DB 저장 실패",
          before: "새 파일이 고아 파일로 남을 수 있음",
          after: "새 파일 삭제 보상 처리",
          change: "개선",
        },
        {
          label: "기존 파일 삭제 실패",
          before: "조용히 누락 가능",
          after: "삭제 예약 또는 로그 기록",
          change: "개선",
        },
        {
          label: "문제 삭제",
          before: "연결 파일이 남을 수 있음",
          after: "파일 정리 정책 적용",
          change: "개선",
        },
        {
          label: "운영 관리",
          before: "고아 파일 추적 어려움",
          after: "재처리·배치 정리 가능",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "DB가 '이 파일을 사용한다'고 말하는 것과 스토리지가 '그 파일이 실제로 있다'고 말하는 상태를 맞추는 것이 핵심입니다. 문제 이미지 기능은 단순 업로드에서 파일 생명주기를 관리하는 구조로 개선됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "파일 업로드 기능은 DB 저장보다 더 넓은 생명주기 관리가 필요합니다. 업로드, 참조, 교체, 삭제, 실패 보상까지 하나의 흐름으로 설계해야 합니다.",
        "'새 파일을 올리고 DB만 바꾸면 끝'이라고 보면 고아 파일이 쌓입니다. 파일은 DB 바깥에 사는 데이터이므로 DB의 규칙만으로는 스토리지의 질서를 완전히 지킬 수 없습니다.",
        "파일 삭제 실패를 사용자 요청 실패로 볼지 후처리 대상으로 볼지 정책을 명확히 정해야 합니다.",
        "DB 트랜잭션과 외부 스토리지 작업은 서로 다른 성격의 작업입니다. 한쪽의 성공이 다른 쪽의 성공을 자동으로 보장하지 않으므로 보상 처리를 별도로 설계해야 합니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 Compensation Transaction과 File Lifecycle이 핵심 개념입니다. DB와 스토리지처럼 서로 다른 시스템을 함께 다룰 때는 한쪽 실패를 보정하는 반대 작업(보상 트랜잭션)을 명시적으로 설계해야 합니다. 향후에는 임시 업로드 영역(temp/)을 활용해 DB 저장 성공 후 최종 경로로 이동하는 방식과 주기적 정리 배치를 추가로 검토할 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "excel-question-import-validation",
    "question-update-child-data-transaction",
  ],
};
