# Backend Contract — iprodigital-site

Owned Express + MongoDB backend replacing the Base44 platform client.
Frontend client: `src/api/db.js` (same `{ auth, entities, integrations }` surface as the platform).

Base URL: `/api` (nginx proxies to backend :4000).

## Auth (`/api/auth`)

JWT Bearer in `Authorization` header. Token stored by the FE in `localStorage.access_token`.

| Route | Method | Body | Response |
|---|---|---|---|
| `/register` | POST | `{email, password, full_name?}` | `{ok}` — sends OTP email; creates NO user yet |
| `/verify-otp` | POST | `{email, otp}` | `{access_token, user}` — creates user (role `user`) |
| `/resend-otp` | POST | `{email}` | `{ok}` (generic) |
| `/login` | POST | `{email, password}` | `{access_token, user}`; 403 if unverified |
| `/me` | GET | — | `{id, email, full_name, role, created_date}` |
| `/reset-password/request` | POST | `{email}` | `{ok}` (generic; emails `/reset-password?token=...` link) |
| `/reset-password/confirm` | POST | `{token, new_password}` | `{ok}` |
| `/google` | GET | — | 501 not configured |

OTP TTL 10 min, reset token TTL 30 min, both in the `tokens` TTL collection.
Registration role is forced server-side to `user`; body role is ignored. Admin is seeded from `ADMIN_EMAIL`/`ADMIN_PASSWORD` env on boot.

## Entities (`/api/:collection`)

Naive collection naming: entity name lowercased + `s` (SiteSettings → `sitesettingss`, Gallery → `gallerys`, News → `newss`).

Public READ (no token): `sitesettingss, aboutcontents, events, gallerys, newss, portfolios, saasproducts, socialproofs, teammembers`.
Everything else: `requireAuth`. All writes (POST/PATCH/DELETE): admin only. No public write endpoints — the site has no public forms.

| Route | Method | Notes |
|---|---|---|
| `/:collection?sort=&limit=` | GET | sort `-created_date` desc default; limit ≤ 2000 |
| `/:collection/filter?sort=&limit=` | POST | body = Mongo query; `$`-keys stripped (operator-injection guard); limit ≤ 5000 |
| `/:collection/:id` | GET | 400 on non-ObjectId |
| `/:collection` | POST | admin |
| `/:collection/:id` | PATCH | admin, `$set` semantics |
| `/:collection/:id` | DELETE | admin |

Records expose `_id` (FE client normalizes to `id`) and `createdAt`/`updatedAt` (normalized to `created_date`/`updated_date`). Schemas are `strict: false` — fields follow `base44/entities/*.jsonc`.

## Upload

- `POST /api/upload` — admin, multipart `file`, ≤ 25 MB, ext allowlist (images/mp4/webm/pdf). Returns `{file_url: "/api/files/<name>"}`.
- `GET /api/files/:name` — public, traversal-safe.

## Email

Provider precedence: Mailgun → Brevo → SMTP → log-only (dev default: codes appear in backend logs).

## Infra

`docker-compose.yml`: mongo (internal) + backend (expose 4000) + web nginx (host **8093** → 80, chosen because 8082/4000 are taken on this host). Deploy: `cp .env.example .env`, set `JWT_SECRET` + admin creds, `docker compose up -d --build`.
