'use server'

// actions.ts
import { deleteSession, getSession, refreshSessionForUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
    await deleteSession();
    redirect('/login');
}

export async function checkApprovalStatus() {
    try {
        const session = await getSession();
        if (!session?.userId) return null;

        const refreshedSession = await refreshSessionForUser(session.userId);

        if (!refreshedSession) {
            return null;
        }

        return refreshedSession.orgStatus;
    } catch (error) {
        console.error("Org status check failed", error);
        return null;
    }
}

export async function checkUserApprovalStatus() {
    try {
        const session = await getSession();
        if (!session?.userId) return null;

        const refreshedSession = await refreshSessionForUser(session.userId);

        if (!refreshedSession) {
            return null;
        }

        return refreshedSession.status;
    } catch (error) {
        console.error("User status check failed", error);
        return null;
    }
}

