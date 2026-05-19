# ADR-003: HashRouter 기반 라우팅

## 상태

Accepted

## 결정

초기 구현은 React Router의 HashRouter를 사용한다.

## 이유

GitHub Pages는 클라이언트 라우팅 경로를 서버에서 알지 못하므로 BrowserRouter를 쓰면 상세 페이지 새로고침 시 404가 발생할 수 있다.

## 영향

- URL은 `/#/projects` 형태가 된다.
- `src/app/router.tsx`에서 라우트를 관리한다.
- 내부 경로는 `src/constants/paths.ts`를 사용한다.
