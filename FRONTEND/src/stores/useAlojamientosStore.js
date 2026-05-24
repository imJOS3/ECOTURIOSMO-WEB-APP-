import { create } from "zustand";
import { alojamientosService } from "../services/alojamientos.service";

export const useAlojamientosStore = create((set) => ({
  items: [],
  current: null,
  loading: false,
  error: null,
  fetchAlojamientos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await alojamientosService.fetchAll();
      const items = Array.isArray(data) ? data : [];
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
      const data = await alojamientosService.fetchMine();
      const items = Array.isArray(data) ? data : [];
      set({ items, loading: false });
      return items;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  createAlojamiento: async (data) => alojamientosService.create(data),
  updateAlojamiento: async (id, data) => alojamientosService.update(id, data),
  removeAlojamiento: async (id) => alojamientosService.remove(id),
  setCurrent: (current) => set({ current }),
}));
