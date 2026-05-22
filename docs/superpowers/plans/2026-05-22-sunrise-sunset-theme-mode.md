# Sunrise Sunset Theme Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 일출/일몰 시간에 맞춰 사이트의 light/dark 모드를 자동 전환하고, 사용자가 직접 테마 모드를 선택할 수 있게 한다.

**Architecture:** 테마 타입/설정 추가 → `suncalc` 기반 일출/일몰 계산 유틸 작성 → 전역 ThemeProvider 도입 → CSS 변수 기반 테마 토큰 적용 → Header 아이콘 메뉴 추가 → Hero 라이트 변형과 주요 표면 컴포넌트 정리 → 검증 순서로 진행한다. 스펙: `docs/superpowers/specs/2026-05-22-sunrise-sunset-theme-mode.md`

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite, GitHub Pages

---

## File Structure

**Create:**
- `src/types/theme.ts` — 테마 모드와 계산 결과 타입
- `src/utils/themeMode.ts` — 저장값, 시스템 테마, 최종 테마 해석 유틸
- `src/utils/sunSchedule.ts` — 일출/일몰 계산과 다음 전환 시각 계산 유틸
- `src/app/theme/ThemeProvider.tsx` — 전역 테마 상태 provider
- `src/app/theme/useTheme.ts` — 테마 context hook
- `src/components/layout/ThemeModeControl.tsx` — Header에서 사용할 아이콘 메뉴형 테마 전환 UI
- `src/data/theme.ts` — 테마 컨트롤 표시 문구
- `src/tests/theme-mode.test.ts` — 모드 해석, 저장값, 일출/일몰 판정 테스트

**Modify:**
- `src/constants/theme.ts` — 기준 위치, storage key, 기본 모드 설정 추가
- `src/app/App.tsx` — `ThemeProvider` 연결
- `src/components/layout/PageLayout.tsx` — 테마 라벨을 Header에 전달하거나 app chrome 데이터 흐름 정리
- `src/components/layout/Header.tsx` — 테마 전환 컨트롤 배치
- `src/components/hero/PageHero.tsx` — 라이트/다크 Hero variant 지원
- `src/styles/globals.css` — 테마 CSS 변수와 `color-scheme` 정리
- `src/styles/classNames.ts` — CSS 변수 기반 표면 클래스 추가
- 주요 페이지/카드 컴포넌트 — `bg-slate-50`, `bg-white`, 고정 텍스트 색상 일부를 테마 토큰으로 교체

---

## Task 1: 현재 스타일 의존성 조사

**Files:**
- Read: `src/styles/globals.css`
- Read: `src/styles/classNames.ts`
- Read: `src/components/layout/PageLayout.tsx`
- Read: `src/components/layout/Header.tsx`
- Search: `bg-slate-50`, `bg-white`, `text-slate-900`, `text-white`, `bg-brand-dark`

- [ ] 테마 전환 시 우선 수정할 공통 표면 목록을 정리한다.
- [ ] 고정 다크 영역으로 유지할 컴포넌트와 테마 토큰으로 전환할 컴포넌트를 구분한다.
- [ ] Header에 테마 컨트롤을 넣을 공간과 모바일 동작을 확인한다.
- [ ] 기존 import boundary 위반이 생기지 않는 데이터 전달 경로를 정한다.

---

## Task 2: 테마 타입과 설정 추가

**Files:**
- Create: `src/types/theme.ts`
- Modify: `src/constants/theme.ts`

- [ ] `ThemeMode = "light" | "dark" | "system" | "auto"` 타입을 추가한다.
- [ ] `ResolvedTheme = "light" | "dark"` 타입을 추가한다.
- [ ] `ThemeState` 타입을 추가한다.
- [ ] `DEFAULT_THEME_MODE`를 `"auto"`로 정의한다.
- [ ] `THEME_STORAGE_KEY`를 정의한다.
- [ ] `THEME_LOCATION`에 서울 기준 `label: "Seoul"`, `latitude: 37.5665`, `longitude: 126.978`, `timeZone: "Asia/Seoul"`을 정의한다.
- [ ] 설정값은 표시 문구가 아니므로 `src/constants`에 둔다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 3: 일출/일몰 계산 전략 구현

