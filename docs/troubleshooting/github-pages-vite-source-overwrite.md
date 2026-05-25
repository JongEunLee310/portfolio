# GitHub Pages가 Vite 빌드 산출물 대신 소스 index.html을 서빙한 문제

## 상황

포트폴리오 사이트는 Vite 빌드 결과물인 `dist`를 GitHub Pages에 배포해야 한다.
하지만 실제 배포 URL에서는 Vite가 처리하지 않은 원본 `index.html`이 그대로 내려왔다.

대표 증상은 다음과 같았다.

- `%BASE_URL%` 문자열이 치환되지 않은 상태로 노출됐다.
- `<script type="module" src="/src/main.tsx">`가 그대로 남아 있었다.
- 브라우저가 `/src/main.tsx`를 직접 요청했다.
- `dist/index.html`이 참조하는 JS 에셋은 배포 URL에서 404를 반환했다.

## 정상이어야 하는 상태

`pnpm build` 후 생성되는 `dist/index.html`은 다음 조건을 만족해야 한다.

- `%BASE_URL%`이 `/portfolio/`로 치환된다.
- HTML은 `/src/main.tsx`가 아니라 `/portfolio/assets/...js` 번들을 참조한다.
- `/portfolio/assets/...js` URL이 HTTP 200을 반환한다.

## 확인한 명령

```bash
pnpm build
```

```bash
curl -I https://jongeunlee310.github.io/portfolio/assets/index-pwyY_dEO.js
```

```bash
gh run view 26411441505 --log --repo JongEunLee310/portfolio
```

```bash
gh api repos/JongEunLee310/portfolio/pages
```

## 원인

커스텀 `Deploy to GitHub Pages` workflow는 `dist`를 정상 업로드했다.
하지만 GitHub Pages 설정에서 파생된 자동 `pages-build-deployment` workflow가 별도로 실행됐다.

해당 자동 workflow는 다음 방식으로 동작했다.

```text
actions/jekyll-build-pages@v1
source: .
destination: ./_site
```

로그의 artifact 업로드 목록에는 다음과 같은 소스 루트 파일이 포함됐다.

```text
./index.html
./src/
./vite.config.ts
./package.json
./public/images/...
```

즉 `dist`가 아니라 main 브랜치 루트가 Jekyll 빌드 결과로 Pages에 배포됐다.
그 결과 먼저 성공한 커스텀 배포 결과물이 소스 루트 배포 결과로 덮어써졌다.

## 복구 절차

Pages 설정을 workflow 배포 방식으로 다시 저장한다.

```bash
gh api --method PUT repos/JongEunLee310/portfolio/pages -F build_type=workflow
```

정상 커스텀 배포 workflow를 재실행한다.

```bash
gh run rerun 26411442074 --repo JongEunLee310/portfolio
```

재배포 완료 후 실제 Pages URL을 다시 확인한다.

```bash
curl -fsSL https://jongeunlee310.github.io/portfolio/
```

```bash
curl -I https://jongeunlee310.github.io/portfolio/assets/index-pwyY_dEO.js
```

정상 복구 후에는 다음 상태가 확인돼야 한다.

- 배포 URL의 `index.html`이 `/portfolio/assets/...js`를 참조한다.
- JS 에셋이 HTTP 200으로 응답한다.
- `%BASE_URL%` 또는 `/src/main.tsx`가 배포 HTML에 남아 있지 않다.

## 코드 변경

`public/.nojekyll`을 추가했다.

이 파일은 자동 `pages-build-deployment`를 직접 끄는 해결책은 아니다.
다만 GitHub Pages에 올라가는 정적 산출물이 Jekyll 사이트가 아니라는 의도를 명확히 하고,
빌드 결과물 `dist/.nojekyll`이 생성되도록 하는 방어 장치다.

## 재발 방지 체크리스트

- GitHub Pages 설정의 `Build and deployment > Source`가 `GitHub Actions`인지 확인한다.
- main push 이후 `pages-build-deployment`가 다시 생성되는지 확인한다.
- 커스텀 deploy workflow가 `actions/upload-pages-artifact`에 `path: dist`를 넘기는지 확인한다.
- 배포 후 실제 HTML에 `%BASE_URL%` 또는 `/src/main.tsx`가 남아 있지 않은지 확인한다.
- 배포 후 핵심 JS 에셋 URL이 HTTP 200을 반환하는지 확인한다.

## 관련 파일

- `.github/workflows/deploy.yml`
- `vite.config.ts`
- `public/.nojekyll`
- `docs/failures/005-github-pages-source-overwrite.md`
- `src/data/notes/github-pages-workflow-source-overwrite.ts`
- `src/data/note-details/github-pages-workflow-source-overwrite.ts`
