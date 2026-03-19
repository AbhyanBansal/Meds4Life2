'use server'

import { getSession } from "@/lib/auth";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveUser(userId: string) {
    const session = await getSession();
    if (!session || session.role !== 'ORG_ADMIN') {
        throw new Error("Unauthorized");
    }

    const targetUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!targetUser) {
        throw new Error("User not found");
    }

    if (targetUser.role !== 'MEMBER') {
        throw new Error("Only member approvals can be managed here");
    }

    if (targetUser.organizationId !== session.organizationId) {
        throw new Error("Unauthorized: User belongs to another organization");
    }

    await db.update(users)
        .set({ status: 'APPROVED' })
        .where(eq(users.id, userId));

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/admin');
}

export async function rejectUser(userId: string) {
    const session = await getSession();
    if (!session || session.role !== 'ORG_ADMIN') {
        throw new Error("Unauthorized");
    }

    const targetUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!targetUser) {
        throw new Error("User not found");
    }

    if (targetUser.role !== 'MEMBER') {
        throw new Error("Only member approvals can be managed here");
    }

    if (targetUser.organizationId !== session.organizationId) {
        throw new Error("Unauthorized: User belongs to another organization");
    }

    await db.update(users)
        .set({ status: 'REJECTED' })
        .where(eq(users.id, userId));

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/admin');
}
