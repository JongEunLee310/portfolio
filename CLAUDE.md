# CLAUDE.md

## 역할

당신은 이 포트폴리오 홈페이지 프로젝트의 AI 개발 보조자이다.

당신의 역할은 단순히 코드를 생성하는 것이 아니라, 정해진 하네스 안에서 일관된 구조와 품질을 유지하며 구현하는 것이다.

## 작업 전 체크리스트

1. 화면 콘텐츠 변경이면 `src/data/*.ts`를 수정한다.
2. UI 표현 변경이면 `src/components` 또는 `src/pages`를 수정한다.
3. 라우팅 변경이면 `src/constants/paths.ts`, `src/app/router.tsx`, `docs/domain/routes.md`를 함께 확인한다.
4. 데이터 모델 변경이면 `src/types`, `src/data`, `docs/domain/content-model.md`, 테스트를 함께 수정한다.
5. 규칙 변경이면 `AGENTS.md`, `CLAUDE.md`, `docs/conventions`를 함께 수정한다.

## 구현 규칙

화면에 보이는 문구는 컴포넌트에 직접 작성하지 않는다. 페이지가 `src/data`에서 데이터를 가져오고, 컴포넌트에 props로 주입한다.

## 콘텐츠 작성 규칙

`src/data/note-details`, `src/data/project-details` 등 포트폴리오 콘텐츠를 작성할 때는 실제 소스 코드가 존재하면 반드시 먼저 확인한다.

- 프로젝트 소스가 있는 경우 해당 디렉토리를 탐색해 실제 구현 코드, 설정, 문서를 읽고 내용을 반영한다.
- 코드 예시는 실제 파일에서 가져온다. 일반적인 예시 코드를 만들어내지 않는다.
- 수치(응답 시간, 쿼리 수, 메모리 사용량 등)도 측정 근거가 있어야 한다. 근거가 없으면 수치를 생략한다.

### 노트 카드 작성 규칙

`src/data/notes/` 아래에 `TechnicalNoteCard`를 작성할 때는 반드시 `cardSummary`를 함께 포함한다.

- `cardSummary`가 없으면 프로젝트 상세 페이지의 트러블슈팅 카드 섹션에 노트가 표시되지 않는다.
- 카테고리별 `cardSummary` 작성 기준은 `docs/domain/content-model.md`를 참고한다.

## import 경계

허용되는 방향은 다음과 같다.

```txt
pages -> data
pages -> components
pages -> constants
pages -> types
components -> types
components -> constants
components -> components
data -> types
data -> constants
types -> types
constants -> constants
```

금지되는 방향은 다음과 같다.

```txt
components -> data
data -> components
types -> data
constants -> data
pages -> pages
```

## CI 센서 활용

- ESLint 실패: import 경계, 사용하지 않는 변수, console 사용 여부를 확인한다.
- TypeScript 실패: 데이터 타입과 컴포넌트 props 불일치를 확인한다.
- Test 실패: slug, 이미지 경로, 관련 콘텐츠 연결이 깨졌는지 확인한다.
- Docs drift 실패: 문서에 언급된 파일이 실제로 존재하는지 확인한다.
- Structure 실패: 임시 파일이나 금지된 경로가 생겼는지 확인한다.
