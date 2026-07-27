/**
 * Ejecuta migrations/003_mensajes.sql
 * Uso: node migrations/run-003.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, '003_mensajes.sql');

const stripComments = (sql) =>
  sql
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

async function main() {
  const sql = stripComments(fs.readFileSync(sqlPath, 'utf8'));
  const client = await pool.connect();
  try {
    console.log('Creando tablas de mensajería...');
    await client.query(sql);
    const tables = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename IN ('conversacion', 'conversacion_participante', 'mensaje')
      ORDER BY tablename
    `);
    console.log('✓ OK:', tables.rows.map((r) => r.tablename).join(', '));
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
