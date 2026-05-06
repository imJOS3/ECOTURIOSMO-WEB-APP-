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
      ubicacion: 'Colombia'
    }, { id: 1 }); // 👈 mock user

    expect(alojamiento.id).toBeDefined();
  });

});