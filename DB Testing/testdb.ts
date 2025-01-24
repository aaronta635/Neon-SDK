import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { randomBytes } from "crypto";

config({ path: ".env" }); // Load environment variables

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const NEON_API_KEY = process.env.NEON_API_KEY!;
const PROJECT_ID = "sweet-dew-80690065";
const BRANCH_ID = "br-dawn-rain-a8kouja8";

// Function to get the current database count in a branch
async function getDatabaseCount(projectId: string, branchId: string): Promise<number> {
  const response = await fetch(
    `https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}/databases`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${NEON_API_KEY}`,
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();
  return data.databases?.length || 0;
}

// Function to create a new branch
async function createBranch(projectId: string): Promise<string> {
  const response = await fetch(
    `https://console.neon.tech/api/v2/projects/${projectId}/branches`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NEON_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `branch_${Date.now()}`,
        parent_id: BRANCH_ID,
      }),
    }
  );

  const data = await response.json();
  return data.branch?.id || ""; // Return the new branch ID
}

// Function to create a new project
async function createProject(): Promise<string> {
  const response = await fetch(`https://console.neon.tech/api/v2/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NEON_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `project_${Date.now()}`,
    }),
  });

  const data = await response.json();
  return data.project?.id || ""; // Return the new project ID
}

// Function to create a database
async function createDatabase(projectId: string, branchId: string, databaseName: string) {
  const response = await fetch(
    `https://console.neon.tech/api/v2/projects/${projectId}/branches/${branchId}/databases`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NEON_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        database: {
          name: databaseName,
          owner_name: "neondb_owner",
        },
      }),
    }
  );

  const data = await response.json();
  return data;
}

// Main function to handle database allocation
async function handleDatabaseAllocation(userId: string) {
  let projectId = PROJECT_ID;
  let branchId = BRANCH_ID;

  // Check current branch database count
  let dbCount = await getDatabaseCount(projectId, branchId);

  // If the branch is full, create a new branch or project
  if (dbCount >= 50) {
    branchId = await createBranch(projectId);
    if (!branchId) {
      console.log("Branch limit reached, creating a new project.");
      projectId = await createProject();
      branchId = await createBranch(projectId);
    }
  }

  // Create the database for the user
  const databaseName = `db_${userId}_${Date.now()}`;
  const dbData = await createDatabase(projectId, branchId, databaseName);

  console.log("Database created successfully:", dbData);

  function generateUserId(): string {
    const randomStr = randomBytes(16).toString('base64'); // Generate random 16 bytes and convert to base64
    const userId = `user_${randomStr.replace(/\//g, '0').replace(/\+/g, '1').substring(0, 26)}`;
    return userId;
  }
  
  const user = generateUserId();

  // Store metadata in the main table
  await db.execute(`
    INSERT INTO allocations (project_id, branch_id, database_name, created_at, event, user_id, email_verified)
    VALUES ('${projectId}', '${branchId}', '${databaseName}', NOW(), 'user_created', '${user}', 'false');
  `);

  console.log("Database metadata stored successfully.");
}

// Example Usage
(async () => {
  try {
    const userId = "user_123"; // Replace with your logic to generate a user ID
    await handleDatabaseAllocation(userId);
  } catch (error) {
    console.error("Error in database allocation:", error);
  }
})();