**Files:**
- Create: `src/utils/sunSchedule.ts`
- Optional modify: `package.json`

구현 원칙:
- GitHub Pages에서 동작해야 하므로 API 호출을 사용하지 않는다.
- 일출/일몰 계산은 `suncalc` 라이브러리를 사용한다.
- 내부 계산 유틸은 `suncalc` adapter로 두고 테스트 가능한 순수 함수로 작성한다.

- [ ] `suncalc`를 dependencies에 추가한다.
- [ ] TypeScript 타입 제공 여부를 확인하고 필요 시 타입 패키지 또는 최소 module declaration을 추가한다.
- [ ] `getSunSchedule(date, location)` 함수를 구현한다.
- [ ] `resolveAutoTheme(now, schedule)` 함수를 구현한다.
- [ ] `getNextThemeTransition(now, schedule)` 함수를 구현한다.
- [ ] 계산 실패 시 호출자가 `system` fallback을 사용할 수 있게 에러 또는 `null` 결과를 명확히 처리한다.
- [ ] 날짜 경계 자정 이후 다음 날 일출/일몰 timer가 올바르게 잡히는지 테스트 케이스를 만든다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 4: 테마 모드 해석 유틸 작성

**Files:**
- Create: `src/utils/themeMode.ts`

- [ ] `isThemeMode(value)` type guard를 구현한다.
- [ ] `readStoredThemeMode(storage)`를 구현한다.
- [ ] `writeStoredThemeMode(storage, mode)`를 구현한다.
- [ ] `resolveSystemTheme(queryList)` 또는 동등한 함수를 구현한다.
- [ ] `resolveThemeMode(mode, context)` 함수를 구현한다.
- [ ] 브라우저 API가 없는 테스트 환경에서도 순수 함수 테스트가 가능하게 분리한다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 5: ThemeProvider 연결

**Files:**
- Create: `src/app/theme/ThemeProvider.tsx`
- Create: `src/app/theme/useTheme.ts`
- Modify: `src/app/App.tsx`

Provider 책임:
- 저장된 모드 읽기
- 기본값 `auto` 적용
- `document.documentElement.dataset.theme` 갱신
- `color-scheme` 갱신
- `system` 모드에서 OS 테마 변경 감지
- `auto` 모드에서 다음 일출/일몰 전환 timer 예약

- [ ] Theme context 타입을 정의한다.
- [ ] `mode`, `resolvedTheme`, `setMode`를 제공한다.
- [ ] 초기 렌더링 이후 `data-theme`를 설정한다.
- [ ] `system` 변경 listener를 등록하고 cleanup한다.
- [ ] `auto` timer를 등록하고 cleanup한다.
- [ ] `App`을 `ThemeProvider`로 감싼다.
- [ ] 브라우저 API guard를 추가해 테스트 환경에서 깨지지 않게 한다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 6: 초기 테마 깜빡임 최소화

**Files:**
- Modify: `index.html`

초기 구현은 작은 inline script로 저장된 모드 또는 기본 `auto`를 읽어 `data-theme`를 가능한 빨리 설정한다. 단, 일출/일몰 계산 로직을 HTML에 중복 구현하지 않는다.

- [ ] 저장된 모드가 `light` 또는 `dark`이면 즉시 `data-theme`를 설정한다.
- [ ] 저장된 모드가 `system`이면 `prefers-color-scheme`으로 즉시 설정한다.
- [ ] 저장된 모드가 없거나 `auto`이면 기본 배경이 튀지 않도록 최소 fallback을 정한다.
- [ ] inline script가 유효하지 않은 storage 값에 안전하게 동작하는지 확인한다.
- [ ] TypeScript 대상 파일이 아니므로 영향 범위를 수동 확인한다.

