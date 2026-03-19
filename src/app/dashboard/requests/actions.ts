'use server'

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { listings, requests } from "@/db/schema";
import { getSession } from "@/lib/auth";

async function getManagedRequest(requestId: string, userId: string, organizationId: string) {
    const request = await db.query.requests.findFirst({
        where: eq(requests.id, requestId),
        with: {
            listing: {
                columns: {
                    id: true,
                    ownerId: true,
                    organizationId: true,
                    status: true,
                },
            },
            requester: {
                columns: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!request) {
        throw new Error("Request not found.");
    }

    if (
        request.listing.ownerId !== userId ||
        request.listing.organizationId !== organizationId
    ) {
        throw new Error("You can only manage requests for your own organization listings.");
    }

    return request;
}

function revalidateRequestViews(listingId: string) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/listings");
    revalidatePath("/dashboard/requests");
    revalidatePath(`/dashboard/listings/${listingId}`);
}

export async function approveIncomingRequest(requestId: string) {
    const session = await getSession();

    if (
        !session ||
        session.role === "SUPER_ADMIN" ||
        !session.organizationId ||
        session.status !== "APPROVED" ||
        session.orgStatus !== "APPROVED"
    ) {
        throw new Error("Unauthorized");
    }

    const managedRequest = await getManagedRequest(requestId, session.userId, session.organizationId);

    if (managedRequest.status !== "PENDING") {
        throw new Error("Only pending requests can be approved.");
    }

    if (managedRequest.listing.status !== "AVAILABLE") {
        throw new Error("This listing is no longer available for approval.");
    }

    const [reservedListing] = await db.update(listings)
        .set({ status: "RESERVED" })
        .where(and(
            eq(listings.id, managedRequest.listing.id),
            eq(listings.status, "AVAILABLE"),
        ))
        .returning({
            id: listings.id,
        });

    if (!reservedListing) {
        throw new Error("This listing has already been reserved or updated.");
    }

    await db.update(requests)
        .set({ status: "APPROVED" })
        .where(eq(requests.id, managedRequest.id));

    await db.update(requests)
        .set({ status: "REJECTED" })
        .where(and(
            eq(requests.listingId, managedRequest.listing.id),
            eq(requests.status, "PENDING"),
            ne(requests.id, managedRequest.id),
        ));

    revalidateRequestViews(managedRequest.listing.id);
}

export async function rejectIncomingRequest(requestId: string) {
    const session = await getSession();

    if (
        !session ||
        session.role === "SUPER_ADMIN" ||
        !session.organizationId ||
        session.status !== "APPROVED" ||
        session.orgStatus !== "APPROVED"
    ) {
        throw new Error("Unauthorized");
    }

    const managedRequest = await getManagedRequest(requestId, session.userId, session.organizationId);

    if (managedRequest.status !== "PENDING") {
        throw new Error("Only pending requests can be rejected.");
    }

    await db.update(requests)
        .set({ status: "REJECTED" })
        .where(eq(requests.id, managedRequest.id));

    revalidateRequestViews(managedRequest.listing.id);
}

export async function completeIncomingRequest(requestId: string) {
    const session = await getSession();

    if (
        !session ||
        session.role === "SUPER_ADMIN" ||
        !session.organizationId ||
        session.status !== "APPROVED" ||
        session.orgStatus !== "APPROVED"
    ) {
        throw new Error("Unauthorized");
    }

    const managedRequest = await getManagedRequest(requestId, session.userId, session.organizationId);

    if (managedRequest.status !== "APPROVED") {
        throw new Error("Only approved requests can be marked as collected.");
    }

    if (managedRequest.listing.status !== "RESERVED") {
        throw new Error("Only reserved listings can be marked as collected.");
    }

    await db.update(requests)
        .set({ status: "COMPLETED" })
        .where(eq(requests.id, managedRequest.id));

    await db.update(listings)
        .set({ status: "COLLECTED" })
        .where(eq(listings.id, managedRequest.listing.id));

    revalidateRequestViews(managedRequest.listing.id);
}
