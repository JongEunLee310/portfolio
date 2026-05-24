import type { TechnicalNoteDetail } from "@/types/note";
import { reissueInfiniteRequest } from "../notes/reissue-infinite-request";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const reissueInfiniteRequestDetail: TechnicalNoteDetail = {
  ...reissueInfiniteRequest,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "Access Token이 만료되면 클라이언트는 /api/reissue로 Refresh Token을 보내 새 Access Token을 발급받아야 했습니다. 그런데 토큰 재발급 요청이 정상적으로 완료되지 않고, 클라이언트에서 재발급 요청이 반복되는 문제가 발생했습니다.",
    },
    {
      type: "paragraph",
      content:
        "이 문제는 재발급 서비스 로직의 문제가 아니라, /api/reissue 요청이 어떤 Spring Security FilterChain에 매칭되고 JWT 필터를 통과하는지와 연결되어 있었습니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "permitAll()은 인가 단계에서 접근을 허용한다는 의미이지, JWT 필터 등 그 앞에 등록된 필터를 건너뛴다는 의미가 아닙니다.",
        "/api/reissue를 역할별 FilterChain(customer, admin)의 permitAll 목록에만 넣으면, JWT 필터가 먼저 만료된 Access Token을 검사해 401을 반환할 수 있습니다.",
        "클라이언트는 재발급 요청 자체에서 401을 받으면 이를 다시 토큰 만료로 판단해 /api/reissue를 재호출하는 무한 루프가 발생합니다.",
        "/api/reissue는 고객·매니저·관리자 역할 구분 없이 인증 주체가 공통으로 사용하는 API로, 역할별 FilterChain이 아닌 공통 public URL로 분류해야 합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "PUBLIC_URLS에 추가",
          description:
            "SecurityUrlConstants.PUBLIC_URLS에 /api/reissue를 추가해 공통 Security FilterChain에서 인증 없이 접근 가능한 endpoint로 분류했습니다.",
          badge: "공통 public URL",
        },
        {
          title: "JWT_FILTER_EXCLUDE_URLS에 추가",
          description:
            "JwtFilter는 요청 URI가 제외 목록에 포함되어 있으면 토큰 검사 없이 다음 필터로 넘깁니다. /api/reissue를 이 목록에 추가해 만료된 Access Token 상태에서도 재발급 서비스까지 요청이 도달하도록 했습니다.",
          badge: "JWT 필터 제외",
        },
        {
          title: "역할별 체인 예외 제거",
          description:
            "customer, admin FilterChain에 있던 /api/reissue 허용 설정을 제거했습니다. 재발급 API를 역할별 체인에서 예외적으로 처리하지 않고 공통 필터 체인에서 관리합니다.",
          badge: "책임 집중",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "요청이 필터를 통과하는 흐름은 다음과 같습니다. Access Token 만료 상태에서 /api/reissue가 호출되면, JwtFilter는 JWT_FILTER_EXCLUDE_PATHS에 포함된 URI로 판단해 토큰 검사 없이 다음 필터로 전달합니다. Spring Security CorsFilter와 공통 FilterChain을 거쳐 ReissueService까지 도달하고, 쿠키의 Refresh Token만 검증해 새 토큰을 발급합니다.",
    },
    {
      type: "code",
      language: "java",
      filename: "SecurityUrlConstants.java",
      code: "public static final String[] PUBLIC_URLS = {\n    \"/api/login\",\n    \"/api/reissue\",   // 추가\n    \"/api/oauth2/**\",\n    // ...\n};\n\npublic static final String[] JWT_FILTER_EXCLUDE_URLS = {\n    \"/api/login\",\n    \"/api/reissue\",   // 추가: 만료 AT 상태에서도 통과\n    // ...\n};",
    },
    troubleshootingHeading(4),
    {
      type: "paragraph",
      content:
        "무한 요청 발생 건수에 대한 정량 측정값은 남아 있지 않습니다. 해결 후 재발급 API 자체에서 401이 반환되지 않아 무한 루프가 끊기는 것을 확인했습니다.",
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "/api/reissue가 공통 public API로 분류되고 JWT 필터 제외 목록에 등록되어, Access Token이 만료된 상태에서도 재발급 요청이 정상적으로 ReissueService까지 도달합니다. 재발급 실패 시에도 명확한 실패 응답(Refresh Token 없음, 만료, 잘못된 토큰)을 반환해 클라이언트가 재시도 여부를 판단할 수 있게 됐습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "Spring Security에서 permitAll은 JWT 필터를 건너뛴다는 의미가 아닙니다. 커스텀 필터가 authorizeHttpRequests보다 앞에 등록되어 있으면 public endpoint라도 필터 내부에서 명시적으로 제외하지 않으면 요청이 차단될 수 있습니다. 공통 인증 API(재발급, 로그아웃)와 역할별 리소스 API를 같은 방식으로 분류하지 말고, URL의 역할을 먼저 구분한 뒤 FilterChain에 배치해야 합니다.",
    },
  ],
  relatedNoteSlugs: [
    "multi-environment-login-token-overwrite",
    "alb-cors-troubleshooting",
  ],
};
