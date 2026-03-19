import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

type ProxySession = {
    userId?: string;
    organizationId?: string | null;
    role?: "ORG_ADMIN" | "MEMBER" | "SUPER_ADMIN";
    status?: "PENDING" | "APPROVED" | "REJECTED";
    orgStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
};

function getJwtKey() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is required.");
    }

    return new TextEncoder().encode(secret);
}

function redirectWithSessionReset(req: NextRequest, pathname: string) {
    const response = NextResponse.redirect(new URL(pathname, req.nextUrl));
    response.cookies.delete("session");
    return response;
}

export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = path.startsWith("/dashboard");
    const sessionCookie = req.cookies.get("session")?.value;

    let session: ProxySession | null = null;

    if (sessionCookie) {
        try {
            const { payload } = await jwtVerify<ProxySession>(sessionCookie, getJwtKey(), {
                algorithms: ["HS256"],
            });
            session = payload;
        } catch {
            session = null;
        }
    }

    if (!session && isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (
        session &&
        session.role !== "SUPER_ADMIN" &&
        session.organizationId &&
        typeof session.orgStatus === "undefined"
    ) {
        return redirectWithSessionReset(req, "/login?error=session_refresh_required");
    }

    if (session?.status === "REJECTED") {
        return redirectWithSessionReset(req, "/login?error=account_rejected");
    }

    if (session?.role !== "SUPER_ADMIN" && session?.orgStatus === "REJECTED") {
        return redirectWithSessionReset(req, "/login?error=organization_rejected");
    }

    if (session && session.status === "PENDING" && path.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/approval-pending", req.nextUrl));
    }

    if (
        session &&
        session.role !== "SUPER_ADMIN" &&
        session.orgStatus === "PENDING" &&
        path.startsWith("/dashboard")
    ) {
        return NextResponse.redirect(new URL("/org-pending", req.nextUrl));
    }

    if (session && path === "/approval-pending") {
        if (session.status === "APPROVED") {
            if (session.role !== "SUPER_ADMIN" && session.orgStatus === "PENDING") {
                return NextResponse.redirect(new URL("/org-pending", req.nextUrl));
            }

            const destination = session.role === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard";
            return NextResponse.redirect(new URL(destination, req.nextUrl));
        }
    }

    if (session && path === "/org-pending") {
        if (session.role === "SUPER_ADMIN") {
            return NextResponse.redirect(new URL("/dashboard/super-admin", req.nextUrl));
        }

        if (session.orgStatus === "REJECTED") {
            return redirectWithSessionReset(req, "/login?error=organization_rejected");
        }

        if (session.orgStatus === "APPROVED") {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
        }
    }

    if (session && (path === "/login" || path === "/register" || path === "/")) {
        if (session.status === "PENDING") {
            return NextResponse.redirect(new URL("/approval-pending", req.nextUrl));
        }

        if (session.role !== "SUPER_ADMIN" && session.orgStatus === "PENDING") {
            return NextResponse.redirect(new URL("/org-pending", req.nextUrl));
        }

        const destination = session.role === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard";
        return NextResponse.redirect(new URL(destination, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
