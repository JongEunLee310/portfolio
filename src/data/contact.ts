import { externalLinks } from "@/constants/externalLinks";
import type { ContactData } from "@/types/contact";

export const contactData: ContactData = {
  responsePromise: {
    title: "평균 응답 시간",
    value: "24시간 이내",
    description: "영업일 기준 대부분 24시간 이내에 답변드립니다.",
  },
  channels: [
    {
      label: "Email",
      value: "whddms1208@gmail.com",
      href: externalLinks.email,
      icon: "Mail",
      external: true,
    },
    {
      label: "GitHub",
      value: "github.com/JongEunLee310",
      href: externalLinks.github,
      icon: "Github",
      external: true,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/jong-eun-lee-5094ab240",
      href: externalLinks.linkedin,
      icon: "ExternalLink",
      external: true,
    },
    {
      label: "GitLab",
      value: "gitlab.com/SighingOwl",
      href: externalLinks.gitlab,
      icon: "ExternalLink",
      external: true,
    },
    {
      label: "이력서 다운로드",
      value: "PDF 파일로 이력서 받기",
      href: externalLinks.resumePdf,
      icon: "FileDown",
      external: true,
    },
  ],
  formFields: [
    {
      name: "name",
      label: "이름",
      type: "text",
      placeholder: "이름을 입력해주세요",
      required: true,
    },
    {
      name: "email",
      label: "이메일",
      type: "email",
      placeholder: "이메일 주소를 입력해주세요",
      required: true,
    },
    {
      name: "message",
      label: "메시지",
      type: "textarea",
      placeholder: "프로젝트에 대해 자세히 알려주세요.",
      required: true,
    },
  ],
  faq: [
    {
      question: "프로젝트 진행 절차가 어떻게 되나요?",
      answer:
        "요구사항을 먼저 정리한 뒤 범위와 우선순위를 나누고, 작은 단위로 설계와 구현을 반복하는 방식을 선호합니다.",
    },
  ],
  values: [
    {
      title: "문제 해결 중심",
      description:
        "단순 구현이 아니라 비즈니스 문제 해결을 목표로 기술적 솔루션을 제안합니다.",
      icon: "Gauge",
    },
  ],
};
