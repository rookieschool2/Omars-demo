# SEO Upgrade for Omar's Rebuild (omars-demo)

Date: 2026-07-03
Status: Approved approach A. Data-driven Menu JSON-LD (approach C) deferred to a later phase.

## Goal

Bring the Next.js rebuild to full on-site technical SEO parity and beyond the
old omarsrestaurant.com site, so existing rankings carry over at launch and
Google gets the structured local-business signals the old site never sent.

Scope is on-site only. No copy rewrites, no off-site work (Google Business
Profile etc.) in this phase.

## Context

- App: `omars-demo`, Next.js 16 App Router, JS (no TS), Tailwind 4.
- Live domain at launch: `https://omarsrestaurant.com` (replaces old site).
- Old site URLs map 1:1 to the rebuild except `/shop/` (new site uses `/store`).
- Current SEO state: a single global title/description in `app/layout.js`.
  No per-page metadata, JSON-LD, sitemap, robots, OG tags, or canonicals.
- Client-component pages that cannot export metadata directly: `/order`,
  `/reserve`, `/store`, `/admin`.

## Design

### 1. Single source of truth: `lib/business.js`

Constants module exporting NAP and business facts, consumed by JSON-LD,
Footer, and Contact page:

- name: "Omar's Fresh Seafood & Steaks" (display name "Omar's Restaurant")
- address: 1380 Siskiyou Blvd, Ashland, OR 97520
- phone: +1-541-482-1281, email: omarsrestaurant@gmail.com
- geo: lat 42.1846, lng -122.6924 (verify against Google Maps pin before launch)
- hours: Mon-Sun 11:00-22:00
- priceRange: "$$"
- cuisine: Seafood, Steakhouse, American
- foundingDate: 1946
- siteUrl: https://omarsrestaurant.com
- social: Facebook and Instagram profile URLs

Footer and Contact page are refactored to read address/phone/email from this
module so future changes happen in one place.

### 2. Restaurant JSON-LD

A small `JsonLd` server component rendered once in the root layout, emitting
schema.org `Restaurant`:

- `@type: Restaurant`, name, url, telephone, email
- `address` (PostalAddress), `geo` (GeoCoordinates)
- `openingHoursSpecification` (all days, 11:00 to 22:00)
- `servesCuisine`, `priceRange`, `foundingDate`
- `hasMenu`: https://omarsrestaurant.com/menus
- `acceptsReservations`: https://omarsrestaurant.com/reserve
- `image` (exterior photo), `logo`
- `sameAs`: Facebook, Instagram

All values come from `lib/business.js`.

### 3. Per-page metadata

Root layout gets `metadataBase: new URL(siteUrl)`, a title template, default
OG/Twitter config, and the home description. Each server page exports its own
`metadata`. Client pages get a thin `layout.js` wrapper file whose only job is
the metadata export. Every page sets `alternates.canonical`.

Title template: `%s | Omar's Fresh Seafood & Steaks`

The home page uses the layout's `title.default`, which Next does not run
through the template, so its row below is the complete title. Every other
row is the `%s` part.

Drafted titles and descriptions:

| Route | Title | Description |
|---|---|---|
| `/` (default) | Omar's Fresh Seafood & Steaks - Ashland, OR - Since 1946 | Ashland's oldest restaurant and first public cocktail lounge. Fresh seafood, hand-cut steaks, and a full bar at 1380 Siskiyou Blvd. Open daily 11am to 10pm. |
| `/menus` | Steak & Seafood Menu | Hand-cut steaks, fresh seafood, and house favorites made from scratch since 1946. Browse the full menu at Omar's in Ashland, Oregon. |
| `/specials` | Daily Specials | Our specials board changes daily: fresh catch, chef's cuts, and seasonal dishes. See what's on at Omar's in Ashland today. |
| `/wine-list` | Wine List & Cocktails | Northwest and California wines by the glass and bottle, plus classic cocktails at Ashland's first public cocktail lounge, pouring since 1946. |
| `/about` | About Omar's, Serving Ashland Since 1946 | The longest continuously operating restaurant between Portland and Redding. Read the story behind Ashland's oldest restaurant and its neon sign. |
| `/catering` | Catering in Ashland & the Rogue Valley | Full-service catering from Omar's: hors d'oeuvres, elegant buffets, staffed service, and licensed bar service for events across the Rogue Valley. |
| `/events` | Private Events & Parties | Host your party at Omar's. Build-your-own menus for groups of 20 or more, no room fee Tuesdays and Wednesdays, and the 72oz Conquer the Cut challenge. |
| `/contact` | Contact & Reservations | Omar's is at 1380 Siskiyou Blvd, Ashland, OR 97520. Call 541.482.1281 for reservations. Open daily, 11am to 10pm, for dine-in and take-out. |
| `/order` | Order Takeout Online | Order Omar's steaks and seafood to go. Online ordering for pickup at 1380 Siskiyou Blvd in Ashland, open daily 11am to 10pm. |
| `/reserve` | Reserve a Table | Book a table at Omar's in Ashland, Oregon. Reserve online in seconds or call 541.482.1281. |
| `/store` | Gift Cards | Give the gift of Omar's. Gift cards from Ashland's landmark steak and seafood house, est. 1946. |
| `/admin` | Admin | (noindex, nofollow; no description needed) |

### 4. Discovery and crawl

- `app/sitemap.js`: all public routes above except `/admin`. Static list,
  built from a routes array; home priority 1.0, others default.
- `app/robots.js`: allow all, disallow `/admin` and `/api`, sitemap URL.
- `next.config.mjs`: permanent redirect `/shop` -> `/store` (covers the old
  site's only URL mismatch; Next handles trailing slashes itself).
- `/admin` page metadata sets `robots: { index: false, follow: false }`.

### 5. Social cards

Root layout `openGraph` and `twitter` defaults:

- type `website`, siteName, locale `en_US`
- image: `photo-exterior-night.jpg` or `bk-home.jpg` from
  `public/site-assets`, whichever crops best to 1200x630 (decide during
  implementation; may pre-crop a copy as `og-image.jpg`)
- `twitter.card: summary_large_image`

Pages inherit the default card; no per-page OG images in this phase.

### 6. Alt-text audit

Sweep all `<img>` and `next/image` usages in `app/` and `components/` for
missing or generic alt text. Write descriptive, location-aware alts, e.g.
"Pan-seared scallops at Omar's in Ashland" instead of "food photo".
Decorative images get `alt=""`.

## Testing

- `npm run build` passes.
- `npm test` (existing lib tests) stays green.
- Spot-check rendered HTML (via `next build` output or local server) for:
  JSON-LD script present and valid JSON, per-page titles, canonical tags,
  OG tags, robots meta on `/admin`.
- JSON-LD validated structurally against schema.org Restaurant required and
  recommended fields.
- `curl -I` check that `/shop` returns 308 to `/store` on the local server.

## Out of scope / later phases

- **Approach C (agreed, later phase):** generate schema.org `Menu` JSON-LD
  from the SQLite menu data so structured data tracks Jen's admin edits.
  Candidate for the care plan.
- Content and keyword copy pass.
- Off-site checklist (Google Business Profile, Yelp, OpenTable consistency).
- Per-page OG images.
