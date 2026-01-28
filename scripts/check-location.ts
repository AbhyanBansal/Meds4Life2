import "dotenv/config";
import { db } from "../src/db";
import { listings } from "../src/db/schema";
import { desc } from "drizzle-orm";

async function checkLocations() {
    console.log("Checking latest listings for location data...");

    const recentListings = await db.select({
        id: listings.id,
        title: listings.title,
        latitude: listings.latitude,
        longitude: listings.longitude,
        createdAt: listings.createdAt
    })
        .from(listings)
        .orderBy(desc(listings.createdAt))
        .limit(5);

    console.table(recentListings);

    // Check if any have valid location
    const withLocation = recentListings.filter(l => l.latitude !== null && l.longitude !== null);
    console.log(`Found ${withLocation.length} listings with location data out of ${recentListings.length} recent listings.`);

    if (withLocation.length > 0) {
        console.log("Verification SUCCESS: Location data is being stored.");
    } else {
        console.log("Verification WARNING: No location data found in recent listings. Did you create a new listing with location yet?");
    }

    process.exit(0);
}

checkLocations().catch(console.error);
