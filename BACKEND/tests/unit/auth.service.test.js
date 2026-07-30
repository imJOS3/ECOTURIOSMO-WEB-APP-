import request from 'supertest';
import app from '../../app.js';
import pool from '../../src/config/database.js';
import { registerPayload } from '../helpers/registerPayload.js';

let tokenTurista;
let tokenAnfitrion;
let tokenAdmin;
const unique = Date.now();
const emailTurista = `test_role_turista+${unique}@test.com`;
const emailAnfitrion = `test_role_anfitrion+${unique}@test.com`;
const emailAdmin = `test_role_admin+${unique}@test.com`;

describe('Roles & Authorization', () => {

  // 🧹 limpiar antes
  beforeAll(async () => {
    await pool.query("DELETE FROM usuario WHERE email LIKE 'test_role%'");
    await pool.query('DELETE FROM usuario WHERE email=$1 OR email=$2 OR email=$3', [emailTurista, emailAnfitrion, emailAdmin]);

    // 👤 crear usuarios únicos y usar la respuesta para obtener id/rol
    const resTurista = await request(app).post('/api/auth/register').send(
      registerPayload({
        nombre: 'Turista Prueba',
        email: emailTurista,
        rol: 'turista',
        suffix: `${unique}1`,
      })
    );

    const resAnfitrion = await request(app).post('/api/auth/register').send(
      registerPayload({
        nombre: 'Anfitrion Prueba',
        email: emailAnfitrion,
        rol: 'anfitrion',
        suffix: `${unique}2`,
      })
    );

    const resAdmin = await request(app).post('/api/auth/register').send(
      registerPayload({
        nombre: 'Admin Prueba',
        email: emailAdmin,
        rol: 'admin',
        suffix: `${unique}3`,
      })
    );

    const { generateToken } = await import('../../src/utils/jwt.js');

    tokenTurista = generateToken({ id: resTurista.body.id, rol: resTurista.body.rol });
    tokenAnfitrion = generateToken({ id: resAnfitrion.body.id, rol: resAnfitrion.body.rol });
    tokenAdmin = generateToken({ id: resAdmin.body.id, rol: resAdmin.body.rol });
  });

  // ❌ SIN TOKEN
  it('should fail without token (401)', async () => {
    const res = await request(app).get('/api/usuarios');
    expect(res.statusCode).toBe(401);
  });

  // ❌ TURISTA intentando crear alojamiento
  it('should fail if turista tries to create alojamiento (403)', async () => {
    const res = await request(app)
      .post('/api/alojamientos')
      .set('Authorization', `Bearer ${tokenTurista}`)
      .send({
        titulo: 'Eco Cabaña'
      });

    expect(res.statusCode).toBe(403);
  });

  // ✅ ANFITRIÓN puede crear alojamiento
  it('should allow anfitrion to create alojamiento (201)', async () => {
    // mockeo temporal de la inserción en alojamiento para evitar violación de FK en entorno de tests paralelos
    const origQuery = pool.query;
    pool.query = async (text, params) => {
      if (text && text.includes('INSERT INTO alojamiento')) {
        return { rows: [{ id: 777, id_anfitrion: params[0], titulo: params[1] }] };
      }
      return origQuery(text, params);
    };

    const res = await request(app)
      .post('/api/alojamientos')
      .set('Authorization', `Bearer ${tokenAnfitrion}`)
      .send({
        titulo: 'Eco Cabaña',
        descripcion: 'Hermosa cabaña ecológica en zona rural',
        ubicacion: 'Colombia',
        latitud: 6.2442,
        longitud: -75.5812
      });

    // restaurar query original
    pool.query = origQuery;

    expect(res.statusCode).toBe(201);
  });

  // ❌ ANFITRIÓN intentando acceder a admin
  it('should fail if anfitrion tries admin route (403)', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAnfitrion}`);

    expect(res.statusCode).toBe(403);
  });

  // ✅ ADMIN puede acceder
  it('should allow admin to access usuarios (200)', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.statusCode).toBe(200);
  });


});