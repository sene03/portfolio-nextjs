# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Architecture Overview

### Data Flow

All portfolio content is defined as TypeScript constants in `app/data/portfolio.ts` — there is no CMS or database. The file exports `profile`, `skillGroups`, `projects`, `experiences`, and the `getProjectBySlug` helper. To add or edit content, modify this file directly.

### Routes

- `/` → `app/page.tsx` — Server Component. Imports data directly from `app/data/portfolio.ts` and renders the full portfolio layout (hero, skills sidebar, experience timeline, project cards).
- `/projects/[slug]` → `app/projects/[slug]/page.tsx` — Statically generated via `generateStaticParams()` which maps `projects[].slug`. Uses `getProjectBySlug(slug)` and calls `notFound()` for unknown slugs.

### Chat Feature

`app/page.helpers.ts` contains the chat message types (`ChatMessage`, `ChatRole`) and helpers (`getInitialMessages`, `appendMessage`, `extractChatAnswer`, `getFriendlyErrorMessage`, `getFallbackAssistantMessage`). These support a chat UI that sends requests to the Spring backend at `POST /api/v1/chat/query` with `{ query, model? }`. The `extractChatAnswer` function normalises the backend response by probing `answer`, `response`, `message`, and `content` fields in `payload.data`.

`app/lib/api.ts` provides `checkServerHealth()` and `getServerHealthDetails()` against `GET /api/v1/health`.

### Styling

The UI is monochrome (zinc palette) with no colour accents. `app/page.tsx` uses rounded-[28px] cards with a subtle drop shadow pattern; `app/projects/[slug]/page.tsx` uses sharp square borders for a document-style contrast. Do not mix the two visual languages between routes.
