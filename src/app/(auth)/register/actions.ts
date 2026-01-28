'use server'

import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function signup(prevState: any, formData: FormData) {
    const result = registerSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { name, email, password } = result.data;

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        return {
            errors: {
                email: ["Email already in use"],
            },
        };
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
    }).returning();

    await createSession({ userId: newUser.id });

    redirect("/dashboard");
}
