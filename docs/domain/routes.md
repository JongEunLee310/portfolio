# Routes

## MVP 라우트

| 라우트 | 페이지 |
|---|---|
| `/` | Home |
| `/projects` | Projects |
| `/projects/:projectSlug` | Project Detail |
| `/technical-notes` | Technical Notes |
| `/technical-notes/:noteSlug` | Technical Note Detail |
| `/about` | About |
| `/contact` | Contact |
| `/404` | Not Found |

## 라우팅 정책

- GitHub Pages 호환성을 위해 HashRouter를 사용한다.
- 경로 상수는 `src/constants/paths.ts`에서 관리한다.
- 라우터 구성은 `src/app/router.tsx`에서 관리한다.
- 경로의 `pathname`이 바뀌는 페이지 이동은 항상 스크롤을 최상단으로 이동한다.
- 같은 목록 페이지 안에서 `?page=` 등 검색 파라미터만 바뀌는 경우에는 현재 스크롤 위치를 유지한다.
