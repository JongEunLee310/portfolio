# AGENTS.md

## 프로젝트 목적

이 프로젝트는 GitHub Pages에 배포되는 정적 포트폴리오 홈페이지이다.

핵심 목표는 다음과 같다.

1. 백엔드 개발자로서의 문제 해결 역량을 보여준다.
2. 프로젝트와 기술 노트를 데이터 기반으로 관리한다.
3. React 컴포넌트는 화면 표현만 담당하고, 표시되는 모든 콘텐츠는 `src/data/*.ts`에서 관리한다.
4. GitHub Pages 정적 호스팅 환경에서 동작해야 한다.

## 최우선 규칙

- 화면에 표시되는 텍스트, 프로젝트 정보, 기술 노트 정보, 연락처, 기술 스택은 컴포넌트에 하드코딩하지 않는다.
- 모든 표시 데이터는 `src/data/*.ts` 또는 `src/constants/*.ts`에서 가져온다.
- 컴포넌트는 props를 받아 렌더링하는 것을 기본으로 한다.
- 페이지 컴포넌트만 `src/data`를 직접 import할 수 있다.
- 공통 컴포넌트는 `src/data`를 import하지 않는다.
- `src/types`는 타입 선언만 포함한다.
- `src/data`는 React 컴포넌트를 import하지 않는다.
- `src/data`는 `src/types`와 `src/constants`만 import할 수 있다.
- GitHub Pages 배포를 고려해 라우팅은 기본적으로 HashRouter를 사용한다.

## 주요 문서

작업 전 반드시 아래 문서를 확인한다.

- `docs/domain/routes.md`
- `docs/domain/content-model.md`
- `docs/conventions/data-management.md`
- `docs/conventions/component-boundary.md`
- `docs/conventions/naming.md`
- `docs/conventions/testing.md`
- `docs/decisions/001-static-github-pages.md`
- `docs/decisions/002-data-driven-content.md`
- `docs/decisions/003-routing-strategy.md`
- `docs/decisions/004-design-system.md`

## Codex 스킬 사용

- Codex는 작업 성격에 맞는 스킬이 `.codex/skills`에 있으면 해당 스킬 안내 파일을 먼저 확인하고 지시를 따른다.
- 여러 스킬이 관련될 때는 필요한 최소한의 스킬만 사용한다.
- 스킬 지시가 이 문서의 최우선 규칙과 충돌하면 이 문서의 최우선 규칙을 우선한다.

## 디렉토리 책임

| 경로 | 책임 |
|---|---|
| `src/app` | 앱 초기화, 라우터 구성 |
| `src/pages` | 라우트 단위 페이지 조립 |
| `src/components` | 재사용 가능한 UI 컴포넌트 |
| `src/data` | 화면 표시용 정적 데이터 |
| `src/types` | TypeScript 타입 |
| `src/constants` | 경로, 외부 링크, 고정 상수 |
| `src/styles` | 전역 스타일 |
| `public` | 이미지, PDF 등 정적 파일 |
| `docs` | 결정 기록, 규칙, 도메인 지식, 실패 기록 |
| `scripts` | 드리프트 감지 및 검증 스크립트 |

## 콘텐츠 작성 규칙

`src/data/note-details`, `src/data/project-details` 등 포트폴리오 콘텐츠를 작성할 때는 실제 소스 코드가 존재하면 반드시 먼저 확인한다.

- 프로젝트 소스가 있는 경우 해당 디렉토리를 탐색해 실제 구현 코드, 설정, 문서를 읽고 내용을 반영한다.
- 코드 예시는 실제 파일에서 가져온다. 일반적인 예시 코드를 만들어내지 않는다.
- 수치(응답 시간, 쿼리 수, 메모리 사용량 등)도 측정 근거가 있어야 한다. 근거가 없으면 수치를 생략한다.

## 금지 사항

- 컴포넌트 내부에 프로젝트 설명을 직접 작성하지 않는다.
- 컴포넌트 내부에 기술 노트 본문을 직접 작성하지 않는다.
- `any` 타입을 사용하지 않는다.
- `console.log`를 남기지 않는다.
- 임시 파일을 커밋하지 않는다.
- `temp_`, `_new`, `_old`, `_backup`, `_fix`가 포함된 파일을 만들지 않는다.
- `src/components`에서 `src/data`를 import하지 않는다.
- `src/data`에서 `src/components`를 import하지 않는다.
- `src/types`에서 `src/data`를 import하지 않는다.

## PR 전 확인 명령

작업 완료 전 아래 명령을 실행한다.

```bash
pnpm check:all
```
