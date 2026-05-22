# Technical Note Detail Reference Redesign Plan

## Task 1: 문서 구조 정의

- [x] 참고 이미지 기반 상세 페이지 spec 작성
- [x] 구현 범위와 데이터 경계 확인

## Task 2: Article 타입 확장

- [x] `src/types/note.ts`에 `cards`, `comparison` section 타입 추가
- [x] 표시용 라벨은 `src/constants/noteDetail.ts`에 추가
- [x] `NoteDetailTemplate`에 `troubleshooting`, `retrospective`, `technical-summary` 추가
- [x] `NOTE_DETAIL_TEMPLATES`에 문서 유형별 섹션 순서 정의
- [x] `TROUBLESHOOTING_NOTE_TEMPLATE` 호환 상수 유지

## Task 3: DB Round-trip 노트 상세 데이터 보강

- [x] `src/data/noteDetails.ts`의 DB Round-trip 상세 문서에 callout, cards, comparison, metrics 섹션 추가
- [x] 기존 관련 노트 연결 유지
- [x] DB Round-trip 문서가 `template: "troubleshooting"`과 7단계 heading을 사용하도록 정리
- [x] 기존 상세 문서에 성격별 `template` 값 부여
- [x] 회고 문서를 회고 템플릿의 6단계 흐름에 맞게 정리

## Task 4: 상세 페이지 레이아웃 리디자인

- [x] `TechnicalNoteDetailPage` hero를 다크 2열 레이아웃으로 변경
- [x] 사이드바에 목차, 기술 태그, 관련 글 블록 구성
- [x] 본문 너비와 카드 흐름을 참고 이미지에 맞게 조정
- [x] 하단 관련 프로젝트/관련 글 CTA를 카드형으로 정리

## Task 5: Article 렌더러 개선

- [x] heading, paragraph, list, callout 스타일 조정
- [x] metrics를 다크 숫자 카드로 변경
- [x] `cards`, `comparison` 렌더링 추가
- [x] 코드블록 radius/spacing 조정

## Task 6: 검증

- [x] `pnpm check:all`
- [x] 로컬 dev server 응답 확인 (`http://127.0.0.1:5174/`)
