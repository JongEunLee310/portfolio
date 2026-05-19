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
