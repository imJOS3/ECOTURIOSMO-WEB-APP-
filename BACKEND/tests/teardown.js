import pool from '../src/config/database.js';

export default async () => {
  await pool.end();
};