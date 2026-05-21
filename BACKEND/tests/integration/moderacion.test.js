import request from 'supertest';
import app from '../../app.js';
import pool from '../../src/config/database.js';

const unique = Date.now();
const makeEmail = (prefix) => `${prefix}+${unique}@test.com`;

const registerUser = (nombre, email, rol) => {
  return request(app).post('/api/auth/register').send({
    nombre,
    email,
    password: '123456',
    rol
  });
};

describe('Moderacion API', () => {
  it('should moderate alojamientos and unidades with public visibility and reservation rules', async () => {
    const adminEmail = makeEmail('admin_moderacion');
    const hostEmail = makeEmail('host_moderacion');
    const touristEmail = makeEmail('tourist_moderacion');

    await registerUser('Admin Moderacion', adminEmail, 'admin');
    await registerUser('Host Moderacion', hostEmail, 'anfitrion');
    await registerUser('Turista Moderacion', touristEmail, 'turista');

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: adminEmail,
      password: '123456'
    });
    const hostLogin = await request(app).post('/api/auth/login').send({
      email: hostEmail,
      password: '123456'
    });
    const touristLogin = await request(app).post('/api/auth/login').send({
      email: touristEmail,
      password: '123456'
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
        longitud: -75.5812
      });

    expect(alojamientoPendiente.statusCode).toBe(201);
    expect(alojamientoPendiente.body.estado_publicacion).toBe('pendiente_revision');

    const unidadPendiente = await request(app)
      .post('/api/unidades')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        id_alojamiento: alojamientoPendiente.body.id,
        nombre: 'Suite Moderacion',
        tipo: 'habitacion',
        descripcion: 'Unidad de prueba para moderacion',
        capacidad: 2,
        es_compartido: false,
        precio_noche: 150
      });

    expect(unidadPendiente.statusCode).toBe(201);
    expect(unidadPendiente.body.data.estado_publicacion).toBe('pendiente_revision');

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
    expect(aprobarAlojamiento.body.estado_publicacion).toBe('aprobado');

    const aprobarUnidad = await request(app)
      .post(`/api/admin/moderacion/unidades/${unidadPendiente.body.data.id}/aprobar`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(aprobarUnidad.statusCode).toBe(200);
    expect(aprobarUnidad.body.estado_publicacion).toBe('aprobado');

    const visibleAfterApproval = await request(app).get('/api/alojamientos');
    expect(visibleAfterApproval.body.some((item) => item.id === alojamientoPendiente.body.id)).toBe(true);

    const visibleUnitsAfterApproval = await request(app).get(`/api/unidades/alojamiento/${alojamientoPendiente.body.id}`);
    expect(visibleUnitsAfterApproval.statusCode).toBe(200);
    expect(visibleUnitsAfterApproval.body.data.some((item) => item.id === unidadPendiente.body.data.id)).toBe(true);

    const reservaExitosa = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        id_unidad: unidadPendiente.body.data.id,
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
        longitud: -75.1586
      });

    const rechazo = await request(app)
      .post(`/api/admin/moderacion/alojamientos/${alojamientoRechazado.body.id}/rechazar`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ motivo: 'Información incompleta' });

    expect(rechazo.statusCode).toBe(200);
    expect(rechazo.body.estado_publicacion).toBe('rechazado');
    expect(rechazo.body.motivo_rechazo).toBe('Información incompleta');

    const suspendido = await request(app)
      .post(`/api/admin/moderacion/unidades/${unidadPendiente.body.data.id}/suspender`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ motivo: 'Mantenimiento' });

    expect(suspendido.statusCode).toBe(200);
    expect(suspendido.body.estado_publicacion).toBe('suspendido');

    const reservaBloqueada = await request(app)
      .post('/api/reservas')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        id_unidad: unidadPendiente.body.data.id,
        fecha_inicio: '2026-06-10',
        fecha_fin: '2026-06-12'
      });

    expect(reservaBloqueada.statusCode).toBe(403);

    const publicAfterSuspend = await request(app).get(`/api/unidades/alojamiento/${alojamientoPendiente.body.id}`);
    expect(publicAfterSuspend.body.data).toHaveLength(0);

    const logs = await pool.query('SELECT * FROM moderacion_log ORDER BY id ASC');
    expect(logs.rows.length).toBeGreaterThanOrEqual(4);
  });
});
