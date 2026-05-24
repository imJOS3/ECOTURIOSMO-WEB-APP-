import { create } from "zustand";
import { unidadesService } from "../services/unidades.service";

export const useUnidadesStore = create((set) => ({
  items: [],
  loading: false,
  error: null,
  fetchByAlojamiento: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await unidadesService.fetchAllByAlojamiento(id);
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      set({ items, loading: false });
      return items;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  fetchMine: async () => {
    set({ loading: true, error: null });
    try {
      const data = await unidadesService.fetchMine();
      const items = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      set({ items, loading: false });
      return items;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  createUnidad: async (data) => unidadesService.create(data),
  updateUnidad: async (id, data) => unidadesService.update(id, data),
  removeUnidad: async (id) => unidadesService.remove(id),
}));
