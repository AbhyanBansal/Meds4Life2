import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
        return redirect("/login?error=Google_auth_failed_no_code");
    }

    try {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback",
                grant_type: "authorization_code",
            }),
        });

        const tokens = await tokenResponse.json();

        if (!tokens.access_token) {
            console.error("Google Auth Token Error:", tokens);
            return redirect("/login?error=Google_auth_failed_token");
        }

        const userResponse = await fetch(
            `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`
        );

        const googleUser = await userResponse.json();

        if (!googleUser.email) {
            return redirect("/login?error=Google_email_not_found");
        }

        let dbUser = await db.query.users.findFirst({
            where: eq(users.email, googleUser.email)
        });

        if (!dbUser) {
            // Create new user
            const [newUser] = await db.insert(users).values({
                email: googleUser.email,
                name: googleUser.name,
                avatar: googleUser.picture,
                googleId: googleUser.id,
            }).returning();
            dbUser = newUser;
        } else {
            // Update Google ID and Avatar for existing user
            await db.update(users).set({
                googleId: googleUser.id,
                avatar: googleUser.picture || dbUser.avatar
            }).where(eq(users.id, dbUser.id));
        }

        await createSession({ userId: dbUser.id });

        return redirect("/dashboard");
    } catch (error) {
        console.error("Google Auth Exception:", error);
        return redirect("/login?error=Google_auth_exception");
    }
}
