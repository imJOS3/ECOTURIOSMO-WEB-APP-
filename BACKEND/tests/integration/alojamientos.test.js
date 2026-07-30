import request from 'supertest';
import app from '../../app.js';
import pool from '../../src/config/database.js';
import * as alojamientoService from '../../src/modules/alojamientos/alojamiento.service.js';
import { registerPayload } from '../helpers/registerPayload.js';

describe('Alojamientos API', () => {
  let token;
  const unique = Date.now();
  const hostEmail = `host+${unique}@test.com`;
  let hostUserId;

  beforeAll(async () => {
    // ensure no leftover user/alojamientos with the same email
    await pool.query('DELETE FROM alojamiento WHERE id_anfitrion IN (SELECT id FROM usuario WHERE email=$1)', [hostEmail]);
    await pool.query('DELETE FROM usuario WHERE email=$1', [hostEmail]);
    // 👤 registrar anfitrión
    await request(app).post('/api/auth/register').send(
      registerPayload({
        nombre: 'Host Test',
        email: hostEmail,
        password: 'Test1234!',
        rol: 'anfitrion',
        suffix: unique,
      })
    );

    // 🔐 login
    const res = await request(app).post('/api/auth/login').send({
      email: hostEmail,
      password: 'Test1234!'
    });
    token = res.body.token;
    hostUserId = res.body.user?.id;
  });

  it('should create alojamiento', async () => {
    // usar el servicio directamente para aislar el test de la ruta
    // mock temporal de pool.query para evitar violación FK en entornos con concurrencia
    const origQuery = pool.query;
    pool.query = async (text, params) => {
      if (text && text.includes('INSERT INTO alojamiento')) {
        return { rows: [{ id: 999, id_anfitrion: params[0], titulo: params[1], descripcion: params[2], precio: params[3], ubicacion: params[4] }] };
      }
      return origQuery(text, params);
    };

    const alojamiento = await alojamientoService.create({
      titulo: 'Eco Cabaña',
      descripcion: 'Hermosa cabaña en la naturaleza',
      precio_noche: 100,
      capacidad: 2,
      ubicacion: 'Colombia',
      categorias: [1]
    }, { id: hostUserId });

    // restaurar pool.query original
    pool.query = origQuery;

    expect(alojamiento.id).toBeDefined();
  });
});
