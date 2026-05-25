# Failure-005: GitHub Pages 자동 Jekyll 배포가 Vite 산출물을 덮어쓴 문제

## 상황

포트폴리오 사이트가 GitHub Pages에서 원본 `index.html`을 그대로 서빙했다.
`%BASE_URL%`이 치환되지 않았고 브라우저가 `/src/main.tsx`를 직접 요청했다.

## 확인

- `pnpm build`는 성공했다.
- `dist/index.html`은 `/portfolio/assets/index-pwyY_dEO.js`를 정상 참조했다.
- 배포 URL의 JS 에셋은 처음 확인 시 HTTP 404를 반환했다.
- `pages-build-deployment` 로그에서 `actions/jekyll-build-pages@v1`이 `source: .`로 실행됐다.
- artifact 업로드 목록에 `index.html`, `src/`, `vite.config.ts`, `package.json` 등 소스 루트 파일이 포함됐다.

## 원인

커스텀 `Deploy to GitHub Pages` workflow가 `dist`를 올린 뒤,
GitHub Pages 설정에서 파생된 자동 `pages-build-deployment`가 main 브랜치 루트를 Jekyll로 다시 배포했다.
그 결과 Vite 산출물이 소스 파일 배포 결과로 덮어써졌다.

## 해결

- Pages 설정을 workflow 배포 방식으로 다시 저장했다.
- 커스텀 `Deploy to GitHub Pages` workflow를 재실행해 `dist` artifact를 다시 배포했다.
- `public/.nojekyll`을 추가해 빌드 산출물에도 `.nojekyll`이 포함되도록 했다.

## 재발 방지

- GitHub Pages URL의 `index.html`에 `%BASE_URL%` 또는 `/src/main.tsx`가 남아 있는지 확인한다.
- 배포 후 핵심 JS 에셋 URL이 HTTP 200을 반환하는지 확인한다.
- main push 이후 `pages-build-deployment`가 다시 생성되는지 확인한다.
- 다시 생성되면 GitHub UI의 `Settings > Pages > Build and deployment > Source`를 `GitHub Actions`로 전환한다.

## 관련 파일

- `.github/workflows/deploy.yml`
- `vite.config.ts`
- `public/.nojekyll`
- `src/data/note-details/github-pages-workflow-source-overwrite.ts`
