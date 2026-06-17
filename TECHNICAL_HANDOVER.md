# Technical Handover - Volume Day Trader

Prepared from repository evidence in `volume-day-trader` on branch `main`, plus deployment metadata supplied operationally by project owner.

Evidence policy used:
- Verified from repository: explicit in source/config/scripts/files in this checkout
- Inferred from code: derived from implementation behavior
- Operationally provided (not in repo): manually supplied deployment/runtime metadata
- Not Found in Repository: no verifiable evidence in this checkout

---

# Project Overview

## Purpose of the application

- Verified from repository: Three-part application:
  - `admin/` for internal administration
  - `landing-page/` for public site/blog/inquiry UI
  - `server/` for API, auth, inquiry handling, and blog APIs

## Main user types

- Verified from repository:
  - Public users browsing site/blogs and submitting inquiries
  - Admin users authenticating into dashboard and managing content/submissions

## Major modules/features

- Verified from repository:
  - Admin auth and password reset flows
  - Dashboard with contacts/blog management
  - Public blog listing/detail APIs
  - Inquiry submission API
  - Health endpoint and server boot scripts

---

# Workspace Structure

| Path | Role | Stack |
|------|------|-------|
| `admin/` | Admin SPA | React + Vite + TypeScript |
| `landing-page/` | Public frontend | Next.js App Router |
| `server/` | Backend API | Express 5 + MongoDB |

---

# Component Notes

## `admin/`

- Verified from repository:
  - Vite dev proxy routes `/api` to `http://localhost:5000`.
  - App uses guarded guest/protected routes in `src/app/router/index.tsx`.
  - Uses Redux and React Query for state/data operations.

## `landing-page/`

- Verified from repository:
  - `NEXT_PUBLIC_API_URL` drives API calls (`lib/api.ts`).
  - Inquiry form submits to `POST /inquiries`.
  - Public blog pages consume `/blogs` and `/blogs/:identifier`.

## `server/`

- Verified from repository:
  - Express API mounted under `/api`.
  - Route groups:
    - `/api/health`
    - `/api/auth/*`
    - `/api/inquiries`
    - `/api/blogs` (public)
    - `/api/admin/blogs` (admin)
  - Uses MongoDB via Mongoose and JWT auth.
  - Includes admin seed/reset and migration scripts.

---

# Environment Configuration

## Admin (`admin/.env.example`)

- Verified from repository:
  - `VITE_API_URL` (empty for local proxy flow)

## Landing (`landing-page/.env.example`)

- Verified from repository:
  - `NEXT_PUBLIC_API_URL` (expects `/api` suffix)

## Server (`server/.env.example`)

- Verified from repository:
  - Runtime and CORS: `PORT`, `CLIENT_URL`, `ADMIN_CLIENT_URL`
  - DB and auth: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`
  - Admin bootstrap: `ADMIN_EMAIL`, `ADMIN_PASSWORD`
  - Optional integrations: OpenAI, Cloudinary, Brevo, Gmail relay fields

Do not commit real secret values in `.env`.

---

# Deployment & Runtime

## Operationally provided (not in repository)

- Deployment mode: manual, managed on internal server
- VDT API: `http://64.227.173.140:5010/api/`
- VDT Admin: `http://64.227.173.140:5173/`
- VDT Landing:
  - `http://64.227.173.140:3010/`
  - `https://volumedaytrader-landing.vercel.app/`
- MongoDB database name in use: `vdt-stage` (credentials omitted)

## Verified from repository

| Topic | Status | Notes |
|------|--------|-------|
| Monorepo deployment guide | Not Found in Repository | No root deployment runbook file found |
| Docker | Not Found in Repository | No Dockerfiles found in project components |
| CI/CD workflows | Not Found in Repository | No `.github/workflows` found in this checkout |
| Vercel server config | Not Found in Repository | No `vercel.json` in `server/` |
| Ops/admin scripts | Verified from repository | `seed:admin`, `reset:admin-password`, migration scripts in `server/package.json` |

Secrets, passwords, and full credential-bearing connection strings are intentionally omitted from this document.

---

# Integrations

| Integration | Component(s) | Evidence |
|------------|---------------|----------|
| MongoDB | `server` | `mongoose` dependency and DB config |
| Cloudinary | `server` | env placeholders + dependency |
| OpenAI image/blog generation | `server` | env placeholders + scripts/services references |
| Brevo / SMTP email | `server` | docs + env fields + scripts |

---

# Known Risks / Technical Debt

| Item | Evidence |
|------|----------|
| Deployment automation not codified in repo | Manual deployment currently operational practice |
| Cross-app env coupling can cause integration issues | Admin and landing depend on aligned API URL/CORS configuration |
| Credential handling risk if copied into docs | Sensitive values exist operationally and must remain out of repo docs |

---

# Handover Checklist

| Item | Status |
|------|--------|
| Component READMEs (`admin`, `landing-page`, `server`) | Verified |
| Root technical handover | Verified |
| Environment variables documented | Verified |
| API/component boundaries documented | Verified |
| Deployment process fully documented | Partial |
| Manual deployment context captured | Verified (operationally provided) |
| Secrets/passwords excluded from docs | Verified |
| Infrastructure ownership documented | Partial |

