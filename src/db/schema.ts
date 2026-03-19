import { pgTable, text, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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

export const userRoleEnum = pgEnum("user_role", [
    "ORG_ADMIN",
    "MEMBER",
    "SUPER_ADMIN",
]);

export const orgStatusEnum = pgEnum("org_status", [
    "PENDING",
    "APPROVED",
    "REJECTED",
]);

export const userStatusEnum = pgEnum("user_status", [
    "PENDING",
    "APPROVED",
    "REJECTED",
]);

// Organizations Table
export const organizations = pgTable("organizations", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    status: orgStatusEnum("status").default("PENDING"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const organizationsRelations = relations(organizations, ({ many }) => ({
    members: many(users),
    listings: many(listings),
}));

// Users Table
export const users = pgTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    password: text("password"),
    googleId: text("google_id").unique(),
    name: text("name"),
    avatar: text("avatar"),
    rating: doublePrecision("rating").default(0.0),

    // Organization Relations
    organizationId: text("organization_id").references(() => organizations.id),
    role: userRoleEnum("role").default("MEMBER"),
    status: userStatusEnum("status").default("PENDING"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    organization: one(organizations, {
        fields: [users.organizationId],
        references: [organizations.id],
    }),
    listings: many(listings),
    requests: many(requests),
}));

// Listings Table
export const listings = pgTable("listings", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description"),
    quantity: text("quantity").notNull(),
    expiryDate: timestamp("expiry_date").notNull(),
    saltName: text("salt_name"),
    strength: text("strength"),
    images: text("images").array(),
    packagingType: text("packaging_type"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    status: listingStatusEnum("status").default("AVAILABLE"),

    ownerId: text("owner_id").notNull().references(() => users.id),
    organizationId: text("organization_id").notNull().references(() => organizations.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const listingsRelations = relations(listings, ({ one, many }) => ({
    owner: one(users, {
        fields: [listings.ownerId],
        references: [users.id],
    }),
    organization: one(organizations, {
        fields: [listings.organizationId],
        references: [organizations.id],
    }),
    requests: many(requests),
}));

// Requests Table
export const requests = pgTable("requests", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    status: requestStatusEnum("status").default("PENDING"),

    requesterId: text("requester_id").notNull().references(() => users.id),
    listingId: text("listing_id").notNull().references(() => listings.id),

    // Optional: Denormalize org ID for request filtering or rely on listing
    // Since exchange is within organization, requester and listing should be in same org.
    organizationId: text("organization_id").notNull().references(() => organizations.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export const requestsRelations = relations(requests, ({ one }) => ({
    requester: one(users, {
        fields: [requests.requesterId],
        references: [users.id],
    }),
    listing: one(listings, {
        fields: [requests.listingId],
        references: [listings.id],
    }),
}));
