import { create } from "zustand";
import { apiFetch } from "../utils/api";

const useModeracionStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async (tipo) => {
    set({ loading: true, error: null });
    try {
      const path = tipo ? `/admin/moderacion?tipo=${tipo}` : '/admin/moderacion';
      const d = await apiFetch(path);
      set({ items: Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [] });
      return get().items;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  updateItem: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const r = await apiFetch(`/moderacion/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      await get().fetchItems();
      return r;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
,

  moderate: async (tipo, id, action, motivo = "") => {
    set({ loading: true, error: null });
    try {
      const path = `/admin/moderacion/${tipo}/${id}/${action}`;
      await apiFetch(path, { method: 'POST', body: motivo ? JSON.stringify({ motivo }) : JSON.stringify({}) });
      await get().fetchItems(tipo);
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
}));

export default useModeracionStore;
