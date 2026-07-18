import { normalizeImages } from "./media";

export const toCategoryIds = (value) =>
  Array.isArray(value)
    ? value.map((categoria) => Number(categoria?.id ?? categoria)).filter(Boolean)
    : [];

export const toImageList = (value) => normalizeImages({ imagenes: value });

export const baseAlojamiento = (data = {}) => ({
  titulo: data.titulo || "",
  descripcion: data.descripcion || "",
  ubicacion: data.ubicacion || "",
  latitud: data.latitud ?? "",
  longitud: data.longitud ?? "",
  categorias: toCategoryIds(data.categorias || []),
});

export const baseUnidad = (data = {}) => ({
  nombre: data.nombre || "",
  tipo: data.tipo || "habitacion",
  descripcion: data.descripcion || "",
  capacidad: data.capacidad || 1,
  es_compartido: Boolean(data.es_compartido),
  precio_noche: data.precio_noche ?? "",
  cupos_disponibles: data.cupos_disponibles || data.capacidad || 1,
  categorias: toCategoryIds(data.categorias || []),
});

export const normalizeAlojamientoImages = (data) => {
  if (!data) return [];
  return toImageList(data.imagenes || data.images || data.gallery || []);
};

export const normalizeUnidadImages = (data) => {
  if (!data) return [];
  return toImageList(data.imagenes || data.images || data.gallery || []);
};