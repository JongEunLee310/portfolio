import { publicPath } from "@/utils/publicPath";

export const siteConfig = {
  name: "이종은 Portfolio",
  shortName: "LJE",
  logoText: "<LJE/>",
  logo: {
    light: publicPath("/images/hero/logo-hero-light.svg"),
    dark: publicPath("/images/hero/logo-hero-dark.svg"),
  },
  owner: {
    name: "이종은",
    role: "백엔드 개발자",
    email: "whddms1208@gmail.com",
    location: "대한민국, 서울",
  },
  headline: "문제를 관찰하고, 구조를 개선하는 개발자",
  description:
    "서비스의 기능 구현부터 시스템의 성능과 확장성, 운영까지 고려하며 더 나은 구조를 만드는 백엔드 개발자입니다.",
  copyright: "© 2026 이종은. All rights reserved.",
};
