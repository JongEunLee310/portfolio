# ADR-001: GitHub Pages 기반 정적 호스팅 선택

## 상태

Accepted

## 배경

포트폴리오 홈페이지는 백엔드 없이 공개 가능한 정적 사이트로 운영한다.

## 결정

GitHub Pages를 사용해 정적 파일을 호스팅한다.

## 이유

- 무료로 배포 가능하다.
- 포트폴리오 목적에 충분하다.
- React + Vite 빌드 결과물을 정적으로 배포할 수 있다.
- 프로젝트 데이터는 `src/data/*.ts`에서 관리한다.

## 결과

- 서버 API를 사용할 수 없다.
- 문의 폼은 `mailto`, Formspree, Google Forms, EmailJS 중 하나를 사용해야 한다.
- 새로고침 404 문제를 피하기 위해 HashRouter를 기본으로 사용한다.

## 관련 문서

- `docs/decisions/003-routing-strategy.md`
- `docs/domain/routes.md`
