# Authentication Migration Documentation

## Overview
This document details the complete migration process from Clerk Authentication to a custom, self-hosted authentication solution. The goal was to remove external dependencies for core user identity while maintaining high security standards and integrating Google OAuth.

## Methodology & Architecture

### 1. Stateless Session Management (JWT)
**Decision:** Use stateless JWTs (JSON Web Tokens) stored in HTTP-only cookies.
**Reasoning:**
- **Performance:** No database lookup required for every request (middleware verification).
- **Security:** `HttpOnly` cookies prevent XSS attacks access to the token. `SameSite=Lax` prevents CSRF.
- **Edge Compatibility:** Used `jose` library which is lightweight and compatible with Next.js Edge Runtime (unlike `jsonwebtoken` which depends on Node.js streams).

### 2. Password Security
**Decision:** Use `bcrypt` for password hashing.
**Reasoning:**
- Industry standard for hashing.
- Slow hashing algorithm resists brute-force attacks.
- Implemented in `src/lib/auth.ts` to abstract security logic from business logic.

### 3. Progressive Enhancement (Server Actions)
**Decision:** Use Next.js Server Actions for Login and Registration.
**Reasoning:**
- Works without JavaScript (progressive enhancement).
- Type-safe validation using `zod` on the server side ensures data integrity before it reaches the database.
- Keeps sensitive logic (database queries) completely on the server.

### 4. Manual OAuth Implementation
**Decision:** Implement Google OAuth flow manually via API routes instead of using NextAuth.js.
**Reasoning:**
- **Control:** Full control over the user creation/linking logic in our database.
- **Simplicity:** NextAuth is powerful but can be heavy and complex to customize for specific database schemas.
- **Transparency:** Clear visible flow: Request URL -> Google -> Callback Route -> Session Creation.

---

## Step-by-Step Implementation Details

### Step 1: Dependencies & Environment
We replaced `@clerk/nextjs` with:
- `bcryptjs`: For password hashing.
- `jose`: For JWT signing and verification.
- `zod`: For form validation.

### Step 2: Database Schema Upgrade
**File:** `src/db/schema.ts`
- **User ID**: Changed from String (Clerk ID) to `crypto.randomUUID()` for independent ID generation.
- **New Fields**:
  - `password`: Nullable (for Google-only users).
  - `googleId`: Unique identifier for OAuth users.
- **Benefit**: The schema now supports hybrid users (both email/password and Google).

### Step 3: Core Authentication Library
**File:** `src/lib/auth.ts`
- Created centralized functions `createSession`, `verifySession`, `hashPassword`, `verifyPassword`.
- **Methodology**: Encapsulated the "Session" concept. The rest of the app doesn't know it's a JWT; it just asks `getSession()`.

### Step 4: Authentication Actions
**Files:** `src/app/(auth)/login/actions.ts`, `src/app/(auth)/register/actions.ts`
- Implemented `login` and `signup` Server Actions.
- **Flow**:
  1. Validate FormData with Zod.
  2. Check Database (User exists?).
  3. Verify Password / Hash new Password.
  4. Create Session.
  5. Redirect.

### Step 5: Google OAuth Routes
**Files:** `src/app/api/auth/google/route.ts` & `src/app/api/auth/google/callback/route.ts`
- **Initiation**: Redirects user to Google's consent screen with `client_id` and scopes.
- **Callback**:
  1. Exchanges `code` for `access_token`.
  2. Fetches user profile from Google.
  3. **Upsert Logic**: Finds user by email. If exists, links `googleId`. If not, creates new user.

### Step 6: Middleware Replacement
**File:** `src/middleware.ts`
- Removed Clerk Middleware.
- Created custom middleware that reads the `session` cookie.
- **Logic**:
  - If accessing Protected Route (`/dashboard*`) AND No Session -> Redirect to Login.
  - If accessing Auth Route (`/login`) AND Has Session -> Redirect to Dashboard.

### Step 7: UI Implementation (Glassmorphism)
**Files:** `src/app/(auth)/*`
- Designed `LoginPage` and `RegisterPage` to match the "MediShare" aesthetic.
- Used `glass-card` classes and ambient background lighting.
- Removed `<ClerkProvider>` from `RootLayout` to eliminate the external wrapper.

### Step 8: Component Integration
**Files:** `Navbar.tsx`, `Sidebar.tsx`, `listings/new/actions.ts`
- Replaced `<UserButton />`, `<SignInButton />` with native Next.js `<Link>` and standard buttons.
- Replaced `auth()` calls in server actions with `getSession()`.

---

## Summary of Files Changed

| Component | File Path | Change Configuration |
|-----------|-----------|----------------------|
| **DB Schema** | `src/db/schema.ts` | Modified table structure |
| **Auth Lib** | `src/lib/auth.ts` | **NEW** Core logic |
| **Login Page** | `src/app/(auth)/login/page.tsx` | **NEW** UI |
| **Register Page** | `src/app/(auth)/register/page.tsx` | **NEW** UI |
| **Server Actions** | `src/app/(auth)/login/actions.ts` | **NEW** Logic |
| **Server Actions** | `src/app/(auth)/register/actions.ts` | **NEW** Logic |
| **OAuth API** | `src/app/api/auth/google/*` | **NEW** API Routes |
| **Middleware** | `src/middleware.ts` | Complete rewrite |
| **Layout** | `src/app/layout.tsx` | Removed Provider |
| **Components** | `Navbar.tsx`, `Sidebar.tsx` | Removed Clerk UI |

This migration successfully decouples the application from Clerk, providing full ownership of user data and authentication flows.
