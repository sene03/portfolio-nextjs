# Portfolio UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포트폴리오에 sticky 네비게이션 바, 프로젝트 썸네일 + 모달 상세, Experiences & Education 타임라인을 추가한다.

**Architecture:** `app/page.tsx`는 Server Component 유지. 클라이언트 인터랙션(nav scroll, modal)은 별도 Client Component로 분리. 프로젝트 카드와 모달 상태는 `ProjectsSection` Client Component가 관리하고, page.tsx는 data를 prop으로 전달한다.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS, `<dialog>` native API

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `app/data/portfolio.ts` | Project 타입 확장, experiences 정리 |
| Delete | `app/projects/` | 모달로 대체되므로 제거 |
| Create | `app/components/NavBar.tsx` | sticky 헤더, 앵커 스크롤 |
| Create | `app/components/ProjectModal.tsx` | `<dialog>` 기반 프로젝트 상세 모달 |
| Create | `app/components/ProjectsSection.tsx` | 카드 그리드 + 모달 상태 관리 |
| Modify | `app/page.tsx` | NavBar 삽입, section id 추가, 타임라인 교체, ProjectsSection 사용 |

---

## Task 1: portfolio.ts — 타입 확장 및 데이터 정리

**Files:**
- Modify: `app/data/portfolio.ts`

- [ ] **Step 1: Project 타입에 필드 추가**

`app/data/portfolio.ts`의 `Project` 타입을 아래로 교체:

```ts
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
```

- [ ] **Step 2: 각 project 객체에 teamType 추가**

각 project 객체에 `teamType` 필드 추가. `meta` 배열의 `역할` 값과 동일하게 맞춘다:

```ts
// fms-automation
teamType: "1인 개발",

// ex-inspection-road
teamType: "1인 풀스택",

// honesty-game
teamType: "1인 풀스택",
links: { service: "https://honestygame.pages.dev" },

// card-consumption-analysis
teamType: "팀 프로젝트",

// cross-domain-recommendation
teamType: "팀 5명",

// codeshare
teamType: "1인 개발",
```

- [ ] **Step 3: experiences 배열에서 GDSC, TNT 제거**

`app/data/portfolio.ts`의 `experiences` 배열을 아래로 교체 (3개 항목만 유지):

```ts
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
```

- [ ] **Step 4: 타입 체크**

```bash
cd /Users/inseo/workspace/fisa/portfolio/portfolio-nextjs
pnpm build 2>&1 | head -40
```

Expected: 타입 에러 없음. (현재 `/projects/[slug]/page.tsx`가 삭제 전이라 빌드 에러 없어야 함)

- [ ] **Step 5: Commit**

```bash
git add app/data/portfolio.ts
git commit -m "feat: extend Project type and clean up experiences data"
```

---

## Task 2: 기존 `/projects/[slug]` 라우트 삭제

**Files:**
- Delete: `app/projects/`

- [ ] **Step 1: 디렉토리 삭제**

```bash
rm -rf /Users/inseo/workspace/fisa/portfolio/portfolio-nextjs/app/projects
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm build 2>&1 | head -40
```

Expected: 에러 없음. (`page.tsx`에서 아직 `/projects/${project.slug}` link를 사용 중이지만, 이건 Task 6에서 수정된다. 빌드는 통과해야 함)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "remove /projects/[slug] route — replaced by modal"
```

---

## Task 3: NavBar 컴포넌트 생성

**Files:**
- Create: `app/components/NavBar.tsx`

- [ ] **Step 1: components 디렉토리 생성 및 NavBar 파일 작성**

`app/components/NavBar.tsx`를 아래 내용으로 생성:

```tsx
"use client";

const NAV_ITEMS = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
] as const;

