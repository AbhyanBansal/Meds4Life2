# MediShare Authentication and Approval Workflow Guide

This guide explains the current authentication and approval system used in MediShare.

## Project Context

MediShare is an organization-scoped medicine sharing platform.

Core access rules:

- users belong to organizations
- medicine exchange happens within an organization
- members cannot self-activate
- new organizations cannot self-activate
- `MEMBER` approval is handled by the `ORG_ADMIN`
- organization approval is handled by the `SUPER_ADMIN`

Because of that, authentication is closely tied to approval state and authorization.

## Current Auth Architecture

The active authentication system lives fully inside the Next.js app.

Core stack:

- Next.js App Router
- Server Actions for signup and login
- Drizzle ORM with PostgreSQL
- `bcryptjs` for password hashing
- `jose` for JWT signing and verification
- HTTP-only cookie sessions
- middleware-based route protection
- manual Google OAuth callback integration

Important note:

- the frontend is the single auth authority
- the old Python backend path was removed after auth and approval logic was consolidated into the Next.js app

## Data Model

Auth is built around three core pieces.

### Users

Key fields:

- `id`
- `email`
- `password`
- `googleId`
- `name`
- `avatar`
- `organizationId`
- `role`
- `status`

### Organizations

Key fields:

- `id`
- `name`
- `status`

### Enums

Roles:

- `ORG_ADMIN`
- `MEMBER`
- `SUPER_ADMIN`

User status:

- `PENDING`
- `APPROVED`
- `REJECTED`

Organization status:

- `PENDING`
- `APPROVED`
- `REJECTED`

## Session Model

The app stores a signed JWT in an HTTP-only cookie named `session`.

Session payload:

```ts
type SessionPayload = {
  userId: string;
  organizationId: string | null;
  role: "ORG_ADMIN" | "MEMBER" | "SUPER_ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  orgStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
};
```

Why this matters:

- middleware can authorize requests without a database lookup on every route
- the app can redirect users based on approval state very early
- both user approval and organization approval are encoded in the session

## Signup Workflow

There are two signup paths.

### Join an Existing Organization

Flow:

1. User opens `/register`
2. User chooses `Join Existing`
3. Frontend fetches approved organizations from `/api/organizations`
4. User submits name, email, password, and organization ID
5. Server action validates input with Zod
6. Server checks if email already exists
7. Server checks that the organization exists and is approved
8. User is created with:
   - `role = MEMBER`
   - `status = PENDING`
9. Session cookie is created
10. User is redirected to `/approval-pending`

Business meaning:

- members can register, but they cannot enter the dashboard until an org admin approves them

### Create a New Organization

Flow:

1. User opens `/register`
2. User chooses `Create New`
3. User submits name, email, password, and organization name
4. Server validates input with Zod
5. Server checks for duplicate email and duplicate organization name
6. Organization is created with `status = PENDING`
7. User is created with:
   - `role = ORG_ADMIN`
   - `status = APPROVED`
8. Session cookie is created
9. User is redirected to `/org-pending`

Business meaning:

- the creator becomes the org admin immediately
- but the organization itself must still be approved by the super admin

## Login Workflow

Login is handled through a Next.js server action.

Flow:

1. User submits email and password on `/login`
2. Input is validated with Zod
3. User is loaded from the database
4. Password is checked with `bcrypt.compare`
5. Access state is validated:
   - reject incomplete non-super-admin users
   - reject rejected users
   - reject users whose organization is rejected
6. A fresh session payload is created
7. JWT cookie is set
8. Redirect is chosen based on role, user status, and org status

Redirect rules:

- pending user -> `/approval-pending`
- approved user in pending org -> `/org-pending`
- approved super admin -> `/dashboard/super-admin`
- approved regular user in approved org -> `/dashboard`

## Approval Workflow

Approval is the most domain-specific part of auth in this project.

### Member Approval

