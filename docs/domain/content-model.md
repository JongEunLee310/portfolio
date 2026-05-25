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
- `cardSummary` — 프로젝트 상세 페이지 트러블슈팅 카드에 사용된다. **노트 작성 시 항상 포함한다.** `cardSummary`가 없으면 카드가 렌더링되지 않는다.

### cardSummary 구조

```ts
cardSummary: {
  title: string;    // 카드 제목 (20자 내외)
  problem: string;  // 문제 상황 또는 과제 (1~2문장)
  solution: string; // 해결 방향 또는 설계 판단 (1~2문장)
  result?: string;  // 효과나 인사이트 (선택, 측정 근거가 있을 때만 포함)
}
```

### 카테고리별 작성 기준

**troubleshooting (트러블슈팅)**

- `title`: 문제 상황을 명사형으로 요약 — "XXX로 인한 YYY 문제"
- `problem`: 어떤 증상이 발생했는지, 왜 문제인지
- `solution`: 어떻게 원인을 파악하고 해결했는지
- `result?`: 해결 후 수치 변화 또는 구조적 효과 (측정 근거 있을 때만)

**retrospective (회고)**

- `title`: 프로젝트가 거친 핵심 전환을 한 줄로 — "XXX에서 YYY까지"
- `problem`: 프로젝트에서 마주한 핵심 구조적 과제 또는 전환 동기
- `solution`: 채택한 설계 방향과 근거
- `result?`: 얻은 인사이트 또는 포트폴리오 관점의 의의

**architecture (아키텍처 분석)**

- `title`: 설계 결정의 핵심을 한 줄로 — "XXX 구조로 전환한 이유"
- `problem`: 해결하려 한 구조적 문제 또는 제약 조건
- `solution`: 채택한 아키텍처 방향과 선택 근거
- `result?`: 이 구조의 효과 또는 남은 한계 (측정 근거 있을 때만)

**performance (성능 분석)**

- `title`: 개선 대상과 방향을 한 줄로 — "XXX 구조로 YYY 개선"
- `problem`: 병목 지점과 성능 저하 원인
- `solution`: 적용한 최적화 방법
- `result?`: 개선 수치 (측정 근거가 있는 경우에만 포함)

**concept (개념 정리)**

- `title`: 다루는 개념을 한 줄로 — "XXX의 동작 원리와 주의점"
- `problem`: 이 개념이 필요해진 맥락 또는 흔한 오해
- `solution`: 개념의 핵심 원리 또는 올바른 사용법
- `result?`: 실제 적용 사례 또는 주의사항

## TechnicalNoteDetail

관리 디렉토리: `src/data/note-details/` (항목별 파일, `src/data/note-details/_helpers.ts` 포함)

진입점: `src/data/noteDetails.ts` (re-export wrapper)

`TechnicalNoteCard`를 확장하고 `toc`, `content`, `relatedNoteSlugs`를 추가한다. 각 파일은 `src/data/notes/<slug>.ts`에서 카드 데이터를 spread한다.