export function NavBar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <button
          onClick={() => scrollTo("about")}
          className="text-sm font-semibold tracking-tight text-zinc-950 transition hover:text-zinc-500"
        >
          남인서
        </button>
        <nav className="flex items-center gap-5 sm:gap-7">
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-xs font-medium text-zinc-500 transition hover:text-zinc-950 sm:text-sm"
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm build 2>&1 | head -40
```

Expected: 타입 에러 없음.

- [ ] **Step 3: Commit**

```bash
git add app/components/NavBar.tsx
git commit -m "feat: add NavBar component with smooth scroll"
```

---

## Task 4: ProjectModal 컴포넌트 생성

**Files:**
- Create: `app/components/ProjectModal.tsx`

- [ ] **Step 1: ProjectModal 파일 작성**

`app/components/ProjectModal.tsx`를 아래 내용으로 생성:

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { Project } from "../data/portfolio";

const SECTION_ICONS: Record<string, string> = {
  "기획 배경": "📌",
  "주요 구현": "🔨",
  "Troubleshooting": "🛠",
  "성과": "✅",
};

function getSectionIcon(title: string): string {
  return SECTION_ICONS[title] ?? "📄";
}

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project]);

  if (!project) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      onClose();
    }
  };

  const period = project.meta.find((m) => m.label === "기간")?.value;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-[28px] bg-white p-0 shadow-[0_40px_100px_rgba(15,23,42,0.15)] backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="overflow-y-auto max-h-[90vh] px-6 py-7 sm:px-8 sm:py-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              {project.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {period && (
                <span className="text-sm text-zinc-400">{period}</span>
              )}
              {project.teamType && (
                <span className="rounded-full bg-zinc-100 px-3 py-0.5 text-xs text-zinc-600">
                  {project.teamType}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-1 shrink-0 rounded-full p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-950"
            aria-label="닫기"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12.854 3.146a.5.5 0 0 1 0 .708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 0 1 .708-.708L8 7.293l4.146-4.147a.5.5 0 0 1 .708 0z" />
            </svg>
          </button>
        </div>

        {/* Links */}
        {project.links && (project.links.github || project.links.service) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-950 hover:text-white"
              >
                GitHub 바로가기
              </a>
            )}
            {project.links.service && (
              <a
                href={project.links.service}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-950 hover:text-white"
              >
                서비스 바로가기
              </a>
            )}
          </div>
        )}

        {/* Divider + Tech Stack */}
        <div className="my-5 h-px bg-zinc-100" />
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((stack) => (
            <span
              key={stack}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600"
            >
              {stack}
            </span>
          ))}
        </div>
        <div className="my-5 h-px bg-zinc-100" />

        {/* Summary / Description */}
        <div className="space-y-3">
          <p className="text-sm font-medium leading-7 text-zinc-800 sm:text-base">
            {project.summary}
          </p>
          <p className="text-sm leading-7 text-zinc-500">
            {project.description}
          </p>
        </div>

        {/* Sections */}
        <div className="mt-6 space-y-6">
          {project.sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
                <span role="img" aria-hidden="true">
                  {getSectionIcon(section.title)}
                </span>
                {section.title}
              </h3>
              {section.body && (
                <div className="space-y-2">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-7 text-zinc-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {section.bullets && (
                <ul className="space-y-2 text-sm leading-7 text-zinc-600">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2">
                      <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Screenshot images */}
        {project.images && project.images.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
              <span role="img" aria-hidden="true">🖥</span>
              작업 화면
            </h3>
            <p className="text-xs text-zinc-400">
              이미지를 클릭하면 크게 볼 수 있습니다.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {project.images.map((src, i) => (
                <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                  <img
                    src={src}
                    alt={`${project.title} 화면 ${i + 1}`}
                    className="rounded-xl border border-zinc-200 object-cover transition hover:opacity-80"
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm build 2>&1 | head -40
```

Expected: 타입 에러 없음.

- [ ] **Step 3: Commit**

```bash
git add app/components/ProjectModal.tsx
git commit -m "feat: add ProjectModal component with dialog"
```

---

## Task 5: ProjectsSection 컴포넌트 생성

**Files:**
- Create: `app/components/ProjectsSection.tsx`