- new members start as `PENDING`
- `ORG_ADMIN` can approve or reject them from `/dashboard/admin`
- approval is scoped to the admin's own organization

Security rule:

- an org admin cannot approve users from another organization
- an org admin cannot approve arbitrary roles
- the admin page only manages pending `MEMBER` accounts

### Organization Approval

- new organizations start as `PENDING`
- `SUPER_ADMIN` can approve or reject them from `/dashboard/super-admin`
- these actions update organization status directly in the database

## Route Protection and Middleware

Middleware protects routes before page rendering.

Checks include:

- valid session cookie
- rejected user
- rejected organization
- pending user
- pending organization
- logged-in user trying to revisit auth pages

Examples:

- unauthenticated user hitting `/dashboard` -> redirected to `/login`
- pending member hitting `/dashboard` -> redirected to `/approval-pending`
- org admin with pending org hitting `/dashboard` -> redirected to `/org-pending`
- rejected user -> session cleared and redirected to login with an error code

## Google OAuth Workflow

Google login is supported, but in a controlled way.

Current behavior:

1. User starts OAuth from `/api/auth/google`
2. Google redirects back with an auth code
3. Callback exchanges the code for tokens
4. Callback fetches the Google profile
5. App looks up an existing MediShare user by email
6. If found:
   - `googleId` is linked
   - avatar can be updated
   - session is created
7. If not found:
   - login is rejected
   - user is sent back to login

Why this is useful:

- it prevents uncontrolled account creation through Google
- it keeps organization assignment and approval workflow explicit
- it ensures OAuth users still respect the same approval rules

## Organization Isolation

Medicine exchange is restricted to the current organization.

Examples:

- locate results are filtered by `organizationId`
- listing detail pages verify the listing belongs to the current organization
- admin approval actions are organization-scoped

This is one of the key security guarantees in the product.

## Security Decisions

### Password storage

- passwords are hashed with `bcryptjs`
- plain text passwords are never stored

### Session storage

- JWT is stored in an HTTP-only cookie
- cookie is `secure` in production
- cookie uses `sameSite: "lax"`

### Redirect handling

One subtle bug that was fixed:

- in Next.js server actions, `redirect()` throws a control-flow exception
- if it is caught like a normal error, the client receives a broken server-action response
- signup and login were fixed by rethrowing redirect errors correctly

## Key Files

- `src/lib/auth.ts`
- `src/app/(auth)/register/actions.ts`
- `src/app/(auth)/login/actions.ts`
- `src/app/api/auth/google/route.ts`
- `src/app/api/auth/google/callback/route.ts`
- `src/middleware.ts`
- `src/app/approval-pending/page.tsx`
- `src/app/org-pending/page.tsx`
- `src/app/actions.ts`
- `src/app/dashboard/admin/page.tsx`
- `src/app/dashboard/admin/actions.ts`
- `src/app/dashboard/super-admin/page.tsx`
- `src/app/dashboard/super-admin/actions.ts`

## Good Interview Talking Points

If asked what was challenging:

- auth was not just identity; it was tied to a two-level approval workflow across members and organizations

If asked what architecture decision stands out:

- consolidating auth into the Next.js app and encoding both user status and organization status into the session payload

If asked what bug was fixed:

- a server-action redirect bug where redirect exceptions were incorrectly caught as normal errors

If asked how organization boundaries were secured:

- by scoping reads and approval actions by `organizationId` and gating pending or rejected users early in middleware

If asked why not to use a generic auth provider:

- because the hard part in this product is approval state, organization trust, and org-scoped access logic rather than identity alone

## Short Interview Summary

> I built a custom approval-aware authentication system for a medicine-sharing platform using Next.js, Drizzle, PostgreSQL, bcrypt, jose, and JWT cookie sessions. Access depends not just on identity, but on user approval, organization approval, and role. Members must be approved by their organization admin, and new organizations must be approved by a super admin before the platform becomes usable for them.
