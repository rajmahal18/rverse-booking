# RVerse Booking — PickleRVerse Demo

Vite + React + TypeScript sales site and interactive fictional court demo.

## V1.3 Living Court polish

The fictional PickleRVerse venue drives the visual system: court blue, apron lime, fence navy, sky, concrete, and foliage tones are reused across the player, booking, booking-management, and Court Staff views. V1.3 keeps that environment-led direction while tightening alignment and pushing the motion system further.

Key UX and visual choices:
- Replaced the square-background rally media with transparent, court-friendly paddle and pickleball assets.
- Added a branded route-progress treatment where the pickleball itself travels as the loading slider.
- Rebuilt the PickleRVerse lockup from a separately animated mark and wordmark so the paddle mark can kick, orbit, spark, and catch a controlled sheen.
- Refined hero rally timing with coordinated paddle swings, impact rings, speed trails, and cleaner scroll/final-rally motion.
- Normalized optical centering for filled buttons, pills, badges, action chips, and icon/text controls across player, booking, manage, and Court Staff screens.
- The public venue uses a continuous rally motif: moving pickleball, paddle swings, court-line overlays, kinetic text, and scroll-reactive motion.
- Venue photography is the palette source, so the interface blends with the fictional physical court instead of feeling like a separate SaaS template.
- Player browsing keeps the labeled mobile nav: Venue / Book / My booking.
- Booking keeps every court in one compact schedule with A / B / R / M / ✓ status codes and uses the same venue-derived palette.
- Checkout still uses a simple Step X of 4 progress bar and a sticky booking cart.
- Court Staff keeps the same schedule language and inherits the venue palette without adding distracting motion to operational screens.
- Motion respects reduced-motion preferences, and core booking actions remain obvious without animation.
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
