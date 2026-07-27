import { create } from "zustand";
import { mensajesService } from "../services/mensajes.service";
import { sumUnread } from "../components/chat/chatHelpers";

const useMensajesStore = create((set, get) => ({
  conversaciones: [],
  activa: null,
  loading: false,
  error: null,
  drawerOpen: false,
  unreadTotal: 0,

  setDrawerOpen: (open) => set({ drawerOpen: Boolean(open) }),
  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),

  fetchConversaciones: async ({ silent = false } = {}) => {
    if (!silent) set({ loading: true, error: null });
    try {
      const data = await mensajesService.listMine();
      const items = Array.isArray(data) ? data : [];
      set({
        conversaciones: items,
        unreadTotal: sumUnread(items),
        loading: false,
      });
      return items;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  openConversacion: async (id) => {
    set({ error: null });
    try {
      const data = await mensajesService.getById(id);
      set({ activa: data });
      // refrescar contadores de no leídos sin spinner del inbox
      get().fetchConversaciones({ silent: true }).catch(() => {});
      return data;
    } catch (e) {
      set({ error: e.message });
      throw e;
    }
  },

  startConversacion: async (payload) => {
    set({ loading: true, error: null });
    try {
      const data = await mensajesService.openOrCreate(payload);
      set({ activa: data, loading: false, drawerOpen: true });
      await get().fetchConversaciones({ silent: true });
      return data;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  sendMensaje: async (cuerpo) => {
    const activa = get().activa;
    if (!activa?.id) throw new Error("No hay conversación activa");
    const msg = await mensajesService.send(activa.id, cuerpo);
    set({
      activa: {
        ...activa,
        mensajes: [...(activa.mensajes || []), msg],
        ultimo_mensaje: msg.cuerpo,
        ultimo_mensaje_at: msg.created_at,
      },
    });
    get().fetchConversaciones({ silent: true }).catch(() => {});
    return msg;
  },

  clearActiva: () => set({ activa: null }),

  reset: () =>
    set({
      conversaciones: [],
      activa: null,
      loading: false,
      error: null,
      drawerOpen: false,
      unreadTotal: 0,
    }),
}));

export default useMensajesStore;
