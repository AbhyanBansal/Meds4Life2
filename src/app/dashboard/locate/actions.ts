"use server";

import { db } from "@/db";
import { listings, requests, users } from "@/db/schema";
import { ilike, and, eq, gt, ne, or } from "drizzle-orm";
import { getFileUrl } from "@/lib/s3";
import { getSession } from "@/lib/auth";

export async function searchListings(query: string) {
    try {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const searchPattern = `%${query.trim()}%`;

        // Perform a case-insensitive search on the title and description
        // Also filter for available listings only
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

        const results = await db
            .select({
                id: listings.id,
                title: listings.title,
                description: listings.description,
                status: listings.status,
                latitude: listings.latitude,
                longitude: listings.longitude,
                images: listings.images,
                quantity: listings.quantity,
                expiryDate: listings.expiryDate,
                packagingType: listings.packagingType,
                ownerName: users.name,
                ownerAvatar: users.avatar
            })
            .from(listings)
            .leftJoin(users, eq(listings.ownerId, users.id))
            .leftJoin(
                requests,
                and(
                    eq(requests.listingId, listings.id),
                    eq(requests.requesterId, session.userId),
                ),
            )
            .where(
                and(
                    eq(listings.organizationId, session.organizationId),
                    gt(listings.expiryDate, new Date()),
                    or(
                        and(
                            eq(listings.status, "AVAILABLE"),
                            ne(listings.ownerId, session.userId),
                        ),
                        and(
                            eq(listings.status, "RESERVED"),
                            eq(requests.requesterId, session.userId),
                            eq(requests.status, "APPROVED"),
                        ),
                    ),
                    or(
                        ilike(listings.title, searchPattern),
                        ilike(listings.description, searchPattern)
                    )
                )
            )
            .limit(20);

        // Map over results to generate signed URLs for images
        const resultsWithSignedUrls = await Promise.all(results.map(async (listing) => {
            let signedImageUrls: string[] = [];
            if (listing.images && listing.images.length > 0) {
                // Generate signed URL for the first image (or all if needed, but let's do first for now for performance/card view)
                // Actually, let's do all of them just in case specific UI needs them
                signedImageUrls = await Promise.all(listing.images.map(async (key) => {
                    try {
                        return await getFileUrl(key);
                    } catch (e) {
                        console.error(`Failed to sign url for key ${key}`, e);
                        return ""; // Handle error gracefully
                    }
                }));
            }
            return {
                ...listing,
                images: signedImageUrls.filter(url => url !== "") // Filter out failed ones
            };
        }));

        return resultsWithSignedUrls;

    } catch (error) {
        console.error("Error searching listings:", error);
        throw new Error("Failed to search medicines");
    }
}
