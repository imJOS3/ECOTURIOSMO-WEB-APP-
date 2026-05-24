import { apiFetch } from "../utils/api";

const buildPayload = (data) => JSON.stringify(data);

export const unidadesService = {
  fetchAllByAlojamiento: (id) => apiFetch(`/unidades/alojamiento/${id}`),
  fetchMine: () => apiFetch("/unidades/mine"),
  fetchById: (id) => apiFetch(`/unidades/${id}`),
  create: (data) => apiFetch("/unidades", { method: "POST", body: buildPayload(data) }),
  update: (id, data) => apiFetch(`/unidades/${id}`, { method: "PUT", body: buildPayload(data) }),
  remove: (id) => apiFetch(`/unidades/${id}`, { method: "DELETE" }),
};
