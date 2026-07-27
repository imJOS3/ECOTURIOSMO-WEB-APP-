import pool from '../src/config/database.js';

async function main() {
  const client = await pool.connect();
  try {
    // Asegurar defaults en alojamientos (por si quedaron en 0)
    await client.query(`
      UPDATE alojamiento
      SET
        precio_noche = COALESCE(NULLIF(precio_noche, 0), 100000),
        capacidad = COALESCE(NULLIF(capacidad, 0), 1),
        es_compartido = COALESCE(es_compartido, FALSE),
        habitaciones = COALESCE(habitaciones, 1),
        camas = COALESCE(camas, capacidad, 1),
        banos = COALESCE(banos, 1)
      WHERE precio_noche IS NULL
         OR precio_noche = 0
         OR capacidad IS NULL
         OR capacidad = 0
    `);

    // Categorías viejas tipo unidad → alojamiento
    const cat = await client.query(`
      UPDATE categoria
      SET tipo = 'alojamiento'
      WHERE tipo = 'unidad'
      RETURNING id, nombre, tipo
    `);

    // Por si quedaran tablas residuales
    await client.query(`DROP TABLE IF EXISTS unidad_imagen CASCADE`);
    await client.query(`DROP TABLE IF EXISTS unidad_categoria CASCADE`);
    await client.query(`DROP TABLE IF EXISTS unidad CASCADE`);
    await client.query(`DROP SEQUENCE IF EXISTS unidad_id_seq CASCADE`);
    await client.query(`DROP SEQUENCE IF EXISTS unidad_imagen_id_seq CASCADE`);

    const aloj = await client.query(`
      SELECT id, titulo, precio_noche, capacidad, es_compartido, habitaciones, camas, banos, estado
      FROM alojamiento ORDER BY id
    `);

    const leftover = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname='public' AND tablename LIKE '%unidad%'
    `);

    console.log('Categorías convertidas:', cat.rowCount);
    if (cat.rows.length) console.table(cat.rows);
    console.log('\nAlojamientos:');
    console.table(aloj.rows);
    console.log('\nTablas *unidad* restantes:', leftover.rows.length ? leftover.rows : 'ninguna');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