---

## Task 7: CSS 변수 기반 테마 토큰 추가

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/styles/classNames.ts`

- [ ] `:root` 라이트 테마 CSS 변수를 추가한다.
- [ ] `:root[data-theme="dark"]` 다크 테마 CSS 변수를 추가한다.
- [ ] `body` 배경과 텍스트 색상을 CSS 변수로 변경한다.
- [ ] `color-scheme`을 테마별로 설정한다.
- [ ] `themeSurface.page`, `themeSurface.card`, `themeText.body` 같은 반복 클래스를 추가한다.
- [ ] 기존 `surface.dark`, `surface.card`는 당장 삭제하지 않고 호환 유지한다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 8: 아이콘 메뉴형 테마 전환 컨트롤 추가

**Files:**
- Create: `src/components/layout/ThemeModeControl.tsx`
- Create: `src/data/theme.ts`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/PageLayout.tsx`
- Modify: page chrome 데이터 전달부

구현 원칙:
- 표시 문구는 `src/data/theme.ts`에서 관리한다.
- `Header`는 `src/data`를 import하지 않는다.
- Header는 props와 `useTheme` hook만 사용한다.
- 컨트롤은 native select가 아니라 아이콘 menu button 패턴으로 구현한다.
- 아이콘은 `lucide-react`의 `Sun`, `Moon`, `Monitor`, `SunMoon` 또는 유사 아이콘을 사용한다.

- [ ] `themeControlContent`를 추가한다.
- [ ] `ThemeModeControlProps`를 정의한다.
- [ ] 아이콘 트리거 버튼과 메뉴 항목을 구현한다.
- [ ] 각 메뉴 항목에 모드별 아이콘과 라벨을 표시한다.
- [ ] 현재 모드와 실제 적용 테마를 시각적으로 구분한다.
- [ ] 메뉴 버튼에 accessible label과 확장 상태를 제공한다.
- [ ] 선택된 메뉴 항목에 `aria-current` 또는 동등한 상태 표현을 제공한다.
- [ ] Header desktop 영역에 컨트롤을 배치한다.
- [ ] 모바일 nav에서도 컨트롤이 접근 가능하게 한다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 9: Hero 라이트 변형 추가

**Files:**
- Modify: `src/components/hero/PageHero.tsx`
- Modify: hero를 사용하는 page components as needed
- Modify: `src/styles/classNames.ts`

구현 원칙:
- 기존 다크 Hero 리듬은 유지한다.
- `resolvedTheme === "light"`일 때 라이트 Hero 변형을 사용할 수 있게 한다.
- Hero 표시 문구는 기존 데이터 흐름을 유지하고 컴포넌트에 새 문구를 하드코딩하지 않는다.
- 페이지 컴포넌트가 `useTheme`로 `resolvedTheme`를 읽고 `PageHero`에 `variant` prop을 전달한다.

- [ ] `PageHero`에 `variant` 또는 theme-aware 스타일 분기 방식을 추가한다.
- [ ] 라이트 Hero 배경, 텍스트, border, visual card 스타일을 정의한다.
- [ ] 다크 Hero 기존 스타일이 깨지지 않게 유지한다.
- [ ] 페이지에서 `resolvedTheme`에 따라 Hero variant를 전달한다.
- [ ] Home, Projects, Technical Notes, About, Contact의 Hero 표시를 확인한다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 10: 공통 레이아웃과 주요 표면 적용

