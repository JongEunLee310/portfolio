import type { TechnicalNoteDetail } from "@/types/note";
import { albCorsTroubleshooting } from "../notes/alb-cors-troubleshooting";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const albCorsTroubleshootingDetail: TechnicalNoteDetail = {
  ...albCorsTroubleshooting,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "ALB(Application Load Balancer)가 앞단에 배치되고 nginx 없이 Spring Boot로 직접 라우팅하는 구조에서, 브라우저의 CORS Preflight(OPTIONS) 요청이 Spring Security 필터체인과 상호작용하는 방식을 점검하지 않으면 인증 레이어에서 401 또는 403이 발생할 수 있는 상황을 분석했습니다.",
    },
    {
      type: "list",
      items: [
        "Cloudflare DNS → AWS ALB → Spring Boot EC2 직접 연결 구조로 소스에 nginx 설정 파일이 0개입니다.",
        "인증이 필요한 경로(/api/customers/**, /api/managers/**)로 POST·PUT·DELETE 요청 전 브라우저가 OPTIONS Preflight를 먼저 전송합니다.",
        "ALB 또는 Cloudflare가 별도로 CORS 헤더를 추가하면 Access-Control-Allow-Origin이 중복되어 브라우저가 오류로 처리합니다.",
      ],
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "Spring Security가 CORS의 단일 처리 지점인 구조에서 corsConfigurationSource()가 올바르게 설정되어 있는지 확인이 필요했습니다.",
        "역할별 FilterChain(customerFilterChain, managerFilterChain, adminFilterChain)에 exceptionHandling이 없어 인증 오류 시 응답 형식이 일관되지 않을 수 있습니다.",
        "allowedOrigins를 하드코딩하고 있어 도메인 추가 시 누락 위험이 있습니다.",
        "ALB 리스너 규칙에서 CORS 헤더를 중복 추가하면 브라우저가 헤더를 두 개 받아 오류가 발생합니다. 이는 AWS 콘솔에서만 확인 가능합니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "ALB CORS 헤더 중복 제거",
          description:
            "ALB 리스너 규칙에 CORS 응답 헤더를 직접 추가했다면 Spring Security와 중복됩니다. ALB와 Spring Security 중 한 곳에서만 CORS를 처리해야 합니다. Spring Security에 위임하는 것이 일관성 측면에서 낫습니다.",
          badge: "최우선 확인",
        },
        {
          title: "exceptionHandling 보완",
          description:
            "applyCommonSecurityConfig에 authenticationEntryPoint와 accessDeniedHandler를 추가해 모든 역할별 FilterChain에서 401·403 발생 시 일관된 JSON 응답을 내려줍니다.",
          badge: "응답 일관성",
        },
        {
          title: "allowedOrigins 관리 개선",
          description:
            "setAllowedOrigins()를 하드코딩하는 대신 allowedOriginPatterns나 환경 변수 기반으로 전환해 배포 환경 변경에 유연하게 대응합니다.",
          badge: "운영 유연성",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "code",
      language: "java",
      filename: "SecurityConfig.java — corsConfigurationSource()",
      code: "private CorsConfigurationSource corsConfigurationSource() {\n    return request -> {\n        CorsConfiguration config = new CorsConfiguration();\n        config.setAllowedOrigins(Arrays.asList(\n            \"http://localhost:3000\",\n            \"http://localhost:5173\",\n            \"https://halocare.site\",\n            \"https://www.halocare.site\",\n            \"https://api.halocare.site\"\n        ));\n        config.setAllowedMethods(Collections.singletonList(\"*\"));\n        config.setAllowedHeaders(Collections.singletonList(\"*\"));\n        config.setAllowCredentials(true);\n        config.setExposedHeaders(Collections.singletonList(\"Authorization\"));\n        config.setMaxAge(3600L);\n        return config;\n    };\n}",
    },
    {
      type: "paragraph",
      content:
        "JwtFilter는 OncePerRequestFilter를 상속합니다. OPTIONS 요청에 명시적 분기가 없으나, Authorization 헤더가 없으면 accessToken == null 조건에서 filterChain.doFilter()로 통과시킵니다. Spring Security의 CorsFilter가 그 이전에 개입하므로 정상적인 Preflight는 JwtFilter까지 도달하지 않습니다.",
    },
    troubleshootingHeading(4),
    {
      type: "list",
      items: [
        "CORS allowedOrigins 등록 수: 5개",
        "역할별 FilterChain 수: 3개 (customer, manager, admin)",
        "exceptionHandling 설정 FilterChain 수: 1개 (commonFilterChain만 설정됨)",
        "nginx 관련 설정 파일 수: 0개",
        "JWT_FILTER_EXCLUDE_PATHS 등록 수: 9개",
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "CORS 설정 자체는 allowedOrigins 5개 명시, allowedMethods 와일드카드, allowCredentials(true) 조합으로 정상 구성되어 있습니다. Preflight 실패가 발생한다면 가장 유력한 원인은 ALB 또는 Cloudflare에서 CORS 헤더를 중복 추가하는 경우입니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "ALB 직접 연결 구조에서 Spring Security가 CORS의 단일 처리 지점이 됩니다. nginx 없는 구조에서 Preflight 처리를 설계할 때는 중간 레이어가 CORS 헤더를 추가하지 않는지 확인하는 것이 첫 번째 체크포인트입니다. 역할별 FilterChain의 exceptionHandling 누락은 CORS 직접 원인은 아니지만 인증 오류 추적을 어렵게 만들므로 운영 전 보완이 권장됩니다.",
    },
  ],
  relatedNoteSlugs: [
    "reissue-infinite-request",
    "multi-environment-login-token-overwrite",
  ],
};
