# Volume Day Trader - Landing Page

Public Next.js website for marketing content, public blogs, and inquiry submission.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- i18next

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

From `.env.example`:

- `NEXT_PUBLIC_API_URL` (include `/api` suffix)

Used for:
- Public blogs (`GET /blogs`, `GET /blogs/:identifier`)
- Contact form submission (`POST /inquiries`)

## Main routes (examples)

- `/`
- `/blogs`
- `/blogs/[slug]`
- `/privacy-policy`
- `/terms-and-conditions`

## Deployment notes

- Deployment is currently manual and managed on an internal server.
- Current landing URLs (provided operationally):
  - `http://64.227.173.140:3010/`
  - `https://volumedaytrader-landing.vercel.app/`

