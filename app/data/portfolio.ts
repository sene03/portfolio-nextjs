export type SkillGroup = {
  label: string;
  items: string[];
};

export type ProjectMetaItem = {
  label: string;
  value: string;
};

export type ProjectSection = {
  title: string;
  body?: string[];
  bullets?: string[];
};

export type Project = {
  slug: string;
  order: number;
  title: string;
  summary: string;
  description: string;
  meta: ProjectMetaItem[];
  techStack: string[];
  sections: ProjectSection[];
  teamType?: string;
  links?: {
    github?: string;
    service?: string;
  };
  thumbnail?: string;
  images?: string[];
};

export type Experience = {
  title: string;
  period: string;
  details: string[];
};

export const profile = {
  nameKo: "남인서",
  nameEn: "Inseo Nam",
  headline: "기술로 현실의 문제를 해결하는 풀스택 개발자입니다.",
  intro:
    "한국도로공사 인턴 중 담당자들의 반복 업무를 자동화 프로그램으로 만들어 납품했고, 현장 점검자들의 불편을 직접 관찰해 모바일 앱을 기획·개발·배포했습니다. 대부분의 프로젝트는 지시가 아닌 문제 발견에서 시작했습니다.",
};

export const skillGroups: SkillGroup[] = [
  {
    label: "Language",
    items: ["Python", "TypeScript", "JavaScript", "Java"],
  },
  {
    label: "Frontend",
    items: ["React", "React Native", "Next.js"],
  },
  {
    label: "Backend",
    items: ["Node.js/Express", "FastAPI", "Spring Boot"],
  },
  {
    label: "Infra",
    items: ["AWS", "Docker"],
  },
];

