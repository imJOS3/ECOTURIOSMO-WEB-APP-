/**
 * Ejecuta migrations/005_usuario_avatar.sql
 * Uso: node migrations/run-005.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, '005_usuario_avatar.sql');

const stripComments = (sql) =>
  sql
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

async function main() {
  const sql = stripComments(fs.readFileSync(sqlPath, 'utf8'));
  const client = await pool.connect();
  try {
    console.log('Agregando avatar_url / avatar_public_id a usuario...');
    await client.query(sql);
    const cols = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'usuario'
        AND column_name IN ('avatar_url', 'avatar_public_id')
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
