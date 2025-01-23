import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" }); // or .env.local

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// Example JSON
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
        CREATE DATABASE ${json_example["id"]}

    `);
}
catch (error) {
    console.log(error);
}