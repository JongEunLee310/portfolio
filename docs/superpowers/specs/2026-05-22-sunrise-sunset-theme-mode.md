# Sunrise Sunset Theme Mode

**Goal:** 방문자의 현재 시각이 설정된 일출/일몰 구간에 들어가는지 계산해 사이트의 light/dark 모드를 자동 전환한다. GitHub Pages 정적 호스팅에서 동작해야 하므로 서버 API나 런타임 네트워크 호출에 의존하지 않는다. 사용자가 명시적으로 모드를 선택하면 자동 전환보다 사용자 선택을 우선한다.

---

## 배경

현재 사이트는 다크 히어로와 라이트 본문 카드 중심의 고정 스타일을 사용한다. 이 기능은 기존 디자인 시스템을 폐기하지 않고, 페이지 전체의 표면 색상과 주요 컴포넌트 색상 토큰을 `light` 또는 `dark` 테마 상태에 따라 바꾸는 확장이다.

일출/일몰은 시간대만으로 정확히 계산할 수 없고 위치가 필요하다. 초기 구현은 서울의 좌표와 `Asia/Seoul` 시간대를 정적 설정으로 관리한다. 방문자 위치 기반 전환은 브라우저 권한, 개인정보, 실패 처리가 필요하므로 후속 옵션으로 둔다.

---

## Scope

### 포함

- 앱 전역 테마 상태 도입
- `light`, `dark`, `system`, `auto` 모드 모델 정의
- `auto` 모드에서 일출/일몰 시간 기반 테마 계산
- 사용자 선택값을 `localStorage`에 저장
- CSS 변수 또는 Tailwind selector 기반 테마 토큰 정리
- Header 또는 전역 레이아웃에 테마 전환 컨트롤 추가
- 브라우저 새로고침 시 초기 테마 깜빡임 최소화
- `pnpm check:all` 통과

### 제외

- 서버 API 연동
- 외부 날씨/천문 API 호출
- 사용자 위치 권한 요청
- 페이지별 독립 테마
- 콘텐츠 데이터 구조 변경

---

## Theme Mode Model

### ThemeMode

```typescript
export type ThemeMode = "light" | "dark" | "system" | "auto";
```

### ResolvedTheme

```typescript
export type ResolvedTheme = "light" | "dark";
```

### 의미

| 값 | 의미 |
|---|---|
| `light` | 항상 라이트 테마 |
| `dark` | 항상 다크 테마 |
| `system` | `prefers-color-scheme`을 따른다 |
| `auto` | 설정된 위치의 일출/일몰 계산 결과를 따른다 |

기본값은 `auto`로 둔다. 사용자가 직접 선택한 값이 있으면 `localStorage` 값을 우선한다.

---

## Sunrise/Sunset Strategy

### 위치 설정

정적 사이트 제약을 고려해 위치와 시간대 설정은 상수로 관리한다. 기준 위치는 서울로 고정한다.

예상 파일:

- `src/constants/theme.ts`

예시:

```typescript
export const THEME_LOCATION = {
  label: "Seoul",
  latitude: 37.5665,
  longitude: 126.978,
  timeZone: "Asia/Seoul",
} as const;
```

`latitude`, `longitude`, `timeZone`은 화면 표시 콘텐츠가 아니라 계산 설정이므로 `src/constants`에 둔다.

### 계산 방식

초기 구현은 네트워크 호출 없이 클라이언트에서 일출/일몰을 계산한다.

사용 라이브러리는 `suncalc`로 확정한다. `suncalc`는 날짜와 위도/경도를 받아 sunrise, sunset 등 태양 이벤트 시각을 계산할 수 있는 npm 패키지다.

구현자는 `package.json`에 `suncalc`를 추가하고, TypeScript 타입이 필요하면 제공되는 타입 또는 별도 타입 패키지 여부를 확인한다. 내부 계산 유틸은 `suncalc`를 감싸는 adapter 역할만 담당한다. 라이브러리 설치 또는 타입 호환이 불가능한 경우에만 내부 계산 fallback을 검토한다.

