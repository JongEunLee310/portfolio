import type { TechnicalNoteDetail } from "@/types/note";
import { googleOauthExceptionMasking } from "../notes/google-oauth-exception-masking";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const googleOauthExceptionMaskingDetail: TechnicalNoteDetail = {
  ...googleOauthExceptionMasking,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "auth_service의 Google OAuth 로그인 핸들러(google_social_handler.py)를 검토하던 중, 토큰 발급 단계에서 발생하는 모든 예외가 동일한 에러 메시지로 묶여 반환된다는 점을 발견했습니다. 네트워크 타임아웃, 잘못된 인증 코드, Google API 서버 오류가 클라이언트에게 모두 400 Bad Request + 'OAuth 에러: {e}' 형태로 전달되고 있었습니다.",
    },
    {
      type: "paragraph",
      content:
        "두 가지 문제가 겹쳐 있었습니다. 첫째, try 블록 내부에서 raise한 HTTPException이 except Exception as e에 잡혀 재래핑됩니다. 둘째, 사용자 정보 조회 단계의 httpx.AsyncClient 블록은 try/except 없이 실행되어, 이 단계에서 오류가 나면 FastAPI 기본 핸들러까지 전파되어 500으로 노출됩니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "except Exception as e의 과도한 범위: httpx 네트워크 예외, Google API HTTP 오류, 내부에서 raise한 HTTPException을 단일 블록이 모두 잡습니다. FastAPI의 HTTPException은 Exception을 상속하므로 의도적으로 발생시킨 오류도 재래핑됩니다.",
        "두 번째 httpx 블록의 예외 미처리: 토큰 발급 블록과 달리 사용자 정보 조회 블록에는 try/except가 없어, 동일한 외부 API 호출 패턴임에도 예외 처리 수준이 달랐습니다.",
        "오류 발생 위치에 따라 완전히 다른 상태 코드(400, 500)가 반환되어 클라이언트가 재시도 전략을 세우기 어려웠습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "except HTTPException: raise 우선 배치",
          description:
            "except 블록 맨 앞에 HTTPException을 re-raise하는 구문을 배치해, 내부에서 의도적으로 raise한 애플리케이션 오류가 외부 except에 잡혀 재래핑되지 않도록 합니다.",
          badge: "재래핑 방지",
        },
        {
          title: "httpx 예외 타입 세분화",
          description:
            "httpx.HTTPStatusError → httpx.TimeoutException → httpx.RequestError 순으로 구체 타입을 먼저 처리합니다. 각각 502, 504, 503을 반환해 오류 원인을 명확히 구분합니다.",
          badge: "상태 코드 분리",
        },
        {
          title: "두 번째 블록 동일 패턴 적용",
          description:
            "사용자 정보 조회 httpx 블록에도 토큰 발급 블록과 동일한 try/except 구조를 적용합니다. 외부 API 호출 패턴이 반복될 때 예외 처리 수준을 통일합니다.",
          badge: "일관성 확보",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "예외 타입별 반환 방식은 HTTPException은 원래 상태 코드와 메시지를 그대로 유지하고, httpx.HTTPStatusError는 502, httpx.TimeoutException은 504, httpx.RequestError는 503을 반환하도록 정리했습니다.",
    },
    {
      type: "code",
      language: "python",
      filename: "google_social_handler.py",
      code: "try:\n    token_response = await client.post(...)\n    if not token_response.is_success:\n        raise HTTPException(status_code=400, detail=\"Google OAuth 토큰 발급 실패\")\nexcept HTTPException:\n    raise                          # 재래핑 방지\nexcept httpx.HTTPStatusError:\n    raise HTTPException(status_code=502, detail=\"Google API 오류\")\nexcept httpx.TimeoutException:\n    raise HTTPException(status_code=504, detail=\"Google 연동 시간 초과\")\nexcept httpx.RequestError:\n    raise HTTPException(status_code=503, detail=\"Google 서버 연결 실패\")",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "유효하지 않은 code 전달",
          before: "400 재래핑 메시지",
          after: "400 원래 메시지 유지",
          change: "메시지 보존",
        },
        {
          label: "Google API 서버 오류",
          before: "400 OAuth 에러",
          after: "502 반환",
          change: "상태 코드 분리",
        },
        {
          label: "네트워크 타임아웃",
          before: "400 OAuth 에러",
          after: "504 반환",
          change: "상태 코드 분리",
        },
        {
          label: "사용자 정보 조회 실패",
          before: "500 Internal Server Error",
          after: "503 반환",
          change: "예외 처리 추가",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "예외 타입별 상태 코드가 분리되어 클라이언트가 재시도 여부를 결정할 수 있게 됐습니다. 내부에서 의도적으로 raise한 HTTPException이 재래핑되지 않아 원래 메시지가 그대로 전달됩니다. 두 번째 httpx 블록에도 동일한 패턴을 적용해 오류 발생 위치에 관계없이 일관된 응답 구조를 가지게 됐습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "except Exception as e는 FastAPI의 HTTPException까지 잡습니다. 의도적으로 raise한 애플리케이션 오류가 재래핑되지 않으려면 except HTTPException: raise를 가장 먼저 배치하거나, try 블록 범위를 httpx 호출만으로 좁혀야 합니다. 외부 API 호출 패턴이 반복될 때 예외 처리 구조를 통일하지 않으면 오류 발생 위치에 따라 전혀 다른 응답이 반환됩니다.",
    },
  ],
  relatedNoteSlugs: [
    "openai-response-direct-access",
    "social-id-unique-constraint-mismatch",
  ],
};
