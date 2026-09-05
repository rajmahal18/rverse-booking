# RVerse Booking — PickleRVerse Demo

Vite + React + TypeScript sales site and interactive fictional court demo.

## V1.4 Open Play patch

V1.4 adds Open Play as a first-class part of the fictional PickleRVerse venue while preserving the existing booking, payment, staff, and environment-led visual system.

Key changes:
- Added a public Open Play hub with clear host filters and informative event cards.
- Court-hosted sessions open a full RVerse event page with skill level, format, capacity, fee, courts, check-in, equipment, cancellation, parking, and contact details.
- Reclub-hosted sessions are clearly labeled and continue to Reclub for organizer-managed registration instead of pretending the registration happens inside RVerse.
- Added an Open Play section to the venue homepage and a fourth item to the player mobile navigation.
- Added a Court Staff Open Plays tab with publish/hide controls and links to the public or external event destination.
- Added Open Play state normalization so older saved demo state still receives the new seeded event data.
- Integrated `public/otherangle.png` and `public/parking.png` into the venue gallery so the new photography explains the venue rather than acting as decoration.
- Kept the background treatment intentionally quiet; no decorative pattern layer was introduced.

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
- `/demo/open-plays` — upcoming Open Play listings
- `/demo/open-plays/:id` — full court-hosted Open Play details
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


## V1.5 Part 2
- Mobile-first public and sales UX pass
- 62-day calendar booking window
- Mobile cart rendering hardening
- Public booking only after successful payment
- Screenshot-friendly receipt + PNG receipt export
- Reclub/PickleRVerse Open Play platform branding
- Fictional Philippine/BARMM-flavored open play clubs
- Guided court-owner sales journey

## V1.6 Scenery-led hero
- Reworked the player-facing venue hero from a split text/card layout into one full-width scenic composition.
- Uses the venue photo as the hero environment, with the courts/detail weighted to the right and a readability gradient creating intentional negative space for the copy on the left.
- Keeps all headline, availability, and CTA content as real HTML rather than baking UI into the image.
- The hero is a normal document section: the scenery scrolls away with it and does not remain fixed behind later sections.
- Removed the old hero rally/paddle treatment and page-wide scroll ball so the first impression is calmer and more editorial.
- Added an optimized WebP hero asset to reduce the image payload substantially versus the original PNG source.
- Includes dedicated tablet and mobile composition rules so copy stays legible while the venue remains the visual anchor.
