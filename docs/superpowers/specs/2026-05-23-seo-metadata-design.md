# SEO 메타데이터 설계

## 목적

포트폴리오 사이트가 검색 결과와 소셜 링크 공유에서 적절하게 표시되도록 기본 SEO 설정을 추가한다.

## 제약 조건

- Vite + React SPA, HashRouter 사용
- GitHub Pages 정적 배포 (`https://jongEunLee310.github.io/portfolio`)
- 소셜 크롤러(카카오, 슬랙, 링크드인 등)는 JS를 실행하지 않으므로 OG 태그는 `index.html`에 정적으로 작성해야 한다
- per-page OG는 HashRouter SPA에서 기술적으로 불가능 (모든 페이지가 동일한 HTML을 공유)
- `react-helmet` 등 외부 라이브러리 추가 없음

## 설계

### 1. `index.html` — 정적 메타데이터

소셜 크롤러용 태그를 모두 정적으로 추가한다.

**추가 태그:**

```html
<!-- favicon -->
<link rel="icon" type="image/png" href="/portfolio/favicon.png" />
<link rel="apple-touch-icon" href="/portfolio/favicon.png" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="이종은 | 백엔드 개발자 포트폴리오" />
<meta property="og:description" content="문제를 관찰하고 구조를 개선하는 백엔드 개발자 이종은의 포트폴리오입니다." />
<meta property="og:url" content="https://jongEunLee310.github.io/portfolio" />
<meta property="og:image" content="https://jongEunLee310.github.io/portfolio/og-image.png" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="이종은 | 백엔드 개발자 포트폴리오" />
<meta name="twitter:description" content="문제를 관찰하고 구조를 개선하는 백엔드 개발자 이종은의 포트폴리오입니다." />
<meta name="twitter:image" content="https://jongEunLee310.github.io/portfolio/og-image.png" />
```

title, description 값은 `siteConfig` 및 기존 `index.html`의 값과 동일하게 유지한다.

### 2. `src/utils/useSeo.ts` — 훅

```ts
// 시그니처만 기술 (구현 코드 아님)
export function useSeo(title: string): void
```

- `useEffect`로 `document.title = title` 설정
- Google은 JS 렌더링 후 title을 크롤링하므로 per-page title은 SEO에 유효
- 컴포넌트 언마운트 시 title 복원 없음 (SPA에서 불필요)
- import 경계: `pages → utils` 허용 (기존 `pageChrome.ts` 패턴과 동일)

### 3. 페이지별 적용

**일반 페이지** (Home, Projects, TechnicalNotes, About, Contact, NotFound):

```ts
useSeo(seoConfig[PATHS.home].title)
```

`seoConfig`는 이미 `src/data/seo.ts`에 5개 경로에 대한 title이 정의되어 있다. `PATHS.notFound` 항목을 `seoConfig`에 추가한다.

**상세 페이지** (ProjectDetailPage, TechnicalNoteDetailPage):

데이터가 존재하면 동적 title, 없으면 상위 섹션 title로 폴백:

```ts
useSeo(project ? `${project.title} | 이종은 포트폴리오` : seoConfig[PATHS.projects].title)
useSeo(note    ? `${note.title}    | 이종은 포트폴리오` : seoConfig[PATHS.technicalNotes].title)
```

### 4. 파일 배치 (사용자 직접 생성)

| 파일 | 경로 | 권장 크기 |
|------|------|-----------|
| favicon | `public/favicon.png` | 32×32, 192×192 |
| OG 이미지 | `public/og-image.png` | 1200×630 |

**OG 이미지 권장 구성:** 이름(이종은), 역할(백엔드 개발자), 한 줄 소개(`siteConfig.headline`), URL — 브랜드 배경색 기반.

## 변경 파일 목록

| 파일 | 변경 종류 |
|------|-----------|
| `index.html` | favicon, OG, Twitter Card 태그 추가 |
| `src/utils/useSeo.ts` | 신규 생성 |
| `src/pages/HomePage.tsx` | `useSeo` 적용 |
| `src/pages/ProjectsPage.tsx` | `useSeo` 적용 |
| `src/pages/TechnicalNotesPage.tsx` | `useSeo` 적용 |
| `src/pages/AboutPage.tsx` | `useSeo` 적용 |
| `src/pages/ContactPage.tsx` | `useSeo` 적용 |
| `src/pages/NotFoundPage.tsx` | `useSeo` 적용 |
| `src/pages/ProjectDetailPage.tsx` | `useSeo` 동적 적용 |
| `src/pages/TechnicalNoteDetailPage.tsx` | `useSeo` 동적 적용 |
| `src/data/seo.ts` | NotFound title 상수 추가 |
| `public/favicon.png` | 사용자 직접 배치 |
| `public/og-image.png` | 사용자 직접 배치 |

## 완료 기준

- 브라우저 탭에 페이지별 제목이 표시된다
- 링크 공유 시 이름, 설명, OG 이미지가 표시된다
- favicon이 브라우저 탭에 표시된다
- `pnpm check:all` 통과
