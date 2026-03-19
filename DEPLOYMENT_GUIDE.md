# MediShare Deployment Guide

This document covers the current deployment target for MediShare.

## Deployment Target

Deploy the Next.js app in this `frontend/` directory.

The app handles:

- authentication
- approval workflow
- medicine listings
- medicine requests
- dashboard and admin views
- PWA shell and offline fallback

## Required Environment Variables

Use `.env.example` as the template.

Required variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_BUCKET_NAME`

## Production Checklist

### 1. Database

- provision the production PostgreSQL database
- make sure schema is up to date
- seed a `SUPER_ADMIN` user
- verify at least one organization can be approved in production

### 2. Auth

- set a strong `JWT_SECRET`
- set `NEXT_PUBLIC_APP_URL` to the deployed HTTPS URL
- set `GOOGLE_REDIRECT_URI` to:
  - `https://your-domain/api/auth/google/callback`
- update Google OAuth allowed redirect URIs in Google Cloud

### 3. Storage

- configure the production S3 bucket
- verify uploads work from the deployed app
- verify signed image URLs load correctly

### 4. Build

Run:

```bash
npm install
npm run build
npm start
```

## Health Check

The app exposes a simple health endpoint:

- `/api/health`

Expected response:

```json
{
  "status": "ok",
  "service": "medishare-frontend",
  "timestamp": "..."
}
```

## Recommended Rollout Order

1. deploy to staging
2. test signup and login
3. test org approval and member approval
4. test listing, locate, request, approve, and collect flow
5. test Google login
6. test image upload
7. test PWA install on mobile
8. promote to production

## Important Security Note

If real credentials were ever shared in local files, logs, screenshots, or chat history, rotate them before production deployment.
