import { deleteSession } from "@/lib/auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getAppRoot(req: NextRequest) {
    return process.env.NEXT_PUBLIC_APP_URL || new URL("/", req.url).toString();
}

export async function GET(req: NextRequest) {
    await deleteSession();
    return NextResponse.redirect(new URL(getAppRoot(req)));
}

export async function POST(req: NextRequest) {
    await deleteSession();
    return NextResponse.redirect(new URL(getAppRoot(req)));
}
