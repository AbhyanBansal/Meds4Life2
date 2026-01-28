'use server'

import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { email, password } = result.data;

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user || !user.password || !(await verifyPassword(password, user.password))) {
        return {
            errors: {
                email: ["Invalid email or password"],
            },
        };
    }

    await createSession({ userId: user.id });

    redirect("/dashboard");
}
