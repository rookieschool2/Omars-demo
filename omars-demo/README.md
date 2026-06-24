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
