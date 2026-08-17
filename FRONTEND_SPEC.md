# Frontend Execution Brief (Streetwear Stock + Caisse)

Use this brief when generating or refactoring the frontend.

## Product Context
- App type: stock + caisse management for a streetwear seller.
- Target: 18-28, mobile-first, fast, immersive UX.
- Backend: NestJS 10.
- Backend contract is source of truth.

## Non-Negotiable Architecture
- Next.js App Router.
- Route files must be composition only:
  - `app/**/page.tsx` contains only page components.
  - No large raw JSX blocks in pages.
  - No business logic in pages.
- Components placement:
  - Shared: `components/common/`
  - Page scoped: one folder per page domain (`components/stock`, `components/caisse`, etc.).

## UI and Styling
- HeroUI v2 components required for UI primitives.
- Tailwind utility classes only.
- Theme and tokens via CSS variables in `app/globals.css`.
- Keep color semantics strict (in/out/return/cash/accent roles).
- Avoid black-dominant screens; use non-black base tones and atmospheric layered backgrounds.

## Data and Types
- Mirror backend enums and interfaces exactly.
- Respect response envelope:
  - `{ data: T, meta: { page?, limit?, total?, totalPages? }, timestamp }`
- API layer must return normalized `{ data, meta }`.
- TanStack Query hooks consume normalized helpers only.

## Required Stack
- TypeScript strict
- TanStack Query v5
- Zustand v4
- React Hook Form v7 + Zod v3
- Framer Motion v11
- socket.io-client v4
- next-intl v3 (default fr)
- date-fns v3
- axios v1
- Recharts v2 (lazy loaded)

## Errors and Business Rules
- Handle API error format consistently.
- Must handle 400/401/403/404/409/422/500 explicitly.
- 401 triggers transparent refresh flow.
- 409 and 422 must surface business feedback in UI context (not silent).

## State Boundaries
- Server state in TanStack Query hooks.
- Client state in Zustand stores by domain.
- API transport concerns in `lib/api.ts` only.
- WebSocket session and live events isolated in session/caisse hooks + store.

## Performance and Accessibility
- Infinite feeds use `useInfiniteQuery`.
- Heavy chart/panel/modal components lazy loaded.
- Mobile-first layout and interaction.
- Visible focus outlines and aria labels on icon-only controls.
- Live feed zones with `aria-live="polite"` when needed.

## Build Order For New Features
1. Enums and types
2. API and libs
3. Validators
4. Stores
5. Hooks
6. Common components
7. Page-specific components
8. Route composition shells

## Confidence + Vigilance Reporting Rule
For each generated file, include:
- Confidence score from 0.0 to 1.0.
- Vigilance points (version/API behavior risks).
- If confidence < 0.8: propose an alternative and explain final choice.
