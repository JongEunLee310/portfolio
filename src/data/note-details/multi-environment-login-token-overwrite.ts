import type { TechnicalNoteDetail } from "@/types/note";
import { multiEnvironmentLoginTokenOverwrite } from "../notes/multi-environment-login-token-overwrite";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const multiEnvironmentLoginTokenOverwriteDetail: TechnicalNoteDetail = {
  ...multiEnvironmentLoginTokenOverwrite,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "같은 아이디로 서로 다른 로그인 환경에서 접속했을 때, 사용자에게 별도 메시지나 알림 없이 한쪽을 제외한 나머지 환경의 로그인 상태가 풀리는 문제가 있었습니다.",
    },
    {
      type: "paragraph",
      content:
        "같은 브라우저에서 고객, 매니저, 관리자처럼 서로 다른 권한의 화면을 오가거나, 같은 도메인 아래 여러 로그인 환경을 사용하는 경우 먼저 로그인한 환경의 토큰이 나중에 로그인한 환경의 토큰으로 덮이면서 일부 화면에서 갑자기 인증이 만료된 것처럼 동작했습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "핵심 원인은 토큰의 저장 단위와 로그인 환경의 단위가 맞지 않았다는 점입니다. 서버가 항상 'refresh'라는 동일한 cookie 이름으로 Refresh Token을 내려주고, 재발급과 로그아웃도 항상 refresh cookie만 조회합니다.",
    },
    {
      type: "list",
      items: [
        "cookie는 이름, 도메인, path 조합으로 저장됩니다. 같은 도메인과 path에서 같은 cookie 이름을 사용하면 브라우저는 이를 하나의 cookie로 취급합니다.",
        "고객, 매니저, 관리자 로그인 환경이 달라도 cookie 이름이 같으면 마지막 로그인에서 내려준 Refresh Token이 기존 값을 덮습니다.",
        "Access Token은 Authorization header로 전달하지만, 브라우저가 응답 header 자체를 역할별 세션 저장소처럼 자동으로 분리해 보관해 주지는 않습니다.",
        "JwtTokenProvider에도 권한이 달라도 로그인을 했을 때 로그인이 풀리는 이유가 Authorization 헤더가 공유하기 때문이라는 주석이 남아 있어 문제를 인식하고 있었습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "paragraph",
      content:
        "멘토와 논의한 방향은 Access Token과 Refresh Token을 모두 secure cookie로 관리하고, 권한 또는 로그인 환경별로 cookie 이름을 분리하는 것이었습니다. 프로젝트 마감이 임박해 실제 코드 변경은 적용하지 못했으며, 해결 방향만 도출했습니다.",
    },
    {
      type: "comparison",
      items: [
        {
          title: "Access Token header 이름만 분리",
          description: "수정 범위가 작지만 Refresh Token cookie 충돌이 그대로 남아 재발급 시점에 다시 충돌이 발생합니다.",
          bullets: ["수정 범위 최소", "Refresh Token 문제 미해결"],
        },
        {
          title: "AT, RT 모두 권한별 secure cookie로 분리 (채택 방향)",
          description: "브라우저 저장소 충돌을 서버 응답 정책에서 제어할 수 있습니다. 인증 필터, 재발급, 로그아웃, CORS 정책 수정이 필요합니다.",
          bullets: [
            "customer_access_token, customer_refresh_token",
            "manager_access_token, manager_refresh_token",
            "admin_access_token, admin_refresh_token",
          ],
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "해결 방향 적용 시 변경이 필요한 흐름은 다음과 같습니다. 로그인 성공 응답에서 Authorization header 대신 권한별 secure cookie로 Access Token을 내려줍니다. JWT 필터는 요청 URL 또는 인증 대상 권한을 기준으로 어떤 access cookie를 읽을지 결정합니다. 재발급 API는 요청 맥락에 맞는 refresh cookie를 읽고 같은 권한의 access/refresh cookie를 다시 발급합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "이 문제는 프로젝트 기간 안에 해결하지 못해 실제 코드 변경과 성능 측정값이 없습니다. 현재 문서는 해결 완료 기록이 아닌 원인과 개선 방향을 남기는 트러블슈팅 기록입니다.",
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "warning",
      content:
        "기존 구조: Access Token은 Authorization header, Refresh Token은 단일 refresh cookie. 개선 방향: Access Token과 Refresh Token 모두 권한별 secure cookie로 분리. 같은 브라우저에서 다른 권한으로 로그인해도 각 환경의 토큰이 서로 덮이지 않는 구조가 필요합니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "info",
      content:
        "토큰 발급 자체보다 중요한 것은 브라우저가 토큰을 어떤 단위로 저장하고 다시 전송하는지입니다. 권한별 로그인 API를 분리해도, 토큰 저장소가 하나라면 실제 인증 상태는 분리되지 않습니다. Access Token과 Refresh Token은 함께 설계해야 합니다. Access Token 저장 방식만 분리하면 재발급 시점에 Refresh Token 충돌이 다시 드러납니다.",
    },
  ],
  relatedNoteSlugs: [
    "reissue-infinite-request",
    "alb-cors-troubleshooting",
  ],
};
