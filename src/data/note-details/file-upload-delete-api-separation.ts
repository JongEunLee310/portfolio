import type { TechnicalNoteDetail } from "@/types/note";
import { fileUploadDeleteApiSeparation } from "../notes/file-upload-delete-api-separation";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const fileUploadDeleteApiSeparationDetail: TechnicalNoteDetail = {
  ...fileUploadDeleteApiSeparation,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문의 첨부파일, 배너 이미지, 매니저 서류 등 여러 도메인에서 파일이 필요했습니다. 처음에는 본문 수정 API에 파일 처리를 함께 넣는 방안을 검토했지만 S3 업로드와 DB 트랜잭션의 경계가 달라 실패 처리가 복잡해지는 문제가 있었습니다.",
    },
    {
      type: "list",
      items: [
        "4개 도메인(inquiry, admin, member, reservation)에서 파일이 필요해 S3 연동 코드가 각 모듈에 중복됩니다.",
        "서버가 MultipartFile을 직접 수신하면 파일 데이터가 서버 메모리나 임시 디스크를 거칩니다.",
        "본문 수정 API에 파일 처리를 함께 넣으면 S3 업로드(외부 시스템 호출)가 DB 트랜잭션 범위에 포함될 수 없습니다.",
      ],
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "S3 업로드는 외부 시스템 호출이라 DB 트랜잭션 안에 포함시킬 수 없습니다. S3 성공 후 DB 저장 실패 시 S3에는 파일이 남지만 DB에는 기록이 없는 불일치 상태가 발생합니다.",
        "파일은 그대로인데 제목만 수정하는 경우에도 클라이언트가 파일을 다시 전송해야 하는 불편이 생깁니다.",
        "두 관심사(파일 변경, 본문 변경)가 하나의 API에 얽히면 변경하지 않은 데이터를 재전송해야 하거나 기존 파일 유지 여부를 서버가 분기해야 합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "Presigned URL 방식",
          description:
            "POST /api/files/presigned-urls에서 S3에 직접 업로드할 임시 PUT URL을 생성해 반환합니다. 서버는 파일 데이터를 받지 않고 URL 생성만 담당합니다.",
          badge: "서버 메모리 0",
        },
        {
          title: "파일 API 단일화",
          description:
            "global 모듈에 FileUploadController 하나로 파일 관련 API를 집중합니다. 도메인 API는 fileId만 참조하며 S3 의존성이 없습니다.",
          badge: "S3 로직 집중",
        },
        {
          title: "본문·파일 독립 수정",
          description:
            "파일 업데이트와 본문 수정이 별개 API로 분리되어 있습니다. 제목만 바꾸거나 파일만 교체할 때 각자 해당 API만 호출합니다.",
          badge: "관심사 분리",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "text",
      filename: "파일 처리 흐름",
      code: "1. POST /api/files/presigned-urls (파일명 목록)\n   └── S3 Presigned PUT URL 생성 (UUID + 파일명)\n\n2. 클라이언트 → S3: PUT (Presigned URL로 직접 업로드)\n\n3. POST /api/files (업로드된 S3 URL 목록)\n   └── File 엔티티 저장 (filePathsJson, postStatus=REGISTERED)\n   └── fileId 반환\n\n4. POST /api/inquiries (본문 + fileId)\n   └── 도메인 API는 fileId만 참조, S3 통신 없음",
    },
    {
      type: "code",
      language: "text",
      filename: "File 엔티티 구조",
      code: "File\n├── fileId        (PK, auto-increment)\n├── filePathsJson (LONGTEXT — S3 URL 목록을 JSON 배열로 저장)\n├── postStatus    (TEMP | REGISTERED | DELETED)\n└── uploadedAt    (등록 시각)",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "파일 API 수: 4개 (GET, POST /presigned-urls, POST, PATCH)",
        "fileId를 참조하는 도메인 모듈 수: 4개 (admin, inquiry, member, reservation)",
        "S3 관련 클래스 수: 2개 (S3Config.java, AwsProperties.java)",
        "파일 API가 도메인 API와 분리된 도메인 수: 4개",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "서버가 파일 데이터를 수신하지 않아 메모리 부담이 없습니다. inquiry, admin, member 모듈에 S3 의존성이 없습니다. S3 연동 코드가 global 모듈 FileUploadService 한 곳에 집중되어 Presigned URL 만료 시간, 버킷명, key 생성 규칙 변경이 한 파일에서 처리됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "S3 업로드라는 외부 시스템 호출을 클라이언트로 위임하면 서버 트랜잭션 범위 안에 외부 I/O가 포함되는 문제를 구조적으로 피할 수 있습니다. 남은 한계는 S3 오브젝트 실제 삭제 미구현(PostStatus.DELETED는 DB만 비활성)과 TEMP 상태 파일 정리 없음입니다. S3 Lifecycle 규칙이나 배치로 미등록 파일을 정리하는 보완이 필요합니다.",
    },
  ],
  relatedNoteSlugs: [
    "domain-module-boundary-from-monolith",
    "multi-module-shared-domain-port-pattern",
  ],
};
