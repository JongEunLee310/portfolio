# Workflows

## 콘텐츠 추가

1. 목록 데이터에 card 데이터를 추가한다.
2. 상세 페이지가 필요하면 detail 데이터를 추가한다.
3. 이미지 파일을 `public/images` 아래에 추가한다.
4. `pnpm check:content`와 `pnpm check:image-paths`를 실행한다.

## 라우트 추가

1. `src/constants/paths.ts`에 경로를 추가한다.
2. `src/app/router.tsx`에 라우트를 추가한다.
3. `docs/domain/routes.md`를 수정한다.
4. 라우트 테스트를 보강한다.
