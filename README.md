# RVerse Booking — PickleRVerse Demo

Vite + React + TypeScript sales site and interactive fictional court demo.

## V1.1 UX direction

The interface is designed for first-glance usability on phones while keeping the premium PickleRVerse presentation and the informative sales content.

Key UX choices:
- Player browsing uses a labeled mobile nav: Venue / Book / My booking.
- Booking shows every court in one compact schedule with A / B / R / M / ✓ status codes.
- Checkout uses a simple Step X of 4 progress bar and a sticky booking cart.
- Payment total appears before the payment choices on mobile.
- Court Staff uses a labeled bottom navigation instead of a cramped horizontal tab strip.
- Staff schedule uses the same A / B / R / M visual language as the public schedule.
- Settings are grouped into expandable sections and keep Save changes within reach on mobile.
- Sales-page guides, pricing details, FAQs, and product explanations remain available.

## Run locally

```bash
npm install
npm run check
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Main routes

- `/` — sales site
- `/demo` — PickleRVerse player-facing venue
- `/demo/book` — booking simulation
- `/demo/manage` — booking lookup and management
- `/demo/admin` — Court Staff workspace

## Deployment

### Vercel
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` contains the SPA rewrite.

### Cloudflare Pages
- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

`public/_redirects` contains the SPA fallback.

## Demo state

The demo uses `localStorage`. Player bookings and Court Staff changes share the same browser state. Use **Reset** in the demo bar to return to seeded PickleRVerse data.
