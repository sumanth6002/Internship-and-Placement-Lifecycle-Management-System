## Webapp (Next.js)

Next.js app for the DBS mini project. It exposes API routes under `app/api/**` which connect to Oracle using the `oracledb` driver.

## Getting Started

Install:

```bash
npm install
```

Set environment variables:

- Copy `.env.example` → `.env.local`
- Fill `ORACLE_USER`, `ORACLE_PASSWORD`, `ORACLE_CONNECT_STRING`

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Build

```bash
npm run build
npm run start
```
