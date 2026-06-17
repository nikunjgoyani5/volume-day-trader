# Volume Day Trader — API Server

Node.js / Express backend for the Volume Day Trader landing site and admin panel. It provides admin authentication (JWT), password reset via email (Brevo), and a health check endpoint.

## Tech stack

- **Runtime:** Node.js (CommonJS)
- **Framework:** Express 5
- **Database:** MongoDB via Mongoose
- **Auth:** JWT (`jsonwebtoken`) + bcrypt password hashing
- **Email:** Brevo (API or SMTP via `nodemailer`)

## Prerequisites

- Node.js 18+ recommended
- MongoDB running locally or a remote `MONGODB_URI`
- [Brevo](https://www.brevo.com/) account (only if you need forgot-password emails)

## Quick start

From the `server` directory:

```bash
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB URI, JWT secret, and admin credentials. Then:

```bash
# Create the first admin (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env)
npm run seed:admin

# Development (auto-reload)
npm run dev

# Production
npm start
```

The API listens on `http://localhost:5000` by default (`PORT` in `.env`).

Verify it is up:

```bash
curl http://localhost:5000/api/health
```

## npm scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon src/server.js` | Start with hot reload |
| `start` | `node src/server.js` | Start server |
| `seed:admin` | `node scripts/seed-admin.js` | Create first admin if none exists |
| `reset:admin-password` | `node scripts/reset-admin-password.js` | Reset admin password from `.env` (no email) |

## API overview

All routes are prefixed with `/api`.

| Area | Base path | Auth |
|------|-----------|------|
| Health | `GET /api/health` | No |
| Auth | `/api/auth/*` | Mixed (see below) |
| Inquiries | `/api/inquiries` | `POST` public, `GET` admin JWT |

### Auth endpoints

| Method | Endpoint | Auth |
|--------|----------|------|
| `POST` | `/api/auth/login` | No |
| `GET` | `/api/auth/me` | Bearer JWT |
| `PATCH` | `/api/auth/change-password` | Bearer JWT |
| `POST` | `/api/auth/forgot-password` | No |
| `POST` | `/api/auth/reset-password` | No |
| `POST` | `/api/auth/reset-password-emergency` | Server secret only |

Protected routes use:

```http
Authorization: Bearer <token>
```

Full request/response details, error codes, and flows: **[docs/AUTH_API.md](./docs/AUTH_API.md)** · **[docs/INQUIRY_API.md](./docs/INQUIRY_API.md)**

## Environment variables

Copy from [`.env.example`](./.env.example):

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | HTTP port (default `5000`) |
| `CLIENT_URL` | No | Landing app origin for CORS |
| `ADMIN_CLIENT_URL` | No | Admin app origin for CORS and reset links |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `ADMIN_EMAIL` | For scripts | Used by `seed:admin` / `reset:admin-password` |
| `ADMIN_PASSWORD` | For scripts | Used by `seed:admin` / `reset:admin-password` |
| `BREVO_SMTP_KEY` | For email | Brevo API key (`xkeysib-...`) or SMTP `email\|xsmtpsib-...` |
| `ADMIN_RESET_SECRET` | Optional | Emergency password reset only (never expose to frontend) |

Email setup: **[docs/BREVO_SETUP.md](./docs/BREVO_SETUP.md)**

## CORS

Allowed origins are `CLIENT_URL` and `ADMIN_CLIENT_URL` from `.env`. If neither is set, all origins are allowed (development-friendly).

## Project structure

```
server/
├── scripts/
│   ├── seed-admin.js
│   └── reset-admin-password.js
├── docs/
│   ├── AUTH_API.md
│   ├── BREVO_SETUP.md
│   ├── POSTMAN.md
│   └── postman/
├── src/
│   ├── server.js          # Entry point
│   ├── app.js             # Express app + middleware
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── .env.example
└── package.json
```

## Documentation & testing

| Resource | Purpose |
|----------|---------|
| [docs/AUTH_API.md](./docs/AUTH_API.md) | Auth API reference |
| [docs/BREVO_SETUP.md](./docs/BREVO_SETUP.md) | Brevo API vs SMTP configuration |
| [docs/POSTMAN.md](./docs/POSTMAN.md) | Postman import and environment setup |
| [docs/postman/VolumeDayTrader-Auth.postman_collection.json](./docs/postman/VolumeDayTrader-Auth.postman_collection.json) | Postman — all APIs (Health, Auth, Inquiries) |

## Security notes

- Never commit `.env` or real API keys.
- Use a long, random `JWT_SECRET` in production.
- `ADMIN_RESET_SECRET` and emergency reset are for ops only — not for the admin UI.
- Change default `ADMIN_PASSWORD` after first login.
