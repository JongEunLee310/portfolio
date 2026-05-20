# HomePage 고도화 설계

## 목표

포트폴리오 랜딩 페이지(`HomePage`)에 Technical Highlights 섹션과 Contact CTA 섹션을 추가해, 방문자가 개발 방향성·기술 강점·연락처를 빠르게 파악할 수 있도록 한다.

## 현재 상태

`HomePage.tsx`는 다음 섹션을 이미 보유한다.

1. Hero
2. Featured Projects
3. Recent Notes (Technical Notes)
4. Tech Stack

## 변경 범위

### 신규 파일

**`src/data/highlights.ts`**

- 타입: `{ icon: IconName; title: string; description: string }[]`
- 항목 4개:
  - `Gauge` — 성능 개선 (DB Round-trip 감소, 쿼리 최적화로 API 응답 시간 개선)
  - `Workflow` — 비동기 아키텍처 (동기 파이프라인을 Celery 기반 비동기 구조로 전환)
  - `Cloud` — 인프라 & DevOps (AWS Blue-Green 배포, GitHub Actions CI/CD 자동화)
  - `Layers` — 문제 해결 (ALB+CORS 트러블슈팅, 실환경 문제를 계층별로 추적)

### 변경 파일

**`src/pages/HomePage.tsx`**

최종 섹션 순서:

1. Hero (기존)
2. Featured Projects (기존)
3. **Technical Highlights** (신규)
4. Recent Notes (기존 + "전체 보기" ButtonLink 추가)
5. Tech Stack (기존)
6. **Contact CTA** (신규)

**Technical Highlights 섹션 (`bg-white`)**

- `SectionHeader`: eyebrow "TECHNICAL HIGHLIGHTS", title "기술적 강점"
- 4열 그리드 (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- 카드 스타일: `rounded-2xl border border-slate-200 bg-slate-50 p-6`
- 카드 내부: Lucide 아이콘 (파란색, `h-8 w-8`) + `h3` title + `p` description
- 아이콘 렌더링: `HomePage.tsx` 내 인라인 iconMap 사용 (ProjectDetailSections 패턴 동일)

**Contact CTA 섹션 (`bg-hero-radial text-white`)**

- 중앙 정렬 (`text-center`)
- 제목: "함께 만들고 싶은 프로젝트가 있으신가요?"
- 부제: "새로운 아이디어부터 기술적 도전까지 빠르게 이해하고 함께 고민합니다."
- 버튼:
  - "연락하기" → `PATHS.contact` (ButtonLink primary)
  - "GitHub" → `externalLinks.github` (ButtonLink darkOutline, target="_blank")

## 데이터 흐름

```
src/data/highlights.ts  →  HomePage.tsx  (인라인 렌더링)
src/constants/externalLinks.ts  →  HomePage.tsx  (GitHub URL)
src/constants/paths.ts  →  HomePage.tsx  (PATHS.contact)
```

## import 경계 준수

- `pages → data` ✅
- `pages → constants` ✅
- `pages → components` ✅

## 완료 기준

- TypeScript 오류 없음
- `npm run lint` 통과
- `npm run test` 통과
- 모바일에서 Hero CTA와 Contact CTA 버튼이 모두 정상 표시
