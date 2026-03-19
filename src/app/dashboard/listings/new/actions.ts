"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { listings, users } from "@/db/schema";
import { uploadFileToS3 } from "@/lib/s3";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const listingSchema = z.object({
    title: z.string().min(1, "Medicine name is required"),
    saltName: z.string().optional(),
    strength: z.string().optional().refine((val) => !val || !isNaN(Number(val)), {
        message: "Strength must be a valid number",
    }),
    description: z.string().optional(),
    quantity: z.string().min(1, "Quantity is required"),
    expiryDate: z.string().min(1, "Expiry date is required"),
    packagingType: z.string().min(1, "Packaging type is required"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

export type State = {
    errors?: {
        title?: string[];
        saltName?: string[];
        strength?: string[];
        description?: string[];
        quantity?: string[];
        expiryDate?: string[];
        packagingType?: string[];
        images?: string[];
        latitude?: string[];
        longitude?: string[];
    };
    message?: string | null;
    success?: boolean;
    listingId?: string;
};

export async function createListing(prevState: State, formData: FormData): Promise<State> {
    const session = await getSession();
    const userId = session?.userId as string;

    if (!userId) {
        return {
            message: "Unauthorized",
            success: false,
        };
    }

    const rawData = {
        title: formData.get("title") as string,
        saltName: formData.get("saltName") as string,
        strength: formData.get("strength") as string,
        description: formData.get("description") as string,
        quantity: formData.get("quantity") as string,
        expiryDate: formData.get("expiryDate") as string,
        packagingType: formData.get("packagingType") as string,
        latitude: formData.get("latitude") as string,
        longitude: formData.get("longitude") as string,
    };

    const validatedFields = listingSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing Fields. Failed to Create Listing.",
            success: false,
        };
    }

    // Verify expiry date is in the future
    const inputExpiryDate = new Date(validatedFields.data.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputExpiryDate < today) {
        return {
            errors: { expiryDate: ["Expiry date cannot be in the past."] },
            message: "Invalid Expiry Date.",
            success: false,
        };
    }

    // Handle Images
    const image = formData.get("images") as File; // Get single file
    const imageKeys: string[] = [];

    // Validate image
    if (!image || image.size === 0 || image.name === "undefined") {
        return {
            message: "Medicine image is required.",
            success: false,
            errors: { images: ["Please upload an image of the medicine."] }
        };
    }

    try {
        const buffer = Buffer.from(await image.arrayBuffer());
        // Generate a unique filename: timestamp-userId-originalname
        const filename = `${Date.now()}-${userId}-${image.name.replace(/\s/g, '-')}`;
        const key = await uploadFileToS3(buffer, filename, image.type);
        imageKeys.push(key);
    } catch (error) {
        console.error("Error uploading image:", error);
        return {
            message: "Failed to upload image.",
            success: false,
        };
    }

    // Double check if images were uploaded if they are mandatory
    if (imageKeys.length === 0) {
        return {
            message: "Failed to process image.",
            success: false,
        };
    }

    const { title, description, quantity, saltName, strength, packagingType, latitude, longitude } = validatedFields.data; // expiryDate is already parsed above

    // Fetch User to get Organization ID
    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { organizationId: true }
    });

    if (!user || !user.organizationId) {
        return {
            message: "You must belong to an organization to create listings.",
            success: false,
        };
    }

    let newListingId: string;

    try {
        const [insertedListing] = await db.insert(listings).values({
            title,
            description,
            quantity,
            expiryDate: inputExpiryDate,
            saltName,
            strength,
            packagingType,
            images: imageKeys,
            ownerId: userId,
            organizationId: user.organizationId,
            status: "AVAILABLE",
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
        }).returning({
            id: listings.id
        });

        if (!insertedListing) {
            throw new Error("Failed to retrieve new listing ID");
        }
        newListingId = insertedListing.id;

    } catch (error) {
        console.error("Database Error:", error);
        return {
            message: "Database Error: Failed to Create Listing.",
            success: false,
        };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/listings");

    return {
        message: "Listing created successfully!",
        success: true,
        listingId: newListingId,
    };
}
