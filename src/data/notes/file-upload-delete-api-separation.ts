import { publicPath } from "@/utils/publicPath";
import type { TechnicalNoteCard } from "@/types/note";

export const fileUploadDeleteApiSeparation: TechnicalNoteCard = {
  slug: "file-upload-delete-api-separation",
  title: "파일 업로드 API 분리 — Presigned URL로 S3 트랜잭션 경계 해소",
  summary:
    "본문 수정 API에 파일 처리를 함께 넣으면 S3 업로드가 DB 트랜잭션 범위 밖에 위치해 실패 처리가 복잡해지는 문제를 해소하기 위해, global 모듈에 파일 API를 단일화하고 Presigned URL로 S3 업로드를 클라이언트로 위임한 기록입니다.",
  category: "architecture",
  thumbnail: publicPath("/images/notes/async-pipeline.svg"),
  date: "2025.07.05",
  readingTime: "7분 읽기",
  tags: [
    { name: "Spring Boot", category: "backend" },
    { name: "AWS S3", category: "infra" },
    { name: "AWS", category: "infra" },
    { name: "JPA", category: "backend" },
  ],
  relatedProjectSlugs: ["halo"],
  cardSummary: {
    title: "파일 업로드 API 분리 — Presigned URL로 S3 트랜잭션 경계 해소",
    problem: "본문 수정 API에 파일 처리를 함께 넣으면 S3 업로드(외부 호출)가 DB 트랜잭션 범위에 포함 불가. S3 성공 후 DB 실패 시 오브젝트가 남고, 서버가 MultipartFile을 직접 수신하면 메모리 부담 발생. 4개 도메인(inquiry, admin, member, reservation)에 S3 로직 중복",
    solution: "global 모듈에 FileUploadController 단일화. POST /api/files/presigned-urls → 클라이언트가 S3 직접 PUT → POST /api/files(fileId 반환) → 도메인 API는 fileId만 참조",
    result: "서버가 파일 데이터를 수신하지 않아 메모리 부담 제거. 도메인 API에 S3 의존성 0. 파일 변경과 본문 변경 독립적으로 분리. S3 연동 코드 한 곳 집중",
  },
};
