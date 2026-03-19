'use server'

import { db } from "@/db";
import { users } from "@/db/schema";
import {
    createSessionForUser,
    getPostAuthRedirect,
    verifyPassword,
} from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginState = {
    errors?: {
        email?: string[];
        password?: string[];
    };
    message?: string;
} | undefined;

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.email, result.data.email),
            with: {
                organization: {
                    columns: {
                        status: true,
                    },
                },
            },
        });

        if (!user?.password || !(await verifyPassword(result.data.password, user.password))) {
            return {
                errors: {
                    email: ["Invalid credentials"],
                },
            };
        }

        if (user.role !== 'SUPER_ADMIN' && !user.organizationId) {
            return {
                errors: {
                    email: ["User setup is incomplete. Please contact support."],
                },
            };
        }

        if (user.status === 'REJECTED') {
            return {
                errors: {
                    email: ["Your account request was rejected by the organization admin."],
                },
            };
        }

        if (user.role !== 'SUPER_ADMIN' && user.organization?.status === 'REJECTED') {
            return {
                errors: {
                    email: ["Your organization signup was rejected by the super admin."],
                },
            };
        }

        const session = await createSessionForUser(user);

        redirect(getPostAuthRedirect(session));
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        return {
            errors: {
                email: [error instanceof Error ? error.message : "Invalid credentials"],
            },
        };
    }
}
