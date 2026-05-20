export const aboutProfileInfoLabels = {
  name: "이름",
  role: "직무",
  experience: "경력",
  location: "위치",
  email: "이메일",
} as const;

export const aboutArchDiagram = {
  entryFlow: [
    "Client/Web",
    "Amazon CloudFront",
    "Amazon API Gateway",
  ],
  services: [
    {
      title: "서비스 A",
      type: "서버리스",
      resources: ["AWS Lambda", "Amazon DynamoDB"],
    },
    {
      title: "서비스 B",
      type: "컨테이너",
      resources: ["Amazon ECS (Fargate)", "Amazon Aurora (DB)"],
    },
    {
      title: "서비스 C",
      type: "비동기 이벤트",
      resources: ["Amazon SQS / EventBridge", "AWS Lambda (배경 작업)"],
    },
  ],
  arrows: {
    right: "→",
    down: "↓",
  },
} as const;
