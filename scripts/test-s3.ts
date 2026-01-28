
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import path from "path";

// Load env from root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function checkS3() {
    console.log("Checking S3 Configuration...");
    console.log(`Region: '${process.env.AWS_REGION}'`);
    console.log(`Bucket: '${process.env.AWS_BUCKET_NAME}'`);
    console.log(`Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? "Set" : "Missing"}`);
    console.log(`Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? "Set" : "Missing"}`);

    const client = new S3Client({
        region: process.env.AWS_REGION?.trim(), // Try trimming in case that helps, but usually strict code is needed
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    try {
        console.log("Attempting to list buckets...");
        const data = await client.send(new ListBucketsCommand({}));
        console.log("Success! Buckets found:");
        data.Buckets?.forEach(b => console.log(` - ${b.Name}`));
    } catch (err: any) {
        console.error("Error connecting to S3:");
        console.error(err.name, err.message);
    }
}

checkS3();
