import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Neon connection string
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    console.log('Connected to Neon! Current time is:', result.rows[0].current_time);
  } catch (error) {
    console.error('Failed to connect to Neon:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
