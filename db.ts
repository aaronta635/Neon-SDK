import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });


const json_example = {
    "id": "event_01G69A9MDSW8MM1XW5S0EHA0NV",
    "event": "user.created",
    "data": {
      "object": "user",
      "id": "user_01EHWNC0FCBHZ3BJ7EGKYXK0E6",
      "first_name": "Todd",
      "last_name": "Rundgren",
      "email": "todd@example.com",
      "profile_picture_url": null,
      "email_verified": false,
      "created_at": "2023-11-27T19:07:33.155Z",
      "updated_at": "2023-11-27T19:07:33.155Z"
    },
    "created_at": "2023-11-27T19:07:33.155Z"
  }
try {
    await db.execute(`
        CREATE TABLE "table_name" (
            object VARCHAR(255),
            id VARCHAR(255),
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            email VARCHAR(255),
            profile_picture_url VARCHAR(255),
            email_verified BOOLEAN,
            created_at VARCHAR(255),
            updated_at VARCHAR(255),
            neonid VARCHAR(255)
        )
`);
    console.log("Table created successfully!");
} catch (error) {
    console.error("Error creating table:", error.message);
}

