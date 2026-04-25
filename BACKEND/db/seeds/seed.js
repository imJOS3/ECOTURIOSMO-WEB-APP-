import pool from '../src/config/database.js';

const seed = async () => {
  await pool.query(`
    INSERT INTO usuario(nombre, email, password_hash, rol)
    VALUES 
    ('Admin', 'admin@test.com', '123456', 'admin'),
    ('Anfitrion', 'host@test.com', '123456', 'anfitrion'),
    ('Turista', 'user@test.com', '123456', 'turista')
  `);

  console.log('Seed ejecutado');
  process.exit();
};

seed();