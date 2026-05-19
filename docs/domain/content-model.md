# Content Model

## ProjectCard

관리 파일: `src/data/projects.ts`

주요 필드:

- `slug`
- `title`
- `summary`
- `thumbnail`
- `category`
- `techStack`
- `links`

## ProjectDetail

관리 파일: `src/data/projectDetails.ts`

`ProjectCard`를 확장하고 상세 섹션을 추가한다.

## TechnicalNoteCard

관리 파일: `src/data/technicalNotes.ts`

주요 필드:

- `slug`
- `title`
- `summary`
- `category`
- `thumbnail`
- `tags`

## TechnicalNoteDetail

관리 파일: `src/data/noteDetails.ts`

`TechnicalNoteCard`를 확장하고 `toc`, `content`, `relatedNoteSlugs`를 추가한다.
