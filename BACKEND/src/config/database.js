import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const useSsl =
  process.env.DB_SSL === 'true' ||
  process.env.DB_SSL === '1' ||
  process.env.NODE_ENV === 'production';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

export default pool;
