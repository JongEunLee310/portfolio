# Contact Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 정적 호스팅 환경에 맞게 입력 폼 없이 신입 백엔드 개발자 채용 연락에 적합한 이메일 CTA + 외부 링크 중심의 연락 페이지로 개선한다.

**Architecture:** 타입/데이터 정리 → 컴포넌트 추가/수정 → 페이지 재구성 순서로 진행한다. 스펙: `docs/superpowers/specs/2026-05-20-contact-page-redesign.md`

**Tech Stack:** React 18, TypeScript, Tailwind CSS, lucide-react

---

### Task 1: 타입 및 데이터 정리

**Files:**
- Modify: `src/types/common.ts`
- Modify: `src/types/contact.ts`
- Modify: `src/data/contact.ts`

- [x] `src/types/common.ts` — `IconName`에 `"MessageSquare"` 추가
- [x] `src/types/contact.ts` — `ContactFormField` 타입 제거, `ContactData.formFields` 제거, `ContactData.responsePromise` 제거, `SectionBase` import 추가, `ContactData.sections` 필드 추가
- [x] `src/data/contact.ts` — `formFields` 배열 제거, `responsePromise` 제거, `sections` 추가, `faq` 4개로 확장, `values` 3개로 확장
- [x] TypeScript 검증: `pnpm typecheck`
- [x] 커밋: `연락 페이지를 채용 중심으로 개선`

---

### Task 2: ContactChannelCard 아이콘 렌더링 추가

**Files:**
- Modify: `src/components/contact/ContactChannelCard.tsx`

- [x] lucide-react에서 `{ Mail, Github, ExternalLink, FileDown }` import
- [x] `iconMap: Partial<Record<IconName, LucideIcon>>` 정의
- [x] 카드 내 아이콘 렌더링 (`h-5 w-5 text-blue-600`)
- [x] TypeScript 검증
- [x] 커밋: `연락 페이지를 채용 중심으로 개선`

---

### Task 3: ContactEmailCTA 컴포넌트 신규 추가

**Files:**
- Create: `src/components/contact/ContactEmailCTA.tsx`

Props:
- `channel: ContactChannel`

렌더링 구조 (`surface.card p-8`):
- 이메일 아이콘 + 주소 표시
- `mailto:` CTA 버튼 (`button.primary`)
- 평균 응답 시간처럼 확정하기 어려운 약속은 표시하지 않음

- [x] 컴포넌트 구현
- [x] TypeScript 검증
- [x] 커밋: `연락 페이지를 채용 중심으로 개선`

---

### Task 4: ContactFAQList 컴포넌트 신규 추가

**Files:**
- Create: `src/components/contact/ContactFAQList.tsx`

Props: `{ items: FAQItem[] }`

렌더링 구조:
- `flex flex-col divide-y divide-slate-200`
- 각 항목: `button` 질문(`py-4 text-sm font-semibold`) + 토글 답변(`mt-1 pb-4 text-sm text-slate-600`)
- 첫 번째 항목은 기본으로 열림
- `aria-expanded`와 `ChevronDown` 회전 상태 제공

- [x] 컴포넌트 구현
- [x] TypeScript 검증
- [x] 커밋: `연락 페이지를 채용 중심으로 개선`

---

### Task 5: ContactValueCard 컴포넌트 신규 추가

**Files:**
- Create: `src/components/contact/ContactValueCard.tsx`

Props: `{ value: { title: string; description: string; icon: IconName } }`

렌더링 구조 (`surface.card p-6`):
- 아이콘 (8×8, `text-blue-600`)
- title (`mt-4 text-base font-semibold text-slate-900`)
- description (`mt-2 text-sm text-slate-600`)

아이콘 매핑: `Gauge`, `MessageSquare`, `Workflow`

- [x] 컴포넌트 구현
- [x] TypeScript 검증
- [x] 커밋: `연락 페이지를 채용 중심으로 개선`

---

### Task 6: ContactPage 재구성

**Files:**
- Modify: `src/pages/ContactPage.tsx`

- [x] 불필요한 import 제거
- [x] `ContactEmailCTA`, `ContactFAQList`, `ContactValueCard` import 추가
- [x] `layout`, `surface` import 추가 (`src/styles/classNames.ts`)
- [x] Section 1 구현: `ContactEmailCTA`(좌) + `ContactChannelCard × 4`(우), `lg:grid-cols-2 gap-12`
- [x] Section 2 구현: `ContactFAQList`(좌) + `ContactValueCard × 3`(우), `lg:grid-cols-2 gap-12`, 각 열 독립 `SectionHeader`
- [x] TypeScript 검증: `pnpm typecheck`
- [x] 린트 검증: `pnpm lint`
- [x] 전체 검증: `pnpm check:all`
- [x] 커밋: `연락 페이지를 채용 중심으로 개선`

---

### Post-Implementation Updates

- [x] FAQ를 드롭다운 방식으로 변경
- [x] FAQ 문구를 신입 백엔드 개발자 채용 맥락으로 수정
- [x] 희망 포지션에 Python FastAPI 또는 Java Spring Boot 사용 팀 선호를 반영
- [x] 새로운 기술 학습 방식에 Claude Code, Codex, GitHub Copilot 활용과 기술 노트 정리 습관을 반영
- [x] 평균 응답 시간 및 `responsePromise` 제거