### 판정 규칙

- 현재 시각이 `sunrise <= now < sunset`이면 `light`
- 그 외 시간은 `dark`
- 계산 실패 시 `system` 결과를 fallback으로 사용
- `auto` 모드에서는 다음 전환 시각에 맞춰 timer를 예약한다

---

## Architecture

### 신규 타입

예상 파일:

- `src/types/theme.ts`

```typescript
export type ThemeMode = "light" | "dark" | "system" | "auto";
export type ResolvedTheme = "light" | "dark";

export type ThemeState = {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
};
```

### 신규 유틸

예상 파일:

- `src/utils/themeMode.ts`
- `src/utils/sunSchedule.ts`

책임:

- `resolveSystemTheme`
- `resolveAutoTheme`
- `getNextThemeTransition`
- `readStoredThemeMode`
- `writeStoredThemeMode`

유틸은 React를 import하지 않는다.

### Theme Provider

예상 파일:

- `src/app/theme/ThemeProvider.tsx`
- `src/app/theme/useTheme.ts`

책임:

- 초기 모드 결정
- `document.documentElement.dataset.theme` 설정
- `color-scheme` 설정
- `prefers-color-scheme` 변경 감지
- `auto` 모드 timer 관리
- 사용자 모드 변경 API 제공

`ThemeProvider`는 `App` 또는 router 상위에 배치한다.

---

## Styling Direction

### 전역 토큰

`src/styles/globals.css`에 테마 CSS 변수를 둔다.

예상 변수:

```css
:root {
  --color-page-bg: #f8fafc;
  --color-page-text: #0f172a;
  --color-surface: #ffffff;
  --color-surface-muted: #f1f5f9;
  --color-border: #e2e8f0;
}

:root[data-theme="dark"] {
  --color-page-bg: #020712;
  --color-page-text: #f8fafc;
  --color-surface: #06101f;
  --color-surface-muted: #0d1b2f;
  --color-border: rgba(255, 255, 255, 0.12);
}
```

기존 `brand-dark`, `brand-navy`, `brand-blue`는 유지한다. 새 테마 토큰은 페이지/카드/텍스트 같은 전역 표면에 우선 적용한다.

### Tailwind 사용

반복 클래스는 `src/styles/classNames.ts`에 모은다. 새 테마 클래스는 CSS 변수 기반 Tailwind arbitrary value를 사용할 수 있다.

예시:

```typescript
export const themeSurface = {
  page: "bg-[var(--color-page-bg)] text-[var(--color-page-text)]",
  card: "border border-[var(--color-border)] bg-[var(--color-surface)]",
} as const;
```

### 기존 디자인과의 관계

- Hero는 기존 다크 변형을 유지하면서 라이트 테마 전용 변형도 제공한다. 페이지 컴포넌트가 현재 `resolvedTheme`를 읽고 `PageHero`에 다크/라이트 variant를 props로 전달한다.
- Footer는 기존 다크 정체성을 유지하되, 라이트 모드에서는 대비와 연결감을 확인한다.
- 본문 카드와 목록 영역은 테마 토큰으로 전환한다.
- CTA의 파란 포인트 컬러는 유지한다.
- 한 번에 모든 컴포넌트를 갈아엎지 않고 공통 레이아웃, Header, Footer, 카드류부터 단계적으로 적용한다.

---

## Theme Toggle UI

### 위치

초기 위치는 `Header` 우측 네비게이션 영역으로 둔다. 모바일에서도 접근 가능해야 한다.

### 컨트롤 형태

테마 컨트롤은 아이콘 메뉴로 구현한다. 트리거 버튼은 현재 적용된 테마 또는 선택 모드를 나타내는 아이콘을 사용하고, 메뉴 안에서 `auto`, `light`, `dark`, `system` 옵션을 선택한다.

권장 아이콘:

