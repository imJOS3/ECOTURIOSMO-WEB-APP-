import { create } from "zustand";
import { imagenesService } from "../services/imagenes.service";

const entityKey = (entityType, id) => `${entityType}:${id}`;

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Ocurrió un error";

const normalizeUploadItems = (filesOrItems) =>
  (filesOrItems || []).map((item) =>
    item?.file
      ? { file: item.file, espacio: item.espacio }
      : { file: item, espacio: item?.espacio }
  );

export const useImagenesStore = create((set) => ({
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
      if (entityType !== "alojamiento") {
        throw new Error("Solo se admiten imágenes de alojamiento");
      }

      const data = await imagenesService.fetchAlojamiento(id);

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

  uploadImagenes: async ({ entityType, id, files, items }) => {
    const key = entityKey(entityType, id);
    const payload = normalizeUploadItems(items || files);

    set((state) => ({
      loadingByEntity: { ...state.loadingByEntity, [key]: true },
      errorByEntity: { ...state.errorByEntity, [key]: null },
    }));

    try {
      if (entityType !== "alojamiento") {
        throw new Error("Solo se admiten imágenes de alojamiento");
      }

      const responses = await imagenesService.uploadAlojamiento(id, payload);

      const newItems = (responses || [])
        .map((res) => res?.data)
        .filter(Boolean);

      set((state) => ({
        byEntity: {
          ...state.byEntity,
          [key]: [...(state.byEntity[key] || []), ...newItems],
        },
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
      }));

      return newItems;
    } catch (error) {
      set((state) => ({
        loadingByEntity: { ...state.loadingByEntity, [key]: false },
        errorByEntity: { ...state.errorByEntity, [key]: getErrorMessage(error) },
      }));
      throw error;
    }
  },

  updateImagenEspacio: async ({ entityType, entityId, imageId, espacio }) => {
    const key = entityKey(entityType, entityId);

    if (entityType !== "alojamiento") {
      throw new Error("Solo se admiten imágenes de alojamiento");
    }

    const data = await imagenesService.updateEspacio(imageId, espacio);
    const updated = data?.data || data;

    set((state) => ({
      byEntity: {
        ...state.byEntity,
        [key]: (state.byEntity[key] || []).map((image) =>
          `${image.id}` === `${imageId}`
            ? { ...image, ...updated, espacio }
            : image
        ),
      },
    }));

    return updated;
  },

  deleteImagen: async ({ entityType, entityId, imageId }) => {
    const key = entityKey(entityType, entityId);

    set((state) => ({
      loadingByEntity: { ...state.loadingByEntity, [key]: true },
      errorByEntity: { ...state.errorByEntity, [key]: null },
    }));

    try {
      if (entityType !== "alojamiento") {
        throw new Error("Solo se admiten imágenes de alojamiento");
      }

      const result = await imagenesService.deleteAlojamiento(entityId, imageId);

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
