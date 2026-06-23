# Omar's Restaurant Redesign Demo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a browser-loadable pitch/demo redesign of omarsrestaurant.com in the "Classic Steakhouse" visual direction, with working (but not production-grade) reservations, online ordering, a CMS for menu/specials/wine content, and contact/newsletter forms.

**Architecture:** Next.js (App Router) + Tailwind CSS, with a local SQLite file (via `better-sqlite3`) as the only persistence layer. No external services, no payment processing, no real auth beyond a single admin password.

**Tech Stack:** Next.js 14 (App Router), React, Tailwind CSS, better-sqlite3, Node's built-in test runner (`node:test`) for DB-layer unit tests.

## Global Constraints

- Visual direction: dark walnut/brown base (#2b2018), deep burgundy accent (#6e1f1f), brass/gold trim (#c9a24b), serif headline font (e.g. "Georgia"/"Playfair Display"), clean sans-serif body font.
- No real payment processing, no real POS/table-management integration, no live social media API pull (use curated Unsplash photos as stand-ins).
- Single shared admin password via env var (`ADMIN_PASSWORD`) — no per-user accounts.
- Persistence is a single SQLite file (`data/omars.db`), no hosted database.
- Testing: automated unit tests for the DB layer only; all pages/flows verified by manual click-through per the spec's "Testing" section.

---

## File Structure

```
omars-demo/
  data/
    omars.db                  (generated at runtime, gitignored)
  lib/
    db.js                     schema + connection + seed
    queries.js                CRUD functions used by pages/API routes
    queries.test.js           unit tests for queries.js
  app/
    layout.js                 root layout: fonts, nav, footer, social icons
    globals.css                Tailwind + brand tokens
    page.js                   Home
    about/page.js
    menus/page.js
    specials/page.js
    wine-list/page.js
    catering/page.js
    events/page.js
    store/page.js
    contact/page.js
    reserve/page.js
    order/page.js
    admin/page.js
    api/
      reservations/route.js
      orders/route.js
      contact/route.js
      newsletter/route.js
      admin/menu-items/route.js
      admin/specials/route.js
      admin/wine-list/route.js
  components/
    Nav.js
    Footer.js
    SocialFeed.js
    MenuList.js
    Cart.js (client component, used by order/page.js)
  package.json
  tailwind.config.js
  README.md
```

---

### Task 1: Project Scaffold, Brand Tokens, Layout Shell

**Files:**
- Create: `package.json`, `tailwind.config.js`, `postcss.config.js`, `next.config.js`
- Create: `app/layout.js`, `app/globals.css`, `app/page.js` (placeholder home)
- Create: `components/Nav.js`, `components/Footer.js`
- Create: `.gitignore`

**Interfaces:**
- Produces: Tailwind theme tokens `brand-dark` (#2b2018), `brand-burgundy` (#6e1f1f), `brand-gold` (#c9a24b), `brand-cream` (#f4ebd9); font families `font-serif` (headlines) and `font-sans` (body). All later page tasks consume these classes.
- Produces: `<Nav />` and `<Footer />` components rendering the 9-page nav (Home, Menus, Specials, Wine List, About, Catering, Events, Store, Contact) plus Reserve/Order links and social icons. Later tasks do not modify these.

- [ ] **Step 1: Initialize the Next.js project**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
npx create-next-app@latest omars-demo --js --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm
```

When prompted, accept defaults. This creates the `omars-demo/` directory with Next.js + Tailwind already wired up.

- [ ] **Step 2: Configure Tailwind brand tokens**

Edit `omars-demo/tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#2b2018',
        'brand-burgundy': '#6e1f1f',
        'brand-gold': '#c9a24b',
        'brand-cream': '#f4ebd9',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 3: Set up root layout with nav and footer**

Create `omars-demo/components/Nav.js`:

```jsx
import Link from 'next/link';

const LINKS = [
  ['Home', '/'],
  ['Menus', '/menus'],
  ['Specials', '/specials'],
  ['Wine List', '/wine-list'],
  ['About', '/about'],
  ['Catering', '/catering'],
  ['Events', '/events'],
  ['Store', '/store'],
  ['Contact', '/contact'],
];

export default function Nav() {
  return (
    <header className="bg-brand-dark text-brand-cream border-b border-brand-gold">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl tracking-widest text-brand-gold">
          OMAR&apos;S
        </Link>
        <nav className="hidden md:flex gap-5 text-sm uppercase tracking-wide">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-brand-gold">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex gap-3">
          <Link
            href="/reserve"
            className="border border-brand-gold text-brand-gold px-3 py-1.5 text-sm uppercase tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Reserve
          </Link>
          <Link
            href="/order"
            className="bg-brand-burgundy text-brand-cream px-3 py-1.5 text-sm uppercase tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Order
          </Link>
        </div>
      </div>
    </header>
  );
}
```

Create `omars-demo/components/Footer.js`:

```jsx
export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream border-t border-brand-gold mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="font-serif text-xl text-brand-gold">OMAR&apos;S</p>
          <p className="text-sm mt-2">1380 Siskiyou Blvd, Ashland, OR 97520</p>
          <p className="text-sm">541.482.1281</p>
          <p className="text-sm mt-2">Est. 1946 &middot; Ashland&apos;s oldest restaurant</p>
        </div>
        <div className="flex gap-4 items-start">
          <a
            href="https://www.instagram.com/omarsrestaurant/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-gold hover:text-brand-cream"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/omarsfreshseafoodsteaks/"
            target="_blank"
            rel="noreferrer"
            className="text-brand-gold hover:text-brand-cream"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
```

Edit `omars-demo/app/layout.js`:

```jsx
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = {
  title: "Omar's Restaurant — Ashland, OR",
  description: 'Steaks & seafood since 1946.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-brand-cream text-brand-dark font-sans">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Replace `omars-demo/app/page.js` with a temporary placeholder (Task 3 builds the real Home page):

```jsx
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl text-brand-burgundy">Omar&apos;s — coming together</h1>
    </div>
  );
}
```

- [ ] **Step 4: Run the dev server and verify manually**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
npm run dev
```

