import {
  PLACEHOLDER_META,
  PLACEHOLDER_HOST,
  PLACEHOLDER_LOCATION,
} from "../placeholderData";
import { getEntityCategories, getPrimaryImage } from "../../../utils/media";
import { FAVORITO_MIN_RATING, FAVORITO_MIN_REVIEWS } from "./constants";
import { averageRating, fuzzCoord, yearsSince } from "./mapUtils";

const buildMetaStats = (item) => {
  const huespedes = item.huespedes ?? item.capacidad ?? PLACEHOLDER_META.huespedes;
  const habitaciones = item.habitaciones ?? PLACEHOLDER_META.habitaciones;
  const camas = item.camas ?? PLACEHOLDER_META.camas;
  const banos = item.banos ?? PLACEHOLDER_META.banos;

  return [
    `${huespedes} huésped${huespedes !== 1 ? "es" : ""}`,
    `${habitaciones} habitación${habitaciones !== 1 ? "es" : ""}`,
    `${camas} cama${camas !== 1 ? "s" : ""}`,
    `${banos} baño${banos !== 1 ? "s" : ""}`,
  ];
};

const buildHost = (item) => {
  const hostSince = item.anfitrion_desde || item.anfitrion?.creado_en || PLACEHOLDER_HOST.desde;

  return {
    nombre: item.nombre_anfitrion || item.anfitrion?.nombre || PLACEHOLDER_HOST.nombre,
    avatarUrl: item.anfitrion_avatar_url || item.anfitrion?.avatar_url || PLACEHOLDER_HOST.avatarUrl,
    verificado: item.anfitrion?.verificado ?? PLACEHOLDER_HOST.verificado,
    esSuperanfitrion: item.anfitrion?.es_superanfitrion ?? PLACEHOLDER_HOST.esSuperanfitrion,
    numResenas: item.anfitrion?.num_resenas ?? PLACEHOLDER_HOST.numResenas,
    calificacion: item.anfitrion?.calificacion ?? PLACEHOLDER_HOST.calificacion,
    ocupacion: item.anfitrion?.ocupacion ?? PLACEHOLDER_HOST.ocupacion,
    ciudad: item.anfitrion?.ciudad ?? PLACEHOLDER_HOST.ciudad,
    pais: item.anfitrion?.pais ?? PLACEHOLDER_HOST.pais,
    indiceRespuesta: item.anfitrion?.indice_respuesta ?? PLACEHOLDER_HOST.indiceRespuesta,
    tiempoRespuesta: item.anfitrion?.tiempo_respuesta ?? PLACEHOLDER_HOST.tiempoRespuesta,
    aniosAnfitrionando: yearsSince(hostSince),
  };
};

const buildGalleryImages = (item, imagenes) => {
  if (imagenes.length > 0) return imagenes;
  const primary = getPrimaryImage(item);
  return primary ? [primary] : [];
};

/**
 * View-model puro del detalle (SRP): transforma item + datos cargados
 * en lo que las secciones presentacionales necesitan. Sin React, sin IO.
 */
export const buildDetailViewModel = ({ item, imagenes = [], resenas = [] }) => {
  const avgRating = averageRating(resenas);
  const lat = item.latitud ? parseFloat(item.latitud) : PLACEHOLDER_LOCATION.lat;
  const lon = item.longitud ? parseFloat(item.longitud) : PLACEHOLDER_LOCATION.lon;

  return {
    titulo: item.titulo,
    descripcion: item.descripcion || "",
    ubicacion: item.ubicacion,
    estado: item.estado || item.estado_publicacion,
    precioNoche: Number(item.precio_noche || item.precio_desde || 0),
    categorias: getEntityCategories(item),
    servicios: Array.isArray(item.servicios) ? item.servicios : [],
    galleryImages: buildGalleryImages(item, imagenes),
    metaStats: buildMetaStats(item),
    host: buildHost(item),
    avgRating,
    reviewCount: resenas.length,
    esFavorito:
      Boolean(avgRating) &&
      parseFloat(avgRating) >= FAVORITO_MIN_RATING &&
      resenas.length >= FAVORITO_MIN_REVIEWS,
    coords: { lat, lon },
    approx: fuzzCoord(lat, lon, item.id),
  };
};
