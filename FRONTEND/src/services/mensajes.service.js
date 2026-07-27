import { apiFetch } from "../utils/api";

export const mensajesService = {
  listMine: () => apiFetch("/mensajes"),
  getById: (id) => apiFetch(`/mensajes/${id}`),
  openOrCreate: (payload) =>
    apiFetch("/mensajes", { method: "POST", body: JSON.stringify(payload) }),
  send: (id, cuerpo) =>
    apiFetch(`/mensajes/${id}/mensajes`, {
      method: "POST",
      body: JSON.stringify({ cuerpo }),
    }),
};
