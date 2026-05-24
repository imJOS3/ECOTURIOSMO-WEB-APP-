import { create } from "zustand";
import { apiFetch } from "../utils/api";

const usePagosStore = create((set, get) => ({
  pagos: [],
  loading: false,
  error: null,

  fetchPagos: async (params) => {
    set({ loading: true, error: null });
    try {
      const d = await apiFetch('/pagos', { params });
      set({ pagos: Array.isArray(d) ? d : [] });
      return get().pagos;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  createPago: async (payload) => {
    set({ loading: true, error: null });
    try {
      const p = await apiFetch('/pagos', { method: 'POST', body: JSON.stringify(payload) });
      await get().fetchPagos();
      return p;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
}));

export default usePagosStore;
