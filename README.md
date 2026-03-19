# MediShare Frontend

This is the active MediShare application.

## Stack

- Next.js App Router
- React
- TypeScript
- Drizzle ORM
- PostgreSQL
- JWT cookie sessions
- Google OAuth account linking
- S3 image storage
- PWA shell and offline fallback

## Main Features

- Approval-aware signup and login
- Organization-scoped medicine listings
- Locate and request flow
- Donor approve, reject, reserve, and collected flow
- Organization admin approvals
- Super admin organization approvals

## Run Locally

```bash
npm install
npm run dev
```

## Build For Production

```bash
npm run build
npm start
```

Deployment notes live in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).
