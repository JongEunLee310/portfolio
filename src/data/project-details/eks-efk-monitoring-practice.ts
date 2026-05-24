import { publicPath } from "@/utils/publicPath";
import type { ProjectDetail } from "@/types/project";
import { eksEfkMonitoringPractice } from "../projects/eks-efk-monitoring-practice";

export const eksEfkMonitoringPracticeDetail: ProjectDetail = {
  ...eksEfkMonitoringPractice,
  heroImage: publicPath("/images/projects/eks-efk-monitoring/hero.png"),
  heroHighlights: [
    { label: "기간", value: "5주", icon: "Calendar" },
    { label: "구성 범위", value: "EKS + EFK + Alert", icon: "Network" },
    { label: "학습 초점", value: "Kubernetes 운영 기초", icon: "ServerCog" },
  ],
  overview:
    "AWS 환경에서 Kubernetes 기반 서비스를 운영하기 위한 기본 구조를 익히기 위해 진행한 인프라 실습 프로젝트이다. VPC 내부에 퍼블릭/프라이빗 서브넷을 구성하고 Amazon EKS 클러스터를 배포한 뒤, 프라이빗 서브넷의 워커 노드에서 nginx 웹 서비스를 실행했다. 이후 Fluentd, ElasticSearch, Kibana로 구성된 EFK 스택을 배포하여 컨테이너 로그를 수집·저장·시각화했고, Amazon CloudWatch, SNS, Lambda, KMS, Slack을 연결해 CPU 사용량 임계치 초과 시 알림이 전달되는 모니터링 흐름을 구축했다. 실서비스 규모의 프로젝트라기보다 EKS, Kubernetes 리소스, 로그 수집, 알림 체계를 손으로 익힌 운영 입문형 프로젝트이다.",
  problem: {
    title: "Kubernetes 운영 환경을 이해하기 위한 인프라 실습 필요",
    items: [
      "AWS에서 Kubernetes 클러스터를 직접 구성해본 경험이 부족했다.",
      "EKS에서 컨트롤 플레인과 워커 노드의 역할, Deployment와 Service의 관계를 실제 배포 흐름으로 이해할 필요가 있었다.",
      "컨테이너 환경에서는 Pod가 재시작되거나 종료될 수 있으므로 로그 수집과 조회 체계가 필요했다.",
      "리소스 사용량이 임계치를 넘었을 때 사람이 콘솔을 확인하기 전에 알림을 받을 수 있는 흐름이 필요했다.",
    ],
  },
  solution: {
    title: "EKS 기반 서비스 배포와 운영 관측 흐름 구성",
    items: [
      "VPC를 2개 가용 영역으로 나누고 퍼블릭/프라이빗 서브넷을 구성했다.",
      "워커 노드를 프라이빗 서브넷에 배치하고 nginx를 Deployment로 배포했다.",
      "Service를 통해 외부 접근 경로를 구성했다.",
      "Fluentd를 DaemonSet으로 배포해 각 워커 노드의 로그를 수집했다.",
      "ElasticSearch에 로그를 저장하고 Kibana에서 인덱스 패턴과 시간대별 로그 조회를 구성했다.",
      "CloudWatch Alarm, SNS, Lambda, KMS, Slack Webhook을 연결해 CPU 임계치 초과 알림을 전송했다.",
    ],
  },
  architecture: {
    title: "EKS 기반 로깅 및 알림 아키텍처",
    description:
      "Amazon EKS에서 nginx 웹 서비스를 실행하고, EFK 스택으로 로그를 수집·시각화하며, CloudWatch 기반 알림을 Slack으로 전달하는 운영 실습 구조이다.",
    nodes: [
      {
        id: "eks",
        title: "Amazon EKS Cluster",
        items: [
          "2개 가용 영역 기반 Kubernetes 클러스터 구성",
          "프라이빗 서브넷의 워커 노드에서 nginx 실행",
          "Deployment와 Service로 애플리케이션 배포",
        ],
        icon: "Boxes",
      },
      {
        id: "efk",
        title: "EFK Logging Stack",
        items: [
          "Fluentd DaemonSet으로 노드 로그 수집",
          "ElasticSearch에 로그 저장",
          "Kibana에서 인덱스 패턴 기반 검색 및 시각화",
        ],
        icon: "Search",
      },
      {
        id: "cloudwatch-alert",
        title: "CloudWatch Alert Pipeline",
        items: [
          "CloudWatch Alarm으로 CPU 지표 감시",
          "SNS로 이벤트 전달",
          "Lambda를 통해 Slack 알림 전송",
        ],
        icon: "Bell",
      },
      {
        id: "secure-notification",
        title: "Secure Notification",
        items: [
          "Slack Webhook URL을 KMS로 암호화",
          "Lambda 실행 역할에 KMS 복호화 권한 부여",
          "민감 URL을 평문으로 직접 사용하지 않도록 구성",
        ],
        icon: "ShieldCheck",
      },
    ],
  },
  architectureFlow: {
    title: "EKS 운영 관측 흐름",
    description:
      "웹 서비스 배포, 로그 수집, 로그 시각화, 리소스 알림이 하나의 운영 흐름으로 연결된다.",
    groups: [
      {
        id: "clients",
        title: "사용자 / 외부",
        nodes: [
          {
            id: "external-user",
            title: "External User",
            items: ["nginx 웹 서비스 접근", "Kibana 로그 화면 접근"],
            icon: "User",
          },
          {
            id: "slack",
            title: "Slack",
            items: ["CPU 임계치 초과 알림 수신", "알람 이름, 리소스, 발생 시간, 원인 확인"],
            icon: "MessageSquare",
          },
        ],
      },
      {
        id: "gateway",
        title: "Gateway",
        nodes: [
          {
            id: "load-balancer",
            title: "Load Balancer / Service",
            items: ["nginx, Kibana, ElasticSearch 접근 경로 노출", "NodePort 또는 LoadBalancer 타입 활용"],
            icon: "Route",
          },
          {
            id: "bastion-nat",
            title: "Bastion Host / NAT Instance",
            items: [
              "퍼블릭 서브넷 배치",
              "프라이빗 워커 노드 접근 및 아웃바운드 경로 보조",
              "비용 절감을 위해 NAT Gateway 대신 NAT Instance로 활용",
            ],
            icon: "Server",
          },
        ],
      },
      {
        id: "services",
        title: "Services",
        nodes: [
          {
            id: "nginx-service",
            title: "Nginx Deployment",
            items: ["nginx 컨테이너를 Deployment로 배포", "replicas 2 구성", "Service를 통해 외부 노출"],
            icon: "Globe",
          },
          {
            id: "fluentd",
            title: "Fluentd DaemonSet",
            items: [
              "각 워커 노드에서 로그 수집",
              "hostPath 기반 로그 디렉터리 마운트",
              "ServiceAccount, ClusterRole, ClusterRoleBinding 권한 구성",
            ],
            icon: "FileSearch",
          },
        ],
      },
      {
        id: "data",
        title: "Data",
        nodes: [
          {
            id: "elasticsearch",
            title: "ElasticSearch",
            items: ["Fluentd가 전달한 로그 저장", "로그 색인 생성", "Kibana 조회 대상"],
            icon: "Database",
          },
        ],
      },
      {
        id: "infra-integrations",
        title: "Infra / Integrations",
        nodes: [
          {
            id: "eks-cluster",
            title: "Amazon EKS",
            items: ["관리형 Kubernetes 클러스터", "워커 노드를 프라이빗 서브넷에 배치", "Auto Scaling Group과 연결"],
            icon: "Boxes",
          },
          {
            id: "kibana",
            title: "Kibana",
            items: ["인덱스 패턴 생성", "시간대별 로그 검색 및 시각화", "nginx 접근 로그 확인"],
            icon: "BarChart3",
          },
          {
            id: "cloudwatch",
            title: "Amazon CloudWatch",
            items: ["EC2 CPUUtilization 지표 감시", "1분 평균 CPU 50% 초과 기준 경보 구성"],
            icon: "Activity",
          },
          {
            id: "sns",
            title: "Amazon SNS",
            items: ["CloudWatch 경보 이벤트 수신", "Lambda 구독 대상으로 메시지 발행"],
            icon: "Radio",
          },
          {
            id: "lambda",
            title: "AWS Lambda",
            items: ["SNS 이벤트로 실행", "Slack 메시지 포맷 생성 및 전송", "KMS로 Webhook URL 복호화"],
            icon: "Zap",
          },
          {
            id: "kms",
            title: "AWS KMS",
            items: ["Slack Webhook URL 암호화", "Lambda 실행 시 복호화 권한 필요"],
            icon: "KeyRound",
          },
        ],
      },
    ],
    connections: [
      { from: "external-user", to: "load-balancer", tone: "sync", label: "HTTP 접근" },
      { from: "load-balancer", to: "nginx-service", tone: "sync", label: "서비스 라우팅" },
      { from: "nginx-service", to: "fluentd", tone: "data", label: "컨테이너 로그" },
      { from: "fluentd", to: "elasticsearch", tone: "data", label: "로그 전달" },
      { from: "elasticsearch", to: "kibana", tone: "data", label: "색인 조회" },
      { from: "external-user", to: "kibana", tone: "sync", label: "로그 검색" },
      { from: "eks-cluster", to: "cloudwatch", tone: "data", label: "리소스 지표" },
      { from: "cloudwatch", to: "sns", tone: "async", label: "Alarm 이벤트" },
      { from: "sns", to: "lambda", tone: "async", label: "메시지 발행" },
      { from: "lambda", to: "kms", tone: "sync", label: "Webhook URL 복호화" },
      { from: "lambda", to: "slack", tone: "async", label: "알림 전송" },
    ],
    legends: [
      { label: "동기 요청", tone: "solid" },
      { label: "비동기 이벤트", tone: "dashed" },
      { label: "데이터 흐름", tone: "muted" },
    ],
  },
  features: [
    {
      title: "EKS 클러스터 배포",
      description:
        "AWS VPC 내부에 2개 가용 영역을 구성하고 Amazon EKS 클러스터와 워커 노드를 배포했다.",
      icon: "Boxes",
    },
    {
      title: "Kubernetes 리소스 배포",
      description:
        "nginx 웹 서비스를 Pod 단위가 아닌 Deployment와 Service 정의 파일로 배포하며 Kubernetes 리소스 구조를 학습했다.",
      icon: "FileCode",
    },
    {
      title: "EFK 로그 수집",
      description:
        "Fluentd를 DaemonSet으로 배포해 워커 노드 로그를 수집하고 ElasticSearch에 저장했다.",
      icon: "FileSearch",
    },
    {
      title: "Kibana 로그 시각화",
      description:
        "Kibana에서 인덱스 패턴을 생성하고 nginx 접근 로그를 시간대별로 조회했다.",
      icon: "BarChart3",
    },
    {
      title: "CloudWatch Slack 알림",
      description:
        "CPU 사용량이 50%를 초과하면 CloudWatch, SNS, Lambda를 통해 Slack으로 알림을 전송했다.",
      icon: "Bell",
    },
  ],
  techStackGroups: [
    {
      title: "Backend",
      items: [{ name: "Nginx", category: "backend" }],
    },
    {
      title: "Infra & DevOps",
      items: [
        { name: "AWS VPC", category: "infra" },
        { name: "Amazon EKS", category: "infra" },
        { name: "Kubernetes", category: "infra" },
        { name: "EC2", category: "infra" },
        { name: "Bastion Host", category: "infra" },
        { name: "NAT Instance", category: "infra" },
        { name: "AWS Lambda", category: "infra" },
        { name: "eksctl", category: "tool" },
        { name: "kubectl", category: "tool" },
      ],
    },
    {
      title: "Messaging",
      items: [{ name: "Amazon SNS", category: "messaging" }],
    },
    {
      title: "Data",
      items: [{ name: "ElasticSearch", category: "observability" }],
    },
    {
      title: "Observability",
      items: [
        { name: "Fluentd", category: "observability" },
        { name: "Kibana", category: "observability" },
        { name: "Amazon CloudWatch", category: "observability" },
      ],
    },
    {
      title: "Security",
      items: [
        { name: "AWS KMS", category: "infra" },
        { name: "IAM Policy", category: "infra" },
      ],
    },
  ],
  screenshots: [
    {
      title: "EKS 네트워크 아키텍처",
      image: publicPath("/images/projects/eks-efk-monitoring/architecture.png"),
      description:
        "2개 가용 영역, 퍼블릭/프라이빗 서브넷, Bastion/NAT Instance, EKS 워커 노드 구성을 나타낸 아키텍처",
    },
    {
      title: "EFK 로그 수집 구조",
      image: publicPath("/images/projects/eks-efk-monitoring/efk-flow.png"),
      description:
        "Fluentd가 워커 노드 로그를 수집하고 ElasticSearch, Kibana로 이어지는 로그 분석 흐름",
    },
    {
      title: "Kibana 로그 조회 화면",
      image: publicPath("/images/projects/eks-efk-monitoring/kibana-discover.png"),
      description:
        "nginx 접근 로그를 Kibana Discover에서 시간대별로 조회한 화면",
    },
    {
      title: "CloudWatch 경보 화면",
      image: publicPath("/images/projects/eks-efk-monitoring/cloudwatch-alarm.png"),
      description:
        "CPUUtilization 임계치 초과 여부를 CloudWatch Alarm에서 확인한 화면",
    },
    {
      title: "Slack 알림 수신 화면",
      image: publicPath("/images/projects/eks-efk-monitoring/slack-alert.png"),
      description:
        "CloudWatch 경보가 SNS, Lambda를 거쳐 Slack 메시지로 전달된 결과",
    },
  ],
  contributions: [
    {
      date: "2022.07",
      title: "EKS 클러스터 및 네트워크 구성",
      description:
        "VPC, 퍼블릭/프라이빗 서브넷, Bastion Host/NAT Instance, EKS 워커 노드 배치를 설계하고 nginx 서비스를 배포했다.",
    },
    {
      date: "2022.07 ~ 2022.08",
      title: "EFK 스택 구축",
      description:
        "Fluentd, ElasticSearch, Kibana를 Kubernetes 리소스로 배포하고 로그 수집, 저장, 시각화 흐름을 구성했다.",
    },
    {
      date: "2022.08",
      title: "CloudWatch 기반 알림 연동",
      description:
        "CloudWatch Alarm, SNS, Lambda, KMS, Slack Webhook을 연결해 CPU 임계치 초과 알림을 검증했다.",
    },
  ],
  troubleshooting: [
    {
      title: "EKS 워커 노드 서브넷 배치 문제",
      problem:
        "eksctl로 클러스터를 생성할 때 워커 노드가 의도한 프라이빗 서브넷이 아닌 퍼블릭 서브넷에 생성되는 문제가 있었다.",
      solution:
        "--vpc-private-subnets, --ssh-access, --ssh-public-key, --managed 옵션을 명시해 관리형 노드 그룹과 프라이빗 서브넷 배치를 구성했다.",
      result:
        "EKS 워커 노드가 프라이빗 서브넷에서 동작하도록 구성하고, Bastion Host를 통해 접근하는 구조를 이해했다.",
      noteSlug: "",
    },
    {
      title: "Fluentd 로그 수집 권한 문제",
      problem:
        "Fluentd DaemonSet이 로그를 수집해야 했지만 Kubernetes 리소스 조회와 로그 경로 접근 권한 구성이 부족해 로그가 정상 수집되지 않았다.",
      solution:
        "hostPath로 로그 디렉터리를 마운트하고, ServiceAccount, ClusterRole, ClusterRoleBinding을 구성해 필요한 권한을 부여했다.",
      result:
        "각 워커 노드에서 Fluentd가 로그를 수집하고 ElasticSearch로 전달하는 흐름을 구성했다.",
      noteSlug: "",
    },
    {
      title: "Lambda의 KMS 복호화 실패",
      problem:
        "Slack Webhook URL을 KMS로 암호화했지만 Lambda가 복호화하지 못해 Slack 알림 전송이 실패했다.",
      solution:
        "Lambda 실행 역할에 kms:Decrypt 권한을 추가하고, Lambda 함수 이름을 Encryption Context로 포함해 암호화·복호화 흐름을 맞췄다.",
      result:
        "CPU 임계치 초과 시 CloudWatch 경보가 Slack 메시지로 전달되는 것을 확인했다.",
      noteSlug: "",
    },
  ],
  improvements: [
    {
      title: "워커 노드 Private Subnet 배치",
      description:
        "워커 노드를 퍼블릭 서브넷에 두면 외부에서 직접 접근될 수 있어, 프라이빗 서브넷에 배치하고 Bastion Host를 통해서만 접근하도록 구성했다.",
      result:
        "서비스 실행 노드를 외부에서 직접 노출하지 않는 기본적인 네트워크 격리 구조를 익혔다.",
      icon: "Shield",
    },
    {
      title: "NAT Gateway 대신 NAT Instance 활용",
      description:
        "프라이빗 서브넷 워커 노드의 아웃바운드 경로가 필요했지만 NAT Gateway는 실습 프로젝트에서 비용 부담이 있어 Bastion Host를 NAT Instance로 겸용했다.",
      result:
        "추가 비용 없이 아웃바운드 경로를 확보하며 NAT 동작 방식을 직접 이해했다.",
      icon: "Wallet",
    },
    {
      title: "DaemonSet 기반 로그 수집",
      description:
        "Pod 단위로 로그를 수집하면 Pod 재시작 시 로그가 유실될 수 있어 Fluentd를 DaemonSet으로 배포하고 hostPath로 노드 로그 디렉터리를 마운트했다.",
      result:
        "노드 단위 로그 수집 구조를 구성하며 Kubernetes 로깅 패턴의 기본 접근 방식을 이해했다.",
      icon: "ServerCog",
    },
    {
      title: "RBAC 기반 Fluentd 권한 구성",
      description:
        "Fluentd가 Kubernetes API로 Pod 메타데이터를 조회하지 못해 로그 수집이 실패했다. ServiceAccount, ClusterRole, ClusterRoleBinding을 구성해 필요한 권한만 부여했다.",
      result:
        "로그 수집 권한 문제를 해결하며 Kubernetes RBAC 구성 방식을 실습했다.",
      icon: "ShieldCheck",
    },
    {
      title: "KMS 기반 Webhook URL 보호",
      description:
        "Slack Webhook URL을 Lambda 환경 변수에 평문으로 저장하면 노출 위험이 있어 KMS로 암호화하고 Lambda 실행 시 복호화하도록 구성했다.",
      result:
        "민감 정보를 코드나 환경 변수에 직접 두지 않는 보안 관리 방식을 경험했다.",
      icon: "KeyRound",
    },
  ],
  performance: [
    {
      label: "EKS 클러스터 구성",
      value: "운영 구조 이해",
      description: "VPC, 서브넷, 워커 노드 배치를 직접 구성하며 컨트롤 플레인과 데이터 플레인의 역할을 실습으로 이해했다.",
      icon: "Boxes",
    },
    {
      label: "Kubernetes 리소스 운영",
      value: "핵심 리소스 경험",
      description: "Deployment, Service, DaemonSet, ServiceAccount, ClusterRole을 직접 작성하며 각 리소스가 해결하는 운영 문제를 파악했다.",
      icon: "ServerCog",
    },
    {
      label: "EFK 로그 파이프라인",
      value: "수집·시각화 완성",
      description: "Fluentd DaemonSet으로 노드 로그를 수집하고 ElasticSearch에 저장한 뒤 Kibana에서 시간대별 조회까지 이어지는 흐름을 구축했다.",
      icon: "FileSearch",
    },
    {
      label: "CloudWatch 알림 자동화",
      value: "알림 파이프라인 구성",
      description: "CPU 임계치 초과 시 CloudWatch, SNS, Lambda를 거쳐 Slack으로 알림이 전달되는 흐름을 직접 연결하며 모니터링 자동화를 경험했다.",
      icon: "Bell",
    },
    {
      label: "민감 정보 보호",
      value: "KMS 암호화 적용",
      description: "Slack Webhook URL을 평문으로 사용하지 않고 KMS로 암호화·복호화하는 구성을 통해 보안 고려 인프라 운영을 익혔다.",
      icon: "KeyRound",
    },
  ],
  retrospectives: [
    {
      title: "회고",
      learned: [
        "EKS는 Kubernetes를 완전히 숨겨주는 서비스가 아니라, 컨트롤 플레인을 관리형으로 제공하고 사용자가 워커 노드와 리소스 배포 구조를 이해해야 제대로 운영할 수 있다는 점을 배웠다.",
        "Pod, Deployment, Service, DaemonSet, ServiceAccount, ClusterRole 같은 Kubernetes 리소스가 각각 어떤 운영 문제를 해결하기 위해 존재하는지 실습으로 이해했다.",
        "로그 수집은 단순히 파일을 모으는 작업이 아니라, 장애 분석과 사용 패턴 파악을 위한 데이터 파이프라인이라는 점을 체감했다.",
        "모니터링은 그래프를 보는 것에서 끝나지 않고, 임계치 기반 알림과 대응 흐름까지 연결되어야 운영 가치가 생긴다는 점을 배웠다.",
        "Webhook URL처럼 민감한 값은 KMS로 암호화하고, Lambda 실행 역할에는 필요한 최소 권한을 부여해야 한다는 보안 관점을 익혔다.",
      ],
      improvement: [
        "ElasticSearch를 Deployment가 아닌 StatefulSet으로 배포하고 Persistent Volume을 연결해 상태 저장 서비스에 맞는 구조로 개선한다.",
        "Fluentd의 hostPath 의존을 줄이고, 로그 수집 경로와 보존 정책을 더 명확히 정의한다.",
        "CloudWatch 알림을 CPU뿐 아니라 메모리, 디스크, 네트워크, Pod 상태 등으로 확장한다.",
        "수동 스케일링이 아니라 HPA, Cluster Autoscaler와 연계해 경보 이후 자동 대응 흐름을 실험한다.",
        "eksctl 명령 중심 구성에서 Terraform 또는 Helm 기반 재현 가능한 IaC 구성으로 발전시킨다.",
      ],
      noteSlug: "",
    },
  ],
  relatedNoteSlugs: [],
};
