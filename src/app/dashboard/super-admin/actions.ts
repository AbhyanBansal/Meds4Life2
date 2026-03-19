'use server'

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { organizations } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function approveOrg(orgId: string) {
    const session = await getSession();

    if (!session || session.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized");
    }

    await db.update(organizations)
        .set({ status: "APPROVED" })
        .where(eq(organizations.id, orgId));

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/super-admin');
}

export async function rejectOrg(orgId: string) {
    const session = await getSession();

    if (!session || session.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized");
    }

    await db.update(organizations)
        .set({ status: "REJECTED" })
        .where(eq(organizations.id, orgId));

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/super-admin');
}
