import { create } from "zustand";
import { imagenesService } from "../services/imagenes.service";

const entityKey = (entityType, id) => `${entityType}:${id}`;

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Ocurrió un error";

export const useImagenesStore = create((set) => ({
  byEntity: {},
  loadingByEntity: {},
  errorByEntity: {},

  // =========================
  // FETCH
  // =========================
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

      const items = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

      set((state) => ({
        byEntity: { ...state.byEntity, [key]: items },
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
      }));

      return items;
    } catch (error) {
      set((state) => ({
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
        errorByEntity: { ...state.errorByEntity, [key]: getErrorMessage(error) },
      }));
      throw error;
    }
  },

  // =========================
  // UPLOAD
  // =========================
  uploadImagenes: async ({ entityType, id, files }) => {
    const key = entityKey(entityType, id);

    set((state) => ({
      loadingByEntity: { ...state.loadingByEntity, [key]: true },
      errorByEntity: { ...state.errorByEntity, [key]: null },
    }));

    try {
      const data = entityType === "alojamiento"
        ? await imagenesService.uploadAlojamiento(id, files)
        : await imagenesService.uploadUnidad(id, files);

      // Soporta que el backend devuelva un solo objeto o un array
      const newItems = Array.isArray(data?.data)
        ? data.data
        : data?.data
          ? [data.data]
          : [];

      set((state) => ({
        byEntity: {
          ...state.byEntity,
          [key]: [...(state.byEntity[key] || []), ...newItems],
        },
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
      }));

      return data;
    } catch (error) {
      set((state) => ({
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
        errorByEntity: { ...state.errorByEntity, [key]: getErrorMessage(error) },
      }));
      throw error;
    }
  },

  // =========================
  // DELETE
  // =========================
  deleteImagen: async ({ entityType, entityId, imageId }) => {
    const key = entityKey(entityType, entityId);

    set((state) => ({
      loadingByEntity: { ...state.loadingByEntity, [key]: true },
      errorByEntity: { ...state.errorByEntity, [key]: null },
    }));

    try {
      const result = entityType === "alojamiento"
        ? await imagenesService.deleteAlojamiento(entityId, imageId)
        : await imagenesService.deleteUnidad(entityId, imageId);

      set((state) => ({
        byEntity: {
          ...state.byEntity,
          [key]: (state.byEntity[key] || []).filter(
            (image) =>
              `${image.id ?? image.id_imagen ?? image.public_id}` !== `${imageId}`
          ),
        },
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
      }));

      return result;
    } catch (error) {
      set((state) => ({
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
        errorByEntity: { ...state.errorByEntity, [key]: getErrorMessage(error) },
      }));
      throw error;
    }
  },
}));