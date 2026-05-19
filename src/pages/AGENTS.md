# src/pages/AGENTS.md

## 책임

`src/pages`는 라우트 단위 화면을 조립한다.

## 허용

- `src/data` import
- `src/components` import
- `src/constants` import
- URL query parameter 기반 필터링
- route param 기반 상세 데이터 조회

## 금지

- 공통 UI를 페이지 내부에 길게 작성하지 않는다.
- 프로젝트/기술 노트 카드를 페이지마다 중복 구현하지 않는다.
- 같은 필터 로직을 여러 페이지에 복사하지 않는다.
