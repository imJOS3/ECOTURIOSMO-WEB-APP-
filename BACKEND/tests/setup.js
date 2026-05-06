import pool from '../src/config/database.js';

beforeEach(async () => {
  await pool.query(`
    TRUNCATE TABLE 
      resena,
      pago,
      reserva,
      alojamiento,
      usuario
    RESTART IDENTITY CASCADE;
  `);
});