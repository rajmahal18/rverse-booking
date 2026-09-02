# RVerse Booking Sales MVP — PickleRVerse Demo

Modern Vite + React + TypeScript sales/demo site for a configurable sports-court booking system.

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

## Demo routes

- `/` — sales page
- `/demo` — PickleRVerse public venue site
- `/demo/book` — public booking simulation
- `/demo/manage` — player booking lookup / reschedule / cancellation demo
- `/demo/admin` — Court Staff simulation

## Current demo behavior

- PickleRVerse uses its own logo, venue imagery, colors, court names, rates, venue profile, location details, rules, amenities, and payment identity.
- Public venue page includes venue gallery, fictional Riverside District map, landmark/parking details, one-click directions, and copy-address behavior.
- Orbit, Nova, and Comet have their own rate, surface, lighting, use case, and description.
- The public schedule shows every court and every time in one compact matrix.
- Status legend: `A` Available, `B` Booked, `R` Reserved / pending payment review, `M` Blocked, `✓` Selected. A one-click guide explains each state.
- Each matrix cell is one court-hour. Players can select multiple cells across different courts and times in one booking cart.
- The sticky bottom cart shows the running total and opens a booking-summary sheet.
- Online demo payment marks the selected court-hours Paid.
- Manual payment proof reserves the selected court-hours until Court Staff verifies the shared booking reference.
- Booking confirmation shows the selected court-hours, payment status, venue details, map/directions, and a direct link to manage the booking.
- `My booking` lets a player find a reference using the booking mobile number, move individual court-hours, remove a slot, or cancel the whole booking.
- Seeded lookup demo: `PRV-2048` / `0917 555 0148`.
- Court Staff can create walk-ins, block/unblock slots, verify payment proofs, move individual court-hours, and cancel court-hours.
- `Venue & courts` lets Court Staff edit court names, short names, hourly rates, surface, lighting, best-use copy, venue identity, address, location, directions, parking, amenities, nearby places, house rules, and payment instructions.
- Saved settings persist to `localStorage` and immediately feed Player view.
- Reset Demo restores the seeded fictional venue state.

## V1 polish

The V1 cleanup pass standardizes typography, spacing, controls, status labels, responsive behavior, demo-role navigation, payment-review grouping, and Player/Court Staff terminology. The mobile booking matrix keeps all three courts visible without horizontal scrolling.

## Hosting

The project is a client-side Vite app and can be deployed to Vercel or Cloudflare Pages.

### Vercel

- Build command: `npm run build`
- Output directory: `dist`
- `vercel.json` contains the SPA rewrite.

### Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- `public/_redirects` contains the SPA fallback.
