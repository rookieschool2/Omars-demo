# SEO Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full on-site technical SEO for the Omar's rebuild: business-constants module, Restaurant JSON-LD, per-page metadata, sitemap, robots, OG cards, canonicals, and the `/shop` redirect.

**Architecture:** A CommonJS `lib/business.js` constants module is the single source of truth for NAP data. A pure `lib/jsonld.js` builder (unit-tested) feeds a tiny `JsonLd` server component rendered in the root layout. Everything else uses Next.js built-in metadata conventions: `metadata` exports, `app/sitemap.js`, `app/robots.js`, `next.config.mjs` redirects.

**Tech Stack:** Next.js 16.2.9 App Router (JS, no TS), Tailwind 4, `node --test` for lib tests.

**Spec:** `docs/superpowers/specs/2026-07-03-seo-upgrade-design.md` (approved). All titles/descriptions below are copied from the spec's table verbatim.

## Global Constraints

- Working directory for all `npm`/file commands: `omars-demo/` inside the repo root `/Users/masongoche/Claude/Projects/Omar's`. Git commits run from the repo root.
- This Next.js version may differ from your training data. If an API surprises you, check `omars-demo/node_modules/next/dist/docs/01-app/` before working around it. (The APIs used here — `metadata` export, `title.template`, `sitemap.js`, `robots.js`, `redirects()` — are already verified against those docs.)
- `lib/` modules are CommonJS (`require`/`module.exports`), matching `lib/queries.js`. App code imports them with `import { X } from '@/lib/...'` — this interop already works in this repo, keep the pattern.
- NAP facts are fixed. Name "Omar's Fresh Seafood & Steaks", 1380 Siskiyou Blvd Ashland OR 97520, 541.482.1281, omarsrestaurant@gmail.com, open daily 11am to 10pm, est. 1946. Do not "improve" them.
- Site URL: `https://omarsrestaurant.com` (no trailing slash).
- No em dashes or en dashes in any user-visible copy (titles, descriptions, alt text). Use commas, periods, or "to".
- `npm test` and `npm run build` must pass at the end of every task.

---

### Task 1: Business constants module

**Files:**
- Create: `omars-demo/lib/business.js`
- Test: `omars-demo/lib/business.test.js`

**Interfaces:**
- Produces: `module.exports = { BUSINESS }` where `BUSINESS` is the object below. Later tasks import it as `import { BUSINESS } from '@/lib/business'` (app code) or `require('./business')` (lib code). Field names used later: `siteUrl`, `name`, `phone`, `phoneDisplay`, `email`, `address.{street,city,state,zip}`, `geo.{lat,lng}`, `hours.{opens,closes}`, `priceRange`, `cuisines`, `foundingDate`, `social.{facebook,instagram}`.

- [ ] **Step 1: Write the failing test**

Create `omars-demo/lib/business.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const { BUSINESS } = require('./business');

test('siteUrl is https with no trailing slash', () => {
  assert.match(BUSINESS.siteUrl, /^https:\/\//);
  assert.ok(!BUSINESS.siteUrl.endsWith('/'));
});

test('NAP matches the live business facts', () => {
  assert.equal(BUSINESS.address.street, '1380 Siskiyou Blvd');
  assert.equal(BUSINESS.address.city, 'Ashland');
  assert.equal(BUSINESS.address.state, 'OR');
  assert.equal(BUSINESS.address.zip, '97520');
  assert.equal(BUSINESS.phone, '+1-541-482-1281');
  assert.equal(BUSINESS.email, 'omarsrestaurant@gmail.com');
});

test('geo is at the Ashland location', () => {
  assert.ok(Math.abs(BUSINESS.geo.lat - 42.18553) < 0.001);
  assert.ok(Math.abs(BUSINESS.geo.lng - -122.69215) < 0.001);
});

test('hours cover open to close', () => {
  assert.equal(BUSINESS.hours.opens, '11:00');
  assert.equal(BUSINESS.hours.closes, '22:00');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `omars-demo/`): `node --test lib/business.test.js`
Expected: FAIL with "Cannot find module './business'"

- [ ] **Step 3: Write the implementation**

Create `omars-demo/lib/business.js`:

```js
// Single source of truth for Omar's business facts (NAP, hours, links).
// Consumed by JSON-LD, metadata, Footer, and the Contact page.
const BUSINESS = {
  name: "Omar's Fresh Seafood & Steaks",
  siteUrl: 'https://omarsrestaurant.com',
  phone: '+1-541-482-1281',
  phoneDisplay: '541.482.1281',
  email: 'omarsrestaurant@gmail.com',
  address: {
    street: '1380 Siskiyou Blvd',
    city: 'Ashland',
    state: 'OR',
    zip: '97520',
  },
  geo: { lat: 42.18553, lng: -122.69215 },
  hours: { opens: '11:00', closes: '22:00' },
  priceRange: '$$',
  cuisines: ['Seafood', 'Steakhouse', 'American'],
  foundingDate: '1946',
  social: {
    facebook: 'https://www.facebook.com/omarsfreshseafoodsteaks/',
    instagram: 'https://www.instagram.com/omarsrestaurant/',
  },
};

