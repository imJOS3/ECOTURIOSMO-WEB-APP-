/**
 * Ejecuta migrations/008_usuario_google_auth.sql
 * Uso: node migrations/run-008.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, '008_usuario_google_auth.sql');

async function main() {
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = await pool.connect();
  try {
    console.log('Agregando auth_provider / google_id a usuario...');
    await client.query(sql);
    const cols = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'usuario'
        AND column_name IN ('auth_provider', 'google_id')
      ORDER BY column_name
    `);
    console.log('✓ OK:', cols.rows.map((r) => r.column_name).join(', '));
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
