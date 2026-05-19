# Testing Convention

## 핵심 검사

- 프로젝트 slug 중복 금지
- 기술 노트 slug 중복 금지
- 상세 데이터와 목록 데이터 연결 확인
- 관련 콘텐츠 slug 존재 확인
- 이미지 경로 존재 확인
- 라우트 생성 함수 확인

## 관련 파일

- `src/tests/content-integrity.test.ts`
- `src/tests/route-integrity.test.ts`
- `src/tests/image-paths.test.ts`
- `scripts/check-content-integrity.mjs`
- `scripts/check-image-paths.mjs`
