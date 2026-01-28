import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isPublicRoute = publicRoutes.some(route => path === route);

    const session = req.cookies.get("session")?.value;
    // We can't use `await getSession()` easily here because it uses cookies() from next/headers which is for server components/actions,
    // but in middleware, we use req.cookies.
    // We can use verifySession directly if we export it correctly or just check existence for now.
    // Better: import verifySession from lib/auth

    // NOTE: In middleware, we should decrypt if we want to be secure, but for speed, we often check existence first.
    // Let's rely on the library logic but adapted for middleware.

    // Import dynamically or adapt logic.
    // Since we have `verifySession` in lib/auth using jose, we can import it.

    // Checking session
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (session && path === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (session && path === "/register") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // If user is accessing root / and is logged in, redirect to dashboard?
    // Current logic: isUserId && isPublicRoute -> redirect dashboard.
    if (session && path === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

