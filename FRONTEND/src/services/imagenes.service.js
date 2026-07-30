import { apiFetch, apiUpload } from "../utils/api";
import { DEFAULT_ESPACIO_FOTO } from "../constants/espaciosFoto";

// items: Array<{ file: File, espacio?: string }>
const uploadImages = async (path, items, ownerField, ownerId) => {
  return Promise.all(
    items.map((item) => {
      const file = item?.file || item;
      const espacio = item?.espacio || DEFAULT_ESPACIO_FOTO;
      const formData = new FormData();
      formData.append("imagen", file);
      formData.append(ownerField, ownerId);
      formData.append("espacio", espacio);
      return apiUpload(path, formData);
    })
  );
};

export const imagenesService = {
  fetchAlojamiento: (id) =>
    apiFetch(`/alojamiento-imagen/alojamiento/${id}`),

  uploadAlojamiento: (id, items) =>
    uploadImages("/alojamiento-imagen", items, "id_alojamiento", id),

  updateEspacio: (imageId, espacio) =>
    apiFetch(`/alojamiento-imagen/${imageId}/espacio`, {
      method: "PATCH",
      body: JSON.stringify({ espacio }),
    }),

  deleteAlojamiento: (idAlojamiento, imageId) =>
    apiFetch(`/alojamiento-imagen/${imageId}`, { method: "DELETE" }),
};
