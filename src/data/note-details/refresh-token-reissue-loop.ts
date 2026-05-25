import type { TechnicalNoteDetail } from "@/types/note";
import { refreshTokenReissueLoop } from "../notes/refresh-token-reissue-loop";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const refreshTokenReissueLoopDetail: TechnicalNoteDetail = {
  ...refreshTokenReissueLoop,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "문제은행 서비스에서는 로그인 이후 인증이 필요한 API를 호출할 때 Access Token을 사용합니다. Access Token은 짧은 만료 시간을 가지며, 만료되면 Refresh Token으로 새 Access Token을 발급받습니다. 재발급 성공 시 원래 요청을 다시 수행하고, 재발급 실패 시 로그아웃 처리해야 합니다.",
    },
    {
      type: "list",
      items: [
        "일반 API가 401 반환 → reissue 호출 (정상 흐름)",
        "reissue API가 401 반환 → 다시 reissue 호출 (무한 루프 시작)",
        "Refresh Token 만료 → 로그아웃되지 않고 계속 재발급 시도",
        "여러 API가 동시에 401 반환 → reissue 요청 여러 개 폭증",
        "원래 요청 재시도 후 또 401 → 재발급 반복으로 실패 흐름 종료 안 됨",
      ],
    },
    {
      type: "callout",
      variant: "warning",
      content:
        "이 문제는 단순한 인증 실패가 아니라 브라우저와 서버에 불필요한 요청을 계속 발생시키는 흐름 제어 문제입니다. 인증 흐름이 작은 회전문이 되어 사용자를 밖으로 내보내지 못하고 계속 돌리는 상태가 됩니다. Network 탭에는 같은 reissue 요청이 줄줄이 쌓이고, 서버 로그에는 인증 실패 로그가 반복됩니다.",
    },
    troubleshootingHeading(1),
    {
      type: "paragraph",
      content:
        "원인은 인증 실패 응답을 모두 같은 방식으로 처리했기 때문입니다. 모든 401이 재발급 가능한 상황은 아닙니다. Access Token 만료는 재발급으로 복구할 수 있지만, Refresh Token 만료는 복구할 수 없습니다. 복구할 수 없는 실패를 계속 복구하려고 시도하면서 무한 루프가 발생합니다.",
    },
    {
      type: "cards",
      items: [
        {
          title: "reissue API 예외 처리 누락",
          description:
            "재발급 실패 응답도 일반 401과 동일하게 처리해 다시 재발급 대상으로 들어갑니다.",
          badge: "핵심 원인",
        },
        {
          title: "재시도 여부 flag 부재",
          description:
            "요청 객체에 이미 재시도했다는 표시가 없어 같은 요청이 여러 번 재발급을 시도할 수 있습니다.",
          badge: "반복 방어 없음",
        },
        {
          title: "동시 401 요청 제어 없음",
          description:
            "여러 API가 동시에 401을 반환하면 각각 독립적으로 reissue를 호출해 요청이 폭증합니다.",
          badge: "동시성 취약",
        },
        {
          title: "인증 상태 초기화 누락",
          description:
            "재발급 실패 후에도 토큰이 남아 있어 이후 요청에서도 계속 재발급을 시도합니다.",
          badge: "상태 관리 부재",
        },
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "401이 발생한 API의 종류를 구분해야 합니다. 일반 API 401은 Access Token 만료 가능성으로 재발급을 시도해야 하고, 재발급 API 401은 Refresh Token 만료 또는 무효로 로그아웃 처리해야 합니다. 로그인 API나 권한 없는 요청의 401은 재발급 대상이 아닙니다.",
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "reissue API를 예외 처리",
          description:
            "재발급 API URL을 interceptor 재시도 대상에서 제외해 무한 루프를 차단합니다.",
          badge: "채택",
        },
        {
          title: "요청별 retry flag 추가",
          description:
            "요청 객체에 재시도 여부를 표시해 같은 요청이 두 번 이상 재발급을 시도하지 않도록 합니다.",
          badge: "채택",
        },
        {
          title: "재발급 실패 시 로그아웃",
          description:
            "토큰을 제거하고 인증 상태를 초기화한 뒤 로그인 화면으로 이동합니다.",
          badge: "채택",
        },
        {
          title: "재발급 요청 단일화",
          description:
            "동시 401 요청이 발생하면 하나의 reissue promise를 공유해 재발급 요청이 폭증하지 않도록 합니다.",
          badge: "권장",
        },
      ],
    },
    {
      type: "list",
      items: [
        "재발급 API는 interceptor의 재발급 대상에서 제외합니다.",
        "요청 객체에 retry flag를 추가해 요청당 재발급 시도를 1회로 제한합니다.",
        "재발급 성공 시 새 Access Token을 저장하고 원래 요청을 1회 재시도합니다.",
        "재발급 실패 시 토큰을 제거하고 인증 상태를 초기화한 뒤 로그인 화면으로 이동합니다.",
        "이미 재시도한 요청이 다시 401을 받으면 추가 재발급 없이 로그아웃 처리합니다.",
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "처리 흐름은 URL 확인 → retry flag 확인 → reissue 호출 → 성공 시 1회 재시도 / 실패 시 로그아웃 순서로 정리됩니다. 종료 조건이 흐름의 각 분기점에 명확히 존재합니다.",
    },
    {
      type: "code",
      language: "text",
      filename: "인증 interceptor 처리 흐름",
      code: "인증 API 요청 → 401 응답\n  ↓\n요청 URL이 reissue API인가?\n  예 → 재시도 없이 토큰 제거 + 로그아웃 처리\n  아니오 → 이미 retry flag가 설정된 요청인가?\n    예 → 재시도 없이 로그아웃 처리\n    아니오 → reissue API 호출\n\nreissue 성공:\n  새 Access Token 저장\n  원래 요청에 retry flag 설정\n  원래 요청 1회 재시도\n\nreissue 실패 (401):\n  토큰 제거\n  인증 상태 초기화\n  로그인 화면으로 이동\n\n동시 401 발생 시 (개선 방향):\n  첫 번째 요청만 reissue 수행\n  나머지는 동일 promise 대기\n  성공 → 모두 새 토큰으로 재시도\n  실패 → 모두 로그아웃 처리",
    },
    {
      type: "callout",
      variant: "info",
      content:
        "서버에서 재발급 실패 사유를 명확히 내려주면 클라이언트 분기가 쉬워집니다. REFRESH_TOKEN_EXPIRED(로그아웃), REFRESH_TOKEN_INVALID(로그아웃), ACCESS_TOKEN_EXPIRED(재발급 시도) 등 에러 코드를 구분하면 interceptor가 단순 401 하나에 의존하지 않아도 됩니다. 다만 보안상 사용자에게 보여주는 메시지와 클라이언트 내부 분기 코드는 분리해야 합니다.",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "Access Token 만료 후 일반 API 401",
          before: "reissue 반복 호출 가능",
          after: "reissue 1회 호출",
          change: "개선",
        },
        {
          label: "reissue API 401 반환",
          before: "다시 reissue 호출 (무한 루프)",
          after: "재시도 없이 로그아웃 처리",
          change: "차단",
        },
        {
          label: "원래 요청 재시도 후 또 401",
          before: "다시 재발급 시도",
          after: "retry flag로 차단, 로그아웃",
          change: "차단",
        },
        {
          label: "여러 API 동시 401",
          before: "reissue 요청 여러 개 발생",
          after: "reissue 1회로 통합 가능",
          change: "개선",
        },
        {
          label: "Refresh Token 만료 상태",
          before: "계속 재발급 시도, 로그아웃 안 됨",
          after: "재발급 실패 즉시 로그아웃 처리",
          change: "차단",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "metrics",
      items: [
        {
          label: "401 처리 방식",
          before: "모든 401에 reissue 시도",
          after: "요청 종류·retry flag 기준으로 분기",
          change: "개선",
        },
        {
          label: "reissue 실패 처리",
          before: "다시 reissue 가능",
          after: "즉시 로그아웃 처리",
          change: "개선",
        },
        {
          label: "요청 재시도",
          before: "반복 가능",
          after: "요청당 1회 제한",
          change: "개선",
        },
        {
          label: "동시 401",
          before: "reissue 여러 번 발생",
          after: "단일 reissue로 통합 가능",
          change: "개선",
        },
        {
          label: "사용자 인증 상태",
          before: "인증 실패 상태에 갇힘",
          after: "로그인 필요 상태로 명확히 전환",
          change: "개선",
        },
      ],
    },
    {
      type: "callout",
      variant: "success",
      content:
        "Access Token 만료는 복구 가능한 문제로 처리하고, Refresh Token 만료는 세션 종료로 처리합니다. 문이 잠겼을 때는 예비 열쇠를 한 번 써보고, 예비 열쇠도 안 맞으면 끝없이 문고리를 흔들지 않고 새로 로그인하게 만드는 구조가 됩니다.",
    },
    troubleshootingHeading(6),
    {
      type: "list",
      items: [
        "인증 흐름에서는 성공 경로보다 실패 경로의 종료 조건이 더 중요합니다. 재발급은 사용자 경험을 좋게 만들 수 있지만, 실패 조건을 명확히 두지 않으면 오히려 시스템을 불안정하게 만듭니다.",
        "interceptor는 모든 요청과 응답이 지나가는 관문이기 때문에 작은 분기 실수가 전체 API 요청 흐름을 망가뜨릴 수 있습니다.",
        "401이라는 상태 코드 하나만 보고 모든 상황을 판단하면 위험합니다. 401이 발생한 API가 무엇인지, 이미 재시도한 요청인지, Refresh Token이 있는지를 함께 고려해야 합니다.",
        "복구 가능한 실패와 복구 불가능한 실패를 구분해야 합니다. Access Token 만료는 복구 가능하지만 Refresh Token 만료는 복구 불가능합니다. 복구 불가능한 실패를 계속 복구하려는 시도가 무한 루프를 만들었습니다.",
      ],
    },
    {
      type: "callout",
      variant: "info",
      content:
        "이번 문제에서는 Interceptor, Retry Flag, Session Expiration이 핵심 개념입니다. 재발급은 무조건 반복되는 구조가 아니라 한 번의 복구 시도 후 실패하면 명확히 종료되는 구조여야 합니다. 향후에는 동시 401 발생 시 하나의 reissue promise를 공유하는 방식과 Token Rotation(재발급 시 Refresh Token도 함께 갱신)을 추가로 검토할 수 있습니다.",
    },
  ],
  relatedNoteSlugs: [
    "role-based-question-access",
    "exam-submit-score-consistency",
  ],
};
