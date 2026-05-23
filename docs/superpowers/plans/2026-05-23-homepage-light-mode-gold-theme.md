# 홈페이지 라이트 모드 골드 테마 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈페이지 라이트 모드의 포인트 컬러를 파랑에서 골드(#C9972B)로 교체해 배너 이미지와 색상을 통일한다.

**Architecture:** 4개 파일만 수정한다. 다크 모드·다른 페이지는 건드리지 않는다. `tailwind.config.ts`에 gold 토큰을 추가하고, `ButtonLink`에 variant를 하나 더 추가한 뒤, `PageHero`와 `HomePage`의 라이트 분기만 수정한다.

**Tech Stack:** React, TypeScript, Tailwind CSS v3, Vite

---

### Task 1: tailwind.config.ts — gold 색상 토큰 추가

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: brand.gold 토큰 추가**

`tailwind.config.ts`의 `brand` 객체에 아래를 추가한다:

```ts
brand: {
  dark: "#020712",
  navy: "#06101f",
  surface: "#0d1b2f",
  blue: "#2563eb",
  blueLight: "#3b82f6",
  gold: {
    DEFAULT: "#C9972B",
    light: "#F5D985",
    medium: "#D3A33A",
    dark: "#966B15",
    bg: "#FDF3DC",
  },
},
```

- [ ] **Step 2: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add tailwind.config.ts
git commit -m "feat: tailwind gold 색상 토큰 추가"
```

---

### Task 2: ButtonLink.tsx — goldPrimary variant 추가

**Files:**
- Modify: `src/components/common/ButtonLink.tsx`

- [ ] **Step 1: goldPrimary variant 추가**

`ButtonLinkVariant` 타입과 `variants` 맵에 아래를 추가한다. 기존 `primary`(파랑)는 변경하지 않는다:

```ts
type ButtonLinkVariant = "primary" | "outline" | "darkOutline" | "goldPrimary";

const variants: Record<ButtonLinkVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-blue-soft transition hover:bg-blue-500",
  outline:
    "border border-slate-300 bg-white text-slate-900 transition hover:border-blue-500 hover:text-blue-600",
  darkOutline:
    "border border-white/20 bg-white/5 text-white transition hover:border-blue-400 hover:bg-blue-500/10",
  goldPrimary:
    "bg-[#C9972B] text-white shadow-card transition hover:bg-[#B8851E]",
};
```

- [ ] **Step 2: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/components/common/ButtonLink.tsx
git commit -m "feat: ButtonLink goldPrimary variant 추가"
```

---

### Task 3: PageHero.tsx — 라이트 모드 골드 색상 적용

**Files:**
- Modify: `src/components/hero/PageHero.tsx`

- [ ] **Step 1: isLight 분기 배경·패턴·글로우 교체**

`section` 요소의 `isLight` 배경 클래스를 교체한다:

```tsx
// 변경 전
"border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef6ff_100%)] text-slate-950"

// 변경 후
"border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#F7F3EC_100%)] text-slate-950"
```

도트 패턴 div의 색상을 교체한다:

```tsx
// 변경 전
"absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.22)_1px,transparent_0)] bg-[length:32px_32px]"

// 변경 후
"absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(201,151,43,0.15)_1px,transparent_0)] bg-[length:32px_32px]"
```

우측 radial 글로우 div 색상을 교체한다:

```tsx
// 변경 전
<div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_70%_28%,rgba(37,99,235,0.18),transparent_42%)]" />

// 변경 후
<div className="absolute right-0 top-0 h-full w-2/3 bg-[radial-gradient(circle_at_70%_28%,rgba(201,151,43,0.10),transparent_42%)]" />
```

- [ ] **Step 2: 아이브로·하이라이트 텍스트 색상 교체**

eyebrow `<p>` 의 isLight 분기:

```tsx
// 변경 전
isLight ? "text-blue-700" : "text-blue-400"

// 변경 후
isLight ? "text-[#966B15]" : "text-blue-400"
```

highlight `<span>` 의 클래스:

```tsx
// 변경 전
<span className="text-blue-500">{highlightedText}</span>

// 변경 후
<span className={isLight ? "text-[#C9972B]" : "text-blue-500"}>{highlightedText}</span>
```

- [ ] **Step 3: primaryAction 버튼 variant 교체**

```tsx
// 변경 전
{primaryAction ? (
  <ButtonLink href={primaryAction.href}>{primaryAction.label}</ButtonLink>
) : null}

// 변경 후
{primaryAction ? (
  <ButtonLink href={primaryAction.href} variant={isLight ? "goldPrimary" : "primary"}>
    {primaryAction.label}
  </ButtonLink>
) : null}
```

- [ ] **Step 4: typecheck**

```bash
pnpm typecheck
```

Expected: 오류 없음

- [ ] **Step 5: 커밋**

```bash
git add src/components/hero/PageHero.tsx
git commit -m "feat: PageHero 라이트 모드 골드 테마 적용"
```

---

### Task 4: HomePage.tsx — 하이라이트 아이콘 색상 교체

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: 아이콘 색상 교체**

TECHNICAL HIGHLIGHTS 섹션의 아이콘 색상을 교체한다:

```tsx
// 변경 전
{Icon ? <Icon className="h-8 w-8 text-blue-600" /> : null}

// 변경 후
{Icon ? <Icon className="h-8 w-8 text-[#C9972B]" /> : null}
```

- [ ] **Step 2: typecheck + lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: 오류 없음

- [ ] **Step 3: 커밋**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: 홈페이지 라이트 모드 골드 테마 적용"
```

---

### Task 5: 빌드 검증

- [ ] **Step 1: 전체 빌드**

```bash
pnpm build
```

Expected: 오류 없이 dist/ 생성

- [ ] **Step 2: 미리보기로 확인**

```bash
pnpm dev
```

브라우저에서 라이트 모드 홈페이지를 열어 아래를 확인한다:
- 히어로 배경이 따뜻한 크림색(`#F7F3EC`)으로 끝나는지
- 아이브로 텍스트가 골드 계열(`#966B15`)인지
- "개발자" 하이라이트가 골드(`#C9972B`)인지
- "프로젝트 보기" 버튼이 골드 배경인지
- TECHNICAL HIGHLIGHTS 아이콘이 골드인지
- 다크 모드로 전환 시 파랑이 그대로인지
