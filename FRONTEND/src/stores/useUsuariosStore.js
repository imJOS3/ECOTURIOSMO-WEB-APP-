import { create } from "zustand";
import { apiFetch } from "../utils/api";

const useUsuariosStore = create((set, get) => ({
  usuarios: [],
  loading: false,
  error: null,

  fetchUsuarios: async () => {
    set({ loading: true, error: null });
    try {
      const d = await apiFetch('/usuarios');
      set({ usuarios: Array.isArray(d) ? d : [] });
      return get().usuarios;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  fetchUsuario: async (id) => {
    set({ loading: true, error: null });
    try {
      const u = await apiFetch(`/usuarios/${id}`);
      return u;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  createUsuario: async (payload) => {
    set({ loading: true, error: null });
    try {
      const u = await apiFetch('/usuarios', { method: 'POST', body: JSON.stringify(payload) });
      // refresh list
      await get().fetchUsuarios();
      return u;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  updateUsuario: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const u = await apiFetch(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      await get().fetchUsuarios();
      return u;
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  },

  deleteUsuario: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
      await get().fetchUsuarios();
    } catch (e) { set({ error: e.message }); throw e; }
    finally { set({ loading: false }); }
  }
}));

export default useUsuariosStore;
