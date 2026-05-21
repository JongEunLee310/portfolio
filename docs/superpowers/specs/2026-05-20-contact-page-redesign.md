# Contact Page Redesign

**Goal:** 정적 호스팅 환경에 맞게 입력 폼 없이, 신입 백엔드 개발자 채용 연락에 적합한 이메일 CTA + 외부 링크 중심의 연락 페이지로 개선한다.

---

## 섹션 구성

| # | eyebrow / title | 배경 | 핵심 컴포넌트 |
|---|---|---|---|
| 0 | — | `bg-brand-dark` | `PageHero` |
| 1 | CONTACT / 연락하기 | `bg-slate-50` | `ContactEmailCTA`(좌) + `ContactChannelCard × 4`(우) |
| 2 | FAQ + COLLABORATION | `bg-white` | `ContactFAQList`(좌) + `ContactValueCard × 3`(우) |

Section 1: `lg:grid-cols-2 gap-12` — 이메일 CTA 패널(좌)과 보조 채널 4종 2×2 그리드(우)

Section 2: `lg:grid-cols-2 gap-12` — 각 열이 독립 `SectionHeader`를 가진다. About 페이지의 WORKING STYLE + GROWTH METRICS 섹션과 동일한 구조.

---

## 데이터 모델

### `src/types/common.ts`

**추가:**
- `IconName`에 `"MessageSquare"` 추가 (ContactValueCard 아이콘 사용)

### `src/types/contact.ts`

**제거:**
- `ContactFormField` 타입
- `ContactData.formFields: ContactFormField[]`
- `ContactData.responsePromise`

**추가:**
- `ContactData.sections: { contact: SectionBase; faq: SectionBase; collaboration: SectionBase }`

**import 추가:** `SectionBase` from `"./common"`

### `src/data/contact.ts`

**제거:**
- `formFields` 배열
- `responsePromise` 객체

**추가:**
- `sections`: contact / faq / collaboration 섹션 헤더 데이터
  - contact: eyebrow `"CONTACT"`, title `"연락하기"`, description `"..."`
  - faq: eyebrow `"FAQ"`, title `"자주 묻는 질문"`
  - collaboration: eyebrow `"COLLABORATION"`, title `"함께하는 방식"`

**변경:**
- `faq` 4개로 확장하고 신입 백엔드 개발자 채용 맥락으로 조정:
  1. 희망 포지션: Python FastAPI 또는 Java Spring Boot를 사용하는 백엔드 팀
  2. 신입 개발자로서의 강점
  3. 새로운 기술 학습 방식: Claude Code, Codex, GitHub Copilot 등 AI 도구 + 개인 프로젝트 + 기술 노트
  4. 채용 관련 연락 방식
- `values` 3개로 확장 (현재 1개):
  1. `"Gauge"` — 문제 해결 중심
  2. `"MessageSquare"` — 기술적 소통
  3. `"Workflow"` — 지속적 개선

채널 분리 방식:
- `channels[0]` (email): `ContactEmailCTA`에서 단독 소비
- `channels[1..4]` (GitHub, LinkedIn, GitLab, 이력서): `ContactChannelCard` 그리드에서 소비

---

## 컴포넌트

### `src/components/contact/ContactChannelCard.tsx` (수정)
- Props: `{ channel: ContactChannel }` (변경 없음)
- 변경: `{ Mail, Github, ExternalLink, FileDown }` lucide-react 아이콘 매핑 추가, 카드 좌측 아이콘 렌더링

### `src/components/contact/ContactEmailCTA.tsx` (신규)
- Props: `{ channel: ContactChannel }`
- 렌더링 (`surface.card p-8 flex flex-col gap-6`):
  - Mail 아이콘 + 이메일 주소 (`text-xl font-semibold text-slate-900`)
  - `<a>` — `button.primary` 스타일, `href=channel.href` (`mailto:` 링크), "이메일 보내기"
- 평균 응답 시간처럼 확정하기 어려운 약속은 표시하지 않는다.

### `src/components/contact/ContactFAQList.tsx` (신규)
- Props: `{ items: FAQItem[] }`
- 렌더링: `flex flex-col divide-y divide-slate-200`
  - 각 항목은 `button`으로 렌더링하고 `aria-expanded`를 제공한다.
  - 첫 번째 질문은 기본으로 열어둔다.
  - 질문 클릭 시 답변을 열고 닫는다.
  - `ChevronDown` 아이콘을 사용하고 열린 상태에서는 회전한다.
  - 답변: `mt-1 pb-4 text-sm text-slate-600`

### `src/components/contact/ContactValueCard.tsx` (신규)
- Props: `{ value: { title: string; description: string; icon: IconName } }`
- 렌더링 (`surface.card p-6`): 아이콘(8×8) → title(`mt-4 text-base font-semibold text-slate-900`) → description(`mt-2 text-sm text-slate-600`)
- 아이콘 매핑 (lucide-react): `Gauge`, `MessageSquare`, `Workflow`

---

## `src/pages/ContactPage.tsx` 구조

```
PageHero

Section bg-slate-50                                // CONTACT
  SectionHeader (sections.contact)
  div lg:grid-cols-2 gap-12
    ContactEmailCTA channel=channels[0]
    div grid grid-cols-2 gap-4
      ContactChannelCard × 4 (channels[1..4])

Section bg-white                                   // FAQ + COLLABORATION
  div lg:grid-cols-2 gap-12
    div
      SectionHeader (sections.faq)
      ContactFAQList items=faq
    div
      SectionHeader (sections.collaboration)
      div flex flex-col gap-4
        ContactValueCard × 3
```

---

## import 경계

| import | 방향 | 허용 |
|---|---|---|
| `ContactPage` → `contactData` | pages → data | ✅ |
| `ContactPage` → `Contact*` | pages → components | ✅ |
| `Contact*` → `ContactChannel`, `FAQItem`, `IconName` | components → types | ✅ |
| `Contact*` → `surface`, `button` | components → constants | ✅ |

---

## 구현 노트

- `SectionBase` import: `src/types/common.ts`
- `formFields`는 타입과 데이터 모두 완전 제거
- `responsePromise`는 타입과 데이터 모두 완전 제거
- `ContactFAQList` — 드롭다운 렌더링
- `surface.card`, `button.primary` — `src/styles/classNames.ts`
- lucide-react: `Mail`, `Github`, `ExternalLink`, `FileDown`, `Gauge`, `MessageSquare`, `Workflow`, `ChevronDown`
