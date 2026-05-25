import type { TechnicalNoteDetail } from "@/types/note";
import { corsCookieAuthFailure } from "../notes/cors-cookie-auth-failure";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const corsCookieAuthFailureDetail: TechnicalNoteDetail = {
  ...corsCookieAuthFailure,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서 프론트엔드와 백엔드가 서로 다른 도메인 또는 포트에서 실행될 때 로그인 후 인증 정보를 Cookie로 관리하면 브라우저 보안 정책의 영향을 받습니다. 서버는 로그인 성공 응답을 보냈지만 브라우저가 Cookie를 저장하지 않거나 이후 API 요청에 포함하지 않으면 사용자는 로그인 직후에도 인증되지 않은 상태로 보입니다.",
    },
    {
      type: "list",
      items: [
        "로그인 API 200 응답 + Set-Cookie 존재 → 브라우저 Application 탭에 Cookie 없음",
        "Cookie는 저장됨 → 다음 API 요청 Request Headers에 Cookie 미포함",
        "로컬에서는 동작 → 배포 환경에서만 인증 실패",
        "배포에서는 동작 → 로컬 HTTP 환경에서만 Cookie 미저장",
        "Postman/curl에서는 성공 → 브라우저에서만 CORS 차단",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "CORS 오류는 서버 로그에 명확히 남지 않을 수 있습니다. 요청 자체가 브라우저에서 차단되거나 Cookie 저장이 브라우저 정책에 의해 거부되기 때문입니다. 서버 로그만 보면 빙산의 윗부분만 더듬는 꼴이 됩니다. Network 탭과 Application 탭을 함께 확인해야 합니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 CORS 설정과 Cookie 속성을 각각 따로 보고 둘의 조합을 함께 검증하지 않았기 때문입니다. 브라우저에서 Cookie 인증이 동작하려면 서버 CORS, 프론트 요청 옵션, Cookie 속성 세 영역이 모두 맞아야 합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "wildcard origin 사용",
          description:
            "Access-Control-Allow-Origin: * 는 credentials 요청과 함께 사용할 수 없습니다. 브라우저가 Cookie 포함 응답을 차단합니다.",
          badge: "핵심 원인",
        },
        {
          title: "credentials 설정 누락",
          description:
            "서버 또는 프론트 한쪽에서 credentials 설정이 빠지면 브라우저가 Cookie를 저장하거나 전송하지 않습니다.",
          badge: "양쪽 필요",
        },
        {
          title: "SameSite 정책 오해",
          description:
            "SameSite=Lax는 cross-site POST 요청에서 Cookie를 전송하지 않습니다. 도메인이 분리된 배포 환경에서는 None이 필요합니다.",
          badge: "환경 불일치",
        },
        {
          title: "Secure 속성 환경 불일치",
          description:
            "SameSite=None은 Secure=true가 필요합니다. HTTP 로컬 환경에서 Secure Cookie는 저장되지 않습니다.",
          badge: "HTTP/HTTPS 혼용",
        },
      ],
    },
    {
      type: "code",
      language: "text",
      filename: "Cookie 인증 동작 조건 조합",
      code: "// 동작하지 않는 조합\nAccess-Control-Allow-Origin: *\n+ credentials: include\n→ 브라우저 CORS 차단\n\n// 동작하지 않는 조합\nAccess-Control-Allow-Credentials: true\n+ 프론트 credentials 설정 없음\n→ Cookie 요청 미전송\n\n// 동작하지 않는 조합\nSameSite=None + Secure=false\n→ 브라우저 Cookie 저장 거부\n\n// 올바른 조합 (cross-origin Cookie 인증)\n서버: Access-Control-Allow-Origin: https://quiz.example.com\n서버: Access-Control-Allow-Credentials: true\n클라이언트: credentials: include (fetch) 또는 withCredentials: true (axios)\nCookie: SameSite=None; Secure; HttpOnly",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "Access Token을 localStorage에 저장",
          description:
            "CORS Cookie 문제를 피할 수 있지만 XSS 공격에 토큰이 노출될 위험이 있습니다.",
          badge: "미채택",
        },
        {
          title: "Cookie 인증 유지 + 설정 정비",
          description:
            "HttpOnly Cookie로 XSS 방어를 유지하면서 CORS와 Cookie 속성을 환경별로 명확히 정리합니다.",
          badge: "채택",
        },
        {
          title: "환경별 origin 명시",
          description:
            "allowedOrigins에 실제 프론트엔드 도메인을 명시해 wildcard 사용을 제거합니다.",
          badge: "채택",
        },
        {
          title: "로컬/배포 Cookie 정책 분리",
          description:
            "HTTP 로컬 환경과 HTTPS 배포 환경의 SameSite/Secure 조건을 환경 변수로 분리합니다.",
          badge: "채택",
        },
      ],
    },
    {
      type: "list",
      items: [
        "허용할 프론트엔드 origin을 allowedOrigins에 명시적으로 등록합니다.",
        "Cookie 인증 API에서 Access-Control-Allow-Credentials: true를 허용합니다.",
        "프론트엔드 API client에 credentials: include 또는 withCredentials: true를 설정합니다.",
        "배포 환경에서는 SameSite=None; Secure 조합을 사용합니다.",
        "로컬 HTTP 환경에서는 HTTP 조건에 맞게 Cookie 정책을 별도로 구성합니다.",
        "OPTIONS preflight 요청에도 CORS 헤더가 정상 응답되도록 설정합니다.",
        "wildcard origin과 credentials 조합을 사용하지 않습니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "Backend CORS 설정, Cookie 발급 속성, Frontend API client 설정을 환경별로 정리합니다. 세 영역이 맞물려야 브라우저가 Cookie를 저장하고 이후 요청에 포함합니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "CORS · Cookie · credentials 설정 기준",
      code: "Backend CORS 설정:\n  allowedOrigins = [\"http://localhost:5173\", \"https://quiz.example.com\"]\n  allowCredentials = true\n  allowedMethods = GET, POST, PATCH, DELETE, OPTIONS\n  allowedHeaders = Content-Type, Authorization\n\nFrontend API client:\n  fetch  → credentials: \"include\"\n  axios  → withCredentials: true\n  (이 설정 없으면 저장된 Cookie도 요청에 미포함)\n\nCookie 속성 (배포 환경):\n  HttpOnly; Secure; SameSite=None; Path=/\n\nCookie 속성 (로컬 HTTP 환경):\n  HttpOnly; SameSite=Lax (또는 환경별 별도 정책)\n  (HTTP에서 Secure Cookie는 브라우저가 저장 거부)\n\n처리 흐름:\n  POST /auth/login with credentials\n    → 200 OK + Set-Cookie (HttpOnly; Secure; SameSite=None)\n    → 브라우저 Cookie 저장\n  GET /auth/me with credentials\n    → Request Headers에 Cookie 포함\n    → 200 OK (인증 성공)",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "OPTIONS preflight 요청에도 CORS 헤더가 포함되어야 합니다. preflight 응답에 Access-Control-Allow-Origin, Access-Control-Allow-Credentials가 없으면 브라우저가 본 요청 자체를 차단합니다. Spring Security를 사용한다면 CORS 필터가 Security 필터보다 먼저 실행되도록 순서를 확인해야 합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "wildcard origin + credentials 요청",
          before: "설정 적용",
          after: "브라우저 CORS 차단",
          change: "차단",
        },
        {
          label: "로그인 후 Cookie 저장 여부 (배포)",
          before: "Set-Cookie 있음 → Application 탭 Cookie 없음",
          after: "Set-Cookie 있음 → Cookie 저장됨",
          change: "개선",
        },
        {
          label: "인증 API 요청의 Cookie 포함 여부",
          before: "credentials 누락 → Cookie 미전송 → 401",
          after: "credentials 포함 → Cookie 전송 → 200",
          change: "개선",
        },
        {
          label: "SameSite=None + Secure=false",
          before: "브라우저가 Cookie 저장 거부",
          after: "SameSite=None; Secure=true로 정상 저장",
          change: "개선",
        },
        {
          label: "새로고침 후 인증 유지",
          before: "Cookie 없어 401",
          after: "Cookie 유지 → 로그인 상태 유지",
          change: "개선",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "CORS origin 설정",
          before: "wildcard 또는 불명확",
          after: "허용 origin 명시",
          change: "개선",
        },
        {
          label: "credentials 설정",
          before: "서버·클라이언트 중 한쪽 누락 가능",
          after: "양쪽 모두 설정",
          change: "개선",
        },
        {
          label: "Cookie 속성",
          before: "환경별 기준 불명확",
          after: "local/dev/prod 분리",
          change: "개선",
        },
        {
          label: "로그인 후 상태",
          before: "Cookie 미저장 또는 미전송 가능",
          after: "인증 요청에 Cookie 포함",
          change: "개선",
        },
        {
          label: "디버깅 방식",
          before: "서버 응답만 확인",
          after: "Network + Application 탭 함께 확인",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "서버가 '로그인 성공'이라고 말하고, 브라우저도 'Cookie를 보관했고 다음 요청에 들고 가겠다'고 같은 문장을 말하게 됩니다. 로그인 성공 응답과 실제 로그인 유지 상태가 일치합니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "Cookie 인증은 백엔드 로직만으로 완성되지 않습니다. Set-Cookie를 내려줘도 브라우저가 저장하지 않을 수 있고, 저장된 Cookie도 요청 설정에 따라 전송되지 않을 수 있습니다.",
        "CORS는 서버 간 통신 문제가 아니라 브라우저 보안 모델의 문제입니다. Postman이나 curl에서는 정상인데 브라우저에서만 실패할 수 있는 이유가 여기에 있습니다.",
        "CORS, credentials, SameSite, Secure는 개별 설정이 아니라 조합으로 동작합니다. 하나의 설정만 맞아서는 Cookie 인증이 동작하지 않습니다.",
        "로컬 HTTP 환경과 배포 HTTPS 환경의 Cookie 정책 차이를 미리 정리해야 합니다. 배포에서만 로그인이 안 되거나 로컬에서만 Cookie가 저장되지 않는 문제는 대부분 이 차이에서 비롯됩니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 CORS, credentials, SameSite, Secure 조합이 핵심 개념입니다. Cookie 인증을 유지한다면 SameSite=None으로 cross-site Cookie를 허용할 때 CSRF 대응 전략도 함께 검토해야 합니다. 향후에는 refresh token을 Cookie에 둘 경우 보안 정책과 access token을 메모리에 둘 경우 새로고침 처리 방식을 추가로 검토할 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "refresh-token-reissue-loop",
    "role-based-question-access",
  ],
};
