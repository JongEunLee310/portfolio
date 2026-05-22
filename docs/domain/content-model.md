# Content Model

## ProjectCard

관리 디렉토리: `src/data/projects/` (항목별 파일)

진입점: `src/data/projects.ts` (re-export wrapper)

주요 필드:

- `slug`
- `title`
- `summary`
- `thumbnail`
- `category`
- `techStack`
- `links`

## ProjectDetail

관리 디렉토리: `src/data/project-details/` (항목별 파일)

진입점: `src/data/projectDetails.ts` (re-export wrapper)

`ProjectCard`를 확장하고 상세 섹션을 추가한다. 각 파일은 `src/data/projects/<slug>.ts`에서 카드 데이터를 spread한다.

## TechnicalNoteCard

관리 디렉토리: `src/data/notes/` (항목별 파일)

진입점: `src/data/technicalNotes.ts` (re-export wrapper)

주요 필드:

- `slug`
- `title`
- `summary`
- `category`
- `thumbnail`
- `tags`

## TechnicalNoteDetail

관리 디렉토리: `src/data/note-details/` (항목별 파일, `src/data/note-details/_helpers.ts` 포함)

진입점: `src/data/noteDetails.ts` (re-export wrapper)

`TechnicalNoteCard`를 확장하고 `toc`, `content`, `relatedNoteSlugs`를 추가한다. 각 파일은 `src/data/notes/<slug>.ts`에서 카드 데이터를 spread한다.
