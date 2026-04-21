## DBS mini project

This repo contains:

- **`webapp/`**: Next.js app (UI + API routes)
- **`oracle/`**: Oracle SQL scripts (DDL + sample data + PL/SQL)

## Run locally

### 1) Database

- Start Oracle (XE / other Oracle instance)
- Run the scripts in `oracle/` (see `oracle/00_run_order.txt` for order)

### 2) Web app

```bash
cd webapp
npm install
```

Create a local env file:

- Copy `webapp/.env.example` to `webapp/.env.local`
- Fill in your Oracle connection values

Start dev server:

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Notes

- `.env.local` is intentionally **not committed** (contains secrets).
- `node_modules/` and `.next/` are intentionally **not committed** (build artifacts).

