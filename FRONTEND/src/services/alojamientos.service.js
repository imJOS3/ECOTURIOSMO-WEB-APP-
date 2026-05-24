import { apiFetch } from "../utils/api";

const buildPayload = (data) => JSON.stringify(data);

export const alojamientosService = {
  fetchAll: () => apiFetch("/alojamientos"),
  fetchMine: () => apiFetch("/alojamientos/mine"),
  fetchById: (id) => apiFetch(`/alojamientos/${id}`),
  create: (data) => apiFetch("/alojamientos", { method: "POST", body: buildPayload(data) }),
  update: (id, data) => apiFetch(`/alojamientos/${id}`, { method: "PUT", body: buildPayload(data) }),
  remove: (id) => apiFetch(`/alojamientos/${id}`, { method: "DELETE" }),
};
