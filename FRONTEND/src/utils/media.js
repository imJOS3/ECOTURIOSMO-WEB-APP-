const IMAGE_KEYS = [
  "imagenes",
  "imagenes_alojamiento",
  "imagenes_unidad",
  "images",
  "media",
  "galeria",
  "gallery",
  "photos",
];

const URL_KEYS = ["url", "image_url", "imagen_url", "src", "path"];

export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.data)) return value.data;
  return [];
};

export const normalizeImages = (entity) => {
  if (!entity) return [];

  const directList = IMAGE_KEYS.flatMap((key) => toArray(entity[key]));
  const nestedList = [entity.imagenes_relacionadas, entity.gallery]
    .flatMap((entry) => toArray(entry));

  const images = [...directList, ...nestedList].filter(Boolean);

  return images.map((image, index) => {
    if (typeof image === "string") {
      return { id: `img-${index}`, url: image };
    }

    const url = URL_KEYS.map((key) => image?.[key]).find(Boolean) || image?.secure_url || image?.public_url || image?.image || image?.imagen;

    return {
      ...image,
      id: image?.id ?? image?.id_imagen ?? image?.public_id ?? `img-${index}`,
      url,
      public_id: image?.public_id,
    };
  }).filter((image) => image.url);
};

export const getPrimaryImage = (entity) => normalizeImages(entity)[0]?.url || "";

export const getEntityCategories = (entity) => toArray(entity?.categorias)
  .map((categoria) => ({
    id: categoria?.id,
    nombre: categoria?.nombre || categoria?.name || String(categoria),
    tipo: categoria?.tipo,
  }))
  .filter((categoria) => categoria.nombre);

export const formatCurrency = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(number) ? number : 0);
};