This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database migrations

Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env.local` (or in the
deployment environment), then apply pending migrations before deploying:

```bash
npm run db:migrate
```

The authentication migration adds password hashes and temporary OTP challenges
to the existing `users` database. The dashboard migration adds zero-initialized
accounts, demo-only virtual cards, activity and notification tables, and
user-scoped savings vaults. Existing vault amounts are converted to cents.
Back up the database before applying migrations to a production database.

Dashboard balances start at zero. No deposits, card payments, or bank transfers
are simulated or executed. Withdrawal submissions are pending requests that
reserve available funds; demo cards never contain a payment-card number or CVV.

Configure these server-only variables before using registration and login:
`AUTH_SECRET` (at least 32 characters), `GMAIL_USER`, `GMAIL_APP_PASSWORD`,
`Admin`, and `PasswordAdmin`. Set `NEXT_PUBLIC_APP_URL` to the public site URL
so account-approval emails link to the correct login page.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
