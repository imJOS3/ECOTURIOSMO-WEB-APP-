import pool from '../../config/database.js';
import * as q from './categoria.relations.queries.js';

const normalizeCategoriaIds = (categorias) => {
  if (categorias === undefined || categorias === null) {
    return undefined;
  }

  if (!Array.isArray(categorias)) {
    return [];
  }

  return [...new Set(categorias.map((categoria) => Number(categoria)).filter((categoriaId) => Number.isInteger(categoriaId) && categoriaId > 0))];
};

const replaceCategorias = async (deleteQuery, insertQuery, entityId, categorias) => {
  const categoriaIds = normalizeCategoriaIds(categorias);

  if (categoriaIds === undefined) {
    return null;
  }

  await pool.query(deleteQuery, [entityId]);

  for (const categoriaId of categoriaIds) {
    await pool.query(insertQuery, [entityId, categoriaId]);
  }

  return categoriaIds;
};

const loadCategorias = async (query, entityId) => {
  const { rows } = await pool.query(query, [entityId]);
  return rows;
};

export const setAlojamientoCategorias = (id, categorias) => replaceCategorias(
  q.deleteAlojamientoCategorias,
  q.insertAlojamientoCategoria,
  id,
  categorias
);

export const setUnidadCategorias = (id, categorias) => replaceCategorias(
  q.deleteUnidadCategorias,
  q.insertUnidadCategoria,
  id,
  categorias
);

export const getAlojamientoCategorias = (id) => loadCategorias(q.getAlojamientoCategorias, id);

export const getUnidadCategorias = (id) => loadCategorias(q.getUnidadCategorias, id);

export const attachAlojamientoCategorias = async (alojamiento) => ({
  ...alojamiento,
  categorias: await getAlojamientoCategorias(alojamiento.id)
});

export const attachUnidadCategorias = async (unidad) => ({
  ...unidad,
  categorias: await getUnidadCategorias(unidad.id)
});

export const validateCategoriasExist = async (
  categorias = [],
  tipo = 'alojamiento'
) => {

  if (!Array.isArray(categorias)) {

    throw new Error(
      'Las categorías deben ser un arreglo'
    );
  }

  if (categorias.length < 1) {

    throw new Error(
      'Debe seleccionar al menos una categoría'
    );
  }

  const { rows } = await pool.query(
    `
    SELECT id
    FROM categoria
    WHERE id = ANY($1)
      AND tipo = $2
    `,
    [categorias, tipo]
  );

  if (rows.length !== categorias.length) {

    throw new Error(
      'Una o más categorías son inválidas'
    );
  }

  return true;
};