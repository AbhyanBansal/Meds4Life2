'use server'

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { listings, requests } from "@/db/schema";
import { getSession } from "@/lib/auth";

export type RequestMedicineState = {
    error?: string;
    success?: string;
} | undefined;

export async function requestMedicine(
    prevState: RequestMedicineState,
    formData: FormData,
): Promise<RequestMedicineState> {
    const session = await getSession();

    if (
        !session ||
        session.role === "SUPER_ADMIN" ||
        !session.organizationId ||
        session.status !== "APPROVED" ||
        session.orgStatus !== "APPROVED"
    ) {
        return { error: "You must be an approved organization member to request medicines." };
    }

    const listingId = formData.get("listingId");

    if (typeof listingId !== "string" || !listingId) {
        return { error: "Listing not found." };
    }

    const listing = await db.query.listings.findFirst({
        where: eq(listings.id, listingId),
        columns: {
            id: true,
            ownerId: true,
            organizationId: true,
            status: true,
            expiryDate: true,
        },
    });

    if (!listing) {
        return { error: "This listing no longer exists." };
    }

    if (listing.organizationId !== session.organizationId) {
        return { error: "You can only request medicines within your organization." };
    }

    if (listing.ownerId === session.userId) {
        return { error: "You cannot request your own listing." };
    }

    if (listing.status !== "AVAILABLE") {
        return { error: "This medicine is no longer available." };
    }

    if (listing.expiryDate && new Date(listing.expiryDate) <= new Date()) {
        return { error: "This medicine has already expired and cannot be requested." };
    }

    const existingRequest = await db.query.requests.findFirst({
        where: and(
            eq(requests.listingId, listing.id),
            eq(requests.requesterId, session.userId),
            inArray(requests.status, ["PENDING", "APPROVED"]),
        ),
        columns: {
            id: true,
        },
    });

    if (existingRequest) {
        return { error: "You have already requested this medicine." };
    }

    await db.insert(requests).values({
        listingId: listing.id,
        requesterId: session.userId,
        organizationId: session.organizationId,
        status: "PENDING",
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/listings/${listing.id}`);
    revalidatePath("/dashboard/requests");

    return { success: "Request sent to the donor." };
}