이 컴포넌트는 `page.tsx`에서 project 카드 그리드를 이동시키고, 모달 open/close 상태를 관리한다. `page.tsx`는 Server Component이므로 `useState`를 쓸 수 없어 Client Component로 분리.

- [ ] **Step 1: ProjectsSection 파일 작성**

`app/components/ProjectsSection.tsx`를 아래 내용으로 생성:

```tsx
"use client";

import { useState } from "react";
import type { Project } from "../data/portfolio";
import { ProjectModal } from "./ProjectModal";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  return (
    <section id="projects" className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Projects
        </h2>
        <p className="text-sm leading-7 text-zinc-500">
          각 프로젝트는 카드 UI로 구성하고, 클릭하면 상세 내용을 확인할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {sorted.map((project) => (
          <button
            key={project.slug}
            onClick={() => setSelectedProject(project)}
            className="group rounded-[28px] border border-zinc-200 bg-white text-left shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
          >
            {/* Thumbnail */}
            <div className="h-40 overflow-hidden rounded-t-[28px] bg-zinc-100">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">
                  Project {String(project.order).padStart(2, "0")}
                </p>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-500 transition group-hover:bg-zinc-900 group-hover:text-white">
                  View
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {project.title}
                </h3>
                <p className="text-sm leading-7 text-zinc-700">
                  {project.summary}
                </p>
                <p className="text-sm leading-7 text-zinc-500">
                  {project.description}
                </p>
              </div>

              <div className="mt-6 grid gap-2 text-sm text-zinc-500">
                {project.meta.slice(0, 2).map((item) => (
                  <div
                    key={`${project.slug}-${item.label}`}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3"
                  >
                    <span>{item.label}</span>
                    <span className="text-right text-zinc-700">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.slice(0, 4).map((stack) => (
                  <span
                    key={`${project.slug}-${stack}`}
                    className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm build 2>&1 | head -40
```

Expected: 타입 에러 없음.

- [ ] **Step 3: Commit**

```bash
git add app/components/ProjectsSection.tsx
git commit -m "feat: add ProjectsSection with modal state management"
```

---

## Task 6: page.tsx 업데이트

**Files:**
- Modify: `app/page.tsx`

page.tsx를 아래 내용으로 전면 교체한다. 변경 사항:
- `NavBar` 추가 (main 위)
- 히어로 섹션에 `id="about"` 추가
- 사이드바 aside에 `id="skills"` 추가
- Experience 섹션을 "Experiences & Education" 세로 타임라인으로 교체 (`id="experience"`)
- Projects 섹션을 `<ProjectsSection>` 으로 교체

- [ ] **Step 1: page.tsx 전체 교체**

`app/page.tsx` 전체를 아래로 교체:

