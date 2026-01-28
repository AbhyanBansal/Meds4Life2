import { pgTable, text, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const listingStatusEnum = pgEnum("listing_status", [
    "AVAILABLE",
    "RESERVED",
    "COLLECTED",
    "EXPIRED",
]);

export const requestStatusEnum = pgEnum("request_status", [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "COMPLETED",
]);

// Users Table
export const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    password: text("password"),
    googleId: text("google_id").unique(),
    name: text("name"),
    avatar: text("avatar"),
    rating: doublePrecision("rating").default(0.0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Listings Table
export const listings = pgTable("listings", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description"),
    quantity: text("quantity").notNull(),
    expiryDate: timestamp("expiry_date").notNull(),
    saltName: text("salt_name"), // Optional additional details
    strength: text("strength"), // Optional additional details
    images: text("images").array(), // Stored as Array of Strings
    packagingType: text("packaging_type"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    status: listingStatusEnum("status").default("AVAILABLE"),

    ownerId: text("owner_id").notNull().references(() => users.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// Requests Table
export const requests = pgTable("requests", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    status: requestStatusEnum("status").default("PENDING"),

    requesterId: text("requester_id").notNull().references(() => users.id),
    listingId: text("listing_id").notNull().references(() => listings.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
