<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend Rules For This Repository

These rules are mandatory for any AI agent editing this project.

## 1) UI Stack Rules (Mandatory)

- Use HeroUI v2 (`@heroui/react`) for UI primitives.
- Do not introduce raw HTML controls if an equivalent HeroUI primitive exists.
- Keep styling with Tailwind utilities and CSS variables from `app/globals.css`.
- Keep TypeScript strict: no `any`, no unsafe casts.

## 2) Next.js Architecture Rules (Mandatory)

- Respect App Router conventions.
- Route files must remain thin:
	- `page.tsx` must only assemble page-level components.
	- No large inline JSX blocks directly in route files.
	- No business logic directly in route files.
- Move page UI into dedicated components.
- Keep data logic in hooks/services/libs, not in route components.

## 3) Components Folder Contract (Mandatory)

- Shared reusable components go in `components/common/`.
- Page/domain-specific components go in their own folders under `components/`:
	- `components/stock/`
	- `components/caisse/`
	- `components/entrees/`
	- `components/sorties/`
	- `components/produits/`
	- `components/rapports/`
- Do not place page-specific components in `common`.

## 4) Data Contract Alignment (Mandatory)

- Frontend types must mirror backend DTO/enums/response envelope exactly.
- All API calls must read the backend envelope shape and expose `{ data, meta }`.
- TanStack Query hooks must consume normalized API helpers, not raw axios responses.

## 5) State and Side-Effects

- TanStack Query v5 for server state.
- Zustand for client/domain UI state.
- Axios instance with JWT interceptors and refresh flow.
- Socket.io client for caisse live events.

## 6) UX Rules

- Mobile-first behavior is required.
- Keep interactions immersive but readable.
- Use animation with purpose (Framer Motion), including reduced-motion fallback.
- Accessibility is not optional: visible focus, aria labels, semantic feed areas.
- Do not make black the dominant visual tone; prefer colored dark or mixed atmospheric backgrounds.

## 7) File Generation Discipline

- If creating new pages/features, follow this order:
	1. Types and enums
	2. API/lib helpers
	3. Validation schemas
	4. Stores
	5. Hooks
	6. Common components
	7. Page-specific components
	8. Route files (`page.tsx`) as composition-only shells

## 8) Guardrails

- Do not regress existing architecture.
- Do not move logic into pages for convenience.
- Do not mix unrelated component concerns in one folder.
- Prefer consistency over novelty when extending existing code.
