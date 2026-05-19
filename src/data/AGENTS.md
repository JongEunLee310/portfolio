# src/data/AGENTS.md

## 책임

`src/data`는 화면에 표시되는 모든 정적 콘텐츠를 관리한다.

## 허용

- `src/types` import
- `src/constants` import
- 순수 데이터 배열과 객체 export
- 데이터 조회용 순수 함수 export

## 금지

- React 컴포넌트 import 금지
- JSX 작성 금지
- 브라우저 API 사용 금지
- 비동기 API 호출 금지
- 컴포넌트 렌더링 로직 작성 금지

## 파일별 책임

| 파일 | 책임 |
|---|---|
| `site.ts` | 사이트 기본 정보 |
| `navigation.ts` | Header/Footer 메뉴 |
| `hero.ts` | 페이지별 Hero 문구 |
| `projects.ts` | 프로젝트 목록 카드 데이터 |
| `projectDetails.ts` | 프로젝트 상세 데이터 |
| `technicalNotes.ts` | 기술 노트 목록 데이터 |
| `noteDetails.ts` | 기술 노트 상세 본문 |
| `about.ts` | 소개 페이지 데이터 |
| `contact.ts` | 연락 페이지 데이터 |
| `techStack.ts` | 기술 스택 데이터 |
| `filters.ts` | 필터 옵션 |
| `tags.ts` | 태그 그룹과 태그 검색 함수 |
