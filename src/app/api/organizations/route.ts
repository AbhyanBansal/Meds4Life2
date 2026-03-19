import { db } from "@/db";
import { organizations } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const orgs = await db.select({
            id: organizations.id,
            name: organizations.name,
        }).from(organizations)
            .where(eq(organizations.status, "APPROVED"))
            .orderBy(asc(organizations.name));

        return NextResponse.json(orgs);
    } catch {
        return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
    }
}
