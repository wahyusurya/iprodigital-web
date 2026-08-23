# Extraction Report — iprodigital company site (Base44 export)

Source: `_export-original.zip` (Base44 export, 2026-08-23T11:09:56Z, 129 files, 1 asset unresolved).
Extracted: 2026-08-23.

## Export state

- `export-report.json.diagnostics.exportState: BUILDING_FILE_TREE` — FLAT export, no directory structure in the ZIP.
- Tree reconstructed with `platform-export-migration/scripts/reconstruct-flat-export.py`, then hand-corrected (see below).
- 1 missing asset: `https://media.db.com/images/public/user_6a01d3895c0736c8920e0773/2c808e92e_iproidlogoPNG.png` (Failed to fetch) — the iproid logo. Try `media.base44.com` same path, or re-source the logo file.

## Verification

`verify-export-tree.mjs`:
- 109 files parsed, **0 truncated**
- **0 unresolved local imports** — tree reconstruction is import-proven

## Reconstructed (import-proven)

- `src/App.jsx`, `src/main.jsx` (moved out of the ui/ default bucket; entrypoint per index.html `<script src="/src/main.jsx">`)
- `src/pages/` — Home, Admin, BeritaDetail, Acara, TentangKami
- `src/components/ipro/*` — landing sections (Header, Footer, HeroSection, AboutSection, ServicesSection, SaaSSection, PortfolioSection, NewsSection, GalleryGrid, MasonryGallery, StatsCounterSection, TestimonialsSection, Carousel, RevealText, NavOverlay, FloatingWhatsApp, EventImageModal, EventRegisterModal, TeamMemberModal, VideoEmbed, TikTokIcon, PageLoader, AuditForm)
- `src/components/admin/*` — AdminEntityManager, SiteSettingsEditor, AboutContentEditor, GalleryEditor, ImageUpload, RichTextEditor
- `src/components/{AuthLayout,ProtectedRoute,ScrollToTop,UserNotRegisteredError,GoogleIcon}.jsx`
- `src/lib/{AuthContext,PageNotFound}.jsx`, `src/lib/{app-params,query-client,utils}.js`
- `src/hooks/{use-mobile.jsx,useSiteSettings.js}`
- `base44/entities/*.jsonc` — AboutContent, Event, Gallery, News, Portfolio, SaaSProduct, SiteSettings, SocialProof, TeamMember, User
- `base44/config.jsonc`, `base44/export-report.json`

## Guessed (convention, not import-proven)

- `src/pages/{Login,Register,ForgotPassword,ResetPassword,OAuthConsent}.jsx` — auth pages import only `@/components/AuthLayout` and ui primitives; placed with the other pages (atelier-florist convention).
- `src/components/ui/*` — shadcn primitives (safe: `components.json` alias).
- `src/lib/authReturnTo.js` — unwired scaffolding (line 1: "Shared by the auth pages"), no importers.
- `src/api/base44Client.js` — platform stub, no importers (components inline `globalThis.__B44_DB__` instead). Delete on migration.
- `src/utils/index.ts` — `createPageUrl` helper, no importers. Dead weight, keep or delete.

## Route audit (`audit-route-orphans.py` on raw extract)

Export BUGs — linked but NOT routed in `App.jsx` (only `/`, `/berita/:slug`, `/acara`, `/tentang-kami`, `/admin` declared):
- `/login` — referenced by App.jsx's own ProtectedRoute redirect (`<Navigate to="/login">`), Register.jsx, ForgotPassword.jsx. Currently 404s.
- `/register` — linked from Login.jsx:45.
- `/forgot-password` — linked from Login.jsx:96, ResetPassword.jsx:46.
- `/reset-password` — no in-app links; reached via external email link (platform-side flow). Needs a route once the backend sends reset emails.

True orphan: `OAuthConsent.jsx` (Base44 MCP consent screen — platform infra, delete on migration).

## Notes for migration (step 2+)

- **Zero `functions.invoke` call sites and no `base44/functions/` dir** — all logic client-side. Backend scope = generic CRUD + auth + upload only (atelier-florist class, smaller than UKRUN/ternakku).
- Auth pages want full flow (login/register/forgot/reset) — AuthContext still has Base44 `appParams`/`public-settings` machinery to reduce (step 6 of the umbrella skill).
- `functions`/automations: none to port, but public-read split on the entities router is NEW construction — `sitesettings`, `aboutcontent`, `event`, `gallery`, `news`, `portfolio`, `saasproduct`, `socialproof`, `teammember` are landing-page reads; `user` must stay private.
- Admin page (`/admin`) is behind ProtectedRoute; role-aware redirect on login applies.
