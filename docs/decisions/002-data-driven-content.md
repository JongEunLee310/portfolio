# ADR-002: 화면 콘텐츠를 TypeScript 데이터 파일로 관리

## 상태

Accepted

## 배경

GitHub Pages 정적 페이지에서는 별도 CMS나 백엔드를 사용하지 않는다.

## 결정

화면에 표시되는 모든 콘텐츠는 `src/data/*.ts`에서 관리한다.

## 이유

- 컴포넌트와 콘텐츠를 분리할 수 있다.
- 포트폴리오 내용을 수정할 때 UI 코드를 건드리지 않아도 된다.
- 테스트로 slug, 관련 콘텐츠, 이미지 경로 무결성을 검증할 수 있다.
- AI 에이전트가 콘텐츠 위치를 명확히 알 수 있다.

## 관련 문서

- `docs/conventions/data-management.md`
- `docs/domain/content-model.md`
