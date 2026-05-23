# 라이트 모드 전체 골드 테마 확장

## 목표

라이트 모드의 모든 파란색 포인트를 골드(#C9972B)로 교체해 다크 모드와 시각적으로 명확히 구분한다.
다크 모드는 기존 파랑을 그대로 유지한다.

## 접근 방식: CSS 변수 중앙화

`globals.css`에 `--color-accent` 계열 변수를 추가한다.
라이트 모드는 골드, 다크 모드는 파랑으로 변수값만 다르게 설정한다.
컴포넌트에서는 `text-blue-600` 같은 하드코딩 대신 `text-[var(--color-accent)]`를 사용한다.

## CSS 변수 정의

### 라이트 모드 (`:root`)

```css
--color-accent: #C9972B;
--color-accent-hover: #B8851E;
--color-accent-dark: #966B15;
--color-accent-bg: rgba(201, 151, 43, 0.10);
--color-accent-border: rgba(201, 151, 43, 0.25);
```

### 다크 모드 (`:root[data-theme="dark"]`)

```css
--color-accent: #3b82f6;
--color-accent-hover: #60a5fa;
--color-accent-dark: #93c5fd;
--color-accent-bg: rgba(37, 99, 235, 0.14);
--color-accent-border: rgba(96, 165, 250, 0.28);
```

## 치환 규칙

| 기존 Tailwind 클래스 | 변경 후 |
|---------------------|---------|
| `text-blue-600`, `text-blue-500` | `text-[var(--color-accent)]` |
| `text-blue-700` | `text-[var(--color-accent-dark)]` |
| `bg-blue-600` | `bg-[var(--color-accent)]` |
| `hover:bg-blue-500`, `hover:bg-blue-600` | `hover:bg-[var(--color-accent-hover)]` |
| `bg-blue-500/10`, `bg-blue-600/10`, `bg-blue-600/20` | `bg-[var(--color-accent-bg)]` |
| `border-blue-400/20`, `border-blue-400/30` | `border-[var(--color-accent-border)]` |
| `hover:border-blue-400`, `hover:border-blue-500` | `hover:border-[var(--color-accent)]` |
| `hover:text-blue-500`, `hover:text-blue-600` | `hover:text-[var(--color-accent)]` |
| `hover:text-blue-700` | `hover:text-[var(--color-accent-dark)]` |
| `after:bg-blue-600` (nav 활성 바) | `after:bg-[var(--color-accent)]` |
| `focus-visible:ring-blue-300` | **변경하지 않음** (접근성) |

## 파일별 변경 사항

### globals.css
- `:root`에 accent 변수 5개 추가
- `:root[data-theme="dark"]`에 accent 변수 5개 추가
- `.badge-primary` background → `var(--color-accent)`
- `.badge-light, .badge-dark` 라이트 모드 값 → 골드 계열

### classNames.ts
- `button.primary`: `bg-blue-600 ... hover:bg-blue-500` → accent 변수

### ButtonLink.tsx
- `primary` variant → `bg-[var(--color-accent)] ... hover:bg-[var(--color-accent-hover)]`
- `goldPrimary` variant 제거
- `outline` hover → `hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]`

### PageHero.tsx (라이트 분기)
- 기존 하드코딩(`#966B15`, `#C9972B`)을 CSS 변수로 교체
- `primaryAction` variant: `"goldPrimary"` → `"primary"` (primary가 이제 accent 사용)

### Header.tsx
- 활성 링크 `text-blue-600`, `after:bg-blue-600` → accent 변수
- 호버 `hover:text-blue-600` → accent 변수

### SectionHeader.tsx
- 아이브로 `text-blue-600` → `text-[var(--color-accent)]`

### ThemeModeControl.tsx
- 호버 `hover:border-blue-300/70 hover:bg-blue-500/10 hover:text-blue-600` → accent 변수

### ContactChannelCard.tsx
- 아이콘 `text-blue-600`, 라벨 `text-blue-600` → accent 변수

### ContactEmailCTA.tsx
- 아이콘 배경 `bg-blue-600/10`, 텍스트 `text-blue-600` → accent 변수

### ContactFAQList.tsx
- 아이콘 `text-blue-600` → accent 변수

### ContactValueCard.tsx
- 아이콘 `text-blue-600` → accent 변수

### AboutArchDiagram.tsx
- 박스 `border-blue-400/30 bg-blue-500/10 text-blue-500`, 연결선 `bg-blue-400/30` → accent 변수

### AboutRoleCard.tsx
- 아이콘 `text-blue-600` → accent 변수

### AboutProfile.tsx
- 링크 호버 `hover:text-blue-600` → accent 변수

### AboutTimeline.tsx
- 타임라인 도트 `bg-blue-500` → accent 변수

### AboutWorkStyle.tsx
- 따옴표 `text-blue-600`, 체크박스 `border-blue-400/20 bg-blue-500/10 text-blue-500` → accent 변수

### NoteCard.tsx
- CTA 버튼 `bg-blue-600 hover:bg-blue-500` → accent 변수

### NoteListToolbar.tsx
- 활성 필터 `bg-blue-600 text-white`, 호버 `hover:border-blue-400/60` → accent 변수

### NoteListSidebar.tsx
- 활성 필터 `bg-blue-600 text-white` (2곳) → accent 변수

### NotePagination.tsx
- 활성 페이지 `border-blue-500 bg-blue-600 text-white`, 호버 `hover:border-blue-400` → accent 변수

### ArticleSectionRenderer.tsx
- info 박스 `border-blue-400/30 bg-blue-500/10`, 아이콘들, 코드 태그, 체크리스트 등 → accent 변수

### ArticleToc.tsx
- 호버 `hover:bg-blue-500/10 hover:text-blue-500` → accent 변수

### HomeNoteCard.tsx
- 호버 `hover:text-blue-500` → accent 변수

### ProjectListToolbar.tsx
- 활성 필터 `bg-blue-600 text-white`, 호버 `hover:border-blue-400/60` → accent 변수

### ProjectContributionTimelineSection.tsx
- 타임라인 도트 `bg-blue-600`, 레이블 `text-blue-600` → accent 변수

### TechnicalNoteDetailPage.tsx
- 관련 노트 카드 호버, 요약 섹션 `border-blue-400/30 bg-blue-500/10`, 링크 `text-blue-600` → accent 변수

## 비변경 범위

- 다크 모드 전용 클래스 (`text-blue-400`, `text-blue-300`, `border-blue-400` in dark context)
- `focus-visible:ring-blue-300` (접근성 포커스 링)
- tech-tag 카테고리별 색상 (backend=green, database=purple 등 의미론적 색상)
- badge-success, badge-warning 등 의미론적 badge