export const projects: Project[] = [
  {
    slug: "fms-automation",
    order: 1,
    title: "구조물 점검 업무 자동화 프로그램",
    summary:
      "한국도로공사 인턴 중 직접 발굴·기획·개발·납품한 Python 자동화 프로그램",
    description:
      "시설물통합정보관리시스템(FMS)에서 반복되던 점검 기록 확인 업무를 자동화하며, 콘솔 도구에서 GUI 애플리케이션까지 점진적으로 발전시킨 프로젝트입니다.",
    meta: [
      { label: "기간", value: "2025 (인턴 기간 중)" },
      { label: "역할", value: "1인 개발" },
      { label: "형태", value: "데스크탑 GUI 애플리케이션" },
    ],
    teamType: "1인 개발",
    techStack: ["Python"],
    sections: [
      {
        title: "주요 구현",
        body: [
          "시설물통합정보관리시스템(FMS)에서 수백 개 교량·터널의 점검 기록을 수작업으로 확인하던 반복 업무를 자동화했다. 콘솔 프로그램 → 실시기한 알림 → 통합 GUI 앱으로 3단계에 걸쳐 사용성을 점진적으로 개선했다.",
        ],
        bullets: [
          "1단계: FMS 세션 쿠키 기반 크롤링, 기존 엑셀 서식(테두리·날짜 포맷·정렬) 유지하여 결과 저장",
          "2단계: 마감까지 남은 일수를 6단계(초과·당일·3일·1주·2주·1달)로 분류하여 색상 출력",
          "3단계: Selenium 자동 로그인, Tkinter GUI로 두 기능 통합, GUI-비즈니스 로직 완전 분리 (`Executor` 클래스가 작업 담당, GUI는 `executor.run()`만 호출), `threading`으로 백그라운드 실행하여 GUI 블로킹 방지",
        ],
      },
      {
        title: "Troubleshooting",
        bullets: [
          "실행 속도 12초 → 최적화: PyInstaller `--onefile` 빌드 시 압축 해제로 로그인 창 뜨기까지 12초 소요. Lazy Import(무거운 라이브러리를 필요한 시점에만 import) + threading 병렬 처리(드라이버 생성과 GUI 렌더링 동시 수행) + 드라이버 선행 접속(버튼 클릭 전 FMS 페이지 미리 로딩)의 3가지 조합으로 개선",
          "HTTP 200인데 세션 만료: FMS 서버는 로그인 실패 시에도 HTTP 200을 반환. 응답 HTML 내 특정 키워드(`\"자동 로그아웃\"`, `\"로그인 후 사용하시기 바랍니다\"`)를 직접 감지하여 `SessionExpiredError` 커스텀 예외를 설계하고 재로그인 흐름으로 처리",
        ],
      },
      {
        title: "성과",
        bullets: ["구조물안전부 담당자에게 시연·납품, 실제 업무에 적용 완료"],
      },
    ],
  },
  {
    slug: "ex-inspection-road",
    order: 2,
    title: "EX-점검로드 (구조물점검 길잡이)",
    summary:
      "교량·터널 점검자들의 현장 접근 경로·주차 정보를 통합 제공하는 모바일 앱 — 인턴 자체 제안 과제",
    description:
      "현장 점검자의 실제 불편을 관찰해 직접 제안하고 개발한 모바일 앱으로, 접근 경로와 내비게이션 실행 흐름을 하나로 묶은 프로젝트입니다.",
    meta: [
      { label: "기간", value: "2025 (인턴 기간 중)" },
      { label: "역할", value: "1인 풀스택" },
      { label: "플랫폼", value: "Android (iOS 대응 구조)" },
    ],
    teamType: "1인 풀스택",
    techStack: [
      "React Native (Expo)",
      "TypeScript",
      "Node.js",
      "Express",
      "MySQL",
      "Prisma ORM",
      "AWS Lightsail",
    ],
    sections: [
      {
        title: "기획 배경",
        body: [
          "인턴 중 점검 담당자들이 겪는 두 가지 문제를 직접 관찰했다. ① 교량·터널 상·하부 접근 위치가 지도에 표시되지 않아 현장 도착 전 파악이 어렵고, ② 도심 교량 하부 점검 시 주차 정보가 없어 현장에서 시간을 낭비하는 경우가 빈번했다. 앱 개발을 직접 제안하여 과제로 채택됐다.",
        ],
      },
      {
        title: "주요 구현",
        bullets: [
          "시설물 목록 조회와 관리 주체 기반 필터링",
          "교량 상·하부 접근 주소와 좌표를 탭 UI로 분리하고 주소 복사 제공",
          "Android `geo:` Intent를 통해 설치된 지도 앱으로 원터치 내비게이션 연결",
        ],
      },
      {
        title: "Troubleshooting",
        bullets: [
          "SDK 버전 충돌 — 공식 문서 불일치: Expo SDK 53은 react-native-maps v1.20.1까지 지원하나, 공식 문서의 API Key 주입 코드는 v1.22 이상 전제. GitHub Issues·커뮤니티·버전별 구문서를 직접 비교 분석하여 `plugins` 배열 방식 대신 `android.config`/`ios.config`에 native config를 직접 주입하는 방식으로 해결",
          "이미지 동적 로딩 한계: React Native에서 `require(dynamicPath)` 방식 동적 로딩 불가. CDN URL로 서버에서 받아오는 방식을 초기 설계에 포함시켰어야 했다는 교훈 — 배포 우선순위 판단 실수로 불필요한 반복 작업 발생",
        ],
      },
      {
        title: "성과",
        bullets: ["Android Preview APK 빌드 및 설치 완료"],
      },
    ],
  },
  {
    slug: "honesty-game",
    order: 3,
    title: "청렴탐험대 (구해줘! 청렴 탐험대)",
    summary:
      "초등학생 대상 웹 기반 실시간 멀티플레이어 교육 게임으로, 국민권익위원회 공모전 1차 심사를 통과했습니다.",
    description:
      "교사가 방 코드를 만들고 학생들이 브라우저로 바로 접속하는 구조의 실시간 협동 교육 게임입니다.",
    meta: [
      { label: "기간", value: "2025 (인턴 기간 중)" },
      { label: "역할", value: "1인 풀스택" },
      { label: "플랫폼", value: "웹 (브라우저, 별도 설치 불필요)" },
      { label: "배포", value: "honestygame.pages.dev" },
    ],
    teamType: "1인 풀스택",
    links: { service: "https://honestygame.pages.dev" },
    techStack: [
      "React 19",
      "TypeScript",
      "Phaser 3",
      "Vite",
      "socket.io-client",
      "Node.js",
      "Express",
      "Socket.io",
    ],
    sections: [
      {
        title: "주요 구현",
        body: [
          "3~6인이 한 팀이 되어 6개 청렴 가치(정직·약속·배려·책임·절제·공정) 퀘스트를 수행하는 실시간 협동 게임. 교사가 방 코드를 생성하고 학생들이 브라우저에서 바로 접속하는 구조.",
        ],
        bullets: [
          "React + Phaser 역할 분리: 로비·입장 UI는 React, 게임 씬은 Phaser 3 담당. `PhaserContainer.tsx`가 React 내부에서 `new Phaser.Game(config)` 마운트, `SocketContext`(React Context API)로 소켓 인스턴스 전역 관리 후 `game.registry.set('socket', socket)`으로 Phaser에 주입",
          "실시간 멀티플레이: `player_moved` 이벤트로 이동 좌표·방향 실시간 전파, 씬 전환 후 `get_all_players` 콜백으로 전체 플레이어 재동기화. 서버는 `students`(대기실)와 `players`(게임 중)를 분리하는 인메모리 Room 구조 설계",
          "네트워크 최적화: 위치 변화량·방향 변경·50ms 인터벌(최대 20Hz) 3가지 조건을 모두 충족할 때만 `player_moved` emit하여 불필요한 소켓 이벤트 방지",
        ],
      },
      {
        title: "Troubleshooting",
        bullets: [
          "씬 전환 시 플레이어 스프라이트 소멸: Phaser가 씬 전환 시 이전 씬의 모든 GameObject를 destroy() → `MultiplayerManager` 인스턴스를 `game.registry`에 저장하여 씬 간 공유하고, `changeScene()` 메서드에서 씬 참조만 교체 후 서버에서 플레이어 목록을 다시 받아 스프라이트 재생성",
          "소켓 이벤트 중복 등록: 씬 재방문 시 리스너 중복 등록으로 MainScene 이동이 두 번 발생 → 씬 해제 시점에 `socket.off()`로 cleanup 필수임을 체감",
          "React-Phaser 소켓 주입 타이밍: 소켓 초기값 `null` 상태에서 Phaser 시작 시 `registry.get('socket')`이 null로 오는 간헐적 버그 → `PhaserContainer.tsx`의 useEffect 의존성 배열에 `socket` 포함, 소켓 연결 완료 후 게임 인스턴스 생성",
        ],
      },
      {
        title: "성과",
        bullets: ["2025 국민참여 청렴콘텐츠 공모전 1차 심사 통과"],
      },
    ],
  },
  {
    slug: "card-consumption-analysis",
    order: 4,
    title: "카드 소비 데이터 분석 서비스",
    summary:
      "실제 카드 소비 데이터 538만 행을 활용해 라이프스테이지별 소비 패턴을 분석하는 웹 서비스 팀 프로젝트입니다.",
    description:
      "대용량 데이터와 읽기/쓰기 분리 구조를 다루며 성능과 안정성을 함께 고민한 백엔드 중심 프로젝트입니다.",
    meta: [
      { label: "기간", value: "2026 (우리FISA 과정 중)" },
      { label: "역할", value: "팀 프로젝트" },
      {
        label: "아키텍처",
        value: "Nginx → Tomcat WAS × 2 → MySQL InnoDB Cluster + Redis",
      },
    ],
    teamType: "팀 프로젝트",
    techStack: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Redis",
      "Docker",
      "Nginx",
      "HikariCP",
      "CompletableFuture",
    ],
    sections: [
      {
        title: "주요 구현",
        bullets: [
          "InnoDB Cluster와 MySQL Router로 읽기/쓰기 분리 및 자동 Failover 구성",
          "Redis Cache-Aside와 분산 락으로 Cache Stampede 방지",
          "CompletableFuture와 전용 스레드 풀로 병렬 쿼리를 수행하고 HikariCP를 Source/Replica로 분리",
        ],
      },
    ],
  },
  {
    slug: "cross-domain-recommendation",
    order: 5,
    title: "크로스 도메인 콘텐츠 추천 플랫폼",
    summary:
      "영화·드라마·책·웹툰 4개 도메인을 통합한 개인화 추천 웹 서비스입니다.",
    description:
      "추천 모델 비교와 인증 흐름 설계, 통합 인덱스 우회 전략까지 경험한 캡스톤 프로젝트입니다.",
    meta: [
      { label: "기간", value: "2023" },
      { label: "역할", value: "팀 5명 · 프론트엔드 개발 + 백엔드 연동" },
      { label: "플랫폼", value: "웹 (SSR)" },
    ],
    teamType: "팀 5명",
    techStack: [
      "Python",
      "FastAPI",
      "MySQL",
      "RecBole",
      "Sentence-BERT",
      "PyTorch",
      "AWS Lightsail",
      "JWT",
    ],
    sections: [
      {
        title: "주요 구현",
        bullets: [
          "FastAPI 라우터 설계: `user`(회원가입·로그인·탈퇴), `content`(콘텐츠 조회·좋아요), `recommend`(추천 결과 반환) 3개 라우터로 분리",
          "JWT 인증 흐름 설계: OAuth2PasswordBearer로 토큰 발급, `access_token`·사용자 정보를 쿠키에 저장하여 페이지 이동 간 인증 상태 유지. 비밀번호 암호화 처리 위치, 토큰 저장 방식 등 인증 관련 요소를 처음부터 직접 조사·설계",
          "통합 인덱스 처리: 영화·드라마·책·웹툰의 DB 스키마가 달라 통합 인덱싱 불가 → `contents_idx.json`에 전체 콘텐츠 제목·카테고리를 통합 관리하고, 요청 시 인덱스로 카테고리를 특정한 뒤 해당 DB에서 조회하는 방식으로 우회",
          "SSR + 동적 데이터 혼합: Jinja2 템플릿으로 정적 페이지 렌더링, 추천 결과 등 동적 데이터는 `<meta>` 태그에 서버 데이터를 담아 jQuery로 읽는 방식으로 클라이언트 사이드 렌더링 병행",
        ],
      },
      {
        title: "Troubleshooting",
        bullets: [
          "추론 지연 3분 → 캐싱으로 개선 시도: 매 요청마다 RecBole 모델을 새로 실행하여 약 3분의 로딩 지연 발생. 로그인 시점에 한 번만 추론을 실행하고 결과를 캐싱하는 구조로 개선",
          "카테고리별 DB 분리 설계의 한계: 초기 설계 시 도메인별로 테이블을 분리하여 통합 인덱싱·동명 콘텐츠 처리에 어려움 발생. `contents_idx.json` 파일로 우회했으나, 단일 테이블에 카테고리 컬럼을 두는 설계가 더 적합했을 것이라는 점을 개발 과정에서 직접 인식",
        ],
      },
    ],
  },
  {
    slug: "codeshare",
    order: 6,
    title: "Codeshare",
    summary:
      "강사와 수강생 간 코드를 실시간으로 공유하고 단계별로 전환할 수 있는 수업 전용 웹 서비스",
    description:
      "반복적이고 구조화된 수업 환경에 맞는 실시간 코드 공유 흐름을 직접 설계한 1인 개발 프로젝트입니다.",
    meta: [
      { label: "역할", value: "1인 개발" },
      { label: "플랫폼", value: "웹" },
      { label: "배포", value: "Vercel" },
    ],
    teamType: "1인 개발",
    techStack: ["Next.js", "Firebase (Firestore)", "TypeScript"],
    sections: [
      {
        title: "기획 배경",
        body: [
          "기존 코드쉐어 서비스들은 일회성 세션 링크 방식으로 운영되어 수업이라는 반복적·구조화된 환경에 적합하지 않았다. 특히 \"1단계 코드 → 2단계 코드 → 완성 코드\"처럼 흐름이 있는 설명을 하려면 매번 새 링크를 생성하거나 코드를 덮어써야 했고, 20명 이상 수강생이 있는 수업에서는 혼란이 가중됐다.",
        ],
      },
      {
        title: "주요 구현",
        bullets: [
          "스냅샷 기능: 현재 코드 상태를 저장하고, 저장된 스냅샷 목록에서 원하는 시점의 코드로 즉시 전환",
          "실시간 동기화: Firestore 실시간 리스너를 활용해 강사가 코드를 수정하면 수강생 화면에 즉시 반영",
          "피드백 기반 기능 추가: 실제 수업 운영 중 수집한 요구사항으로 단축키·파일 확장자 인식 기능 추가 개발 - github issues로 기능 제안 및 버그 관리",
        ],
      },
      {
        title: "성과",
        bullets: [
          "20명 이상이 참여한 실제 수업에서 직접 활용",
          "스냅샷 기능으로 강사가 코드 흐름을 단계별로 전환하며 수업 진행 가능",
        ],
      },
    ],
  },
];

