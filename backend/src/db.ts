import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: 'db',
  database: process.env.POSTGRES_DB || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: 5432,
});

pool.on('connect', async (client) => {
  await client.query('SET search_path TO app_schema');
});

export default pool;
