import { apiFetch } from "../utils/api";

export const categoriasService = {
  fetchAll: async (tipo) => {
    const data = await apiFetch("/categorias", { params: tipo ? { tipo } : undefined });
    const items = Array.isArray(data) ? data : [];
    return tipo ? items.filter((categoria) => categoria.tipo === tipo) : items;
  },
  create: (data) => apiFetch("/categorias", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/categorias/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/categorias/${id}`, { method: "DELETE" }),
};
