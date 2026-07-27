import { apiFetch } from "../utils/api";

export const serviciosService = {
  fetchAll: () => apiFetch("/servicios"),
  create: (data) => apiFetch("/servicios", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/servicios/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/servicios/${id}`, { method: "DELETE" }),
};
