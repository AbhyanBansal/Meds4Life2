'use server'

import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function approveOrganization(orgId: string) {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized");
    }

    await db.update(organizations)
        .set({ status: 'APPROVED' })
        .where(eq(organizations.id, orgId));

    revalidatePath('/super-admin');
}

export async function rejectOrganization(orgId: string) {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
        throw new Error("Unauthorized");
    }

    await db.update(organizations)
        .set({ status: 'REJECTED' })
        .where(eq(organizations.id, orgId));

    revalidatePath('/super-admin');
}
