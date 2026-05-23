import * as service from '../../src/modules/unidades/unidad.service.js';
import pool from '../../src/config/database.js';

let _origQuery;

beforeAll(() => {
  _origQuery = pool.query;
  pool.query = async (text, params) => {
    if (text && text.includes('FROM alojamiento') && text.includes('WHERE id = $1')) {
      return { rows: [{ id: params[0], id_anfitrion: 1 }] };
    }

    if (text && text.includes('INSERT INTO unidad')) {
      return {
        rows: [{
          id: 99,
          id_alojamiento: params[0],
          nombre: params[1],
          tipo: params[2],
          descripcion: params[3],
          capacidad: params[4],
          cupos_disponibles: params[5],
          es_compartido: params[6],
          precio_noche: params[7],
          estado: params[8]
        }]
      };
    }

    if (text && text.includes('FROM categoria c') && text.includes('unidad_categoria')) {
      return { rows: [{ id: 1, nombre: 'Mirador' }, { id: 2, nombre: 'Naturaleza' }] };
    }

    return { rows: [] };
  };
});

afterAll(() => {
  if (_origQuery) pool.query = _origQuery;
});

describe('Unidad Service', () => {
  it('should create unit with multiple categories', async () => {
    const unidad = await service.create({
      id_alojamiento: 1,
      nombre: 'Cabaña Mirador',
      tipo: 'cabaña',
      descripcion: 'Unidad con vista a la naturaleza',
      capacidad: 4,
      es_compartido: false,
      precio_noche: 120,
      categorias: [1, 2]
    }, { id: 1, rol: 'anfitrion' });

    expect(unidad.id).toBe(99);
    expect(unidad.categorias).toHaveLength(2);
  });
});