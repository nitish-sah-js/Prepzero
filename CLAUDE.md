# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PrepZero is a placement testing and proctoring platform built with Next.js 16 (App Router). It supports three user roles (SUPER_ADMIN, COLLEGE_ADMIN, STUDENT) managing colleges, placement drives, tests, and proctored test attempts with code execution via Judge0.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:push      # Sync Prisma schema to database
npm run db:generate  # Regenerate Prisma client (after schema changes)
npm run db:seed      # Seed database with test data (tsx prisma/seed.ts)
```

Judge0 (code execution engine for coding questions):
```bash
docker compose up -d   # Start Judge0 services (server, workers, postgres, redis)
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router, React 19, TypeScript 5
- **Prisma 7** with PostgreSQL (Neon cloud DB)
- **Better Auth** for session-based authentication with email/password
- **shadcn/ui** (new-york style) + Tailwind CSS 4 + Radix UI
- **Judge0** (Docker) for sandboxed code execution (Python, Java, C, C++)
- **Monaco Editor** for in-browser coding questions

### Route Structure
- `src/app/(auth)/` — Public auth pages (login, register)
- `src/app/(dashboard)/admin/` — Super admin dashboard
- `src/app/(dashboard)/college/` — College admin dashboard
- `src/app/(dashboard)/student/` — Student dashboard
- `src/app/api/` — REST API routes (attempts, auth, colleges, drives, stats)

### Key Modules
- `src/lib/auth.ts` — Better Auth config with Prisma adapter; extends User with `role` and `collegeId` fields
- `src/lib/auth-client.ts` — Client-side auth helpers
- `src/lib/auth-guard.ts` — Server-side helpers: `getSession()`, `requireAuth()`, `requireRole(role)`, `getRoleRedirect(role)`
- `src/lib/judge0.ts` — Code execution: `executeCode()` for single runs, `executeBatch()` for test case validation with polling
- `src/lib/prisma.ts` — Prisma client singleton
- `src/middleware.ts` — Route protection; checks `better-auth.session_token` cookie, redirects unauthenticated users to `/login`
- `src/hooks/use-proctoring.ts` — Client-side proctoring hook tracking tab switches, fullscreen exits, copy/paste, right-click, keyboard shortcuts

### Database Schema
Defined in `prisma/schema.prisma`. Prisma client output goes to `src/generated/prisma`. Key models: User, College, PlacementDrive, Test, Question (supports SINGLE_SELECT, MULTI_SELECT, CODING), TestAttempt (tracks proctoring violations), Answer, TestCase. Import types from `@/generated/prisma`.

### Authentication & Authorization
- Middleware checks session cookie on all non-public routes
- Role-based access: API routes filter by user role and `collegeId`
- Role redirects: SUPER_ADMIN → `/admin`, COLLEGE_ADMIN → `/college`, STUDENT → `/student`

### Conventions
- Path alias: `@/*` maps to `src/*`
- Pages default to React Server Components; use `"use client"` only when needed
- Server pages query Prisma directly; client mutations go through API routes
- Forms use React Hook Form + Zod for validation
- shadcn/ui components live in `src/components/ui/`; add new ones via `npx shadcn@latest add <component>`
- `src/components/test/test-interface.tsx` is the core test-taking component (proctoring, timer, question rendering, code editor, submission)

### Environment Variables
Required in `.env`: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`, `JUDGE0_API_URL` (default `http://localhost:2358` for local Docker). Optional: `JUDGE0_API_KEY` (only for RapidAPI-hosted Judge0).
