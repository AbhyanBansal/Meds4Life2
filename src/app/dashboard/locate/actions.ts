"use server";

import { db } from "@/db";
import { listings, users } from "@/db/schema";
import { ilike, and, eq, or } from "drizzle-orm";
import { getFileUrl } from "@/lib/s3";

export async function searchListings(query: string) {
    try {
        if (!query || query.trim().length === 0) {
            return [];
        }

        const searchPattern = `%${query.trim()}%`;

        // Perform a case-insensitive search on the title and description
        // Also filter for available listings only
        const results = await db
            .select({
                id: listings.id,
                title: listings.title,
                description: listings.description,
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
            .where(
                and(
                    eq(listings.status, "AVAILABLE"),
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