- `auto`: `Sparkles` 또는 `SunMoon`
- `light`: `Sun`
- `dark`: `Moon`
- `system`: `Monitor`

아이콘은 `lucide-react`를 우선 사용한다.

### 옵션

표시 옵션:

- 자동
- 라이트
- 다크
- 시스템

표시 문구와 접근성 라벨은 컴포넌트에 하드코딩하지 않는다. 공통 컴포넌트가 필요로 하는 labels는 페이지/레이아웃 경계에서 props로 전달하거나, 앱 초기화 계층에서 데이터/상수를 주입한다.

예상 데이터 파일:

- `src/data/theme.ts`

예시:

```typescript
export const themeControlContent = {
  label: "테마",
  auto: "자동",
  light: "라이트",
  dark: "다크",
  system: "시스템",
} as const;
```

---

## Data Boundary

| import | 방향 | 허용 |
|---|---|---|
| `App`/theme provider → `src/constants/theme` | app → constants | ✅ |
| `PageLayout` → theme labels props | layout → props | ✅ |
| `Header` → theme labels props | component → props | ✅ |
| theme utils → constants/types | utils → constants/types | ✅ |
| common components → `src/data/theme` | components → data | ❌ |
| `src/data/theme` → React components | data → components | ❌ |

컴포넌트는 테마 상태와 라벨을 props 또는 context hook으로 받는다. 표시 문구를 직접 소유하지 않는다.

---

## Persistence

### localStorage key

```typescript
const THEME_STORAGE_KEY = "portfolio-theme-mode";
```

### 저장 규칙

- 사용자가 테마 컨트롤에서 모드를 선택하면 저장한다.
- 저장된 값이 유효하지 않으면 무시하고 기본값 `auto`를 사용한다.
- 서버 렌더링은 없지만, 브라우저 API 접근은 effect 또는 안전한 guard 안에서 수행한다.

---

## Accessibility

- 테마 전환 컨트롤은 menu button 패턴을 따른다.
- 현재 선택 상태는 메뉴 항목의 `aria-current` 또는 동등한 상태 표현으로 전달한다.
- 아이콘 버튼과 아이콘 메뉴 항목은 accessible label을 제공한다.
- dark 모드에서 본문 텍스트, 카드 경계, 버튼 hover 상태가 WCAG AA 대비를 만족해야 한다.
- `prefers-reduced-motion` 환경에서는 전환 애니메이션을 최소화한다.

---

## Acceptance Criteria

- 최초 방문 시 기본 `auto` 모드로 동작한다.
- 서울 기준으로 낮에는 `light`, 밤에는 `dark`가 적용된다.
- 일출/일몰 시각 계산은 `suncalc`를 사용한다.
- 사용자가 `light`, `dark`, `system`, `auto` 중 하나를 선택할 수 있다.
- Header 테마 컨트롤은 아이콘 메뉴로 동작한다.
- 라이트 모드에서는 Hero가 라이트 변형으로 렌더링된다.
- 다크 모드에서는 기존 다크 Hero 리듬을 유지한다.
- 선택한 모드는 새로고침 후에도 유지된다.
- `auto` 모드에서는 일출/일몰 경계 시간이 지나면 새로고침 없이 테마가 전환된다.
- `system` 모드에서는 OS 테마 변경을 반영한다.
- GitHub Pages 정적 배포 환경에서 네트워크 API 없이 동작한다.
- 화면 표시 문구는 컴포넌트에 하드코딩하지 않는다.
- `src/components`는 `src/data`를 import하지 않는다.
- `pnpm check:all`이 통과한다.

---

## Decisions

- 기준 위치는 서울로 고정한다. 좌표는 `37.5665, 126.978`, 시간대는 `Asia/Seoul`을 사용한다.
- 일출/일몰 계산은 `suncalc` 라이브러리를 사용한다.
- Header 테마 컨트롤은 아이콘 메뉴로 구현한다.
- 기존 다크 Hero는 유지하고, 라이트 모드용 Hero 변형을 추가한다.