Open `http://localhost:3000`. Expected: dark header with "OMAR'S" in gold serif type, nav links, Reserve/Order buttons, cream page background, footer with address/phone/social links. Stop the server (Ctrl+C) once confirmed.

- [ ] **Step 5: Commit**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
git add omars-demo
git commit -m "Scaffold Next.js app with classic-steakhouse brand shell"
```

---

### Task 2: SQLite Schema, Seed Data, and Query Layer (TDD)

**Files:**
- Create: `omars-demo/lib/db.js`
- Create: `omars-demo/lib/queries.js`
- Create: `omars-demo/lib/queries.test.js`
- Modify: `omars-demo/.gitignore` (add `data/*.db`)
- Modify: `omars-demo/package.json` (add `better-sqlite3`, add `"test": "node --test lib/*.test.js"`)

**Interfaces:**
- Produces (consumed by every later page/API task):
  - `getMenuItems()` → `[{id, category, name, description, price}]`
  - `getSpecials()` → `[{id, name, description, price, active_range}]`
  - `getWineList()` → `[{id, category, name, description, price}]`
  - `addMenuItem({category, name, description, price})` → inserted row id
  - `updateMenuItem(id, {category, name, description, price})` → void
  - `deleteMenuItem(id)` → void
  - (same add/update/delete trio for specials and wine list: `addSpecial`/`updateSpecial`/`deleteSpecial`, `addWineItem`/`updateWineItem`/`deleteWineItem`)
  - `createReservation({name, contact, date, time, partySize, notes})` → inserted row id
  - `createOrder({customerName, contact, items, total})` → inserted row id (`items` stored as JSON string)
  - `createContactSubmission({name, contact, subject, message})` → inserted row id
  - `createNewsletterSignup({email})` → inserted row id

- [ ] **Step 1: Install dependency**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
npm install better-sqlite3
```

- [ ] **Step 2: Write the failing test for the query layer**

Create `omars-demo/lib/queries.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const TEST_DB_PATH = path.join(__dirname, '..', 'data', 'test.db');
process.env.OMARS_DB_PATH = TEST_DB_PATH;

test.beforeEach(() => {
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
});

test.after(() => {
  if (fs.existsSync(TEST_DB_PATH)) fs.unlinkSync(TEST_DB_PATH);
});

test('addMenuItem then getMenuItems returns the item', () => {
  const { addMenuItem, getMenuItems } = require('./queries');
  addMenuItem({ category: 'Steaks', name: 'Ribeye', description: '14oz, hand-cut', price: 48 });
  const items = getMenuItems();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].name, 'Ribeye');
  assert.strictEqual(items[0].price, 48);
});

test('updateMenuItem changes the stored row', () => {
  const { addMenuItem, updateMenuItem, getMenuItems } = require('./queries');
  const id = addMenuItem({ category: 'Steaks', name: 'Ribeye', description: '14oz', price: 48 });
  updateMenuItem(id, { category: 'Steaks', name: 'Ribeye', description: '16oz', price: 52 });
  const items = getMenuItems();
  assert.strictEqual(items[0].description, '16oz');
  assert.strictEqual(items[0].price, 52);
});

test('deleteMenuItem removes the row', () => {
  const { addMenuItem, deleteMenuItem, getMenuItems } = require('./queries');
  const id = addMenuItem({ category: 'Steaks', name: 'Ribeye', description: '14oz', price: 48 });
  deleteMenuItem(id);
  assert.strictEqual(getMenuItems().length, 0);
});

test('createReservation stores a reservation', () => {
  const { createReservation } = require('./queries');
  const id = createReservation({
    name: 'Jane Doe',
    contact: 'jane@example.com',
    date: '2026-07-01',
    time: '19:00',
    partySize: 4,
    notes: 'Window seat please',
  });
  assert.ok(id > 0);
});

test('createOrder stores items as retrievable JSON', () => {
  const { createOrder, getOrderById } = require('./queries');
  const id = createOrder({
    customerName: 'Jane Doe',
    contact: 'jane@example.com',
    items: [{ name: 'Ribeye', qty: 1, price: 48 }],
    total: 48,
  });
  const order = getOrderById(id);
  assert.strictEqual(order.total, 48);
  assert.deepStrictEqual(JSON.parse(order.items), [{ name: 'Ribeye', qty: 1, price: 48 }]);
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
node --test lib/queries.test.js
```

Expected: FAIL — `Cannot find module './queries'`.

- [ ] **Step 4: Write the schema/connection module**

Create `omars-demo/lib/db.js`:

```js
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.OMARS_DB_PATH || path.join(__dirname, '..', 'data', 'omars.db');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS specials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    active_range TEXT
  );

  CREATE TABLE IF NOT EXISTS wine_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    party_size INTEGER NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    contact TEXT NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'received',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletter_signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
```

- [ ] **Step 5: Write the query layer to make tests pass**

Create `omars-demo/lib/queries.js`:

```js
const db = require('./db');

function getMenuItems() {
  return db.prepare('SELECT * FROM menu_items ORDER BY category, name').all();
}
function addMenuItem({ category, name, description, price }) {
  const result = db
    .prepare('INSERT INTO menu_items (category, name, description, price) VALUES (?, ?, ?, ?)')
    .run(category, name, description, price);
  return result.lastInsertRowid;
}
function updateMenuItem(id, { category, name, description, price }) {
  db.prepare(
    'UPDATE menu_items SET category = ?, name = ?, description = ?, price = ? WHERE id = ?'
  ).run(category, name, description, price, id);
}
function deleteMenuItem(id) {
  db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
}

function getSpecials() {
  return db.prepare('SELECT * FROM specials ORDER BY id').all();
}
function addSpecial({ name, description, price, activeRange }) {
  const result = db
    .prepare('INSERT INTO specials (name, description, price, active_range) VALUES (?, ?, ?, ?)')
    .run(name, description, price, activeRange);
  return result.lastInsertRowid;
}
function updateSpecial(id, { name, description, price, activeRange }) {
  db.prepare(
    'UPDATE specials SET name = ?, description = ?, price = ?, active_range = ? WHERE id = ?'
  ).run(name, description, price, activeRange, id);
}
function deleteSpecial(id) {
  db.prepare('DELETE FROM specials WHERE id = ?').run(id);
}

function getWineList() {
  return db.prepare('SELECT * FROM wine_list ORDER BY category, name').all();
}
function addWineItem({ category, name, description, price }) {
  const result = db
    .prepare('INSERT INTO wine_list (category, name, description, price) VALUES (?, ?, ?, ?)')
    .run(category, name, description, price);
  return result.lastInsertRowid;
}
function updateWineItem(id, { category, name, description, price }) {
  db.prepare(
    'UPDATE wine_list SET category = ?, name = ?, description = ?, price = ? WHERE id = ?'
  ).run(category, name, description, price, id);
}
function deleteWineItem(id) {
  db.prepare('DELETE FROM wine_list WHERE id = ?').run(id);
}

function createReservation({ name, contact, date, time, partySize, notes }) {
  const result = db
    .prepare(
      'INSERT INTO reservations (name, contact, date, time, party_size, notes) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(name, contact, date, time, partySize, notes || '');
  return result.lastInsertRowid;
}

function createOrder({ customerName, contact, items, total }) {
  const result = db
    .prepare('INSERT INTO orders (customer_name, contact, items, total) VALUES (?, ?, ?, ?)')
    .run(customerName, contact, JSON.stringify(items), total);
  return result.lastInsertRowid;
}
function getOrderById(id) {
  return db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
}

function createContactSubmission({ name, contact, subject, message }) {
  const result = db
    .prepare(
      'INSERT INTO contact_submissions (name, contact, subject, message) VALUES (?, ?, ?, ?)'
    )
    .run(name, contact, subject || '', message);
  return result.lastInsertRowid;
}

function createNewsletterSignup({ email }) {
  const result = db
    .prepare('INSERT INTO newsletter_signups (email) VALUES (?)')
    .run(email);
  return result.lastInsertRowid;
}

module.exports = {
  getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem,
  getSpecials, addSpecial, updateSpecial, deleteSpecial,
  getWineList, addWineItem, updateWineItem, deleteWineItem,
  createReservation,
  createOrder, getOrderById,
  createContactSubmission,
  createNewsletterSignup,
};
```

- [ ] **Step 6: Run the test to verify it passes**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
node --test lib/queries.test.js
```

Expected: PASS, 6 tests passing.

- [ ] **Step 7: Write the seed script with realistic Omar's menu content**

Create `omars-demo/lib/seed.js`:

```js
const { addMenuItem, addSpecial, addWineItem, getMenuItems } = require('./queries');

function seed() {
  if (getMenuItems().length > 0) {
    console.log('Already seeded, skipping.');
    return;
  }

  const menuItems = [
    ['Steaks', 'Hand-Cut Ribeye (14oz)', 'Dry-aged 6 weeks, char-grilled', 48],
    ['Steaks', 'Filet Mignon (8oz)', 'Center-cut, dry-aged 6 weeks', 46],
    ['Steaks', 'New York Strip (12oz)', 'Dry-aged 6 weeks', 42],
    ['Seafood', 'Fresh Catch of the Day', 'Delivered fresh, market price', 38],
    ['Seafood', 'Grilled Salmon', 'Wild-caught, lemon-butter sauce', 32],
    ['Seafood', 'Jumbo Prawns', 'Garlic butter, fresh herbs', 34],
    ['Appetizers', 'French Onion Soup', 'Made from scratch daily', 11],
    ['Appetizers', "Omar's Salad", 'House dressing, made from scratch', 9],
    ['Sides', 'Garlic Mashed Potatoes', '', 8],
    ['Sides', 'Grilled Asparagus', '', 9],
    ['Desserts', 'New York Cheesecake', '', 10],
  ];
  for (const [category, name, description, price] of menuItems) {
    addMenuItem({ category, name, description, price });
  }

  addSpecial({
    name: "Chef's Surf & Turf",
    description: '8oz filet + jumbo prawns, served with seasonal vegetables',
    price: 56,
    activeRange: 'This week',
  });

  const wines = [
    ['Red', 'Oregon Pinot Noir', 'Willamette Valley', 14],
    ['Red', 'Cabernet Sauvignon', 'Napa Valley', 16],
    ['White', 'Chardonnay', 'Buttery, oak-aged', 12],
    ['White', 'Sauvignon Blanc', 'Crisp, citrus notes', 11],
  ];
  for (const [category, name, description, price] of wines) {
    addWineItem({ category, name, description, price });
  }

  console.log('Seed complete.');
}

seed();
```

- [ ] **Step 8: Run the seed script and verify manually**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
node lib/seed.js
node -e "console.log(require('./lib/queries').getMenuItems().length)"
```

Expected: "Seed complete." then a count of `11`.

- [ ] **Step 9: Update .gitignore and package.json test script**

Edit `omars-demo/.gitignore`, add:

```
data/*.db
data/*.db-*
```

Edit `omars-demo/package.json` scripts block to add:

```json
"test": "node --test lib/*.test.js"
```

- [ ] **Step 10: Commit**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
git add omars-demo
git commit -m "Add SQLite schema, query layer with tests, and seed data"
```

---

### Task 3: Static Content Pages (Home, About, Menus, Specials, Wine List, Catering, Events, Store, Contact)

**Files:**
- Modify: `omars-demo/app/page.js` (real Home page)
- Create: `omars-demo/app/about/page.js`
- Create: `omars-demo/app/menus/page.js`
- Create: `omars-demo/app/specials/page.js`
- Create: `omars-demo/app/wine-list/page.js`
- Create: `omars-demo/app/catering/page.js`
- Create: `omars-demo/app/events/page.js`
- Create: `omars-demo/app/store/page.js`
- Create: `omars-demo/app/contact/page.js`
- Create: `omars-demo/app/api/contact/route.js`
- Create: `omars-demo/components/MenuList.js`

**Interfaces:**
- Consumes: `getMenuItems()`, `getSpecials()`, `getWineList()` from `lib/queries.js` (Task 2).
- Consumes: `createContactSubmission({name, contact, subject, message})` from `lib/queries.js` (Task 2). Used by Contact, Catering, and Events page forms (subject distinguishes them, e.g. `'catering'`/`'events'`/`'general'`).
- Produces: `<MenuList items={[...]} />` component grouping items by `category`, used by Menus and Wine List pages.

- [ ] **Step 1: Build the shared MenuList component**

Create `omars-demo/components/MenuList.js`:

```jsx
export default function MenuList({ items }) {
  const byCategory = items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      {Object.entries(byCategory).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="font-serif text-2xl text-brand-burgundy border-b border-brand-gold pb-2 mb-4">
            {category}
          </h3>
          <ul className="space-y-3">
            {categoryItems.map((item) => (
              <li key={item.id} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.description && (
                    <p className="text-sm text-brand-dark/70">{item.description}</p>
                  )}
                </div>
                <p className="font-serif text-brand-gold whitespace-nowrap">
                  ${item.price.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Build the Home page**

Replace `omars-demo/app/page.js`:

```jsx
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <section className="bg-brand-dark text-brand-cream py-24 px-6 text-center">
        <h1 className="font-serif text-5xl text-brand-gold tracking-wide">OMAR&apos;S</h1>
        <p className="mt-4 text-lg">Est. 1946 &middot; Steaks &amp; Seafood &middot; Ashland, OR</p>
        <p className="mt-2 text-brand-cream/80 max-w-xl mx-auto">
          Ashland&apos;s oldest restaurant and first public cocktail lounge &mdash; the longest
          continuously operating restaurant from Portland, Oregon to Redding, California.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/reserve" className="bg-brand-gold text-brand-dark px-6 py-3 uppercase tracking-wide text-sm hover:bg-brand-cream transition">
            Reserve a Table
          </Link>
          <Link href="/order" className="border border-brand-gold text-brand-gold px-6 py-3 uppercase tracking-wide text-sm hover:bg-brand-gold hover:text-brand-dark transition">
            Order Online
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-3xl text-brand-burgundy">Hand-cut steaks, fresh seafood</h2>
        <p className="mt-4 text-brand-dark/80">
          Our steaks are hand-cut and dry-aged six weeks. Fish arrives fresh three to five times a
          week. Soups, dressings, sauces, and stocks are made from scratch &mdash; the way they have
          been since 1946.
        </p>
        <Link href="/about" className="inline-block mt-4 text-brand-burgundy underline">
          Read our story
        </Link>
      </section>
    </div>
  );
}
```

(The homepage social feed section is added in Task 7, after the `SocialFeed` component exists.)

- [ ] **Step 3: Build About, Catering, Events, Store, Contact pages**

Create `omars-demo/app/about/page.js`:

```jsx
export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-6">Our Story</h1>
      <p className="mb-4">
        Omar&apos;s opened in 1946 as Ashland&apos;s first public cocktail lounge. Today it is the
        longest continuously operating restaurant from Portland, Oregon to Redding, California.
      </p>
      <p className="mb-4">
        We hand-cut every steak and dry-age it six weeks. Fresh fish arrives three to five times a
        week. Our soups, dressings, sauces, and stocks are made from scratch, every day &mdash; the
        same way they were in 1946.
      </p>
      <p>
        We aim for a warm, comfortable, relaxing dining room, the kind of place where regulars have
        been coming for generations.
      </p>
    </div>
  );
}
```

Create `omars-demo/app/catering/page.js`:

```jsx
import InquiryForm from '@/components/InquiryForm';

export default function Catering() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Catering</h1>
      <p className="mb-8">
        Let Omar&apos;s cater your next gathering &mdash; from office lunches to full-service events.
        Tell us about your event below and we&apos;ll follow up.
      </p>
      <InquiryForm subject="catering" />
    </div>
  );
}
```

Create `omars-demo/app/events/page.js`:

```jsx
import InquiryForm from '@/components/InquiryForm';

export default function Events() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Private Events</h1>
      <p className="mb-8">
        Host your next private event in our dining room. Tell us a bit about what you&apos;re
        planning and we&apos;ll be in touch.
      </p>
      <InquiryForm subject="events" />
    </div>
  );
}
```

Create `omars-demo/app/store/page.js`:

```jsx
'use client';
import { useState } from 'react';

const ITEMS = [
  { id: 'gift-25', name: '$25 Gift Card', price: 25 },
  { id: 'gift-50', name: '$50 Gift Card', price: 50 },
  { id: 'gift-100', name: '$100 Gift Card', price: 100 },
];

export default function Store() {
  const [confirmed, setConfirmed] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Gift Cards</h1>
      <p className="mb-8 text-sm text-brand-dark/70">
        Demo only &mdash; this does not process real payments.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ITEMS.map((item) => (
          <div key={item.id} className="border border-brand-gold p-6 text-center">
            <p className="font-serif text-2xl text-brand-burgundy">{item.name}</p>
            <button
              onClick={() => setConfirmed(item.name)}
              className="mt-4 bg-brand-burgundy text-brand-cream px-4 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
      {confirmed && (
        <p className="mt-6 text-brand-burgundy">
          Thanks! Your {confirmed} purchase is confirmed (demo &mdash; no real charge was made).
        </p>
      )}
    </div>
  );
}
```

Create `omars-demo/app/contact/page.js`:

```jsx
import InquiryForm from '@/components/InquiryForm';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-4">Contact</h1>
      <p className="mb-2">1380 Siskiyou Blvd, Ashland, OR 97520</p>
      <p className="mb-2">541.482.1281</p>
      <p className="mb-8">Open 7 days a week, 11am&ndash;10pm. Closed legal holidays.</p>
      <InquiryForm subject="general" />
    </div>
  );
}
```

- [ ] **Step 4: Build the shared InquiryForm component and its API route**

Create `omars-demo/components/InquiryForm.js`:

```jsx
'use client';
import { useState } from 'react';

export default function InquiryForm({ subject }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      name: form.get('name'),
      contact: form.get('contact'),
      subject,
      message: form.get('message'),
    };
    if (!payload.name || !payload.contact || !payload.message) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setStatus('sending');
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setStatus(res.ok ? 'sent' : 'error');
  }

  if (status === 'sent') {
    return <p className="text-brand-burgundy">Thanks &mdash; we received your message.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-700 text-sm">{error}</p>}
      <input name="name" placeholder="Name" className="w-full border border-brand-gold px-3 py-2" />
      <input name="contact" placeholder="Email or phone" className="w-full border border-brand-gold px-3 py-2" />
      <textarea name="message" placeholder="Message" rows={4} className="w-full border border-brand-gold px-3 py-2" />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

Create `omars-demo/app/api/contact/route.js`:

```js
import { createContactSubmission } from '@/lib/queries';

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.contact || !body.message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  createContactSubmission(body);
  return Response.json({ ok: true });
}
```

- [ ] **Step 5: Build Menus, Specials, Wine List pages**

Create `omars-demo/app/menus/page.js`:

```jsx
import { getMenuItems } from '@/lib/queries';
import MenuList from '@/components/MenuList';

export default function Menus() {
  const items = getMenuItems();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Menu</h1>
      <MenuList items={items} />
    </div>
  );
}
```

Create `omars-demo/app/specials/page.js`:

```jsx
import { getSpecials } from '@/lib/queries';

export default function Specials() {
  const specials = getSpecials();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Specials</h1>
      <ul className="space-y-6">
        {specials.map((s) => (
          <li key={s.id} className="border-b border-brand-gold pb-4">
            <div className="flex justify-between">
              <p className="font-serif text-xl">{s.name}</p>
              <p className="font-serif text-brand-gold">${s.price.toFixed(2)}</p>
            </div>
            <p className="text-sm text-brand-dark/70">{s.description}</p>
            {s.active_range && (
              <p className="text-xs uppercase text-brand-burgundy mt-1">{s.active_range}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Create `omars-demo/app/wine-list/page.js`:

```jsx
import { getWineList } from '@/lib/queries';
import MenuList from '@/components/MenuList';

export default function WineList() {
  const items = getWineList();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Wine List</h1>
      <MenuList items={items} />
    </div>
  );
}
```

- [ ] **Step 6: Run the dev server and manually verify every page**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
npm run dev
```

Visit `/`, `/about`, `/menus`, `/specials`, `/wine-list`, `/catering`, `/events`, `/store`, `/contact`. Expected: each renders without error in the brand styling; Menus/Wine List show seeded items grouped by category; Specials shows the seeded surf & turf; submitting the Contact/Catering/Events form shows "Thanks — we received your message." Click "Buy" on a Store gift card and confirm the confirmation message appears. Stop the server once confirmed.

- [ ] **Step 7: Commit**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
git add omars-demo
git commit -m "Add static content pages reading from the query layer"
```

---

### Task 4: Reservations Flow

**Files:**
- Create: `omars-demo/app/reserve/page.js`
- Create: `omars-demo/app/api/reservations/route.js`

**Interfaces:**
- Consumes: `createReservation({name, contact, date, time, partySize, notes})` from `lib/queries.js` (Task 2).

- [ ] **Step 1: Build the API route**

Create `omars-demo/app/api/reservations/route.js`:

```js
import { createReservation } from '@/lib/queries';

export async function POST(request) {
  const body = await request.json();
  const { name, contact, date, time, partySize } = body;
  if (!name || !contact || !date || !time || !partySize) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (Number(partySize) < 1 || Number(partySize) > 20) {
    return Response.json({ error: 'Party size must be between 1 and 20' }, { status: 400 });
  }
  const id = createReservation({ ...body, partySize: Number(partySize) });
  return Response.json({ ok: true, id });
}
```

- [ ] **Step 2: Build the Reserve page**

Create `omars-demo/app/reserve/page.js`:

```jsx
'use client';
import { useState } from 'react';

export default function Reserve() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = {
      name: form.get('name'),
      contact: form.get('contact'),
      date: form.get('date'),
      time: form.get('time'),
      partySize: form.get('partySize'),
      notes: form.get('notes'),
    };
    if (!payload.name || !payload.contact || !payload.date || !payload.time || !payload.partySize) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStatus('sending');
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setStatus('confirmed');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
      setStatus('idle');
    }
  }

  if (status === 'confirmed') {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-serif text-3xl text-brand-burgundy">Reservation confirmed</h1>
        <p className="mt-4">We look forward to seeing you at Omar&apos;s.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Reserve a Table</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <input name="name" placeholder="Name" className="w-full border border-brand-gold px-3 py-2" />
        <input name="contact" placeholder="Email or phone" className="w-full border border-brand-gold px-3 py-2" />
        <div className="flex gap-4">
          <input type="date" name="date" className="w-full border border-brand-gold px-3 py-2" />
          <input type="time" name="time" className="w-full border border-brand-gold px-3 py-2" />
        </div>
        <input type="number" name="partySize" min="1" max="20" placeholder="Party size" className="w-full border border-brand-gold px-3 py-2" />
        <textarea name="notes" placeholder="Notes (optional)" rows={3} className="w-full border border-brand-gold px-3 py-2" />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition disabled:opacity-50"
        >
          {status === 'sending' ? 'Submitting...' : 'Reserve'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Run the dev server and manually verify**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
npm run dev
```

Visit `/reserve`. Submit with a missing field — expect an inline error, no crash. Submit a full valid form — expect "Reservation confirmed". Verify the row landed in SQLite:

```bash
node -e "console.log(require('better-sqlite3')('data/omars.db').prepare('SELECT * FROM reservations').all())"
```

Expected: one row matching what was submitted.

- [ ] **Step 4: Commit**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
git add omars-demo
git commit -m "Add reservations flow"
```

---

### Task 5: Online Ordering Flow

**Files:**
- Create: `omars-demo/app/order/page.js`
- Create: `omars-demo/app/api/orders/route.js`

**Interfaces:**
- Consumes: `getMenuItems()`, `createOrder({customerName, contact, items, total})` from `lib/queries.js` (Task 2).

- [ ] **Step 1: Build the API route**

Create `omars-demo/app/api/orders/route.js`:

```js
import { createOrder } from '@/lib/queries';

export async function POST(request) {
  const body = await request.json();
  const { customerName, contact, items, total } = body;
  if (!customerName || !contact || !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = createOrder({ customerName, contact, items, total });
  return Response.json({ ok: true, id });
}
```

- [ ] **Step 2: Build the Order page with client-side cart**

Create `omars-demo/app/order/page.js`:

```jsx
'use client';
import { useEffect, useState } from 'react';

export default function Order() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [step, setStep] = useState('browse');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/menu-items')
      .then((r) => r.json())
      .then(setMenu);
  }, []);

  function addToCart(item) {
    setCart((prev) => ({ ...prev, [item.id]: { item, qty: (prev[item.id]?.qty || 0) + 1 } }));
  }
  function removeFromCart(item) {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[item.id]) return prev;
      if (next[item.id].qty <= 1) delete next[item.id];
      else next[item.id] = { item, qty: next[item.id].qty - 1 };
      return next;
    });
  }

  const cartLines = Object.values(cart);
  const total = cartLines.reduce((sum, line) => sum + line.item.price * line.qty, 0);

  async function handleCheckout(e) {
    e.preventDefault();
    if (cartLines.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    const form = new FormData(e.target);
    const payload = {
      customerName: form.get('name'),
      contact: form.get('contact'),
      items: cartLines.map((l) => ({ name: l.item.name, qty: l.qty, price: l.item.price })),
      total,
    };
    if (!payload.customerName || !payload.contact) {
      setError('Please fill in your name and contact info.');
      return;
    }
    setError('');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) setStep('confirmed');
    else setError('Something went wrong placing your order.');
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="font-serif text-3xl text-brand-burgundy">Order placed</h1>
        <p className="mt-4">Thanks! This is a demo order &mdash; no real payment was charged.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
      <div className="md:col-span-2">
        <h1 className="font-serif text-4xl text-brand-burgundy mb-8">Order Online</h1>
        <ul className="space-y-3">
          {menu.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b border-brand-gold/40 pb-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-brand-dark/70">{item.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-brand-gold">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-brand-burgundy text-brand-cream px-3 py-1 text-sm uppercase hover:bg-brand-gold hover:text-brand-dark transition"
                >
                  Add
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-brand-burgundy mb-4">Your Order</h2>
        {cartLines.length === 0 && <p className="text-sm text-brand-dark/60">No items yet.</p>}
        <ul className="space-y-2 mb-4">
          {cartLines.map((line) => (
            <li key={line.item.id} className="flex justify-between items-center text-sm">
              <span>{line.qty} &times; {line.item.name}</span>
              <button onClick={() => removeFromCart(line.item)} className="text-brand-burgundy underline text-xs">
                remove
              </button>
            </li>
          ))}
        </ul>
        <p className="font-serif text-lg mb-4">Total: ${total.toFixed(2)}</p>
        <form onSubmit={handleCheckout} className="space-y-3">
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <input name="name" placeholder="Name" className="w-full border border-brand-gold px-3 py-2" />
          <input name="contact" placeholder="Email or phone" className="w-full border border-brand-gold px-3 py-2" />
          <button
            type="submit"
            className="w-full bg-brand-burgundy text-brand-cream px-4 py-2 uppercase text-sm tracking-wide hover:bg-brand-gold hover:text-brand-dark transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add the menu-items API route the Order page fetches from**

Create `omars-demo/app/api/menu-items/route.js`:

```js
import { getMenuItems } from '@/lib/queries';

export async function GET() {
  return Response.json(getMenuItems());
}
```

- [ ] **Step 4: Run the dev server and manually verify**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
npm run dev
```

Visit `/order`. Add two different items, confirm the cart total updates, remove one, confirm it decrements/removes correctly. Fill in name/contact and place the order — expect "Order placed". Verify persistence:

```bash
node -e "console.log(require('better-sqlite3')('data/omars.db').prepare('SELECT * FROM orders').all())"
```

Expected: one row with `items` as a JSON string matching the cart and the correct `total`.

- [ ] **Step 5: Commit**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
git add omars-demo
git commit -m "Add online ordering flow with client-side cart"
```

---

### Task 6: Admin CMS (Menu, Specials, Wine List)

**Files:**
- Create: `omars-demo/app/admin/page.js`
- Create: `omars-demo/app/api/admin/menu-items/route.js`
- Create: `omars-demo/app/api/admin/specials/route.js`
- Create: `omars-demo/app/api/admin/wine-list/route.js`
- Modify: `omars-demo/.env.local` (create if absent, add `ADMIN_PASSWORD=omars1946`)

**Interfaces:**
- Consumes: all add/update/delete functions from `lib/queries.js` (Task 2) for menu_items, specials, wine_list.
- Consumes: `ADMIN_PASSWORD` env var for the password gate (checked against a header `x-admin-password` sent by the admin page's fetch calls).

- [ ] **Step 1: Add the admin password env var**

Create `omars-demo/.env.local`:

```
ADMIN_PASSWORD=omars1946
```

- [ ] **Step 2: Build the admin API routes**

Create `omars-demo/app/api/admin/menu-items/route.js`:

```js
import { addMenuItem, updateMenuItem, deleteMenuItem, getMenuItems } from '@/lib/queries';

function checkAuth(request) {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json(getMenuItems());
}

export async function POST(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.name || !body.category || !body.price) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = addMenuItem(body);
  return Response.json({ ok: true, id });
}

export async function PUT(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Missing id' }, { status: 400 });
  updateMenuItem(body.id, body);
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  deleteMenuItem(id);
  return Response.json({ ok: true });
}
```

Create `omars-demo/app/api/admin/specials/route.js` (same pattern, specials functions):

```js
import { addSpecial, updateSpecial, deleteSpecial, getSpecials } from '@/lib/queries';

function checkAuth(request) {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json(getSpecials());
}

export async function POST(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.name || !body.price) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = addSpecial(body);
  return Response.json({ ok: true, id });
}

export async function PUT(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Missing id' }, { status: 400 });
  updateSpecial(body.id, body);
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  deleteSpecial(id);
  return Response.json({ ok: true });
}
```

Create `omars-demo/app/api/admin/wine-list/route.js` (same pattern, wine list functions):

```js
import { addWineItem, updateWineItem, deleteWineItem, getWineList } from '@/lib/queries';

function checkAuth(request) {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json(getWineList());
}

export async function POST(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.name || !body.category || !body.price) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = addWineItem(body);
  return Response.json({ ok: true, id });
}

export async function PUT(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Missing id' }, { status: 400 });
  updateWineItem(body.id, body);
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  deleteWineItem(id);
  return Response.json({ ok: true });
}
```

- [ ] **Step 3: Build the admin page (password gate + tabbed CRUD UI for menu items, specials, and wine list)**

Create `omars-demo/app/admin/page.js`:

```jsx
'use client';
import { useState } from 'react';

const TABS = {
  'menu-items': {
    label: 'Menu Items',
    endpoint: '/api/admin/menu-items',
    fields: ['category', 'name', 'description', 'price'],
    display: (item) => `${item.category} — ${item.name} ($${item.price.toFixed(2)})`,
  },
  specials: {
    label: 'Specials',
    endpoint: '/api/admin/specials',
    fields: ['name', 'description', 'price', 'activeRange'],
    display: (item) => `${item.name} ($${item.price.toFixed(2)})`,
  },
  'wine-list': {
    label: 'Wine List',
    endpoint: '/api/admin/wine-list',
    fields: ['category', 'name', 'description', 'price'],
    display: (item) => `${item.category} — ${item.name} ($${item.price.toFixed(2)})`,
  },
};

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('menu-items');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});

  async function loadTab(tabKey, pwd) {
    const res = await fetch(TABS[tabKey].endpoint, { headers: { 'x-admin-password': pwd } });
    if (!res.ok) throw new Error('Unauthorized');
    setItems(await res.json());
  }

  async function tryLogin(e) {
    e.preventDefault();
    try {
      await loadTab('menu-items', password);
      setAuthed(true);
      setError('');
    } catch {
      setError('Wrong password.');
    }
  }

  async function switchTab(tabKey) {
    setTab(tabKey);
    setForm({});
    await loadTab(tabKey, password);
  }

  async function addItem(e) {
    e.preventDefault();
    const payload = { ...form };
    if (payload.price) payload.price = Number(payload.price);
    await fetch(TABS[tab].endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload),
    });
    setForm({});
    loadTab(tab, password);
  }

  async function deleteItem(id) {
    if (!confirm('Delete this item?')) return;
    await fetch(TABS[tab].endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id }),
    });
    loadTab(tab, password);
  }

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto px-6 py-24">
        <h1 className="font-serif text-3xl text-brand-burgundy mb-6">Admin Login</h1>
        <form onSubmit={tryLogin} className="space-y-4">
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-brand-gold px-3 py-2"
          />
          <button type="submit" className="bg-brand-burgundy text-brand-cream px-5 py-2 uppercase text-sm">
            Log in
          </button>
        </form>
      </div>
    );
  }

  const config = TABS[tab];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl text-brand-burgundy mb-6">Manage Content</h1>

      <div className="flex gap-3 mb-8">
        {Object.entries(TABS).map(([key, t]) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`px-3 py-1.5 text-sm uppercase tracking-wide border border-brand-gold ${
              tab === key ? 'bg-brand-burgundy text-brand-cream' : 'text-brand-burgundy'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={addItem} className="grid grid-cols-2 gap-3 mb-10">
        {config.fields.map((field) => (
          <input
            key={field}
            placeholder={field}
            value={form[field] || ''}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className={`border border-brand-gold px-3 py-2 ${field === 'description' ? 'col-span-2' : ''}`}
          />
        ))}
        <button type="submit" className="bg-brand-burgundy text-brand-cream px-4 py-2 uppercase text-sm">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b border-brand-gold/40 pb-2">
            <span>{config.display(item)}</span>
            <button onClick={() => deleteItem(item.id)} className="text-red-700 text-sm underline">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Run the dev server and manually verify**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
npm run dev
```

Visit `/admin`. Try a wrong password — expect "Wrong password." Log in with `omars1946` — expect the seeded menu items listed. Add a new menu item, confirm it appears in the list and on `/menus` after a refresh. Delete an item (confirm the browser confirm dialog appears), confirm it's gone from `/menus`. Switch to the Specials tab, add a special, confirm it appears on `/specials`. Switch to the Wine List tab, add a wine, confirm it appears on `/wine-list`.

- [ ] **Step 5: Commit**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
git add omars-demo
git commit -m "Add password-gated admin CMS for menu items"
```

---

### Task 7: Social Feed Section, Newsletter Signup, Final Polish

**Files:**
- Create: `omars-demo/components/SocialFeed.js`
- Create: `omars-demo/components/NewsletterSignup.js`
- Create: `omars-demo/app/api/newsletter/route.js`
- Modify: `omars-demo/app/page.js` (add `<SocialFeed />` section)
- Modify: `omars-demo/components/Footer.js` (add `<NewsletterSignup />`)
- Create: `omars-demo/README.md`

**Interfaces:**
- Consumes: `createNewsletterSignup({email})` from `lib/queries.js` (Task 2).
- Produces: `<SocialFeed />` (homepage-only, no props) and `<NewsletterSignup />` (used in Footer).

- [ ] **Step 1: Build the newsletter API route**

Create `omars-demo/app/api/newsletter/route.js`:

```js
import { createNewsletterSignup } from '@/lib/queries';

export async function POST(request) {
  const { email } = await request.json();
  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Please enter a valid email' }, { status: 400 });
  }
  try {
    createNewsletterSignup({ email });
  } catch (e) {
    return Response.json({ error: 'You are already signed up' }, { status: 400 });
  }
  return Response.json({ ok: true });
}
```

- [ ] **Step 2: Build the NewsletterSignup component**

Create `omars-demo/components/NewsletterSignup.js`:

```jsx
'use client';
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus('done');
      setError('');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
    }
  }

  if (status === 'done') {
    return <p className="text-sm text-brand-gold">Thanks for signing up.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs">
      <p className="text-sm">Sign up for our newsletter. We do not share our email list.</p>
      {error && <p className="text-red-300 text-xs">{error}</p>}
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="flex-1 px-2 py-1 text-brand-dark"
        />
        <button type="submit" className="bg-brand-gold text-brand-dark px-3 py-1 text-sm uppercase">
          Sign Up
        </button>
      </div>
    </form>
  );
}
```

Edit `omars-demo/components/Footer.js` to add the signup form (insert before the closing `</div>` of the flex container):

```jsx
import NewsletterSignup from './NewsletterSignup';

// inside the flex container, add a third column:
<div>
  <NewsletterSignup />
</div>
```

(Apply this as a real edit to the existing `Footer.js` from Task 1 — add the import at the top and the new `<div>` block as a third child of the flex container, alongside the address block and the social links block.)

- [ ] **Step 3: Build the SocialFeed component**

Create `omars-demo/components/SocialFeed.js`:

```jsx
const PHOTOS = [
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=400&fit=crop',
];

export default function SocialFeed() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="font-serif text-3xl text-brand-burgundy text-center mb-2">Follow Us</h2>
      <p className="text-center text-sm text-brand-dark/60 mb-8">
        Sample photos &mdash; see our real feed on{' '}
        <a href="https://www.instagram.com/omarsrestaurant/" target="_blank" rel="noreferrer" className="underline">
          Instagram
        </a>{' '}
        and{' '}
        <a href="https://www.facebook.com/omarsfreshseafoodsteaks/" target="_blank" rel="noreferrer" className="underline">
          Facebook
        </a>
        .
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PHOTOS.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="Omar's restaurant" className="w-full h-40 object-cover" />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire SocialFeed into the Home page**

Edit `omars-demo/app/page.js` — add the import and render `<SocialFeed />` as the last section:

```jsx
import SocialFeed from '@/components/SocialFeed';
// ... existing imports/content above ...
// add as the final element returned by Home, after the existing two <section> blocks:
<SocialFeed />
```

- [ ] **Step 5: Write the README**

Create `omars-demo/README.md`:

```markdown
# Omar's Restaurant — Redesign Demo

Pitch/demo redesign of omarsrestaurant.com. Not production-ready: no real
payments, no real POS/reservation system integration, no live social API.

## Run it

```bash
npm install
node lib/seed.js   # only needed once, populates data/omars.db
npm run dev
```

Visit http://localhost:3000

## Admin CMS

Visit /admin, password is in `.env.local` (`ADMIN_PASSWORD`).

## Tests

```bash
npm test
```
```

- [ ] **Step 6: Run full manual QA pass**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's/omars-demo"
npm run dev
```

Walk through: Home (hero, story, social feed grid, newsletter signup in footer with a real email — expect "Thanks for signing up."), every nav page, Reserve, Order (full cart → checkout), Admin (login, add/delete a menu item). Confirm no console errors in the browser dev tools. Stop the server.

- [ ] **Step 7: Commit**

```bash
cd "/Users/masongoche/Claude/Projects/Omar's"
git add omars-demo
git commit -m "Add social feed, newsletter signup, and README"
```
