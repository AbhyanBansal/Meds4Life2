import { NextRequest } from "next/server";
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
    const redirectUri =
        process.env.GOOGLE_REDIRECT_URI ||
        new URL("/api/auth/google/callback", req.url).toString();

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options: Record<string, string> = {
        redirect_uri: redirectUri,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);
    return redirect(`${rootUrl}?${qs.toString()}`);
}
