import * as service from '../../src/modules/alojamientos/alojamiento.service.js';
import pool from '../../src/config/database.js';

// Mock DB queries for unit tests to keep them isolated without relying on jest globals
let _origQuery;
beforeAll(() => {
  _origQuery = pool.query;
  pool.query = async (text, params) => {
    if (text && text.includes('INSERT INTO alojamiento')) {
      return { rows: [{ id: 1, id_anfitrion: params[0], titulo: params[1], descripcion: params[2], precio: params[3], ubicacion: params[4] }] };
    }
    if (text && text.includes('FROM categoria c') && text.includes('alojamiento_categoria')) {
      return { rows: [{ id: 10, nombre: 'Mirador' }, { id: 11, nombre: 'Naturaleza' }] };
    }
    return { rows: [] };
  };
});

afterAll(() => {
  if (_origQuery) pool.query = _origQuery;
});

describe('Alojamiento Service', () => {

  it('should create alojamiento', async () => {
    const alojamiento = await service.create({
      titulo: 'Unit Test',
      descripcion: 'Test desc',
      precio: 100,
      ubicacion: 'Colombia',
      categorias: [10, 11]
    }, { id: 1 }); // 👈 mock user

    expect(alojamiento.id).toBeDefined();
    expect(alojamiento.categorias).toHaveLength(2);
  });

  it('should hide approved alojamiento from turista when it has no approved units', async () => {
    const origQuery = pool.query;
    pool.query = async (text, params) => {
      if (text === 'SELECT * FROM alojamiento WHERE id = $1;') {
        return {
          rows: [{
            id: params[0],
            id_anfitrion: 10,
            estado: 'aprobado'
          }]
        };
      }

      if (text && text.includes('FROM unidad') && text.includes('estado = \'aprobado\'')) {
        return { rows: [] };
      }

      return { rows: [] };
    };

    const alojamiento = await service.getById(123, { rol: 'turista' });

    pool.query = origQuery;

    expect(alojamiento).toBeNull();
  });

});