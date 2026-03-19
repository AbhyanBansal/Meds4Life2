/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("Loading .env from:", envPath);
} else {
    console.log(".env file not found at:", envPath);
}

console.log("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY present:", !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
console.log("CLERK_SECRET_KEY present:", !!process.env.CLERK_SECRET_KEY);
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("AWS_REGION present:", !!process.env.AWS_REGION);
