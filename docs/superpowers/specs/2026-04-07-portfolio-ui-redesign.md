# Portfolio UI Redesign — Design Spec

**Date:** 2026-04-07

## Overview

포트폴리오 메인 페이지에 상단 네비게이션 바, 프로젝트 썸네일 + 모달 상세, Experiences & Education 타임라인을 추가한다. 모노톤(zinc palette) 기조 유지.

---

## 1. Architecture

`app/page.tsx`는 Server Component 유지. 클라이언트 기능만 컴포넌트로 분리.

**새로 추가되는 파일:**
- `app/components/NavBar.tsx` — `"use client"`, sticky 네비게이션
- `app/components/ProjectModal.tsx` — `"use client"`, 프로젝트 상세 모달

**삭제되는 파일:**
- `app/projects/[slug]/page.tsx` (모달로 대체)
- `app/projects/` 디렉토리

**수정되는 파일:**
- `app/page.tsx` — NavBar import, section id 추가, 프로젝트 카드 버튼화, 타임라인 재구성
- `app/data/portfolio.ts` — 타입 확장, 데이터 수정

---

## 2. Data Model Changes (`app/data/portfolio.ts`)

### Project 타입 확장

```ts
export type Project = {
  // 기존 필드 유지
  slug: string;
  order: number;
  title: string;
  summary: string;
  description: string;
  meta: ProjectMetaItem[];
  techStack: string[];
  sections: ProjectSection[];
  // 새로 추가
  teamType?: string;           // "1인 개발", "팀 5명" 등
  links?: {
    github?: string;
    service?: string;
  };
  thumbnail?: string;          // public/ 경로, 없으면 placeholder
  images?: string[];           // 작업 화면 스크린샷 경로들
};
```

### experiences 데이터 수정

GDSC, 데이터분석학회(TNT) 항목 제거. 남기는 항목:
1. 우리FISA 금융 클라우드 서비스 개발반 6기
2. 한국도로공사 인턴 · 구조물안전부
3. 성균관대학교 · 물리학과, 소프트웨어학과 복수전공

---

## 3. NavBar

**컴포넌트:** `app/components/NavBar.tsx` (`"use client"`)

- `position: sticky; top: 0` — 스크롤 시 상단 고정
- 배경: `bg-white/80 backdrop-blur-sm`, 하단 보더: `border-b border-zinc-200`
- 좌측: `남인서` 텍스트 (로고 대용)
- 우측 링크: `About · Skills · Experience · Projects`
- 클릭 시 해당 `<section id="...">` 로 `scrollIntoView({ behavior: 'smooth' })`
- 모바일: 링크 텍스트 `text-xs` 로 축소, hamburger 없이 유지

**page.tsx 변경:** 각 섹션에 id 추가
- 히어로 섹션 → `id="about"`
- Skills 섹션 → `id="skills"`
- Experience 섹션 → `id="experience"`
- Projects 섹션 → `id="projects"`

---

## 4. Project Cards + Thumbnail

**썸네일:**
- 카드 상단 `h-40 rounded-[20px] bg-zinc-100 overflow-hidden`
- `thumbnail` 필드 있으면 `<Image>` 렌더링, 없으면 회색 placeholder 유지
- 나중에 `thumbnail: "/images/projects/slug.png"` 경로 추가로 교체 가능

**카드 클릭:**
- 기존 `<Link href="/projects/slug">` → `<button onClick={() => openModal(project)}>` 으로 교체
- hover 스타일 동일하게 유지

---

## 5. ProjectModal

**컴포넌트:** `app/components/ProjectModal.tsx` (`"use client"`)

- `<dialog>` 엘리먼트 기반
- 배경 overlay: `bg-black/40 backdrop-blur-sm`
- 패널: `max-w-3xl`, 흰 배경, 내부 스크롤 (`overflow-y-auto max-h-[90vh]`)
- 닫기: 우상단 `×` 버튼, 배경 클릭, ESC 키 (dialog 네이티브)

**모달 내부 레이아웃:**

```
[프로젝트 제목]                          [× 닫기]
[기간]  [teamType 배지]

[GitHub 바로가기 버튼]  [서비스 바로가기 버튼]   ← links 있는 경우만

──────────────────────────────────────────
[tech stack 배지들]
──────────────────────────────────────────

[summary 텍스트]
[description 텍스트]

📌 섹션 제목
  단락 텍스트 (body)
  · bullet
  · bullet

🛠 Troubleshooting
  · bullet

✅ 성과
  · bullet

🖥 작업 화면                              ← images 있는 경우만
  [이미지 그리드]
```

**섹션 아이콘 매핑 (섹션 title 기준):**
- `기획 배경` → 📌
- `주요 구현` → 🔨
- `Troubleshooting` → 🛠
- `성과` → ✅
- 그 외 → 📄

---

## 6. Experiences & Education Timeline

**타이틀:** `Experiences & Education` (섹션 헤딩 교체)

**레이아웃:**
- 좌측 세로 라인: `border-l-2 border-zinc-200`
- 각 항목: 좌측 점(`●`, `w-3 h-3 rounded-full bg-zinc-900`), 제목, 기간, 세부 내용
- 카테고리 배지 없음 — 단일 타임라인

**데이터:** GDSC, TNT 제거 후 3개 항목만 렌더링

---

## 7. Route Cleanup

- `app/projects/[slug]/page.tsx` 삭제
- `app/projects/` 디렉토리 삭제
- `generateStaticParams` 제거로 빌드 설정 단순화

---

## Non-Goals

- 다크 모드
- 챗 기능 변경
- 컬러 accent 추가
- hamburger 메뉴
