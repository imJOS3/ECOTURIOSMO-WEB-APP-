import { apiFetch, apiUpload } from "../utils/api";

const buildImageFormData = (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("imagenes", file);
  });
  return formData;
};

const uploadLegacyImages = async (path, files) => {
  const results = [];
  for (const file of files) {
    const legacyFormData = new FormData();
    legacyFormData.append("imagen", file);
    const result = await apiUpload(path, legacyFormData);
    results.push(result);
  }
  return results;
};

const fetchWithFallback = async (preferred, fallback) => {
  try {
    return await apiFetch(preferred);
  } catch (preferredError) {
    if (!fallback) throw preferredError;
    return apiFetch(fallback);
  }
};

const uploadWithFallback = async ({ preferred, fallback, files }) => {
  try {
    return await apiUpload(preferred, buildImageFormData(files));
  } catch (preferredError) {
    if (!fallback) throw preferredError;
    return uploadLegacyImages(fallback, files);
  }
};

export const imagenesService = {
  fetchAlojamiento: (id) => fetchWithFallback(
    `/alojamientos/${id}/imagenes`,
    `/alojamiento-imagen/alojamiento/${id}`
  ),
  fetchUnidad: (id) => fetchWithFallback(
    `/unidades/${id}/imagenes`,
    `/unidad-imagen/unidad/${id}`
  ),
  uploadAlojamiento: (id, files) => uploadWithFallback({
    preferred: `/alojamientos/${id}/imagenes`,
    fallback: "/alojamiento-imagen",
    files,
  }),
  uploadUnidad: (id, files) => uploadWithFallback({
    preferred: `/unidades/${id}/imagenes`,
    fallback: "/unidad-imagen",
    files,
  }),
  deleteAlojamiento: (idAlojamiento, imageId) => apiFetch(`/alojamientos/${idAlojamiento}/imagenes/${imageId}`, { method: "DELETE" })
    .catch(() => apiFetch(`/alojamiento-imagen/${imageId}`, { method: "DELETE" })),
  deleteUnidad: (idUnidad, imageId) => apiFetch(`/unidades/${idUnidad}/imagenes/${imageId}`, { method: "DELETE" })
    .catch(() => apiFetch(`/unidad-imagen/${imageId}`, { method: "DELETE" })),
};
