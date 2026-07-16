# So Vale Reclamar — Web

## Project
A social network *exclusively* for complaints, inspired by Reddit. Users file
**complaints** against **entities** (a place, movie, company, or product) and
**corroborate** (endorse) each other's complaints. That's the whole product.

This repo is the **frontend only**. The backend is a separate, already-built
Node.js serverless API — its contract lives in `openapi.yaml` at the repo root
and is the **source of truth** for all data shapes and endpoints.

## Stack
- Angular 20.1 — standalone components, **zoneless** change detection, signals-first
- SSR enabled (server output mode, Express entry in `src/server.ts`)
- TypeScript 5.8
- State: **@ngrx/signals** (signalStore, one per feature)
- HTTP: `HttpClient` with `withFetch()` (SSR-safe)
- Styling: **Tailwind CSS v4** (`@use 'tailwindcss'` in `src/styles.scss`)
- Tests: Karma + Jasmine
- Auth: AWS Cognito — JWT id token as `Authorization: Bearer <token>`
- Backend (separate repo): Node.js serverless API, S3 image uploads

## Commands
- Dev server: `npm start`  (→ `ng serve`)
- Build: `npm run build`
- Test (all): `npm test`  (→ `ng test`)
- Test (single file): `ng test --include='**/feed.spec.ts'`
- Type check: `npx tsc --noEmit -p tsconfig.app.json`
- SSR serve (after build): `npm run serve:ssr:so-vale-reclamar-web`
  (SSR host allowlist: set `NG_ALLOWED_HOSTS` to the deploy domain in prod; the
  serve script sets `localhost` for local. Without it, SSR falls back to CSR.)
- Lint: not configured yet
- API base URL: `src/environments/environment.dev.ts` (dev) and
  `environment.prod.ts` (prod) hold `apiBaseUrl`. `environment.ts` is the
  fallback everything imports from — `angular.json`'s `fileReplacements` swaps
  it per build configuration (`ng serve`/`development` → `.dev.ts`; `ng build`/
  `production` → `.prod.ts`). Always import from `./environments/environment`,
  never `.dev`/`.prod` directly, or the swap has no effect.
- Cognito config: same three environment files hold `cognito.userPoolId` /
  `cognito.clientId` — currently `REPLACE-ME`. Fill in from the User Pool
  console or the backend repo's `serverless info` output; login/register won't
  work against a real pool until then.

## Domain model (from `openapi.yaml` — do not invent fields)
- **Entity** `{ id, type: PLACE|MOVIE|COMPANY|PRODUCT, name, createdBy }` — the
  thing a complaint is filed against. Users create + fuzzy-search entities.
- **Complaint** `{ id, entityId, authorId, title, content, mediaUrl?,
  corroborationCount, createdAt }` — one optional image; always attributed.
- **Corroboration** — "I've been through this too" endorsement. One per user per
  complaint; increments `corroborationCount`. The ONLY engagement signal —
  there is no downvote, no free-text tags, and no anonymity.
- **Author** `{ id, username }` — returned on list/feed items.
- **Feed** — global, time-decay ranked; **page-based** (`page`, 10/page,
  `metadata.hasMore/nextPage`).

## Endpoints (see `openapi.yaml` for full schemas)
Public (no token): `GET /feed`, `GET /entities/search?q=`,
`GET /entities/{id}/complaints`.
Authenticated (Cognito JWT): `POST /complaints`, `POST /entities`,
`POST /complaints/{id}/corroborate`, `POST /uploads/presigned-url`.
Image upload = two-step: get presigned `uploadUrl` + `mediaUrl` → `PUT` bytes to
S3 → send `mediaUrl` when creating the complaint. Content types: jpeg/png/webp.

## Angular 20 conventions (follow these)
- New file naming: `feed.ts`, `feed.html`, `feed.scss`; class is `Feed`
  (no `.component` suffix, no `Component` in the class name).
- All components **standalone**; declare deps in `imports: []`.
- **Zoneless** — no zone.js. Reactivity is signals only: `signal()`, `computed()`,
  `effect()`. Never rely on CD from timers/promises.
- Inputs/outputs via functional `input()` / `output()`; queries via `viewChild()`.
- Use `@if` / `@for` / `@switch` control flow — not `*ngIf` / `*ngFor`.
- Prefer `inject()` over constructor injection.
- Feature state lives in `@ngrx/signals` signalStores, not services with subjects.
- Browser-only APIs (`IntersectionObserver`, `localStorage`, Cognito SDK) MUST be
  guarded for SSR — use `afterNextRender()`, never touch `window` on the server.

## Architecture
```
src/
├── environments/           # apiBaseUrl config
└── app/
    ├── core/
    │   ├── auth/           # CognitoService (SDK wrapper), AuthStore, authGuard
    │   ├── http/           # ApiService (typed API client), authInterceptor
    │   └── models/         # domain types mirrored from openapi.yaml
    ├── shared/ui/          # dumb components (e.g. complaint-card)
    ├── layouts/
    │   ├── main-layout/    # navbar (auth state) + <router-outlet>
    │   └── auth-layout/    # centered card shell for /auth/* pages
    └── features/           # smart, routed components + their signalStores
        ├── feed/           # global ranked feed (infinite scroll)
        ├── entity/         # entity page: its complaints, top-corroborated first
        ├── auth/           # login, register (+ confirm), forgot-password
        ├── create-complaint/ # post + presigned S3 upload (later)
        └── profile/        # user history (later)
```

## MVP scope
In: public feed (infinite scroll over `GET /feed`), entity search + entity
complaints, auth (Cognito), create complaint (+ image), corroborate.
Deferred (phase 2): comments/threads, moderation/reporting, personalized feed.

## Rules
- Data shapes come from `openapi.yaml` only — never invent or rename fields.
- Talk to the API through `core/http/ApiService`; no raw `fetch`/`HttpClient`
  calls inside components.
- Style with Tailwind utilities; avoid custom SCSS unless necessary.
- Keep `shared/ui` components dumb (inputs/outputs only); logic goes in stores.
- IMPORTANT: zoneless — if the UI isn't updating, it's a missing signal, not a
  change-detection quirk. Don't reach for `zone.js` or `ChangeDetectorRef`.

## Workflow
- Ask clarifying questions before complex or ambiguous tasks.
- Make minimal changes; do not refactor unrelated code.
- Run tests after every change; fix failures before moving on.
- One logical change per commit.
- When unsure between approaches, explain both and let me choose.

## Out of scope / human approval required
- Don't modify auth/security logic or the API contract (`openapi.yaml`) without review.
- Don't touch auto-generated files (`.angular/`, `dist/`, `node_modules/`).
