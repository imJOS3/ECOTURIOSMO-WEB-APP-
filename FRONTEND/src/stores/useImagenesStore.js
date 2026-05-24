import { create } from "zustand";
import { imagenesService } from "../services/imagenes.service";

const entityKey = (entityType, id) => `${entityType}:${id}`;

export const useImagenesStore = create((set, get) => ({
  byEntity: {},
  loadingByEntity: {},
  errorByEntity: {},
  fetchImagenes: async ({ entityType, id }) => {
    const key = entityKey(entityType, id);
    set((state) => ({
      loadingByEntity: { ...state.loadingByEntity, [key]: true },
      errorByEntity: { ...state.errorByEntity, [key]: null },
    }));

    try {
      const data = entityType === "alojamiento"
        ? await imagenesService.fetchAlojamiento(id)
        : await imagenesService.fetchUnidad(id);

      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      set((state) => ({
        byEntity: { ...state.byEntity, [key]: items },
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
      }));
      return items;
    } catch (error) {
      set((state) => ({
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
        errorByEntity: { ...state.errorByEntity, [key]: error.message },
      }));
      throw error;
    }
  },
  uploadImagenes: async ({ entityType, id, files }) => {
    const result = entityType === "alojamiento"
      ? await imagenesService.uploadAlojamiento(id, files)
      : await imagenesService.uploadUnidad(id, files);

    set((state) => ({
      byEntity: {
        ...state.byEntity,
        [entityKey(entityType, id)]: [],
      },
    }));

    return result;
  },
  deleteImagen: async ({ entityType, entityId, imageId }) => {
    const result = entityType === "alojamiento"
      ? await imagenesService.deleteAlojamiento(entityId, imageId)
      : await imagenesService.deleteUnidad(entityId, imageId);

    const key = entityKey(entityType, entityId);
    set((state) => ({
      byEntity: {
        ...state.byEntity,
        [key]: (get().byEntity[key] || []).filter((image) => `${image.id ?? image.id_imagen ?? image.public_id}` !== `${imageId}`),
      },
    }));

    return result;
  },
}));
