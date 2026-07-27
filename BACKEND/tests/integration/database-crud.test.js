import pool from '../../src/config/database.js';

const uniqueText = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

const createUsuario = async ({ rol = 'turista' } = {}) => {
  const nombre = uniqueText(`user_${rol}`);
  const email = `${nombre}@test.com`;

  const { rows } = await pool.query(
    `INSERT INTO usuario (nombre, email, password_hash, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nombre, email, 'hash_test', rol]
  );

  return rows[0];
};

const createAlojamiento = async (idAnfitrion) => {
  const { rows } = await pool.query(
    `INSERT INTO alojamiento (
       id_anfitrion, titulo, descripcion, ubicacion, latitud, longitud,
       precio_noche, capacidad, es_compartido, estado
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'aprobado')
     RETURNING *`,
    [
      idAnfitrion,
      uniqueText('alojamiento'),
      'Descripcion de prueba para alojamiento',
      'Medellin',
      6.2442,
      -75.5812,
      100,
      2,
      false
    ]
  );

  return rows[0];
};

describe('Database CRUD', () => {
  beforeAll(() => {
    pool.query = pool.constructor.prototype.query.bind(pool);
  });

  it('CRUD usuario', async () => {
    const create = await pool.query(
      `INSERT INTO usuario (nombre, email, password_hash, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [uniqueText('usuario'), `${uniqueText('email')}@test.com`, 'hash_pwd', 'turista']
    );

    const usuario = create.rows[0];
    expect(usuario.id).toBeDefined();

    const read = await pool.query('SELECT * FROM usuario WHERE id = $1', [usuario.id]);
    expect(read.rows[0].email).toBe(usuario.email);

    const nuevoNombre = uniqueText('usuario_updated');
    const update = await pool.query(
      `UPDATE usuario
       SET nombre = $1, rol = $2
       WHERE id = $3
       RETURNING *`,
      [nuevoNombre, 'admin', usuario.id]
    );
    expect(update.rows[0].nombre).toBe(nuevoNombre);
    expect(update.rows[0].rol).toBe('admin');

    await pool.query('DELETE FROM usuario WHERE id = $1', [usuario.id]);
    const afterDelete = await pool.query('SELECT id FROM usuario WHERE id = $1', [usuario.id]);
    expect(afterDelete.rows).toHaveLength(0);
  });

  it('CRUD alojamiento', async () => {
    const anfitrion = await createUsuario({ rol: 'anfitrion' });

    const create = await pool.query(
      `INSERT INTO alojamiento (
         id_anfitrion, titulo, descripcion, ubicacion, latitud, longitud,
         precio_noche, capacidad, es_compartido, estado
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pendiente_revision')
       RETURNING *`,
      [
        anfitrion.id,
        uniqueText('eco_house'),
        'Descripcion larga para crear alojamiento',
        'Guatape',
        6.2308,
        -75.1586,
        120,
        4,
        false
      ]
    );

    const alojamiento = create.rows[0];
    expect(alojamiento.id_anfitrion).toBe(anfitrion.id);
    expect(Number(alojamiento.precio_noche)).toBe(120);

    const read = await pool.query('SELECT * FROM alojamiento WHERE id = $1', [alojamiento.id]);
    expect(read.rows[0].id).toBe(alojamiento.id);

    const update = await pool.query(
      `UPDATE alojamiento
       SET titulo = $1, estado = $2, precio_noche = $3
       WHERE id = $4
       RETURNING *`,
      [uniqueText('eco_house_updated'), 'rechazado', 150, alojamiento.id]
    );
    expect(update.rows[0].estado).toBe('rechazado');
    expect(Number(update.rows[0].precio_noche)).toBe(150);

    await pool.query('DELETE FROM alojamiento WHERE id = $1', [alojamiento.id]);
    const afterDelete = await pool.query('SELECT id FROM alojamiento WHERE id = $1', [alojamiento.id]);
    expect(afterDelete.rows).toHaveLength(0);
  });

  it('CRUD reserva', async () => {
    const turista = await createUsuario({ rol: 'turista' });
    const anfitrion = await createUsuario({ rol: 'anfitrion' });
    const alojamiento = await createAlojamiento(anfitrion.id);

    const create = await pool.query(
      `INSERT INTO reserva (id_turista, id_alojamiento, fecha_inicio, fecha_fin, estado, total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [turista.id, alojamiento.id, '2026-06-01', '2026-06-03', 'pendiente', 200.0]
    );

    const reserva = create.rows[0];
    expect(reserva.id_turista).toBe(turista.id);
    expect(reserva.id_alojamiento).toBe(alojamiento.id);

    const read = await pool.query('SELECT * FROM reserva WHERE id = $1', [reserva.id]);
    expect(read.rows[0].estado).toBe('pendiente');

    const update = await pool.query(
      `UPDATE reserva
       SET estado = $1, total = $2
       WHERE id = $3
       RETURNING *`,
      ['confirmada', 250.0, reserva.id]
    );
    expect(update.rows[0].estado).toBe('confirmada');
    expect(Number(update.rows[0].total)).toBe(250);

    await pool.query('DELETE FROM reserva WHERE id = $1', [reserva.id]);
    const afterDelete = await pool.query('SELECT id FROM reserva WHERE id = $1', [reserva.id]);
    expect(afterDelete.rows).toHaveLength(0);
  });

  it('CRUD pago', async () => {
    const turista = await createUsuario({ rol: 'turista' });
    const anfitrion = await createUsuario({ rol: 'anfitrion' });
    const alojamiento = await createAlojamiento(anfitrion.id);

    const reservaResult = await pool.query(
      `INSERT INTO reserva (id_turista, id_alojamiento, fecha_inicio, fecha_fin, estado, total)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [turista.id, alojamiento.id, '2026-07-01', '2026-07-03', 'pendiente', 200.0]
    );

    const create = await pool.query(
      `INSERT INTO pago (id_reserva, monto, metodo, estado, referencia_externa)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reservaResult.rows[0].id, 200.0, 'tarjeta', 'exitoso', uniqueText('ref')]
    );

    const pago = create.rows[0];
    expect(pago.id_reserva).toBe(reservaResult.rows[0].id);

    const read = await pool.query('SELECT * FROM pago WHERE id = $1', [pago.id]);
    expect(Number(read.rows[0].monto)).toBe(200);

    const update = await pool.query(
      `UPDATE pago
       SET estado = $1, metodo = $2
       WHERE id = $3
       RETURNING *`,
      ['reembolsado', 'transferencia', pago.id]
    );
    expect(update.rows[0].estado).toBe('reembolsado');

    await pool.query('DELETE FROM pago WHERE id = $1', [pago.id]);
    const afterDelete = await pool.query('SELECT id FROM pago WHERE id = $1', [pago.id]);
    expect(afterDelete.rows).toHaveLength(0);
  });

  it('CRUD resena', async () => {
    const turista = await createUsuario({ rol: 'turista' });
    const anfitrion = await createUsuario({ rol: 'anfitrion' });
    const alojamiento = await createAlojamiento(anfitrion.id);

    const create = await pool.query(
      `INSERT INTO resena (id_turista, id_alojamiento, calificacion, comentario)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [turista.id, alojamiento.id, 5, 'Excelente lugar']
    );

    const resena = create.rows[0];
    expect(resena.id_alojamiento).toBe(alojamiento.id);

    const read = await pool.query('SELECT * FROM resena WHERE id = $1', [resena.id]);
    expect(read.rows[0].calificacion).toBe(5);

    const update = await pool.query(
      `UPDATE resena
       SET calificacion = $1, comentario = $2
       WHERE id = $3
       RETURNING *`,
      [4, 'Muy bueno', resena.id]
    );
    expect(update.rows[0].calificacion).toBe(4);

    await pool.query('DELETE FROM resena WHERE id = $1', [resena.id]);
    const afterDelete = await pool.query('SELECT id FROM resena WHERE id = $1', [resena.id]);
    expect(afterDelete.rows).toHaveLength(0);
  });

  it('CRUD categoria', async () => {
    const create = await pool.query(
      `INSERT INTO categoria (nombre)
       VALUES ($1)
       RETURNING *`,
      [uniqueText('categoria')]
    );

    const categoria = create.rows[0];
    expect(categoria.id).toBeDefined();

    const read = await pool.query('SELECT * FROM categoria WHERE id = $1', [categoria.id]);
    expect(read.rows[0].nombre).toBe(categoria.nombre);

    const nuevoNombre = uniqueText('categoria_updated');
    const update = await pool.query(
      `UPDATE categoria
       SET nombre = $1
       WHERE id = $2
       RETURNING *`,
      [nuevoNombre, categoria.id]
    );
    expect(update.rows[0].nombre).toBe(nuevoNombre);

    await pool.query('DELETE FROM categoria WHERE id = $1', [categoria.id]);
    const afterDelete = await pool.query('SELECT id FROM categoria WHERE id = $1', [categoria.id]);
    expect(afterDelete.rows).toHaveLength(0);
  });
});
