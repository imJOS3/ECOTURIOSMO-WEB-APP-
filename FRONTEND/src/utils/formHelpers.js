import { normalizeImages } from "./media";

export const toCategoryIds = (value) =>
  Array.isArray(value)
    ? value.map((categoria) => Number(categoria?.id ?? categoria)).filter(Boolean)
    : [];

export const toServicioIds = (value) =>
  Array.isArray(value)
    ? value.map((servicio) => Number(servicio?.id ?? servicio)).filter(Boolean)
    : [];

export const toImageList = (value) => normalizeImages({ imagenes: value });

export const baseAlojamiento = (data = {}) => ({
  titulo: data.titulo || "",
  descripcion: data.descripcion || "",
  ubicacion: data.ubicacion || "",
  latitud: data.latitud ?? "",
  longitud: data.longitud ?? "",
  precio_noche: data.precio_noche ?? "",
  capacidad: data.capacidad ?? "",
  es_compartido: Boolean(data.es_compartido),
  habitaciones: data.habitaciones ?? "",
  camas: data.camas ?? "",
  banos: data.banos ?? "",
  categorias: toCategoryIds(data.categorias || []),
  servicios: toServicioIds(data.servicios || []),
});

export const normalizeAlojamientoImages = (data) => {
  if (!data) return [];
  return toImageList(data.imagenes || data.images || data.gallery || []);
};
