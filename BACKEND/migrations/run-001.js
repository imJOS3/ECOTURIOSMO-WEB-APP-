/**
 * Ejecuta la migración 001_unidad_to_alojamiento.sql
 * usando la conexión de .env del backend.
 *
 * Uso:  node migrations/run-001.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlPath = path.join(__dirname, '001_unidad_to_alojamiento.sql');

const stripVerificationComments = (sql) =>
  sql
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

async function main() {
  const raw = fs.readFileSync(sqlPath, 'utf8');
  const sql = stripVerificationComments(raw);

  console.log('Conectando a la base de datos...');
  const client = await pool.connect();

  try {
    console.log('Ejecutando migración (eliminar unidad → solo alojamiento)...');
    await client.query(sql);

    const cols = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'alojamiento'
      ORDER BY ordinal_position
    `);

    const reservas = await client.query(`
      SELECT id, id_alojamiento, total, estado
      FROM reserva
      ORDER BY id
    `);

    const unidadExists = await client.query(`SELECT to_regclass('public.unidad') AS tabla`);

    console.log('\n✓ Migración completada');
    console.log('Columnas de alojamiento:', cols.rows.map((r) => r.column_name).join(', '));
    console.log('Tabla unidad:', unidadExists.rows[0].tabla === null ? 'eliminada' : unidadExists.rows[0].tabla);
    console.log('Reservas:');
    console.table(reservas.rows);
  } catch (err) {
    console.error('\n✗ Error en la migración:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
