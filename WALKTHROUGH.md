# MediShare Project Walkthrough

## 1. Technology Stack & Rationale

We have established a "Modern & Scalable" stack designed for performance, type safety, and data integrity.

-   **Next.js 14 (App Router)**: The core framework.
    -   *Why*: Unified frontend/backend, Server Side Rendering (SSR) for SEO (critical for public medicine listings), and easy Vercel deployment.
-   **TypeScript**: The language.
    -   *Why*: Strict type safety across the entire stack (DB -> API -> UI), preventing entire classes of bugs.
-   **PostgreSQL**: The database.
    -   *Why*: Relational data model is perfect for this use case (User *has many* Listings, Listing *has many* Requests). ACID compliance ensures we never lose track of a medicine exchange state.
-   **Drizzle ORM**: The ORM.
    -   *Why*: Lightweight, Serverless-ready, and fast. No "Cold Start" issues like Prisma.
    -   *Edge Ready*: Works perfectly with Next.js Edge Runtime.
-   **Neon (PostgreSQL)**: The database.
    -   *Why*: Serverless Postgres, scales to zero, perfect for our stack.
-   **Clerk**: Authentication.
    -   *Why*: Complete user management, secure, and easy Next.js integration.
-   **AWS S3**: Storage.
    -   *Why*: Reliable object storage for medicine images.
-   **Tailwind CSS**: The styling engine.
    -   *Why*: Utility-first CSS for rapid UI development and consistent design system.
-   **Lucide React**: Icon set.
    -   *Why*: Clean, consistent, and lightweight icons.

## 2. Project Structure

The project is initialized in `medishare-web`.

```
medishare-web/
├── drizzle.config.ts   # Drizzle Configuration
├── src/
│   ├── app/            # Next.js App Router
│   ├── db/
│   │   ├── index.ts    # Drizzle Setup (Neon connection)
│   │   └── schema.ts   # Database Models (Users, Listings)
│   ├── lib/            # Shared utilities
│   │   └── utils.ts    # Tailwind class merger (cn)
│   └── components/     # Reusable UI components
├── public/             # Static assets (images, manifest.json)
└── tailwind.config.ts  # Design system configuration (colors, fonts)
```

## 3. Database Schema Overview

We have defined three core models in `src/db/schema.ts` to handle the business logic:

1.  **Users**: Represents a registered user.
    -   Fields: `email`, `name`, `rating`, `avatar`.
    -   Relations: Can own `listings` and make `requests`.
2.  **Listings**: Represents a medicine put up for sharing.
    -   Fields: `title`, `expiryDate`, `quantity`, `images`, `status` (AVAILABLE, RESERVED, etc.).
    -   Relations: Owned by a `User`.
3.  **Requests**: Represents a transaction attempt.
    -   Fields: `status` (PENDING, APPROVED, etc.).
    -   Relations: Connects a `User` (requester) to a `Listing`.

## 4. Current State

-   [x] **Project Initialization**: Next.js 14 app created globally.
-   [x] **Dependencies**: All core libraries (Drizzle, Tailwind, Lucide, Clerk, AWS SDK) installed.
-   [x] **Configuration**: TypeScript and Tailwind are configured.
-   [x] **Schema**: Drizzle schema defined in `src/db/schema.ts`.
-   [x] **Auth**: Clerk configured with middleware and provider.
-   [x] **Storage**: AWS S3 client helper created.
-   [ ] **Database Connection**: Pending `DATABASE_URL`.
-   [ ] **UI Implementation**: Pending.

## 5. Next Steps Roadmap

1.  **Database Setup (Critical)**:
    -   Get a PostgreSQL connection string (Neon).
    -   Add it to `.env`.
    -   Run `npx drizzle-kit push` to sync the schema to the actual database.
2.  **Authentication**:
    -   Install and configure **Clerk**.
    -   Secure the API routes so only logged-in users can post listings.
3.  **Core UI Layout**:
    -   Build the `Navbar` (Logo, Login button).
    -   Build the `Hero` section of the landing page.
4.  **Feature: Create Listing**:
    -   Build a form to upload medicine details.
    -   Integrate UploadThing for image uploads.
