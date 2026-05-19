# Failure-002: 컴포넌트 콘텐츠 하드코딩으로 인한 드리프트

## 상황

컴포넌트 안에 프로젝트 설명을 직접 작성하면 `src/data/projects.ts`와 화면 문구가 달라질 수 있다.

## 해결

페이지가 데이터를 읽고 컴포넌트에 props로 전달한다.

## 관련 문서

- `docs/conventions/data-management.md`
- `docs/conventions/component-boundary.md`
