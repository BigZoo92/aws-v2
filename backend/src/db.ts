import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.POSTGRES_USER);
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: 5434,
});

pool.on('connect', async (client) => {
  await client.query('SET search_path TO app_schema');
});

export default pool;
