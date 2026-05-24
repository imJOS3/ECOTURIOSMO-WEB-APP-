import { create } from "zustand";
import { apiFetch } from "../utils/api";

const useReservasStore = create((set, get) => ({
  reservas: [],
  mine: [],
  loading: false,
  error: null,

  fetchReservas: async (params) => {
    set({ loading: true, error: null });
    try {
      const d = await apiFetch('/reservas', { params });
      set({ reservas: Array.isArray(d) ? d : [] });
      return get().reservas;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  fetchAnfitrion: async () => {
    set({ loading: true, error: null });
    try {
      const d = await apiFetch('/reservas/anfitrion');
      const items = Array.isArray(d) ? d : [];
      set({ reservas: items, loading: false });
      return items;
    } catch (e) { set({ loading: false, error: e.message }); throw e; }
  },

  fetchMine: async () => {
    set({ loading: true, error: null });
    try {
      const d = await apiFetch('/reservas/mine');
      set({ mine: Array.isArray(d) ? d : [] });
      return get().mine;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  createReserva: async (payload) => {
    set({ loading: true, error: null });
    try {
      const r = await apiFetch('/reservas', { method: 'POST', body: JSON.stringify(payload) });
      await get().fetchMine();
      return r;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  cancelReserva: async (id) => {
    set({ loading: true, error: null });
    try {
      const r = await apiFetch(`/reservas/${id}`, { method: 'PUT', body: JSON.stringify({ estado: 'cancelada' }) });
      await get().fetchMine();
      return r;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
,

  updateReserva: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const r = await apiFetch(`/reservas/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      await get().fetchMine();
      return r;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
}));

export default useReservasStore;