**Files:**
- Modify: `src/components/layout/PageLayout.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: common card/list components as needed

- [ ] `PageLayout` 최상위 배경을 CSS 변수 기반 클래스로 변경한다.
- [ ] Header border/background가 두 테마에서 읽히는지 조정한다.
- [ ] Footer는 기본 다크 정체성을 유지하되 링크 대비를 확인한다.
- [ ] 공통 `Card`, `EmptyState`, 목록 카드에 테마 surface 클래스를 적용한다.
- [ ] CTA 파란 포인트 컬러는 유지한다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 11: 페이지별 고정 색상 정리

**Files:**
- Modify: `src/pages/*.tsx`
- Modify: `src/components/project/*.tsx`
- Modify: `src/components/note/*.tsx`
- Modify: `src/components/about/*.tsx`
- Modify: `src/components/contact/*.tsx`

우선순위:
1. 페이지 배경
2. 카드 배경과 border
3. 본문 텍스트
4. muted 텍스트
5. hover/focus 상태

- [ ] `bg-slate-50`, `bg-white`를 전역 surface 토큰으로 바꿀 위치를 선별한다.
- [ ] 다크 섹션 안의 흰색 카드처럼 의도된 대비는 유지한다.
- [ ] `text-slate-*` 고정값 중 테마 토큰 전환이 필요한 곳을 정리한다.
- [ ] 카드 내부 텍스트가 dark 모드에서 충분한 대비를 갖는지 확인한다.
- [ ] 모바일에서 테마 컨트롤과 nav가 겹치지 않는지 확인한다.
- [ ] TypeScript 검증: `pnpm typecheck`

---

## Task 12: 테스트 추가

**Files:**
- Create: `src/tests/theme-mode.test.ts`
- Modify: test setup only if needed

- [ ] 유효하지 않은 localStorage 값은 기본값으로 fallback되는지 테스트한다.
- [ ] `light` 모드는 항상 light로 해석되는지 테스트한다.
- [ ] `dark` 모드는 항상 dark로 해석되는지 테스트한다.
- [ ] `system` 모드는 prefers-color-scheme 결과를 따르는지 테스트한다.
- [ ] `auto` 모드는 서울 sunrise/sunset 사이에서 light를 반환하는지 테스트한다.
- [ ] `auto` 모드는 서울 sunset 이후 dark를 반환하는지 테스트한다.
- [ ] 다음 전환 시간이 일출 또는 일몰로 계산되는지 테스트한다.
- [ ] 라이트 모드에서 Hero variant가 light로 선택되는지 테스트 가능하면 추가한다.
- [ ] 테스트 실행: `pnpm test`

---

## Task 13: 브라우저 QA

**Files:**
- No planned code changes

- [ ] 로컬 dev server 실행
- [ ] 데스크톱에서 `auto`, `light`, `dark`, `system` 선택 동작 확인
- [ ] 새로고침 후 선택값 유지 확인
- [ ] `data-theme`와 `color-scheme` 변경 확인
- [ ] Home, Projects, Technical Notes, About, Contact 주요 화면 확인
- [ ] 라이트 모드에서 Hero 라이트 변형 확인
- [ ] 다크 모드에서 기존 다크 Hero 확인
- [ ] 모바일 너비에서 Header와 테마 컨트롤 확인
- [ ] dark 모드에서 버튼, 카드, 링크 대비 확인

---

## Task 14: 최종 검증

**Files:**
- No planned code changes

- [ ] 린트 검증: `pnpm lint`
- [ ] 타입 검증: `pnpm typecheck`
- [ ] 테스트 실행: `pnpm test`
- [ ] 콘텐츠 검증: `pnpm check:content`
- [ ] 이미지 경로 검증: `pnpm check:image-paths`
- [ ] 전체 검증: `pnpm check:all`

---

## Decisions

- [x] 기준 위치는 서울로 고정한다. 좌표는 `37.5665, 126.978`, 시간대는 `Asia/Seoul`을 사용한다.
- [x] 일출/일몰 계산은 `suncalc` 라이브러리를 사용한다.
- [x] Header 테마 컨트롤은 아이콘 메뉴로 구현한다.
- [x] 기존 다크 Hero는 유지하고 라이트 모드용 Hero 변형을 추가한다.
