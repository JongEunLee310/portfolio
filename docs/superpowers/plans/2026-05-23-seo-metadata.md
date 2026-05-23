# SEO 메타데이터 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포트폴리오 사이트에 기본 SEO 설정을 추가한다 — 브라우저 탭 제목(페이지별), OG/Twitter 태그(정적), favicon 연결.

**Architecture:** `useSeo(title)` 훅을 `src/utils/`에 추가하고 각 페이지에서 호출한다. 소셜 크롤러용 OG 태그는 `index.html`에 정적으로 작성한다. 외부 라이브러리 없음.

**Tech Stack:** React 18, Vite, vitest, @testing-library/react (이미 설치됨), jsdom (이미 설치됨)

---

### Task 1: `useSeo` 훅 (TDD)

**Files:**
- Create: `src/utils/useSeo.ts`
- Create: `src/tests/useSeo.test.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`src/tests/useSeo.test.ts` 생성:

```ts
// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSeo } from "@/utils/useSeo";

describe("useSeo", () => {
  beforeEach(() => {
    document.title = "";
  });

  it("주어진 title로 document.title을 설정한다", () => {
    renderHook(() => useSeo("이종은 | 포트폴리오"));
    expect(document.title).toBe("이종은 | 포트폴리오");
  });

  it("title이 변경되면 document.title도 업데이트한다", () => {
    const { rerender } = renderHook(({ title }) => useSeo(title), {
      initialProps: { title: "첫 번째 타이틀" },
    });
    expect(document.title).toBe("첫 번째 타이틀");

    rerender({ title: "두 번째 타이틀" });
    expect(document.title).toBe("두 번째 타이틀");
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
pnpm test -- src/tests/useSeo.test.ts
```

Expected: FAIL — `Cannot find module '@/utils/useSeo'`

- [ ] **Step 3: 최소 구현 작성**

`src/utils/useSeo.ts` 생성:

```ts
import { useEffect } from "react";

export function useSeo(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
pnpm test -- src/tests/useSeo.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/utils/useSeo.ts src/tests/useSeo.test.ts
git commit -m "feat: useSeo 훅 추가 (document.title 설정)"
```

---

### Task 2: `seoConfig`에 notFound 항목 추가

**Files:**
- Modify: `src/data/seo.ts`

`seoConfig`는 현재 5개 경로만 포함한다. `PATHS.notFound` (`"/404"`) 항목을 추가한다.

- [ ] **Step 1: seo.ts 수정**

`src/data/seo.ts`에서 `seoConfig` 객체 끝에 항목 추가:

```ts
import { PATHS } from "@/constants/paths";

export const seoConfig = {
  [PATHS.home]: {
    title: "이종은 | 백엔드 개발자 포트폴리오",
    description:
      "문제를 관찰하고 구조를 개선하는 백엔드 개발자 이종은의 포트폴리오입니다.",
  },
  [PATHS.projects]: {
    title: "Projects | 이종은 포트폴리오",
    description: "백엔드, 인프라, AI 프로젝트를 통해 문제를 해결한 기록입니다.",
  },
  [PATHS.technicalNotes]: {
    title: "Technical Notes | 이종은 포트폴리오",
    description: "성능 개선, 아키텍처, DB, AWS, 모니터링 문제 해결 기록입니다.",
  },
  [PATHS.about]: {
    title: "About | 이종은 포트폴리오",
    description: "백엔드 개발자 이종은의 소개, 기술 스택, 일하는 방식입니다.",
  },
  [PATHS.contact]: {
    title: "Contact | 이종은 포트폴리오",
    description: "프로젝트 협업, 기술 문의, 채용 관련 연락 페이지입니다.",
  },
  [PATHS.notFound]: {
    title: "404 | 이종은 포트폴리오",
    description: "요청한 페이지를 찾을 수 없습니다.",
  },
} as const;
```

- [ ] **Step 2: 타입 체크**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/data/seo.ts
git commit -m "데이터: seoConfig에 notFound 항목 추가"
```

---

### Task 3: `index.html` 정적 메타데이터 추가

**Files:**
- Modify: `index.html`

favicon, OG, Twitter Card 태그를 `<head>` 안에 추가한다. `public/favicon.png`와 `public/og-image.png`는 사용자가 별도로 배치한다.

- [ ] **Step 1: index.html 수정**

`index.html`의 `<head>` 내용을 아래로 교체한다 (기존 `<title>`과 `<meta name="description">` 유지):

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="문제를 관찰하고 구조를 개선하는 백엔드 개발자 이종은의 포트폴리오입니다."
    />

    <!-- favicon -->
    <link rel="icon" type="image/png" href="/portfolio/favicon.png" />
    <link rel="apple-touch-icon" href="/portfolio/favicon.png" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="이종은 | 백엔드 개발자 포트폴리오" />
    <meta
      property="og:description"
      content="문제를 관찰하고 구조를 개선하는 백엔드 개발자 이종은의 포트폴리오입니다."
    />
    <meta property="og:url" content="https://jongEunLee310.github.io/portfolio" />
    <meta
      property="og:image"
      content="https://jongEunLee310.github.io/portfolio/og-image.png"
    />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="이종은 | 백엔드 개발자 포트폴리오" />
    <meta
      name="twitter:description"
      content="문제를 관찰하고 구조를 개선하는 백엔드 개발자 이종은의 포트폴리오입니다."
    />
    <meta
      name="twitter:image"
      content="https://jongEunLee310.github.io/portfolio/og-image.png"
    />

    <script>
      (() => {
        let resolvedTheme = "light";

        try {
          const storageKey = "portfolio-theme-mode";
          const storedMode = window.localStorage.getItem(storageKey);
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          resolvedTheme =
            storedMode === "light" || storedMode === "dark"
              ? storedMode
              : prefersDark
                ? "dark"
                : "light";
        } catch {
          resolvedTheme = "light";
        }

        document.documentElement.dataset.theme = resolvedTheme;
        document.documentElement.style.colorScheme = resolvedTheme;
      })();
    </script>
    <title>이종은 | 백엔드 개발자 포트폴리오</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm build
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add index.html
git commit -m "feat: index.html에 OG, Twitter Card, favicon 태그 추가"
```

---

### Task 4: 일반 페이지 6개에 `useSeo` 적용

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/ProjectsPage.tsx`
- Modify: `src/pages/TechnicalNotesPage.tsx`
- Modify: `src/pages/AboutPage.tsx`
- Modify: `src/pages/ContactPage.tsx`
- Modify: `src/pages/NotFoundPage.tsx`

각 페이지에 `useSeo` import를 추가하고 함수 본문 첫 줄에 호출을 추가한다.

- [ ] **Step 1: HomePage.tsx 수정**

기존 import 블록에 추가:
```ts
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`HomePage` 함수 본문 첫 줄에 추가 (`const { resolvedTheme }` 앞):
```ts
useSeo(seoConfig[PATHS.home].title);
```

- [ ] **Step 2: ProjectsPage.tsx 수정**

기존 import 블록에 추가:
```ts
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`PATHS`가 이미 import되지 않은 경우 추가:
```ts
import { PATHS } from "@/constants/paths";
```

`ProjectsPage` 함수 본문 첫 줄에 추가:
```ts
useSeo(seoConfig[PATHS.projects].title);
```

- [ ] **Step 3: TechnicalNotesPage.tsx 수정**

기존 import 블록에 추가:
```ts
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`PATHS`가 이미 import되지 않은 경우 추가:
```ts
import { PATHS } from "@/constants/paths";
```

`TechnicalNotesPage` 함수 본문 첫 줄에 추가:
```ts
useSeo(seoConfig[PATHS.technicalNotes].title);
```

- [ ] **Step 4: AboutPage.tsx 수정**

기존 import 블록에 추가 (`PATHS`가 이미 import되지 않은 경우만 추가):
```ts
import { PATHS } from "@/constants/paths";  // 없는 경우만 추가
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`AboutPage` 함수 본문 첫 줄에 추가:
```ts
useSeo(seoConfig[PATHS.about].title);
```

- [ ] **Step 5: ContactPage.tsx 수정**

기존 import 블록에 추가 (`PATHS`가 이미 import되지 않은 경우만 추가):
```ts
import { PATHS } from "@/constants/paths";  // 없는 경우만 추가
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`ContactPage` 함수 본문 첫 줄에 추가:
```ts
useSeo(seoConfig[PATHS.contact].title);
```

- [ ] **Step 6: NotFoundPage.tsx 수정**

기존 import 블록에 추가 (`PATHS`는 이미 import됨):
```ts
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`NotFoundPage` 함수 본문 첫 줄에 추가 (`return` 앞):
```ts
useSeo(seoConfig[PATHS.notFound].title);
```

- [ ] **Step 7: 타입 체크 및 린트**

```bash
pnpm typecheck && pnpm lint
```

Expected: 오류 없음

- [ ] **Step 8: 커밋**

```bash
git add src/pages/HomePage.tsx src/pages/ProjectsPage.tsx src/pages/TechnicalNotesPage.tsx src/pages/AboutPage.tsx src/pages/ContactPage.tsx src/pages/NotFoundPage.tsx
git commit -m "feat: 일반 페이지 6개에 useSeo 적용"
```

---

### Task 5: 상세 페이지 2개에 `useSeo` 동적 적용

**Files:**
- Modify: `src/pages/ProjectDetailPage.tsx`
- Modify: `src/pages/TechnicalNoteDetailPage.tsx`

프로젝트/노트 데이터에서 title을 동적으로 조합한다. 데이터가 없으면 상위 섹션 title로 폴백한다.

- [ ] **Step 1: ProjectDetailPage.tsx 수정**

기존 import 블록에 추가 (`PATHS`는 이미 import되어 있는지 확인 — 없으면 추가):
```ts
import { PATHS } from "@/constants/paths";
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`ProjectDetailPage` 함수 본문에서 `project` 변수 선언 바로 다음 줄에 추가:
```ts
const { projectSlug } = useParams();
const project = projectDetails.find((item) => item.slug === projectSlug);

useSeo(project ? `${project.title} | 이종은 포트폴리오` : seoConfig[PATHS.projects].title);
```

- [ ] **Step 2: TechnicalNoteDetailPage.tsx 수정**

기존 import 블록에 추가 (`PATHS`는 이미 import됨):
```ts
import { seoConfig } from "@/data/seo";
import { useSeo } from "@/utils/useSeo";
```

`TechnicalNoteDetailPage` 함수 본문에서 `note` 변수 선언 바로 다음 줄에 추가:
```ts
const { noteSlug } = useParams();
const note = noteDetails.find((item) => item.slug === noteSlug);

useSeo(note ? `${note.title} | 이종은 포트폴리오` : seoConfig[PATHS.technicalNotes].title);
```

- [ ] **Step 3: 타입 체크 및 린트**

```bash
pnpm typecheck && pnpm lint
```

Expected: 오류 없음

- [ ] **Step 4: 커밋**

```bash
git add src/pages/ProjectDetailPage.tsx src/pages/TechnicalNoteDetailPage.tsx
git commit -m "feat: 상세 페이지에 동적 useSeo 적용"
```

---

### Task 6: 전체 CI 검증

- [ ] **Step 1: 전체 체크 실행**

```bash
pnpm check:all
```

Expected: 모든 체크 통과 (lint, typecheck, test, check:unused, check:content, check:docs-drift, check:structure, check:image-paths)

- [ ] **Step 2: 로컬 빌드 미리보기로 확인 (선택)**

```bash
pnpm build && pnpm preview
```

브라우저에서 `http://localhost:4173/portfolio/` 접속 후:
- 탭 제목이 `이종은 | 백엔드 개발자 포트폴리오`로 표시되는지 확인
- `/portfolio/#/projects` 접속 후 탭 제목이 `Projects | 이종은 포트폴리오`로 변경되는지 확인
- 개발자 도구 Elements 탭에서 OG 태그가 `<head>`에 있는지 확인
