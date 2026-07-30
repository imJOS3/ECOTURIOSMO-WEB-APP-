/**
 * Ejecuta migrations/007_alojamiento_imagen_espacio.sql
 * Uso: node migrations/run-007.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, '007_alojamiento_imagen_espacio.sql');

async function main() {
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = await pool.connect();
  try {
    console.log('Agregando columna espacio a alojamiento_imagen...');
    await client.query(sql);
    const cols = await client.query(`
      SELECT column_name, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'alojamiento_imagen'
        AND column_name = 'espacio'
    `);
    console.log('✓ OK:', cols.rows[0] || 'columna no encontrada');
  } catch (err) {
    console.error('✗ Error:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