module.exports = { BUSINESS };
```

- [ ] **Step 4: Run tests to verify they pass**

Run (from `omars-demo/`): `npm test`
Expected: PASS (business tests plus existing queries tests all green)

- [ ] **Step 5: Commit**

```bash
git add omars-demo/lib/business.js omars-demo/lib/business.test.js
git commit -m "Add business constants module as single source of truth"
```

---

### Task 2: Restaurant JSON-LD

**Files:**
- Create: `omars-demo/lib/jsonld.js`
- Create: `omars-demo/components/JsonLd.js`
- Modify: `omars-demo/app/layout.js` (render `<JsonLd />` in body)
- Test: `omars-demo/lib/jsonld.test.js`

**Interfaces:**
- Consumes: `require('./business')` → `{ BUSINESS }` from Task 1.
- Produces: `module.exports = { buildRestaurantJsonLd }` in `lib/jsonld.js`; `buildRestaurantJsonLd()` takes no arguments and returns a plain object (the schema.org Restaurant). `components/JsonLd.js` default-exports a server component with no props.

- [ ] **Step 1: Write the failing test**

Create `omars-demo/lib/jsonld.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const { buildRestaurantJsonLd } = require('./jsonld');

test('emits a schema.org Restaurant with core local-business fields', () => {
  const d = buildRestaurantJsonLd();
  assert.equal(d['@context'], 'https://schema.org');
  assert.equal(d['@type'], 'Restaurant');
  assert.equal(d.name, "Omar's Fresh Seafood & Steaks");
  assert.equal(d.url, 'https://omarsrestaurant.com');
  assert.equal(d.telephone, '+1-541-482-1281');
  assert.equal(d.address['@type'], 'PostalAddress');
  assert.equal(d.address.streetAddress, '1380 Siskiyou Blvd');
  assert.equal(d.address.addressLocality, 'Ashland');
  assert.equal(d.address.addressCountry, 'US');
  assert.equal(d.geo['@type'], 'GeoCoordinates');
  assert.equal(d.hasMenu, 'https://omarsrestaurant.com/menus');
  assert.equal(d.acceptsReservations, 'https://omarsrestaurant.com/reserve');
  assert.equal(d.foundingDate, '1946');
});

test('opening hours cover all seven days', () => {
  const spec = buildRestaurantJsonLd().openingHoursSpecification;
  assert.equal(spec.length, 1);
  assert.equal(spec[0].dayOfWeek.length, 7);
  assert.equal(spec[0].opens, '11:00');
  assert.equal(spec[0].closes, '22:00');
});

test('sameAs lists both social profiles', () => {
  assert.deepEqual(buildRestaurantJsonLd().sameAs, [
    'https://www.facebook.com/omarsfreshseafoodsteaks/',
    'https://www.instagram.com/omarsrestaurant/',
  ]);
});

