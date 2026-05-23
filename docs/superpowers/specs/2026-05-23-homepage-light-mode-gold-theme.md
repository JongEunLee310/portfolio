# 홈페이지 라이트 모드 골드 테마 적용

## 목표

라이트 모드 홈페이지의 포인트 컬러를 배너 이미지(흰색+황금색+검은색)와 일치시킨다.
다크 모드와 다른 페이지는 변경하지 않는다.

## 색상 팔레트

배너 이미지에서 추출한 골드 팔레트를 포인트 컬러로 사용한다:

| 토큰 | 값 | 용도 |
|------|----|------|
| `brand.gold.DEFAULT` | `#C9972B` | 기본 골드 포인트 |
| `brand.gold.light` | `#F5D985` | 밝은 골드 (그라디언트 시작) |
| `brand.gold.medium` | `#D3A33A` | 중간 골드 |
| `brand.gold.dark` | `#966B15` | 어두운 골드 (아이브로 텍스트) |
| `brand.gold.bg` | `#FDF3DC` | 골드 아이콘 배경 |

## 변경 범위

### `tailwind.config.ts`

`brand` 하위에 `gold` 토큰을 추가한다.

### `src/components/common/ButtonLink.tsx`

`goldPrimary` variant 추가:
- 배경: `#C9972B` → hover: `#B8851E`
- 텍스트: white
- 기존 `primary`(파랑)는 그대로 유지

### `src/components/hero/PageHero.tsx`

`isLight` 분기에서만 변경한다:

- 배경 그라디언트: `#eef6ff` → `#F7F3EC`
- 도트 패턴 색상: `rgba(59,130,246,0.22)` → `rgba(201,151,43,0.15)`
- 우측 radial 글로우: 파랑 → `rgba(201,151,43,0.10)`
- 아이브로 텍스트: `text-blue-700` → `text-[#966B15]`
- 하이라이트 텍스트: `text-blue-500` → `text-[#C9972B]`
- primaryAction 버튼 variant: `"primary"` → `"goldPrimary"`

### `src/pages/HomePage.tsx`

- TECHNICAL HIGHLIGHTS 섹션 아이콘: `text-blue-600` → `text-[#C9972B]`

## 비변경 범위

- 다크 모드: 변경 없음
- 다른 페이지 히어로 (projects, about, contact, technicalNotes): 변경 없음
- `src/styles/globals.css` CSS 변수: 변경 없음
- `outline` / `darkOutline` 버튼 스타일: 변경 없음
- badge, tech-tag 클래스: 변경 없음