```tsx
import { experiences, profile, projects, skillGroups } from "./data/portfolio";
import { NavBar } from "./components/NavBar";
import { ProjectsSection } from "./components/ProjectsSection";

const maxSkillCount = Math.max(...skillGroups.map((group) => group.items.length));

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-sm leading-7 text-zinc-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">

          {/* Hero */}
          <section
            id="about"
            className="rounded-[28px] border border-zinc-200 bg-white px-6 py-7 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:px-8 sm:py-8"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                  Portfolio
                </p>
                <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl lg:text-6xl">
                  {profile.nameKo}
                  <span className="ml-3 text-zinc-400">{profile.nameEn}</span>
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-700">
                  {profile.headline}
                </p>
                <p className="max-w-3xl text-sm leading-7 text-zinc-500 sm:text-base">
                  {profile.intro}
                </p>
              </div>

              <div className="grid gap-3 rounded-[24px] border border-zinc-200 bg-zinc-50 p-5 sm:min-w-[18rem]">
                <div className="space-y-1">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-zinc-400">
                    Contact Hero
                  </p>
                  <p className="text-sm leading-6 text-zinc-600">
                    이름과 소개를 중심으로 구성한 상단 Hero 섹션입니다.
                  </p>
                </div>
                <div className="h-px bg-zinc-200" />
                <div className="grid gap-2 text-sm text-zinc-600">
                  <p>Projects {projects.length}</p>
                  <p>Experience {experiences.length}</p>
                  <p>Skills {skillGroups.length}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
            {/* Sidebar */}
            <aside id="skills" className="space-y-6">
              <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <div className="space-y-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                    Basic Info
                  </p>
                  <div className="h-20 w-px bg-zinc-200" />
                  <div className="space-y-3">
                    <p className="text-lg font-semibold tracking-tight text-zinc-950">
                      About Me
                    </p>
                    <p className="text-sm leading-7 text-zinc-600">
                      반복 업무를 자동화하고, 현장의 불편을 제품으로 바꾸는
                      방식으로 문제를 풀어왔습니다.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
                <SectionHeading
                  title="Skills"
                  subtitle="Notion 스타일의 간결한 진행도 바 형태로 재구성했습니다."
                />
                <div className="mt-6 space-y-5">
                  {skillGroups.map((group) => {
                    const percent = Math.round(
                      (group.items.length / maxSkillCount) * 100,
                    );
                    return (
                      <div key={group.label} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-zinc-700">
                            {group.label}
                          </p>
                          <p className="text-xs text-zinc-400">{percent}%</p>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-zinc-900"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <p className="text-xs leading-6 text-zinc-500">
                          {group.items.join(" · ")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </aside>

            {/* Main content */}
            <div className="space-y-8">
              {/* Experiences & Education */}
              <section
                id="experience"
                className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-8"
              >
                <SectionHeading title="Experiences & Education" />
                <div className="relative mt-8">
                  <div className="absolute bottom-0 left-0 top-0 w-px bg-zinc-200" />
                  <div className="space-y-8 pl-8">
                    {experiences.map((experience) => (
                      <div key={experience.title} className="relative">
                        <div className="absolute -left-[2.125rem] top-1.5 h-3 w-3 rounded-full bg-zinc-900 ring-2 ring-white" />
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold tracking-tight text-zinc-950">
                            {experience.title}
                          </h3>
                          <p className="text-sm text-zinc-400">
                            {experience.period}
                          </p>
                        </div>
                        {experience.details.length > 0 && (
                          <ul className="mt-3 space-y-1.5 text-sm leading-7 text-zinc-600">
                            {experience.details.map((detail) => (
                              <li
                                key={`${experience.title}-${detail}`}
                                className="flex gap-2"
                              >
                                <span className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-zinc-300" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Projects */}
              <ProjectsSection projects={projects} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
pnpm build 2>&1 | head -60
```

Expected: 빌드 성공, 에러 없음.

- [ ] **Step 3: 개발 서버에서 시각 확인**

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 열어 확인:
- [ ] 상단 sticky NavBar 보임 (남인서 + About·Skills·Experience·Projects)
- [ ] 각 링크 클릭 시 해당 섹션으로 스크롤
- [ ] 프로젝트 카드 상단에 회색 썸네일 영역 보임
- [ ] 카드 클릭 시 모달 열림
- [ ] 모달 내 제목, 기간, teamType 배지, 기술 스택, 섹션 내용 표시
- [ ] `×` 버튼, 배경 클릭, ESC로 모달 닫힘
- [ ] honesty-game 카드 클릭 시 모달에 "서비스 바로가기" 링크 보임
- [ ] Experiences & Education 섹션에 세로 타임라인 3개 항목 표시

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add NavBar, modal-based projects, and experiences timeline"
```

---

## 완료 기준

- `pnpm build` 성공 (타입 에러, lint 에러 없음)
- NavBar sticky, 앵커 스크롤 동작
- 프로젝트 카드 → 모달 열기/닫기 동작 (×, 배경, ESC)
- Experiences & Education 타임라인 3개 항목
- `/projects/*` 라우트 제거 (404 반환)
