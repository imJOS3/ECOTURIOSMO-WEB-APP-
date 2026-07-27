import { create } from "zustand";
import { serviciosService } from "../services/servicios.service";

export const useServiciosStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  loaded: false,

  fetchServicios: async (force = false) => {
    if (get().loaded && !force) return get().items;

    set({ loading: true, error: null });
    try {
      const data = await serviciosService.fetchAll();
      const items = Array.isArray(data) ? data : [];
      set({ items, loading: false, error: null, loaded: true });
      return items;
    } catch (error) {
      set({ loading: false, error: error.message, loaded: false });
      throw error;
    }
  },

  createServicio: async (payload) => {
    const created = await serviciosService.create(payload);
    set({ loaded: false });
    return created;
  },

  updateServicio: async (id, payload) => {
    const updated = await serviciosService.update(id, payload);
    set({ loaded: false });
    return updated;
  },

  removeServicio: async (id) => {
    await serviciosService.remove(id);
    set({ loaded: false });
  },
}));
