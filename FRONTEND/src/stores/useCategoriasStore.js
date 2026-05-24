import { create } from "zustand";
import { categoriasService } from "../services/categorias.service";

const initialBucket = () => ({ items: [], loading: false, error: null, loaded: false });

export const useCategoriasStore = create((set, get) => ({
  porTipo: {
    alojamiento: initialBucket(),
    unidad: initialBucket(),
    todas: initialBucket(),
  },
  fetchCategorias: async (tipo = "todas", force = false) => {
    const bucket = get().porTipo[tipo] || initialBucket();
    if (bucket.loaded && !force) return bucket.items;

    set((state) => ({
      porTipo: {
        ...state.porTipo,
        [tipo]: { ...bucket, loading: true, error: null },
      },
    }));

    try {
      const data = await categoriasService.fetchAll(tipo === "todas" ? undefined : tipo);
      const items = Array.isArray(data) ? data : [];
      set((state) => ({
        porTipo: {
          ...state.porTipo,
          [tipo]: { items, loading: false, error: null, loaded: true },
        },
      }));
      return items;
    } catch (error) {
      set((state) => ({
        porTipo: {
          ...state.porTipo,
          [tipo]: { ...bucket, loading: false, error: error.message, loaded: false },
        },
      }));
      throw error;
    }
  },
  createCategoria: async (data) => {
    const created = await categoriasService.create(data);
    set((state) => ({
      porTipo: {
        ...state.porTipo,
        todas: { ...state.porTipo.todas, loaded: false },
        [data.tipo]: { ...state.porTipo[data.tipo], loaded: false },
      },
    }));
    return created;
  },
}));
