# Volume Day Trader - Admin App

React + Vite admin client for authentication, dashboard, contact submissions, and blog management.

## Stack

- React 19 + TypeScript
- Vite 8
- Redux Toolkit + React Query
- React Router
- Tailwind CSS

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

From `.env.example`:

- `VITE_API_URL`
  - Empty for local dev with Vite proxy (`/api` -> `http://localhost:5000`)
  - Set to full backend origin in production if needed

## Routing

- Guest: `/login`, `/forgot-password`, `/reset-password`
- Protected:
  - `/dashboard`
  - `/dashboard/contacts`
  - `/dashboard/blogs`
  - `/dashboard/blogs/create`
  - `/dashboard/blogs/view/:blogId`
  - `/dashboard/blogs/edit/:blogId`

## Deployment notes

- Deployment is currently manual and managed on an internal server.
- Current admin URL (provided operationally): `http://64.227.173.140:5173/`
- Do not store admin credentials in repository files.

