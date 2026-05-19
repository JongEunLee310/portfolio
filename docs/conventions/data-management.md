# Data Management Convention

## 원칙

이 프로젝트의 콘텐츠는 TypeScript 데이터 파일에서 관리한다. 컴포넌트는 데이터를 직접 소유하지 않는다.

## 데이터 위치

| 데이터 | 파일 |
|---|---|
| 사이트 기본 정보 | `src/data/site.ts` |
| 메뉴 | `src/data/navigation.ts` |
| Hero | `src/data/hero.ts` |
| 프로젝트 목록 | `src/data/projects.ts` |
| 프로젝트 상세 | `src/data/projectDetails.ts` |
| 기술 노트 목록 | `src/data/technicalNotes.ts` |
| 기술 노트 상세 | `src/data/noteDetails.ts` |
| 소개 | `src/data/about.ts` |
| 연락 | `src/data/contact.ts` |
| 기술 스택 | `src/data/techStack.ts` |

## 이미지 경로

이미지는 `public/images` 아래에 둔다. 데이터에서는 `/images/...` 절대 경로를 사용한다.
