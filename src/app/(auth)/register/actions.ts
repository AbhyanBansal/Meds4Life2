'use server'

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import {
    createSessionForUser,
    getPostAuthRedirect,
    getUserForSession,
    hashPassword,
} from "@/lib/auth";

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    orgMode: z.enum(['create', 'join']),
    orgName: z.string().optional(),
    orgId: z.string().optional(),
}).refine((data) => {
    if (data.orgMode === 'create' && !data.orgName) return false;
    if (data.orgMode === 'join' && !data.orgId) return false;
    return true;
}, {
    message: "Organization details required",
    path: ["orgName"],
});

export type SignupState = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        orgName?: string[];
        orgId?: string[];
    };
} | undefined;

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
    const rawData = Object.fromEntries(formData);
    const result = registerSchema.safeParse(rawData);

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    try {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, result.data.email),
        });

        if (existingUser) {
            return {
                errors: {
                    email: ["Email already registered"],
                },
            };
        }

        let organizationId = result.data.orgId ?? null;
        let role: "ORG_ADMIN" | "MEMBER" = "MEMBER";
        let status: "APPROVED" | "PENDING" = "PENDING";

        if (result.data.orgMode === 'create') {
            const existingOrg = await db.query.organizations.findFirst({
                where: eq(organizations.name, result.data.orgName!),
            });

            if (existingOrg) {
                return {
                    errors: {
                        orgName: ["Organization name is already in use"],
                    },
                };
            }

            const [newOrganization] = await db.insert(organizations).values({
                name: result.data.orgName!,
                status: "PENDING",
            }).returning({
                id: organizations.id,
            });

            organizationId = newOrganization.id;
            role = "ORG_ADMIN";
            status = "APPROVED";
        } else {
            const organization = await db.query.organizations.findFirst({
                where: eq(organizations.id, result.data.orgId!),
                columns: {
                    id: true,
                    status: true,
                },
            });

            if (!organization) {
                return {
                    errors: {
                        orgId: ["Organization not found"],
                    },
                };
            }

            if (organization.status !== "APPROVED") {
                return {
                    errors: {
                        orgId: ["Only approved organizations can accept new members"],
                    },
                };
            }

            organizationId = organization.id;
        }

        const hashedPassword = await hashPassword(result.data.password);

        const [newUser] = await db.insert(users).values({
            name: result.data.name,
            email: result.data.email,
            password: hashedPassword,
            organizationId,
            role,
            status,
        }).returning({
            id: users.id,
        });

        const sessionUser = await getUserForSession(newUser.id);

        if (!sessionUser) {
            return {
                errors: {
                    email: ["Registration failed. Please try again."],
                },
            };
        }

        const session = await createSessionForUser(sessionUser);
        redirect(getPostAuthRedirect(session));
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            errors: {
                email: [error instanceof Error ? error.message : "Registration failed"],
            },
        };
    }
}
