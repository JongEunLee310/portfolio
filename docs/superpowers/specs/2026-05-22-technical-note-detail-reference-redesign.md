# Technical Note Detail Reference Redesign

## Goal

기술 문서 상세 페이지를 참고 이미지처럼 다크 히어로와 라이트 본문 카드 중심의 문서형 레이아웃으로 개선한다. 렌더링 UI는 공통으로 사용하고, 본문 구성은 문서 유형별 템플릿으로 관리한다.

## Scope

- Target route: `/technical-notes/:noteSlug`
- Target page: `src/pages/TechnicalNoteDetailPage.tsx`
- Target components:
  - `src/components/note/ArticleToc.tsx`
  - `src/components/note/ArticleSectionRenderer.tsx`
  - `src/components/note/CodeBlock.tsx`
- Target data:
  - `src/types/note.ts`
  - `src/data/noteDetails.ts`
  - `src/constants/noteDetail.ts`

## Template Strategy

기술 문서 상세는 `TechnicalNoteDetailPage`, `ArticleSectionRenderer`, `ArticleToc`를 공통으로 사용한다. 본문 작성 순서와 섹션 제목은 `NOTE_DETAIL_TEMPLATES`에서 문서 유형별로 관리한다.

지원 템플릿은 다음 3종이다.

- `troubleshooting`: 장애, 성능 저하, 설정 오류처럼 문제를 추적하고 해결하는 문서
- `retrospective`: 프로젝트 경험, 판단, 아쉬움, 다음 개선 방향을 정리하는 문서
- `technical-summary`: 특정 기술/구조/패턴을 설명하고 적용 방법을 정리하는 문서

개별 문서는 `template` 필드로 유형을 명시한다. 템플릿은 기본 목차와 heading의 기준이며, 실제 본문 표현은 `ArticleSection` 조합으로 채운다.

## Troubleshooting Template

트러블슈팅 문서는 아래 7개 섹션을 고정 순서로 사용한다.

1. 문제 상황
2. 원인 분석
3. 개선 방법
4. 아키텍처 및 쿼리 예시
5. 성능 비교
6. 적용 후 결과
7. 배운 점

이 순서는 `NOTE_DETAIL_TEMPLATES.troubleshooting`에서 관리한다. 개별 문서 데이터는 이 템플릿의 `tocTitle`, `headingTitle`을 사용하고, 문서마다 달라지는 본문/카드/코드/지표 데이터만 `src/data/noteDetails.ts`에 둔다.

## Retrospective Template

회고 문서는 아래 6개 섹션을 기본 순서로 사용한다.

1. 프로젝트 맥락
2. 내가 맡은 역할
3. 잘한 점
4. 아쉬운 점
5. 배운 점
6. 다음 개선 방향

이 순서는 `NOTE_DETAIL_TEMPLATES.retrospective`에서 관리한다.

## Technical Summary Template

기술 정리 문서는 아래 7개 섹션을 기본 순서로 사용한다.

1. 배경
2. 핵심 개념
3. 사용 이유
4. 적용 방식
5. 주의점
6. 예시 코드
7. 정리

이 순서는 `NOTE_DETAIL_TEMPLATES["technical-summary"]`에서 관리한다.

## Design Direction

### Hero

- 다크 네이비 배경과 블루 글로우를 사용한다.
- 왼쪽에는 breadcrumb, 카테고리, 제목, 날짜/읽는 시간/작성자, 태그, 요약을 배치한다.
- 오른쪽에는 기술 문서 성격을 드러내는 아키텍처/문서 비주얼 카드를 둔다.
- 화면 표시 텍스트는 `noteDetails`, `technicalNotes`, `NOTE_DETAIL_LABELS`에서 가져온다.

### Body Layout

- 데스크톱은 왼쪽 sticky 사이드바와 오른쪽 본문 2열 구성이다.
- 사이드바에는 목차, 이 글에서 다루는 기술, 관련 글을 배치한다.
- 본문은 흰색 카드형 섹션과 넓은 여백을 사용한다.
- 섹션 heading은 카드 안쪽이 아니라 문서 흐름의 주요 구획으로 보이게 한다.

### Article Sections

현재 `ArticleSection` 타입을 유지하되, 트러블슈팅 템플릿에 필요한 표현력을 위해 아래 섹션 타입을 추가한다.

- `cards`: 개선 방법, 적용 후 결과처럼 짧은 항목을 카드 그리드로 표현한다.
- `comparison`: 개선 전/후 구조나 쿼리 흐름을 나란히 비교한다.

기존 섹션 타입은 다음처럼 개선한다.

- `callout`: 얇은 테두리와 색상별 배경을 사용한다.
- `code`: 다크 코드블록을 유지하되 문서 본문 카드와 어울리게 radius를 낮춘다.
- `metrics`: 다크 숫자 카드로 성능 비교를 강조한다.
- `image`: 흰색 카드 안 미디어로 렌더링한다.

## Data Boundary

- 페이지 컴포넌트만 `src/data`를 import한다.
- 공통/노트 컴포넌트는 props와 `src/types`, `src/constants`만 사용한다.
- 본문 문구, CTA 라벨, 사이드바 라벨은 컴포넌트에 하드코딩하지 않는다.
- 컴포넌트 내부에 기술 노트 본문을 직접 작성하지 않는다.

## Acceptance Criteria

- `/technical-notes/db-round-trip-optimization` 상세 페이지가 참고 이미지의 레이아웃 리듬을 따른다.
- 모든 기술 노트 상세 데이터는 `template`으로 문서 유형을 명시한다.
- DB Round-trip 문서는 `template: "troubleshooting"`을 가진다.
- 트러블슈팅 템플릿 목차와 본문 heading은 `1. 문제 상황`부터 `7. 배운 점`까지 같은 순서를 사용한다.
- 회고 문서는 `template: "retrospective"`를 사용하고 회고 템플릿의 6개 섹션을 기준으로 작성한다.
- 기술 정리 문서는 `template: "technical-summary"`를 사용한다.
- 다른 기술 노트 상세도 동일 컴포넌트 구조로 깨지지 않는다.
- 관련 프로젝트/관련 기술 노트 링크는 기존 데이터 관계를 유지한다.
- `pnpm check:all`이 통과한다.
