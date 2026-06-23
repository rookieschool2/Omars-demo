# Omar's Restaurant — Redesign Demo (Design Spec)

## Purpose

Build a pitch/demo redesign of [omarsrestaurant.com](https://omarsrestaurant.com) to show the owner what's possible. The demo should look and feel real — functional reservations, ordering, menu editing, and contact/newsletter forms with persisted data — but does not need production-grade payments, POS integration, or hosted infrastructure. This is not intended to go live as-is.

## Background

Omar's is Ashland, Oregon's oldest restaurant and first public cocktail lounge, established 1946 — billed as the longest continuously operating restaurant from Portland, OR to Redding, CA. It serves steaks and seafood (hand-cut steaks aged 6 weeks, fresh fish delivered 3-5x/week, scratch-made soups/sauces/dressings) in a "warm, comfortable, relaxing" setting at 1380 Siskiyou Blvd, Ashland, OR.

The current site (omarsrestaurant.com) has a minimal, dated design with two near-duplicate nav menus, links out to PDF menus/wine lists, a Facebook link, and a privacy-focused newsletter signup. It has no online ordering, no online reservations, and no way to update menu content without a developer.

Real social presence to link to/draw visual inspiration from:
- Instagram: https://www.instagram.com/omarsrestaurant/
- Facebook: https://www.facebook.com/omarsfreshseafoodsteaks/

## Visual Direction: Classic Steakhouse

Dark walnut/brown base, deep burgundy accents, brass/gold trim. Serif headline type (Keens/Peter Luger inspired — white-tablecloth, wood-paneled, leather-booth elegance, deliberately not trendy). Body copy in a clean sans-serif for readability. Photography stands in via curated Unsplash images (steaks, seafood, dining room ambience) in place of real restaurant photos. Copy and layout lean into the "Est. 1946" heritage story throughout, not just on the About page.

## Site Structure

Existing pages, redesigned in the new visual direction:

1. **Home** — hero, heritage story snippet, social feed preview section, calls to action into Menu/Reservations/Order
2. **Menus** — full menu by category (steaks, seafood, appetizers, sides, desserts), rendered from CMS data
3. **Specials** — rotating daily/seasonal specials, CMS-editable
4. **Wine List** — wine categories/list, CMS-editable
5. **About** — 1946 heritage story, "longest continuously operating restaurant" narrative
6. **Catering** — catering info + inquiry form
7. **Events** — private events info + inquiry form
8. **Store** — gift card/merch showcase; "Buy" leads to a mock confirmation screen, no real checkout/payment
9. **Contact** — address/hours/map embed + contact form

New pages/features (not on the current site):

10. **Order Online** — browse menu, add items to a cart, checkout form, mock order confirmation (no real payment processor)
11. **Reserve a Table** — date/time/party-size reservation form, confirmation screen
12. **Admin (CMS)** — single password-gated page to add/edit/remove menu items, specials, and wine list entries; changes reflect immediately on the public Menus/Specials/Wine List pages

## Architecture

**Stack**: Next.js (App Router) + Tailwind CSS for styling.

**Persistence**: SQLite file via `better-sqlite3` — no hosted database, survives server restarts. Tables:
- `menu_items` (category, name, description, price)
- `specials` (date/range, name, description, price)
- `wine_list` (category, name, description, price)
- `reservations` (name, contact info, date, time, party size, notes)
- `orders` (customer info, line items, total, status)
- `contact_submissions` (name, contact info, message)
- `newsletter_signups` (email)

**Dynamic flows**:
- **Reservations**: form → API route validates and writes to `reservations` → confirmation screen. No real table-management system behind it.
- **Online ordering**: browse Menus data → add to cart (client-side state) → checkout form → API route writes to `orders` → confirmation screen. No real payment processor.
- **CMS (admin)**: single shared password (env var, no per-user accounts) gates `/admin`; CRUD against `menu_items`/`specials`/`wine_list`, read live by the public pages.
- **Contact + newsletter**: forms → API routes write to their tables → inline success message.

**Social media**: header/footer icons linking to the real Instagram and Facebook accounts above, plus a homepage feed-style section visually styled like an Instagram grid, populated with curated Unsplash photos as stand-ins (no live API pull — would require Omar's own API credentials/login, out of scope for a demo).

## Error Handling

- Client-side validation on all forms (required fields, sane date/party-size ranges) before submission.
- Server-side validation in API routes before any SQLite write — invalid submissions return an inline error, not a crash.
- Admin CMS destructive actions (delete) require an inline confirmation step.

## Testing

Given this is a pitch/demo rather than a production system, testing is manual end-to-end verification rather than an automated suite:
- Submit a reservation → appears correctly (and could be manually checked via a basic admin view if needed)
- Edit a menu item in the CMS → change reflects on the public Menus page
- Add items to cart and place an order → confirmation shown, order persisted
- Submit contact form / newsletter signup → success message shown, submission persisted

## Out of Scope

- Real payment processing or POS integration
- Real table-management / reservation system integration
- Live social media API integration (using curated stand-in photos instead)
- User accounts / multi-admin auth for the CMS (single shared password only)
- Automated test suite (manual verification only, per above)
