import type { TechnicalNoteDetail } from "@/types/note";
import { technicalNotes } from "./technicalNotes";

function findNote(slug: string) {
  const note = technicalNotes.find((item) => item.slug === slug);

  if (!note) {
    throw new Error(`technicalNotes.ts에 존재하지 않는 기술 노트 slug입니다: ${slug}`);
  }

  return note;
}

export const noteDetails: TechnicalNoteDetail[] = [
  {
    ...findNote("db-round-trip-optimization"),
    toc: [
      { id: "problem", title: "문제 상황", depth: 1 },
      { id: "root-cause", title: "원인 분석", depth: 1 },
      { id: "solution", title: "개선 방법", depth: 1 },
      { id: "performance", title: "성능 비교", depth: 1 },
      { id: "lesson", title: "배운 점", depth: 1 },
    ],
    content: [
      {
        type: "heading",
        id: "problem",
        title: "1. 문제 상황",
      },
      {
        type: "paragraph",
        content:
          "특정 목록 조회 API에서 응답 시간이 증가하는 문제가 발생했습니다. 로그를 확인해보니 하나의 요청을 처리하는 동안 여러 번의 DB 조회가 순차적으로 발생하고 있었습니다.",
      },
      {
        type: "heading",
        id: "root-cause",
        title: "2. 원인 분석",
      },
      {
        type: "list",
        items: [
          "소유권 확인 과정에서 Project와 Pipeline을 각각 조회했습니다.",
          "목록 조회에 limit이 없어 실행 이력 전체를 가져오는 문제가 있었습니다.",
          "인증 사용자 조회가 요청마다 반복되었습니다.",
        ],
      },
      {
        type: "code",
        language: "sql",
        filename: "before.sql",
        code: "SELECT * FROM pipelines WHERE id = :pipelineId;",
      },
      {
        type: "heading",
        id: "solution",
        title: "3. 개선 방법",
      },
      {
        type: "callout",
        variant: "warning",
        content:
          "성능 개선은 코드를 빠르게 만드는 일이 아니라, 불필요한 일을 하지 않도록 흐름을 다시 설계하는 일에 가깝습니다.",
      },
    ],
    relatedNoteSlugs: ["async-pipeline-transition"],
  },
];
