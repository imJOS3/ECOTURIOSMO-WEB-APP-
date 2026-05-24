import { create } from "zustand";
import { apiFetch } from "../utils/api";

const useResenasStore = create((set, get) => ({
  resenas: [],
  loading: false,
  error: null,

  fetchResenas: async (params) => {
    set({ loading: true, error: null });
    try {
      const d = await apiFetch('/resenas', { params });
      set({ resenas: Array.isArray(d) ? d : [] });
      return get().resenas;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  fetchByAlojamiento: async (alojamientoId) => {
    set({ loading: true, error: null });
    try {
      const d = await apiFetch(`/resenas/alojamiento/${alojamientoId}`);
      const items = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
      set({ resenas: items, loading: false });
      return items;
    } catch (e) { set({ loading: false, error: e.message }); throw e; }
  },

  createResena: async (payload) => {
    set({ loading: true, error: null });
    try {
      const r = await apiFetch('/resenas', { method: 'POST', body: JSON.stringify(payload) });
      await get().fetchResenas();
      return r;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  deleteResena: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`/resenas/${id}`, { method: 'DELETE' });
      await get().fetchResenas();
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
}));

export default useResenasStore;
