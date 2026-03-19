
import "server-only";

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export type UserRole = "ORG_ADMIN" | "MEMBER" | "SUPER_ADMIN";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export type SessionPayload = {
    userId: string;
    organizationId: string | null;
    role: UserRole;
    status: ApprovalStatus;
    orgStatus: ApprovalStatus | null;
    iat?: number;
    exp?: number;
};

type SessionUserRecord = {
    id: string;
    organizationId: string | null;
    role: UserRole | null;
    status: ApprovalStatus | null;
    organization?: {
        status: ApprovalStatus | null;
    } | null;
};

function getJwtKey() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is required.");
    }

    return new TextEncoder().encode(secret);
}

function normalizeRole(role: SessionUserRecord["role"]): UserRole {
    return role ?? "MEMBER";
}

function normalizeStatus(status: ApprovalStatus | null | undefined): ApprovalStatus {
    return status ?? "PENDING";
}

export function buildSessionPayload(user: SessionUserRecord): SessionPayload {
    const role = normalizeRole(user.role);
    const status = normalizeStatus(user.status);
    const organizationId = user.organizationId ?? null;
    const orgStatus =
        role === "SUPER_ADMIN" || !organizationId
            ? null
            : normalizeStatus(user.organization?.status);

    return {
        userId: user.id,
        organizationId,
        role,
        status,
        orgStatus,
    };
}

export async function getUserForSession(userId: string) {
    return db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            id: true,
            organizationId: true,
            role: true,
            status: true,
        },
        with: {
            organization: {
                columns: {
                    status: true,
                },
            },
        },
    });
}

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
}

export async function createSession(payload: Omit<SessionPayload, "iat" | "exp">) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getJwtKey());

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires,
        sameSite: "lax",
        path: "/",
    });

    return session;
}

export async function createSessionForUser(user: SessionUserRecord) {
    const payload = buildSessionPayload(user);
    await createSession(payload);
    return payload;
}

export async function refreshSessionForUser(userId: string) {
    const user = await getUserForSession(userId);

    if (!user) {
        await deleteSession();
        return null;
    }

    return createSessionForUser(user);
}

export async function verifySession(token: string) {
    try {
        const { payload } = await jwtVerify<SessionPayload>(token, getJwtKey(), {
            algorithms: ["HS256"],
        });

        return payload;
    } catch {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
        return null;
    }

    return verifySession(session);
}

export function getPostAuthRedirect(session: Pick<SessionPayload, "role" | "status" | "orgStatus">) {
    if (session.status !== "APPROVED") {
        return "/approval-pending";
    }

    if (session.role !== "SUPER_ADMIN" && session.orgStatus !== "APPROVED") {
        return "/org-pending";
    }

    return session.role === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard";
}

export function isRejectedSession(session: Pick<SessionPayload, "role" | "status" | "orgStatus">) {
    return (
        session.status === "REJECTED" ||
        (session.role !== "SUPER_ADMIN" && session.orgStatus === "REJECTED")
    );
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
