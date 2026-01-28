
import "dotenv/config";
import { neon } from '@neondatabase/serverless';

async function checkColumns() {
    console.log("Checking columns in 'listings' table...");
    try {
        const sql = neon(process.env.DATABASE_URL!);
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'listings';
        `;

        console.table(result);

        const hasLat = result.some(r => r.column_name === 'latitude');
        const hasLon = result.some(r => r.column_name === 'longitude');

        if (hasLat && hasLon) {
            console.log("CONFIRMED: 'latitude' and 'longitude' columns EXIST in the database.");
            process.exit(0);
        } else {
            console.error("ERROR: Columns are MISSING.");
            process.exit(1);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkColumns();
