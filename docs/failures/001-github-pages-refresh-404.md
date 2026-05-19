# Failure-001: GitHub Pages에서 상세 페이지 새로고침 시 404 발생

## 상황

React Router의 BrowserRouter를 사용했을 때 `/projects/ai-devops`에서 새로고침하면 GitHub Pages가 해당 경로의 실제 파일을 찾지 못해 404를 반환한다.

## 원인

GitHub Pages는 정적 파일 서버이므로 클라이언트 라우팅 경로를 서버가 알지 못한다.

## 해결

초기 구현에서는 HashRouter를 사용한다.

## 관련 결정

- `docs/decisions/001-static-github-pages.md`
- `docs/decisions/003-routing-strategy.md`
