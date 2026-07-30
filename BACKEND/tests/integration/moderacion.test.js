import request from 'supertest';
import app from '../../app.js';
import pool from '../../src/config/database.js';
import { registerPayload } from '../helpers/registerPayload.js';

const unique = Date.now();
const makeEmail = (prefix) => `${prefix}+${unique}@test.com`;

let docCounter = 0;
const registerUser = (nombre, email, rol) => {
  docCounter += 1;
  return request(app).post('/api/auth/register').send(
    registerPayload({
      nombre,
      email,
      password: 'Test1234!',
      rol,
      suffix: `${unique}${docCounter}`,
    })
  );
};

const ensureCategoria = async () => {
  const existing = await pool.query(
    `SELECT id FROM categoria WHERE tipo = 'alojamiento' ORDER BY id ASC LIMIT 1`
  );
  if (existing.rows[0]) return existing.rows[0].id;

  const created = await pool.query(
    `INSERT INTO categoria (nombre, tipo) VALUES ($1, 'alojamiento') RETURNING id`,
    [`Eco ${unique}`]
  );
  return created.rows[0].id;
};

describe('Moderacion API', () => {
  it('should moderate alojamientos with public visibility and reservation rules', async () => {
    const adminEmail = makeEmail('admin_moderacion');
    const hostEmail = makeEmail('host_moderacion');
    const touristEmail = makeEmail('tourist_moderacion');
    const categoriaId = await ensureCategoria();

    await registerUser('Admin Moderacion', adminEmail, 'admin');
    await registerUser('Host Moderacion', hostEmail, 'anfitrion');
    await registerUser('Turista Moderacion', touristEmail, 'turista');

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: 'Test1234!'
    });
    const hostLogin = await request(app).post('/api/auth/login').send({
      email: hostEmail,
      password: 'Test1234!'
    });
    const touristLogin = await request(app).post('/api/auth/login').send({
      email: touristEmail,
      password: 'Test1234!'
    });

    const adminToken = adminLogin.body.token;
    const hostToken = hostLogin.body.token;
    const touristToken = touristLogin.body.token;

    const alojamientoPendiente = await request(app)
      .post('/api/alojamientos')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        titulo: 'Eco Lodge Moderacion',
        descripcion: 'Alojamiento para validar moderacion publica',
        ubicacion: 'Medellin',
        latitud: 6.2442,
        longitud: -75.5812,
        precio_noche: 150,
        capacidad: 2,
        es_compartido: false,
        categorias: [categoriaId]
      });

    expect(alojamientoPendiente.statusCode).toBe(201);
    expect(alojamientoPendiente.body.estado).toBe('pendiente_revision');

    const publicBefore = await request(app).get('/api/alojamientos');
    expect(publicBefore.statusCode).toBe(200);
    expect(publicBefore.body.some((item) => item.id === alojamientoPendiente.body.id)).toBe(false);

    const touristBefore = await request(app).get(`/api/alojamientos/${alojamientoPendiente.body.id}`);
    expect(touristBefore.statusCode).toBe(404);

    const hostTryModeration = await request(app)
      .post(`/api/admin/moderacion/alojamientos/${alojamientoPendiente.body.id}/aprobar`)
      .set('Authorization', `Bearer ${hostToken}`);
    expect(hostTryModeration.statusCode).toBe(403);

    const aprobarAlojamiento = await request(app)
      .post(`/api/admin/moderacion/alojamientos/${alojamientoPendiente.body.id}/aprobar`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(aprobarAlojamiento.statusCode).toBe(200);
    expect(aprobarAlojamiento.body.estado).toBe('aprobado');

    const visibleAfterApproval = await request(app).get('/api/alojamientos');
    expect(visibleAfterApproval.body.some((item) => item.id === alojamientoPendiente.body.id)).toBe(true);

    const reservaExitosa = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        id_alojamiento: alojamientoPendiente.body.id,
        fecha_inicio: '2026-06-01',
        fecha_fin: '2026-06-03'
      });

    expect(reservaExitosa.statusCode).toBe(201);

    const alojamientoRechazado = await request(app)
      .post('/api/alojamientos')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        titulo: 'Eco Lodge Rechazado',
        descripcion: 'Contenido para rechazo',
        ubicacion: 'Guatape',
        latitud: 6.2308,
        longitud: -75.1586,
        precio_noche: 90,
        capacidad: 3,
        categorias: [categoriaId]
      });

    const rechazo = await request(app)
      .post(`/api/admin/moderacion/alojamientos/${alojamientoRechazado.body.id}/rechazar`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ motivo: 'Información incompleta' });

    expect(rechazo.statusCode).toBe(200);
    expect(rechazo.body.estado).toBe('rechazado');
    expect(rechazo.body.motivo_rechazo).toBe('Información incompleta');

    const suspendido = await request(app)
      .post(`/api/admin/moderacion/alojamientos/${alojamientoPendiente.body.id}/suspender`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ motivo: 'Mantenimiento' });

    expect(suspendido.statusCode).toBe(200);
    expect(suspendido.body.estado).toBe('suspendido');

    const reservaBloqueada = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        id_alojamiento: alojamientoPendiente.body.id,
        fecha_inicio: '2026-06-10',
        fecha_fin: '2026-06-12'
      });

    expect(reservaBloqueada.statusCode).toBe(403);

    const publicAfterSuspend = await request(app).get('/api/alojamientos');
    expect(publicAfterSuspend.body.some((item) => item.id === alojamientoPendiente.body.id)).toBe(false);

    const logs = await pool.query('SELECT * FROM moderacion_log ORDER BY id ASC');
    expect(logs.rows.length).toBeGreaterThanOrEqual(3);
  });
});
