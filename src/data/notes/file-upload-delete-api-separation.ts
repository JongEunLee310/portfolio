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
};
