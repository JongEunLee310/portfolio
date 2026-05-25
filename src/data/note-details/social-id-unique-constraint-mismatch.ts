import type { TechnicalNoteDetail } from "@/types/note";
import { socialIdUniqueConstraintMismatch } from "../notes/social-id-unique-constraint-mismatch";
import {
  TROUBLESHOOTING_NOTE_TEMPLATE,
  troubleshootingHeading,
  troubleshootingToc,
} from "./_helpers";

export const socialIdUniqueConstraintMismatchDetail: TechnicalNoteDetail = {
  ...socialIdUniqueConstraintMismatch,
  template: TROUBLESHOOTING_NOTE_TEMPLATE.name,
  toc: troubleshootingToc,
  content: [
    troubleshootingHeading(0),
    {
      type: "paragraph",
      content:
        "auth_service의 User 모델에서 OAuth 제공자의 사용자 식별자(social_id)를 저장하는 컬럼에 단독 unique 제약을 걸었습니다. 그런데 실제 사용자 조회 로직은 social_id와 social_provider를 함께 조건으로 사용합니다. DB 제약과 애플리케이션 조회 로직이 서로 다른 기준을 사용하고 있는 구조적 불일치였습니다.",
    },
    {
      type: "paragraph",
      content:
        "Google 제공자(social_id: '12345')와 다른 제공자(social_id: '12345')가 같은 ID 값을 가지면, 애플리케이션 로직은 이를 다른 사용자로 처리하려 하지만 DB가 unique 제약 위반으로 삽입을 거부합니다. ADR(docs/ADR/auth/002-google-oauth-single-provider-first.md)의 설계 의도가 모델과 마이그레이션에 반영되지 않은 사례입니다.",
    },
    troubleshootingHeading(1),
    {
      type: "list",
      items: [
        "User 모델 설계 당시 Google OAuth 단일 제공자만 고려했습니다. 제공자가 하나뿐이면 social_id가 전체 사용자에서 유일하므로 단독 unique 제약이 충분하다고 판단했습니다.",
        "그러나 google_social_handler.py의 조회 로직은 처음부터 social_provider를 함께 필터링하는 방식으로 작성되어, 다중 제공자 확장을 전제한 구조였습니다.",
        "결정(ADR)과 구현(모델 코드, 마이그레이션)이 동기화되지 않아, DB 제약은 단독 unique를 강제하는 반면 애플리케이션은 복합 조건으로 조회하는 불일치가 발생했습니다.",
      ],
    },
    troubleshootingHeading(2),
    {
      type: "cards",
      items: [
        {
          title: "단독 unique 인덱스 제거",
          description:
            "auth_model.py에서 social_id 컬럼의 unique=True를 제거하고, __table_args__에 UniqueConstraint로 복합 제약을 정의합니다.",
          badge: "모델 수정",
        },
        {
          title: "Alembic 마이그레이션 순서 준수",
          description:
            "기존 ix_users_social_id unique 인덱스를 먼저 삭제한 뒤, (social_id, social_provider) 복합 unique 제약을 생성합니다. 순서를 바꾸면 마이그레이션이 실패합니다.",
          badge: "마이그레이션",
        },
        {
          title: "ADR과 구현 동기화",
          description:
            "설계 결정(ADR)에서 정한 복합 유니크 기준을 모델 코드와 마이그레이션에 동시에 반영합니다. 이후 설계가 바뀔 때도 ADR → 모델 → 마이그레이션 순으로 함께 수정합니다.",
          badge: "정합성 원칙",
        },
      ],
    },
    troubleshootingHeading(3),
    {
      type: "paragraph",
      content:
        "auth_model.py에서 social_id 컬럼의 unique=True를 제거하고, __table_args__에 UniqueConstraint로 복합 제약을 정의합니다. Alembic 마이그레이션은 인덱스 제거 → 복합 제약 생성 순으로 작성합니다.",
    },
    {
      type: "code",
      language: "python",
      filename: "auth_model.py",
      code: "from sqlalchemy import UniqueConstraint\n\nclass User(Base):\n    __tablename__ = 'users'\n    __table_args__ = (\n        UniqueConstraint('social_id', 'social_provider', name='uq_social_id_provider'),\n    )\n\n    id              = Column(Integer, primary_key=True, index=True)\n    email           = Column(String, unique=True, index=True, nullable=False)\n    name            = Column(String, nullable=True)\n    social_provider = Column(String, nullable=False, index=True)\n    social_id       = Column(String, nullable=False, index=True)  # unique=True 제거\n    created_at      = Column(DateTime, server_default=func.now())",
    },
    troubleshootingHeading(4),
    {
      type: "metrics",
      items: [
        {
          label: "DB 제약",
          before: "social_id 단독 unique",
          after: "(social_id, social_provider) 복합 unique",
          change: "설계 의도 반영",
        },
        {
          label: "다중 제공자 지원",
          before: "같은 ID 값 충돌 발생",
          after: "제공자가 다르면 정상 처리",
          change: "확장성 확보",
        },
        {
          label: "핸들러 조회 로직 정합성",
          before: "DB 제약과 불일치",
          after: "일치",
          change: "구조 정합",
        },
      ],
    },
    troubleshootingHeading(5),
    {
      type: "callout",
      variant: "success",
      content:
        "DB 제약과 애플리케이션 조회 로직이 일치해 정합성이 확보됐습니다. 다중 OAuth 제공자가 추가될 때 같은 social_id 값 충돌을 DB 레벨에서 방지할 수 있습니다. ADR에 기록된 설계 의도가 모델과 마이그레이션에 동시에 반영됐습니다.",
    },
    troubleshootingHeading(6),
    {
      type: "callout",
      variant: "warning",
      content:
        "조회 로직이 복합 조건을 사용한다면 DB 제약도 같은 복합 조건으로 맞추는 것이 원칙입니다. 애플리케이션에서 걸러낼 수 있다고 DB 제약을 단순화하면, 애플리케이션 로직 버그 발생 시 데이터 정합성 보호 수단이 없어집니다. 모델 설계 결정(ADR)과 실제 구현(모델 코드, 마이그레이션)이 동기화되지 않으면 이런 불일치가 발생합니다.",
    },
  ],
  relatedNoteSlugs: [
    "google-oauth-exception-masking",
    "llm-response-format-not-enforced",
  ],
};
