import pool from '../src/config/database.js';

async function main() {
  const client = await pool.connect();
  try {
    const alojCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='alojamiento'
      ORDER BY ordinal_position
    `);
    const resCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='reserva'
      ORDER BY ordinal_position
    `);
    const tables = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname='public'
      ORDER BY tablename
    `);
    const aloj = await client.query(`SELECT id, titulo, estado FROM alojamiento ORDER BY id`);
    const reservas = await client.query(`SELECT * FROM reserva ORDER BY id`);

    console.log('\n=== TABLAS ===');
    console.log(tables.rows.map((r) => r.tablename).join(', '));
    console.log('\n=== COLUMNAS alojamiento ===');
    console.table(alojCols.rows);
    console.log('\n=== COLUMNAS reserva ===');
    console.table(resCols.rows);
    console.log('\n=== ALOJAMIENTOS ===');
    console.table(aloj.rows);
    console.log('\n=== RESERVAS ===');
    console.table(reservas.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
