"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  text: string;
};

const projects = [
  {
    title: "구조물 점검 업무 자동화 프로그램",
    period: "2025",
    role: "1인 개발",
    brief:
      "한국도로공사 인턴 중 수작업을 자동화, GUI 통합, Threading으로 성능 개선, 실제 현장 납품",
    image: "/placeholder.jpg",
  },
  {
    title: "EX-점검로드 (구조물점검 길잡이)",
    period: "2025",
    role: "1인 풀스택",
    brief:
      "React Native 모바일 앱으로 현장 접근 경로·주차 정보 제공, 네비 인텐트, 지도 API 활용",
    image: "/placeholder.jpg",
  },
  {
    title: "청렴탐험대(실시간 협동 교육 게임)",
    period: "2025",
    role: "1인 풀스택",
    brief:
      "Phaser 3 + React로 웹 멀티플레이어 게임 구현, 소켓 동기화·씬 관리 최적화",
    image: "/placeholder.jpg",
  },
  {
    title: "카드 소비 데이터 분석 서비스",
    period: "2026",
    role: "팀 프로젝트",
    brief:
      "538만 행 카드 데이터 분석, InnoDB Cluster + Redis 캐싱, 병렬 쿼리 최적화",
    image: "/placeholder.jpg",
  },
  {
    title: "크로스 도메인 콘텐츠 추천 플랫폼",
    period: "2023",
    role: "팀 5명 · 프론트엔드 개발 + 백엔드 연동",
    brief:
      "영화·드라마·책·웹툰 추천, RecBole + Sentence-BERT, SSR 웹 서비스",
    image: "/placeholder.jpg",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        "안녕하세요! 포트폴리오 관련 질문을 해주세요. Spring AI 백엔드와 연결된 챗봇입니다.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const chatFetch = async (prompt: string) => {
    const res = await fetch("/api/v1/rag/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: prompt, model: "gpt-3.5-turbo", maxResults: 3 }),
    });
    if (!res.ok) {
      throw new Error(`서버 응답 오류: ${res.status}`);
    }
    const payload = await res.json();
    if (!payload.success) {
      throw new Error(payload.error || "Unknown chat error");
    }
    const answer =
      payload.data?.answer ||
      payload.data?.response ||
      payload.data?.message ||
      (typeof payload.data === "string" ? payload.data : "응답이 없습니다.");
    if (!answer) throw new Error("빈 응답입니다.");
    return answer;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    const userText = query.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setQuery("");
    setLoading(true);
    setError(null);

    try {
      const answer = await chatFetch(userText);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "알 수 없는 에러");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "죄송합니다. 대화 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const skillChips = useMemo(
    () => ["Next.js", "React", "TypeScript", "Spring Boot", "Tailwind CSS", "AI Chat"],
    []
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isChatOpen) {
        setIsChatOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen]);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10">
        <section className="rounded-2xl border border-zinc-300 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <h1 className="text-4xl font-bold tracking-tight">남인서 | Inseo Nam</h1>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300">
            기술로 현실의 문제를 해결하는 풀스택 개발자. 문제 발견부터 요구를 정의하고 실행하는 주도적 개발 경험 보유.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {skillChips.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-300 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <h2 className="text-2xl font-semibold">경력 및 학력</h2>
          <div className="mt-5 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                우리FISA 금융 클라우드 서비스 개발반 6기
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">2025.12 ~ 2026.06 (진행 중)</p>
              <ul className="mt-2 list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                <li>주요 프로젝트: 카드 소비 데이터 분석 서비스</li>
                <li>구현: Smart Terms UI 컴포넌트 라이브러리, 감사 로그 변조 탐지 Java 라이브러리 (HMAC 해시 체인), 생산자-소비자 패턴 식당 시뮬레이션 (Java 멀티스레딩), Spring OAuth2 인가 서버 + Next.js 클라이언트, MySQL Multi-Source Replication 실습</li>
                <li>React2Shell(CVE-2025-55182, CVSS 10.0) 보안 세미나 발표 — 우수상</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                한국도로공사 인턴 · 구조물안전부
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">2025</p>
              <ul className="mt-2 list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                <li>자동화 프로그램·EX-점검로드·청렴탐험대 개발</li>
                <li>혁신보고서: 데이터 연동 자동화 및 AI 기반 교량 상태 예측 개선 제안</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                GDSC (Google Developer Student Clubs)
              </h3>
              <ul className="mt-2 list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                <li>Earth.env 아이디어톤: 환경 인식 개선 퀴즈 서비스 기획 및 세미나 발표 (3인 팀)</li>
                <li>React.js 스터디 참여</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                성균관대학교 · 소프트웨어학과 복수전공
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">20XX 졸업</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-300 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <h2 className="text-2xl font-semibold">주요 프로젝트</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100"
              >
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <span className="text-zinc-500 text-sm">프로젝트 이미지</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold">{project.title}</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {project.period} · {project.role}
                </p>
                <p className="mt-3 text-sm leading-6">{project.brief}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100"
        aria-label="Open chat"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* Chat Modal */}
      {isChatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsChatOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-zinc-300 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsChatOpen(false)}
              className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              aria-label="Close chat"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              AI 포트폴리오 챗봇
            </h3>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              Spring AI 백엔드와 연결되어 있습니다. 포트폴리오 관련 질문을 자유롭게 입력하세요.
            </p>

            <div className="flex h-[300px] flex-col rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/60">
              <div className="mb-2 flex-1 overflow-y-auto pr-1">
                {messages.map((msg, idx) => (
                  <div key={`${msg.role}-${idx}`} className="mb-2">
                    <p
                      className={`inline-block rounded-xl px-3 py-2 text-sm leading-5 ${
                        msg.role === "user"
                          ? "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                          : "bg-zinc-800 text-white dark:bg-zinc-700/80"
                      }`}
                    >
                      {msg.role === "user" ? "You" : "AI"}: {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              <form className="mt-3 flex gap-2" onSubmit={onSubmit}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="질문을 입력하세요..."
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-600 dark:border-zinc-700 dark:bg-zinc-900"
                  aria-label="chat query"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-100"
                  disabled={loading}
                >
                  {loading ? "전송 중..." : "전송"}
                </button>
              </form>
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