test('serializes to valid JSON', () => {
  assert.ok(JSON.parse(JSON.stringify(buildRestaurantJsonLd())));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run (from `omars-demo/`): `node --test lib/jsonld.test.js`
Expected: FAIL with "Cannot find module './jsonld'"

- [ ] **Step 3: Write the implementation**

Create `omars-demo/lib/jsonld.js`:

```js
const { BUSINESS } = require('./business');

function buildRestaurantJsonLd() {
  const b = BUSINESS;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: b.name,
    url: b.siteUrl,
    telephone: b.phone,
    email: b.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      addressLocality: b.address.city,
      addressRegion: b.address.state,
      postalCode: b.address.zip,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: b.geo.lat,
      longitude: b.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: b.hours.opens,
        closes: b.hours.closes,
      },
    ],
    servesCuisine: b.cuisines,
    priceRange: b.priceRange,
    foundingDate: b.foundingDate,
    hasMenu: `${b.siteUrl}/menus`,
    acceptsReservations: `${b.siteUrl}/reserve`,
    image: `${b.siteUrl}/site-assets/bk-home.jpg`,
    logo: `${b.siteUrl}/site-assets/logo.png`,
    sameAs: [b.social.facebook, b.social.instagram],
  };
}

module.exports = { buildRestaurantJsonLd };
```

- [ ] **Step 4: Run tests to verify they pass**

Run (from `omars-demo/`): `npm test`
Expected: PASS

- [ ] **Step 5: Create the JsonLd component and render it in the root layout**

Create `omars-demo/components/JsonLd.js`:

```js
import { buildRestaurantJsonLd } from '@/lib/jsonld';

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildRestaurantJsonLd()) }}
    />
  );
}
```

In `omars-demo/app/layout.js`, add the import after the Footer import:

```js
import JsonLd from "@/components/JsonLd";
```

and change the body so JsonLd renders first inside it:

```js
      <body className="bg-brand-cream text-brand-dark font-sans">
        <JsonLd />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
```

- [ ] **Step 6: Verify the build**

Run (from `omars-demo/`): `npm run build`
Expected: build succeeds with no errors

- [ ] **Step 7: Commit**

```bash
git add omars-demo/lib/jsonld.js omars-demo/lib/jsonld.test.js omars-demo/components/JsonLd.js omars-demo/app/layout.js
git commit -m "Emit schema.org Restaurant JSON-LD from the root layout"
```

---

### Task 3: OG image and root layout metadata

**Files:**
- Create: `omars-demo/public/site-assets/og-image.jpg` (cropped from `bk-home.jpg`)
- Modify: `omars-demo/app/layout.js` (replace the `metadata` export)
- Modify: `omars-demo/app/page.js` (add home canonical)

**Interfaces:**
- Consumes: `BUSINESS` from Task 1.
- Produces: root `metadata` with `metadataBase`, `title.default`, `title.template: "%s | Omar's Fresh Seafood & Steaks"`, and OG/Twitter defaults. Tasks 4 and 5 rely on the template: their `title` values are the `%s` part only.

- [ ] **Step 1: Crop the OG image**

`bk-home.jpg` is 988x809. Crop to 1.91:1 (988x517) for OG. Run from `omars-demo/`:

```bash
sips -c 517 988 public/site-assets/bk-home.jpg --out public/site-assets/og-image.jpg
```

Expected: `og-image.jpg` created. Verify: `sips -g pixelWidth -g pixelHeight public/site-assets/og-image.jpg` reports 988x517.

- [ ] **Step 2: Replace the root metadata export**

In `omars-demo/app/layout.js`, add this import after the Footer import (JsonLd import from Task 2 is already there):

```js
import { BUSINESS } from "@/lib/business";
```

Replace the existing `metadata` export (currently `title: "Omar's Restaurant, Ashland, OR", description: "Steaks & seafood since 1946."`) with:

```js
export const metadata = {
  metadataBase: new URL(BUSINESS.siteUrl),
  title: {
    default: "Omar's Fresh Seafood & Steaks - Ashland, OR - Since 1946",
    template: "%s | Omar's Fresh Seafood & Steaks",
  },
  description:
    "Ashland's oldest restaurant and first public cocktail lounge. Fresh seafood, hand-cut steaks, and a full bar at 1380 Siskiyou Blvd. Open daily 11am to 10pm.",
  openGraph: {
    type: "website",
    siteName: "Omar's Fresh Seafood & Steaks",
    locale: "en_US",
    images: ["/site-assets/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

- [ ] **Step 3: Add the home page canonical**

In `omars-demo/app/page.js`, add above the `export default function Home()` line:

```js
export const metadata = {
  alternates: { canonical: "/" },
};
```

(Home keeps the layout's `title.default` and description; Next does not run `title.default` through the template, so the home title is exactly the default string.)

- [ ] **Step 4: Verify the build**

Run (from `omars-demo/`): `npm run build`
Expected: build succeeds

- [ ] **Step 5: Commit**

```bash
git add omars-demo/public/site-assets/og-image.jpg omars-demo/app/layout.js omars-demo/app/page.js
git commit -m "Add metadataBase, title template, and OG card defaults"
```

---

### Task 4: Per-page metadata for server pages

**Files:**
- Modify: `omars-demo/app/menus/page.js`
- Modify: `omars-demo/app/specials/page.js`
- Modify: `omars-demo/app/wine-list/page.js`
- Modify: `omars-demo/app/about/page.js`
- Modify: `omars-demo/app/catering/page.js`
- Modify: `omars-demo/app/events/page.js`
- Modify: `omars-demo/app/contact/page.js`

**Interfaces:**
- Consumes: the root `title.template` from Task 3 (each `title` below is the `%s` part).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add a metadata export to each of the seven pages**

In each file, add the `export const metadata = {...}` block after the imports (for `menus`, `specials`, `wine-list`, put it directly above the existing `export const dynamic = 'force-dynamic';` line). The exact block per file:

`app/menus/page.js`:

```js
export const metadata = {
  title: 'Steak & Seafood Menu',
  description:
    "Hand-cut steaks, fresh seafood, and house favorites made from scratch since 1946. Browse the full menu at Omar's in Ashland, Oregon.",
  alternates: { canonical: '/menus' },
};
```

`app/specials/page.js`:

```js
export const metadata = {
  title: 'Daily Specials',
  description:
    "Our specials board changes daily: fresh catch, chef's cuts, and seasonal dishes. See what's on at Omar's in Ashland today.",
  alternates: { canonical: '/specials' },
};
```

`app/wine-list/page.js`:

```js
export const metadata = {
  title: 'Wine List & Cocktails',
  description:
    "Northwest and California wines by the glass and bottle, plus classic cocktails at Ashland's first public cocktail lounge, pouring since 1946.",
  alternates: { canonical: '/wine-list' },
};
```

`app/about/page.js`:

```js
export const metadata = {
  title: "About Omar's, Serving Ashland Since 1946",
  description:
    "The longest continuously operating restaurant between Portland and Redding. Read the story behind Ashland's oldest restaurant and its neon sign.",
  alternates: { canonical: '/about' },
};
```

`app/catering/page.js`:

```js
export const metadata = {
  title: 'Catering in Ashland & the Rogue Valley',
  description:
    "Full-service catering from Omar's: hors d'oeuvres, elegant buffets, staffed service, and licensed bar service for events across the Rogue Valley.",
  alternates: { canonical: '/catering' },
};
```

`app/events/page.js`:

```js
export const metadata = {
  title: 'Private Events & Parties',
  description:
    "Host your party at Omar's. Build-your-own menus for groups of 20 or more, no room fee Tuesdays and Wednesdays, and the 72oz Conquer the Cut challenge.",
  alternates: { canonical: '/events' },
};
```

`app/contact/page.js`:

```js
export const metadata = {
  title: 'Contact & Reservations',
  description:
    "Omar's is at 1380 Siskiyou Blvd, Ashland, OR 97520. Call 541.482.1281 for reservations. Open daily, 11am to 10pm, for dine-in and take-out.",
  alternates: { canonical: '/contact' },
};
```

- [ ] **Step 2: Verify the build**

Run (from `omars-demo/`): `npm run build`
Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
git add omars-demo/app/menus/page.js omars-demo/app/specials/page.js omars-demo/app/wine-list/page.js omars-demo/app/about/page.js omars-demo/app/catering/page.js omars-demo/app/events/page.js omars-demo/app/contact/page.js
git commit -m "Add per-page titles, descriptions, and canonicals to server pages"
```

---

### Task 5: Metadata layouts for client pages

**Files:**
- Create: `omars-demo/app/order/layout.js`
- Create: `omars-demo/app/reserve/layout.js`
- Create: `omars-demo/app/store/layout.js`
- Create: `omars-demo/app/admin/layout.js`

**Interfaces:**
- Consumes: the root `title.template` from Task 3.
- Produces: nothing consumed by later tasks.

These four pages are `'use client'` components and cannot export `metadata`. Each gets a pass-through layout whose only job is the metadata export.

- [ ] **Step 1: Create the four layout files**

`app/order/layout.js`:

```js
export const metadata = {
  title: 'Order Takeout Online',
  description:
    "Order Omar's steaks and seafood to go. Online ordering for pickup at 1380 Siskiyou Blvd in Ashland, open daily 11am to 10pm.",
  alternates: { canonical: '/order' },
};

export default function OrderLayout({ children }) {
  return children;
}
```

`app/reserve/layout.js`:

```js
export const metadata = {
  title: 'Reserve a Table',
  description:
    "Book a table at Omar's in Ashland, Oregon. Reserve online in seconds or call 541.482.1281.",
  alternates: { canonical: '/reserve' },
};

export default function ReserveLayout({ children }) {
  return children;
}
```

`app/store/layout.js`:

```js
export const metadata = {
  title: 'Gift Cards',
  description:
    "Give the gift of Omar's. Gift cards from Ashland's landmark steak and seafood house, est. 1946.",
  alternates: { canonical: '/store' },
};

export default function StoreLayout({ children }) {
  return children;
}
```

`app/admin/layout.js`:

```js
export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return children;
}
```

- [ ] **Step 2: Verify the build**

Run (from `omars-demo/`): `npm run build`
Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
git add omars-demo/app/order/layout.js omars-demo/app/reserve/layout.js omars-demo/app/store/layout.js omars-demo/app/admin/layout.js
git commit -m "Add metadata layouts for client pages, noindex admin"
```

---

### Task 6: Sitemap and robots

**Files:**
- Create: `omars-demo/app/sitemap.js`
- Create: `omars-demo/app/robots.js`

**Interfaces:**
- Consumes: `BUSINESS.siteUrl` from Task 1.
- Produces: `/sitemap.xml` and `/robots.txt` at runtime (Next file conventions).

- [ ] **Step 1: Create the sitemap**

`app/sitemap.js`:

```js
import { BUSINESS } from '@/lib/business';

const ROUTES = [
  '',
  '/menus',
  '/specials',
  '/wine-list',
  '/about',
  '/catering',
  '/events',
  '/contact',
  '/order',
  '/reserve',
  '/store',
];

export default function sitemap() {
  return ROUTES.map((route) => ({
    url: `${BUSINESS.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/specials' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));
}
```

- [ ] **Step 2: Create robots**

`app/robots.js`:

```js
import { BUSINESS } from '@/lib/business';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${BUSINESS.siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verify the build**

Run (from `omars-demo/`): `npm run build`
Expected: build succeeds; build output lists `/sitemap.xml` and `/robots.txt` routes

- [ ] **Step 4: Commit**

```bash
git add omars-demo/app/sitemap.js omars-demo/app/robots.js
git commit -m "Add sitemap.xml and robots.txt via Next file conventions"
```

---

### Task 7: Redirect /shop to /store

**Files:**
- Modify: `omars-demo/next.config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: permanent (308) redirect `/shop` → `/store`. The old site's only URL that has no same-path equivalent in the rebuild.

- [ ] **Step 1: Add the redirect**

Replace the contents of `omars-demo/next.config.mjs` with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/store',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

(Next normalizes trailing slashes itself, so old links to `/shop/` also land on `/store`.)

- [ ] **Step 2: Verify the build**

Run (from `omars-demo/`): `npm run build`
Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
git add omars-demo/next.config.mjs
git commit -m "Redirect old /shop URL to /store"
```

---

### Task 8: Footer and Contact read from business constants

**Files:**
- Modify: `omars-demo/components/Footer.js`
- Modify: `omars-demo/app/contact/page.js`

**Interfaces:**
- Consumes: `BUSINESS` from Task 1 (`address`, `phoneDisplay`, `email`, `social`).
- Produces: nothing consumed by later tasks. Rendered NAP text must stay byte-identical to today's output.

- [ ] **Step 1: Refactor Footer**

In `omars-demo/components/Footer.js`, add the import:

```js
import { BUSINESS } from '@/lib/business';
```

Replace the two hardcoded contact lines:

```js
          <p className="text-sm mt-3">1380 Siskiyou Blvd, Ashland, OR 97520</p>
          <p className="text-sm">541.482.1281 &middot; omarsrestaurant@gmail.com</p>
```

with:

```js
          <p className="text-sm mt-3">
            {BUSINESS.address.street}, {BUSINESS.address.city}, {BUSINESS.address.state}{' '}
            {BUSINESS.address.zip}
          </p>
          <p className="text-sm">
            {BUSINESS.phoneDisplay} &middot; {BUSINESS.email}
          </p>
```

Replace the two social hrefs: `href="https://www.instagram.com/omarsrestaurant/"` becomes `href={BUSINESS.social.instagram}` and `href="https://www.facebook.com/omarsfreshseafoodsteaks/"` becomes `href={BUSINESS.social.facebook}`. Leave everything else (classNames, labels) untouched.

- [ ] **Step 2: Refactor Contact page**

In `omars-demo/app/contact/page.js`, add the import:

```js
import { BUSINESS } from '@/lib/business';
```

Replace:

```js
      <p className="mb-2">1380 Siskiyou Blvd, Ashland, Oregon 97520</p>
      <p className="mb-2">Tel: 541.482.1281 &middot; omarsrestaurant@gmail.com</p>
```

with:

```js
      <p className="mb-2">
        {BUSINESS.address.street}, {BUSINESS.address.city}, Oregon {BUSINESS.address.zip}
      </p>
      <p className="mb-2">
        Tel: {BUSINESS.phoneDisplay} &middot; {BUSINESS.email}
      </p>
```

Leave the hours, holiday, lounge, and awards copy as hardcoded prose (it is page copy, not NAP data).

- [ ] **Step 3: Verify build and tests**

Run (from `omars-demo/`): `npm run build && npm test`
Expected: both pass

- [ ] **Step 4: Commit**

```bash
git add omars-demo/components/Footer.js omars-demo/app/contact/page.js
git commit -m "Read footer and contact NAP details from business constants"
```

---

### Task 9: End-to-end verification

**Files:**
- No new files. Runs the production server and checks rendered output.

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Build and start the production server**

From `omars-demo/`:

```bash
npm run build
npm start -- -p 3100 &
sleep 3
```

- [ ] **Step 2: Verify JSON-LD on the home page**

```bash
curl -s http://localhost:3100/ | grep -o 'application/ld+json' | head -1
curl -s http://localhost:3100/ | grep -o '"@type":"Restaurant"'
```

Expected: both lines print (`application/ld+json` and `"@type":"Restaurant"`).

- [ ] **Step 3: Verify titles, description, and canonical**

```bash
curl -s http://localhost:3100/ | grep -o '<title>[^<]*</title>'
curl -s http://localhost:3100/menus | grep -o '<title>[^<]*</title>'
curl -s http://localhost:3100/menus | grep -o 'rel="canonical" href="[^"]*"'
curl -s http://localhost:3100/order | grep -o '<title>[^<]*</title>'
```

Expected:
- home: `<title>Omar&#x27;s Fresh Seafood &amp; Steaks - Ashland, OR - Since 1946</title>` (entity-encoding may vary; text must match)
- menus: `Steak & Seafood Menu | Omar's Fresh Seafood & Steaks` (encoded)
- menus canonical: `href="https://omarsrestaurant.com/menus"`
- order: `Order Takeout Online | Omar's Fresh Seafood & Steaks` (encoded)

- [ ] **Step 4: Verify OG tags, admin noindex, robots, sitemap, redirect**

```bash
curl -s http://localhost:3100/ | grep -o 'property="og:image" content="[^"]*"'
curl -s http://localhost:3100/admin | grep -io 'noindex'
curl -s http://localhost:3100/robots.txt
curl -s http://localhost:3100/sitemap.xml | head -5
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3100/shop
```

Expected:
- og:image contains `/site-assets/og-image.jpg`
- admin page contains `noindex`
- robots.txt shows `Disallow: /admin`, `Disallow: /api`, and the sitemap line
- sitemap.xml is XML listing `https://omarsrestaurant.com/` first
- `/shop` prints `308` and a redirect URL ending in `/store`

- [ ] **Step 5: Alt-text sanity pass**

```bash
grep -rn 'alt=' omars-demo/app omars-demo/components | grep -v node_modules
```

Review the list: every alt should be descriptive (they already are, e.g. "Seared scallops at Omar's"). Only fix an alt if it is empty on a non-decorative image or generic like "photo". Do not churn alts that are already descriptive.

- [ ] **Step 6: Stop the server, final test run**

```bash
kill %1 2>/dev/null
npm test
```

Expected: all tests pass.

- [ ] **Step 7: Commit any verification fixes (only if Step 5 changed something)**

```bash
git add -A omars-demo/app omars-demo/components
git commit -m "Fix alt text found in verification pass"
```

If nothing changed, skip the commit.

---

## Out of scope (agreed in spec)

- Data-driven `Menu` JSON-LD from SQLite (approach C, later phase / care plan)
- Copy and keyword rewrites
- Off-site work (Google Business Profile, Yelp, OpenTable)
- Per-page OG images
