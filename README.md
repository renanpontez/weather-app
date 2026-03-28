# WeatherApp

A personalized weather application built with React, Cloudflare Workers, and Durable Objects.

Search for any city, see current conditions with a 6-day forecast, and keep track of recent searches synced across clients in real time.

## Live Demo

**https://weather-app-6v5.pages.dev**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Hono on Cloudflare Workers |
| State | TanStack React Query, Durable Objects |
| Sync | WebSocket via Durable Objects |
| Testing | Vitest, Testing Library, Playwright |
| CI | GitHub Actions |

## Architecture

```
weather-app/
├── api/          Cloudflare Worker (Hono + Durable Objects)
├── web/          React SPA (Vite + Tailwind)
└── shared/       TypeScript types shared across packages
```

**Single Durable Object** (`WeatherCache`) handles both weather caching (10-min TTL with stale-while-revalidate) and recent search history (WebSocket broadcast for cross-client sync).

**Frontend** uses React Query for server state, custom hooks for geolocation/search/preferences, and URL params for shareable links.

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Starts both the API (port 8787) and web (port 5173) via Turborepo. Vite proxies `/api` requests to the Worker.

### Testing

```bash
# Unit + component tests
cd web && pnpm test

# E2E tests (requires both servers running)
cd web && pnpm test:e2e
```

### Build

```bash
pnpm build
```

## Deployment

### API (Cloudflare Workers)

```bash
cd api
npx wrangler login
npx wrangler deploy
```

### Web (Cloudflare Pages)

Connect the repo to Cloudflare Pages:

- Build command: `cd web && pnpm install && pnpm build`
- Output directory: `web/dist`
- Environment variable: `VITE_API_URL` = your Worker URL

## Key Features

- **Geolocation fallback**: Browser API → Cloudflare IP headers → default city
- **Autocomplete search**: Debounced city lookup with keyboard navigation and ARIA combobox
- **Stale-while-revalidate**: Serves cached weather instantly, refreshes in background
- **Cross-client sync**: WebSocket broadcasts recent searches to all connected clients
- **Offline detection**: `useSyncExternalStore` for online/offline status
- **Accessibility**: Skip-to-content, aria-live regions, keyboard navigation, reduced motion support
- **URL sharing**: City and unit preference encoded in URL params