export const experiences: Experience[] = [
  {
    title: "우리FISA 금융 클라우드 서비스 개발반 6기",
    period: "2025.12 ~ 2026.06 (진행 중)",
    details: [
      "주요 프로젝트: 카드 소비 데이터 분석 서비스 (Projects 참고)",
      "구현: Smart Terms UI 컴포넌트 라이브러리, 감사 로그 변조 탐지 Java 라이브러리 (HMAC 해시 체인), 생산자-소비자 패턴 식당 시뮬레이션 (Java 멀티스레딩), Spring OAuth2 인가 서버 + Next.js 클라이언트, MySQL Multi-Source Replication 실습",
      "프론트엔드 세미나 발표(React2Shell) — 우수상",
      "백엔드 세미나 발표(대용량 트래픽 대응하기) — 우수상",
    ],
  },
  {
    title: "한국도로공사 인턴 · 구조물안전부",
    period: "2025.05 ~ 2025.11",
    details: [
      "자동화 프로그램·EX-점검로드",
      "혁신보고서: 데이터 연동 자동화 및 AI 기반 교량 상태 예측 개선 제안",
    ],
  },
  {
    title: "성균관대학교 · 물리학과, 소프트웨어학과 복수전공",
    period: "2019.03 ~ 2025.02",
    details: [],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
