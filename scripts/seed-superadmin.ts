
import "dotenv/config";
import { neon } from '@neondatabase/serverless';
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

async function main() {
    console.log("🌱 Seeding Super Admin...");

    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is missing from .env");
        process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        // Check if super admin exists
        const existingUsers = await sql`SELECT id FROM users WHERE email = 'admin@medishare.com'`;

        if (existingUsers.length > 0) {
            console.log("⚠️ Super Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);
        const newId = randomUUID();

        // Insert Super Admin
        await sql`
            INSERT INTO users (id, name, email, password, role, status, organization_id)
            VALUES (${newId}, 'Super Admin', 'admin@medishare.com', ${hashedPassword}, 'SUPER_ADMIN', 'APPROVED', NULL)
        `;

        console.log("✅ Super Admin created successfully!");
        console.log("📧 Email: admin@medishare.com");
        console.log("🔑 Password: admin123");

    } catch (error) {
        console.error("❌ Failed to seed Super Admin:", error);
        console.error(error); // Print full error
        process.exit(1);
    }
}

main();
