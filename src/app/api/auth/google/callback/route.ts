import { db } from "@/db";
import { users } from "@/db/schema";
import {
    createSessionForUser,
    getPostAuthRedirect,
} from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    const redirectUri =
        process.env.GOOGLE_REDIRECT_URI ||
        new URL("/api/auth/google/callback", req.url).toString();

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
                redirect_uri: redirectUri,
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

        const dbUser = await db.query.users.findFirst({
            where: eq(users.email, googleUser.email),
            with: {
                organization: {
                    columns: {
                        status: true,
                    },
                },
            },
        });

        if (!dbUser) {
            return redirect("/login?error=google_account_not_linked");
        }

        if (dbUser.role !== "SUPER_ADMIN" && !dbUser.organizationId) {
            return redirect("/login?error=google_account_incomplete");
        }

        if (dbUser.status === "REJECTED") {
            return redirect("/login?error=account_rejected");
        }

        if (dbUser.role !== "SUPER_ADMIN" && dbUser.organization?.status === "REJECTED") {
            return redirect("/login?error=organization_rejected");
        }

        await db.update(users).set({
            googleId: googleUser.id,
            avatar: googleUser.picture || dbUser.avatar,
        }).where(eq(users.id, dbUser.id));

        const session = await createSessionForUser(dbUser);
        return redirect(getPostAuthRedirect(session));
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }

        console.error("Google Auth Exception:", error);
        return redirect("/login?error=Google_auth_exception");
    }
}
