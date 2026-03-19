# MediShare Architecture Walkthrough

## Active App

MediShare now runs as a single Next.js application.

The app currently handles:

- signup and login
- approval workflow
- organization isolation
- medicine listing
- locate and request flow
- donor approval and completion flow
- dashboard, org admin, and super admin views

## Approval Model

- `MEMBER` users join approved organizations and start as `PENDING`
- `ORG_ADMIN` users approve or reject member requests inside their organization
- New organizations start as `PENDING`
- `SUPER_ADMIN` approves or rejects new organizations

## Exchange Model

- Medicines are listed within an organization
- Members can locate medicines listed by other members of the same organization
- A requester can send a request for a medicine
- The donor can approve or reject that request
- Approved requests reserve the listing
- The donor can mark the exchange as collected

## Technical Direction

- Next.js App Router is the active runtime
- Drizzle is the data access layer
- JWT cookie sessions are used for auth
- Middleware protects routes
- Google OAuth links to existing MediShare accounts

## Cleanup Note

The previous Python backend path was removed because it was no longer part of the active application flow.
